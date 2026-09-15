import { PricingState, CalculationResult, CFP_VALUES } from '@/types/pricing'
import { formatBRL, formatNumberBR } from '@/lib/currency'

export type InsightCategory =
  | 'tributos'
  | 'faltas'
  | 'deficit'
  | 'superavit'
  | 'capacidade'
  | 'retirada'
  | 'cfp'
  | 'reajuste'
  | 'reserva'

export type InsightPriority = 'alta' | 'media' | 'baixa'

export type ActionTarget =
  | 'tab_tributario'
  | 'tab_planejamento'
  | 'tab_reajuste'
  | 'tab_contrato'
  | 'step_capacidade'
  | 'step_retirada'
  | 'step_tributos'
  | 'scroll_sensibilidade'
  | 'scroll_meta'

export interface StrategicInsight {
  id: string
  category: InsightCategory
  priority: InsightPriority
  title: string
  description: string
  metricBadge?: {
    label: string
    value: string
    variant?: 'rose' | 'amber' | 'emerald' | 'purple' | 'slate'
  }
  recommendation: string
  action?: {
    label: string
    target: ActionTarget
    tab?: 'tributario' | 'planejamento' | 'reajuste' | 'contrato'
    step?: number
    anchorId?: string
  }
}

/**
 * Deriva insights acionáveis, concisos e escaneáveis a partir dos cálculos do Método FAC.
 * Priorizados por impacto na sustentabilidade e saúde clínica do profissional.
 */
