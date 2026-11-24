// ═════════════════════════════════════════════════════════════
// Encontro 6 · Crenças sobre dinheiro, venda e exposição
// Conteúdo oficial (verbatim da Tati). Rascunho, publica no Admin.
// Sem travessões em nenhum texto.
// ═══════════════════════════

export const ENCONTRO6_ROTULO = 'ENCONTRO 6 · CRENÇAS'
export const ENCONTRO6_TITULO = 'O que ainda segura a sua mão'
export const ENCONTRO6_SUBTITULO =
  'Um laboratório para nomear as crenças sobre dinheiro, venda e exposição, transformar cada uma numa frase de virada e subir, degrau por degrau, a sua escada de coragem.'

export const ENCONTRO6_STORAGE_KEY = 'fac-guia-encontro6-checklists'

// ─────────────────────────────────────────────────────────────
// Definição das 8 etapas
// ─────────────────────────────────────────────────────────────
export interface Etapa6Def {
  id: string
  titulo: string
  tempo: string
}

export const ETAPAS_ENCONTRO_6: Etapa6Def[] = [
  { id: 'etapa-0', titulo: 'Antes de começar', tempo: '3 min' },
  { id: 'etapa-1', titulo: 'O que é uma crença', tempo: '8 min' },
  { id: 'etapa-2', titulo: 'Mito e fato sobre a ética', tempo: '5 min' },
  { id: 'etapa-3', titulo: 'Dinâmica: complete a frase', tempo: '15 min' },
  { id: 'etapa-4', titulo: 'As três skills', tempo: '55 min' },
  { id: 'etapa-5', titulo: 'Exemplo completo: as crenças da Marina', tempo: 'consulta' },
  { id: 'etapa-6', titulo: 'Minha escada de coragem', tempo: '7 dias' },
  { id: 'etapa-7', titulo: 'Cuidado com você e checklist final', tempo: '5 min' },
]

// ─────────────────────────────────────────────────────────────
// Etapa 0 · Antes de começar
// ─────────────────────────────────────────────────────────────
export const ETAPA0_ABERTURA =
  'Você já tem Manifesto, preço calculado, perfil pronto e marca com rosto e voz. Mesmo assim, é bem provável que alguma coisa tenha ficado parada: um post que não saiu, um preço que não foi dito, uma indicação que não foi pedida. Hoje a gente olha para o que trava por dentro. Não para se culpar, para entender.'

export const CHECKLIST_ETAPA0: { id: string; texto: string }[] = [
  { id: 'e0-1', texto: 'Papel e caneta para a dinâmica' },
  { id: 'e0-2', texto: 'Meu Projeto no ChatGPT aberto, com o Manifesto e o manual de marca' },
  { id: 'e0-3', texto: 'O valor da sessão que calculei no Encontro 3' },
  { id: 'e0-4', texto: 'Uma situação recente em que travei (um preço, um post, uma indicação)' },
]

export const ETAPA0_ETICA_TITULO = 'Nosso combinado'
export const ETAPA0_ETICA =
  'Ninguém é obrigada a compartilhar nada. O que for dito no encontro fica no encontro. Este é um laboratório profissional, não um espaço de terapia: a gente olha para como as crenças aparecem no seu trabalho. Se algo pessoal mais profundo surgir, ele merece um espaço próprio, na sua análise pessoal.'

// ─────────────────────────────────────────────────────────────
// Etapa 1 · O que é uma crença
// ─────────────────────────────────────────────────────────────
export const ETAPA1_PERGUNTA = 'Você já sabe o que fazer. Então por que ainda não faz?'

export const ETAPA1_BLOCO_LENSE_TITULO = 'Uma frase que virou lente'
export const ETAPA1_BLOCO_LENSE =
  'Uma crença é uma frase aprendida que virou lente. Ela não é verdade, nem defeito. É história. A gente não escolhe as primeiras crenças sobre dinheiro e trabalho: herda da família, da faculdade, da profissão. Elas funcionam como óculos. Quem usa não percebe a lente, só vê o mundo daquele jeito.'

export interface TerritorioDef {
  id: 'dinheiro' | 'venda' | 'exposicao'
  nome: string
  frases: string[]
}

