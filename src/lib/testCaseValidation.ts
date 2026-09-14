import { PricingState } from '@/types/pricing'
import { calculateFacMetrics } from './facMath'

/**
 * Validação interna canônica Seção 14:
 *
 * Entradas:
 * - Pessoais: Moradia 2500, Alimentação 1000, Transporte 400, Saúde 600 (R$ 4.500)
 * - Profissionais: Consultório 450, Internet 150, Softwares 100, Supervisão 300, Contador 200 (R$ 1.200)
 * - Retirada: 2000
 * - Reserva 10%, Tributos 11% -> soma 21%, divisor 0.79
 * - 15 sessões/sem, 4 semanas/mês, 10% taxa de falta
 * - Preço atual: R$ 150
 *
 * Esperado (tolerância <= R$ 0,01):
 * - B = 7700,00
 * - F_bruto = 9746,84
 * - S_agendadas = 60
 * - S_efetivas = 54
 * - V_min = 180,50
 * - Δ_sessão = 30,50
 * - Δ_mensal = 1646,84
 * - Decomposição:
 *   Pessoais = 83,33 (46,17%)
 *   Profissionais = 22,22 (12,31%)
 *   Retirada = 37,04 (20,52%)
 *   Reserva&Tributos = 37,90 (21,00%)
 */
export function validateSection14TestCase(): boolean {
  const testState: PricingState = {
    custosPessoais: {
      moradia: 2500,
      alimentacao: 1000,
      transporte: 400,
      saude: 600,
      dependentes: 0,
      outros: 0,
      customItems: [],
    },
    custosProfissionais: {
      sala: 450,
      internet: 150,
      softwares: 100,
      supervisao: 300,
      formacao: 0,
      contador: 200,
      marketing: 0,
      outros: 0,
      customItems: [],
    },
    retiradaDesejada: 2000,
    reservaPct: 10,
    tributosPct: 11,
    sessoesPorSemana: 15,
    semanasPorMes: 4,
    taxaFaltaPct: 10,
    precoAtual: 150,
    cfpConfig: {
      tier: 'medio',
      customValue: 305.68,
    },
    activeStep: 6,
  }

  const result = calculateFacMetrics(testState)

  const checks = [
    { name: 'baseB', actual: result.baseB, expected: 7700.0 },
    { name: 'faturamentoBruto', actual: result.faturamentoBruto, expected: 9746.84 },
    { name: 'sessoesAgendadas', actual: result.sessoesAgendadas, expected: 60 },
    { name: 'sessoesEfetivas', actual: result.sessoesEfetivas, expected: 54 },
    { name: 'pisoMinimoSessao', actual: result.pisoMinimoSessao, expected: 180.5 },
    { name: 'deltaSessao', actual: result.deltaSessao, expected: 30.5 },
    { name: 'deltaMensal', actual: result.deltaMensal, expected: 1646.84 },
    { name: 'decompPessoalPorSessao', actual: result.decompPessoalPorSessao, expected: 83.33 },
    {
      name: 'decompProfissionalPorSessao',
      actual: result.decompProfissionalPorSessao,
      expected: 22.22,
    },
    { name: 'decompRetiradaPorSessao', actual: result.decompRetiradaPorSessao, expected: 37.04 },
    {
      name: 'decompReservaTributosPorSessao',
      actual: result.decompReservaTributosPorSessao,
      expected: 37.9,
    },
  ]

  let hasFailure = false
  for (const check of checks) {
    const diff = Math.abs(check.actual - check.expected)
    if (diff > 0.01) {
      console.warn(
        `[Método FAC] Validação Seção 14 discrepância em ${check.name}: esperado ${check.expected}, obtido ${check.actual} (diff: ${diff.toFixed(4)})`,
      )
      hasFailure = true
    }
  }

  if (!hasFailure) {
    console.info('[Método FAC] Validação Seção 14 aprovada com precisão de R$ 0,01.')
  }

  return !hasFailure
}
