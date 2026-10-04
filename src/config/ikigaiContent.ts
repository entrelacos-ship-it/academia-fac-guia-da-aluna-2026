import { CircleId, IntersectionId, IkigaiState } from '@/types/ikigai'

export interface CircleDefinition {
  id: CircleId
  number: number
  title: string
  subtitle: string
  description: string
  questions: string[]
  badgeText: string
  placeholder: string
  minSuggested: number
  maxStars: number
}

export interface IntersectionDefinition {
  id: IntersectionId
  name: string
  subtitle: string
  circleAId: CircleId
  circleBId: CircleId
  circleAName: string
  circleBName: string
  prompt: string
  examplePlaceholder: string
}

export const IKIGAI_WARNING_NOTE =
  'Esta é uma ferramenta de reflexão profissional. Não é avaliação psicológica.'

export const IKIGAI_ETHICAL_REMINDER = 'Não inclua nomes nem dados que identifiquem pacientes.'

export const CIRCLE_DEFINITIONS: Record<CircleId, CircleDefinition> = {
  love: {
    id: 'love',
    number: 1,
    title: 'O que eu amo fazer',
    subtitle: 'Círculo 1 · Paixão e afinidade espontânea',
    description:
      'Identifique temas, perfis de escuta e práticas clínicas que renovam sua energia vital.',
    questions: [
      'Que tipo de caso ou tema acende você mesmo cansada?',
      'O que você faria na profissão mesmo sem ninguém ver?',
      'Em que momento você perde a noção do tempo?',
    ],
    badgeText: 'Círculo 1',
    placeholder: 'Digite aqui um tema ou prática que você ama...',
    minSuggested: 3,
    maxStars: 3,
  },
  goodAt: {
    id: 'goodAt',
    number: 2,
    title: 'No que eu sou boa',
    subtitle: 'Círculo 2 · Talentos, domínio técnico e repertório',
    description:
      'Reconheça suas competências naturais, histórico de estudos e facilidades consolidadas.',
    questions: [
      'O que as pessoas pedem a você sem você se oferecer?',
      'O que você faz com facilidade e nem considera talento?',
      'Que repertório sua trajetória deixou, inclusive fora da psicologia?',
    ],
    badgeText: 'Círculo 2',
    placeholder: 'Digite aqui uma habilidade ou facilidade que você domina...',
    minSuggested: 3,
    maxStars: 3,
  },
  worldNeeds: {
    id: 'worldNeeds',
    number: 3,
    title: 'Do que o mundo precisa',
    subtitle: 'Círculo 3 · Dores reais, demandas sociais e causas éticas',
    description:
      'Mapeie as fraturas sociais e sofrimentos que você enxerga e que clamam por cuidado.',
    questions: [
      'Que sofrimento ou problema você vê se repetir e ninguém atende bem?',
      'O que indigna você na forma como a psicologia é praticada ou oferecida?',
      'Quem sai perdendo quando esse cuidado não existe?',
    ],
    badgeText: 'Círculo 3',
    placeholder: 'Digite aqui uma dor social ou demanda que clama por cuidado...',
    minSuggested: 3,
    maxStars: 3,
  },
  paidFor: {
    id: 'paidFor',
    number: 4,
    title: 'Pelo que posso ser remunerada com dignidade',
    subtitle: 'Círculo 4 · Sustentabilidade financeira e formatos viáveis',
    description:
      'O quarto círculo tem o mesmo peso dos outros. Sustentabilidade financeira é princípio ético.',
    questions: [
      'Por quais serviços as pessoas já pagam ou pagariam a você?',
      'Que formatos além da sessão individual fazem sentido para o que você sabe?',
      'O que precisaria ser verdade para você cobrar sem culpa?',
    ],
    badgeText: 'Círculo 4',
    placeholder: 'Digite aqui um serviço ou formato pelo qual você pode cobrar...',
    minSuggested: 3,
    maxStars: 3,
  },
}

