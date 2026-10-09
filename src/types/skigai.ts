/**
 * SKIGAI Data Types
 * Compatíveis com o esquema canônico da skill SKIGAI e com o modelo de dados do PRD.
 */

export type Escala0a3 = 0 | 1 | 2 | 3
export type Termometro0a10 = number // 0 a 10

export interface NecessidadeItem {
  id: number // 1 a 7
  nome: string
  abreviacao: string
  nutricao: Escala0a3 // N
  importancia: Escala0a3 // I
  interesse: Escala0a3 // Int
  habilidade: Escala0a3 // H
  reflexao: string
  leitura?: string
}

export interface FonteItem {
  id: string
  nome: string
  tipo: 'atividade' | 'pessoa' | 'causa' | string
  rendimento: Escala0a3
  fragilidade: Escala0a3
  alimenta: [number, number, number, number, number, number, number] // 7 necessidades, 0 a 3
}

export interface EstruturaItem {
  fora_do_meu_controle: string[]
  posso_mexer: string[]
}

export interface PilarKenMogiItem {
  id: number // 1 a 5
  nome: string
  pergunta: string
  presenca: Escala0a3 // 0 a 3
  nota: string
}

export interface MicroAcaoPlano {
  semana: number // 1 a 4
  necessidade: string
  tipo: 'tarefa' | 'relação' | 'olhar' | string
  pilar: string
  acao: string
  dia: string
  ikigai_kan: string
  regras: [boolean, boolean, boolean, boolean] // 4 testes obrigatórios
}

export interface FraseDirecaoItem {
  versao: 'segura' | 'autoral' | 'ousada'
  texto: string
}

export interface FrasesDirecaoState {
  escolhida: 'segura' | 'autoral' | 'ousada'
  direcao: FraseDirecaoItem[]
  sintese: string
  ancora?: string
}

export interface AppMetadata {
  faseAtual: number // 0 a 8
  fasesConcluidas: number[]
  criadoEm: string
  atualizadoEm: string
  contratoAceito?: boolean
}

export interface SkigaiDataModel {
  versao: '1.0'
  tipo: 'mapa'
  nome: string
  data: string // DD/MM/AAAA
  termometro: Termometro0a10
  palavraDeHoje: string
  resumo: [string, string, string, string, string] // 5 linhas por regras
  necessidades: NecessidadeItem[]
  fontes: FonteItem[]
  estrutura: EstruturaItem
  pilares: PilarKenMogiItem[]
  plano: MicroAcaoPlano[]
  frases: FrasesDirecaoState
  carta: string
  anterior: SkigaiDataModel | null
  app: AppMetadata
}

export interface CalculoNecessidadeMetricas {
  id: number
  nome: string
  abreviacao: string
  nutricao: number
  importancia: number
  interesse: number
  habilidade: number
  lacuna: number // I * (3 - N) -> 0 a 9
  alavanca: number // (Int + H) / 2 -> 0 a 3 (1 casa decimal)
  forca: number // N * I -> 0 a 9
  faixaLacuna: 'baixa' | 'media' | 'alta'
  reflexao?: string
}

export interface SkigaiCalculoResultado {
  metricasPorNecessidade: CalculoNecessidadeMetricas[]
  recursos: CalculoNecessidadeMetricas[] // até 2 maiores forças com N >= 2
  prioridades: CalculoNecessidadeMetricas[] // até 3 maiores lacunas com lacuna >= 3
  cuidadoGatilho: boolean // Ressonância e Liberdade N <= 1
  cuidadoTotalGatilho: boolean // as 7 nutrições <= 1
  concentracaoFontes: number | null // maior rendimento / soma rendimentos (0 a 100%) ou null
  fragilidadeMediaFontes: number | null // média ponderada ou null
  necessidadesSemFonte: number[] // IDs (1 a 7) onde nenhuma fonte alimenta >= 2
}
