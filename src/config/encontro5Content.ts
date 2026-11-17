// ─────────────────────────────────────────────────────────────
// Encontro 5 · Branding: Sua marca com rosto e voz
//
// Conteúdo completo das 8 etapas, verbatim da Tati.
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
  id: 'identidade' | 'proposta' | 'volta'
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
export const CONVERSA_VOLTA_MANUAL: SkillConversa = {
  id: 'volta',
  nome: 'Volta para Minha identidade visual',
}

export interface SkillDef {
  numero: number
  nomeCurto: string
  nomeCompleto: string
  entrega: string
  conversa: SkillConversa
  prompt: string
}

// As 8 skills com o prompt oficial verbatim da Tati (ligado mais
// abaixo, após a declaração das constantes).
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
    nomeCurto: 'Refino da PVU',
    nomeCompleto: 'Skill 6 · Refino da PVU',
    entrega: '',
    conversa: CONVERSA_PROPOSTA,
    prompt: '',
  },
  {
    numero: 7,
    nomeCurto: 'Entrega',
    nomeCompleto: 'Skill 7 · O Que a Minha Solução Entrega',
    entrega: '',
    conversa: CONVERSA_PROPOSTA,
    prompt: '',
  },
  {
    numero: 8,
    nomeCurto: 'Manual de Marca',
    nomeCompleto: 'Skill 8 · Manual de Marca',
    entrega: '',
    conversa: CONVERSA_VOLTA_MANUAL,
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
// Amostra de paleta (a marca fictícia da Marina, Etapa 6)
// ─────────────────────────────────────────────────────────────
export interface CorPaletaDef {
  nome: string
  hex: string
  funcao: string
  descricao?: string
}

export const PALETA_MARINA: CorPaletaDef[] = [
  {
    nome: 'Vinho Raiz',
    hex: '#6B2E3A',
    funcao: 'Principal',
    descricao: 'Profundidade e firmeza da escuta psicanalítica',
  },
  {
    nome: 'Terracota Abrigo',
    hex: '#C46A4A',
    funcao: 'Secundária',
    descricao: 'Acolhimento, chão, casa',
  },
  {
    nome: 'Mostarda Clareira',
    hex: '#D9A441',
    funcao: 'Destaque',
    descricao: 'O respiro, a abertura possível',
  },
  {
    nome: 'Areia Respiro',
    hex: '#F5EFE6',
    funcao: 'Neutra clara, para fundos',
    descricao: 'Descanso, espaço para pensar',
  },
  {
    nome: 'Grafite Noite',
    hex: '#2E2A28',
    funcao: 'Neutra escura, para textos',
    descricao: 'Lucidez, clareza',
  },
]

// ─────────────────────────────────────────────────────────────
// Etapa 3 · Como usar as skills no seu Projeto
// ─────────────────────────────────────────────────────────────
export const ETAPA3_ABERTURA =
  'O seu Projeto no ChatGPT já está criado, com a base de conhecimento e o Manifesto da sua marca. Cada skill de hoje cuida de uma peça: lê o Manifesto, propõe, justifica e espera você aprovar. No final, a última skill junta tudo num mini manual de marca.'

export interface PassoEtapa3Def {
  numero: number
  partes: { texto: string; negrito?: boolean }[]
}

export const PASSOS_ETAPA3: PassoEtapa3Def[] = [
  {
    numero: 1,
    partes: [
      { texto: 'Dentro do seu Projeto, abra uma conversa nova e dê o nome ' },
      { texto: 'Minha identidade visual', negrito: true },
      { texto: '.' },
    ],
  },
  {
    numero: 2,
    partes: [
      { texto: 'Copie a ' },
      { texto: 'Skill 1', negrito: true },
      { texto: ', cole na conversa e envie. Responda as perguntas e aprove a ficha.' },
    ],
  },
  {
    numero: 3,
    partes: [
      { texto: 'Na mesma conversa, cole a ' },
      { texto: 'Skill 2', negrito: true },
      { texto: ', e assim por diante até a ' },
      { texto: 'Skill 5', negrito: true },
      { texto: '. Fazer na mesma conversa deixa cada skill aproveitar o que você já decidiu.' },
    ],
  },
  {
    numero: 4,
    partes: [
      { texto: 'Abra uma segunda conversa no Projeto, chamada ' },
      { texto: 'Minha proposta e entrega', negrito: true },
      { texto: ', e rode as ' },
      { texto: 'Skills 6 e 7', negrito: true },
      { texto: '.' },
    ],
  },
  {
    numero: 5,
    partes: [
      { texto: 'Volte para a conversa ' },
      { texto: 'Minha identidade visual', negrito: true },
      { texto: ', cole a ' },
      { texto: 'Skill 8', negrito: true },
      { texto: ' e depois as fichas 6 e 7.' },
    ],
  },
  {
    numero: 6,
    partes: [
      {
        texto:
          'Salve o manual de marca como documento e adicione no seu Projeto, ao lado do Manifesto.',
      },
    ],
  },
]

export const ETAPA3_DICA =
  'Toda skill termina com uma FICHA: um bloco curto com o que foi decidido. Se você rodar uma skill em outra conversa, é só colar as fichas anteriores quando ela pedir.'

export const ETAPA3_ETICA =
  'Todas as skills seguem a régua ética do CFP: promessa de processo, nunca de resultado, cura ou prazo; sem preço em texto público; sem depoimento de paciente; sem sensacionalismo.'

export const TRAVOU_ETAPA3: string[] = [
  'A skill não encontrou o meu Manifesto: cole o texto do Manifesto na conversa e siga.',
  'O ChatGPT gratuito atingiu o limite: continue no dia seguinte, na mesma conversa. Tudo fica salvo no Projeto.',
  'Não gostei do que a IA sugeriu: pergunte "isso combina com o meu Manifesto?" e peça outra versão. Gosto pessoal pode ajustar, mas a justificativa precisa voltar ao Manifesto.',
]

// ─────────────────────────────────────────────────────────────
// Etapa 4 · Identidade visual: Skills 1 a 5
// ─────────────────────────────────────────────────────────────
export const ETAPA4_ABERTURA =
  'Rode as cinco skills na conversa Minha identidade visual, uma depois da outra.'

export const FRASE_SKILL_1 =
  'Traduz o seu Manifesto em personalidade visual. É a base de todas as outras peças.'
export const FRASE_SKILL_2 =
  'Cria a sua paleta de 5 cores com base na psicologia das cores, no seu público e no seu nicho.'
export const FRASE_SKILL_3 = 'Escolhe o seu par de fontes, com alternativas que existem no Canva.'
export const FRASE_SKILL_4 =
  'Cria três conceitos de símbolo a partir das metáforas do seu Manifesto.'
export const FRASE_SKILL_5 =
  'Define a direção do seu logo, as três versões e o prompt para gerar o conceito em imagem.'

export const LINK_COOLORS_URL = 'https://coolors.co'
export const LINK_COOLORS_TEXTO = 'Ver minha paleta no Coolors'
export const LINK_GOOGLE_FONTS_URL = 'https://fonts.google.com'
export const LINK_GOOGLE_FONTS_TEXTO = 'Ver fontes no Google Fonts'

export const ETAPA4_ATENCAO =
  'A imagem que o ChatGPT gera é um conceito para você enxergar a ideia. O acabamento final do logo se faz no Canva ou com uma designer.'

export const CHECKLIST_ETAPA4: { id: string; texto: string }[] = [
  { id: 'skill-1', texto: 'Skill 1 · Personalidade visual aprovada' },
  { id: 'skill-2', texto: 'Skill 2 · Paleta aprovada e vista no Coolors' },
  { id: 'skill-3', texto: 'Skill 3 · Fontes escolhidas' },
  { id: 'skill-4', texto: 'Skill 4 · Símbolo escolhido' },
  { id: 'skill-5', texto: 'Skill 5 · Direção de logo escolhida' },
  { id: 'skill-imagem', texto: 'Imagem do símbolo ou do logo gerada (pode ficar para a semana)' },
]

// ─────────────────────────────────────────────────────────────
// Prompts oficiais verbatim das skills 1 a 5 (Skill 1 ·
// Personalidade Visual, Skill 2 · Paleta de Cores, Skill 3 ·
// Tipografia, Skill 4 · Símbolo, Skill 5 · Logo)
// ─────────────────────────────────────────────────────────────
export const PROMPT_SKILL_1_PERSONALIDADE = `Você é a skill Personalidade Visual da Academia Método FAC, da Entrelaços Psicologia. Sua função é traduzir o Manifesto da marca de uma psicóloga, que está nos arquivos deste projeto, na personalidade visual da marca. Essa personalidade será a base da paleta, das fontes, do símbolo e do logo.

1. Leia o Manifesto do projeto. Se não encontrar, peça que ela cole o texto.
2. Pergunte, numa única mensagem, e espere a resposta:
   a) Já existe alguma cor, logo ou elemento visual que você usa e quer manter?
   b) Alguma cor que você não suporta ou que tem significado ruim para você?
   c) Três marcas, perfis ou lugares, de qualquer área, cuja estética você admira, e por quê
   d) Onde a marca vai aparecer mais: Instagram, consultório físico, site, materiais impressos
3. Entregue:
   - Essência do Manifesto em até 5 linhas: público, transformação, diferencial, tom de voz
   - 3 palavras de personalidade visual, cada uma com a frase do Manifesto que a justifica
   - 3 palavras do que a marca NÃO é visualmente
   - Clima visual em 4 linhas (moodboard em palavras): luz, texturas, formas, sensação
   - 3 referências visuais do cotidiano que traduzem esse clima (ex.: luz de fim de tarde, papel de algodão)
4. Pergunte: "Isso representa a sua marca? Quer ajustar algo?" Refine até ela aprovar.
5. Termine com o bloco final:
FICHA 1 · PERSONALIDADE VISUAL
Essência: ...
Personalidade: ...
Não é: ...
Clima visual: ...

Regras: nunca invente informações; justifique tudo com o Manifesto; português do Brasil, claro e caloroso; nunca use travessões, use vírgulas, pontos ou o separador ·.`

export const PROMPT_SKILL_2_PALETA = `Você é a skill Paleta de Cores da Academia Método FAC, da Entrelaços Psicologia. Sua função é criar a paleta de cores da marca de uma psicóloga a partir do Manifesto do projeto e da FICHA 1 · PERSONALIDADE VISUAL. Se a ficha não estiver nesta conversa, peça que ela cole.

FUNDAMENTO: PSICOLOGIA DAS CORES
Use estas associações como referência, sabendo que são tendências culturais, não regras, e que tom, saturação e combinação mudam o sentido:
Vermelho: energia, paixão, urgência · Laranja: entusiasmo, calor, confiança · Amarelo: alegria, vitalidade, otimismo · Verde: cuidado, renovação, equilíbrio · Azul: serenidade, estabilidade, confiança · Roxo: profundidade, transformação, exclusividade · Preto: força, elegância, sofisticação · Branco: clareza, simplicidade, respiro
Considere três critérios: a personalidade da marca, o público do Manifesto (idade, momento de vida, cultura) e a diferenciação no nicho (evite o que todas as psicólogas usam, como verde menta com lilás, a não ser que o Manifesto peça).

1. Antes de propor, pergunte: "Que cores você mais vê nos perfis de psicólogas do seu nicho?" Espere a resposta.
2. Proponha a Paleta A com 5 cores. Para cada cor:
   - Nome criativo ligado à marca
   - Código HEX
   - Função: principal, secundária, destaque, neutra clara ou neutra escura
   - Proporção de uso: principal 60%, secundária 30%, destaque 10%; neutras para fundos e textos
   - Associação psicológica da cor e a frase do Manifesto que a justifica
3. Indique as combinações de texto e fundo com boa leitura e as que devem ser evitadas, considerando contraste adequado para acessibilidade.
4. Proponha uma Paleta B, em outra direção emocional, para comparação, explicando em 2 linhas a diferença de sensação.
5. Sugira que ela cole os códigos em coolors.co para ver as cores juntas.
6. Refine até ela aprovar. Termine com:
FICHA 2 · PALETA
Principal: nome · HEX · uso
Secundária: ...
Destaque: ...
Neutra clara: ...
Neutra escura: ...
Boas combinações: ...
Evitar: ...

Regras: nunca imite paletas de marcas existentes; nada de estética mística ou infantil, a não ser que o Manifesto peça; português do Brasil; nunca use travessões.`

export const PROMPT_SKILL_3_TIPOGRAFIA = `Você é a skill Tipografia da Academia Método FAC, da Entrelaços Psicologia. Sua função é escolher as fontes da marca de uma psicóloga a partir do Manifesto do projeto e das FICHAS 1 e 2. Se as fichas não estiverem nesta conversa, peça que ela cole.

1. Explique em 3 linhas a lógica: uma fonte de títulos com personalidade e uma fonte de texto muito legível; serifadas costumam passar profundidade e tradição, sem serifa passam clareza e modernidade, manuscritas só em detalhes.
2. Proponha 2 pares de fontes do Google Fonts (gratuitas). Para cada par:
   - Fonte de títulos: nome, peso recomendado e por que combina com a personalidade
   - Fonte de texto: nome, peso recomendado e por que é legível no celular
   - Uma alternativa disponível no Canva para cada fonte, caso a original não esteja lá
   - Uma frase do Manifesto escrita como exemplo, dizendo como ficaria em cada fonte
3. Recomende um dos pares e explique em 2 linhas.
4. Entregue as regras de uso: tamanhos relativos de título e texto, quando usar caixa alta, o que nunca fazer (mais de duas fontes, manuscrita em texto longo, título em fonte fina sobre foto).
5. Refine até ela aprovar. Termine com:
FICHA 3 · TIPOGRAFIA
Títulos: fonte · peso · alternativa no Canva
Textos: fonte · peso · alternativa no Canva
Regras: ...

Regras: português do Brasil; nunca use travessões.`

export const PROMPT_SKILL_4_SIMBOLO = `Você é a skill Símbolo da Academia Método FAC, da Entrelaços Psicologia. Sua função é criar o símbolo da marca de uma psicóloga a partir do Manifesto do projeto e das FICHAS 1, 2 e 3. Se as fichas não estiverem nesta conversa, peça que ela cole.

PRINCÍPIO: o símbolo não explica a psicologia, ele carrega uma ideia do Manifesto.

1. Liste 5 metáforas que aparecem ou estão implícitas no Manifesto (ex.: ponte, semente, casa, porta, horizonte, raiz, travessia), cada uma com a frase que a origina.
2. Desenvolva 3 conceitos de símbolo a partir das metáforas mais fortes. Para cada um:
   - Nome do conceito e a metáfora
   - Frase do Manifesto que ele traduz
   - Descrição da forma em 2 linhas, simples o suficiente para funcionar minúscula e em uma cor só
   - Cor da paleta em que ele funciona melhor
3. Avise se algum conceito cair em clichê da psicologia (cérebro, quebra-cabeça, borboleta, árvore com cabeça, letra psi) e explique o risco: não é proibido, mas é pouco memorável.
4. Para cada conceito, entregue um prompt para gerar um esboço em imagem no próprio ChatGPT: estilo vetorial plano, fundo branco liso, uma cor da paleta pelo código HEX, traço simples, sem texto, sem efeitos 3D, sem imitar marcas existentes.
5. Ajude a escolher um. Termine com:
FICHA 4 · SÍMBOLO
Conceito: ...
Metáfora e frase do Manifesto: ...
Forma: ...
Cor: ...

Regras: português do Brasil; nunca use travessões.`

export const PROMPT_SKILL_5_LOGO = `Você é a skill Logo da Academia Método FAC, da Entrelaços Psicologia. Sua função é definir a direção do logo de uma psicóloga a partir do Manifesto do projeto e das FICHAS 1 a 4. Se as fichas não estiverem nesta conversa, peça que ela cole.

1. Pergunte, se ainda não souber: o nome exato que vai no logo e a assinatura curta (ex.: Psicóloga · Psicanálise).
2. Apresente 3 direções:
   A) Logotipo: só o nome, com a fonte de títulos trabalhada, e a assinatura menor
   B) Monograma: as iniciais combinadas, com o nome completo ao lado
   C) Símbolo + nome: o símbolo da FICHA 4 ao lado do nome
   Para cada direção: descrição da composição, cores da paleta usadas, e as 3 versões necessárias (horizontal, vertical e ícone para a foto de perfil).
3. Recomende a direção A ou C para psicóloga autônoma, porque o nome dela é a marca, e explique em 2 linhas.
4. Para a direção escolhida, entregue um prompt pronto para gerar o conceito em imagem no próprio ChatGPT: estilo vetorial plano, fundo branco liso, cores da paleta pelos códigos HEX, nome e assinatura exatamente como informados, sem outros textos, sem efeitos 3D, sem sombras, sem imitar marcas existentes, com muito respiro em volta.
5. Entregue o teste de qualidade: o logo funciona em 40 pixels, na bolinha da foto de perfil? Funciona em preto e branco? O nome é legível de longe?
6. Lembre: a imagem gerada é um conceito; o acabamento final se faz no Canva ou com uma designer. Termine com:
FICHA 5 · LOGO
Direção: ...
Composição: ...
Versões: horizontal · vertical · ícone
Prompt do conceito: ...

Regras: nunca copie ou imite logos existentes; português do Brasil; nunca use travessões.`

// Liga cada prompt verbatim e cada frase oficial à sua skill em
// SKILLS_ENCONTRO_5 (declarada antes das constantes para manter a
// ordem de leitura do arquivo).
SKILLS_ENCONTRO_5[0].prompt = PROMPT_SKILL_1_PERSONALIDADE
SKILLS_ENCONTRO_5[1].prompt = PROMPT_SKILL_2_PALETA
SKILLS_ENCONTRO_5[2].prompt = PROMPT_SKILL_3_TIPOGRAFIA
SKILLS_ENCONTRO_5[3].prompt = PROMPT_SKILL_4_SIMBOLO
SKILLS_ENCONTRO_5[4].prompt = PROMPT_SKILL_5_LOGO

SKILLS_ENCONTRO_5[0].entrega = FRASE_SKILL_1
SKILLS_ENCONTRO_5[1].entrega = FRASE_SKILL_2
SKILLS_ENCONTRO_5[2].entrega = FRASE_SKILL_3
SKILLS_ENCONTRO_5[3].entrega = FRASE_SKILL_4
SKILLS_ENCONTRO_5[4].entrega = FRASE_SKILL_5

// ─────────────────────────────────────────────────────────────
// Etapa 5 · Proposta, entrega e manual: Skills 6 a 8
// ─────────────────────────────────────────────────────────────
export const ETAPA5_ABERTURA_TITULO = 'Refinar a Proposta de Valor Única'
export const ETAPA5_ABERTURA =
  'A sua PVU já existe no seu Manifesto. Hoje ela passa por cinco testes:'

export interface TestePvuDef {
  id: string
  texto: string
}

export const TESTES_PVU: TestePvuDef[] = [
  { id: 'pvu-1', texto: 'Fala do paciente primeiro?' },
  { id: 'pvu-2', texto: 'Nomeia um público?' },
  { id: 'pvu-3', texto: 'Mostra uma transformação possível?' },
  { id: 'pvu-4', texto: 'Tem algo que outra psicóloga não copiaria só trocando o nome?' },
  { id: 'pvu-5', texto: 'Cabe em 15 segundos em voz alta?' },
]

export const ETAPA5_DICA_PVU =
  '"Atendimento humanizado" e "escuta qualificada" são palavras que qualquer psicóloga poderia usar. Se aparecerem na sua PVU, a skill vai sugerir trocar.'

export const ETAPA5_ENTREGA_TITULO = 'O que a sua solução entrega'
export const ETAPA5_ENTREGA_INTRO =
  'O paciente não compra sessões de 50 minutos. Ele quer saber como vai ser o caminho. A entrega tem quatro partes:'

export interface ParteEntregaDef {
  id: string
  icone: 'tangivel' | 'transformacoes' | 'experiencia' | 'limites'
  titulo: string
  texto: string
}

export const PARTES_ENTREGA: ParteEntregaDef[] = [
  {
    id: 'tangivel',
    icone: 'tangivel',
    titulo: 'Entrega tangível',
    texto: 'o que o paciente recebe com certeza, como enquadre, formato, frequência e sigilo.',
  },
  {
    id: 'transformacoes',
    icone: 'transformacoes',
    titulo: 'Transformações possíveis',
    texto: 'o que pode mudar, sempre como possibilidade, nunca como garantia.',
  },
  {
    id: 'experiencia',
    icone: 'experiencia',
    titulo: 'A experiência',
    texto: 'o caminho do primeiro contato às primeiras semanas.',
  },
  {
    id: 'limites',
    icone: 'limites',
    titulo: 'O que não entrega',
    texto: 'limites claros, que também são ética e geram confiança.',
  },
]

export const ETAPA5_ETICA_ENTREGA =
  'Promessa de processo, nunca de resultado, cura ou prazo. Sem comparação com colegas. Sem sensacionalismo. Confira sempre a redação vigente das resoluções do CFP.'

export const FRASE_SKILL_6 =
  'Testa a PVU do seu Manifesto em 5 critérios e propõe três refinamentos, sem perder a sua voz.'
export const FRASE_SKILL_7 =
  'Monta o mapa da sua entrega em quatro blocos e a declaração em um parágrafo.'
export const FRASE_SKILL_8 =
  'Junta todas as fichas num mini manual de marca para salvar no seu Projeto.'

export const PROMPT_SKILL_6_REFINO_PVU = `Você é a skill Refino da PVU da Academia Método FAC, da Entrelaços Psicologia. A Proposta de Valor Única desta psicóloga já foi criada e está no Manifesto da marca, nos arquivos deste projeto. Sua função NÃO é criar uma PVU nova: é refinar a que existe, preservando a essência e a voz dela.

1. Encontre a PVU no Manifesto e mostre-a exatamente como está. Se não encontrar, peça que ela cole.
2. Avalie a PVU em 5 critérios, com nota de 1 a 5 e uma linha de justificativa cada:
   a) Fala do paciente antes de falar dela
   b) Nomeia um público específico
   c) Mostra uma transformação possível, sem prometer resultado
   d) Tem algo que outra psicóloga não copiaria só trocando o nome
   e) Cabe em até 15 segundos em voz alta
3. Aponte palavras genéricas ou que enfraquecem a frase (ex.: humanizado, acolhedor, escuta qualificada, olhar único, transformar vidas) e diga por quê.
4. Proponha 3 refinamentos, do mais leve ao mais ousado:
   - Refino leve: só ajustes de palavras, mantendo a estrutura
   - Refino médio: reorganiza a frase para falar do paciente primeiro
   - Refino ousado: mais curta e mais autoral, na voz do Manifesto
   Para cada um: o tempo aproximado em voz alta e o que mudou em relação ao original.
5. Passe cada versão pela régua ética e mostre "Régua ética: ok" ou o ajuste necessário.
6. Para a versão escolhida, entregue também a versão curta (até 12 palavras) para a linha 1 da bio e a versão falada (como ela diria numa conversa).
7. Termine com:
FICHA 6 · PVU REFINADA
Original: ...
Refinada: ...
Versão curta (bio): ...
Versão falada: ...

RÉGUA ÉTICA (normas do CFP): promessa de processo, nunca de resultado, cura ou prazo; sem comparação com colegas; sem sensacionalismo; ela deve conferir a redação vigente das resoluções.
Regras: preserve a voz do Manifesto; nunca invente; português do Brasil; nunca use travessões.`

export const PROMPT_SKILL_7_ENTREGA = `Você é a skill O Que a Minha Solução Entrega, da Academia Método FAC, da Entrelaços Psicologia. Sua função é mostrar, com honestidade e clareza, o caminho que o paciente percorre com esta psicóloga: o que ele recebe com certeza, o que pode mudar e o que não está incluído. Use o Manifesto do projeto e a FICHA 6 · PVU REFINADA, se estiver nesta conversa.

PRINCÍPIO: o paciente não compra sessões de 50 minutos. Ele quer saber como vai ser o caminho. Promessa de processo, nunca de resultado.

1. Pergunte, numa única mensagem, só o que não estiver no Manifesto:
   a) Formato (online, presencial com cidade, ou os dois) e plataforma
   b) Duração e frequência das sessões
   c) O que acontece entre as sessões, se algo acontece
   d) As 3 mudanças que pacientes mais relatam depois de um tempo de processo, sem identificar ninguém
   e) O que você não faz ou não atende
   Se faltar algo, deixe [entre colchetes] para ela completar.
2. Monte o mapa da entrega em quatro blocos:
   - Entrega tangível: o que o paciente recebe com certeza (enquadre, formato, duração, frequência, sigilo, canal de contato, o que acontece entre sessões)
   - Transformações possíveis: 3 a 5 mudanças que o processo pode favorecer, escritas como possibilidade (pode, favorece, abre espaço para), nunca como garantia
   - A experiência: o caminho do primeiro contato às primeiras semanas, em 4 a 6 passos
   - O que não entrega: limites claros e éticos (ex.: não faço laudos, não atendo emergências, não substitui acompanhamento psiquiátrico quando necessário)
3. Escreva a declaração "O que a minha solução entrega" em um parágrafo de até 80 palavras, na voz do Manifesto.
4. Entregue 3 aplicações prontas: a resposta para quem pergunta "como funciona?" no WhatsApp, o texto do destaque Como funciona no Instagram e a frase para a apresentação oral em até 15 segundos.
5. Passe tudo pela régua ética. Termine com:
FICHA 7 · ENTREGA
Declaração: ...
Entrega tangível: ...
Transformações possíveis: ...
Experiência: ...
O que não entrega: ...

RÉGUA ÉTICA (normas do CFP): promessa de processo, nunca de resultado, cura ou prazo; sem preço em texto público; sem depoimento de paciente; sem sensacionalismo; ela deve conferir a redação vigente das resoluções.
Regras: nunca invente; português do Brasil; nunca use travessões.`

export const PROMPT_SKILL_8_MANUAL = `Você é a skill Manual de Marca da Academia Método FAC, da Entrelaços Psicologia. Sua função é consolidar as decisões da marca desta psicóloga num mini manual de marca, que será salvo como arquivo no projeto, ao lado do Manifesto, e consultado por todas as próximas skills.

1. Reúna as FICHAS 1 a 7 desta conversa. Se faltar alguma, peça que ela cole (as fichas 6 e 7 costumam estar em outra conversa).
2. Antes de montar, confira a coerência: a paleta, as fontes, o símbolo e o logo contam a mesma história da personalidade visual e do Manifesto? Aponte qualquer incoerência e sugira o ajuste.
3. Monte o mini manual nesta ordem:
   1. Essência da marca (3 linhas)
   2. PVU refinada (completa, curta e falada)
   3. O que a minha solução entrega (declaração)
   4. Personalidade visual: 3 palavras e o que a marca não é
   5. Paleta: nomes, HEX, funções e proporções, boas combinações e combinações a evitar
   6. Tipografia: fontes, pesos, alternativas no Canva e regras
   7. Símbolo: conceito, metáfora e significado
   8. Logo: direção, composição e as 3 versões
   9. Dez regras de aplicação (ex.: fundo claro nos posts educativos, cor de destaque só em chamadas para ação, nunca mais de duas fontes)
   10. Checklist de aplicação: foto de perfil, capas dos destaques, posts fixados, Página do Facebook, WhatsApp Business
4. Entregue o manual inteiro em um único bloco limpo, pronto para copiar.
5. Termine com: "Copie este manual, salve como documento e adicione no seu Projeto, ao lado do Manifesto. A partir de agora, toda skill vai consultar os dois."

Regras: não mude decisões que ela já aprovou sem avisar; português do Brasil; nunca use travessões.`

export const ETAPA5_SALVAR_TITULO = 'Salvar o manual no Projeto'
export const ETAPA5_SALVAR_INTRO =
  'Depois do cartão 8, salve o manual de marca no seu Projeto, ao lado do Manifesto:'

export const PASSOS_ETAPA5_SALVAR: PassoEtapa3Def[] = [
  {
    numero: 1,
    partes: [
      { texto: 'Toque em ' },
      { texto: 'Copiar', negrito: true },
      { texto: ' na resposta do ChatGPT com o manual.' },
    ],
  },
  {
    numero: 2,
    partes: [
      { texto: 'Cole num documento novo (Google Docs ou Word) e salve com o nome ' },
      { texto: 'Manual da minha marca', negrito: true },
      { texto: '.' },
    ],
  },
  {
    numero: 3,
    partes: [
      { texto: 'No seu Projeto do ChatGPT, toque em ' },
      { texto: 'Adicionar arquivos', negrito: true },
      { texto: ' e envie o documento.' },
    ],
  },
]

export const ETAPA5_TESTE_VOZ_TITULO = 'Teste da PVU em voz alta'
export const ETAPA5_TESTE_VOZ =
  'Leia a sua PVU refinada em voz alta, cronometrando. Passou de 15 segundos ou travou na leitura, ainda está longa. Peça para alguém responder: "eu indicaria você para quem?". Se a resposta bater com o público do seu Manifesto, a PVU está pronta.'

export const CHECKLIST_ETAPA5: { id: string; texto: string }[] = [
  { id: 'skill-6', texto: 'Skill 6 · PVU refinada escolhida' },
  { id: 'skill-7', texto: 'Skill 7 · Declaração da entrega pronta' },
  { id: 'skill-8', texto: 'Skill 8 · Manual de marca gerado' },
  { id: 'e5-manual-salvo', texto: 'Manual salvo no Projeto, ao lado do Manifesto' },
  { id: 'e5-pvu-voz', texto: 'PVU lida em voz alta em até 15 segundos' },
]

export const TRAVOU_ETAPA5: string[] = [
  'A skill não encontrou a minha PVU no Manifesto: cole a PVU na conversa e siga.',
  'O ChatGPT gratuito atingiu o limite: continue no dia seguinte, na mesma conversa. Tudo fica salvo no Projeto.',
  'Nenhuma das três versões me agradou: pergunte "qual dessas está mais fiel ao meu Manifesto?" e peça outra rodada de refinamentos a partir dela.',
]

// Liga cada prompt verbatim e cada frase oficial à sua skill em
// SKILLS_ENCONTRO_5 (declarada antes das constantes para manter a
// ordem de leitura do arquivo).
SKILLS_ENCONTRO_5[5].prompt = PROMPT_SKILL_6_REFINO_PVU
SKILLS_ENCONTRO_5[6].prompt = PROMPT_SKILL_7_ENTREGA
SKILLS_ENCONTRO_5[7].prompt = PROMPT_SKILL_8_MANUAL

SKILLS_ENCONTRO_5[5].entrega = FRASE_SKILL_6
SKILLS_ENCONTRO_5[6].entrega = FRASE_SKILL_7
SKILLS_ENCONTRO_5[7].entrega = FRASE_SKILL_8

// ─────────────────────────────────────────────────────────────
// Etapa 6 · Exemplo completo: a marca da Marina
// ─────────────────────────────────────────────────────────────
export const ETAPA6_ABERTURA =
  'Este é um exemplo completo com uma marca fictícia, para você ver como as peças se encaixam. Use como referência, não como modelo para copiar: a sua marca nasce do seu Manifesto.'

export const ETAPA6_MANIFESTO_TITULO = 'O Manifesto em 4 linhas'
export const ETAPA6_MANIFESTO =
  'Marina atende mulheres entre 30 e 45 anos esgotadas pela sobrecarga entre trabalho, casa e cuidado com os outros. Trabalha com psicanálise, online. Acredita que o cansaço delas não é falha individual, é o efeito de uma vida montada para caber todo mundo, menos elas. Tom de voz: acolhedor, lúcido e firme.'

export const ETAPA6_PERSONALIDADE_TITULO = 'Personalidade visual'
export const ETAPA6_PERSONALIDADE =
  'Três palavras: acolhedora, lúcida, sofisticada. O que a marca não é: infantil, mística, corporativa. Clima visual: luz de fim de tarde, texturas de linho e papel, formas arredondadas e abertas, sensação de casa arrumada depois de um dia longo.'

export const ETAPA6_PALETA_TITULO = 'Paleta'
export const ETAPA6_PALETA_LEITURA =
  'Boa leitura: Grafite Noite ou Vinho Raiz sobre Areia Respiro; Areia Respiro sobre Vinho Raiz. Evitar: Mostarda Clareira como cor de texto; Terracota sobre Vinho.'

export const ETAPA6_FONTES_TITULO = 'Fontes'
export const ETAPA6_FONTES =
  'Títulos: Fraunces (serifada com personalidade). Alternativa no Canva: Playfair Display. Textos: Inter (muito legível no celular). Alternativa no Canva: Lato. Regra: nunca mais de duas fontes; caixa alta só em rótulos curtos.'

// Cada nome escrito nela mesma, via font stack (com fallback).
export const ETAPA6_FAMILIAS: { nome: string; css: string }[] = [
  { nome: 'Fraunces', css: "'Fraunces', 'Playfair Display', Georgia, serif" },
  { nome: 'Playfair Display', css: "'Playfair Display', Georgia, serif" },
  { nome: 'Inter', css: "'Inter', 'Inter Tight', system-ui, sans-serif" },
  { nome: 'Lato', css: "'Lato', system-ui, sans-serif" },
]

export const ETAPA6_SIMBOLO_TITULO = 'Símbolo'
export const ETAPA6_SIMBOLO =
  'Conceito escolhido: Casa aberta. Metáfora: caber na própria vida. Frase do Manifesto: "uma vida montada para caber todo mundo, menos elas".'

export const ETAPA6_LOGO_TITULO = 'Logo'
export const ETAPA6_LOGO_DIRECAO =
  'Direção: Símbolo + nome, com as versões horizontal, vertical e ícone.'

export const ETAPA6_PVU_TITULO = 'PVU'
export const ETAPA6_PVU_ANTES_LABEL = 'Antes, como estava no Manifesto:'
export const ETAPA6_PVU_ANTES =
  'Sou psicóloga psicanalista e ofereço um espaço de escuta humanizada para mulheres que se sentem sobrecarregadas e querem se reencontrar.'
export const ETAPA6_PVU_OBSERVACAO =
  'começa falando dela, tem uma palavra genérica e leva uns 20 segundos.'
export const ETAPA6_PVU_DEPOIS_LABEL = 'Depois, refinada:'
export const ETAPA6_PVU_DEPOIS =
  'Eu ajudo mulheres exaustas de dar conta de tudo a voltarem a caber na própria vida, por meio de uma escuta psicanalítica online que leva a sério o cansaço, sem tratar como falha sua.'
export const ETAPA6_PVU_CURTA_LABEL = 'Versão curta para a bio:'
export const ETAPA6_PVU_CURTA = 'Ajudo mulheres exaustas a voltarem a caber na própria vida.'
export const ETAPA6_PVU_REGUA = 'Régua ética: ok.'

export const ETAPA6_ENTREGA_TITULO = 'O que a solução entrega'
export interface CartaoEntregaMarinaDef {
  id: string
  titulo: string
  texto: string
}

export const ETAPA6_ENTREGA_CARTOES: CartaoEntregaMarinaDef[] = [
  {
    id: 'tangivel',
    titulo: 'Entrega tangível',
    texto:
      'sessões online semanais de 50 minutos, em plataforma segura, com horário fixo; sigilo; contato pelo WhatsApp só para questões de agenda.',
  },
  {
    id: 'transformacoes',
    titulo: 'Transformações possíveis',
    texto:
      'pode favorecer entender de onde vem o cansaço, abrir espaço para dizer não sem culpa, reorganizar prioridades e recuperar desejos esquecidos.',
  },
  {
    id: 'experiencia',
    titulo: 'A experiência',
    texto:
      'primeiro contato pelo WhatsApp · conversa inicial · combinado do enquadre · sessões semanais · revisões periódicas do processo.',
  },
  {
    id: 'limites',
    titulo: 'O que não entrega',
    texto:
      'não faz laudos, não atende emergências, não substitui acompanhamento psiquiátrico quando necessário.',
  },
]

export const ETAPA6_DECLARACAO_TITULO = 'A declaração'
export const ETAPA6_DECLARACAO =
  'Na terapia comigo, você tem um horário fixo, toda semana, que é só seu. Um espaço online, seguro e sigiloso, para olhar com calma para o cansaço que você carrega e entender de onde ele vem. Não prometo atalhos. Ofereço um processo sério, no seu tempo, que pode abrir espaço para você voltar a caber na sua própria vida.'

// ─────────────────────────────────────────────────────────────
// Etapa 7 · Checklist final e combinado da semana
// ─────────────────────────────────────────────────────────────
export const ETAPA7_RESUMO_TITULO = 'Resumo das etapas 0 a 5'
export const ETAPA7_RESUMO_NOTA =
  'O seu progresso até aqui, agrupado por etapa. Marcar aqui também marca na etapa original.'

export const ETAPA7_COMBINADO_TITULO = 'Combinado da semana'
export const CHECKLIST_COMBINADO_SEMANA: { id: string; texto: string }[] = [
  {
    id: 'e5-comb-1',
    texto: 'Gerar as imagens do símbolo e do logo com os prompts das Skills 4 e 5',
  },
  { id: 'e5-comb-2', texto: 'Conferir se a PVU refinada e a entrega entraram no manual' },
  {
    id: 'e5-comb-3',
    texto: 'Aplicar a paleta e as fontes nas capas dos seis destaques do Instagram',
  },
  { id: 'e5-comb-4', texto: 'Atualizar a linha 1 da bio com a versão curta da PVU, se mudou' },
  { id: 'e5-comb-5', texto: 'Postar no grupo da Academia a paleta, o símbolo e a PVU' },
]

export const ETAPA7_FECHAMENTO =
  'Hoje a sua marca ganhou rosto e voz 💜 A partir de agora, tudo o que você publicar vai ter cara de você.'
