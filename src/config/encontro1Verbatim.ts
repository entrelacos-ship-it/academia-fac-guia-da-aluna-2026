/**
 * Conteúdo Verbatim Completo do Encontro 1 (Aula Magna)
 * Guia da Aluna — Academia Método FAC
 */

export interface PromptApoio {
  id: string
  numero: string
  kicker: string
  titulo: string
  momentoUso: string
  texto: string
  notaPosCopia?: string
}

export interface FaqItem {
  id: string
  pergunta: string
  resposta: string
}

export interface FaceCubo {
  id: 'F' | 'A' | 'C'
  letra: 'F' | 'A' | 'C'
  pilar: string
  kicker: string
  pergunta: string
  corpo: string
  pecaPossivel: string
  linkRotulo: string
  ancoraId: string
}

export const FACES_CUBO_FAC: Record<'F' | 'A' | 'C', FaceCubo> = {
  F: {
    id: 'F',
    letra: 'F',
    pilar: 'Fundação',
    kicker: 'FACE F / MÉTODO FAC',
    pergunta: 'O que sustenta minha prática?',
    corpo:
      'Clareza, mensagem, valor e capacidade de sustentar suas escolhas. É onde a prática ganha base para crescer sem depender de improviso.',
    pecaPossivel: 'Uma descrição clara do trabalho',
    linkRotulo: 'Ler sobre Fundação',
    ancoraId: 'secao-fundacao',
  },
  A: {
    id: 'A',
    letra: 'A',
    pilar: 'Atração',
    kicker: 'FACE A / MÉTODO FAC',
    pergunta: 'Como as pessoas certas chegam até mim?',
    corpo:
      'Rotas possíveis e sustentáveis: caminhos offline (indicações e parcerias), orgânicos (busca e conteúdo) ou pagos. Escolher uma ponte de chegada clara, compatível com seu tempo e seus recursos.',
    pecaPossivel: 'Uma rota de chegada simples e compreensível',
    linkRotulo: 'Ler sobre Atração',
    ancoraId: 'secao-atracao',
  },
  C: {
    id: 'C',
    letra: 'C',
    pilar: 'Conexão',
    kicker: 'FACE C / MÉTODO FAC',
    pergunta: 'Como a experiência se organiza da chegada à continuidade?',
    corpo:
      'Acolhimento da primeira mensagem, clareza sobre o enquadre, contrato terapêutico e acompanhamento ético do vínculo, sem automatizar a relação clínica nem criar roteiros mecânicos.',
    pecaPossivel: 'Um processo ético de acolhimento e enquadre',
    linkRotulo: 'Ler sobre Conexão',
    ancoraId: 'secao-conexao',
  },
}

