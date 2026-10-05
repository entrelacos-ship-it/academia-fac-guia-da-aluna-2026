/**
 * Configuração e Conteúdo Editorial do Guia da Aluna da Academia Método FAC
 *
 * Regras editoriais da Entrelaços:
 * - Tom: claro, firme, acolhedor, sem jargão de coach, sem culpar a aluna
 * - A precarização é estrutural, não falha individual
 * - NENHUM texto promete resultado financeiro ou de agenda
 * - SEM travessões longos em nenhum texto do app
 */

export type PilarId = 'fundacao' | 'atracao' | 'conexao'

export interface PilarDefinition {
  id: PilarId
  nome: string
  descricaoCurta: string
  foco: string
}

export const PILARES_DEFINITIONS: Record<PilarId, PilarDefinition> = {
  fundacao: {
    id: 'fundacao',
    nome: 'Fundação (F)',
    descricaoCurta:
      'Piso ético, sustentabilidade financeira, contratos claros e capacidade semanal de trabalho.',
    foco: 'Sustentação estrutural da prática clínica para evitar o esgotamento e a precariedade.',
  },
  atracao: {
    id: 'atracao',
    nome: 'Atração (A)',
    descricaoCurta:
      'Posicionamento ético, autoria profissional, clareza sobre quem você acolhe e presença sólida.',
    foco: 'Como as pessoas que precisam do seu trabalho encontram seu consultório com coerência e respeito ao código de ética.',
  },
  conexao: {
    id: 'conexao',
    nome: 'Conexão (C)',
    descricaoCurta:
      'Relação de confiança, adesão terapêutica ética, manejo de ausências e processo de alta.',
    foco: 'O vínculo que sustenta o processo clínico no tempo com dignidade e autonomia para a paciente.',
  },
}

export interface DiagnosticoPergunta {
  id: number
  pilar: PilarId
  enunciado: string
  // Alternativas de 1 a 4 (1 = inicial/vulnerável, 4 = consolidado/sustentado)
  opcoes: [
    { valor: 1; texto: string },
    { valor: 2; texto: string },
    { valor: 3; texto: string },
    { valor: 4; texto: string },
  ]
  observacaoEditorial?: string
}

/**
 * MOTOR DO DIAGNÓSTICO FAC APROFUNDADO V2 (24 perguntas — 8 por pilar)
 *
 * NOTA EDITORIAL PARA A TATI:
 * Os enunciados e alternativas abaixo contêm placeholders editoriais neutros e claramente identificados
 * com a etiqueta [TODO TATI]. O motor de pontuação, gravação no navegador e geração de relatório
 * está 100% funcional. Basta substituir as strings pelas suas perguntas definitivas da versão 2.
 */
