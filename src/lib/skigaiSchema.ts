import {
  SkigaiDataModel,
  NecessidadeItem,
  FonteItem,
  PilarKenMogiItem,
  MicroAcaoPlano,
} from '@/types/skigai'
import { NECESSIDADES_DEFINICOES, PILARES_MOGI_DEFINICOES } from './skigaiEngine'

/**
 * Regras de Linguagem Dura do PRD:
 * - Português do Brasil, caloroso e preciso
 * - NUNCA usar travessão (—, –, - duplo) em nenhum texto visível
 * - NUNCA usar as palavras proibidas: "descubra", "incrível", "transformador", "jornada", "colapso", "burnout"
 *   (preferir "desgaste" e "esgotamento")
 * - Sem urgência e sem promessa de resultado
 */
export const PALAVRAS_PROIBIDAS = [
  'descubra',
  'incrível',
  'transformador',
  'jornada',
  'colapso',
  'burnout',
] as const

/**
 * Sanitiza texto removendo travessões e substituindo por pontuação acolhedora.
 */
export function sanitizarTextoSemTravessao(texto: string): string {
  if (!texto) return ''
  return texto
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*–\s*/g, ', ')
    .replace(/\s*--\s*/g, ', ')
}

/**
 * Valida se um texto contém palavras proibidas ou travessão.
 */
export function validarTextoConformidade(texto: string): { valido: boolean; motivos: string[] } {
  const motivos: string[] = []
  if (!texto) return { valido: true, motivos }

  if (texto.includes('—') || texto.includes('–') || texto.includes('--')) {
    motivos.push('Contém caractere de travessão proibido.')
  }

  const lower = texto.toLowerCase()
  for (const proibida of PALAVRAS_PROIBIDAS) {
    // regex de palavra inteira ou início
    const regex = new RegExp(`\\b${proibida}`, 'i')
    if (regex.test(lower)) {
      motivos.push(`Contém palavra proibida: "${proibida}".`)
    }
  }

  return {
    valido: motivos.length === 0,
    motivos,
  }
}

/**
 * Gera o estado padrão inicial do mapa SKIGAI
 */
