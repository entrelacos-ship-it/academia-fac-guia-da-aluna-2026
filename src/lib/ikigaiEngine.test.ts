import { describe, it, expect } from 'vitest'
import {
  diagnoseEmptyIntersections,
  countSentences,
  sanitizeTypography,
  generateCleanTextForAI,
  generateCommunityShareText,
  sanitizeIkigaiState,
  isContaminatedItem,
} from './ikigaiEngine'
import {
  FICTITIOUS_FACILITATOR_EXAMPLE,
  INITIAL_EMPTY_IKIGAI_STATE,
  CIRCLE_SUGGESTIONS,
} from '@/config/ikigaiContent'
import { STEPS_CONFIG } from '@/components/ikigai/IkigaiWorkflow'

describe('ikigaiEngine e Novo Fluxo dos 3 Momentos', () => {
  it('remove travessões longos garantindo regra de pontuação do app', () => {
    const raw = 'O propósito não é sacrifício — é serviço com sentido -- e dignidade.'
    const sanitized = sanitizeTypography(raw)
    expect(sanitized).not.toContain('—')
    expect(sanitized).not.toContain('--')
    expect(sanitized).toContain(', ')
  })

  it('define exatamente os 3 momentos no fluxo pedagógico da aluna (sem etapa de importação do Retrato)', () => {
    expect(STEPS_CONFIG.length).toBe(4) // 0: Boas-vindas, 1: Escrever, 2: Conectar, 3: Painel
    expect(STEPS_CONFIG[0].title).toBe('Boas-vindas')
    expect(STEPS_CONFIG[1].title).toContain('Escrever')
    expect(STEPS_CONFIG[2].title).toContain('Conectar')
    expect(STEPS_CONFIG[3].title).toContain('Painel')
    // Não pode haver etapa ou título citando Retrato de Autoria no fluxo do IKIGAI
    const hasRetratoStep = STEPS_CONFIG.some((s) => s.title.toLowerCase().includes('retrato'))
    expect(hasRetratoStep).toBe(false)
  })

  it('diagnostica vazios conforme PRD para "Paixão sem Profissão"', () => {
    const testState = JSON.parse(JSON.stringify(FICTITIOUS_FACILITATOR_EXAMPLE))
    // Mantém Paixão preenchida, mas esvazia Profissão
    testState.intersections.profession = { text: '', notFound: true }

    const diag = diagnoseEmptyIntersections(testState)
    expect(diag.emptyKeys).toContain('profession')
    expect(diag.combinationKey).toBe('passion_without_profession')
    expect(diag.primaryReflection.title).toBe('Paixão sem Profissão')
    expect(diag.primaryReflection.body).toContain(
      'Você ama e faz bem, mas ainda não é sustentada por isso',
    )
  })

  it('conta sentenças corretamente para a declaração de missão', () => {
    const oneSentence = 'Eu ajudo psicólogas a precificarem sua clínica com dignidade.'
    const twoSentences =
      'Eu ajudo psicólogas a precificarem sua clínica com dignidade. Faço isso através de método claro e acolhedor.'
    const threeSentences = 'Primeira frase. Segunda frase! Terceira frase?'

    expect(countSentences(oneSentence)).toBe(1)
    expect(countSentences(twoSentences)).toBe(2)
    expect(countSentences(threeSentences)).toBe(3)
  })

  it('gera texto limpo para IA e texto de comunidade preservando formato do painel', () => {
    const aiText = generateCleanTextForAI(FICTITIOUS_FACILITATOR_EXAMPLE)
    expect(aiText).toContain('PAINEL IKIGAI CLÍNICO')
    expect(aiText).toContain('DECLARAÇÃO DE MISSÃO')

    const commText = generateCommunityShareText(FICTITIOUS_FACILITATOR_EXAMPLE)
    expect(commText).toContain('Compartilhando meu IKIGAI')
    expect(commText).toContain('Minha Declaração de Missão')
  })

  it('descontamina itens do caso fictício da Marina e IDs ex-* com sanitizeIkigaiState', () => {
    // Caso exato relatado pela usuária com itens de teste da Marina
    const contaminatedState = {
      version: 1,
      activeStep: 1,
      circles: {
        love: [
          {
            id: 'item-1',
            text: 'Marina é psicóloga há seis anos. Atua principalmente numa plataforma e atende quatro pacientes particulares vindos de indicações. Está construindo o consultório.',
            starred: false,
            createdAt: '2026-03-01T10:00:00.000Z',
          },
          {
            id: 'item-2',
            text: 'Trava estrutural: dependência de receita associada a volume de atendimentos e regras externas.',
            starred: false,
            createdAt: '2026-03-01T10:00:00.000Z',
          },
          {
            id: 'item-legitimo',
            text: 'Atendimento clínico particular com acolhimento e escuta sensível',
            starred: true,
            createdAt: '2026-03-01T10:00:00.000Z',
          },
          {
            id: 'ex-l1',
            text: 'Item com ID de exemplo',
            starred: false,
            createdAt: '2026-03-01T10:00:00.000Z',
          },
        ],
        goodAt: [],
        worldNeeds: [],
        paidFor: [],
      },
      intersections: {
        passion: { text: '', notFound: false },
        mission: { text: '', notFound: false },
        vocation: { text: '', notFound: false },
        profession: { text: '', notFound: false },
      },
      missionStatement: '',
      missionHistory: [],
      updatedAt: '2026-03-01T10:00:00.000Z',
    }

    const { sanitizedState, wasSanitized, removedCount } = sanitizeIkigaiState(contaminatedState)

    expect(wasSanitized).toBe(true)
    expect(removedCount).toBe(3) // Removeu Marina, Trava estrutural e ex-l1
    expect(sanitizedState.circles.love).toHaveLength(1)
    expect(sanitizedState.circles.love[0].text).toBe(
      'Atendimento clínico particular com acolhimento e escuta sensível',
    )
    expect(isContaminatedItem(contaminatedState.circles.love[0])).toBe(true)
    expect(isContaminatedItem(contaminatedState.circles.love[1])).toBe(true)
    expect(isContaminatedItem(contaminatedState.circles.love[2])).toBe(false)
    expect(isContaminatedItem(contaminatedState.circles.love[3])).toBe(true)
  })

  it('possui 5 sugestões específicas e válidas para cada um dos 4 círculos em CIRCLE_SUGGESTIONS', () => {
    const circles = ['love', 'goodAt', 'worldNeeds', 'paidFor'] as const
    circles.forEach((circleId) => {
      const suggestions = CIRCLE_SUGGESTIONS[circleId]
      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions).toHaveLength(5)
      suggestions.forEach((s) => {
        expect(typeof s).toBe('string')
        expect(s.trim().length).toBeGreaterThan(10)
      })
    })

    // Checagem de itens canônicos solicitados no enunciado
    expect(CIRCLE_SUGGESTIONS.love).toContain('Escuta profunda de mulheres em transição de vida')
    expect(CIRCLE_SUGGESTIONS.goodAt).toContain('Síntese clínica e devoluções sem jargões técnicos')
    expect(CIRCLE_SUGGESTIONS.worldNeeds).toContain(
      'Acolhimento da sobrecarga invisível do cuidado feminino',
    )
    expect(CIRCLE_SUGGESTIONS.paidFor).toContain(
      'Sessão individual particular com contrato transparente',
    )
  })
})
