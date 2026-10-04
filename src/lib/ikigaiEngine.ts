import {
  CircleId,
  IntersectionId,
  CircleItem,
  IkigaiState,
  EmptyIntersectionsDiagnostic,
} from '@/types/ikigai'
import {
  CIRCLE_DEFINITIONS,
  INTERSECTION_DEFINITIONS,
  EMPTY_COMBINATIONS_TEXTS,
  DISCUSSION_QUESTIONS_SUGGESTIONS,
  COMMUNITY_SHARE_TEMPLATE,
  INITIAL_EMPTY_IKIGAI_STATE,
  IKIGAI_WARNING_NOTE,
  IKIGAI_ETHICAL_REMINDER,
} from '@/config/ikigaiContent'

/**
 * Remove qualquer caractere de travessão longo (— ou --) e substitui por vírgula ou hífen simples
 */
export function sanitizeTypography(text: string): string {
  if (!text) return ''
  return text.replace(/[—–]/g, ', ').replace(/--+/g, ', ')
}

/**
 * Parser inteligente da lista "Matéria-prima para o seu painel IKIGAI" do Retrato de Autoria.
 * Tenta separar por seções/títulos dos 4 círculos.
 * Se não encontrar os círculos, retorna as linhas limpas na bandeja (tray).
 */
export interface ParseRetratoResult {
  success: boolean
  matchedBySection: boolean
  circles: {
    love: string[]
    goodAt: string[]
    worldNeeds: string[]
    paidFor: string[]
  }
  tray: string[]
  totalItems: number
}