export function criarEstadoInicialSkigai(): SkigaiDataModel {
  const hoje = new Date()
  const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`

  const necessidades: NecessidadeItem[] = NECESSIDADES_DEFINICOES.map((def) => ({
    id: def.id,
    nome: def.nome,
    abreviacao: def.abreviacao,
    nutricao: 0,
    importancia: 0,
    interesse: 0,
    habilidade: 0,
    reflexao: '',
    leitura: '',
  }))

  const pilares: PilarKenMogiItem[] = PILARES_MOGI_DEFINICOES.map((def) => ({
    id: def.id,
    nome: def.nome,
    pergunta: def.pergunta,
    presenca: 0,
    nota: '',
  }))

  const planoPadrao: MicroAcaoPlano[] = [
    {
      semana: 1,
      necessidade: '',
      tipo: 'tarefa',
      pilar: 'Começar pequeno',
      acao: '',
      dia: 'Segunda-feira',
      ikigai_kan: '',
      regras: [false, false, false, false],
    },
    {
      semana: 2,
      necessidade: '',
      tipo: 'relação',
      pilar: 'Harmonia e sustentabilidade',
      acao: '',
      dia: 'Quarta-feira',
      ikigai_kan: '',
      regras: [false, false, false, false],
    },
    {
      semana: 3,
      necessidade: '',
      tipo: 'olhar',
      pilar: 'Estar no aqui e agora',
      acao: '',
      dia: 'Sexta-feira',
      ikigai_kan: '',
      regras: [false, false, false, false],
    },
    {
      semana: 4,
      necessidade: '',
      tipo: 'tarefa',
      pilar: 'Alegria nas pequenas coisas',
      acao: '',
      dia: 'Terça-feira',
      ikigai_kan: '',
      regras: [false, false, false, false],
    },
  ]

  return {
    versao: '1.0',
    tipo: 'mapa',
    nome: '',
    data: dataFormatada,
    termometro: 5,
    palavraDeHoje: '',
    resumo: ['', '', '', '', ''],
    necessidades,
    fontes: [
      {
        id: 'fonte-1',
        nome: 'Atendimentos clínicos particulares',
        tipo: 'atividade',
        rendimento: 2,
        fragilidade: 1,
        alimenta: [2, 1, 2, 2, 2, 2, 2],
      },
      {
        id: 'fonte-2',
        nome: 'Supervisão e estudos',
        tipo: 'atividade',
        rendimento: 1,
        fragilidade: 1,
        alimenta: [1, 3, 2, 2, 1, 2, 3],
      },
    ],
    estrutura: {
      fora_do_meu_controle: [],
      posso_mexer: [],
    },
    pilares,
    plano: planoPadrao,
    frases: {
      escolhida: 'autoral',
      direcao: [
        { versao: 'segura', texto: '' },
        { versao: 'autoral', texto: '' },
        { versao: 'ousada', texto: '' },
      ],
      sintese: '',
      ancora: '',
    },
    carta: '',
    anterior: null,
    app: {
      faseAtual: 0,
      fasesConcluidas: [],
      criadoEm: hoje.toISOString(),
      atualizadoEm: hoje.toISOString(),
      contratoAceito: false,
    },
  }
}

/**
 * Validação rigorosa de Schema e Limites de Importação
 * - Tamanho máximo: 256 KB
 * - Rejeita < e > nos textos (prevenção XSS)
 * - Rejeita valores fora de faixa (0 a 3, termômetro 0 a 10)
 * - Valida integridade da lista de 7 necessidades
 */
export function validarEImportarSkigaiJson(conteudoJson: string): {
  sucesso: boolean
  dados?: SkigaiDataModel
  erro?: string
} {
  if (!conteudoJson || typeof conteudoJson !== 'string') {
    return { sucesso: false, erro: 'Conteúdo de importação vazio.' }
  }

  // Limite 256 KB
  const tamanhoBytes = new Blob([conteudoJson]).size
  if (tamanhoBytes > 256 * 1024) {
    return { sucesso: false, erro: 'O arquivo excede o tamanho máximo suportado (256 KB).' }
  }

  // Rejeita < e > nos textos
  if (conteudoJson.includes('<') || conteudoJson.includes('>')) {
    return {
      sucesso: false,
      erro: 'O arquivo contém caracteres não permitidos (< ou >). Por segurança, a importação foi recusada.',
    }
  }

  let parsed: any
  try {
    parsed = JSON.parse(conteudoJson)
  } catch {
    return { sucesso: false, erro: 'Formato JSON inválido. Verifique o arquivo.' }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { sucesso: false, erro: 'Estrutura do arquivo não corresponde a um mapa válido.' }
  }

  if (parsed.tipo !== 'mapa') {
    return { sucesso: false, erro: 'O arquivo informado não é um mapa SKIGAI oficial.' }
  }

  // Validar necessidades
  if (!Array.isArray(parsed.necessidades) || parsed.necessidades.length !== 7) {
    return { sucesso: false, erro: 'O mapa deve conter exatamente as 7 necessidades essenciais.' }
  }

  for (const nec of parsed.necessidades) {
    if (
      typeof nec.nutricao !== 'number' ||
      nec.nutricao < 0 ||
      nec.nutricao > 3 ||
      !Number.isInteger(nec.nutricao) ||
      typeof nec.importancia !== 'number' ||
      nec.importancia < 0 ||
      nec.importancia > 3 ||
      !Number.isInteger(nec.importancia)
    ) {
      return {
        sucesso: false,
        erro: 'Valores de nutrição ou importância fora da faixa permitida (inteiros de 0 a 3).',
      }
    }
  }

  // Validar termômetro se presente
  if (parsed.termometro !== undefined) {
    if (typeof parsed.termometro !== 'number' || parsed.termometro < 0 || parsed.termometro > 10) {
      return { sucesso: false, erro: 'Nota do termômetro fora da escala permitida (0 a 10).' }
    }
  }

  // Validar fontes se presentes
  if (parsed.fontes && Array.isArray(parsed.fontes)) {
    for (const f of parsed.fontes) {
      if (
        (f.rendimento !== undefined && (f.rendimento < 0 || f.rendimento > 3)) ||
        (f.fragilidade !== undefined && (f.fragilidade < 0 || f.fragilidade > 3))
      ) {
        return {
          sucesso: false,
          erro: 'Valores de rendimento ou fragilidade de fontes fora de 0 a 3.',
        }
      }
    }
  }

  // Garantir metadados app
  const appMeta: any = parsed.app || {}
  const model: SkigaiDataModel = {
    versao: '1.0',
    tipo: 'mapa',
    nome: typeof parsed.nome === 'string' ? parsed.nome : '',
    data: typeof parsed.data === 'string' ? parsed.data : '',
    termometro: typeof parsed.termometro === 'number' ? parsed.termometro : 5,
    palavraDeHoje: typeof parsed.palavraDeHoje === 'string' ? parsed.palavraDeHoje : '',
    resumo:
      Array.isArray(parsed.resumo) && parsed.resumo.length === 5
        ? parsed.resumo
        : ['', '', '', '', ''],
    necessidades: parsed.necessidades,
    fontes: Array.isArray(parsed.fontes) ? parsed.fontes : [],
    estrutura: {
      fora_do_meu_controle: Array.isArray(parsed.estrutura?.fora_do_meu_controle)
        ? parsed.estrutura.fora_do_meu_controle
        : [],
      posso_mexer: Array.isArray(parsed.estrutura?.posso_mexer) ? parsed.estrutura.posso_mexer : [],
    },
    pilares: Array.isArray(parsed.pilares) ? parsed.pilares : [],
    plano: Array.isArray(parsed.plano) ? parsed.plano : [],
    frases: {
      escolhida: parsed.frases?.escolhida || 'autoral',
      direcao: Array.isArray(parsed.frases?.direcao) ? parsed.frases.direcao : [],
      sintese: parsed.frases?.sintese || '',
      ancora: parsed.frases?.ancora || '',
    },
    carta: typeof parsed.carta === 'string' ? parsed.carta : '',
    anterior: parsed.anterior || null,
    app: {
      faseAtual: typeof appMeta.faseAtual === 'number' ? appMeta.faseAtual : 0,
      fasesConcluidas: Array.isArray(appMeta.fasesConcluidas) ? appMeta.fasesConcluidas : [],
      criadoEm: appMeta.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      contratoAceito: !!appMeta.contratoAceito,
    },
  }

  return { sucesso: true, dados: model }
}

/**
 * Gera string de cápsula SKIGAI1: SKIGAI1|F{n}|{json}
 */
export function exportarCapsulaSkigai(modelo: SkigaiDataModel): string {
  const fase = modelo.app?.faseAtual ?? 0
  const jsonCompativel = exportarJsonCompativelSkill(modelo)
  return `SKIGAI1|F${fase}|${jsonCompativel}`
}

/**
 * Lê uma string de cápsula SKIGAI1 ou JSON puro e extrai os dados
 */
export function importarCapsulaOuJson(input: string): {
  sucesso: boolean
  dados?: SkigaiDataModel
  faseCapsula?: number
  erro?: string
} {
  const trimmed = input.trim()
  if (trimmed.startsWith('SKIGAI1|')) {
    const parts = trimmed.split('|')
    if (parts.length >= 3) {
      const faseStr = parts[1].replace('F', '')
      const faseNum = parseInt(faseStr, 10)
      const rawJson = parts.slice(2).join('|')
      const res = validarEImportarSkigaiJson(rawJson)
      if (res.sucesso && res.dados) {
        if (!isNaN(faseNum)) {
          res.dados.app.faseAtual = faseNum
        }
        return {
          sucesso: true,
          dados: res.dados,
          faseCapsula: isNaN(faseNum) ? undefined : faseNum,
        }
      }
      return { sucesso: false, erro: res.erro }
    }
  }

  return validarEImportarSkigaiJson(trimmed)
}

/**
 * Exporta JSON canônico compatível com a skill:
 * - Aspas duplas
 * - Números sem aspas
 * - Nenhum < ou >
 * - Sem quebras de linha dentro de strings (trocadas por espaço)
 */
export function exportarJsonCompativelSkill(modelo: SkigaiDataModel): string {
  const clone = JSON.parse(JSON.stringify(modelo))

  // Função recursiva para limpar quebras de linha e caracteres < >
  function sanitizeStrings(obj: any): any {
    if (typeof obj === 'string') {
      return obj.replace(/[<>]/g, '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeStrings)
    }
    if (typeof obj === 'object' && obj !== null) {
      const res: any = {}
      for (const [k, v] of Object.entries(obj)) {
        res[k] = sanitizeStrings(v)
      }
      return res
    }
    return obj
  }

  const sanitized = sanitizeStrings(clone)
  return JSON.stringify(sanitized, null, 2)
}
