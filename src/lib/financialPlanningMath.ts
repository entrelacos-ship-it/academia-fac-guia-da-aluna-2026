/**
 * Motor Matemático e Tipos para o Módulo de Planejamento Financeiro
 * Calculadora de Precificação FAC — Entrelaços Psicologia
 */

export type GoalPriority = 'alta' | 'media' | 'baixa'

export interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  deadlineMonths: number
  priority: GoalPriority
  category?: 'equipamento' | 'curso' | 'viagem' | 'consultorio' | 'outro'
  createdAt: string
}

export interface FinancialPlanningState {
  // Reserva de Emergência
  capitalAcumuladoReserva: number
  despesasMensaisEssenciaisManual?: number // Se omitido ou <= 0, usa a soma canônica (Passo 1 + Passo 2)
  mesesMetaReserva: number // Padrão 6
  prazoMesesParaAtingirReserva: number // Prazo X em meses para atingir o que falta

  // Metas Financeiras
  goals: FinancialGoal[]

  // Projeção de Crescimento (12 a 24 meses)
  projectionMonths: 12 | 18 | 24
  crescimentoPrecoPct: number // % aumento total ou anual no preço
  crescimentoSessoesPct: number // % aumento na carga de sessões
  aplicarIndiceInflacao: boolean
  indiceInflacaoAnualPct: number // IPCA ou IGP-M padrão 4.83%
  tipoIndiceInflacao: 'IPCA' | 'IGP-M' | 'PERSONALIZADO'
}

export const DEFAULT_FINANCIAL_PLANNING_STATE: FinancialPlanningState = {
  capitalAcumuladoReserva: 0,
  mesesMetaReserva: 6,
  prazoMesesParaAtingirReserva: 12,
  goals: [
    {
      id: 'meta-formacao-1',
      name: 'Especialização Clínica Avançada',
      targetAmount: 7200,
      savedAmount: 1200,
      deadlineMonths: 12,
      priority: 'alta',
      category: 'curso',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'meta-consultorio-2',
      name: 'Upgrade de Consultório / Mobiliário Acústico',
      targetAmount: 4500,
      savedAmount: 500,
      deadlineMonths: 9,
      priority: 'media',
      category: 'consultorio',
      createdAt: new Date().toISOString(),
    },
  ],
  projectionMonths: 12,
  crescimentoPrecoPct: 10,
  crescimentoSessoesPct: 0,
  aplicarIndiceInflacao: true,
  indiceInflacaoAnualPct: 4.83,
  tipoIndiceInflacao: 'IPCA',
}

export interface CashFlowConsolidation {
  // Entradas
  precoPorSessao: number
  sessoesEfetivas: number
  faturamentoBrutoReal: number
  isUsandoPrecoAtual: boolean

  // Saídas
  custosProfissionais: number
  provisaoTributos: number
  provisaoReserva: number
  retiradaLivre: number
  totalSaidasOperacionais: number

  // Saldo
  saldoMensalConsultorio: number // Faturamento - Custos Prof - Provisão Trib - Provisão Res - Retirada
  custoVidaPessoal: number // Passo 1
  rendaDisponivelParaVida: number // Retirada + Saldo excedente
  saldoLiquidoVida: number // Renda Disponível - Custo Vida Pessoal
  isSuperavitario: boolean
  vereditoTexto: string
}

export interface EmergencyReserveCalculation {
  custoMensalEssencial: number
  capitalAcumulado: number
  metaMeses: number
  valorAlvoReserva: number
  mesesCoberturaAtual: number
  valorFaltante: number
  prazoMeses: number
  aporteMensalNecessario: number
  percentualConcluido: number
  status: 'critico' | 'atencao' | 'confortavel' | 'meta_atingida'
  statusTexto: string
}

export interface MonthProjectionPoint {
  mes: number
  labelMes: string
  precoSessao: number
  sessoesMes: number
  faturamentoBruto: number
  custosProfissionais: number
  provisaoTributos: number
  provisaoReservaMensal: number
  retiradaLiquida: number
  reservaAcumuladaTotal: number
}

/**
 * 1. Consolidar Fluxo de Caixa Mensal
 */