export const DIAGNOSTICO_24_PERGUNTAS: DiagnosticoPergunta[] = [
  // PILAR 1: FUNDAÇÃO (Perguntas 1 a 8)
  {
    id: 1,
    pilar: 'fundacao',
    enunciado:
      '1. Clareza sobre custos reais de vida e do consultório [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto: 'Não calculo com precisão meus custos e misturo contas pessoais e profissionais.',
      },
      {
        valor: 2,
        texto:
          'Tenho uma noção aproximada, mas ainda não estruturei uma reserva técnica nem pró-labore fixo.',
      },
      {
        valor: 3,
        texto: 'Separo as contas e conheço meus custos básicos, mas oscilo na previsibilidade.',
      },
      {
        valor: 4,
        texto:
          'Tenho planilha e piso mínimo estruturados, com separação total e reserva de contingência.',
      },
    ],
  },
  {
    id: 2,
    pilar: 'fundacao',
    enunciado: '2. Definição do piso ético por sessão [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Cobro por intuição ou comparando com a média do bairro, frequentemente aceitando valores que geram frustração.',
      },
      {
        valor: 2,
        texto:
          'Tenho uma tabela de valores, mas sinto insegurança ao informar e acabo negociando para baixo.',
      },
      {
        valor: 3,
        texto:
          'Pratico um valor baseado na minha experiência, porém sem um cálculo formal de markup e tributos.',
      },
      {
        valor: 4,
        texto:
          'Calculo meu piso no Método FAC com base na minha realidade real e não negocio abaixo do piso ético.',
      },
    ],
  },
  {
    id: 3,
    pilar: 'fundacao',
    enunciado: '3. Gestão da capacidade clínica semanal [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Atendo o máximo de pacientes que surgirem, mesmo quando sinto exaustão física e mental.',
      },
      {
        valor: 2,
        texto:
          'Tento limitar os atendimentos, mas abro exceções com facilidade e comprometo meu descanso.',
      },
      {
        valor: 3,
        texto:
          'Tenho um teto de sessões por semana, mas ainda não considero tempo suficiente para estudos e gestão.',
      },
      {
        valor: 4,
        texto:
          'Minha agenda tem teto protegido de atendimentos, pausas regulares e tempo remunerado para bastidores.',
      },
    ],
  },
  {
    id: 4,
    pilar: 'fundacao',
    enunciado: '4. Formalização de contratos e política de faltas [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Não utilizo contrato formal nem combinado prévio escrito sobre ausências e reposições.',
      },
      {
        valor: 2,
        texto:
          'Faço acordos verbais no início, mas fico sem respaldo quando ocorrem faltas frequentes.',
      },
      {
        valor: 3,
        texto:
          'Tenho um documento de enquadre, mas tenho receio de cobrar sessões canceladas de última hora.',
      },
      {
        valor: 4,
        texto:
          'Contrato terapêutico claro, assinado e praticado com naturalidade e acolhimento mútuo.',
      },
    ],
  },
  {
    id: 5,
    pilar: 'fundacao',
    enunciado:
      '5. Previsibilidade financeira e reserva de emergência [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto: 'Vivo mês a mês com medo de meses com feriados longos ou férias de pacientes.',
      },
      {
        valor: 2,
        texto: 'Consigo guardar apenas o que sobra e não tenho meses de segurança garantidos.',
      },
      {
        valor: 3,
        texto:
          'Tenho reserva para 1 a 2 meses, mas ainda sem blindagem completa para férias remuneradas.',
      },
      {
        valor: 4,
        texto:
          'Reserva estruturada para no mínimo 3 meses e provisão calculada de férias e 13º pessoal.',
      },
    ],
  },
  {
    id: 6,
    pilar: 'fundacao',
    enunciado: '6. Regularidade fiscal e contábil da atuação [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Não sei como emitir recibos corretamente ou atuo sem planejamento tributário formal.',
      },
      {
        valor: 2,
        texto:
          'Emito recibos quando solicitados, mas temo fiscalização ou pagar imposto em excesso.',
      },
      {
        valor: 3,
        texto:
          'Utilizo Carnê-Leão ou Simples Nacional, mas com dúvidas recorrentes sobre enquadramento.',
      },
      {
        valor: 4,
        texto:
          'Situação fiscal 100% regularizada, com contador parceiro e tributos embutidos na precificação.',
      },
    ],
  },
  {
    id: 7,
    pilar: 'fundacao',
    enunciado: '7. Investimento contínuo em supervisão e formação [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto: 'Não faço supervisão e não consigo investir em cursos devido à falta de recursos.',
      },
      {
        valor: 2,
        texto:
          'Faço supervisão esporádica apenas em casos de crise aguda, cortando custos sempre que aperto.',
      },
      {
        valor: 3,
        texto:
          'Supervisão regular, mas o investimento sai do meu sustento pessoal sem planejamento de centro de custo.',
      },
      {
        valor: 4,
        texto:
          'Supervisão clínica e estudos são centros de custo fixos e inegociáveis do consultório.',
      },
    ],
  },
  {
    id: 8,
    pilar: 'fundacao',
    enunciado: '8. Sentimento de segurança e sustentabilidade [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Sensação constante de que a profissão não se paga e que precisarei abandonar a clínica.',
      },
      {
        valor: 2,
        texto: 'Amo a clínica, mas a instabilidade financeira me gera ansiedade recorrente.',
      },
      {
        valor: 3,
        texto:
          'Sinto que estou no caminho, mas faltam ajustes para respirar com tranquilidade duradoura.',
      },
      {
        valor: 4,
        texto: 'Confiança profunda na sustentabilidade e autonomia do meu trabalho como psicóloga.',
      },
    ],
  },

  // PILAR 2: ATRAÇÃO (Perguntas 9 a 16)
  {
    id: 9,
    pilar: 'atracao',
    enunciado: '9. Clareza da identidade e autoria profissional [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Não consigo explicar com clareza o diferencial do meu trabalho ou atendo qualquer demanda que aparece.',
      },
      {
        valor: 2,
        texto:
          'Tenho intuição do meu estilo clínico, mas tenho vergonha de me posicionar com autoridade.',
      },
      {
        valor: 3,
        texto: 'Sei minhas áreas de afinidade, mas minha comunicação ainda parece genérica.',
      },
      {
        valor: 4,
        texto:
          'Minha autoria clínica é nítida, coerente com minha história e expressa com precisão ética.',
      },
    ],
  },
  {
    id: 10,
    pilar: 'atracao',
    enunciado: '10. Definição do público e território de atuação [TODO TATI: revisar enunciado]',
    opcoes: [
      { valor: 1, texto: 'Aceito todas as idades e demandas por medo de ficar sem pacientes.' },
      {
        valor: 2,
        texto:
          'Sei quem não gostaria de atender, mas ainda não recuso encaminhamentos incompatíveis.',
      },
      {
        valor: 3,
        texto: 'Tenho foco em determinadas queixas ou públicos, porém oscilo na divulgação.',
      },
      {
        valor: 4,
        texto:
          'Território clínico muito bem delimitado, atraindo exatamente as pessoas que se beneficiam da minha escuta.',
      },
    ],
  },
  {
    id: 11,
    pilar: 'atracao',
    enunciado: '11. Presença digital e postura ética [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Não tenho presença profissional na internet ou sinto aversão profunda a produzir conteúdo.',
      },
      {
        valor: 2,
        texto:
          'Tento postar nas redes sociais, mas fico paralisada pelo medo do julgamento dos pares.',
      },
      {
        valor: 3,
        texto:
          'Publico com alguma constância, mas sem consistência narrativa ou alinhamento com meu nicho.',
      },
      {
        valor: 4,
        texto:
          'Presença digital ética, acolhedora, sem dancinhas ou promessas milagrosas, servindo à comunidade.',
      },
    ],
  },
  {
    id: 12,
    pilar: 'atracao',
    enunciado: '12. Rede de encaminhamentos e parcerias com colegas [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto: 'Atuo de forma isolada, sem contato com outros profissionais ou médicos da região.',
      },
      {
        valor: 2,
        texto:
          'Conheço alguns colegas, mas nunca recebo encaminhamentos por falta de cultivo mútuo.',
      },
      {
        valor: 3,
        texto:
          'Recebo indicações esporádicas de ex-professores ou conhecidos, sem rede ativa de intercâmbio.',
      },
      {
        valor: 4,
        texto:
          'Rede viva e generosa de trocas com psiquiatras, psicólogos e equipes multiprofissionais.',
      },
    ],
  },
  {
    id: 13,
    pilar: 'atracao',
    enunciado: '13. Materiais de apresentação e primeiro contato [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto: 'Não tenho mensagem padrão, site, perfil organizado ou formulário para triagem.',
      },
      {
        valor: 2,
        texto:
          'Respondo por WhatsApp de improviso e frequentemente demoro a dar retorno profissional.',
      },
      {
        valor: 3,
        texto:
          'Tenho um texto de boas-vindas, mas sem explicações claras sobre formato e honorários.',
      },
      {
        valor: 4,
        texto:
          'Fluxo de acolhimento impecável, profissional, empático e com todas as informações transparentes.',
      },
    ],
  },
  {
    id: 14,
    pilar: 'atracao',
    enunciado: '14. Constância de novas buscas por atendimento [TODO TATI: revisar enunciado]',
    opcoes: [
      { valor: 1, texto: 'Passo meses sem nenhuma procura por novos atendimentos.' },
      { valor: 2, texto: 'As procuras acontecem em ondas imprevisíveis de fartura e escassez.' },
      {
        valor: 3,
        texto:
          'Tenho uma média mensal estável de contatos, mas alguns desistem antes da primeira sessão.',
      },
      {
        valor: 4,
        texto:
          'Fluxo contínuo de pessoas procurando especificamente pelo meu trabalho, mantendo fila de espera saudável.',
      },
    ],
  },
  {
    id: 15,
    pilar: 'atracao',
    enunciado:
      '15. Diálogo transparente sobre honorários na primeira abordagem [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Tenho pavor do momento de dizer o preço e muitas vezes adio a conversa para o fim da sessão.',
      },
      {
        valor: 2,
        texto:
          'Informo o valor com tom de desculpa ou ofereço desconto antes mesmo que a pessoa pergunte.',
      },
      {
        valor: 3,
        texto: 'Falo o valor de forma direta, mas ainda sinto desconforto interno ao sustentar.',
      },
      {
        valor: 4,
        texto:
          'Comunico os honorários com naturalidade, firmeza e respeito, acolhendo eventuais dúvidas.',
      },
    ],
  },
  {
    id: 16,
    pilar: 'atracao',
    enunciado: '16. Reconhecimento público da sua prática [TODO TATI: revisar enunciado]',
    opcoes: [
      { valor: 1, texto: 'Sinto que sou invisível no meio profissional e no meu território.' },
      {
        valor: 2,
        texto: 'Poucas pessoas conhecem meu trabalho e ainda sinto síndrome da impostora forte.',
      },
      {
        valor: 3,
        texto: 'Sou reconhecida por um grupo pequeno de pessoas, mas com potencial de expandir.',
      },
      {
        valor: 4,
        texto:
          'Autoridade profissional consolidada com respeito entre colegas e confiança de pacientes.',
      },
    ],
  },

  // PILAR 3: CONEXÃO (Perguntas 17 a 24)
  {
    id: 17,
    pilar: 'conexao',
    enunciado:
      '17. Adesão e retenção ética dos processos terapêuticos [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto: 'Pacientes abandonam o processo nas primeiras 3 a 4 sessões sem motivo aparente.',
      },
      {
        valor: 2,
        texto:
          'Muitas interrupções bruscas por descompromisso com o processo ou dificuldades de enquadre.',
      },
      {
        valor: 3,
        texto: 'Boa parte segue em terapia por meses, mas ainda ocorrem evasões evitáveis.',
      },
      {
        valor: 4,
        texto:
          'Aliança terapêutica sólida com processos profundos, consistentes e respeitosos ao tempo de cada paciente.',
      },
    ],
  },
  {
    id: 18,
    pilar: 'conexao',
    enunciado:
      '18. Manejo de resistências, faltas e enquadre clínico [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Fico sem ação diante de atrasos ou faltas repetidas e não levo a questão para a sessão.',
      },
      {
        valor: 2,
        texto: 'Sinto desconforto de pontuar o enquadre e acabo absorvendo o custo das ausências.',
      },
      {
        valor: 3,
        texto: 'Converso sobre as faltas, mas às vezes com tom excessivamente rígido ou hesitante.',
      },
      {
        valor: 4,
        texto:
          'Manejo clínico sereno, acolhedor e ético, transformando quebras de enquadre em material de análise.',
      },
    ],
  },
  {
    id: 19,
    pilar: 'conexao',
    enunciado:
      '19. Condução ética do processo de reajuste anual de honorários [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Nunca reajusto honorários com medo de perder pacientes e mantenho o mesmo valor há anos.',
      },
      {
        valor: 2,
        texto:
          'Reajusto apenas para novos pacientes, mantendo defasagem profunda com pacientes antigos.',
      },
      {
        valor: 3,
        texto:
          'Aviso sobre o reajuste com antecedência, mas recuo quando a paciente demonstra qualquer surpresa.',
      },
      {
        valor: 4,
        texto:
          'Pratico o diálogo de reajuste com antecedência, transparência e propostas individualizadas éticas.',
      },
    ],
  },
  {
    id: 20,
    pilar: 'conexao',
    enunciado: '20. Escuta empática e limites do vínculo [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Levo as dores dos pacientes para a cama e sinto que sou responsável por resolver suas vidas.',
      },
      {
        valor: 2,
        texto: 'Respondo mensagens fora de hora e atendo chamados emergenciais sem limite prévio.',
      },
      {
        valor: 3,
        texto:
          'Consigo manter limites na maior parte do tempo, mas algumas situações me sobrecarregam.',
      },
      {
        valor: 4,
        texto:
          'Presença empática profunda dentro do consultório com limites saudáveis que protegem a relação terapêutica.',
      },
    ],
  },
  {
    id: 21,
    pilar: 'conexao',
    enunciado: '21. Condução ética da alta e encerramento [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Não tenho clareza sobre como dar alta e temo o fim dos processos pelo impacto na renda.',
      },
      {
        valor: 2,
        texto:
          'Deixo o encerramento correr frouxo até que o paciente simplesmente suma do consultório.',
      },
      {
        valor: 3,
        texto:
          'Planejo a alta quando indicada, mas sinto insegurança ao formalizar as sessões finais.',
      },
      {
        valor: 4,
        texto:
          'Celebro altas com autonomia, rito de passagem digno e reconhecimento do percurso conjunto.',
      },
    ],
  },
  {
    id: 22,
    pilar: 'conexao',
    enunciado:
      '22. Avaliação periódica do processo terapêutico com a paciente [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto: 'Nunca revemos objetivos nem conversamos sobre o andamento e ganhos da terapia.',
      },
      {
        valor: 2,
        texto: 'Fazemos balanços rápidos apenas quando o paciente traz queixas sobre o processo.',
      },
      {
        valor: 3,
        texto: 'Reviso objetivos anualmente, mas sem um formato estruturado de checagem mútua.',
      },
      {
        valor: 4,
        texto:
          'Momentos periódicos dedicados a revisitar combinados, conquistas e próximos passos com transparência.',
      },
    ],
  },
  {
    id: 23,
    pilar: 'conexao',
    enunciado:
      '23. Segurança na relação terapêutica frente a impasses [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Diante de crises ou impasses transferenciais, sinto vontade de transferir a paciente de imediato.',
      },
      {
        valor: 2,
        texto: 'Fico insegura e evito tocar em temas difíceis para não gerar conflito na sessão.',
      },
      {
        valor: 3,
        texto: 'Busco supervisão e sustento o processo, embora com desgaste emocional elevado.',
      },
      {
        valor: 4,
        texto:
          'Segurança técnica e afetiva para sustentar turbulências clínicas e apoiar a paciente no impasse.',
      },
    ],
  },
  {
    id: 24,
    pilar: 'conexao',
    enunciado:
      '24. Satisfação com o sentido da própria prática clínica [TODO TATI: revisar enunciado]',
    opcoes: [
      {
        valor: 1,
        texto:
          'Sensação frequente de cinismo, esgotamento (burnout) e perda de sentido do trabalho.',
      },
      {
        valor: 2,
        texto:
          'Gosto do trabalho quando as sessões correm bem, mas a rotina me parece pesada demais.',
      },
      {
        valor: 3,
        texto: 'Reconheço o valor social do meu ofício, com necessidade de ajustes de sustentação.',
      },
      {
        valor: 4,
        texto:
          'Profunda coerência entre valores de vida, compromisso social ético e o exercício da psicologia.',
      },
    ],
  },
]