export const TERRITORIOS: TerritorioDef[] = [
  {
    id: 'dinheiro',
    nome: 'Dinheiro',
    frases: [
      'Cobrar caro é ganância',
      'Quem ama o que faz não pensa em dinheiro',
      'Não posso cobrar de quem sofre',
    ],
  },
  {
    id: 'venda',
    nome: 'Venda',
    frases: [
      'Vender é empurrar',
      'Se eu for boa, os pacientes chegam sozinhos',
      'Falar de preço estraga o vínculo',
    ],
  },
  {
    id: 'exposicao',
    nome: 'Exposição',
    frases: [
      'Me mostrar é antiético',
      'Vão me achar superficial',
      'Quem sou eu para ensinar algo?',
    ],
  },
]

export const ETAPA1_ORIGENS_LABELS = [
  'Família',
  'Formação (o silêncio sobre dinheiro na faculdade)',
  'Cultura da profissão (vocação, sacerdócio)',
  'Leitura equivocada da ética',
  'Mercado (convênios e plataformas que pagam pouco)',
]

export const ETAPA1_ORIGENS_TEXTO =
  'Quantas aulas sobre dinheiro você teve na graduação? A formação ensina a cuidar e silencia sobre como viver disso. Esse silêncio também ensina: ensina que falar de dinheiro é sujo.'

export const ETAPA1_FALHA_LINHAS = [
  'Exaustão vira vocação.',
  'Cobrar barato vira humildade.',
  'Prosperar vira falha moral.',
]

export const ETAPA1_FALHA_TITULO = 'Não é falha sua'
export const ETAPA1_FALHA_TEXTO =
  'Essa é a precarização naturalizada da psicologia. Ela não é um problema individual seu. É uma estrutura que faz a profissional acreditar que se sacrificar é ser boa. Nomear isso já tira parte do peso.'

export const ETAPA1_SINAIS_TITULO = 'Os sinais no comportamento'
export const ETAPA1_SINAIS_TEXTO =
  'A crença não aparece falando. Ela aparece agindo. Por isso a gente começa pelos comportamentos: eles são a pista.'

export const ETAPA1_SINAIS_COLUNAS = ['O que você faz', 'A crença que pode estar por trás']
export interface SinalDef {
  acao: string
  crenca: string
}
export const ETAPA1_SINAIS: SinalDef[] = [
  { acao: 'Dá desconto antes de a pessoa pedir', crenca: 'Meu trabalho não vale isso' },
  {
    acao: 'Demora para responder quem pergunta o preço',
    crenca: 'Falar de dinheiro é constrangedor',
  },
  { acao: 'Tem o post pronto e não publica', crenca: 'Vão me julgar' },
  { acao: 'Não pede indicação', crenca: 'Pedir é incomodar' },
  { acao: 'Aceita tudo que paga pouco', crenca: 'Melhor pouco do que nada' },
]

export const ETAPA1_CUSTO_TITULO = 'O custo invisível'
export const ETAPA1_CUSTO =
  "Toda crença tem um preço: em dinheiro, em energia, em pacientes que não chegam até você. Se a crença 'não posso cobrar de quem sofre' faz você cobrar R$ 40 a menos por sessão, em 60 sessões por mês são R$ 2.400 que saem de você. E não é só dinheiro: é cansaço, é a supervisão que você não paga, é a formação que você adia."

export const ETAPA1_CAMINHO_PASSOS = [
  'Nomear',
  'Entender a origem',
  'Pesar o custo',
  'Buscar a contraevidência',
  'Escrever a virada',
  'Agir pequeno',
]

export const ETAPA1_CAMINHO_TEXTO =
  'A gente não arranca a crença à força. A gente nomeia, entende de onde veio, vê quanto ela custa, procura evidências de que ela não é tão verdadeira quanto parece, escreve uma nova frase e dá um passo pequeno na direção dela.'

export const ETAPA1_VIRADA_EVITE = 'Eu sou próspera e abundante'
export const ETAPA1_VIRADA_PREFIRA = 'Cobrar o justo sustenta o cuidado que eu ofereço'
export const ETAPA1_VIRADA_TITULO = 'Virada não é afirmação positiva'
export const ETAPA1_VIRADA_TEXTO =
  'A frase de virada precisa ser verdadeira, ética e ancorada no seu Manifesto. Ela não nega a dúvida, ela oferece um novo ângulo.'

