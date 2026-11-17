// ─────────────────────────────────────────────────────────────
// Encontro 5 · Branding: Sua marca com rosto e voz
//
// Estrutura inicial da aula. As etapas estão vazias por enquanto:
// o conteúdo de cada uma chega nos próximos pedidos.
// Zero travessões em nenhum texto (regra editorial do projeto).
// ─────────────────────────────────────────────────────────────

export const ENCONTRO5_STORAGE_KEY = 'academia-fac:encontro5-checklists'

export const ENCONTRO5_ROTULO = 'ENCONTRO 5 · BRANDING'
export const ENCONTRO5_TITULO = 'Sua marca com rosto e voz'
export const ENCONTRO5_SUBTITULO =
  'Identidade visual, psicologia das cores, Proposta de Valor Única refinada e o que a sua solução entrega, tudo a partir do seu Manifesto.'

// ─────────────────────────────────────────────────────────────
// Etapas
// ─────────────────────────────────────────────────────────────
export interface Etapa5Def {
  id: string
  numero: string
  titulo: string
  tempo?: string
}

export const ETAPAS_ENCONTRO_5: Etapa5Def[] = [
  { id: 'etapa-0', numero: '0', titulo: 'Antes de começar', tempo: '3 min' },
  { id: 'etapa-1', numero: '1', titulo: 'O que é uma marca', tempo: '8 min' },
  { id: 'etapa-2', numero: '2', titulo: 'Psicologia das cores', tempo: '10 min' },
  { id: 'etapa-3', numero: '3', titulo: 'Como usar as skills no seu Projeto', tempo: '5 min' },
  { id: 'etapa-4', numero: '4', titulo: 'Identidade visual: Skills 1 a 5', tempo: '40 min' },
  {
    id: 'etapa-5',
    numero: '5',
    titulo: 'Proposta, entrega e manual: Skills 6 a 8',
    tempo: '30 min',
  },
  {
    id: 'etapa-6',
    numero: '6',
    titulo: 'Exemplo completo: a marca da Marina (consulta)',
    tempo: '',
  },
  {
    id: 'etapa-7',
    numero: '7',
    titulo: 'Checklist final e combinado da semana',
    tempo: '5 min',
  },
]

// ─────────────────────────────────────────────────────────────
// Skills 1 a 8
// ─────────────────────────────────────────────────────────────
export interface SkillConversa {
  id: 'identidade' | 'proposta'
  nome: string
}

export const CONVERSA_IDENTIDADE: SkillConversa = {
  id: 'identidade',
  nome: 'Minha identidade visual',
}
export const CONVERSA_PROPOSTA: SkillConversa = {
  id: 'proposta',
  nome: 'Minha proposta e entrega',
}

export interface SkillDef {
  numero: number
  nomeCurto: string
  nomeCompleto: string
  entrega: string
  conversa: SkillConversa
  prompt: string
}

