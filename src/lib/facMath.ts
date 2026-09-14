import { PricingState, CalculationResult, CFP_VALUES } from '@/types/pricing'

export const DEFAULT_PRICING_STATE: PricingState = {
  custosPessoais: {
    moradia: 0,
    alimentacao: 0,
    transporte: 0,
    saude: 0,
    dependentes: 0,
    outros: 0,
    customItems: [],
  },
  custosProfissionais: {
    sala: 0,
    internet: 0,
    softwares: 0,
    supervisao: 0,
    formacao: 0,
    contador: 0,
    marketing: 0,
    outros: 0,
    customItems: [],
  },
  retiradaDesejada: 0,
  reservaPct: 10,
  tributosPct: 11,
  sessoesPorSemana: 15,
  semanasPorMes: 4,
  taxaFaltaPct: 10,
  precoAtual: 0,
  cfpConfig: {
    tier: 'medio',
    customValue: CFP_VALUES.medio,
  },
  activeStep: 0,
}

export function sumCustosPessoais(custos: PricingState['custosPessoais']): number {
  const base =
    (custos.moradia || 0) +
    (custos.alimentacao || 0) +
    (custos.transporte || 0) +
    (custos.saude || 0) +
    (custos.dependentes || 0) +
    (custos.outros || 0)
  const customs = custos.customItems.reduce((acc, it) => acc + (it.value || 0), 0)
  return Math.round((base + customs) * 100) / 100
}

export function sumCustosProfissionais(custos: PricingState['custosProfissionais']): number {
  const base =
    (custos.sala || 0) +
    (custos.internet || 0) +
    (custos.softwares || 0) +
    (custos.supervisao || 0) +
    (custos.formacao || 0) +
    (custos.contador || 0) +
    (custos.marketing || 0) +
    (custos.outros || 0)
  const customs = custos.customItems.reduce((acc, it) => acc + (it.value || 0), 0)
  return Math.round((base + customs) * 100) / 100
}