export function calculateCashFlow(
  precoSessao: number,
  sessoesEfetivas: number,
  custosProfissionais: number,
  tributosPct: number,
  reservaPct: number,
  retiradaDesejada: number,
  custoVidaPessoal: number,
  isPrecoAtualInformado: boolean,
): CashFlowConsolidation {
  const faturamentoBrutoReal = Math.round(precoSessao * sessoesEfetivas * 100) / 100

  // Provisões baseadas no faturamento bruto real obtido
  const provisaoTributos = Math.round(faturamentoBrutoReal * (tributosPct / 100) * 100) / 100
  const provisaoReserva = Math.round(faturamentoBrutoReal * (reservaPct / 100) * 100) / 100

  const totalSaidasOperacionais =
    Math.round(
      (custosProfissionais + provisaoTributos + provisaoReserva + retiradaDesejada) * 100,
    ) / 100

  const saldoMensalConsultorio =
    Math.round((faturamentoBrutoReal - totalSaidasOperacionais) * 100) / 100

  // Comparação com custo de vida do Passo 1:
  // A profissional conta com a retirada desejada para pagar seu custo de vida pessoal.
  // Se houver saldo mensal positivo do consultório, ele pode somar à renda da vida ou ir para reinvestimento.
  const rendaDisponivelParaVida =
    Math.round((retiradaDesejada + saldoMensalConsultorio) * 100) / 100
  const saldoLiquidoVida = Math.round((rendaDisponivelParaVida - custoVidaPessoal) * 100) / 100

  const isSuperavitario = saldoLiquidoVida >= 0

  let vereditoTexto = ''
  if (saldoLiquidoVida >= 0) {
    vereditoTexto = `Superávit saudável de R$ ${Math.abs(saldoLiquidoVida).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês após cobrir custos profissionais, provisões fiscais e custo de vida.`
  } else {
    vereditoTexto = `Déficit financeiro de R$ ${Math.abs(saldoLiquidoVida).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês em relação ao seu custo de vida e despesas operacionais.`
  }

  return {
    precoPorSessao: precoSessao,
    sessoesEfetivas,
    faturamentoBrutoReal,
    isUsandoPrecoAtual: isPrecoAtualInformado,
    custosProfissionais,
    provisaoTributos,
    provisaoReserva,
    retiradaLivre: retiradaDesejada,
    totalSaidasOperacionais,
    saldoMensalConsultorio,
    custoVidaPessoal,
    rendaDisponivelParaVida,
    saldoLiquidoVida,
    isSuperavitario,
    vereditoTexto,
  }
}

/**
 * 2. Calcular Reserva de Emergência
 */
export function calculateEmergencyReserve(
  capitalAcumulado: number,
  despesasEssenciais: number,
  metaMeses: number = 6,
  prazoMeses: number = 12,
): EmergencyReserveCalculation {
  const cap = Math.max(0, capitalAcumulado)
  const desp = Math.max(1, despesasEssenciais)
  const mesesMeta = Math.max(1, metaMeses)
  const prazo = Math.max(1, prazoMeses)

  const valorAlvoReserva = Math.round(desp * mesesMeta * 100) / 100
  const mesesCoberturaAtual = Math.round((cap / desp) * 10) / 10
  const valorFaltante = Math.max(0, Math.round((valorAlvoReserva - cap) * 100) / 100)
  const aporteMensalNecessario =
    valorFaltante > 0 ? Math.round((valorFaltante / prazo) * 100) / 100 : 0
  const percentualConcluido =
    valorAlvoReserva > 0 ? Math.min(100, Math.round((cap / valorAlvoReserva) * 1000) / 10) : 100

  let status: EmergencyReserveCalculation['status'] = 'atencao'
  let statusTexto = ''

  if (mesesCoberturaAtual >= mesesMeta) {
    status = 'meta_atingida'
    statusTexto = `Meta atingida! Você possui ${mesesCoberturaAtual.toFixed(1)} meses de cobertura garantida.`
  } else if (mesesCoberturaAtual >= 3) {
    status = 'confortavel'
    statusTexto = `Cobertura intermediária (${mesesCoberturaAtual.toFixed(1)} meses). Mais ${prazo} meses de aporte completam a meta de ${mesesMeta} meses.`
  } else if (mesesCoberturaAtual >= 1) {
    status = 'atencao'
    statusTexto = `Atenção: sua reserva cobre apenas ${mesesCoberturaAtual.toFixed(1)} mês(es). Priorize acelerar os aportes.`
  } else {
    status = 'critico'
    statusTexto = `Situação de vulnerabilidade: menos de 1 mês de cobertura (${mesesCoberturaAtual.toFixed(1)} meses). Qualquer imprevisto exigirá endividamento.`
  }

  return {
    custoMensalEssencial: desp,
    capitalAcumulado: cap,
    metaMeses: mesesMeta,
    valorAlvoReserva,
    mesesCoberturaAtual,
    valorFaltante,
    prazoMeses: prazo,
    aporteMensalNecessario,
    percentualConcluido,
    status,
    statusTexto,
  }
}

