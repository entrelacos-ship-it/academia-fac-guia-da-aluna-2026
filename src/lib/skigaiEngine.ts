import {
  Escala0a3,
  NecessidadeItem,
  FonteItem,
  CalculoNecessidadeMetricas,
  SkigaiCalculoResultado,
  SkigaiDataModel,
} from '@/types/skigai'

export const NECESSIDADES_DEFINICOES = [
  { id: 1, nome: 'Satisfação com a vida', abreviacao: 'Satisfação' },
  { id: 2, nome: 'Mudança e crescimento', abreviacao: 'Crescimento' },
  { id: 3, nome: 'Futuro', abreviacao: 'Futuro' },
  { id: 4, nome: 'Ressonância', abreviacao: 'Ressonância' },
  { id: 5, nome: 'Liberdade', abreviacao: 'Liberdade' },
  { id: 6, nome: 'Autorrealização', abreviacao: 'Autorrealização' },
  { id: 7, nome: 'Significado e valor', abreviacao: 'Significado' },
] as const

export const PILARES_MOGI_DEFINICOES = [
  {
    id: 1,
    nome: 'Começar pequeno',
    pergunta: 'Você tem espaço para dar passos modestos e sustentáveis sem exigir tudo de uma vez?',
  },
  {
    id: 2,
    nome: 'Libertar-se',
    pergunta:
      'O quanto você consegue soltar expectativas rígidas ou cobranças externas sobre quem deveria ser?',
  },
  {
    id: 3,
    nome: 'Harmonia e sustentabilidade',
    pergunta: 'Sua rotina conversa com o ambiente ao redor, suas relações e seu ritmo físico?',
  },
  {
    id: 4,
    nome: 'Alegria nas pequenas coisas',
    pergunta: 'Há gestos simples no seu dia clínico que trazem calor e presença?',
  },
  {
    id: 5,
    nome: 'Estar no aqui e agora',
    pergunta: 'Durante os atendimentos e estudos, você consegue habitar o momento presente?',
  },
] as const

/**
 * Lacuna = I * (3 - N), faixa 0 a 9
 * baixa 0 a 2, média 3 a 5, alta 6 a 9
 */
export function calcularLacuna(nutricao: number, importancia: number): number {
  const n = clampEscala(nutricao)
  const i = clampEscala(importancia)
  return i * (3 - n)
}

export function classificarFaixaLacuna(lacuna: number): 'baixa' | 'media' | 'alta' {
  if (lacuna <= 2) return 'baixa'
  if (lacuna <= 5) return 'media'
  return 'alta'
}

/**
 * Alavanca = (Int + H) / 2, uma casa decimal, 0 a 3
 */
export function calcularAlavanca(interesse: number, habilidade: number): number {
  const intVal = clampEscala(interesse)
  const hVal = clampEscala(habilidade)
  const raw = (intVal + hVal) / 2
  return Math.round(raw * 10) / 10
}

/**
 * Força = N * I, 0 a 9
 */
export function calcularForca(nutricao: number, importancia: number): number {
  const n = clampEscala(nutricao)
  const i = clampEscala(importancia)
  return n * i
}

export function clampEscala(val: number): number {
  if (typeof val !== 'number' || isNaN(val)) return 0
  const rounded = Math.round(val)
  if (rounded < 0) return 0
  if (rounded > 3) return 3
  return rounded
}

/**
 * Calcula todas as métricas por necessidade e agrega Recursos, Prioridades e Cuidados
 */