// ─────────────────────────────────────────────────────────────
// Etapa 2 · Mito e Fato sobre a ética
// ────────────────────────────────────────────
export const ETAPA2_ABERTURA =
  'Muitas crenças se escondem atrás da ética. Mas a ética não pede que você se precarize. Ela pede clareza, honestidade e responsabilidade. Toque em cada cartão para ver o fato.'

export interface MitoFatoDef {
  id: string
  mito: string
  fato: string
}
export const MITOS_FATOS: MitoFatoDef[] = [
  {
    id: 'mf-1',
    mito: 'A ética pede que eu cobre pouco.',
    fato: 'O Código de Ética orienta honorários justos e combinados previamente, não baixos.',
  },
  {
    id: 'mf-2',
    mito: 'Psicóloga não pode divulgar o trabalho.',
    fato: 'A publicidade é regulada, não proibida. Divulgar com ética é permitido.',
  },
  {
    id: 'mf-3',
    mito: 'Falar de dinheiro com o paciente é antiético.',
    fato: 'Combinar o valor com clareza é parte do enquadre e protege o vínculo.',
  },
]

export const ETAPA2_ATENCAO =
  'Confira sempre o texto vigente do Código de Ética e das resoluções do CFP.'

// ─────────────────────────────────────────────────────────────
// Etapa 3 · Dinâmica: complete a frase
// ─────────────────────────────────────────────────────────────
export const ETAPA3_ABERTURA =
  'Antes de qualquer skill, a primeira resposta precisa ser sua, à mão, sem pensar muito. Pegue papel e caneta. Leia cada frase e escreva a primeira coisa que vier, em até 20 segundos. Sem corrigir, sem explicar. Ninguém precisa ler o que você escreveu.'

export interface GrupoFrasesDef {
  id: string
  nome: string
  frases: string[]
}
export const FRASES_DINAMICA: GrupoFrasesDef[] = [
  {
    id: 'dinheiro',
    nome: 'Dinheiro',
    frases: [
      'Dinheiro, para mim, é...',
      'Na minha casa, quando se falava de dinheiro...',
      'Uma psicóloga que cobra caro é...',
      'Se eu ganhasse o dobro do que ganho hoje, eu teria medo de...',
    ],
  },
  {
    id: 'venda',
    nome: 'Venda',
    frases: [
      'Vender o meu trabalho me faz sentir...',
      'Quando alguém pergunta o meu preço, eu...',
      'Pedir indicação é...',
      'Se eu for boa o suficiente, os pacientes...',
    ],
  },
  {
    id: 'exposicao',
    nome: 'Exposição',
    frases: [
      'Aparecer nas redes me faz sentir...',
      'Se eu publicar o que penso, as colegas vão...',
      'Quem sou eu para...',
      'Se o meu trabalho fosse visto por muita gente, eu...',
    ],
  },
]

export const ETAPA3_DEPOIS_TITULO = 'Depois de escrever'
export const ETAPA3_DEPOIS_PASSOS = [
  'Circule as três frases que mais mexeram com você, uma de cada território, se possível.',
  'Pergunte a si mesma: em qual território eu senti mais peso?',
  'Guarde essas três frases: elas são o ponto de partida da Skill 1.',
]

export const ETAPA3_DICA =
  'Se alguma frase mexer muito com você, tudo bem fazer uma pausa. Respire, beba uma água e volte quando quiser.'

export const CHECKLIST_ETAPAS_1_A_3: { id: string; texto: string }[] = [
  { id: 'e123-1', texto: 'Li sobre os três territórios' },
  { id: 'e123-2', texto: 'Virei os três cartões de Mito e Fato' },
  { id: 'e123-3', texto: 'Completei as doze frases no papel' },
  { id: 'e123-4', texto: 'Circulei as minhas três frases' },
]

// ─────────────────────────────────────────────────────────────
// Etapa 4 · As três skills
// ─────────────────────────────────────────────────────────────
export const ETAPA4_CONVERSA = 'Conversa: Minhas crenças'
export const ETAPA4_PASSOS = [
  'Dentro do seu Projeto no ChatGPT, abra uma conversa nova e dê o nome Minhas crenças.',
  'Copie a Skill 1, cole na conversa e envie. Quando ela pedir, cole as três frases que você circulou e três situações em que travou.',
  'Na mesma conversa, cole a Skill 2 e escolha as suas frases de virada.',
  'Ainda na mesma conversa, cole a Skill 3 e monte o seu Plano de Coragem.',
  'Copie a FICHA 3, salve como documento e adicione no seu Projeto, ao lado do Manifesto e do manual de marca.',
]

