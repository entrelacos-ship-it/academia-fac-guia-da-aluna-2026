/**
 * Tipos e dados históricos de índices de inflação (IPCA / IGP-M)
 * Fontes:
 * - IPCA: IBGE / SIDRA
 * - IGP-M: FGV / IBRE
 */

export interface InflationIndexPreset {
  id: string
  ano: number
  indice: 'IPCA' | 'IGP-M'
  taxaPct: number
  fonte: string
  descricao: string
}

export const INFLATION_PRESETS: InflationIndexPreset[] = [
  {
    id: 'ipca-2024',
    ano: 2024,
    indice: 'IPCA',
    taxaPct: 4.83,
    fonte: 'IBGE / SIDRA',
    descricao: 'IPCA oficial fechado do ano de 2024',
  },
  {
    id: 'ipca-2023',
    ano: 2023,
    indice: 'IPCA',
    taxaPct: 4.62,
    fonte: 'IBGE / SIDRA',
    descricao: 'IPCA oficial fechado do ano de 2023',
  },
  {
    id: 'ipca-2022',
    ano: 2022,
    indice: 'IPCA',
    taxaPct: 5.79,
    fonte: 'IBGE / SIDRA',
    descricao: 'IPCA oficial fechado do ano de 2022',
  },
  {
    id: 'ipca-2021',
    ano: 2021,
    indice: 'IPCA',
    taxaPct: 10.06,
    fonte: 'IBGE / SIDRA',
    descricao: 'IPCA oficial fechado do ano de 2021',
  },
  {
    id: 'igpm-2024',
    ano: 2024,
    indice: 'IGP-M',
    taxaPct: 6.54,
    fonte: 'FGV / IBRE',
    descricao: 'IGP-M acumulado de 2024',
  },
  {
    id: 'igpm-2023',
    ano: 2023,
    indice: 'IGP-M',
    taxaPct: -3.18,
    fonte: 'FGV / IBRE',
    descricao: 'IGP-M acumulado de 2023 (deflação)',
  },
]

export interface AnnualReadjustmentInputs {
  honorarioAtual: number
  tipoIndice: 'IPCA' | 'IGP-M' | 'PERSONALIZADO'
  indicePct: number
  anoReferenciaPreset?: string
  numeroPeriodos: number // 1 por padrão (1 ano), ou mais se acumulado
  mesReajuste: string // ex: "Janeiro"
  nomeProfissional?: string
  nomePaciente?: string
}

export interface AnnualReadjustmentResult {
  honorarioAtual: number
  indiceEfetivoPct: number
  fatorMultiplicador: number
  novoHonorario: number
  deltaAbsolutoSessao: number
  deltaPercentualTotal: number
  // Projeção com S_efetivas
  sessoesEfetivasMes: number
  faturamentoMensalAntes: number
  faturamentoMensalDepois: number
  deltaMensal: number
  deltaAnual: number
  mensagemComunicado: string
}

/**
 * Calcula o reajuste anual de honorários
 */
export function calculateAnnualReadjustment(
  inputs: AnnualReadjustmentInputs,
  sessoesEfetivas: number = 54,
): AnnualReadjustmentResult {
  const honorarioAtual = Math.max(0, inputs.honorarioAtual || 0)
  const indicePct = inputs.indicePct || 0
  const periodos = Math.max(1, inputs.numeroPeriodos || 1)

  // fator = (1 + indice/100)^periodos
  const baseRate = 1 + indicePct / 100
  const fatorMultiplicador = Math.pow(baseRate, periodos)

  // Novo honorário arredondado para moeda
  const novoHonorario = Math.round(honorarioAtual * fatorMultiplicador * 100) / 100
  const deltaAbsolutoSessao = Math.round((novoHonorario - honorarioAtual) * 100) / 100
  const deltaPercentualTotal =
    honorarioAtual > 0
      ? Math.round(((novoHonorario - honorarioAtual) / honorarioAtual) * 10000) / 100
      : 0

  const sessoesEfetivasVal = Math.max(1, sessoesEfetivas || 54)
  const faturamentoMensalAntes = Math.round(honorarioAtual * sessoesEfetivasVal * 100) / 100
  const faturamentoMensalDepois = Math.round(novoHonorario * sessoesEfetivasVal * 100) / 100
  const deltaMensal = Math.round((faturamentoMensalDepois - faturamentoMensalAntes) * 100) / 100
  const deltaAnual = Math.round(deltaMensal * 12 * 100) / 100

  // Gera texto pronto para comunicação ética e empática com o paciente
  const saudacao = inputs.nomePaciente ? `Olá, ${inputs.nomePaciente}!` : 'Olá!'
  const assinatura = inputs.nomeProfissional || 'Sua Psicóloga'
  const mesTexto = inputs.mesReajuste || 'no próximo mês'

  const mensagemComunicado = `${saudacao}

Gostaria de compartilhar uma atualização importante sobre nosso acompanhamento clínico.

Conforme previsto em nosso acordo terapêutico inicial e alinhado às diretrizes éticas da prática psicológica, realizamos a atualização monetária anual dos honorários com base no índice oficial de inflação (${inputs.tipoIndice}: ${indicePct.toFixed(2)}%).

A partir de ${mesTexto}, o valor de cada atendimento passará de R$ ${honorarioAtual.toFixed(2).replace('.', ',')} para R$ ${novoHonorario.toFixed(2).replace('.', ',')}.

Essa atualização anual é fundamental para a sustentabilidade da clínica, manutenção dos investimentos em formação continuada e supervisão clínica, garantindo a dedicação e o cuidado ético que ofereço aos nossos encontros.

Seguimos à disposição caso queira conversar a respeito. Agradeço imensamente pela confiança depositada no nosso processo terapêutico!

Um abraço afetuoso,
${assinatura}`

  return {
    honorarioAtual,
    indiceEfetivoPct: indicePct,
    fatorMultiplicador,
    novoHonorario,
    deltaAbsolutoSessao,
    deltaPercentualTotal,
    sessoesEfetivasMes: sessoesEfetivasVal,
    faturamentoMensalAntes,
    faturamentoMensalDepois,
    deltaMensal,
    deltaAnual,
    mensagemComunicado,
  }
}
