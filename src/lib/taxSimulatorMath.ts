/**
 * Motor de cálculos tributários comparativos para psicólogas:
 * Pessoa Física com Livro-Caixa (Carnê-Leão) vs. Pessoa Jurídica no Simples Nacional (Anexo III vs. Anexo V - Fator R)
 *
 * Fontes oficiais e parâmetros vigentes:
 * - IRPF Tabela Progressiva Mensal 2025 (Lei nº 14.663/2023 e IN RFB):
 *   Até R$ 2.259,20: Isento
 *   De R$ 2.259,21 a R$ 2.826,65: 7,5% (dedução R$ 169,44)
 *   De R$ 2.826,66 a R$ 3.751,05: 15,0% (dedução R$ 381,44)
 *   De R$ 3.751,06 a R$ 4.664,68: 22,5% (dedução R$ 662,77)
 *   Acima de R$ 4.664,68: 27,5% (dedução R$ 896,00)
 *   Dedução mensal por dependente: R$ 189,59
 *   Desconto simplificado mensal alternativo: R$ 564,80 (se mais vantajoso que deduções legais)
 *
 * - Previdência Social / INSS 2025:
 *   Salário Mínimo: R$ 1.518,00
 *   Teto Previdenciário: R$ 8.157,41
 *   PF Autônomo (Carnê-Leão): alíquota 20% sobre o salário de contribuição (limitado ao teto) = até R$ 1.631,48
 *   PJ Pró-labore: retenção INSS 11% sobre pró-labore limitado ao teto (até R$ 897,32).
 *   No Anexo III e V do Simples Nacional, a CPP patronal (20%) já está embutida no DAS (repartição do DAS),
 *   salvo no Anexo IV.
 *
 * - Simples Nacional (LC 123/2006):
 *   Fator R = Folha de Salários com encargos (pró-labore + INSS) / Receita Bruta dos últimos 12 meses (RBT12)
 *   Se Fator R >= 0,28 (28%) -> Anexo III
 *   Se Fator R < 0,28 -> Anexo V
 *   Alíquota efetiva = (RBT12 × Alíquota Nominal - Parcela a Deduzir) / RBT12
 *   DAS mensal = Faturamento Mensal × Alíquota efetiva
 */

export interface IrpfBracket {
  limit: number // limite superior da faixa
  rate: number // alíquota percentual decimal (ex 0.075)
  deduction: number // dedução em reais
}

export const IRPF_2025_BRACKETS: IrpfBracket[] = [
  { limit: 2259.2, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Infinity, rate: 0.275, deduction: 896.0 },
]

export const DEDUCAO_MENSAL_DEPENDENTE = 189.59
export const DESCONTO_SIMPLIFICADO_MENSAL_IRPF = 564.8
export const SALARIO_MINIMO_2025 = 1518.0
export const TETO_INSS_2025 = 8157.41
export const ALIQUOTA_INSS_AUTONOMO_PF = 0.2 // 20%
export const ALIQUOTA_INSS_PRO_LABORE_PJ = 0.11 // 11%

export interface SimplesBracket {
  faixa: number
  limiteRBT12: number
  aliquotaNominal: number // ex: 0.06
  parcelaDeduzir: number // em R$
}

export const ANEXO_III_BRACKETS: SimplesBracket[] = [
  { faixa: 1, limiteRBT12: 180000, aliquotaNominal: 0.06, parcelaDeduzir: 0 },
  { faixa: 2, limiteRBT12: 360000, aliquotaNominal: 0.112, parcelaDeduzir: 9360 },
  { faixa: 3, limiteRBT12: 720000, aliquotaNominal: 0.135, parcelaDeduzir: 17640 },
  { faixa: 4, limiteRBT12: 1800000, aliquotaNominal: 0.16, parcelaDeduzir: 35640 },
  { faixa: 5, limiteRBT12: 3600000, aliquotaNominal: 0.21, parcelaDeduzir: 125640 },
  { faixa: 6, limiteRBT12: 4800000, aliquotaNominal: 0.33, parcelaDeduzir: 648000 },
]

export const ANEXO_V_BRACKETS: SimplesBracket[] = [
  { faixa: 1, limiteRBT12: 180000, aliquotaNominal: 0.155, parcelaDeduzir: 0 },
  { faixa: 2, limiteRBT12: 360000, aliquotaNominal: 0.18, parcelaDeduzir: 4500 },
  { faixa: 3, limiteRBT12: 720000, aliquotaNominal: 0.195, parcelaDeduzir: 9900 },
  { faixa: 4, limiteRBT12: 1800000, aliquotaNominal: 0.205, parcelaDeduzir: 17100 },
  { faixa: 5, limiteRBT12: 3600000, aliquotaNominal: 0.23, parcelaDeduzir: 62100 },
  { faixa: 6, limiteRBT12: 4800000, aliquotaNominal: 0.305, parcelaDeduzir: 540000 },
]