export interface ResultadoDiagnostico {
  scores: {
    fundacao: { pontos: number; maximo: number; porcentagem: number }
    atracao: { pontos: number; maximo: number; porcentagem: number }
    conexao: { pontos: number; maximo: number; porcentagem: number }
  }
  pilarMaisDesenvolvido: PilarId
  pilarMenosDesenvolvido: PilarId
  pilarIntermediario: PilarId
  diagnosticoCombinacao: {
    titulo: string
    analise: string
    orientacaoAcademia: string
  }
}

/**
 * Análise combinatória dos pilares (Mais vs Menos desenvolvido)
 * Segue a visão da Tati e do Método FAC. Textos com TODO claramente marcado para refinamento editorial.
 */
export function calcularResultadoDiagnostico(
  respostas: Record<number, number>,
): ResultadoDiagnostico {
  let pFund = 0
  let pAtr = 0
  let pCon = 0

  DIAGNOSTICO_24_PERGUNTAS.forEach((q) => {
    const val = respostas[q.id] || 1
    if (q.pilar === 'fundacao') pFund += val
    if (q.pilar === 'atracao') pAtr += val
    if (q.pilar === 'conexao') pCon += val
  })

  const scores = {
    fundacao: { pontos: pFund, maximo: 32, porcentagem: Math.round((pFund / 32) * 100) },
    atracao: { pontos: pAtr, maximo: 32, porcentagem: Math.round((pAtr / 32) * 100) },
    conexao: { pontos: pCon, maximo: 32, porcentagem: Math.round((pCon / 32) * 100) },
  }

  const pilaresOrdenados = (['fundacao', 'atracao', 'conexao'] as PilarId[]).sort((a, b) => {
    return scores[b].pontos - scores[a].pontos
  })

  const pilarMaisDesenvolvido = pilaresOrdenados[0]
  const pilarIntermediario = pilaresOrdenados[1]
  const pilarMenosDesenvolvido = pilaresOrdenados[2]

  // Mapa de leituras combinatórias
  const combinacaoKey = `${pilarMaisDesenvolvido}_${pilarMenosDesenvolvido}`

  const analises: Record<string, { titulo: string; analise: string; orientacaoAcademia: string }> =
    {
      fundacao_atracao: {
        titulo: 'Fundação Consolidada & Atração Necessitando Expansão',
        analise:
          'Você tem organização, disciplina com números e respeito à sua sustentabilidade, mas sua escuta autoral ainda chega a poucas pessoas. É comum que o medo de parecer mercantilista ou a falta de um posicionamento nítido mantenham sua agenda abaixo da capacidade ideal. A precarização aqui não vem do descontrole financeiro, mas do isolamento da sua voz profissional.',
        orientacaoAcademia:
          'Na Academia, sua prioridade é o Encontro 2 (Retrato de Autoria) e os módulos de Atração Ética: aprender a comunicar o valor da sua escuta sem violar o código de ética e sem recorrer a fórmulas vazias de marketing.',
      },
      fundacao_conexao: {
        titulo: 'Fundação Estruturada & Conexão Precisando de Aprofundamento',
        analise:
          'A gestão do consultório está em dia e as contas estão organizadas, porém os vínculos clínicos podem estar sofrendo com quebras precoces ou dificuldade de sustentar o enquadre no longo prazo. Às vezes, o foco excessivo na regra técnica pode gerar uma rigidez percebida pela paciente.',
        orientacaoAcademia:
          'Sua jornada na Academia deve focar nas práticas de vínculo, manejo de resistências e pactuação afetiva de contratos terapêuticos.',
      },
      atracao_fundacao: {
        titulo: 'Atração Intensa & Fundação em Vulnerabilidade (Risco de Sobrecarga)',
        analise:
          'Você se comunica com facilidade, atrai pacientes e tem carisma profissional, mas seu piso ético, contratos e reserva financeira estão desprotegidos. Você atende muito, cansa-se muito e, no fim do mês, o saldo não reflete a dedicação. Este é o padrão mais suscetível à exaustão e burnout.',
        orientacaoAcademia:
          'O Encontro 1 e a Calculadora FAC são seu chão de salvação imediata: reestruturar a capacidade semanal, calcular o piso ético real e blindar o consultório.',
      },
      atracao_conexao: {
        titulo: 'Atração Forte & Conexão em Ajuste',
        analise:
          'As pessoas procuram seu trabalho com frequência, mas a taxa de desistência nas primeiras semanas ainda é mais alta do que o ideal. O fluxo de entrada é bom, mas o cultivo do processo de continuidade exige atenção.',
        orientacaoAcademia:
          'Foque na Trilha de Conexão, no contrato de trabalho terapêutico e na condução dos primeiros 4 atendimentos.',
      },
      conexao_fundacao: {
        titulo:
          'Conexão Profunda & Fundação em Vulnerabilidade (A Síndrome da Cuidadoira Desprotegida)',
        analise:
          'Seus pacientes amam o trabalho com você e os vínculos são duradouros, mas você frequentemente cobra pouco, atende em horários inconvenientes, aceita calotes e tem medo de reajustar honorários. Você cuida de todo mundo menos da sua própria sustentabilidade.',
        orientacaoAcademia:
          'Sua virada na Academia será aprender que sustentabilidade financeira é ato de cuidado ético com a própria clínica. O Encontro 3 e os módulos de Fundação são urgentes.',
      },
      conexao_atracao: {
        titulo: 'Conexão Exemplar & Atração Restrita',
        analise:
          'Quem está com você não sai e o trabalho clínico é de altíssima qualidade, mas quando uma paciente recebe alta você sente um frio na barriga porque não há novas pessoas chegando. Seu consultório depende exclusivamente do boca a boca lento.',
        orientacaoAcademia:
          'Seu foco será levar a força da sua autoria para o mundo exterior nos Encontros de Atração.',
      },
    }

  const fallback = {
    titulo: `Pilar Forte: ${PILARES_DEFINITIONS[pilarMaisDesenvolvido].nome} | Pilar de Atenção: ${PILARES_DEFINITIONS[pilarMenosDesenvolvido].nome}`,
    analise:
      'Seu diagnóstico revela uma prática clínica com pontos fortes claros e áreas que exigem cuidado e sustentação. O Método FAC foi desenhado exatamente para integrar esses três eixos sem que um canibalize o outro.',
    orientacaoAcademia:
      'Utilize os 19 encontros da Academia para equilibrar sua tríade profissional com o apoio das facilitadoras e da turma.',
  }

  const diagnosticoCombinacao = analises[combinacaoKey] || fallback

  return {
    scores,
    pilarMaisDesenvolvido,
    pilarMenosDesenvolvido,
    pilarIntermediario,
    diagnosticoCombinacao,
  }
}

