/**
 * Diagnóstico FAC Aprofundado Versão 2 — Motor de Cálculo e Conteúdo Editorial Verbatim
 *
 * Regras da Tati / Entrelaços:
 * - 24 perguntas, escala 1 a 4 sem inversão de escala nem pesos adicionais.
 * - 3 pilares (Fundação, Atração, Conexão), 4 dimensões cada (2 perguntas por dimensão).
 * - Pergunta C1.2 distingue ausência de dados de perda observada (alimenta alertas).
 * - Instrumento versionado: instrumentVersion = 2.
 * - Dados 100% locais no navegador (sem envio a servidor/banco/telemetria).
 */

export const INSTRUMENT_VERSION = 2

export type PilarId = 'fundacao' | 'atracao' | 'conexao'

export interface DiagnosticoOpcao {
  valor: 1 | 2 | 3 | 4
  texto: string
}

export interface DiagnosticoPerguntaV2 {
  id: number // 1 a 24
  codigo: string // F1.1, F1.2, ..., C4.2
  pilar: PilarId
  dimensaoCodigo: string // F1, F2, F3, F4, A1, A2, A3, A4, C1, C2, C3, C4
  dimensaoNome: string
  enunciado: string
  opcoes: [DiagnosticoOpcao, DiagnosticoOpcao, DiagnosticoOpcao, DiagnosticoOpcao]
}

export interface DimensaoDef {
  codigo: string
  pilar: PilarId
  nome: string
  interpretacaoFragilidade: string
  interpretacaoForca: string
  acaoConstrucao: string
  acaoRefinamento: string
}

export const DIMENSOES_CONFIG: Record<string, DimensaoDef> = {
  F1: {
    codigo: 'F1',
    pilar: 'fundacao',
    nome: 'Clareza',
    interpretacaoFragilidade:
      'A definição de para quem é seu trabalho e a tradução disso na agenda ainda estão difusas.',
    interpretacaoForca:
      'Você tem nitidez sobre seu público prioritário e essa clareza começa a se refletir na prática.',
    acaoConstrucao:
      'Escrever em uma frase simples para quem você trabalha e revisar se sua comunicação atual reflete essa escolha.',
    acaoRefinamento:
      'Ajustar a agenda para que os novos contatos cheguem prioritariamente pelo tema e público em que você se posicionou.',
  },
  F2: {
    codigo: 'F2',
    pilar: 'fundacao',
    nome: 'Mensagem',
    interpretacaoFragilidade:
      'Sua mensagem de transformação e sua identidade visual ainda não têm forma estável ou reconhecível.',
    interpretacaoForca:
      'Sua mensagem e sua identidade visual comunicam com coerência o tom do seu trabalho.',
    acaoConstrucao:
      'Formular uma frase que explique a transformação que seu trabalho oferece e padronizar cores e tom em um guia básico.',
    acaoRefinamento:
      'Aplicar a frase síntese de forma consistente em bio, páginas e materiais, consolidando o reconhecimento visual.',
  },
  F3: {
    codigo: 'F3',
    pilar: 'fundacao',
    nome: 'Valor',
    interpretacaoFragilidade:
      'O valor da sessão ainda é definido por comparação ou intuição, sem cálculo de custos e cota de desconto.',
    interpretacaoForca:
      'Você conhece seus custos reais, seu piso por sessão e opera com critério para valores sociais.',
    acaoConstrucao:
      'Calcular despesas reais, provisões e retirada mínima na Calculadora FAC, definindo uma cota máxima de horários sociais.',
    acaoRefinamento:
      'Formalizar os critérios e a periodicidade de reajuste anual de honorários para todos os atendimentos.',
  },
  F4: {
    codigo: 'F4',
    pilar: 'fundacao',
    nome: 'Sustentação',
    interpretacaoFragilidade:
      'Falar de honorários e divulgar o trabalho ainda despertam desconforto, culpa ou hesitação.',
    interpretacaoForca:
      'Você sustenta o valor da sessão com serenidade e divulga seu trabalho dentro dos limites éticos.',
    acaoConstrucao:
      'Praticar a comunicação do valor sem justificativas antecipadas e delimitar o que é divulgação ética segundo o CRP.',
    acaoRefinamento:
      'Sustentar o valor com naturalidade diante de dúvidas de pacientes e consolidar uma rotina de divulgação segura.',
  },
  A1: {
    codigo: 'A1',
    pilar: 'atracao',
    nome: 'Presença',
    interpretacaoFragilidade:
      'Seus canais de contato principal e de apoio ainda não explicam o trabalho ou não estão prontos para receber contatos.',
    interpretacaoForca:
      'Seu canal principal e canais de apoio têm informações claras, atualizadas e funcionais no celular.',
    acaoConstrucao:
      'Organizar um canal profissional de entrada com proposta nítida, contatos testados e funcionamento ágil no celular.',
    acaoRefinamento:
      'Revisar periodicamente todos os pontos de contato para garantir que links, respostas automáticas e dados estejam integrados.',
  },
  A2: {
    codigo: 'A2',
    pilar: 'atracao',
    nome: 'Conteúdo',
    interpretacaoFragilidade:
      'A produção de conteúdo é ausente ou irregular, sem acompanhamento de métricas de retorno.',
    interpretacaoForca:
      'Você produz conteúdo com regularidade em temas definidos e acompanha os sinais de alcance e interesse.',
    acaoConstrucao:
      'Definir 2 a 3 temas centrais da sua autoria e manter uma publicação semanal consistente.',
    acaoRefinamento:
      'Criar um calendário com reaproveitamento de materiais e analisar salvamentos e cliques para orientar novos temas.',
  },
  A3: {
    codigo: 'A3',
    pilar: 'atracao',
    nome: 'Indicação',
    interpretacaoFragilidade:
      'Ainda não há rede de encaminhamentos cultivada nem facilitação ética para indicações.',
    interpretacaoForca:
      'Você cultiva uma rede ativa de profissionais parceiros e facilita indicações com cuidado ético.',
    acaoConstrucao:
      'Listar de 3 a 5 profissionais de saúde de confiança e iniciar contato profissional regular para trocas éticas.',
    acaoRefinamento:
      'Organizar um material simples de apresentação para colegas e mensurar quantos pacientes chegam por essa via.',
  },
  A4: {
    codigo: 'A4',
    pilar: 'atracao',
    nome: 'Rota de chegada',
    interpretacaoFragilidade:
      'Quem descobre seu trabalho tem dificuldade para entender a proposta, dar o próximo passo ou a origem não é registrada.',
    interpretacaoForca:
      'O caminho da descoberta ao primeiro contato é claro, testado e com acompanhamento da origem dos contatos.',
    acaoConstrucao:
      'Construir uma página ou mensagem de acolhimento com próximo passo visível e anotar a origem de cada contato recebido.',
    acaoRefinamento:
      'Acompanhar sistematicamente a taxa de conversão da descoberta ao contato e ajustar canais que trazem contatos qualificados.',
  },
  C1: {
    codigo: 'C1',
    pilar: 'conexao',
    nome: 'Primeiro contato',
    interpretacaoFragilidade:
      'A resposta ao primeiro contato é improvisada ou há baixa passagem de contatos para agendamento.',
    interpretacaoForca:
      'Você acolhe novos contatos com roteiro claro, prazo definido e boa passagem para agendamentos.',
    acaoConstrucao:
      'Estruturar um roteiro de acolhimento em 4 passos: escuta inicial, explicação do funcionamento, proposta de horário e retorno.',
    acaoRefinamento:
      'Monitorar a taxa de agendamento mês a mês e padronizar o contato de acompanhamento para quem não respondeu.',
  },
  C2: {
    codigo: 'C2',
    pilar: 'conexao',
    nome: 'Entrada',
    interpretacaoFragilidade:
      'A primeira sessão tem estrutura indefinida ou ocorrem perdas frequentes entre a entrevista inicial e o processo.',
    interpretacaoForca:
      'Sua entrevista preliminar tem objetivos claros e a grande maioria das pessoas segue em atendimento.',
    acaoConstrucao:
      'Definir os objetivos fundamentais da entrevista inicial para que a pessoa saiba como o trabalho funciona e o próximo passo.',
    acaoRefinamento:
      'Acompanhar os motivos relatados pelas pessoas que não seguem após a primeira sessão para aperfeiçoar o alinhamento inicial.',
  },
  C3: {
    codigo: 'C3',
    pilar: 'conexao',
    nome: 'Permanência',
    interpretacaoFragilidade:
      'Há oscilação na permanência dos primeiros meses sem cuidado estruturado com o vínculo e o enquadre.',
    interpretacaoForca:
      'Você cuida ativamente do enquadre nas primeiras sessões e os pacientes sustentam o vínculo pelo tempo necessário.',
    acaoConstrucao:
      'Dedicar momentos das 3 primeiras sessões para alinhar expectativas, enquadre e checagem mútua do vínculo.',
    acaoRefinamento:
      'Implementar conversas formais de encerramento quando houver interrupção e registrar motivos de desistência precoce.',
  },
  C4: {
    codigo: 'C4',
    pilar: 'conexao',
    nome: 'Contrato',
    interpretacaoFragilidade:
      'Os combinados sobre faltas, atrasos e pagamentos são verbais ou aplicados com hesitação e desconforto.',
    interpretacaoForca:
      'Você utiliza contrato terapêutico escrito e aplica as regras de faltas e pagamentos com tranquilidade.',
    acaoConstrucao:
      'Redigir um contrato terapêutico simples contendo valor, regra de faltas, reajuste anual e formas de pagamento.',
    acaoRefinamento:
      'Apresentar o contrato sistematicamente a todos os novos pacientes e aplicar as regras com firmeza acolhedora.',
  },
}