export interface Skill6Def {
  numero: number
  nomeCurto: string
  nomeCompleto: string
  frase: string
  conversa: string
  prompt: string
}

export const SKILLS_ENCONTRO_6: Skill6Def[] = [
  {
    numero: 1,
    nomeCurto: 'Escavadora',
    nomeCompleto: 'Skill 1 · Escavadora de Crenças',
    frase: 'Encontra as suas crenças a partir dos seus comportamentos e das frases da dinâmica.',
    conversa: 'Minhas crenças',
    prompt: '',
  },
  {
    numero: 2,
    nomeCurto: 'Frases de Virada',
    nomeCompleto: 'Skill 2 · Frases de Virada',
    frase:
      'Transforma cada crença central numa frase de virada verdadeira, ética e com a voz da sua marca.',
    conversa: 'Minhas crenças',
    prompt: '',
  },
  {
    numero: 3,
    nomeCurto: 'Plano de Coragem',
    nomeCompleto: 'Skill 3 · Mapa e Plano de Coragem',
    frase: 'Junta o seu mapa de crenças e cria uma escada de sete microações para a semana.',
    conversa: 'Minhas crenças',
    prompt: '',
  },
]

// Prompts verbatim das skills 1 a 3, em constantes próprias,
// ligadas por atribuição depois da declaração (padrão do Encontro 5).
export const PROMPT_SKILL_1_ESCAVADORA = `Você é a Escavadora de Crenças, skill da Academia Método FAC, da Entrelaços Psicologia. Sua função é ajudar uma psicóloga a identificar as crenças que travam a prática profissional dela em três territórios: dinheiro, venda e exposição. Você trabalha no nível da prática profissional, como um laboratório de consciência, e não como terapia.

CONTEXTO
O Manifesto da marca dela está nos arquivos deste projeto. Ele nomeia um inimigo comum: a precarização naturalizada da psicologia, que faz a profissional acreditar que exaustão é vocação, que cobrar barato é humildade e que prosperar é falha moral. Use essa lente: as crenças dela não são falha individual, são em grande parte aprendidas numa estrutura.

ETAPA 1 · PONTO DE PARTIDA
Peça, numa única mensagem:
1. As três frases que ela circulou na dinâmica "Complete a frase", com o que escreveu
2. Três situações recentes em que ela travou: um preço que não disse, um post que não publicou, uma indicação que não pediu, um desconto que deu sem pedirem
Espere a resposta.

ETAPA 2 · LEITURA DOS SINAIS
Para cada frase e cada situação, devolva:
- O território (dinheiro, venda ou exposição)
- A crença que pode estar por trás, escrita na primeira pessoa, como ela diria (ex.: "Se eu cobrar mais, vou parecer interesseira")
- O comportamento que essa crença produz
Apresente como hipóteses, com delicadeza: "Pode ser que...". Pergunte: "Isso faz sentido para você? Quer ajustar alguma?" Espere e ajuste.

ETAPA 3 · AS CRENÇAS CENTRAIS
Ajude a escolher UMA crença central por território, a que mais trava hoje. Para cada uma, explore com no máximo duas perguntas abertas por vez:
- De onde você acha que aprendeu isso? (família, formação, profissão, mercado)
- O que essa crença te protege de sentir?
- O que ela já te custou: em dinheiro, energia, oportunidades?
Não interprete conteúdos íntimos nem faça leituras clínicas sobre a história dela. Fique no nível da prática profissional.

ETAPA 4 · FICHA
Termine com:
FICHA 1 · MEU MAPA DE CRENÇAS
Dinheiro: crença · origem provável · comportamento · custo
Venda: crença · origem provável · comportamento · custo
Exposição: crença · origem provável · comportamento · custo

CUIDADO
Você não faz terapia, não diagnostica e não interpreta a história de vida dela. Se ela trouxer sofrimento intenso, conteúdos de trauma ou sinais de crise, acolha com cuidado em poucas frases, sugira levar o tema para a análise pessoal ou para um profissional de confiança e, em caso de crise, indique o CVV (188). Depois, pergunte se ela quer seguir com o exercício ou parar por hoje.

ESTILO
Português do Brasil, acolhedor e lúcido, no tom do Manifesto. Perguntas curtas, uma etapa por mensagem. Nunca use travessões; use vírgulas, pontos ou o separador ·.`