/**
 * CONTEÚDO PEDAGÓGICO DO ENCONTRO 1 (AULA MAGNA ABERTA — 06/10/2026)
 * Único encontro gratuito e aberto a todas as visitantes.
 */
export const ENCONTRO_1_CONTENT = {
  numero: 1,
  titulo: 'Aula Magna: O Chão da Clínica Sustentável',
  subtitulo: 'Diagnóstico FAC Aprofundado e os Três Pilares da Autoria Ética',
  data: '06/10/2026',
  abertaParaTodas: true,
  introducao: `Seja muito bem-vinda à Aula Magna da Academia Método FAC.

Este encontro foi desenhado como um portal de entrada seguro e ético para qualquer psicóloga que deseje construir uma prática clínica viva, digna e financeiramente viável.

Aqui não falamos em "mentalidade de riqueza" nem em "fórmulas mágicas de faturamento". A precarização do trabalho da psicóloga no Brasil é um dado estrutural, e não um fracasso individual da sua história. Para superá-la, precisamos de técnica, comunidade e sustentação.`,
  secoesCaderno: [
    {
      id: 'preparar',
      titulo: '1. Preparar a Escuta',
      descricao: 'Antes de abrir a agenda, abrir espaço para a própria história.',
      conteudo: `Antes de iniciar a sessão ou o estudo do seu consultório, reserve 20 minutos em silêncio.

Perguntas norteadoras para sua reflexão no caderno:
- De onde veio o desejo de clinicar e quais concessões você tem feito para manter esse desejo vivo?
- O que o medo da escassez tem custado à sua saúde, à sua rotina e às suas relações?
- Se o sustento do consultório estivesse assegurado, o que você mudaria na sua prática hoje mesmo?`,
    },
    {
      id: 'participar',
      titulo: '2. Participar da Aula Aberta',
      descricao: 'Os três eixos do Método FAC (Fundação, Atração, Conexão).',
      conteudo: `No Método FAC, nenhuma clínica se sustenta com apenas uma ou duas pernas:
- **Fundação**: o chão material. Custos, reserva, piso por sessão, enquadre, limites da agenda.
- **Atração**: a clareza da voz. Quem você é, o que estuda, quem você acolhe e como o mundo sabe da sua existência com respeito absoluto ao código de ética.
- **Conexão**: o vínculo sustentado. A relação que não precariza, a alta que liberta e o enquadre que protege tanto a paciente quanto a terapeuta.`,
    },
    {
      id: 'construir',
      titulo: '3. Construir seu Retrato Inicial',
      descricao: 'Aplicação do Diagnóstico FAC Aprofundado versão 2.',
      conteudo: `Nesta página você tem acesso ao motor completo do Diagnóstico FAC Aprofundado de 24 perguntas.
Ao final, você receberá o mapa exato do seu pilar mais desenvolvido, do que precisa de cuidado urgente e da leitura combinada da sua clínica.
Você pode baixar seu relatório em PDF com 1 página para guardar seus insights.`,
    },
    {
      id: 'entregar',
      titulo: '4. Próximos Passos',
      descricao: 'Como continuar sua formação na Academia.',
      conteudo: `A Aula 1 é aberta a toda a categoria. A partir do Encontro 2, mergulhamos nas ferramentas aplicadas (Retrato de Autoria, Meu IKIGAI Clínico, Calculadora FAC e encontros de supervisão de autoria).
Se você já é aluna matriculada, valide seu e-mail de compra nesta página para liberar todos os cadernos. Se deseja ingressar na próxima turma, fale com a equipe da Entrelaços.`,
    },
  ],
  avisoPrivacidade:
    'Seu rascunho e histórico ficam neste navegador. Baixe o PDF para guardar o resultado.',
  avisoEtico: 'Esta é uma ferramenta de reflexão profissional. Não é avaliação psicológica.',
}