export function parseRetratoDeAutoriaText(rawText: string): ParseRetratoResult {
  const result: ParseRetratoResult = {
    success: false,
    matchedBySection: false,
    circles: {
      love: [],
      goodAt: [],
      worldNeeds: [],
      paidFor: [],
    },
    tray: [],
    totalItems: 0,
  }

  if (!rawText || !rawText.trim()) {
    return result
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return result

  let currentCircle: CircleId | null = null
  let detectedSectionsCount = 0

  const cleanBullet = (line: string): string => {
    return line
      .replace(/^([*•\-–—]|\d+[.)])\s*/, '')
      .replace(/^[«"']|[»"']$/g, '')
      .trim()
  }

  const isSectionHeader = (line: string): CircleId | null => {
    const lower = line.toLowerCase()
    // Círculo 1: Amo
    if (
      (lower.includes('círculo 1') ||
        lower.includes('circulo 1') ||
        lower.includes('o que eu amo') ||
        lower.includes('o que amo')) &&
      !lower.startsWith('-') &&
      !lower.startsWith('•')
    ) {
      return 'love'
    }
    // Círculo 2: Sou boa
    if (
      (lower.includes('círculo 2') ||
        lower.includes('circulo 2') ||
        lower.includes('no que sou boa') ||
        lower.includes('sou boa')) &&
      !lower.startsWith('-') &&
      !lower.startsWith('•')
    ) {
      return 'goodAt'
    }
    // Círculo 3: Mundo precisa
    if (
      (lower.includes('círculo 3') ||
        lower.includes('circulo 3') ||
        lower.includes('mundo precisa') ||
        lower.includes('do que o mundo')) &&
      !lower.startsWith('-') &&
      !lower.startsWith('•')
    ) {
      return 'worldNeeds'
    }
    // Círculo 4: Remunerada
    if (
      (lower.includes('círculo 4') ||
        lower.includes('circulo 4') ||
        lower.includes('remunera') ||
        lower.includes('posso ser paga') ||
        lower.includes('ser paga')) &&
      !lower.startsWith('-') &&
      !lower.startsWith('•')
    ) {
      return 'paidFor'
    }
    return null
  }

  for (const line of lines) {
    const detected = isSectionHeader(line)
    if (detected) {
      currentCircle = detected
      detectedSectionsCount++
      continue
    }

    const itemText = cleanBullet(line)
    // Descartar linhas de cabeçalho geral tipo "Matéria-prima para o seu painel IKIGAI"
    if (
      itemText.toLowerCase().includes('matéria-prima') ||
      itemText.toLowerCase().includes('materia-prima') ||
      itemText.toLowerCase().includes('retrato de autoria')
    ) {
      continue
    }

    if (itemText.length > 2) {
      if (currentCircle) {
        result.circles[currentCircle].push(itemText)
      } else {
        result.tray.push(itemText)
      }
    }
  }

  const itemsInCircles =
    result.circles.love.length +
    result.circles.goodAt.length +
    result.circles.worldNeeds.length +
    result.circles.paidFor.length

  result.totalItems = itemsInCircles + result.tray.length

  // Se detectou pelo menos 2 seções dos círculos e encontrou itens nelas
  if (detectedSectionsCount >= 2 && itemsInCircles > 0) {
    result.matchedBySection = true
    result.success = true
  } else {
    // Se não conseguiu separar por títulos, coloca todos os itens válidos na bandeja
    result.matchedBySection = false
    result.tray = [
      ...result.tray,
      ...result.circles.love,
      ...result.circles.goodAt,
      ...result.circles.worldNeeds,
      ...result.circles.paidFor,
    ]
    result.circles = { love: [], goodAt: [], worldNeeds: [], paidFor: [] }
    result.success = result.tray.length > 0
  }

  return result
}

/**
 * Motor heurístico de diagnóstico dos vazios e reflexão do IKIGAI (sem IA, regras claras e transparentes)
 */
export function diagnoseEmptyIntersections(state: IkigaiState): EmptyIntersectionsDiagnostic {
  const circleCounts: Record<CircleId, number> = {
    love: state.circles.love.length,
    goodAt: state.circles.goodAt.length,
    worldNeeds: state.circles.worldNeeds.length,
    paidFor: state.circles.paidFor.length,
  }

  // Identificar círculo dominante e mais enxuto
  const circleEntries = Object.entries(circleCounts) as [CircleId, number][]
  circleEntries.sort((a, b) => b[1] - a[1])
  const dominantCircle = circleEntries[0][1] > 0 ? circleEntries[0][0] : null
  const leanestCircle =
    circleEntries[circleEntries.length - 1][1] >= 0
      ? circleEntries[circleEntries.length - 1][0]
      : null

  // Identificar encontros vazios
  const emptyKeys: IntersectionId[] = []
  const intersectionKeys: IntersectionId[] = ['passion', 'mission', 'vocation', 'profession']

  for (const key of intersectionKeys) {
    const item = state.intersections[key]
    const isEmpty = item.notFound || !item.text || !item.text.trim()
    if (isEmpty) {
      emptyKeys.push(key)
    }
  }

  const hasAnyEmpty = emptyKeys.length > 0

  // Combinações notáveis solicitadas pelo PRD
  let combinationKey = 'partial_default'

  const hasPassion = !emptyKeys.includes('passion')
  const hasMission = !emptyKeys.includes('mission')
  const hasVocation = !emptyKeys.includes('vocation')
  const hasProfession = !emptyKeys.includes('profession')

  if (emptyKeys.length === 0) {
    combinationKey = 'all_filled'
  } else if (emptyKeys.length === 4) {
    combinationKey = 'all_empty'
  } else if (hasPassion && !hasProfession) {
    // Paixão sem Profissão
    combinationKey = 'passion_without_profession'
  } else if (hasProfession && !hasMission) {
    // Profissão sem Missão
    combinationKey = 'profession_without_mission'
  } else if (hasVocation && !hasPassion) {
    // Vocação sem Paixão
    combinationKey = 'vocation_without_passion'
  } else if (hasMission && !hasVocation) {
    // Missão sem Vocação
    combinationKey = 'mission_without_vocation'
  } else if (!hasPassion && !hasMission && (hasProfession || hasVocation)) {
    combinationKey = 'passion_and_mission_empty'
  } else if (!hasVocation && !hasProfession && (hasPassion || hasMission)) {
    combinationKey = 'vocation_and_profession_empty'
  }

  const primaryReflection =
    EMPTY_COMBINATIONS_TEXTS[combinationKey] || EMPTY_COMBINATIONS_TEXTS.partial_default

  // Detalhamento de cards individuais por vazio detectado
  const reflectionCards: EmptyIntersectionsDiagnostic['reflectionCards'] = []

  if (emptyKeys.includes('passion')) {
    reflectionCards.push({
      id: 'empty-passion',
      title: 'Encontro vazio: Paixão (O que amo + No que sou boa)',
      body: 'Quando a paixão fica em branco, o trabalho corre o risco de virar automatismo e cumprimento de obrigação. Vale resgatar quais temas despertam sua curiosidade genuína.',
      kind: 'warning',
    })
  }

  if (emptyKeys.includes('mission')) {
    reflectionCards.push({
      id: 'empty-mission',
      title: 'Encontro vazio: Missão (O que amo + Do que o mundo precisa)',
      body: 'Sem conectar seu afeto com uma dor social concreta, o consultório pode parecer isolado do mundo. A missão traz o senso de relevância histórica à sua escuta.',
      kind: 'warning',
    })
  }

  if (emptyKeys.includes('vocation')) {
    reflectionCards.push({
      id: 'empty-vocation',
      title: 'Encontro vazio: Vocação (Do que o mundo precisa + Pelo que sou paga)',
      body: 'Se o mundo tem uma dor mas você não formatou um serviço pago para atendê-la, seu saber fica represado ou cai na armadilha do assistencialismo não sustentável.',
      kind: 'warning',
    })
  }

  if (emptyKeys.includes('profession')) {
    reflectionCards.push({
      id: 'empty-profession',
      title: 'Encontro vazio: Profissão (No que sou boa + Pelo que sou paga)',
      body: 'Cobrar com firmeza exige reconhecer que competência técnica vale honorários justos. Psicologia não é sacerdócio, é prestação de serviço com valor real.',
      kind: 'warning',
    })
  }

  // Se todos estiverem preenchidos, gera card de celebração
  if (emptyKeys.length === 0) {
    reflectionCards.push({
      id: 'all-present',
      title: 'Os quatro encontros possuem contornos definidos',
      body: 'Você conseguiu desenhar pontes entre afeto, domínio, causa e sustento. Isso dá consistência para sustentar contratos firmes e presença autêntica.',
      kind: 'encouragement',
    })
  }

  return {
    hasAnyEmpty,
    emptyKeys,
    combinationKey,
    dominantCircle,
    leanestCircle,
    circleCounts,
    primaryReflection,
    reflectionCards,
    discussionQuestions: DISCUSSION_QUESTIONS_SUGGESTIONS,
  }
}

/**
 * Conta o número aproximado de frases em uma declaração de missão
 */
export function countSentences(text: string): number {
  if (!text || !text.trim()) return 0
  const normalized = text.trim()
  const parts = normalized
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  return parts.length
}

/**
 * Gera bloco de texto limpo para colar nos agentes da Academia (IA)
 */
export function generateCleanTextForAI(state: IkigaiState): string {
  const diag = diagnoseEmptyIntersections(state)

  const formatCircle = (id: CircleId) => {
    const def = CIRCLE_DEFINITIONS[id]
    const items = state.circles[id]
    if (items.length === 0) return '  (nenhum item cadastrado)'
    return items.map((it) => `  - ${it.starred ? '[★ Central] ' : ''}${it.text}`).join('\n')
  }

  const formatIntersection = (id: IntersectionId) => {
    const def = INTERSECTION_DEFINITIONS[id]
    const inter = state.intersections[id]
    if (inter.notFound) return `  ${def.name}: [Ainda não encontrei esse encontro]`
    if (!inter.text || !inter.text.trim()) return `  ${def.name}: (em aberto)`
    return `  ${def.name}: "${inter.text.trim()}"`
  }

  return `# PAINEL IKIGAI CLÍNICO · ACADEMIA MÉTODO FAC
Psicóloga Autora · Entrelaços Psicologia
${IKIGAI_WARNING_NOTE}
${IKIGAI_ETHICAL_REMINDER}

---
## 1. OS QUATRO CÍRCULOS

### Círculo 1 · O que eu amo fazer (${state.circles.love.length} itens)
${formatCircle('love')}

### Círculo 2 · No que eu sou boa (${state.circles.goodAt.length} itens)
${formatCircle('goodAt')}

### Círculo 3 · Do que o mundo precisa (${state.circles.worldNeeds.length} itens)
${formatCircle('worldNeeds')}

### Círculo 4 · Pelo que posso ser remunerada com dignidade (${state.circles.paidFor.length} itens)
${formatCircle('paidFor')}

---
## 2. AS QUATRO INTERSEÇÕES (ENCONTROS)
${formatIntersection('passion')}
${formatIntersection('mission')}
${formatIntersection('vocation')}
${formatIntersection('profession')}

---
## 3. DECLARAÇÃO DE MISSÃO
"${state.missionStatement?.trim() || 'Ainda não definida'}"

---
## 4. LEITURA SÍNTESE DO PAINEL
- Círculo com mais itens: ${diag.dominantCircle ? CIRCLE_DEFINITIONS[diag.dominantCircle].title : 'Equilibrado'} (${diag.dominantCircle ? diag.circleCounts[diag.dominantCircle] : 0} itens)
- Círculo mais enxuto: ${diag.leanestCircle ? CIRCLE_DEFINITIONS[diag.leanestCircle].title : 'Equilibrado'} (${diag.leanestCircle ? diag.circleCounts[diag.leanestCircle] : 0} itens)
- Encontros em aberto: ${diag.emptyKeys.length > 0 ? diag.emptyKeys.map((k) => INTERSECTION_DEFINITIONS[k].name).join(', ') : 'Nenhum, todos os 4 encontros possuem frase'}
- Diagnóstico: ${diag.primaryReflection.title}
  "${diag.primaryReflection.body}"
  ${diag.primaryReflection.guidance}

---
Bloco gerado pela ferramenta do Encontro 2 da Academia Método FAC. Pronto para contextualização de agentes de IA.`
}

/**
 * Gera texto curto e pronto para compartilhamento na comunidade
 */
export function generateCommunityShareText(state: IkigaiState): string {
  const diag = diagnoseEmptyIntersections(state)
  let observation = ''

  if (diag.leanestCircle) {
    const leanTitle = CIRCLE_DEFINITIONS[diag.leanestCircle].title
    const leanCount = diag.circleCounts[diag.leanestCircle]
    observation = `Meu círculo com menos itens no momento é "${leanTitle}" (${leanCount} itens), mostrando onde preciso colocar mais atenção e acolhimento.`
  } else {
    observation = 'Painel com distribuição harmoniosa entre os quatro círculos da prática clínica.'
  }

  return COMMUNITY_SHARE_TEMPLATE(state.missionStatement?.trim() || '', observation)
}

/**
 * Padrões de texto ou frases típicas de contaminação do exemplo fictício ou matérias-primas de teste da Marina
 */
const CONTAMINATED_PHRASES = [
  'marina',
  'marina é psicóloga',
  'marina e psicóloga',
  'construindo o consultório',
  'trava estrutural:',
  'trava estrutural',
  'dependência de receita associada a volume de atendimentos',
]

/**
 * IDs conhecidos dos itens do exemplo fictício
 */
const FICTITIOUS_ITEM_ID_REGEX = /^ex-[lgwp]\d+$/i

/**
 * Verifica se um texto ou ID pertence ao bloco de exemplo contaminado da Marina
 */
export function isContaminatedItem(item: { id?: string; text?: string }): boolean {
  if (!item) return false
  if (item.id && (FICTITIOUS_ITEM_ID_REGEX.test(item.id) || item.id.startsWith('pres-'))) {
    return true
  }
  if (item.text) {
    const lower = item.text.toLowerCase()
    return CONTAMINATED_PHRASES.some((phrase) => lower.includes(phrase))
  }
  return false
}

export interface SanitizeResult {
  sanitizedState: IkigaiState
  wasSanitized: boolean
  removedCount: number
}

/**
 * Função de descontaminação do estado IKIGAI:
 * Descarta itens cujo texto menciona "Marina" (case-insensitive) ou contém frases
 * típicas do bloco de contexto de exemplo ("Trava estrutural:", "Marina é psicóloga",
 * "construindo o consultório") ou cujos IDs correspondam aos itens fictícios (ex-l1, ex-l2 etc.).
 */
export function sanitizeIkigaiState(rawState: unknown): SanitizeResult {
  if (!rawState || typeof rawState !== 'object') {
    return {
      sanitizedState: INITIAL_EMPTY_IKIGAI_STATE,
      wasSanitized: false,
      removedCount: 0,
    }
  }

  const candidate = rawState as Partial<IkigaiState>
  const circles = candidate.circles || {
    love: [],
    goodAt: [],
    worldNeeds: [],
    paidFor: [],
  }

  let removedCount = 0

  const sanitizeList = (list: unknown[]): CircleItem[] => {
    if (!Array.isArray(list)) return []
    return list.filter((item): item is CircleItem => {
      if (!item || typeof item !== 'object') {
        removedCount++
        return false
      }
      const candidateItem = item as Partial<CircleItem>
      if (typeof candidateItem.id !== 'string' || typeof candidateItem.text !== 'string') {
        removedCount++
        return false
      }
      const isBad = isContaminatedItem({ id: candidateItem.id, text: candidateItem.text })
      if (isBad) {
        removedCount++
        return false
      }
      return true
    })
  }

  const cleanedLove = sanitizeList(circles.love as unknown[])
  const cleanedGoodAt = sanitizeList(circles.goodAt as unknown[])
  const cleanedWorldNeeds = sanitizeList(circles.worldNeeds as unknown[])
  const cleanedPaidFor = sanitizeList(circles.paidFor as unknown[])

  // Também verifica se missionStatement ou missionHistory foram contaminados por frases da Marina
  let cleanedMissionStatement = candidate.missionStatement || ''
  if (
    cleanedMissionStatement &&
    CONTAMINATED_PHRASES.some((p) => cleanedMissionStatement.toLowerCase().includes(p))
  ) {
    cleanedMissionStatement = ''
    removedCount++
  }

  const cleanedHistory = Array.isArray(candidate.missionHistory)
    ? candidate.missionHistory.filter((entry) => {
        if (!entry || typeof entry !== 'object') return false
        const lower = (entry.text || '').toLowerCase()
        const isBad = CONTAMINATED_PHRASES.some((p) => lower.includes(p))
        if (isBad) removedCount++
        return !isBad
      })
    : []

  // Sanitiza bandeja legada se existir
  const cleanedTray = Array.isArray(candidate.rawRetratoTray)
    ? candidate.rawRetratoTray.filter((line) => {
        if (typeof line !== 'string') return false
        const lower = line.toLowerCase()
        const isBad = CONTAMINATED_PHRASES.some((p) => lower.includes(p))
        if (isBad) removedCount++
        return !isBad
      })
    : []

  const wasSanitized = removedCount > 0

  const sanitizedState: IkigaiState = {
    version: 1,
    activeStep: typeof candidate.activeStep === 'number' ? candidate.activeStep : 0,
    circles: {
      love: cleanedLove,
      goodAt: cleanedGoodAt,
      worldNeeds: cleanedWorldNeeds,
      paidFor: cleanedPaidFor,
    },
    intersections: candidate.intersections || {
      passion: { text: '', notFound: false },
      mission: { text: '', notFound: false },
      vocation: { text: '', notFound: false },
      profession: { text: '', notFound: false },
    },
    missionStatement: cleanedMissionStatement,
    missionHistory: cleanedHistory,
    rawRetratoTray: cleanedTray,
    updatedAt: candidate.updatedAt || new Date().toISOString(),
  }

  return {
    sanitizedState,
    wasSanitized,
    removedCount,
  }
}