export const DIAGNOSTICO_24_PERGUNTAS_V2: DiagnosticoPerguntaV2[] = [
  // Fundação — F1 Clareza
  {
    id: 1,
    codigo: 'F1.1',
    pilar: 'fundacao',
    dimensaoCodigo: 'F1',
    dimensaoNome: 'Clareza',
    enunciado: 'Se alguém pergunta "para quem é o seu trabalho?", o que você responde?',
    opcoes: [
      { valor: 1, texto: 'Para quem precisar.' },
      { valor: 2, texto: 'Cito uma faixa ampla (adultos, adolescentes, casais).' },
      { valor: 3, texto: 'Respondo em uma frase com um público e um tema definidos.' },
      {
        valor: 4,
        texto:
          'Respondo em uma frase, sem hesitar, e essa mesma frase já aparece na minha comunicação.',
      },
    ],
  },
  {
    id: 2,
    codigo: 'F1.2',
    pilar: 'fundacao',
    dimensaoCodigo: 'F1',
    dimensaoNome: 'Clareza',
    enunciado: 'Sua agenda e sua comunicação refletem esse foco?',
    opcoes: [
      { valor: 1, texto: 'Não tenho foco definido.' },
      { valor: 2, texto: 'Tenho um foco na cabeça, mas atendo e comunico de forma genérica.' },
      { valor: 3, texto: 'Minha comunicação já fala com esse público, a agenda ainda é mista.' },
      { valor: 4, texto: 'Boa parte de quem me procura já chega pelo tema em que me posicionei.' },
    ],
  },

  // Fundação — F2 Mensagem
  {
    id: 3,
    codigo: 'F2.1',
    pilar: 'fundacao',
    dimensaoCodigo: 'F2',
    dimensaoNome: 'Mensagem',
    enunciado: 'Você tem uma frase que diz qual transformação seu trabalho oferece e para quem?',
    opcoes: [
      { valor: 1, texto: 'Não tenho.' },
      { valor: 2, texto: 'Tenho ideias soltas, nada escrito.' },
      { valor: 3, texto: 'Tenho a frase escrita.' },
      { valor: 4, texto: 'Tenho a frase escrita e já uso em bio, página ou anúncio.' },
    ],
  },
  {
    id: 4,
    codigo: 'F2.2',
    pilar: 'fundacao',
    dimensaoCodigo: 'F2',
    dimensaoNome: 'Mensagem',
    enunciado: 'Sua presença visual e seu jeito de comunicar são reconhecíveis?',
    opcoes: [
      { valor: 1, texto: 'Não tenho identidade definida.' },
      { valor: 2, texto: 'Uso o que aparece, cada peça de um jeito.' },
      { valor: 3, texto: 'Tenho cores, fontes e tom definidos.' },
      {
        valor: 4,
        texto:
          'Tenho identidade definida e as pessoas reconhecem meu conteúdo antes de ver meu nome.',
      },
    ],
  },

  // Fundação — F3 Valor
  {
    id: 5,
    codigo: 'F3.1',
    pilar: 'fundacao',
    dimensaoCodigo: 'F3',
    dimensaoNome: 'Valor',
    enunciado: 'Como você chegou ao valor da sua sessão?',
    opcoes: [
      { valor: 1, texto: 'Copiei o que colegas cobram ou o que me pareceu aceitável.' },
      { valor: 2, texto: 'Considerei algumas despesas, sem conta completa.' },
      {
        valor: 3,
        texto: 'Calculei custos, provisões e retirada, e sei meu valor mínimo por sessão.',
      },
      {
        valor: 4,
        texto: 'Sei meu valor mínimo e tenho critério definido de quando e como reajusto.',
      },
    ],
  },
  {
    id: 6,
    codigo: 'F3.2',
    pilar: 'fundacao',
    dimensaoCodigo: 'F3',
    dimensaoNome: 'Valor',
    enunciado: 'Como você lida com valor social ou desconto?',
    opcoes: [
      { valor: 1, texto: 'Dou desconto sempre que a pessoa pede ou hesita.' },
      { valor: 2, texto: 'Decido caso a caso, sem limite.' },
      { valor: 3, texto: 'Tenho um limite na cabeça.' },
      { valor: 4, texto: 'Tenho uma cota definida e planejada da agenda, e mantenho.' },
    ],
  },

  // Fundação — F4 Sustentação
  {
    id: 7,
    codigo: 'F4.1',
    pilar: 'fundacao',
    dimensaoCodigo: 'F4',
    dimensaoNome: 'Sustentação',
    enunciado: 'Quando você fala o valor da sessão, o que costuma acontecer?',
    opcoes: [
      { valor: 1, texto: 'Evito falar, demoro para responder ou já ofereço desconto junto.' },
      { valor: 2, texto: 'Falo, mas me justifico ou peço desculpas.' },
      { valor: 3, texto: 'Falo com clareza, com algum desconforto.' },
      { valor: 4, texto: 'Falo com tranquilidade e sustento o valor se a pessoa hesita.' },
    ],
  },
  {
    id: 8,
    codigo: 'F4.2',
    pilar: 'fundacao',
    dimensaoCodigo: 'F4',
    dimensaoNome: 'Sustentação',
    enunciado: 'Como você se sente em relação a divulgar seu trabalho?',
    opcoes: [
      { valor: 1, texto: 'Sinto que é antiético ou tenho vergonha, então não divulgo.' },
      { valor: 2, texto: 'Divulgo pouco e com culpa.' },
      { valor: 3, texto: 'Divulgo, com algum desconforto, e sei quais são os limites éticos.' },
      { valor: 4, texto: 'Divulgo com segurança, dentro das normas da profissão, sem culpa.' },
    ],
  },

  // Atração — A1 Presença
  {
    id: 9,
    codigo: 'A1.1',
    pilar: 'atracao',
    dimensaoCodigo: 'A1',
    dimensaoNome: 'Presença',
    enunciado:
      'Como está o seu principal canal profissional (por exemplo, Instagram, site ou diretório)?',
    opcoes: [
      { valor: 1, texto: 'Não tenho canal profissional ativo ou ele está abandonado.' },
      {
        valor: 2,
        texto:
          'Tenho um canal, mas ele não explica com clareza o que faço, para quem e como entrar em contato.',
      },
      {
        valor: 3,
        texto: 'Meu canal explica o trabalho e oferece um caminho claro para o primeiro contato.',
      },
      {
        valor: 4,
        texto:
          'Além disso, as informações estão atualizadas e o caminho até o contato funciona no celular.',
      },
    ],
  },
  {
    id: 10,
    codigo: 'A1.2',
    pilar: 'atracao',
    dimensaoCodigo: 'A1',
    dimensaoNome: 'Presença',
    enunciado: 'Os canais de apoio que você escolheu usar estão preparados para receber contatos?',
    opcoes: [
      { valor: 1, texto: 'Ainda não defini um canal de contato profissional.' },
      {
        valor: 2,
        texto: 'Tenho um canal, mas informações ou respostas importantes estão incompletas.',
      },
      {
        valor: 3,
        texto: 'Tenho ao menos um canal configurado com informações e forma de contato claras.',
      },
      {
        valor: 4,
        texto:
          'Os canais que escolhi usar estão atualizados, conectados e têm um caminho de contato que testei.',
      },
    ],
  },

  // Atração — A2 Conteúdo
  {
    id: 11,
    codigo: 'A2.1',
    pilar: 'atracao',
    dimensaoCodigo: 'A2',
    dimensaoNome: 'Conteúdo',
    enunciado: 'Como é sua produção de conteúdo?',
    opcoes: [
      { valor: 1, texto: 'Não produzo.' },
      { valor: 2, texto: 'Publico quando dá, sem plano.' },
      { valor: 3, texto: 'Tenho temas definidos e publico toda semana.' },
      {
        valor: 4,
        texto: 'Tenho calendário, uso vídeo curto com regularidade e reaproveito conteúdos.',
      },
    ],
  },
  {
    id: 12,
    codigo: 'A2.2',
    pilar: 'atracao',
    dimensaoCodigo: 'A2',
    dimensaoNome: 'Conteúdo',
    enunciado: 'Você acompanha o resultado do que publica?',
    opcoes: [
      { valor: 1, texto: 'Não olho números.' },
      { valor: 2, texto: 'Olho curtidas.' },
      { valor: 3, texto: 'Acompanho alcance, salvamentos e cliques no link.' },
      { valor: 4, texto: 'Acompanho esses números e mudo o que publico a partir deles.' },
    ],
  },

  // Atração — A3 Indicação
  {
    id: 13,
    codigo: 'A3.1',
    pilar: 'atracao',
    dimensaoCodigo: 'A3',
    dimensaoNome: 'Indicação',
    enunciado: 'Você tem uma rede de profissionais que te indicam?',
    opcoes: [
      { valor: 1, texto: 'Não tenho.' },
      { valor: 2, texto: 'Recebo indicações de vez em quando, sem ter cultivado isso.' },
      {
        valor: 3,
        texto: 'Tenho alguns profissionais com quem mantenho contato e troco indicações.',
      },
      {
        valor: 4,
        texto: 'Tenho uma rede ativa, com contato regular, e sei quantos pacientes vêm dela.',
      },
    ],
  },
  {
    id: 14,
    codigo: 'A3.2',
    pilar: 'atracao',
    dimensaoCodigo: 'A3',
    dimensaoNome: 'Indicação',
    enunciado: 'Você facilita que pacientes e conhecidos te indiquem?',
    opcoes: [
      { valor: 1, texto: 'Nunca pensei nisso.' },
      { valor: 2, texto: 'Acontece sozinho, não faço nada.' },
      {
        valor: 3,
        texto: 'Tenho material ou forma simples de ser indicada (cartão, link, mensagem pronta).',
      },
      {
        valor: 4,
        texto: 'Tenho material, uso com regularidade e respeito os limites éticos ao fazê-lo.',
      },
    ],
  },

  // Atração — A4 Rota de chegada
  {
    id: 15,
    codigo: 'A4.1',
    pilar: 'atracao',
    dimensaoCodigo: 'A4',
    dimensaoNome: 'Rota de chegada',
    enunciado: 'Quem encontra seu trabalho consegue entender a proposta e chegar ao contato?',
    opcoes: [
      {
        valor: 1,
        texto:
          'Não tenho uma página ou perfil que explique meu trabalho e mostre como entrar em contato.',
      },
      {
        valor: 2,
        texto: 'Tenho um destino, mas a proposta ou o próximo passo ainda ficam pouco claros.',
      },
      { valor: 3, texto: 'Tenho página ou perfil com proposta clara e forma de contato visível.' },
      {
        valor: 4,
        texto: 'Além disso, testei o caminho da descoberta ao contato e acompanho se ele funciona.',
      },
    ],
  },
  {
    id: 16,
    codigo: 'A4.2',
    pilar: 'atracao',
    dimensaoCodigo: 'A4',
    dimensaoNome: 'Rota de chegada',
    enunciado: 'Como você acompanha os contatos que chegam pelos canais que escolheu usar?',
    opcoes: [
      { valor: 1, texto: 'Não sei de onde vêm os contatos.' },
      { valor: 2, texto: 'Tenho uma ideia das origens, mas não registro.' },
      { valor: 3, texto: 'Registro a origem e os contatos de ao menos um canal.' },
      {
        valor: 4,
        texto:
          'Registro origem e qualidade dos contatos, e ajusto os canais a partir do que observo.',
      },
    ],
  },

  // Conexão — C1 Primeiro contato
  {
    id: 17,
    codigo: 'C1.1',
    pilar: 'conexao',
    dimensaoCodigo: 'C1',
    dimensaoNome: 'Primeiro contato',
    enunciado: 'Quando alguém te chama perguntando sobre atendimento, o que você faz?',
    opcoes: [
      { valor: 1, texto: 'Respondo o valor e espero.' },
      { valor: 2, texto: 'Respondo de improviso, cada vez de um jeito.' },
      {
        valor: 3,
        texto:
          'Sigo um roteiro: acolho, entendo a busca, explico como funciona e proponho o próximo passo.',
      },
      {
        valor: 4,
        texto: 'Sigo o roteiro, respondo em prazo definido e faço um retorno a quem não respondeu.',
      },
    ],
  },
  {
    id: 18,
    codigo: 'C1.2',
    pilar: 'conexao',
    dimensaoCodigo: 'C1',
    dimensaoNome: 'Primeiro contato',
    enunciado: 'Entre os contatos recentes sobre atendimento, quantas pessoas agendaram?',
    opcoes: [
      { valor: 1, texto: 'Não tive contatos recentes ou não consigo estimar.' },
      { valor: 2, texto: 'Menos da metade agendou.' },
      { valor: 3, texto: 'Pelo menos metade agendou.' },
      { valor: 4, texto: 'A maioria agendou e acompanho essa passagem com regularidade.' },
    ],
  },

  // Conexão — C2 Entrada
  {
    id: 19,
    codigo: 'C2.1',
    pilar: 'conexao',
    dimensaoCodigo: 'C2',
    dimensaoNome: 'Entrada',
    enunciado: 'Seu primeiro encontro com a pessoa tem estrutura definida?',
    opcoes: [
      { valor: 1, texto: 'Não, vou conduzindo conforme acontece.' },
      { valor: 2, texto: 'Tenho uma ideia geral.' },
      {
        valor: 3,
        texto: 'Tenho objetivos claros para esse encontro e sei o que preciso sair sabendo.',
      },
      {
        valor: 4,
        texto:
          'Tenho a estrutura, e ao final a pessoa sai sabendo como o trabalho funciona e qual é o próximo passo.',
      },
    ],
  },
  {
    id: 20,
    codigo: 'C2.2',
    pilar: 'conexao',
    dimensaoCodigo: 'C2',
    dimensaoNome: 'Entrada',
    enunciado: 'Depois da entrevista preliminar, quantas pessoas seguem em atendimento?',
    opcoes: [
      { valor: 1, texto: 'Não sei.' },
      { valor: 2, texto: 'Menos da metade, e não sei por quê.' },
      { valor: 3, texto: 'A maioria.' },
      { valor: 4, texto: 'A maioria, e entendo os motivos de quem não segue.' },
    ],
  },

  // Conexão — C3 Permanência
  {
    id: 21,
    codigo: 'C3.1',
    pilar: 'conexao',
    dimensaoCodigo: 'C3',
    dimensaoNome: 'Permanência',
    enunciado: 'O que acontece nas primeiras sessões para sustentar o vínculo?',
    opcoes: [
      { valor: 1, texto: 'Nunca pensei nisso como algo a cuidar.' },
      { valor: 2, texto: 'Confio que acontece naturalmente.' },
      { valor: 3, texto: 'Cuido de pontos definidos: enquadre, expectativas, combinados.' },
      {
        valor: 4,
        texto: 'Cuido desses pontos e acompanho as faltas e desistências do primeiro mês.',
      },
    ],
  },
  {
    id: 22,
    codigo: 'C3.2',
    pilar: 'conexao',
    dimensaoCodigo: 'C3',
    dimensaoNome: 'Permanência',
    enunciado: 'Como é a permanência dos seus pacientes?',
    opcoes: [
      { valor: 1, texto: 'Muitos somem nas primeiras sessões.' },
      { valor: 2, texto: 'Varia muito e não sei explicar.' },
      { valor: 3, texto: 'A maioria permanece pelo tempo que o trabalho pede.' },
      {
        valor: 4,
        texto: 'A maioria permanece, e quando alguém interrompe há uma conversa de encerramento.',
      },
    ],
  },

  // Conexão — C4 Contrato
  {
    id: 23,
    codigo: 'C4.1',
    pilar: 'conexao',
    dimensaoCodigo: 'C4',
    dimensaoNome: 'Contrato',
    enunciado: 'Você tem contrato terapêutico?',
    opcoes: [
      { valor: 1, texto: 'Não tenho.' },
      { valor: 2, texto: 'Combino verbalmente, sem padrão.' },
      {
        valor: 3,
        texto: 'Tenho contrato escrito com valor, faltas, reajuste e forma de pagamento.',
      },
      { valor: 4, texto: 'Tenho contrato escrito, apresento a todos e aplico o que está nele.' },
    ],
  },
  {
    id: 24,
    codigo: 'C4.2',
    pilar: 'conexao',
    dimensaoCodigo: 'C4',
    dimensaoNome: 'Contrato',
    enunciado: 'O que acontece quando há falta sem aviso ou atraso de pagamento?',
    opcoes: [
      { valor: 1, texto: 'Deixo passar.' },
      { valor: 2, texto: 'Fico desconfortável e resolvo cada vez de um jeito.' },
      { valor: 3, texto: 'Tenho regra e aplico na maioria das vezes.' },
      { valor: 4, texto: 'Tenho regra, está no contrato e aplico com tranquilidade.' },
    ],
  },
]