// Os prompts oficiais de cada skill serão preenchidos nos próximos
// pedidos. Enquanto estiverem vazios, a caixa mostra o aviso de
// conteúdo em preparação (mesmo comportamento do Encontro 4).
export const SKILLS_ENCONTRO_5: SkillDef[] = [
  {
    numero: 1,
    nomeCurto: 'Personalidade',
    nomeCompleto: 'Skill 1 · Personalidade da marca',
    entrega: 'Define em poucas palavras como a sua marca fala e se comporta.',
    conversa: CONVERSA_IDENTIDADE,
    prompt: '',
  },
  {
    numero: 2,
    nomeCurto: 'Paleta',
    nomeCompleto: 'Skill 2 · Paleta de cores',
    entrega: 'Escolhe as cores da sua marca a partir da psicologia das cores.',
    conversa: CONVERSA_IDENTIDADE,
    prompt: '',
  },
  {
    numero: 3,
    nomeCurto: 'Fontes',
    nomeCompleto: 'Skill 3 · Fontes e tipografia',
    entrega: 'Indica as fontes que combinam com o tom da sua marca.',
    conversa: CONVERSA_IDENTIDADE,
    prompt: '',
  },
  {
    numero: 4,
    nomeCurto: 'Símbolo',
    nomeCompleto: 'Skill 4 · Símbolo e ícone',
    entrega: 'Orienta a criação de um símbolo simples e memorável.',
    conversa: CONVERSA_IDENTIDADE,
    prompt: '',
  },
  {
    numero: 5,
    nomeCurto: 'Logo',
    nomeCompleto: 'Skill 5 · Logo e variações',
    entrega: 'Organiza como o seu logo aparece em cada canal.',
    conversa: CONVERSA_IDENTIDADE,
    prompt: '',
  },
  {
    numero: 6,
    nomeCurto: 'PVU',
    nomeCompleto: 'Skill 6 · Proposta de Valor Única',
    entrega: 'Refina a sua PVU com base no Manifesto.',
    conversa: CONVERSA_PROPOSTA,
    prompt: '',
  },
  {
    numero: 7,
    nomeCurto: 'Entrega',
    nomeCompleto: 'Skill 7 · Descrição da entrega',
    entrega: 'Descreve com clareza o que a sua solução entrega.',
    conversa: CONVERSA_PROPOSTA,
    prompt: '',
  },
  {
    numero: 8,
    nomeCurto: 'Manual',
    nomeCompleto: 'Skill 8 · Manual da marca',
    entrega: 'Reúne tudo em um manual simples para usar todos os dias.',
    conversa: CONVERSA_IDENTIDADE,
    prompt: '',
  },
]

// Rótulos dos grupos da faixa visual do fluxo de skills.
export const GRUPO_IDENTIDADE_1_A_5 = 'Conversa: Minha identidade visual'
export const GRUPO_PROPOSTA_6_E_7 = 'Conversa: Minha proposta e entrega'
export const GRUPO_MANUAL_VOLTA = 'Volta para Minha identidade visual'

// ─────────────────────────────────────────────────────────────
// Etapa 0 · Antes de começar
// ─────────────────────────────────────────────────────────────
export const ETAPA0_ABERTURA =
  'Hoje a sua marca ganha rosto e voz. Você vai sair deste encontro com a paleta de cores, as fontes, o símbolo, a direção do logo, a sua Proposta de Valor Única refinada e a declaração do que a sua solução entrega. Tudo nasce do seu Manifesto, e uma skill de IA cuida de cada peça.'

export const CHECKLIST_ETAPA0: { id: string; texto: string }[] = [
  { id: 'e0-1', texto: 'Meu Projeto no ChatGPT aberto, com o Manifesto da marca dentro' },
  { id: 'e0-2', texto: 'ChatGPT aberto no computador' },
  { id: 'e0-3', texto: 'Três marcas, perfis ou lugares cuja estética eu admiro, de qualquer área' },
  { id: 'e0-4', texto: 'As cores que eu mais vejo nos perfis de psicólogas do meu nicho' },
  {
    id: 'e0-5',
    texto:
      'O nome exato que quero no meu logo e uma assinatura curta (ex.: Psicóloga · Psicanálise)',
  },
]

// ─────────────────────────────────────────────────────────────
// Etapa 1 · O que é uma marca
// ─────────────────────────────────────────────────────────────
export const ETAPA1_BLOCO1_TITULO = 'Marca não é logo'
export const ETAPA1_BLOCO1 =
  'Sua marca é o que as pessoas sentem e lembram de você quando você não está na sala. O logo é a última coisa. A marca já existe: está no Manifesto que você escreveu. Hoje você vai dar roupa, cor e voz para ela.'

export const ETAPA1_BLOCO2_TITULO = 'O iceberg da marca'
export const ETAPA1_BLOCO2 =
  "O que aparece no Instagram é só a ponta. Embaixo d'água está o Manifesto. Quando a parte de cima não combina com a de baixo, a pessoa sente que tem algo estranho, mesmo sem saber explicar. Identidade visual é a parte de cima contando a mesma história da parte de baixo."