export interface TaxSimulatorInputs {
  faturamentoBrutoMensal: number
  despesasDedutiveisLivroCaixa: number
  numeroDependentes: number
  salarioContribuicaoPf: number // Base para INSS PF (mínimo R$ 1.518, teto R$ 8.157,41)
  proLaborePct: number // % do faturamento para pró-labore PJ (default 28%)
  incluirReservaFac: boolean
  reservaPct: number // reserva técnica FAC em % (ex: 10%)
}

export interface TaxSimulatorResult {
  // Entradas normalizadas
  faturamentoMensal: number
  rbt12: number

  // Pessoa Física (Carnê-Leão + Livro Caixa)
  pf: {
    faturamento: number
    despesasLivroCaixa: number
    deducaoDependentes: number
    inssPf: number
    baseCalculoIrpf: number
    baseCalculoSimplificado: number
    usouSimplificado: boolean
    irpfMensal: number
    totalTributosMensal: number
    aliquotaEfetivaPct: number
    liquidoMensal: number
    totalTributosAnual: number
    liquidoAnual: number
  }

  // Pessoa Jurídica (Simples Nacional)
  pj: {
    faturamento: number
    proLaboreMensal: number
    inssProLabore: number
    irpfProLabore: number
    folhaTotal: number // pró-labore + encargos
    fatorR: number // folhaTotal / faturamento
    enquadramentoAnexo: 'Anexo III' | 'Anexo V'
    faixaSimples: number
    aliquotaNominal: number
    parcelaDeduzir: number
    aliquotaEfetivaDasPct: number
    dasMensal: number
    totalTributosMensal: number // DAS + INSS Pró-labore + IRPF Pró-labore
    aliquotaEfetivaTotalPct: number
    reservaFacMensal: number
    liquidoMensal: number
    totalTributosAnual: number
    liquidoAnual: number
  }

  // Comparativo
  comparativo: {
    regimeVencedor: 'PF' | 'PJ' | 'EMPATE'
    economiaMensal: number
    economiaAnual: number
    diferencaAliquotaPct: number // diferença percentual da alíquota efetiva
    mensagemVeredito: string
  }
}

/**
 * Calcula o imposto de renda progressivo mensal (IRPF)
 */
export function calculateIrpfMensal(baseCalculo: number): {
  imposto: number
  faixaIndex: number
  aliquota: number
  deducao: number
} {
  if (baseCalculo <= 0) {
    return { imposto: 0, faixaIndex: 0, aliquota: 0, deducao: 0 }
  }

  for (let i = 0; i < IRPF_2025_BRACKETS.length; i++) {
    const bracket = IRPF_2025_BRACKETS[i]
    if (baseCalculo <= bracket.limit) {
      const imposto = Math.max(0, baseCalculo * bracket.rate - bracket.deduction)
      return {
        imposto: Math.round(imposto * 100) / 100,
        faixaIndex: i,
        aliquota: bracket.rate,
        deducao: bracket.deduction,
      }
    }
  }

  const lastBracket = IRPF_2025_BRACKETS[IRPF_2025_BRACKETS.length - 1]
  const imposto = Math.max(0, baseCalculo * lastBracket.rate - lastBracket.deduction)
  return {
    imposto: Math.round(imposto * 100) / 100,
    faixaIndex: IRPF_2025_BRACKETS.length - 1,
    aliquota: lastBracket.rate,
    deducao: lastBracket.deduction,
  }
}

/**
 * Localiza a faixa e calcula a alíquota efetiva do Simples Nacional
 */
export function calculateSimplesDas(
  faturamentoMensal: number,
  anexo: 'III' | 'V',
): {
  faixa: number
  aliquotaNominal: number
  parcelaDeduzir: number
  aliquotaEfetivaPct: number
  dasMensal: number
} {
  const rbt12 = Math.max(faturamentoMensal * 12, 1)
  const brackets = anexo === 'III' ? ANEXO_III_BRACKETS : ANEXO_V_BRACKETS

  let bracket = brackets[0]
  for (const b of brackets) {
    if (rbt12 <= b.limiteRBT12) {
      bracket = b
      break
    }
    bracket = b // se exceder, pega a última faixa
  }

  // Alíquota efetiva = (RBT12 × Alíquota Nominal - Parcela Deduzir) / RBT12
  const aliquotaEfetiva = Math.max(
    0,
    (rbt12 * bracket.aliquotaNominal - bracket.parcelaDeduzir) / rbt12,
  )
  const aliquotaEfetivaPct = Math.round(aliquotaEfetiva * 10000) / 100
  const dasMensal = Math.round(faturamentoMensal * aliquotaEfetiva * 100) / 100

  return {
    faixa: bracket.faixa,
    aliquotaNominal: bracket.aliquotaNominal,
    parcelaDeduzir: bracket.parcelaDeduzir,
    aliquotaEfetivaPct,
    dasMensal,
  }
}

