import { CalculationResult } from '@/types/pricing'
import { formatBRL } from '@/lib/currency'

export interface ChatMessage {
  id: string
  sender: 'advisor' | 'user'
  text: string
  bullets?: string[]
  timestamp: string
}

export function generateInitialDiagnostic(result: CalculationResult): {
  text: string
  bullets: string[]
} {
  const isDeficit = result.isDeficit
  const piso = formatBRL(result.pisoMinimoSessao)
  const fBruto = formatBRL(result.faturamentoBruto)

  if (result.isBlocked) {
    return {
      text: 'Atenção Crítica: O cálculo financeiro está travado devido à alíquota de reserva + tributos somar 100% ou mais.',
      bullets: [
        'Ajuste suas porcentagens no Passo 4 para continuar.',
        'A soma de reserva + impostos deve permitir um divisor positivo.',
      ],
    }
  }

  if (isDeficit) {
    const delta = formatBRL(result.deltaSessao)
    const perdaAnual = formatBRL(result.prejuizoAnualProjetado)
    return {
      text: `Diagnóstico: Sua clínica está em Déficit Clínico em relação ao Piso Ético. Você está cobrando ${delta} a menos por sessão do que o necessário para cobrir seu custo de vida digno, gerando um déficit anual projetado de ${perdaAnual}.`,
      bullets: [
        `Seu piso ético calculado pelo Método FAC é de ${piso} por sessão (com faturamento bruto mensal alvo de ${fBruto}).`,
        'Elabore um plano de transição para reajustar novos pacientes diretamente no piso ético.',
        'Para pacientes antigos, considere um cronograma de reajuste com aviso prévio de 60 dias.',
        'Mantenha sua reserva técnica de 10% intocada para proteger períodos de baixa adesão.',
      ],
    }
  }

  if (result.hasPrecoAtual && !result.isDeficit) {
    return {
      text: `Diagnóstico: Excelente! Sua clínica está Sustentável e operando Acima do Piso Ético (${piso}/sessão).`,
      bullets: [
        'Sua precificação cobre com folga seus custos pessoais, despesas da prática e pró-labore.',
        'Recomendamos destinar o excedente para sua reserva de expansão, formação continuada ou previdência privada.',
        'Mantenha vigilância sobre sua taxa de falta e absenteísmo para não erodir essa margem.',
      ],
    }
  }

  return {
    text: `Diagnóstico: Seu Piso Ético Mínimo Calculado é de ${piso} por atendimento, exigindo um Faturamento Bruto de ${fBruto} ao mês.`,
    bullets: [
      'Cadastre seu preço atual de sessão para visualizar a análise detalhada de lacuna (gap analysis).',
      'Lembre-se: cobrar abaixo do piso ético significa subsidiar os atendimentos com o próprio desgaste pessoal.',
      'Explore as abas de decomposição para ver onde cada real da sua sessão é investido.',
    ],
  }
}