export const INTERSECTION_DEFINITIONS: Record<IntersectionId, IntersectionDefinition> = {
  passion: {
    id: 'passion',
    name: 'Paixão',
    subtitle: 'Encontro entre o que amo e no que sou boa',
    circleAId: 'love',
    circleBId: 'goodAt',
    circleAName: 'O que eu amo fazer',
    circleBName: 'No que eu sou boa',
    prompt:
      'Olhe para os itens dos dois círculos abaixo e escreva uma frase síntese que una seu amor espontâneo ao seu domínio real.',
    examplePlaceholder:
      'Escreva sua frase síntese conectando o que você ama e no que você é boa...',
  },
  mission: {
    id: 'mission',
    name: 'Missão',
    subtitle: 'Encontro entre o que amo e do que o mundo precisa',
    circleAId: 'love',
    circleBId: 'worldNeeds',
    circleAName: 'O que eu amo fazer',
    circleBName: 'Do que o mundo precisa',
    prompt:
      'Olhe para o que você ama e o sofrimento que você deseja aliviar. Como o seu entusiasmo se coloca a serviço do mundo?',
    examplePlaceholder:
      'Escreva sua frase síntese conectando o que você ama e do que o mundo precisa...',
  },
  vocation: {
    id: 'vocation',
    name: 'Vocação',
    subtitle: 'Encontro entre do que o mundo precisa e pelo que posso ser paga',
    circleAId: 'worldNeeds',
    circleBId: 'paidFor',
    circleAName: 'Do que o mundo precisa',
    circleBName: 'Pelo que posso ser remunerada',
    prompt:
      'Existe uma necessidade real no mundo e pessoas dispostas a remunerar essa transformação. Como esses dois lados se conectam no seu trabalho?',
    examplePlaceholder:
      'Escreva sua frase síntese conectando a necessidade do mundo e a remuneração digna...',
  },
  profession: {
    id: 'profession',
    name: 'Profissão',
    subtitle: 'Encontro entre no que sou boa e pelo que posso ser paga',
    circleAId: 'goodAt',
    circleBId: 'paidFor',
    circleAName: 'No que eu sou boa',
    circleBName: 'Pelo que posso ser remunerada',
    prompt:
      'Suas habilidades sólidas convertidas em serviços com remuneração digna. Como sua competência se traduz em sustento?',
    examplePlaceholder:
      'Escreva sua frase síntese conectando suas habilidades técnicas e a remuneração viável...',
  },
}

export const EMPTY_COMBINATIONS_TEXTS: Record<
  string,
  { title: string; body: string; guidance: string }