export const PROMPT_SKILL_2_VIRADA = `Você é a skill Frases de Virada, da Academia Método FAC, da Entrelaços Psicologia. Sua função é transformar as crenças centrais de uma psicóloga sobre dinheiro, venda e exposição em frases de virada. Use o Manifesto e o manual de marca, que estão nos arquivos deste projeto, e a FICHA 1 · MEU MAPA DE CRENÇAS. Se a ficha não estiver nesta conversa, peça que ela cole.

O QUE É UMA FRASE DE VIRADA
Não é afirmação positiva mágica ("sou próspera e abundante"). É uma frase verdadeira, ética e ancorada no Manifesto, que oferece um novo ângulo sem negar a dúvida. Uma psicóloga precisa acreditar nela.

Para cada uma das três crenças centrais, siga estes passos e mostre o resultado:
1. Contraevidência: 3 fatos ou experiências que mostram que a crença não é tão verdadeira quanto parece. Use o Manifesto, o que ela já viveu na clínica e o que diz o Código de Ética (honorários justos e combinados, publicidade regulada e não proibida). Pergunte a ela por uma evidência pessoal, se precisar.
2. Reenquadre: a mesma situação vista a partir dos valores do Manifesto.
3. Três versões de frase de virada, com até 15 palavras cada:
   A) Ética: conecta com o cuidado e com o Código de Ética
   B) Prática: conecta com a sustentabilidade da clínica
   C) Autoral: na voz e nas palavras do Manifesto
4. Teste de verdade: pergunte "Qual dessas você consegue dizer em voz alta sem sentir que está mentindo para si mesma?" Ajuste até ela escolher.

Termine com:
FICHA 2 · MINHAS FRASES DE VIRADA
Dinheiro: crença antiga → frase de virada
Venda: crença antiga → frase de virada
Exposição: crença antiga → frase de virada

REGRAS
- Nada de positividade forçada, promessa de enriquecimento ou linguagem de autoajuda
- As frases respeitam a ética da profissão
- Você não faz terapia; se surgir sofrimento intenso, acolha em poucas frases e sugira a análise pessoal
- Português do Brasil; nunca use travessões; uma etapa por mensagem`

export const PROMPT_SKILL_3_CORAGEM = `Você é a skill Mapa e Plano de Coragem, da Academia Método FAC, da Entrelaços Psicologia. Sua função é consolidar o trabalho de crenças de uma psicóloga e transformar as frases de virada em ação gradual. Use o Manifesto do projeto e as FICHAS 1 e 2. Se não estiverem nesta conversa, peça que ela cole.

ETAPA 1 · O MAPA
Monte o mapa de crenças em uma tabela com as colunas: Território · Crença antiga · Origem provável · O que ela me custa · Frase de virada.

ETAPA 2 · A ESCADA DE CORAGEM
Pergunte, numa única mensagem:
1. De 0 a 10, quanto desconforto ela sente hoje em: dizer o preço em voz alta, publicar uma opinião profissional, pedir uma indicação
2. Quanto tempo por dia ela consegue dedicar, de forma realista (5, 15 ou 30 minutos)
Crie uma escada de 7 microações, uma por dia, do desconforto mais baixo ao mais alto, misturando os três territórios. Cada microação:
- É concreta, cabe no tempo que ela disse e termina no mesmo dia
- Está ligada a uma frase de virada, que ela lê antes de agir
- Tem um critério simples de feito (ex.: "mandei a mensagem", "publiquei o post")
Exemplos de degraus: dizer o preço em voz alta sozinha, gravar um áudio dizendo o preço, responder a próxima pergunta de valor sem desconto, publicar um story com uma opinião profissional, mandar uma mensagem de apresentação para um colega, pedir uma indicação para alguém de confiança, publicar um post fixado.

ETAPA 3 · REGISTRO
Crie um quadro de registro para os 7 dias, com: Dia · Microação · Feito (sim ou não) · Como me senti (de 0 a 10) · O que aprendi.

Termine com:
FICHA 3 · MEU PLANO DE CORAGEM
O mapa, as três frases de virada e a escada de 7 dias, em um bloco limpo para copiar. Sugira salvar como documento no projeto, ao lado do Manifesto e do manual de marca.

REGRAS
- Gradual sempre: nunca comece pelo degrau mais difícil
- Microação que não foi feita não é fracasso, é informação: sugira um degrau menor
- Você não faz terapia; se surgir sofrimento intenso, acolha em poucas frases e sugira a análise pessoal
- Português do Brasil; nunca use travessões`