export function calculateFacMetrics(state: PricingState): CalculationResult {
  const somaPessoais = sumCustosPessoais(state.custosPessoais)
  const somaProfissionais = sumCustosProfissionais(state.custosProfissionais)
  const retirada = state.retiradaDesejada || 0

  // 1. B = somaCustosPessoais + somaCustosProfissionais + retiradaDesejada
  const baseB = Math.round((somaPessoais + somaProfissionais + retirada) * 100) / 100

  // 2. pctBruto = (reservaPct + tributosPct)/100; divisor = 1 - pctBruto
  const pctBruto = (state.reservaPct + state.tributosPct) / 100
  const divisor = 1 - pctBruto
  const isBlocked = pctBruto >= 1 || divisor <= 0

  let faturamentoBruto = 0
  if (!isBlocked && divisor > 0) {
    faturamentoBruto = Math.round((baseB / divisor) * 100) / 100
  }

  // 3. S_agendadas = sessoesPorSemana × semanasPorMes
  const sessoesPorSemana = Math.max(1, state.sessoesPorSemana || 1)
  const semanasPorMes = Math.max(1, state.semanasPorMes || 4)
  const sessoesAgendadas = sessoesPorSemana * semanasPorMes

  // 4. S_efetivas = S_agendadas × (1 - taxaFaltaPct/100)
  const taxaFalta = Math.max(0, Math.min(100, state.taxaFaltaPct || 0)) / 100
  const sessoesEfetivas = Math.round(sessoesAgendadas * (1 - taxaFalta) * 100) / 100

  // 5. V_min = F_bruto / S_efetivas
  let pisoMinimoSessao = 0
  if (sessoesEfetivas > 0 && !isBlocked) {
    pisoMinimoSessao = Math.round((faturamentoBruto / sessoesEfetivas) * 100) / 100
  }

  // Decomposição por sessão
  // Fórmulas exatas:
  // Custos Pessoais / S_efetivas
  // Custos Profissionais / S_efetivas
  // Retirada / S_efetivas
  // V_min * pctBruto (ou F_bruto * pctBruto / S_efetivas)
  let decompPessoalPorSessao = 0
  let decompProfissionalPorSessao = 0
  let decompRetiradaPorSessao = 0
  let decompReservaTributosPorSessao = 0

  if (sessoesEfetivas > 0 && !isBlocked) {
    decompPessoalPorSessao = Math.round((somaPessoais / sessoesEfetivas) * 100) / 100
    decompProfissionalPorSessao = Math.round((somaProfissionais / sessoesEfetivas) * 100) / 100
    decompRetiradaPorSessao = Math.round((retirada / sessoesEfetivas) * 100) / 100
    decompReservaTributosPorSessao = Math.round(pisoMinimoSessao * pctBruto * 100) / 100
  }

  // Percentuais com base em V_min
  let pctPessoal = 0
  let pctProfissional = 0
  let pctRetirada = 0
  let pctReservaTributos = 0

  if (pisoMinimoSessao > 0) {
    pctPessoal = Math.round((decompPessoalPorSessao / pisoMinimoSessao) * 10000) / 100
    pctProfissional = Math.round((decompProfissionalPorSessao / pisoMinimoSessao) * 10000) / 100
    pctRetirada = Math.round((decompRetiradaPorSessao / pisoMinimoSessao) * 10000) / 100
    pctReservaTributos =
      Math.round((decompReservaTributosPorSessao / pisoMinimoSessao) * 10000) / 100
  }

  // Gap analysis
  const hasPrecoAtual = (state.precoAtual || 0) > 0
  const deltaSessao = hasPrecoAtual
    ? Math.round((pisoMinimoSessao - state.precoAtual) * 100) / 100
    : 0
  const deltaMensal = hasPrecoAtual ? Math.round(deltaSessao * sessoesEfetivas * 100) / 100 : 0
  const prejuizoAnualProjetado = deltaMensal > 0 ? Math.round(deltaMensal * 12 * 100) / 100 : 0
  const isDeficit = hasPrecoAtual && deltaSessao > 0

  // CFP Valor de referência
  let cfpValorReferencia = CFP_VALUES.medio
  if (state.cfpConfig.tier === 'inferior') cfpValorReferencia = CFP_VALUES.inferior
  else if (state.cfpConfig.tier === 'superior') cfpValorReferencia = CFP_VALUES.superior
  else if (state.cfpConfig.tier === 'personalizado') {
    cfpValorReferencia = state.cfpConfig.customValue || CFP_VALUES.medio
  }

  let cfpFaixaAtingida: CalculationResult['cfpFaixaAtingida'] = 'abaixo'
  if (pisoMinimoSessao >= CFP_VALUES.superior) {
    cfpFaixaAtingida = 'superior'
  } else if (pisoMinimoSessao >= CFP_VALUES.medio) {
    cfpFaixaAtingida = 'medio'
  } else if (pisoMinimoSessao >= CFP_VALUES.inferior) {
    cfpFaixaAtingida = 'inferior'
  }

  return {
    somaCustosPessoais: somaPessoais,
    somaCustosProfissionais: somaProfissionais,
    retiradaDesejada: retirada,
    baseB,
    pctBruto,
    divisor: Math.round(divisor * 100) / 100,
    isBlocked,
    faturamentoBruto,
    sessoesAgendadas,
    sessoesEfetivas,
    pisoMinimoSessao,
    decompPessoalPorSessao,
    decompProfissionalPorSessao,
    decompRetiradaPorSessao,
    decompReservaTributosPorSessao,
    pctPessoal,
    pctProfissional,
    pctRetirada,
    pctReservaTributos,
    hasPrecoAtual,
    deltaSessao,
    deltaMensal,
    prejuizoAnualProjetado,
    isDeficit,
    cfpValorReferencia,
    cfpFaixaAtingida,
  }
}