/**
 * Simula a tributação completa PF vs PJ
 */
export function simulateTaxTransition(inputs: TaxSimulatorInputs): TaxSimulatorResult {
  const faturamentoMensal = Math.max(0, inputs.faturamentoBrutoMensal || 0)
  const rbt12 = faturamentoMensal * 12

  // 1. CÁLCULO PESSOA FÍSICA (Carnê-Leão + Livro Caixa)
  // INSS autônomo: 20% sobre o salário de contribuição (limitado entre salário mínimo e teto)
  const baseInssPf = Math.min(
    TETO_INSS_2025,
    Math.max(SALARIO_MINIMO_2025, inputs.salarioContribuicaoPf || SALARIO_MINIMO_2025),
  )
  const inssPf = Math.round(baseInssPf * ALIQUOTA_INSS_AUTONOMO_PF * 100) / 100

  const deducaoDependentesPf =
    Math.max(0, inputs.numeroDependentes || 0) * DEDUCAO_MENSAL_DEPENDENTE
  const despesasLivroCaixa = Math.max(0, inputs.despesasDedutiveisLivroCaixa || 0)

  // Base com deduções legais = Faturamento - Despesas Livro Caixa - INSS - Dependentes
  const baseLegal = Math.max(
    0,
    faturamentoMensal - despesasLivroCaixa - inssPf - deducaoDependentesPf,
  )
  const irpfLegal = calculateIrpfMensal(baseLegal).imposto

  // Alternativa com desconto simplificado mensal (R$ 564,80) sobre os rendimentos tributáveis (Faturamento - Livro Caixa)
  const rendimentoTributavel = Math.max(0, faturamentoMensal - despesasLivroCaixa)
  const baseSimplificada = Math.max(0, rendimentoTributavel - DESCONTO_SIMPLIFICADO_MENSAL_IRPF)
  const irpfSimplificado = calculateIrpfMensal(baseSimplificada).imposto

  let irpfPfFinal = irpfLegal
  let baseFinalPf = baseLegal
  let usouSimplificado = false

  // Se o desconto simplificado produzir menor imposto, a Receita permite aplicar
  if (irpfSimplificado < irpfLegal && irpfSimplificado >= 0) {
    irpfPfFinal = irpfSimplificado
    baseFinalPf = baseSimplificada
    usouSimplificado = true
  }

  const totalTributosPfMensal = Math.round((irpfPfFinal + inssPf) * 100) / 100
  const aliquotaEfetivaPfPct =
    faturamentoMensal > 0
      ? Math.round((totalTributosPfMensal / faturamentoMensal) * 10000) / 100
      : 0
  const liquidoPfMensal = Math.max(
    0,
    Math.round((faturamentoMensal - totalTributosPfMensal - despesasLivroCaixa) * 100) / 100,
  )

  // 2. CÁLCULO PESSOA JURÍDICA (Simples Nacional)
  // Pró-labore mensal calculado pelo % informado (default 28% para Fator R)
  const proLaborePctDec = Math.max(5, Math.min(100, inputs.proLaborePct || 28)) / 100
  // Pró-labore não pode ser inferior a 1 salário mínimo se houver faturamento
  const proLaboreMensalCalc = faturamentoMensal * proLaborePctDec
  const proLaboreMensal =
    faturamentoMensal > 0
      ? Math.max(SALARIO_MINIMO_2025, Math.round(proLaboreMensalCalc * 100) / 100)
      : 0

  // INSS sobre o Pró-labore (11% retido, limitado ao teto)
  const baseInssPj = Math.min(TETO_INSS_2025, proLaboreMensal)
  const inssProLabore = Math.round(baseInssPj * ALIQUOTA_INSS_PRO_LABORE_PJ * 100) / 100

  // IRPF sobre o Pró-labore (base = pró-labore - INSS - dependentes)
  const baseIrpfPj = Math.max(0, proLaboreMensal - inssProLabore - deducaoDependentesPf)
  const irpfProLabore = calculateIrpfMensal(baseIrpfPj).imposto

  // Fator R = (Folha de Salários + encargos) / Faturamento
  const folhaTotal = proLaboreMensal + inssProLabore
  const fatorR = faturamentoMensal > 0 ? folhaTotal / faturamentoMensal : 0
  const enquadramentoAnexo: 'Anexo III' | 'Anexo V' = fatorR >= 0.28 ? 'Anexo III' : 'Anexo V'

  const simplesDasResult = calculateSimplesDas(
    faturamentoMensal,
    enquadramentoAnexo === 'Anexo III' ? 'III' : 'V',
  )

  const totalTributosPjMensal =
    Math.round((simplesDasResult.dasMensal + inssProLabore + irpfProLabore) * 100) / 100
  const aliquotaEfetivaPjPct =
    faturamentoMensal > 0
      ? Math.round((totalTributosPjMensal / faturamentoMensal) * 10000) / 100
      : 0

  // Reserva FAC se selecionada
  const reservaFacMensal = inputs.incluirReservaFac
    ? Math.round(faturamentoMensal * ((inputs.reservaPct || 10) / 100) * 100) / 100
    : 0

  // No Simples Nacional, os lucros distribuídos após apuração contábil são isentos de IRPF
  const liquidoPjMensal = Math.max(
    0,
    Math.round(
      (faturamentoMensal - totalTributosPjMensal - despesasLivroCaixa - reservaFacMensal) * 100,
    ) / 100,
  )

  // 3. COMPARATIVO & VEREDITO
  const economiaMensal =
    Math.round(Math.abs(totalTributosPfMensal - totalTributosPjMensal) * 100) / 100
  const economiaAnual = Math.round(economiaMensal * 12 * 100) / 100
  const diferencaAliquotaPct =
    Math.round(Math.abs(aliquotaEfetivaPfPct - aliquotaEfetivaPjPct) * 100) / 100

  let regimeVencedor: 'PF' | 'PJ' | 'EMPATE' = 'EMPATE'
  let mensagemVeredito = ''

  if (totalTributosPfMensal > totalTributosPjMensal) {
    regimeVencedor = 'PJ'
    mensagemVeredito = `Neste perfil, abrir PJ no Simples Nacional (${enquadramentoAnexo}) economiza R$ ${economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês — cerca de R$ ${economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ao ano em impostos.`
  } else if (totalTributosPjMensal > totalTributosPfMensal) {
    regimeVencedor = 'PF'
    mensagemVeredito = `Neste perfil, atuar como Pessoa Física com Carnê-Leão e Livro-Caixa é mais vantajoso, economizando R$ ${economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês (R$ ${economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano).`
  } else {
    regimeVencedor = 'EMPATE'
    mensagemVeredito =
      'A carga tributária estimada é equivalente entre Pessoa Física e Jurídica para este faturamento.'
  }

  return {
    faturamentoMensal,
    rbt12,
    pf: {
      faturamento: faturamentoMensal,
      despesasLivroCaixa,
      deducaoDependentes: deducaoDependentesPf,
      inssPf,
      baseCalculoIrpf: baseFinalPf,
      baseCalculoSimplificado: baseSimplificada,
      usouSimplificado,
      irpfMensal: irpfPfFinal,
      totalTributosMensal: totalTributosPfMensal,
      aliquotaEfetivaPct: aliquotaEfetivaPfPct,
      liquidoMensal: liquidoPfMensal,
      totalTributosAnual: Math.round(totalTributosPfMensal * 12 * 100) / 100,
      liquidoAnual: Math.round(liquidoPfMensal * 12 * 100) / 100,
    },
    pj: {
      faturamento: faturamentoMensal,
      proLaboreMensal,
      inssProLabore,
      irpfProLabore,
      folhaTotal,
      fatorR,
      enquadramentoAnexo,
      faixaSimples: simplesDasResult.faixa,
      aliquotaNominal: simplesDasResult.aliquotaNominal,
      parcelaDeduzir: simplesDasResult.parcelaDeduzir,
      aliquotaEfetivaDasPct: simplesDasResult.aliquotaEfetivaPct,
      dasMensal: simplesDasResult.dasMensal,
      totalTributosMensal: totalTributosPjMensal,
      aliquotaEfetivaTotalPct: aliquotaEfetivaPjPct,
      reservaFacMensal,
      liquidoMensal: liquidoPjMensal,
      totalTributosAnual: Math.round(totalTributosPjMensal * 12 * 100) / 100,
      liquidoAnual: Math.round(liquidoPjMensal * 12 * 100) / 100,
    },
    comparativo: {
      regimeVencedor,
      economiaMensal,
      economiaAnual,
      diferencaAliquotaPct,
      mensagemVeredito,
    },
  }
}