// Perguntas de contexto inicial (antes das 24 questões)
export interface ContextoInicial {
  momentoCarreira: string
  formasAtendimento: string[] // 'online', 'presencial', 'plataforma', 'convenio', 'outro'
  sessoesAtuais: number | null
  sessoesDesejadas: number | null
  origensUltimosPacientes: string[] // 'indicacao_colegas', 'indicacao_pacientes', 'instagram', 'google_site', 'plataforma', 'outros'
  oQueMaisTrava: string
}

export const DEFAULT_CONTEXTO_INICIAL: ContextoInicial = {
  momentoCarreira: '',
  formasAtendimento: [],
  sessoesAtuais: null,
  sessoesDesejadas: null,
  origensUltimosPacientes: [],
  oQueMaisTrava: '',
}

// Perguntas abertas dos pilares
export interface RespostasAbertasPilares {
  fundacao: string // "O que você já tentou organizar na sua Fundação e não foi adiante?"
  atracao: string // "Qual canal já trouxe paciente para você, mesmo que poucas vezes?"
  conexao: string // "Em que momento você mais perde pessoas: antes de agendar, entre o agendamento e a primeira sessão, ou nas primeiras sessões? Conte o que percebe."
}

export const DEFAULT_RESPOSTAS_ABERTAS: RespostasAbertasPilares = {
  fundacao: '',
  atracao: '',
  conexao: '',
}

