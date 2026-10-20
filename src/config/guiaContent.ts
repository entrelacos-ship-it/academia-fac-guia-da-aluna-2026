/**
 * Configuração e Conteúdo Editorial do Guia da Aluna da Academia Método FAC
 *
 * Regras editoriais da Entrelaços / Tati:
 * - Tom: claro, firme, acolhedor, sem jargão de coach, sem culpar a aluna
 * - A precarização é estrutural, não falha individual
 * - NENHUM texto promete resultado financeiro ou de agenda
 * - SEM travessões longos em nenhum texto do app
 * - Instrumento oficial: Diagnóstico FAC Aprofundado Versão 2 (24 perguntas verbatim)
 */

import {
  DIAGNOSTICO_24_PERGUNTAS_V2,
  calcularDiagnosticoV2,
  ResultadoDiagnosticoV2,
  PilarId,
} from '@/lib/diagnosticoFacEngine'

export type { PilarId }

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
    descricaoCurta: 'Piso ético, custos reais, clareza de público e sustentação da prática.',
    foco: 'Sustentação estrutural da prática clínica para evitar o esgotamento e a precariedade.',
  },
  atracao: {
    id: 'atracao',
    nome: 'Atração (A)',
    descricaoCurta:
      'Presença digital, conteúdo autoral, rede de indicações e rota de chegada clara.',
    foco: 'Como as pessoas que precisam do seu trabalho encontram seu consultório com coerência e respeito ao código de ética.',
  },
  conexao: {
    id: 'conexao',
    nome: 'Conexão (C)',
    descricaoCurta:
      'Primeiro contato, entrevista inicial, permanência dos vínculos e contrato terapêutico.',
    foco: 'O vínculo que sustenta o processo clínico no tempo com dignidade e autonomia para a paciente.',
  },
}

export interface DiagnosticoPergunta {
  id: number
  pilar: PilarId
  enunciado: string
  opcoes: [
    { valor: 1 | 2 | 3 | 4; texto: string },
    { valor: 1 | 2 | 3 | 4; texto: string },
    { valor: 1 | 2 | 3 | 4; texto: string },
    { valor: 1 | 2 | 3 | 4; texto: string },
  ]
  observacaoEditorial?: string
}

/**
 * 24 perguntas do Diagnóstico FAC Aprofundado Versão 2 (Verbatim da Tati).
 * Re-exportado de @/lib/diagnosticoFacEngine para manter compatibilidade e centralização.
 */
export const DIAGNOSTICO_24_PERGUNTAS: DiagnosticoPergunta[] = DIAGNOSTICO_24_PERGUNTAS_V2.map(
  (p) => ({
    id: p.id,
    pilar: p.pilar,
    enunciado: `${p.codigo}. ${p.enunciado}`,
    opcoes: [p.opcoes[0], p.opcoes[1], p.opcoes[2], p.opcoes[3]],
  }),
)

export type ResultadoDiagnostico = ResultadoDiagnosticoV2

/**
 * Função de conveniência que roda o motor da versão 2.
 */
export function calcularResultadoDiagnostico(
  respostas: Record<number, number>,
): ResultadoDiagnosticoV2 | null {
  return calcularDiagnosticoV2(respostas)
}

/**
 * CONTEÚDO PEDAGÓGICO DO ENCONTRO 1 (AULA MAGNA ABERTA — 06/10/2026)
 * Único encontro gratuito e aberto a todas as visitantes.
 */
/**
 * Configurações e links do Guia da Aluna (Encontro 2 e afins)
 */
export const LINK_PECA_3 = '/ikigai'
export const LINK_COMUNIDADE = 'https://chat.whatsapp.com/GuztcxmjzoN06vHw6rQ21U'
export const LINK_ECOSSISTEMA = 'https://ecossistema.entrelacospsicologia.com.br/'