> = {
  // Paixão sem Profissão (você ama e faz bem, mas ainda não é sustentada por isso)
  passion_without_profession: {
    title: 'Paixão sem Profissão',
    body: 'Você ama e faz bem, mas ainda não é sustentada por isso.',
    guidance:
      'O risco é o cansaço acumulado e a culpa por cobrar. A psicologia não pode ser um sacrifício pessoal. Sua competência técnica precisa de ancoragem financeira para que seu trabalho permaneça vivo.',
  },
  // Profissão sem Missão (você é paga pelo que faz bem, mas falta sentido)
  profession_without_mission: {
    title: 'Profissão sem Missão',
    body: 'Você é paga pelo que faz bem, mas falta sentido.',
    guidance:
      'O consultório pode estar cheio, as contas pagas, mas ao fim do dia fica a sensação de repetição mecânica. Falta conectar a técnica diária com a ferida do mundo que realmente mobiliza você.',
  },
  // Vocação sem Paixão (há demanda e pagamento, mas não acende você)
  vocation_without_passion: {
    title: 'Vocação sem Paixão',
    body: 'Há demanda e pagamento, mas não acende você.',
    guidance:
      'Você identificou um nicho rentável e com público, mas o cotidiano não traz brilho no olho. Atenção ao risco de esgotamento ao sustentar uma demanda que não conversa com seus afetos verdadeiros.',
  },
  // Missão sem Vocação (há sentido, mas não há sustento)
  mission_without_vocation: {
    title: 'Missão sem Vocação',
    body: 'Há sentido, mas não há sustento.',
    guidance:
      'Você sabe exatamente qual sofrimento precisa ser cuidado e ama essa causa, mas não desenhou um formato sustentável e pago para oferecer essa ajuda. Sem dinheiro, o projeto vira voluntariado precário.',
  },
  // Paixão e Missão vazias (técnica e sustento sem afeto ou causa)
  passion_and_mission_empty: {
    title: 'Técnica e Sustento desconectados do Sentido',
    body: 'Você estruturou seu trabalho e tem remuneração, mas a chama do amor e da missão ainda não encontrou espaço.',
    guidance:
      'É o momento de resgatar o que fez você escolher a psicologia lá no início. O dinheiro e o domínio prático são a base segura, use-os agora para abrir espaço aos temas que realmente tocam sua história.',
  },
  // Vocação e Profissão vazias (muito sentimento, pouca viabilidade)
  vocation_and_profession_empty: {
    title: 'Propósito Romântico sem Viabilidade Econômica',
    body: 'Você tem afeto e enxerga a necessidade do outro, mas o quarto círculo ainda está desancorado.',
    guidance:
      'Lembre-se do princípio da Academia: sustentabilidade financeira é princípio ético. Sem remuneração digna, você não compra livros, não faz supervisão e adoece. É urgente colocar preço e formato no seu dom.',
  },
  // Todos os encontros preenchidos
  all_filled: {
    title: 'Painel Integrado e Harmônico',
    body: 'Você conseguiu traçar pontes entre amor, talento, dor social e remuneração.',
    guidance:
      'Seu mapa mostra solidez clínica. O desafio agora é transformar essas frases em critérios práticos para dizer não ao que desvia e sim aos projetos que consolidam sua autoria.',
  },
  // Todos os encontros vazios
  all_empty: {
    title: 'Momento de Abertura e Investigação',
    body: 'Nenhum encontro foi formulado ainda. Isso é informação preciosa, não falha.',
    guidance:
      'Você está diante de uma folha aberta para questionar caminhos automáticos. Use os itens dos círculos para testar pequenas combinações no encontro ao vivo com a facilitadora.',
  },
  // Padrão genérico para outras combinações parciais
  partial_default: {
    title: 'Construção em Andamento',
    body: 'Alguns encontros ficaram evidentes, enquanto outros ainda pedem amadurecimento.',
    guidance:
      'Ter lacunas faz parte do processo de autoria. Uma lacuna não é erro, é um apontador de onde sua carreira precisa de novas decisões e formatos.',
  },
}

export const DISCUSSION_QUESTIONS_SUGGESTIONS = [
  'Qual é o primeiro não que você precisa dizer na sua rotina para dar espaço ao que apareceu no seu painel?',
  'O que precisaria mudar na sua estrutura de atendimento para que seu quarto círculo sustente os outros três?',
  'Ao ler seu painel em voz alta, você se reconhece como dona da sua prática ou sente que está cumprindo o roteiro de outra pessoa?',
]

export const MISSION_TEMPLATE_SUGGESTION =
  'Eu ajudo [quem] a [transformação], por meio de [como eu faço].'

export const COMMUNITY_SHARE_TEMPLATE = (
  mission: string,
  circleObservations: string,
) => `Compartilhando meu IKIGAI da Academia Método FAC:

🎯 Minha Declaração de Missão:
"${mission || 'Em construção'}"

💡 Meu olhar sobre os círculos:
${circleObservations || 'Investigando a harmonia entre vocação clínica e remuneração digna.'}

#AcademiaFAC #EntrelaçosPsicologia #IKIGAIClinico`

export const CIRCLE_SUGGESTIONS: Record<CircleId, string[]> = {
  love: [
    'Escuta profunda de mulheres em transição de vida',
    'Condução de grupos terapêuticos e rodas de conversa',
    'Atendimento focado em criatividade e autoria',
    'Supervisão clínica acolhedora para recém-formadas',
    'Estudo e escrita sobre psicologia clínica',
  ],
  goodAt: [
    'Síntese clínica e devoluções sem jargões técnicos',
    'Manejo seguro em momentos de crise e alta angústia',
    'Organização de processos e materiais de apoio',
    'Construção rápida de vínculo e acolhimento ético',
    'Diagnóstico contextualizado além do sintoma evidente',
  ],
  worldNeeds: [
    'Acolhimento da sobrecarga invisível do cuidado feminino',
    'Espaços seguros para falar de ambição e dinheiro sem culpa',
    'Alternativas à medicalização precipitada do sofrimento',
    'Psicoterapia ética para populações vulnerabilizadas',
    'Desmistificação da saúde mental no cotidiano',
  ],
  paidFor: [
    'Sessão individual particular com contrato transparente',
    'Grupos terapêuticos temáticos com ciclo fechado',
    'Supervisão clínica quinzenal individual ou em dupla',
    'Oficinas e palestras formativas para instituições',
    'Programas breves de reorganização profissional',
  ],
}