SKILLS_ENCONTRO_6[0].prompt = PROMPT_SKILL_1_ESCAVADORA
SKILLS_ENCONTRO_6[1].prompt = PROMPT_SKILL_2_VIRADA
SKILLS_ENCONTRO_6[2].prompt = PROMPT_SKILL_3_CORAGEM

export const TRAVOU_TITULO = 'Travou?'
export const TRAVOU_ITENS = [
  'A skill não encontrou o meu Manifesto: cole o texto do Manifesto na conversa e siga.',
  'As crenças que a IA sugeriu não parecem minhas: responda "isso não sou eu" e conte com suas palavras o que você sente. A skill ajusta.',
  'O ChatGPT gratuito atingiu o limite: escreva as frases de virada à mão, usando o exemplo da Etapa 1, e rode a Skill 3 no dia seguinte, na mesma conversa.',
]

export const CHECKLIST_ETAPA4: { id: string; texto: string }[] = [
  { id: 'skill-1', texto: 'Skill 1 · Meu mapa de crenças pronto' },
  { id: 'skill-2', texto: 'Skill 2 · Minhas três frases de virada escolhidas' },
  { id: 'skill-3', texto: 'Skill 3 · Meu Plano de Coragem montado' },
  { id: 'ficha-3', texto: 'FICHA 3 salva no meu Projeto' },
]

// ─────────────────────────────────────────────────────────────
// Etapa 5 · Exemplo completo: as crenças da Marina
// ─────────────────────────────────────────────────────────────
export const ETAPA5_ABERTURA =
  'Este é um exemplo com uma marca fictícia, a mesma Marina dos encontros anteriores: psicanalista, online, atende mulheres exaustas pela sobrecarga. Use como referência, não como modelo: as suas crenças são suas.'

export interface CartaoMapaMarinaDef {
  id: 'dinheiro' | 'venda' | 'exposicao'
  nome: string
  crencaAntiga: string
  origem: string
  custo: string
  virada: string
}

export const MAPA_MARINA: CartaoMapaMarinaDef[] = [
  {
    id: 'dinheiro',
    nome: 'Dinheiro',
    crencaAntiga: 'Minhas pacientes já estão sobrecarregadas, não posso cobrar mais delas',
    origem: 'formação que silencia sobre dinheiro; cultura do cuidado como sacrifício',
    custo: 'cobra R$ 30 abaixo do piso, R$ 1.800 a menos por mês, e adia a supervisão',
    virada:
      'Uma terapeuta exausta não sustenta a escuta de mulheres exaustas. Cobrar o justo também é cuidar.',
  },
  {
    id: 'venda',
    nome: 'Venda',
    crencaAntiga: 'Se eu for boa, as indicações chegam sozinhas',
    origem: 'ideia de que divulgar é coisa de quem não é boa o bastante',
    custo: 'agenda com horários vagos há meses; nunca pediu uma indicação',
    virada: 'Quem precisa de mim só me encontra se souber que eu existo.',
  },
  {
    id: 'exposicao',
    nome: 'Exposição',
    crencaAntiga: 'Se eu falar de sobrecarga feminina, as colegas vão me achar rasa',
    origem: 'medo do julgamento entre pares; academia que valoriza só o texto técnico',
    custo: 'três posts prontos e não publicados',
    virada: 'Falar com clareza sobre o cansaço delas é o meu trabalho, não superficialidade.',
  },
]

export const ETAPA5_ESCADA_TITULO = 'A escada da Marina'

export interface DegrauMarinaDef {
  dia: string
  microacao: string
}