export function answerHeuristicQuestion(
  question: string,
  result: CalculationResult,
): { text: string; bullets: string[] } {
  const q = question.toLowerCase()
  const piso = formatBRL(result.pisoMinimoSessao)

  // 1. Reajustar pacientes antigos
  if (
    q.includes('reajustar') ||
    q.includes('pacientes antigos') ||
    q.includes('aumentar valor') ||
    q.includes('reajuste')
  ) {
    return {
      text: 'O reajuste de pacientes em atendimento contínuo deve aliar firmeza ética e cuidado relacional:',
      bullets: [
        'Aviso prévio transparente: comunique o reajuste com pelo menos 45 a 60 dias de antecedência, justificando a recomposição de custos inflacionários e formação continuada.',
        'Contrato terapêutico: formalize no enquadre que os honorários passam por revisão anual programada em mês fixo (ex: janeiro ou março).',
        `Meta gradual: se o salto para o piso (${piso}) for muito acentuado, aplique uma transição em duas etapas ao longo do semestre.`,
        'Postura ética: honorário justo é parte do vínculo clínico e da sustentabilidade do psicólogo, sem culpa.',
      ],
    }
  }

  // 2. Captação de particulares
  if (
    q.includes('captar') ||
    q.includes('particulares') ||
    q.includes('atrair') ||
    q.includes('novos clientes')
  ) {
    return {
      text: 'A transição para pacientes particulares de alto alinhamento exige posicionamento e consistência:',
      bullets: [
        'Posicionamento de nicho claro: comunique com profundidade as demandas em que você tem excelência e formação sólida.',
        'Presença profissional consistente: tenha página própria, perfil no Google Meu Negócio e conteúdos pedagógicos que demonstrem autoridade ética.',
        'Rede de encaminhamento mútuo: estabeleça pontes com psiquiatras, neurologistas, nutricionistas e colegas de outras abordagens.',
        `Âncora no piso ético: novos contatos já devem receber o valor integral de ${piso} como piso oficial de acolhimento.`,
      ],
    }
  }

  // 3. Abaixo do piso / o que fazer
  if (
    q.includes('abaixo do piso') ||
    q.includes('déficit') ||
    q.includes('prejuízo') ||
    q.includes('o que fazer') ||
    q.includes('socorro')
  ) {
    return {
      text: `Estar abaixo do piso ético (${piso}) é um sinal de alerta para a sustentabilidade da sua carreira clínica:`,
      bullets: [
        'Estanque a entrada: feche o enquadre para qualquer novo paciente com valor abaixo do piso calculado.',
        'Auditoria de custos: revise despesas profissionais fixas (softwares ociosos, sublocação mal aproveitada) para reduzir o Faturamento Bruto necessário.',
        'Política contra faltas: institua aviso prévio de 24h ou cobrança regular de sessão contratada para blindar os 10% de evasão.',
        'Substituição gradativa: conforme pacientes de convênio ou valores sociais encerrarem o processo, preencha as vagas exclusivamente com honorário pleno.',
      ],
    }
  }

  // 4. Organização de reserva
  if (
    q.includes('reserva') ||
    q.includes('emergência') ||
    q.includes('13º') ||
    q.includes('férias') ||
    q.includes('manejo')
  ) {
    return {
      text: 'O Método FAC preconiza uma separação rigorosa entre pessoa física e clínica:',
      bullets: [
        'Conta jurídica separada (PJ/PF): receba 100% dos honorários em conta específica da atividade clínica.',
        'Retenção imediata de 10%: ao receber, transfira automaticamente a parcela de reserva técnica para um fundo de renda fixa líquida (CDB 100% CDI ou Tesouro Selic).',
        'Fundo de 3 a 6 meses: sua reserva deve cobrir seus custos fixos mensais para garantir férias remuneradas e tranquilidade em dezembro/janeiro.',
        'Tributos provisionados: separe a alíquota mensal calculada antes de realizar a retirada (pró-labore).',
      ],
    }
  }

  // 5. Burnout e carga horária
  if (
    q.includes('burnout') ||
    q.includes('cansaço') ||
    q.includes('exaustão') ||
    q.includes('muitas sessões') ||
    q.includes('agenda cheia')
  ) {
    return {
      text: 'A armadilha da agenda superlotada é a causa primária de adoecimento profissional na psicologia:',
      bullets: [
        'Regra de ouro FAC: 1 sessão clínica equivale a 1,5h de trabalho real (atendimento + prontuário + supervisão + estudo).',
        '20 sessões semanais representam 30 horas dedicadas; 28 sessões já colocam você em sobrecarga crítica.',
        'O caminho ético para aumentar o faturamento nunca é abrir mais horários na madrugada ou finais de semana, mas valorizar a hora de sessão.',
      ],
    }
  }

  // 6. Resposta padrão inteligente
  return {
    text: `Analisando seu enquadre atual no Método FAC (Piso: ${piso}/sessão):`,
    bullets: [
      'Estruture seus custos fixos para manter a previsibilidade financeira mês a mês.',
      'Sua precificação deve refletir sua qualificação, supervisão contínua e o compromisso ético do Código do CFP.',
      'Utilize o Planejador Reverso e a Análise de Sensibilidade no painel para simular diferentes cenários de carga de trabalho.',
      'Qualquer dúvida específica sobre pacientes antigos, captação ou reservas pode ser digitada aqui.',
    ],
  }
}