export const ENCONTRO_3_CONTENT = {
  numero: 3,
  titulo: 'Encontro 3 · Princípios da Sustentabilidade Financeira da Clínica',
  data: '20 de out. de 2026',
  condutora: '@Tatiana Kellen Ribeiro da Silva',
  pilar: 'Fundação',
  visaoGeral: {
    resumo:
      'Cada aluna sai do encontro com o piso da sua sessão calculado e uma regra de preço escrita, que passa a guiar toda decisão financeira da clínica. Pilar: Fundação.',
    perguntaCentral:
      'quanto a sua sessão precisa custar para a sua prática se sustentar, sem consumir você?',
    entregavel:
      'print ou PDF do resultado da Calculadora + o cartão "Minha Regra de Preço" preenchido (5 linhas), postado na comunidade ou no grupo.',
    criterioDePronto:
      'piso por sessão calculado com números reais (não estimados de cabeça) e regra de preço com piso, preço praticado, política de valor social e data de revisão.',
    licaoEncontro2:
      'nenhum download e nenhum arquivo zip. A prática usa só a Calculadora do Guia da Aluna (abre no navegador) e um prompt para copiar e colar no ChatGPT. Duas atividades, não três.',
  },
  roteiro: [
    {
      horario: '19h00',
      bloco: 'Abertura (5 min)',
      acontece: 'Boas-vindas, retomada rápida das entregas do Encontro 2',
    },
    {
      horario: '19h05',
      bloco: 'Teoria (25 min)',
      acontece: 'Os 7 princípios em slides, com o exemplo calculado',
    },
    {
      horario: '19h30',
      bloco: 'Atividade 1 (25 min)',
      acontece: 'Calculadora no Guia da Aluna, cada aluna com os próprios números',
    },
    {
      horario: '19h55',
      bloco: 'Laboratório (15 min)',
      acontece: 'Leitura ao vivo do resultado de cada aluna',
    },
    {
      horario: '20h10',
      bloco: 'Atividade 2 (15 min)',
      acontece: 'Cartão "Minha Regra de Preço" + teste no ChatGPT',
    },
    {
      horario: '20h25',
      bloco: 'Combinado da semana (5 min)',
      acontece: 'Entrega, próximo encontro, fechamento',
    },
  ],
  roteiroNota:
    'Se a turma andar mais devagar, a Atividade 2 vira tarefa da semana. O piso calculado é o que não pode sair do encontro sem estar pronto.',
  slides: [
    {
      numero: 1,
      titulo: 'Slide 1 · Abertura',
      naTela:
        'Sustentabilidade financeira não é ganância. É o que permite você continuar cuidando.',
      falaChave:
        'Hoje a gente não vai falar de ficar rica. Vai falar de uma conta que quase ninguém fez: quanto a sua sessão precisa custar para a sua prática não consumir você. Ao final, cada uma sai daqui com esse número.',
    },
    {
      numero: 2,
      titulo: 'Slide 2 · Princípio 1: Dignidade financeira é princípio ético',
      naTela: 'A precarização não é falha individual. É estrutura.',
      falaChave:
        'A psicologia aprendeu a romantizar o sacrifício. Cobrar barato virou humildade, agenda lotada virou vocação, querer prosperar virou culpa. Mas uma profissional exausta e sem reserva não oferece o melhor cuidado. Sustentar a si mesma faz parte da ética do cuidado.',
    },
    {
      numero: 3,
      titulo: 'Slide 3 · Princípio 2: O preço começa pela sua conta, não pela colega',
      naTela: 'O mercado é checagem. Nunca ponto de partida.',
      falaChave:
        'O erro mais comum é olhar o que a colega cobra e copiar. Só que a colega tem outro custo, outra família, outra agenda. Primeiro a sua conta, depois a comparação com a tabela do CRP e com quem atende o mesmo público, na mesma região, no mesmo formato.',
    },
    {
      numero: 4,
      titulo: 'Slide 4 · Princípio 3: Hora clínica não é hora de trabalho',
      naTela: 'Sustentável é o que você aguenta por seis meses seguidos, não o seu melhor mês.',
      falaChave:
        'Por trás de cada sessão existe estudo de caso, prontuário, supervisão, gestão, conteúdo, deslocamento. Se você calcula o preço como se só a sessão existisse, todas essas horas ficam de graça. E as faltas existem: em média, uma em cada dez sessões não acontece.',
    },
    {
      numero: 5,
      titulo: 'Slide 5 · Princípio 4: Faturamento não é renda',
      naTela: 'Tributos e reserva saem do bruto, antes de sobrar para você.',
      falaChave:
        'O dinheiro que entra não é o dinheiro que fica. Imposto, reserva para férias e meses fracos saem antes. Por isso a conta certa divide pelo que sobra depois desses percentuais, em vez de somar no final.',
    },
    {
      numero: 6,
      titulo: 'Slide 6 · A fórmula do piso',
      isFormula: true,
      naTela:
        'Piso por sessão = ((Custos pessoais + Custos profissionais + Retirada) ÷ (1 − %Reserva − %Tributos)) ÷ (Sessões por semana × Semanas no mês × (1 − %Faltas))',
      falaChave:
        'Parece complicado, mas são só cinco perguntas: quanto custa a sua vida, quanto custa a sua clínica, quanto você quer que sobre, quanto vai para imposto e reserva, e quantas sessões você realmente aguenta fazer.',
    },
    {
      numero: 7,
      titulo: 'Slide 7 · O exemplo calculado (exemplo fictício)',
      isExemploCalculado: true,
      tabelaExemplo: [
        { item: 'Custos pessoais por mês', valor: 'R$ 5.000' },
        { item: 'Custos profissionais por mês', valor: 'R$ 1.500' },
        { item: 'Retirada desejada', valor: 'R$ 2.000' },
        { item: 'Base', valor: 'R$ 8.500' },
        { item: 'Reserva 10% + tributos 6%', valor: '16% sobre o bruto' },
        { item: 'Faturamento bruto necessário (8.500 ÷ 0,84)', valor: 'R$ 10.119' },
        {
          item: 'Sessões: 20 por semana × 4 semanas, com 10% de faltas',
          valor: '72 sessões efetivas',
        },
        { item: 'Piso por sessão (10.119 ÷ 72)', valor: 'R$ 140,54' },
      ],
      falaChave:
        'Agora olhem a conta de padaria, que é a que a maioria faz: 8.500 dividido por 80 sessões dá R$ 106. Parece razoável. Mas são R$ 34 a menos por sessão, e no mês isso dá quase R$ 2.500 que saem de você, em hora extra, férias que não acontecem ou reserva que não existe. (Os percentuais são ilustrativos, cada uma confirma os seus com o contador.)',
    },
    {
      numero: 8,
      titulo: 'Slide 8 · Princípio 5: Piso não é preço',
      naTela: 'Abaixo do piso, a prática consome você, mesmo com a agenda cheia.',
      falaChave:
        'O piso é o mínimo para sobreviver com dignidade. O preço que você pratica pode e deve ficar acima dele, de acordo com posicionamento, experiência e público. Cobrar abaixo do piso não é generosidade, é transferir o custo para a sua saúde.',
    },
    {
      numero: 9,
      titulo: 'Slide 9 · Princípio 6: Valor social com critério',
      naTela: 'Vagas limitadas. Critério explícito. Prazo de revisão.',
      falaChave:
        'Valor social pode existir, desde que as três condições estejam escritas antes de você oferecer pela primeira vez. Por exemplo, até 15% da agenda. Sem isso, a exceção vira regra e a regra vira prejuízo.',
    },
    {
      numero: 10,
      titulo: 'Slide 10 · Princípio 7: Se o número parece impossível, mexa no modelo',
      naTela: 'O problema raramente é o preço. É o modelo.',
      falaChave:
        'Se o seu piso ficou acima do que o seu mercado paga, não baixe o piso. Olhe para o modelo: custo alto demais, sessões de menos, público desalinhado. E existem formas de escalar a hora: grupo terapêutico, pacotes antecipados, produtos gravados, atendimento de brasileiros no exterior.',
    },
    {
      numero: 11,
      titulo: 'Slide 11 · Os sinais de que o preço está errado',
      naTela:
        'Agenda cheia e conta apertada · Voz trêmula ao dizer o valor · Quase todo mundo aceita na hora · Férias que nunca acontecem',
      falaChave:
        'Se você se reconheceu em algum desses, não é falha sua. É sinal de que o seu preço nasceu do medo, e não da conta. Revisar preço é manutenção de rotina: a cada seis meses, ou quando a agenda passar de 80% de ocupação.',
    },
  ],
  atividade1: {
    titulo: 'ATIVIDADE 1 · Meu piso por sessão (25 min)',
    ferramenta:
      'Calculadora de Precificação Clínica Ética, dentro do Guia da Aluna. Abre direto no navegador, nada para baixar, e nenhum dado sai do aparelho da aluna.',
    passos: [
      'Abra o Guia da Aluna: https://academia-fac-guia-da-aluna.goskip.app/ e entre na Calculadora de Precificação.',
      'Preencha os custos pessoais do mês: moradia, alimentação, transporte, saúde, educação, dependentes.',
      'Preencha os custos profissionais: sala ou plataforma, internet, prontuário, supervisão, formação, contador, anúncios.',
      'Digite a retirada desejada: quanto você quer que sobre para você depois de tudo pago.',
      'Informe reserva e tributos em percentual. Se não souber os tributos, use um valor provisório e anote para confirmar com o contador.',
      'Informe quantas sessões por semana você aguenta manter por seis meses, as semanas de trabalho no mês e a taxa de faltas (10% se não souber).',
      'Coloque quanto cobra hoje, para ver a diferença.',
      'Tire um print ou baixe o PDF do resultado.',
    ],
    conducao:
      'compartilhe a sua tela e preencha junto com elas usando o exemplo fictício do Slide 7. Elas repetem na própria tela com os números reais. Se alguém travar em um campo, deixe zero e siga: dá para completar depois.',
  },
  laboratorio: {
    titulo: 'LABORATÓRIO · leitura do resultado (15 min)',
    instrucao:
      'Cada aluna mostra o próprio número (só se quiser compartilhar valores; pode falar só da diferença). Até 7 minutos por aluna, com três perguntas:',
    perguntas: [
      'Qual foi a sua primeira reação ao ver o piso?',
      'O seu preço atual está acima ou abaixo dele? Quanto isso representa no mês?',
      'Se ficou abaixo: o caminho é ajustar o preço, ajustar o modelo, ou os dois?',
    ],
    suaLeitura:
      'devolva o número para a lógica dos princípios. Se a lacuna for grande, nomeie o Princípio 7 (mexer no modelo) antes que a aluna conclua que "não dá". Para quem pensa em grupos terapêuticos ou produtos digitais no futuro, mostre que isso é justamente uma forma de escalar a hora.',
  },
  atividade2: {
    titulo: 'ATIVIDADE 2 · Cartão "Minha Regra de Preço" (15 min)',
    instrucao:
      'Cada aluna copia o modelo abaixo, preenche e posta no grupo ou na comunidade. É o entregável do encontro.',
    modeloCartao: {
      titulo: 'MINHA REGRA DE PREÇO',
      linhas: [
        '1. Meu piso por sessão é R$ ____. Abaixo disso eu não atendo.',
        '2. Meu preço praticado é R$ ____ (a partir de ____).',
        '3. Valor social: até ____ vagas, para quem ____, revisado a cada ____ meses.',
        '4. Pacote ou condição especial que eu ofereço: ____ (ou "nenhum por enquanto").',
        '5. Vou revisar meu preço em ____ (data), ou quando minha agenda passar de 80%.',
      ],
    },
    testeChatGPT: {
      instrucao:
        'a aluna cola o prompt abaixo no ChatGPT, já com o cartão preenchido. Copiar e colar, sem arquivo.',
      promptTemplate: `Aja como uma consultora de sustentabilidade financeira para psicólogas, com olhar ético e realista.

Vou te passar o resultado da minha calculadora de precificação e a minha regra de preço.

Meu piso por sessão: R$ [valor]
Quanto cobro hoje: R$ [valor]
Sessões por semana que consigo sustentar: [número]
Meu público e formato de atendimento: [ex.: adultos, psicoterapia online]
Minha regra de preço: [cole o cartão aqui]

Com base nisso:
1. Me diga, com franqueza, se a minha regra protege a minha sustentabilidade ou deixa brechas.
2. Aponte qual item da regra tem mais risco de eu mesma não cumprir, e por quê.
3. Se meu preço atual estiver abaixo do piso, sugira um plano de transição em até 3 etapas, sem prejudicar os pacientes atuais.
4. Escreva uma frase curta, firme e acolhedora para eu comunicar meu valor quando alguém perguntar o preço.

Não me dê fórmulas genéricas. Responda considerando a realidade da psicologia clínica no Brasil.`,
    },
  },
  combinado: {
    tempo: '5 min',
    checklist: [
      'Postar no grupo o print da calculadora (ou só a diferença, se preferir não expor valores) e o cartão "Minha Regra de Preço"',
      'Conferir os custos reais em três meses de extrato e recalcular se algum número mudou',
      'Confirmar com o contador o percentual de tributos usado na conta',
    ],
    fraseFechamento: 'a partir de hoje, vocês não decidem preço pelo medo. Decidem pela conta.',
  },
  planoB: {
    titulo: 'Plano B se a tecnologia travar:',
    instrucao:
      'Se a Calculadora não abrir para alguma aluna, não perca tempo tentando resolver ao vivo. Ela faz a conta no papel com a calculadora do celular, seguindo o Slide 6, nesta ordem:',
    passos: [
      'Some custos pessoais + custos profissionais + retirada.',
      'Divida pelo que sobra depois de reserva e tributos (com 16%, divida por 0,84).',
      'Multiplique sessões por semana × semanas no mês × 0,9 (descontando 10% de faltas).',
      'Divida o resultado do passo 2 pelo resultado do passo 3. Esse é o piso.',
    ],
    limite: 'Limite de 5 minutos para qualquer problema técnico. Passou disso, plano B.',
  },
}