// Bloco de cuidado clínico (duas perguntas obrigatórias fora da nota)
export interface CuidadoClinico {
  conducaoClinica: 1 | 2 | 3 | 4 | null // "Como você se sente em relação à sua condução clínica hoje?"
  supervisaoRegular: 1 | 2 | 3 | 4 | null // "Você tem supervisão ou espaço regular de troca clínica?"
}

export const DEFAULT_CUIDADO_CLINICO: CuidadoClinico = {
  conducaoClinica: null,
  supervisaoRegular: null,
}

export const PERGUNTA_CUIDADO_CONDUCAO = {
  enunciado: 'Como você se sente em relação à sua condução clínica hoje?',
  opcoes: [
    {
      valor: 1 as const,
      texto: 'Com muita insegurança ou sobrecarga frequente, sem espaço seguro de elaboração.',
    },
    {
      valor: 2 as const,
      texto: 'Insegura em momentos cruciais ou diante de impasses e manejo de crise.',
    },
    {
      valor: 3 as const,
      texto: 'Segura na maior parte do tempo, buscando apoio técnico pontual quando necessário.',
    },
    {
      valor: 4 as const,
      texto: 'Sustentada tecnicamente e eticamente no manejo cotidiano dos processos.',
    },
  ],
}

export const PERGUNTA_CUIDADO_SUPERVISAO = {
  enunciado: 'Você tem supervisão ou espaço regular de troca clínica?',
  opcoes: [
    { valor: 1 as const, texto: 'Não tenho nenhum espaço de supervisão ou troca atualmente.' },
    {
      valor: 2 as const,
      texto: 'Recorro a colegas esporadicamente apenas em situações de urgência.',
    },
    { valor: 3 as const, texto: 'Tenho grupo de estudos ou supervisão mensal/quinzenal.' },
    {
      valor: 4 as const,
      texto: 'Tenho supervisão individual ou em grupo regular, mantida com frequência fixa.',
    },
  ],
}