export function generateStrategicInsights(
  state: PricingState,
  calc: CalculationResult,
): StrategicInsight[] {
  const insights: StrategicInsight[] = []

  // Se cálculo estiver travado
  if (calc.isBlocked) {
    insights.push({
      id: 'blocked_calculation',
      category: 'tributos',
      priority: 'alta',
      title: 'Cálculo financeiro bloqueado',
      description: `A soma de reserva (${state.reservaPct}%) e tributos (${state.tributosPct}%) atingiu ou superou 100%, inviabilizando o divisor da fórmula FAC.`,
      recommendation: 'Reduza a alíquota de reserva e impostos para restaurar um divisor positivo.',
      action: {
        label: 'Ajustar no Passo 4',
        target: 'step_tributos',
        step: 4,
      },
    })
    return insights
  }

  // 1. DÉFICIT CLÍNICO (se preço atual cadastrado < piso mínimo)
  if (calc.hasPrecoAtual && calc.isDeficit) {
    const deltaSessao = calc.deltaSessao
    const gapAnual = calc.prejuizoAnualProjetado
    const pctGap = state.precoAtual > 0 ? ((deltaSessao / state.precoAtual) * 100).toFixed(0) : '0'

    insights.push({
      id: 'deficit_clinico',
      category: 'deficit',
      priority: 'alta',
      title: 'Honorário atual abaixo do Piso Ético',
      description: `Você cobra ${formatBRL(state.precoAtual)}/sessão, mas seu piso ético calculado é de ${formatBRL(calc.pisoMinimoSessao)}/sessão (defasagem de ${formatBRL(deltaSessao)} ou -${pctGap}% por atendimento).`,
      metricBadge: {
        label: 'Prejuízo anual estimado',
        value: `-${formatBRL(gapAnual)}`,
        variant: 'rose',
      },
      recommendation:
        'Cada atendimento abaixo do piso financia seu consultório com desgaste pessoal. Institua o piso para novos pacientes e reajuste gradualmente os atuais.',
      action: {
        label: 'Simular Reajuste Anual',
        target: 'tab_reajuste',
        tab: 'reajuste',
      },
    })
  }

  // 2. PARCELA DE RESERVA E TRIBUTOS ELEVADA (Transição Tributária PF x PJ)
  // Se pctReservaTributos >= 20% ou se soma de impostos + reserva >= 21%
  const somaReservaTributosPct = state.reservaPct + state.tributosPct
  if (somaReservaTributosPct >= 20 || calc.pctReservaTributos >= 20) {
    const valorReservaTributosSessao = calc.decompReservaTributosPorSessao
    const valorReservaTributosMes = valorReservaTributosSessao * calc.sessoesEfetivas

    insights.push({
      id: 'tributacao_elevada',
      category: 'tributos',
      priority: calc.faturamentoBruto >= 7000 ? 'alta' : 'media',
      title: 'Impacto de Reserva & Tributos no Honorário',
      description: `R$ ${formatNumberBR(valorReservaTributosSessao, 2)} de cada sessão (${calc.pctReservaTributos.toFixed(1)}% do piso) é retido para impostos e reserva técnica (total de ${formatBRL(valorReservaTributosMes)}/mês).`,
      metricBadge: {
        label: 'Fatia por sessão',
        value: `${calc.pctReservaTributos.toFixed(1)}%`,
        variant: 'amber',
      },
      recommendation:
        calc.faturamentoBruto >= 6000
          ? 'Com seu faturamento projetado, abrir uma PJ no Simples Nacional com benefício do Fator R (Anexo III a 6%) pode economizar milhares de reais por ano em relação ao Carnê-Leão (PF 27,5%).'
          : 'Avalie a dedução completa das suas despesas profissionais no Livro-Caixa ou a abertura de CNPJ para estancar perdas tributárias.',
      action: {
        label: 'Ver Transição PF×PJ',
        target: 'tab_tributario',
        tab: 'tributario',
      },
    })
  }

  // 3. TAXA DE FALTA ELEVADA / EVASÃO DE RECEITA
  if (state.taxaFaltaPct >= 10 && calc.sessoesAgendadas > 0) {
    // Quantificar perda financeira mensal com faltas:
    // sessoes perdidas = S_agendadas * taxaFalta
    // perda mensal = sessoes perdidas * pisoMinimoSessao
    const sessoesPerdidasMes = calc.sessoesAgendadas - calc.sessoesEfetivas
    const perdaFinanceiraMes = sessoesPerdidasMes * calc.pisoMinimoSessao
    const perdaFinanceiraAno = perdaFinanceiraMes * 12

    insights.push({
      id: 'taxa_falta_alta',
      category: 'faltas',
      priority: state.taxaFaltaPct >= 15 ? 'alta' : 'media',
      title: `Evasão de Receita por Faltas (${state.taxaFaltaPct}%)`,
      description: `Você perde cerca de ${formatNumberBR(sessoesPerdidasMes, 1)} sessões todo mês devido a desmarcações não compensadas, o que drena ${formatBRL(perdaFinanceiraMes)}/mês do seu caixa.`,
      metricBadge: {
        label: 'Perda anual por faltas',
        value: `-${formatBRL(perdaFinanceiraAno)}`,
        variant: 'amber',
      },
      recommendation:
        'Formalize um contrato terapêutico com cláusula de política de faltas (cobrança integral ou aviso prévio mínimo de 24h) para proteger seu tempo reservado.',
      action: {
        label: 'Gerar Contrato com Cláusula 24h',
        target: 'tab_contrato',
        tab: 'contrato',
      },
    })
  } else if (state.taxaFaltaPct === 0) {
    insights.push({
      id: 'taxa_falta_zero',
      category: 'faltas',
      priority: 'baixa',
      title: 'Taxa de faltas em 0% (Pressuposto arriscado)',
      description:
        'Mesmo as clínicas mais estruturadas enfrentam imprevistos, atestados e cancelamentos pontuais de última hora.',
      recommendation:
        'Recomendamos simular pelo menos 5% a 10% de faltas na Análise de Sensibilidade para ter uma reserva de segurança operacional.',
      action: {
        label: 'Testar Sensibilidade',
        target: 'scroll_sensibilidade',
        anchorId: 'sensibilidade-section',
      },
    })
  }

  // 4. CARGA HORÁRIA / ALERTA DE BURNOUT OU CAPACIDADE OCIOSA
  if (state.sessoesPorSemana > 28) {
    insights.push({
      id: 'burnout_alerta',
      category: 'capacidade',
      priority: 'alta',
      title: 'Alerta Crítico: Risco de Burnout (>28 sessões/sem)',
      description: `Sua grade prevê ${state.sessoesPorSemana} atendimentos/semana. Considerando que cada atendimento exige ~1,5h (escuta + prontuário + supervisão + estudo), você está dedicando ${formatNumberBR(state.sessoesPorSemana * 1.5, 1)}h semanais à clínica.`,
      metricBadge: {
        label: 'Carga semanal real',
        value: `${formatNumberBR(state.sessoesPorSemana * 1.5, 1)}h/sem`,
        variant: 'rose',
      },
      recommendation:
        'A longo prazo, agendas superlotadas comprometem a qualidade da escuta e a saúde do terapeuta. O caminho ético FAC é elevar o valor da sessão para reduzir a carga horária mantendo o mesmo faturamento.',
      action: {
        label: 'Ajustar Meta no Planejador',
        target: 'scroll_meta',
        anchorId: 'meta-section',
      },
    })
  } else if (state.sessoesPorSemana < 12 && state.sessoesPorSemana > 0) {
    insights.push({
      id: 'capacidade_ociosa',
      category: 'capacidade',
      priority: 'media',
      title: 'Grade Enxuta / Capacidade Ociosa',
      description: `Com apenas ${state.sessoesPorSemana} sessões/semana, os custos fixos do consultório e sua vida pessoal são divididos por poucos atendimentos, elevando o piso unitário (${formatBRL(calc.pisoMinimoSessao)}/sessão).`,
      metricBadge: {
        label: 'Sessões semanais',
        value: `${state.sessoesPorSemana} sessões`,
        variant: 'purple',
      },
      recommendation:
        'Se você tiver disponibilidade de agenda, aumentar gradualmente para 16 a 20 sessões/semana dilui custos fixos e amplia sua margem de segurança.',
      action: {
        label: 'Simular no Planejador Reverso',
        target: 'scroll_meta',
        anchorId: 'meta-section',
      },
    })
  }

  // 5. MARGEM DE SEGURANÇA E SUPERÁVIT (se preço atual > piso)
  if (calc.hasPrecoAtual && !calc.isDeficit && state.precoAtual > calc.pisoMinimoSessao) {
    const superavitMensal = Math.abs(calc.deltaMensal)
    const superavitAnual = superavitMensal * 12
    const margemSessao = Math.abs(calc.deltaSessao)

    insights.push({
      id: 'superavit_clinico',
      category: 'superavit',
      priority: 'media',
      title: 'Clínica Superavitária (Acima do Piso)',
      description: `Seu valor atual (${formatBRL(state.precoAtual)}) tem margem positiva de +${formatBRL(margemSessao)} por atendimento sobre o piso mínimo ético, gerando um superávit de ${formatBRL(superavitMensal)}/mês.`,
      metricBadge: {
        label: 'Excedente anual',
        value: `+${formatBRL(superavitAnual)}`,
        variant: 'emerald',
      },
      recommendation:
        'Destine estrategicamente esse excedente para formação continuada de ponta, supervisores sênior, marketing ético e previdência privada para consolidar seu patrimônio.',
      action: {
        label: 'Formalizar em Contrato',
        target: 'tab_contrato',
        tab: 'contrato',
      },
    })
  }

  // 6. RETIRADA (PRÓ-LABORE) VS. CUSTOS DE SOBREVIVÊNCIA
  if (calc.baseB > 0) {
    const pctRetiradaNaBase = (calc.retiradaDesejada / calc.baseB) * 100

    if (calc.retiradaDesejada === 0) {
      insights.push({
        id: 'retirada_zerada',
        category: 'retirada',
        priority: 'alta',
        title: 'Pró-Labore Pessoal não Cadastrado',
        description:
          'Você não incluiu uma retirada desejada no Passo 3. Seu piso calculado cobre apenas custos fixos, sem remunerar sua formação, estudo e bem-estar.',
        recommendation:
          'A clínica existe para sustentar uma vida digna. Cadastre um pró-labore justo para que seu preço reflita a recompensa pelo seu trabalho.',
        action: {
          label: 'Definir Retirada no Passo 3',
          target: 'step_retirada',
          step: 3,
        },
      })
    } else if (pctRetiradaNaBase < 25) {
      insights.push({
        id: 'retirada_baixa',
        category: 'retirada',
        priority: 'media',
        title: 'Retirada representa fatia modesta da base',
        description: `Sua retirada desejada (${formatBRL(calc.retiradaDesejada)}) é de apenas ${pctRetiradaNaBase.toFixed(0)}% das suas despesas totais. A maior parte do faturamento está consumida por custos fixos e profissionais.`,
        metricBadge: {
          label: 'Fatia de Retirada',
          value: `${pctRetiradaNaBase.toFixed(0)}% da base`,
          variant: 'amber',
        },
        recommendation:
          'Conforme auditar e otimizar custos com softwares e sublocação, canalize o ganho para elevar seu pró-labore sem precisar aumentar seu esforço em horas de atendimento.',
        action: {
          label: 'Ver Planejamento Financeiro',
          target: 'tab_planejamento',
          tab: 'planejamento',
        },
      })
    }
  }
  // 7. COMPARATIVO COM TABELA CFP (Posicionamento Ético)
  if (calc.pisoMinimoSessao > 0) {
    if (calc.cfpFaixaAtingida === 'abaixo') {
      const distInferior = CFP_VALUES.inferior - calc.pisoMinimoSessao
      insights.push({
        id: 'cfp_abaixo_inferior',
        category: 'cfp',
        priority: 'media',
        title: 'Piso FAC abaixo da Faixa Inferior CFP',
        description: `Seu piso mínimo calculado (${formatBRL(calc.pisoMinimoSessao)}) está ${formatBRL(distInferior)} abaixo da referência mínima da Tabela de Honorários do CFP (${formatBRL(CFP_VALUES.inferior)}).`,
        metricBadge: {
          label: 'Referência Inferior CFP',
          value: formatBRL(CFP_VALUES.inferior),
          variant: 'amber',
        },
        recommendation:
          'Embora a Tabela CFP seja uma referência estatística de mercado e não piso impositivo, ela indica que seu trabalho pode estar subprecificado em relação ao panorama nacional da categoria.',
        action: {
          label: 'Simular Reajuste de Honorários',
          target: 'tab_reajuste',
          tab: 'reajuste',
        },
      })
    } else if (calc.cfpFaixaAtingida === 'superior') {
      insights.push({
        id: 'cfp_posicionamento_superior',
        category: 'cfp',
        priority: 'baixa',
        title: 'Piso FAC alinhado à Faixa Superior CFP',
        description: `Seu piso (${formatBRL(calc.pisoMinimoSessao)}) enquadra-se no topo das diretrizes de mercado do CFP (${formatBRL(CFP_VALUES.superior)}).`,
        metricBadge: {
          label: 'Faixa CFP',
          value: 'Superior (Alta Qualificação)',
          variant: 'purple',
        },
        recommendation:
          'Sustente esse patamar com posicionamento nítido, comunicação clara de nicho e propostas contratuais impecáveis.',
        action: {
          label: 'Ver Proposta Contratual',
          target: 'tab_contrato',
          tab: 'contrato',
        },
      })
    }
  }

  // 8. REAJUSTE ANUAL / DEFASAGEM INFLACIONÁRIA
  // Se preço atual foi informado e já está ativo
  if (calc.hasPrecoAtual) {
    // Estimativa de perda se não houver reajuste com IPCA médio (ex: 4,83% a.a.)
    const inflacaoReferenciaPct = 4.83
    const ganhoReajusteMes = state.precoAtual * (inflacaoReferenciaPct / 100) * calc.sessoesEfetivas
    const ganhoReajusteAno = ganhoReajusteMes * 12

    insights.push({
      id: 'reajuste_inflacao_preventivo',
      category: 'reajuste',
      priority: 'baixa',
      title: 'Recomposição Inflacionária Anual',
      description: `Aplicar a inflação oficial (IPCA acumulado recente de +${formatNumberBR(inflacaoReferenciaPct, 2)}%) aos seus atendimentos preserva seu poder de compra e injeta +${formatBRL(ganhoReajusteAno)}/ano no consultório.`,
      metricBadge: {
        label: 'Ganho anual recomposto',
        value: `+${formatBRL(ganhoReajusteAno)}`,
        variant: 'emerald',
      },
      recommendation:
        'Não espere o paciente questionar. Adote comunicação preventiva e estruturada com modelos de carta e WhatsApp prontos.',
      action: {
        label: 'Abrir Módulo de Reajuste',
        target: 'tab_reajuste',
        tab: 'reajuste',
      },
    })
  }

  // Ordenação por prioridade: alta primeiro, depois media, depois baixa
  const priorityOrder: Record<InsightPriority, number> = {
    alta: 1,
    media: 2,
    baixa: 3,
  }

  return insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}