export function calcularMetricasSkigai(necessidades: NecessidadeItem[]): {
  metricas: CalculoNecessidadeMetricas[]
  recursos: CalculoNecessidadeMetricas[]
  prioridades: CalculoNecessidadeMetricas[]
  cuidadoGatilho: boolean
  cuidadoTotalGatilho: boolean
} {
  const metricas: CalculoNecessidadeMetricas[] = necessidades.map((item, idx) => {
    const n = clampEscala(item.nutricao)
    const i = clampEscala(item.importancia)
    const intVal = clampEscala(item.interesse)
    const h = clampEscala(item.habilidade)

    const lacuna = calcularLacuna(n, i)
    const alavanca = calcularAlavanca(intVal, h)
    const forca = calcularForca(n, i)

    const def = NECESSIDADES_DEFINICOES[idx] || {
      id: item.id || idx + 1,
      nome: item.nome,
      abreviacao: item.abreviacao || item.nome,
    }

    return {
      id: def.id,
      nome: item.nome || def.nome,
      abreviacao: item.abreviacao || def.abreviacao,
      nutricao: n,
      importancia: i,
      interesse: intVal,
      habilidade: h,
      lacuna,
      alavanca,
      forca,
      faixaLacuna: classificarFaixaLacuna(lacuna),
      reflexao: item.reflexao,
    }
  })

  // Recursos: 2 maiores forças entre as com N >= 2; desempate maior I, depois ordem da lista (índice menor)
  const candidatosRecursos = metricas.filter((m) => m.nutricao >= 2)
  const recursosOrdenados = [...candidatosRecursos].sort((a, b) => {
    if (b.forca !== a.forca) return b.forca - a.forca
    if (b.importancia !== a.importancia) return b.importancia - a.importancia
    return a.id - b.id // preserva ordem estável da lista
  })
  const recursos = recursosOrdenados.slice(0, 2)

  // Prioridades: até 3 maiores lacunas entre as com lacuna >= 3; desempate maior alavanca, depois maior I, depois ordem da lista
  const candidatosPrioridades = metricas.filter((m) => m.lacuna >= 3)
  const prioridadesOrdenadas = [...candidatosPrioridades].sort((a, b) => {
    if (b.lacuna !== a.lacuna) return b.lacuna - a.lacuna
    if (b.alavanca !== a.alavanca) return b.alavanca - a.alavanca
    if (b.importancia !== a.importancia) return b.importancia - a.importancia
    return a.id - b.id // preserva ordem estável da lista
  })
  const prioridades = prioridadesOrdenadas.slice(0, 3)

  // Cuidado: N <= 1 em Ressonância (id 4) e em Liberdade (id 5)
  const ressonancia = metricas.find((m) => m.id === 4)
  const liberdade = metricas.find((m) => m.id === 5)
  const cuidadoGatilho =
    !!ressonancia && !!liberdade && ressonancia.nutricao <= 1 && liberdade.nutricao <= 1

  // Cuidado total: as 7 nutrições em 0 ou 1
  const cuidadoTotalGatilho = metricas.length === 7 && metricas.every((m) => m.nutricao <= 1)

  return {
    metricas,
    recursos,
    prioridades,
    cuidadoGatilho,
    cuidadoTotalGatilho,
  }
}

/**
 * Concentração = maior rendimento / soma dos rendimentos, 0 a 100%
 * Fragilidade média = Σ(rendimento * fragilidade) / Σ(rendimento), 0 a 3
 * Necessidade sem fonte: nenhuma fonte com alimenta[k] >= 2
 */
export function calcularMetricasFontes(fontes: FonteItem[]): {
  concentracao: number | null
  fragilidadeMedia: number | null
  necessidadesSemFonte: number[]
} {
  if (!fontes || fontes.length === 0) {
    return {
      concentracao: null,
      fragilidadeMedia: null,
      necessidadesSemFonte: [1, 2, 3, 4, 5, 6, 7],
    }
  }

  const somaRendimentos = fontes.reduce((acc, f) => acc + (f.rendimento || 0), 0)

  let concentracao: number | null = null
  let fragilidadeMedia: number | null = null

  if (somaRendimentos > 0) {
    const maiorRendimento = Math.max(...fontes.map((f) => f.rendimento || 0))
    concentracao = Math.round((maiorRendimento / somaRendimentos) * 100)

    const somaPonderadaFragilidade = fontes.reduce(
      (acc, f) => acc + (f.rendimento || 0) * (f.fragilidade || 0),
      0,
    )
    const mediaPura = somaPonderadaFragilidade / somaRendimentos
    fragilidadeMedia = Math.round(mediaPura * 10) / 10
  }

  // Necessidade sem fonte: nenhuma fonte com alimenta[k] >= 2
  const necessidadesSemFonte: number[] = []
  for (let k = 0; k < 7; k++) {
    const temAlimentacao = fontes.some((f) => {
      const valor = f.alimenta && f.alimenta[k] !== undefined ? f.alimenta[k] : 0
      return valor >= 2
    })
    if (!temAlimentacao) {
      necessidadesSemFonte.push(k + 1)
    }
  }

  return {
    concentracao,
    fragilidadeMedia,
    necessidadesSemFonte,
  }
}