// Níveis dos pilares (cortes editoriais)
export type NivelPilarId = 'solto' | 'em_construcao' | 'funcionando' | 'consolidado'

export interface NivelPilarInfo {
  id: NivelPilarId
  rotulo: string
  descricao: string
}

export const NIVEIS_PILARES: Record<NivelPilarId, NivelPilarInfo> = {
  solto: {
    id: 'solto',
    rotulo: 'Solto',
    descricao: 'Ainda não há estrutura aqui',
  },
  em_construcao: {
    id: 'em_construcao',
    rotulo: 'Em construção',
    descricao: 'Há iniciativas, falta consistência',
  },
  funcionando: {
    id: 'funcionando',
    rotulo: 'Funcionando',
    descricao: 'Existe e opera, com pontos a firmar',
  },
  consolidado: {
    id: 'consolidado',
    rotulo: 'Consolidado',
    descricao: 'Sustenta sua prática hoje',
  },
}

export function getNivelPilar(percentual: number): NivelPilarInfo {
  if (percentual <= 25) return NIVEIS_PILARES.solto
  if (percentual <= 50) return NIVEIS_PILARES.em_construcao
  if (percentual <= 75) return NIVEIS_PILARES.funcionando
  return NIVEIS_PILARES.consolidado
}

export const RESSALVA_ESCOPO =
  'Este diagnóstico avalia a estrutura da sua prática profissional. Não é avaliação psicológica nem avaliação de competência clínica.'

export const RESSALVA_PERCENTUAL =
  'O percentual representa posição dentro da escala de respostas; não é probabilidade, taxa de conversão, competência clínica ou medida validada de desempenho.'

export const CHECKLIST_SEIS_MOVIMENTOS: string[] = [
  'Conferir a leitura em uma situação real da prática, sem dados de pacientes.',
  'Trabalhar ou refinar a dimensão prioritária.',
  'Avançar ou revisar a dimensão seguinte.',
  'Cuidar da etapa de contato/entrada se houver alerta imediato; caso contrário, acompanhar um sinal simples do pilar inicial.',
  'Compartilhar na comunidade, se desejar, apenas a ordem dos pilares e o título da leitura.',
  'Guardar o PDF e marcar uma nova leitura no meio do ciclo.',
]

// Estrutura do Resultado
export interface DimensaoScore {
  codigo: string
  nome: string
  pilar: PilarId
  media: number // 1 a 4
  percentual: number // 0 a 100
  respostas: [number, number] // [pergunta1, pergunta2]
  alternativasTextos: [string, string]
  interpretacao: string
  acao: string
  tipoAcao: 'construcao' | 'refinamento'
  tipoLeitura: 'fragilidade' | 'forca'
}

export interface PilarScore {
  id: PilarId
  nome: string
  soma: number // soma das 8 respostas (8 a 32)
  media: number // 1 a 4
  percentual: number // 0 a 100
  nivel: NivelPilarInfo
  dimensaoMaisFirme: DimensaoScore
  dimensaoMenosFirme: DimensaoScore
  dimensoes: DimensaoScore[]
}

export interface AlertaCondicional {
  id: number
  titulo: string
  descricao: string
}

export interface PorOndeComecar {
  pilarInicial: PilarId
  motivoPilar: string
  dimensaoPrioritaria: DimensaoScore
  dimensaoSeguinte: DimensaoScore
  motivoDimensoes: string
  tipoMovimento: 'construcao' | 'refinamento'
}

export interface ResultadoDiagnosticoV2 {
  instrumentVersion: 2
  estaCompleto: boolean
  mediaFac: number // 0 a 100
  somaTotal: number // 24 a 96
  pilares: Record<PilarId, PilarScore>
  pilaresOrdenados: PilarScore[] // ordenados do maior para o menor
  tipoRelacaoPilares:
    | 'todos_consolidados'
    | 'todos_proximos'
    | 'topo_empatado'
    | 'base_empatada'
    | 'ponte'
    | 'gradacao'
  tituloLeitura: string
  leituraPratica: string
  relacaoEntrePilares: string
  porOndeComecar: PorOndeComecar
  alertas: AlertaCondicional[]
  contextoInicial: ContextoInicial
  respostasAbertas: RespostasAbertasPilares
  cuidadoClinico: CuidadoClinico
  avisoCuidadoClinico: string | null
}

// Leituras finais de combinação (pilar mais alto -> mais baixo; título + leitura verbatim)
interface LeituraCombinacaoVerbatim {
  titulo: string
  leitura: string
}

const LEITURAS_COMBINACAO_VERBATIM: Record<string, LeituraCombinacaoVerbatim> = {
  fundacao_atracao: {
    titulo: 'Base mais clara, chegada a organizar',
    leitura:
      'A base está mais definida que as rotas pelas quais as pessoas chegam. Verificar se os canais explicam o trabalho e levam ao contato.',
  },
  fundacao_conexao: {
    titulo: 'Base mais clara, percurso a examinar',
    leitura:
      'A definição profissional está mais forte que o caminho do primeiro contato às primeiras sessões. Examinar essa passagem sem concluir, só pela nota, que há desistência.',
  },
  atracao_fundacao: {
    titulo: 'Presença à frente, base a firmar',
    leitura:
      'Os canais avançaram mais que público, mensagem e critério de valor. Alinhar o que é divulgado com a prática que se deseja sustentar.',
  },
  atracao_conexao: {
    titulo: 'Presença à frente, entrada a examinar',
    leitura:
      'A chegada está mais estruturada que o percurso de entrada. Separar falta de processo, dados desconhecidos e perdas realmente observadas.',
  },
  conexao_fundacao: {
    titulo: 'Conexão à frente, base a firmar',
    leitura:
      'A continuidade e os acordos estão mais estruturados que público, mensagem e valor. Usar esse recurso para firmar direção e sustentabilidade.',
  },
  conexao_atracao: {
    titulo: 'Conexão à frente, chegada a organizar',
    leitura:
      'O percurso de contato e continuidade está mais firme que as rotas de descoberta. Organizar canais e registrar a origem dos contatos.',
  },
}

/**
 * Motor de Pontuação do Diagnóstico FAC Aprofundado v2
 */
