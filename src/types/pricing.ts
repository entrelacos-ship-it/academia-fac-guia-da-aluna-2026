export interface CustomItem {
  id: string
  label: string
  value: number
}

export type CfpTier = 'inferior' | 'medio' | 'superior' | 'personalizado'

export interface CfpConfig {
  tier: CfpTier
  customValue?: number
}

export const CFP_VALUES: Record<'inferior' | 'medio' | 'superior', number> = {
  inferior: 203.79,
  medio: 305.68,
  superior: 458.52,
}

export interface PricingState {
  custosPessoais: {
    moradia: number
    alimentacao: number
    transporte: number
    saude: number
    dependentes: number
    outros: number
    customItems: CustomItem[]
  }
  custosProfissionais: {
    sala: number
    internet: number
    softwares: number
    supervisao: number
    formacao: number
    contador: number
    marketing: number
    outros: number
    customItems: CustomItem[]
  }
  retiradaDesejada: number
  reservaPct: number // 0-30 default 10
  tributosPct: number // 0-40 default 11
  sessoesPorSemana: number // > 0
  semanasPorMes: number // default 4
  taxaFaltaPct: number // 0-50 default 10
  precoAtual: number // default 0
  cfpConfig: CfpConfig
  activeStep: number // 0-7
}

export interface CalculationResult {
  somaCustosPessoais: number
  somaCustosProfissionais: number
  retiradaDesejada: number
  baseB: number
  pctBruto: number
  divisor: number
  isBlocked: boolean // if pctBruto >= 1 (100%)
  faturamentoBruto: number
  sessoesAgendadas: number
  sessoesEfetivas: number
  pisoMinimoSessao: number // V_min
  // Decomposição por sessão
  decompPessoalPorSessao: number
  decompProfissionalPorSessao: number
  decompRetiradaPorSessao: number
  decompReservaTributosPorSessao: number
  // Percentuais por sessão (somam 100%)
  pctPessoal: number
  pctProfissional: number
  pctRetirada: number
  pctReservaTributos: number
  // Gap analysis
  hasPrecoAtual: boolean
  deltaSessao: number
  deltaMensal: number
  prejuizoAnualProjetado: number
  isDeficit: boolean
  // Referência CFP
  cfpValorReferencia: number
  cfpFaixaAtingida: 'abaixo' | 'inferior' | 'medio' | 'superior'
}

export interface SavedScenario {
  id: string
  name: string
  notes?: string
  state: PricingState
  createdAt: string
  vMin: number
  fBruto: number
  sessoesMes: number
  isDeficit: boolean
}