export const FICTITIOUS_FACILITATOR_EXAMPLE: IkigaiState = {
  version: 1,
  activeStep: 7,
  circles: {
    love: [
      {
        id: 'ex-l1',
        text: 'Escuta profunda de mulheres em momentos de transição de vida',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-l2',
        text: 'Conduzir grupos terapêuticos e rodas de conversa acolhedoras',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-l3',
        text: 'Estudar e escrever sobre autonomia feminina e psicologia clínica',
        starred: false,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-l4',
        text: 'Supervisionar psicólogas recém-formadas com paciência e método',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
    ],
    goodAt: [
      {
        id: 'ex-g1',
        text: 'Capacidade de síntese clínica e devoluções claras sem jargão',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-g2',
        text: 'Mediação serena em situações de crise e alta angústia',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-g3',
        text: 'Organização didática de processos e materiais reflexivos',
        starred: false,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-g4',
        text: 'Repertório amplo em literatura e artes para ilustrar a clínica',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
    ],
    worldNeeds: [
      {
        id: 'ex-w1',
        text: 'Cuidado acessível para a sobrecarga invisível da maternidade real',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-w2',
        text: 'Espaços onde mulheres possam falar de ambição e dinheiro sem culpa',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-w3',
        text: 'Combate à medicalização precipitada da dor cotidiana feminina',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-w4',
        text: 'Supervisões éticas que não explorem financeiramente a iniciante',
        starred: false,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
    ],
    paidFor: [
      {
        id: 'ex-p1',
        text: 'Psicoterapia individual particular com valor justo e contratual',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-p2',
        text: 'Grupo terapêutico temático com 8 encontros estruturados',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-p3',
        text: 'Supervisão clínica quinzenal individual ou em dupla',
        starred: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'ex-p4',
        text: 'Workshops formativos para empresas sobre saúde mental e gênero',
        starred: false,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
    ],
  },
  intersections: {
    passion: {
      text: 'Conduzir processos profundos de autoria e reorganização pessoal com método e afeto.',
      notFound: false,
    },
    mission: {
      text: 'Aliviar a solidão da sobrecarga feminina criando territórios seguros de escuta e recomeço.',
      notFound: false,
    },
    vocation: {
      text: 'Oferecer grupos e programas temáticos estruturados com adesão paga e impacto direto na saúde da mulher.',
      notFound: false,
    },
    profession: {
      text: 'Sustentar o consultório particular e a supervisão com base na excelência técnica e previsibilidade contratual.',
      notFound: false,
    },
  },
  missionStatement:
    'Eu ajudo mulheres sobrecarregadas a resgatarem sua autonomia pessoal e profissional, por meio de processos clínicos estruturados e sem jargões.',
  missionHistory: [
    {
      id: 'h1',
      text: 'Eu ajudo pessoas a viverem melhor por meio da psicologia clínica.',
      savedAt: '2026-03-01T10:30:00.000Z',
    },
    {
      id: 'h2',
      text: 'Eu ajudo mulheres a superarem o cansaço através de terapia focada.',
      savedAt: '2026-03-01T11:00:00.000Z',
    },
  ],
  rawRetratoTray: [],
  updatedAt: '2026-03-01T11:15:00.000Z',
}

export const INITIAL_EMPTY_IKIGAI_STATE: IkigaiState = {
  version: 1,
  activeStep: 0,
  circles: {
    love: [],
    goodAt: [],
    worldNeeds: [],
    paidFor: [],
  },
  intersections: {
    passion: { text: '', notFound: false },
    mission: { text: '', notFound: false },
    vocation: { text: '', notFound: false },
    profession: { text: '', notFound: false },
  },
  missionStatement: '',
  missionHistory: [],
  rawRetratoTray: [],
  updatedAt: new Date().toISOString(),
}