export const ETAPA1_BLOCO3_TITULO = 'Do Manifesto à identidade'
export const ETAPA1_BLOCO3 =
  "Cada palavra do Manifesto vira uma decisão visual. Exemplo: 'acolhimento com firmeza' pode virar tons quentes e profundos com uma fonte sólida, sem traços infantis."

export const ETAPA1_ATENCAO =
  "Nenhuma escolha de hoje é por gosto pessoal. Cada cor e cada fonte precisa responder: isso combina com o que eu escrevi no meu Manifesto? Se a resposta for 'é que eu acho bonito', a escolha ainda não está pronta."

// Cartões das peças da identidade visual.
export interface PecaIdentidadeDef {
  id: string
  icone: 'paleta' | 'fontes' | 'simbolo' | 'logo'
  titulo: string
  texto: string
}

export const PECAS_IDENTIDADE: PecaIdentidadeDef[] = [
  {
    id: 'paleta',
    icone: 'paleta',
    titulo: 'Paleta',
    texto:
      '5 cores com função (principal, secundária, destaque, neutra clara, neutra escura), usadas na proporção 60, 30 e 10.',
  },
  {
    id: 'fontes',
    icone: 'fontes',
    titulo: 'Fontes',
    texto:
      'duas bastam, uma com personalidade para títulos e uma muito legível para textos, do Google Fonts, que são gratuitas e estão no Canva.',
  },
  {
    id: 'simbolo',
    icone: 'simbolo',
    titulo: 'Símbolo',
    texto: 'carrega uma ideia do seu Manifesto, não precisa explicar a psicologia.',
  },
  {
    id: 'logo',
    icone: 'logo',
    titulo: 'Logo',
    texto:
      'para psicóloga autônoma, o seu nome é a marca. Precisa funcionar minúsculo, na foto de perfil, e em preto e branco.',
  },
]

export const ETAPA1_DICA_SIMBOLO =
  'Clichês da psicologia, como cérebro, quebra-cabeça, borboleta, árvore com cabeça e a letra psi, não são proibidos, mas não fazem ninguém lembrar de você.'

// ─────────────────────────────────────────────────────────────
// Etapa 2 · Psicologia das cores
// ─────────────────────────────────────────────────────────────
export const ETAPA2_ABERTURA =
  'Cada cor carrega associações emocionais, e as grandes marcas escolhem as suas de propósito. Toque em cada cor da roda para ver o que ela costuma transmitir e como é lida numa marca de psicologia.'

export const ETAPA2_BLOCO_MUDA_TITULO = 'O que isso muda na sua marca'
export const ETAPA2_BLOCO_MUDA =
  'Estudos de marketing apontam que usar a mesma paleta com constância aumenta muito o reconhecimento de uma marca, e que a aparência visual pesa na decisão de compra.'

export const ETAPA2_ATENCAO =
  'Como psicólogas, vale um olhar crítico: são associações culturais, não leis científicas. A mesma cor significa coisas diferentes em culturas e idades diferentes, e o tom muda tudo. O mesmo vermelho que pede urgência numa promoção pode ser o vinho profundo de uma escuta psicanalítica.'

export interface PerguntaCorDef {
  numero: number
  texto: string
}

export const PERGUNTAS_CORES: PerguntaCorDef[] = [
  { numero: 1, texto: 'Qual é a personalidade da minha marca, segundo o Manifesto?' },
  { numero: 2, texto: 'O que o meu público sente e prefere (idade, momento de vida, cultura)?' },
  {
    numero: 3,
    texto: 'O que as outras psicólogas do meu nicho já usam, para eu não ficar igual a todo mundo?',
  },
]

export const ETAPA2_DICA =
  'Verde menta com lilás está em metade dos perfis de psicóloga. Não é proibido, mas não diferencia.'

export const ETAPA2_LINK_URL =
  'https://www.agenciazeniti.com.br/post/a-influencia-das-cores-no-marketing-e-branding-a-psicologia-por-tras-das-decisoes-de-compra'
