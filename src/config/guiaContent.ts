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
      titulo: '3. Construir seu Retrato Inicial',
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