/**
 * 3. Calcular Aporte de Meta Financeira
 */
export function calculateGoalMonthlyContribution(goal: FinancialGoal): {
  remainingAmount: number
  monthlyContribution: number
  progressPct: number
} {
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount)
  const months = Math.max(1, goal.deadlineMonths)
  const monthlyContribution = Math.round((remaining / months) * 100) / 100
  const progressPct =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 1000) / 10)
      : 100

  return {
    remainingAmount: remaining,
    monthlyContribution,
    progressPct,
  }
}

/**
 * 4. Projeção de Crescimento (12 a 24 meses)
 */
export function generateGrowthProjection(
  basePrecoSessao: number,
  baseSessoesMes: number,
  custosProfissionaisBase: number,
  tributosPct: number,
  reservaPct: number,
  retiradaBase: number,
  capitalReservaInicial: number,
  config: {
    projectionMonths: 12 | 18 | 24
    crescimentoPrecoPct: number
    crescimentoSessoesPct: number
    aplicarIndiceInflacao: boolean
    indiceInflacaoAnualPct: number
  },
): MonthProjectionPoint[] {
  const points: MonthProjectionPoint[] = []
  let reservaAcumulada = Math.max(0, capitalReservaInicial)

  const totalMeses = config.projectionMonths
  const monthlyPriceGrowthRate = Math.pow(1 + config.crescimentoPrecoPct / 100, 1 / 12) - 1
  const monthlySessionsGrowthRate = Math.pow(1 + config.crescimentoSessoesPct / 100, 1 / 12) - 1

  // Taxa de inflação anual aplicada no mês 13 (se 18 ou 24 meses) ou diluída
  const inflacaoMultiplierAno2 = config.aplicarIndiceInflacao
    ? 1 + config.indiceInflacaoAnualPct / 100
    : 1

  for (let m = 1; m <= totalMeses; m++) {
    // Preço projetado do mês
    let precoProjetado = basePrecoSessao * Math.pow(1 + monthlyPriceGrowthRate, m - 1)
    if (m >= 13 && config.aplicarIndiceInflacao) {
      precoProjetado = precoProjetado * inflacaoMultiplierAno2
    }
    precoProjetado = Math.round(precoProjetado * 100) / 100

    // Volume de sessões projetado
    const sessoesProjetadas = Math.max(
      1,
      Math.round(baseSessoesMes * Math.pow(1 + monthlySessionsGrowthRate, m - 1)),
    )

    const faturamentoBruto = Math.round(precoProjetado * sessoesProjetadas * 100) / 100
    const provisaoTributos = Math.round(faturamentoBruto * (tributosPct / 100) * 100) / 100
    const provisaoReservaMensal = Math.round(faturamentoBruto * (reservaPct / 100) * 100) / 100

    // Custos profissionais com leve inflação no ano 2
    const custosProfissionais =
      m >= 13 && config.aplicarIndiceInflacao
        ? Math.round(custosProfissionaisBase * inflacaoMultiplierAno2 * 100) / 100
        : custosProfissionaisBase

    // Retirada líquida projetada: sobra do faturamento após custos e provisões
    const totalDeducoes = custosProfissionais + provisaoTributos + provisaoReservaMensal
    const retiradaLiquida = Math.max(0, Math.round((faturamentoBruto - totalDeducoes) * 100) / 100)

    // Acumula reserva técnica
    reservaAcumulada = Math.round((reservaAcumulada + provisaoReservaMensal) * 100) / 100

    points.push({
      mes: m,
      labelMes: `Mês ${m}`,
      precoSessao: precoProjetado,
      sessoesMes: sessoesProjetadas,
      faturamentoBruto,
      custosProfissionais,
      provisaoTributos,
      provisaoReservaMensal,
      retiradaLiquida,
      reservaAcumuladaTotal: reservaAcumulada,
    })
  }

  return points
}