/**
 * Executa todos os cálculos integrados do modelo Skigai
 */
export function processarCalculoSkigaiCompleto(modelo: SkigaiDataModel): SkigaiCalculoResultado {
  const { metricas, recursos, prioridades, cuidadoGatilho, cuidadoTotalGatilho } =
    calcularMetricasSkigai(modelo.necessidades || [])

  const { concentracao, fragilidadeMedia, necessidadesSemFonte } = calcularMetricasFontes(
    modelo.fontes || [],
  )

  return {
    metricasPorNecessidade: metricas,
    recursos,
    prioridades,
    cuidadoGatilho,
    cuidadoTotalGatilho,
    concentracaoFontes: concentracao,
    fragilidadeMediaFontes: fragilidadeMedia,
    necessidadesSemFonte,
  }
}

/**
 * Gera as 5 linhas do resumo por REGRAS determinísticas (não por IA)
 */
export function gerarResumoPorRegras(
  modelo: SkigaiDataModel,
  resultado: SkigaiCalculoResultado,
): [string, string, string, string, string] {
  // Linha 1: O que está vivo (recursos ou aviso acolhedor)
  let linha1 = ''
  if (resultado.recursos.length > 0) {
    const nomes = resultado.recursos.map((r) => r.nome).join(' e ')
    linha1 = `O que está vivo no seu trabalho hoje: suas maiores forças são ${nomes}.`
  } else {
    linha1 =
      'Hoje nenhuma necessidade está bem nutrida. Isso pede cuidado com seu momento, não é falha sua.'
  }

  // Linha 2: O que pede cuidado (prioridades ou ausência de lacunas)
  let linha2 = ''
  if (resultado.prioridades.length > 0) {
    const detalhes = resultado.prioridades
      .map((p) => `${p.nome} (lacuna ${p.lacuna}, alavanca ${p.alavanca})`)
      .join(', ')
    linha2 = `Onde pede cuidado com prioridade: ${detalhes}.`
  } else {
    linha2 = 'Nada pede movimento urgente agora. O momento favorece sustentar o que já nutre.'
  }

  // Linha 3: O que é estrutura (fora do controle) contra o que pode mexer
  let linha3 = ''
  const foraControle = modelo.estrutura?.fora_do_meu_controle || []
  const possoMexer = modelo.estrutura?.posso_mexer || []
  if (foraControle.length > 0 || possoMexer.length > 0) {
    const parteFora =
      foraControle.length > 0
        ? `${foraControle.length} fatores estruturais`
        : 'nenhum fator externo'
    const parteMexer =
      possoMexer.length > 0 ? `${possoMexer.length} pontos de autonomia` : 'ações a definir'
    linha3 = `Estrutura e escolha: você mapeou ${parteFora} fora do seu controle e ${parteMexer} onde pode agir.`
  } else {
    linha3 =
      'Estrutura e escolha: lembre-se de que notas baixas muitas vezes refletem pressões do sistema, não falha pessoal.'
  }

  // Linha 4: A próxima ação do plano de 4 semanas
  let linha4 = ''
  const primeiraAcao = modelo.plano?.[0]
  if (primeiraAcao && primeiraAcao.acao?.trim()) {
    linha4 = `Próxima micro-ação: ${primeiraAcao.acao.trim()} (${primeiraAcao.dia || 'Semana 1'}).`
  } else {
    linha4 =
      'Próxima micro-ação: escolha um passo pequeno de até 30 minutos que caiba nesta semana.'
  }

  // Linha 5: A frase de direção
  let linha5 = ''
  const escolhidaTipo = modelo.frases?.escolhida || 'autoral'
  const fraseObj = modelo.frases?.direcao?.find((f) => f.versao === escolhidaTipo)
  const textoFrase = fraseObj?.texto?.trim() || modelo.frases?.sintese?.trim()
  if (textoFrase) {
    linha5 = `Bússola de direção (${escolhidaTipo}): "${textoFrase}".`
  } else {
    linha5 = 'A frase de hoje é a de hoje. Ela não é definitiva, serve como bússola interna.'
  }

  return [linha1, linha2, linha3, linha4, linha5]
}