export const ESCADA_MARINA: DegrauMarinaDef[] = [
  { dia: 'Dia 1', microacao: 'Dizer o valor da sessão em voz alta, sozinha, três vezes' },
  {
    dia: 'Dia 2',
    microacao: 'Gravar um áudio para si mesma respondendo "quanto custa?" sem pedir desculpas',
  },
  { dia: 'Dia 3', microacao: 'Publicar um story com uma frase do Manifesto' },
  {
    dia: 'Dia 4',
    microacao: 'Mandar uma mensagem de apresentação para uma colega que atende outro público',
  },
  { dia: 'Dia 5', microacao: 'Publicar um dos três posts que estavam guardados' },
  { dia: 'Dia 6', microacao: 'Responder a próxima pergunta de valor sem oferecer desconto' },
  {
    dia: 'Dia 7',
    microacao:
      'Pedir uma indicação para alguém de confiança, explicando para quem é o trabalho dela',
  },
]

export const ETAPA5_PERCEBEU_TITULO = 'O que a Marina percebeu'
export const ETAPA5_PERCEBEU =
  'Nenhuma das três crenças era sobre falta de competência. Todas eram sobre permissão: permissão para cobrar, para ser procurada e para ser vista.'

// ─────────────────────────────────────────────────────────────
// Etapa 6 · Minha escada de coragem
// ─────────────────────────────────────────────────────────────
export const ETAPA6_ESCADA_ABERTURA =
  'Coragem é uma escada, não um salto. Copie aqui, no papel ou no bloco de notas, os sete degraus que a Skill 3 criou para você. Faça um degrau por dia, sempre lendo a sua frase de virada antes de agir. Quando terminar o degrau do dia, marque na escada.'

export const ETAPA6_ESCADA_DICA =
  'Degrau que não foi feito não é fracasso, é informação. Se travou, volte à conversa Minhas crenças e peça à Skill 3 um degrau menor.'

export const ETAPA6_ANTES_DEGRAU_TITULO = 'Antes de cada degrau'
export const ETAPA6_ANTES_DEGRAU_PASSOS = [
  'Leia a sua frase de virada em voz alta.',
  'Faça a microação do dia, do jeito que der.',
  'Anote, em uma linha: como me senti, de 0 a 10, e o que aprendi.',
]

// ─────────────────────────────────────────────────────────────
// Etapa 7 · Cuidado com você e checklist final
// ─────────────────────────────────────────────────────────────
export const ETAPA7_CUIDADO_TITULO = 'Cuidado com você'
export const ETAPA7_CUIDADO =
  'Mexer em crenças sobre dinheiro e exposição pode trazer à tona histórias antigas. Isso é sinal de que o trabalho tocou em algo verdadeiro, não de que algo deu errado. Se algum tema pessoal ficou ecoando, leve para a sua análise pessoal ou para alguém de confiança. Você cuida de tanta gente: este também é um momento de deixar alguém cuidar de você.'

export const ETAPA7_ATENCAO_CVV =
  'Se você estiver passando por um momento de sofrimento intenso, procure apoio agora. O CVV atende 24 horas, gratuitamente, pelo telefone 188.'

export const ETAPA7_LINK_CVV_TEXTO = 'CVV · Centro de Valorização da Vida'
export const ETAPA7_LINK_CVV_URL = 'https://cvv.org.br'

export const ETAPA7_RESUMO_TITULO = 'Resumo dos meus checklists'
export const ETAPA7_COMBINADO_TITULO = 'Combinado da semana'

export const CHECKLIST_COMBINADO_SEMANA_E6: { id: string; texto: string }[] = [
  { id: 'e7-1', texto: 'Fazer uma microação por dia do Plano de Coragem' },
  { id: 'e7-2', texto: 'Ler a frase de virada antes de cada microação' },
  { id: 'e7-3', texto: 'Preencher o registro: feito, como me senti, o que aprendi' },
  { id: 'e7-4', texto: 'Salvar a FICHA 3 no meu Projeto' },
  {
    id: 'e7-5',
    texto: 'Contar no grupo qual degrau foi o mais difícil, se eu quiser compartilhar',
  },
]

export const ETAPA7_FECHAMENTO =
  'A estrutura você já tem. Hoje você deu nome ao que segurava a sua mão 💜 Cada degrau é uma permissão que você se dá.'