export const ETAPA2_LINK_TEXTO = 'Leia mais: a influência das cores no branding'

// Checklist único das Etapas 1 e 2.
export const CHECKLIST_ETAPAS_1_2: { id: string; texto: string }[] = [
  { id: 'e12-1', texto: 'Entendi que a marca nasce do Manifesto' },
  { id: 'e12-2', texto: 'Explorei a roda das cores' },
  { id: 'e12-3', texto: 'Anotei as cores mais usadas no meu nicho' },
]

// ─────────────────────────────────────────────────────────────
// Roda das cores: 8 fatias
// ─────────────────────────────────────────────────────────────
export interface CorRodaDef {
  id: string
  nome: string
  fill: string
  texto: string
  associacoes: string
  leituraPsicologia: string
}

export const CORES_RODA: CorRodaDef[] = [
  {
    id: 'vermelho',
    nome: 'Vermelho',
    fill: '#DC2626',
    texto: '#FFFFFF',
    associacoes: 'energia, paixão, urgência, juventude',
    leituraPsicologia: 'intensa demais como cor principal; funciona como pequeno destaque.',
  },
  {
    id: 'laranja',
    nome: 'Laranja',
    fill: '#EA580C',
    texto: '#FFFFFF',
    associacoes: 'vibração, entusiasmo, segurança, confiança',
    leituraPsicologia: 'calor e proximidade; nos tons terracota, acolhimento.',
  },
  {
    id: 'amarelo',
    nome: 'Amarelo',
    fill: '#FACC15',
    texto: '#3F3F46',
    associacoes: 'alegria, vitalidade, dinamismo',
    leituraPsicologia: 'abertura e otimismo; difícil de ler como cor de texto.',
  },
  {
    id: 'verde',
    nome: 'Verde',
    fill: '#16A34A',
    texto: '#FFFFFF',
    associacoes: 'relacionamento, cura, renovação, prosperidade',
    leituraPsicologia: 'cuidado e equilíbrio; muito usado na saúde, diferencia pouco.',
  },
  {
    id: 'azul',
    nome: 'Azul',
    fill: '#2563EB',
    texto: '#FFFFFF',
    associacoes: 'serenidade, paz, estabilidade, compromisso',
    leituraPsicologia: 'confiança e calma; pode ficar frio e institucional.',
  },
  {
    id: 'roxo',
    nome: 'Roxo',
    fill: '#7C3AED',
    texto: '#FFFFFF',
    associacoes: 'exclusividade, qualidade, profundidade, inovação',
    leituraPsicologia: 'profundidade e transformação; muito saturado parece místico.',
  },
  {
    id: 'preto',
    nome: 'Preto',
    fill: '#18181B',
    texto: '#FFFFFF',
    associacoes: 'força, elegância, sofisticação',
    leituraPsicologia: 'autoridade; em excesso, distância.',
  },
  {
    id: 'branco',
    nome: 'Branco',
    fill: '#FFFFFF',
    texto: '#3F3F46',
    associacoes: 'clareza, simplicidade, tranquilidade',
    leituraPsicologia: 'respiro; sozinho, fica sem personalidade.',
  },
]

// ─────────────────────────────────────────────────────────────
// Amostra de paleta (exemplo da marca fictícia da Marina)
// ─────────────────────────────────────────────────────────────
export interface CorPaletaDef {
  nome: string
  hex: string
  funcao: string
}

export const PALETA_MARINA: CorPaletaDef[] = [
  { nome: 'Roxo profundo', hex: '#5B21B6', funcao: 'Cor principal' },
  { nome: 'Lilás', hex: '#C4B5FD', funcao: 'Fundos suaves' },
  { nome: 'Laranja acolhedor', hex: '#EA580C', funcao: 'Botões e destaques' },
  { nome: 'Off white', hex: '#FAF7F2', funcao: 'Fundo das artes' },
  { nome: 'Grafite', hex: '#3F3F46', funcao: 'Textos' },
]