export const PROMPTS_BIBLIOTECA_ENCONTRO_1: PromptApoio[] = [
  {
    id: 'prompt-01',
    numero: '01',
    kicker: 'PROMPT DE APOIO',
    titulo: 'Ler o diagnóstico sem se reduzir a um número',
    momentoUso: 'Use depois de preencher o Diagnóstico e escrever uma situação concreta da sua prática.',
    texto: `Estou construindo meu Mapa Pessoal do Ciclo FAC. Meus resultados são: Fundação [__%], Atração [__%], Conexão [__%]. Uma situação observável da minha prática profissional é: [descreva sem dados de pacientes]. Ajude-me a levantar 2 hipóteses sobre qual pilar merece atenção primeiro. Para cada hipótese, diga o que eu precisaria observar para confirmá-la ou corrigi-la. Não faça diagnóstico pessoal, não prometa resultados e termine com uma pergunta que me ajude a decidir.`,
    notaPosCopia:
      'Compare as hipóteses com o que você vive. Escreva no Mapa apenas a leitura que fizer sentido para sua realidade.',
  },
  {
    id: 'prompt-02',
    numero: '02',
    kicker: 'PROMPT DE APOIO',
    titulo: 'Transformar intenção em resultado verificável',
    momentoUso: 'Use quando sua meta para as 19 semanas ainda estiver ampla demais.',
    texto: `Estou definindo o resultado observável do meu percurso de 19 semanas no Método FAC. Minha intenção inicial é: [escreva sua intenção geral, ex: "quero me organizar melhor" ou "quero cobrar direito"]. Ajude-me a converter essa intenção em 2 opções de frases verificáveis no mundo real, com foco em estrutura da clínica (clareza de público, valor da sessão ou canal de chegada). Não prometa faturamento nem volume de agenda, e garanta que o resultado dependa de ações sob meu controle.`,
    notaPosCopia:
      'Escolha a frase que descreve algo que você pode olhar e constatar com clareza daqui a 19 semanas.',
  },
  {
    id: 'prompt-03',
    numero: '03',
    kicker: 'PROMPT DE APOIO',
    titulo: 'Criar um plano mínimo de retomada',
    momentoUso: 'Use para preencher a quarta pergunta do Mapa sem transformar um imprevisto em abandono.',
    texto: `Estou preenchendo a pergunta "Como volto se a semana escapar?" do meu Mapa Pessoal no Método FAC. O obstáculo provável que costuma interromper minha constância é: [descreva o obstáculo profissional ou de rotina, sem dados sensíveis]. Sugira 2 opções de ação mínima de retomada (que leve de 20 a 30 minutos), realista para uma semana sobrecarregada, para que eu não precise "recomeçar do zero" nem me culpar pelo imprevisto.`,
    notaPosCopia:
      'Uma ação mínima viável protege sua continuidade muito mais do que prometer compensar tudo no fim de semana.',
  },
]

export const FAQ_ENCONTRO_1: FaqItem[] = [
  {
    id: 'faq-01',
    pergunta: 'Como acesso a transmissão aberta?',
    resposta:
      'O link oficial da transmissão é enviado diretamente no convite da Aula Magna (por e-mail ou canal de aviso). Caso não o tenha localizado ou tenha entrado de última hora, utilize o canal de suporte informado no convite para receber o acesso imediato.',
  },
  {
    id: 'faq-02',
    pergunta: 'Preciso terminar o diagnóstico durante a aula?',
    resposta:
      'Não é obrigatório concluir durante a transmissão ao vivo. O questionário e suas respostas ficam salvos automaticamente no armazenamento deste navegador. Você pode iniciar na aula e concluir ou revisar as 24 perguntas no seu tempo ao longo da semana.',
  },
  {
    id: 'faq-03',
    pergunta: 'Perdi o encontro ao vivo. Como retomo?',
    resposta:
      'Você pode retomar pelo próprio Caderno de Estudo desta página: leia a trilha pedagógica, faça o Diagnóstico FAC Aprofundado e assista ao capítulo de construção gravado. O conteúdo e o motor de diagnóstico permanecem disponíveis para você.',
  },
  {
    id: 'faq-04',
    pergunta: 'Preciso publicar meu resultado completo?',
    resposta:
      'De forma alguma. Seu diagnóstico é 100% privado e salvo apenas no seu aparelho. Se desejar dialogar em encontros da comunidade, compartilhe apenas a ordem dos pilares ou as impressões com as quais você se sinta confortável.',
  },
]

export const LINKS_CHATGPT_OFICIAIS = [
  {
    rotulo: 'Abrir ChatGPT',
    url: 'https://chatgpt.com',
    descricao: 'Acesso web direto para testar conversas e prompts.',
  },
  {
    rotulo: 'Aplicativos oficiais',
    url: 'https://openai.com/chatgpt/download',
    descricao: 'Downloads oficiais para desktop e celulares iOS/Android.',
  },
  {
    rotulo: 'Comparar planos oficiais',
    url: 'https://openai.com/chatgpt/pricing',
    descricao: 'Recursos e limites oficiais da OpenAI (plano gratuito basta).',
  },
  {
    rotulo: 'Controles de dados da OpenAI',
    url: 'https://chatgpt.com/#settings/General/ImproveModelForEveryone',
    descricao: 'Configurações de privacidade e histórico da sua conta.',
  },
]