export const ENCONTRO_1_CONTENT = {
  numero: 1,
  titulo: 'Aula Magna: O Chão da Clínica Sustentável',
  subtitulo:
    'Diagnóstico FAC Aprofundado — Versão 2 (04/10/2026) e os Três Pilares da Autoria Ética',
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
      titulo: '3. Realizar o Diagnóstico Inicial',
      descricao: 'Aplicação do Diagnóstico FAC Aprofundado — Versão 2 (04/10/2026).',
      conteudo: `Nesta página você tem acesso ao motor completo do Diagnóstico FAC Aprofundado — Versão 2 (24 perguntas e 3 pilares).
Ao final, você receberá a visão geral completa da sua prática, as leituras verbatim dos pilares, os 6 movimentos e a geração de relatório em PDF.`,
    },
    {
      id: 'entregar',
      titulo: '4. Próximos Passos',
      descricao: 'Como continuar sua formação na Academia.',
      conteudo: `A Aula 1 é aberta a toda a categoria. A partir do Encontro 2, mergulhamos nos cadernos didáticos da turma (identidade profissional, enquadre ético, sustentabilidade clínica e encontros de supervisão). Os aplicativos e sistemas do Método FAC ficam disponíveis como recursos complementares no painel principal.
Se você já é aluna matriculada, valide seu e-mail de compra nesta página para liberar todos os cadernos. Se deseja ingressar na próxima turma, fale com a equipe da Entrelaços.`,
    },
  ],
  avisoPrivacidade:
    'Seu rascunho e histórico ficam neste navegador. Baixe o PDF para guardar o resultado.',
  avisoEtico:
    'Este diagnóstico avalia a estrutura da sua prática profissional. Não é avaliação psicológica nem avaliação de competência clínica.',
}
