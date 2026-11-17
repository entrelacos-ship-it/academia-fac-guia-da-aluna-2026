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
    associacoes: 'Paixão, energia, urgência e ação.',
    leituraPsicologia:
      'Chama atenção na hora. Em marca de psicologia, use em pequenas doses, como um detalhe de botão ou destaque, para não criar sensação de alerta.',
  },
  {
    id: 'laranja',
    nome: 'Laranja',
    fill: '#EA580C',
    texto: '#FFFFFF',
    associacoes: 'Acolhimento humano, otimismo e movimento.',
    leituraPsicologia:
      'É a cor do cuidado ativo: transmite proximidade sem perder vitalidade. Funciona bem como cor de destaque de quem acolhe e caminha junto.',
  },
  {
    id: 'amarelo',
    nome: 'Amarelo',
    fill: '#FACC15',
    texto: '#3F3F46',
    associacoes: 'Luz, clareza, alegria e ideia nova.',
    leituraPsicologia:
      'Traz leveza e esperança. Em doses pequenas ilumina a marca; em doses grandes cansa a vista e pode parecer infantil.',
  },
  {
    id: 'verde',
    nome: 'Verde',
    fill: '#16A34A',
    texto: '#FFFFFF',
    associacoes: 'Crescimento, equilíbrio, saúde e natureza.',
    leituraPsicologia:
      'Leitura imediata de saúde e renovação. Combina com processos de desenvolvimento pessoal e bem estar contínuo.',
  },
  {
    id: 'azul',
    nome: 'Azul',
    fill: '#2563EB',
    texto: '#FFFFFF',
    associacoes: 'Confiança, serenidade, segurança e escuta.',
    leituraPsicologia:
      'É a cor mais lida como confiável. Para clínica, comunica um espaço calmo onde a pessoa pode falar sem medo.',
  },
  {
    id: 'roxo',
    nome: 'Roxo',
    fill: '#7C3AED',
    texto: '#FFFFFF',
    associacoes: 'Introspecção, profundidade, simbolismo e cuidado com o interior.',
    leituraPsicologia:
      'Fala de mundo interno e transformação. Faz sentido para quem trabalha autoconhecimento e processos profundos.',
  },
  {
    id: 'preto',
    nome: 'Preto',
    fill: '#18181B',
    texto: '#FFFFFF',
    associacoes: 'Elegância, sofisticação, autoridade e seriedade.',
    leituraPsicologia:
      'Dá peso de competência. Em fundo escuro inteiro pode ficar pesado; em tipografia e detalhes transmite firmeza.',
  },
  {
    id: 'branco',
    nome: 'Branco',
    fill: '#FFFFFF',
    texto: '#3F3F46',
    associacoes: 'Clareza, espaço, silêncio e recomeço.',
    leituraPsicologia:
      'Dá respiro e organiza. Uma marca com bastante branco parece limpa e acolhedora, como uma sala bem cuidada.',
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
