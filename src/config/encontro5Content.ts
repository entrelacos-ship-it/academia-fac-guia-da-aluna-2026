// ─────────────────────────────────────────────────────────────
// Encontro 5 · Branding: Sua marca com rosto e voz
//
// Etapas 0 a 4 com conteúdo oficial verbatim da Tati;
// as etapas 5 a 7 chegam nos próximos pedidos.
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

// Skills 1 a 5 com o prompt oficial verbatim da Tati (ligado mais
// abaixo, após a declaração das constantes). As skills 6 a 8 serão
// preenchidas nos próximos pedidos; enquanto estiverem vazias, a
// caixa mostra o aviso de conteúdo em preparação (mesmo
// comportamento do Encontro 4).
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