export function calcularDiagnosticoV2(
  respostas: Record<number, number>,
  contexto: ContextoInicial = DEFAULT_CONTEXTO_INICIAL,
  respostasAbertas: RespostasAbertasPilares = DEFAULT_RESPOSTAS_ABERTAS,
  cuidadoClinico: CuidadoClinico = DEFAULT_CUIDADO_CLINICO,
): ResultadoDiagnosticoV2 | null {
  // Verificar se todas as 24 perguntas foram respondidas
  for (let i = 1; i <= 24; i++) {
    const val = respostas[i]
    if (typeof val !== 'number' || val < 1 || val > 4) {
      return null
    }
  }

  // Bloco de cuidado clínico precisa estar preenchido para concluir o fluxo
  const cuidadoPreenchido =
    cuidadoClinico.conducaoClinica !== null && cuidadoClinico.supervisaoRegular !== null

  // 1. Média FAC: soma das 24 respostas
  let somaTotal = 0
  for (let i = 1; i <= 24; i++) {
    somaTotal += respostas[i]
  }
  const mediaFac = Math.round(((somaTotal - 24) / 72) * 100)

  // 2. Dimensões: 12 dimensões (2 perguntas cada)
  // Ordem canônica: F1, F2, F3, F4, A1, A2, A3, A4, C1, C2, C3, C4
  const codigosDimensoes = ['F1', 'F2', 'F3', 'F4', 'A1', 'A2', 'A3', 'A4', 'C1', 'C2', 'C3', 'C4']
  const dimensoesPorCodigo: Record<string, DimensaoScore> = {}

  codigosDimensoes.forEach((cod, idx) => {
    const q1Id = idx * 2 + 1
    const q2Id = idx * 2 + 2
    const r1 = respostas[q1Id]
    const r2 = respostas[q2Id]
    const mediaDim = (r1 + r2) / 2
    const percentualDim = Math.round(((mediaDim - 1) / 3) * 100)

    const q1Obj = DIAGNOSTICO_24_PERGUNTAS_V2.find((p) => p.id === q1Id)!
    const q2Obj = DIAGNOSTICO_24_PERGUNTAS_V2.find((p) => p.id === q2Id)!
    const opt1 = q1Obj.opcoes.find((o) => o.valor === r1)!.texto
    const opt2 = q2Obj.opcoes.find((o) => o.valor === r2)!.texto

    const conf = DIMENSOES_CONFIG[cod]
    const tipoLeitura: 'fragilidade' | 'forca' = mediaDim < 3 ? 'fragilidade' : 'forca'
    const tipoAcao: 'construcao' | 'refinamento' = mediaDim >= 3.5 ? 'refinamento' : 'construcao'
    const interpretacao = mediaDim < 3 ? conf.interpretacaoFragilidade : conf.interpretacaoForca
    const acao = mediaDim >= 3.5 ? conf.acaoRefinamento : conf.acaoConstrucao

    dimensoesPorCodigo[cod] = {
      codigo: cod,
      nome: conf.nome,
      pilar: conf.pilar,
      media: mediaDim,
      percentual: percentualDim,
      respostas: [r1, r2],
      alternativasTextos: [opt1, opt2],
      interpretacao,
      acao,
      tipoAcao,
      tipoLeitura,
    }
  })

  // 3. Pilares: Fundação, Atração, Conexão
  const buildPilar = (id: PilarId, nome: string, cods: string[], qStart: number): PilarScore => {
    let somaPilar = 0
    for (let i = qStart; i < qStart + 8; i++) {
      somaPilar += respostas[i]
    }
    const mediaPilar = somaPilar / 8
    const percentualPilar = Math.round(((mediaPilar - 1) / 3) * 100)
    const dims = cods.map((c) => dimensoesPorCodigo[c])

    // Dimensão mais firme (maior média; se empate, preserva ordem)
    const dimMaisFirme = [...dims].sort((a, b) => b.media - a.media)[0]
    // Dimensão menos firme (menor média; se empate, preserva ordem)
    const dimMenosFirme = [...dims].sort((a, b) => a.media - b.media)[0]

    return {
      id,
      nome,
      soma: somaPilar,
      media: mediaPilar,
      percentual: percentualPilar,
      nivel: getNivelPilar(percentualPilar),
      dimensaoMaisFirme: dimMaisFirme,
      dimensaoMenosFirme: dimMenosFirme,
      dimensoes: dims,
    }
  }

  const pilares: Record<PilarId, PilarScore> = {
    fundacao: buildPilar('fundacao', 'Fundação', ['F1', 'F2', 'F3', 'F4'], 1),
    atracao: buildPilar('atracao', 'Atração', ['A1', 'A2', 'A3', 'A4'], 9),
    conexao: buildPilar('conexao', 'Conexão', ['C1', 'C2', 'C3', 'C4'], 17),
  }

  // 4. Ordenação dos pilares pelo percentual exibido.
  // Regra de desempate exato: ordem estável Fundação, Atração, Conexão (F -> A -> C)
  const canonicalOrder: Record<PilarId, number> = { fundacao: 1, atracao: 2, conexao: 3 }
  const pilaresOrdenados = (['fundacao', 'atracao', 'conexao'] as PilarId[])
    .map((id) => pilares[id])
    .sort((a, b) => {
      if (b.percentual !== a.percentual) {
        return b.percentual - a.percentual
      }
      return canonicalOrder[a.id] - canonicalOrder[b.id]
    })

  const p1 = pilaresOrdenados[0]
  const p2 = pilaresOrdenados[1]
  const p3 = pilaresOrdenados[2]

  // Empates e proximidade: diferenças menores que 8 pontos percentuais = proximidade
  // 8 pontos exatos ficam fora do empate (< 8).
  const isNear = (valA: number, valB: number) => Math.abs(valA - valB) < 8

  const allConsolidated = p1.percentual > 75 && p2.percentual > 75 && p3.percentual > 75
  const allNear =
    isNear(p1.percentual, p2.percentual) &&
    isNear(p2.percentual, p3.percentual) &&
    isNear(p1.percentual, p3.percentual)
  const topNear = isNear(p1.percentual, p2.percentual) && !isNear(p2.percentual, p3.percentual)
  const baseNear = !isNear(p1.percentual, p2.percentual) && isNear(p2.percentual, p3.percentual)
  // Ponte: p2 próximo tanto de p1 quanto de p3, mas p1 e p3 não próximos entre si
  const bridgeNear =
    isNear(p1.percentual, p2.percentual) &&
    isNear(p2.percentual, p3.percentual) &&
    !isNear(p1.percentual, p3.percentual)

  let tipoRelacaoPilares:
    | 'todos_consolidados'
    | 'todos_proximos'
    | 'topo_empatado'
    | 'base_empatada'
    | 'ponte'
    | 'gradacao' = 'gradacao'
  let tituloLeitura = ''
  let leituraPratica = ''
  let relacaoEntrePilares = ''

  if (allConsolidated) {
    tipoRelacaoPilares = 'todos_consolidados'
    tituloLeitura = 'Prática estruturada'
    leituraPratica =
      'Os três pilares da sua clínica operam acima de 75%, oferecendo sustentação madura para o atendimento e a remuneração.'
    relacaoEntrePilares =
      'Fundação, Atração e Conexão estão integrados em nível consolidado, permitindo que você foque em refinamentos e autoria aprofundada.'
  } else if (allNear) {
    tipoRelacaoPilares = 'todos_proximos'
    if (mediaFac <= 35) {
      tituloLeitura = 'Tudo por começar'
      leituraPratica =
        'Os três pilares apresentam notas próximas e em fase inicial. Não há disparidade relevante entre eles, sinalizando que a prática está no momento ideal para ser desenhada com método.'
    } else if (mediaFac <= 65) {
      tituloLeitura = 'Estrutura a meio caminho'
      leituraPratica =
        'Os três pilares estão nivelados em faixa intermediária. Há processos acontecendo em todas as frentes, pedindo consistência para consolidar a prática.'
    } else {
      tituloLeitura = 'Prática estruturada'
      leituraPratica =
        'Os três pilares operam em equilíbrio e em nível elevado, com diferenças mínimas entre eles.'
    }
    relacaoEntrePilares = `A diferença entre os pilares (${p1.nome} ${p1.percentual}%, ${p2.nome} ${p2.percentual}% e ${p3.nome} ${p3.percentual}%) é inferior a 8 pontos percentuais. Na Academia, não tratamos pilares próximos como melhores ou piores, mas como frentes que se equilibram.`
  } else if (p1.percentual <= 50) {
    // Se o maior pilar está em até 50%, usar "Estrutura em formação"
    tituloLeitura = 'Estrutura em formação'
    leituraPratica =
      'Mesmo seu pilar mais avançado está em até 50%, indicando que a prática clínica está em processo de construção e precisa de chão estruturado.'
    relacaoEntrePilares = `${p1.nome} (${p1.percentual}%) lidera discretamente frente a ${p2.nome} (${p2.percentual}%) e ${p3.nome} (${p3.percentual}%). O momento pede foco na base antes de acelerar expansões.`
  } else if (bridgeNear) {
    tipoRelacaoPilares = 'ponte'
    tituloLeitura = 'Pilares próximos, estrutura em formação'
    leituraPratica =
      'O pilar intermediário atua como ponte entre os extremos, mantendo proximidade com a frente mais forte e com a que pede cuidado.'
    relacaoEntrePilares = `${p2.nome} (${p2.percentual}%) faz a ponte entre ${p1.nome} (${p1.percentual}%) e ${p3.nome} (${p3.percentual}%).`
  } else if (topNear) {
    tipoRelacaoPilares = 'topo_empatado'
    tituloLeitura = 'Duas forças, um ponto de atenção'
    leituraPratica = `Você tem duas frentes com pontuações próximas no topo (${p1.nome} e ${p2.nome}) e uma terceira que pede cuidado prioritário (${p3.nome}).`
    relacaoEntrePilares = `${p1.nome} (${p1.percentual}%) e ${p2.nome} (${p2.percentual}%) sustentam a clínica enquanto ${p3.nome} (${p3.percentual}%) requer estruturação.`
  } else if (baseNear) {
    tipoRelacaoPilares = 'base_empatada'
    tituloLeitura = 'Uma frente mais firme, duas próximas'
    leituraPratica = `${p1.nome} destaca-se à frente, enquanto as outras duas frentes encontram-se em patamares próximos.`
    relacaoEntrePilares = `${p1.nome} (${p1.percentual}%) está consolidado, enquanto ${p2.nome} (${p2.percentual}%) e ${p3.nome} (${p3.percentual}%) têm proximidade inferior a 8 pontos.`
  } else {
    // Gradação ou combinação direta entre pilar mais alto e mais baixo
    tipoRelacaoPilares = 'gradacao'
    const combKey = `${p1.id}_${p3.id}`
    const verbatim = LEITURAS_COMBINACAO_VERBATIM[combKey]
    if (verbatim) {
      tituloLeitura = verbatim.titulo
      leituraPratica = verbatim.leitura
    } else {
      tituloLeitura = 'Três pilares em gradação'
      leituraPratica = `${p1.nome} (${p1.percentual}%) lidera com folga, seguido por ${p2.nome} (${p2.percentual}%) e ${p3.nome} (${p3.percentual}%).`
    }
    relacaoEntrePilares = `A relação entre ${p1.nome} (${p1.percentual}%) e ${p3.nome} (${p3.percentual}%) reflete a distribuição atual das suas respostas, sem inferir causa nem prometer captação imediata.`
  }

  // 5. Por onde começar:
  // - Fundação se sua nota estiver abaixo de 50%, mesmo que outro pilar esteja mais baixo.
  // - Caso contrário, o pilar de menor percentual, com ordem FAC em empates.
  // - Dentro do pilar escolhido, primeira dimensão = de menor média; segunda = a próxima menor.
  //   Em empate de médias, a ordem das dimensões no questionário decide, e o texto explica que a nota não diferencia as duas.
  // - Se o pilar de partida é consolidado e sua menor dimensão tem média >= 3, o movimento é de refinamento.
  let pilarInicialId: PilarId
  let motivoPilar = ''

  if (pilares.fundacao.percentual < 50) {
    pilarInicialId = 'fundacao'
    motivoPilar =
      'Fundação está abaixo de 50%. No Método FAC, sem piso ético e chão estruturado, qualquer avanço em Atração ou Conexão gera sobrecarga.'
  } else {
    // Menor percentual entre os 3, com ordem canônica FAC em empate
    const menorPilar = (['fundacao', 'atracao', 'conexao'] as PilarId[])
      .map((id) => pilares[id])
      .sort((a, b) => {
        if (a.percentual !== b.percentual) {
          return a.percentual - b.percentual
        }
        return canonicalOrder[a.id] - canonicalOrder[b.id]
      })[0]

    pilarInicialId = menorPilar.id
    if (isNear(p1.percentual, p2.percentual) || isNear(p2.percentual, p3.percentual)) {
      motivoPilar = `${menorPilar.nome} foi priorizado como ponto de partida pelo menor percentual (${menorPilar.percentual}%), respeitando a sequência FAC em notas próximas.`
    } else {
      motivoPilar = `${menorPilar.nome} apresenta a menor pontuação da sua tríade (${menorPilar.percentual}%) e pede estruturação inicial.`
    }
  }

  const pilarEscolhido = pilares[pilarInicialId]
  // Dimensões do pilar escolhido, ordenadas por menor média (e ordem canônica do questionário em empates)
  const dimensoesOrdenadas = [...pilarEscolhido.dimensoes].sort((a, b) => {
    if (a.media !== b.media) {
      return a.media - b.media
    }
    return codigosDimensoes.indexOf(a.codigo) - codigosDimensoes.indexOf(b.codigo)
  })

  const dimPrioritaria = dimensoesOrdenadas[0]
  const dimSeguinte = dimensoesOrdenadas[1]

  let motivoDimensoes = ''
  if (dimPrioritaria.media === dimSeguinte.media) {
    motivoDimensoes = `As dimensões ${dimPrioritaria.codigo} (${dimPrioritaria.nome}) e ${dimSeguinte.codigo} (${dimSeguinte.nome}) empataram com média ${dimPrioritaria.media}. A ordem decidida segue o questionário, pois a nota não diferencia as duas.`
  } else {
    motivoDimensoes = `${dimPrioritaria.codigo} (${dimPrioritaria.nome}) tem média ${dimPrioritaria.media}, sendo a dimensão prioritária, seguida por ${dimSeguinte.codigo} (${dimSeguinte.nome}) com média ${dimSeguinte.media}.`
  }

  const tipoMovimentoGeral: 'construcao' | 'refinamento' =
    pilarEscolhido.percentual > 75 && dimPrioritaria.media >= 3 ? 'refinamento' : 'construcao'

  const porOndeComecar: PorOndeComecar = {
    pilarInicial: pilarInicialId,
    motivoPilar,
    dimensaoPrioritaria: dimPrioritaria,
    dimensaoSeguinte: dimSeguinte,
    motivoDimensoes,
    tipoMovimento: tipoMovimentoGeral,
  }

  // 6. Alertas Condicionais (ordem por prioridade editorial, mostrar até os 3 primeiros)
  // Cruzamentos das respostas; hipóteses de observação, nunca diagnóstico causal.
  // 1. "Comunicação com foco pouco claro": A2.1 ou A4.1 >= 3, com F1 < 3.
  // 2. "Rota de chegada incompleta": A4.2 >= 3 e A4.1 <= 2.
  // 3. "Passagem ao agendamento pede observação": Atração > 50% e C1.2 = 2 (supressão: C1.2 = 1).
  // 4. "Continuidade pede atenção": C2.2 = 2 ou C3.2 = 1 (supressão: C2.2 = 1 não dispara perda; C3.2 = 1 dispara).
  // 5. "Revise o valor da agenda atual": F3 < 3, sessões atuais e desejadas positivas, atuais >= desejadas.
  // 6. "Critérios claros, sustentação em construção": F1 e F2 >= 3, F4 < 3.
  // 7. "Origem concentrada na plataforma": atendimento inclui plataforma e a única origem marcada é plataforma.
  // 8. "Continuidade com contrato pouco claro": C3.2 >= 3 e C4 < 3.
  const todosAlertas: AlertaCondicional[] = []

  // Alerta 1
  const rA2_1 = respostas[11]
  const rA4_1 = respostas[15]
  const mediaF1 = dimensoesPorCodigo.F1.media
  if ((rA2_1 >= 3 || rA4_1 >= 3) && mediaF1 < 3) {
    todosAlertas.push({
      id: 1,
      titulo: 'Comunicação com foco pouco claro',
      descricao:
        'Sua produção de conteúdo ou página de chegada está ativa, mas a clareza sobre para quem é seu trabalho (F1) ainda está difusa. Vale alinhar para quem você fala antes de ampliar o alcance.',
    })
  }

  // Alerta 2
  const rA4_2 = respostas[16]
  if (rA4_2 >= 3 && rA4_1 <= 2) {
    todosAlertas.push({
      id: 2,
      titulo: 'Rota de chegada incompleta',
      descricao:
        'Você acompanha a origem dos contatos recebidos, mas o destino onde a pessoa chega (página ou perfil com proposta e contato) ainda tem etapas pouco claras.',
    })
  }

  // Alerta 3
  const rC1_2 = respostas[18]
  if (pilares.atracao.percentual > 50 && rC1_2 === 2) {
    todosAlertas.push({
      id: 3,
      titulo: 'Passagem ao agendamento pede observação',
      descricao:
        'Sua Atração está acima de 50%, mas menos da metade dos contatos recentes converte em agendamento. Vale examinar o acolhimento do primeiro contato sem concluir que houve erro individual.',
    })
  }

  // Alerta 4
  const rC2_2 = respostas[20]
  const rC3_2 = respostas[22]
  // Condição: C2.2 = 2 OU C3.2 = 1.
  // Supressão: C2.2 = 1 ("Não sei") não é relato de perda; C1.2 = 1 ("Não tive contatos") também não.
  if (rC2_2 === 2 || rC3_2 === 1) {
    todosAlertas.push({
      id: 4,
      titulo: 'Continuidade pede atenção',
      descricao:
        'Há relatos de interrupção precoce após a entrevista inicial ou sumiço nas primeiras sessões. Vale investigar o enquadre inicial e os combinados de vínculo.',
    })
  }

  // Alerta 5
  const mediaF3 = dimensoesPorCodigo.F3.media
  const sAtuais = contexto.sessoesAtuais
  const sDesejadas = contexto.sessoesDesejadas
  if (
    mediaF3 < 3 &&
    sAtuais !== null &&
    sDesejadas !== null &&
    sAtuais > 0 &&
    sDesejadas > 0 &&
    sAtuais >= sDesejadas
  ) {
    todosAlertas.push({
      id: 5,
      titulo: 'Revise o valor da agenda atual',
      descricao:
        'Sua agenda atingiu ou superou o número de atendimentos desejados, mas a dimensão de Valor (F3) está vulnerável. Pode haver sobrecarga com remuneração abaixo do sustentável.',
    })
  }

  // Alerta 6
  const mediaF2 = dimensoesPorCodigo.F2.media
  const mediaF4 = dimensoesPorCodigo.F4.media
  if (mediaF1 >= 3 && mediaF2 >= 3 && mediaF4 < 3) {
    todosAlertas.push({
      id: 6,
      titulo: 'Critérios claros, sustentação em construção',
      descricao:
        'Público e mensagem estão bem desenhados, mas na hora de falar honorários e divulgar o trabalho ainda há desconforto ou culpa. A técnica já existe; a sustentação pede prática.',
    })
  }

  // Alerta 7
  const formas = contexto.formasAtendimento || []
  const origens = contexto.origensUltimosPacientes || []
  const incluiPlataforma = formas.includes('plataforma')
  const unicaOrigemPlataforma = origens.length === 1 && origens[0] === 'plataforma'
  if (incluiPlataforma && unicaOrigemPlataforma) {
    todosAlertas.push({
      id: 7,
      titulo: 'Origem concentrada na plataforma',
      descricao:
        'A totalidade dos últimos pacientes particulares veio de plataformas intermediadoras. Vale estruturar canais próprios de Atração para proteger a autonomia da sua prática.',
    })
  }

  // Alerta 8
  const mediaC4 = dimensoesPorCodigo.C4.media
  if (rC3_2 >= 3 && mediaC4 < 3) {
    todosAlertas.push({
      id: 8,
      titulo: 'Continuidade com contrato pouco claro',
      descricao:
        'A maioria dos pacientes permanece no atendimento, mas os combinados formais de contrato, faltas e reajuste (C4) ainda estão frágeis ou verbais.',
    })
  }

  // Mostrar apenas até os 3 primeiros alertas por prioridade
  const alertas = todosAlertas.slice(0, 3)

  // 7. Aviso de cuidado clínico (quando cabível, com destaque separado da nota)
  let avisoCuidadoClinico: string | null = null
  if (cuidadoClinico.conducaoClinica === 1 || cuidadoClinico.conducaoClinica === 2) {
    avisoCuidadoClinico =
      'Aviso de Apoio Clínico: Você indicou insegurança ou sobrecarga frequente em relação à sua condução clínica. A Academia FAC acolhe a dimensão técnica e financeira da prática, mas recomendamos fortemente buscar supervisão clínica e acompanhamento psicoterapêutico individual em paralelo para sustentar sua escuta com segurança e saúde emocional.'
  }

  return {
    instrumentVersion: 2,
    estaCompleto: cuidadoPreenchido,
    mediaFac,
    somaTotal,
    pilares,
    pilaresOrdenados,
    tipoRelacaoPilares,
    tituloLeitura,
    leituraPratica,
    relacaoEntrePilares,
    porOndeComecar,
    alertas,
    contextoInicial: contexto,
    respostasAbertas,
    cuidadoClinico,
    avisoCuidadoClinico,
  }
}
