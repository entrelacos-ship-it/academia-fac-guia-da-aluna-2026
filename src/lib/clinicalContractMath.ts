/**
 * Estruturas de dados e gerador de texto para Contrato Clínico e Proposta de Honorários
 */

export interface ClinicalContractData {
  // Identificação Profissional
  nomeProfissional: string
  crp: string
  cidadeUf: string
  telefoneContato: string
  emailContato: string

  // Identificação Paciente
  nomePaciente: string
  cpfPaciente: string
  responsavelLegal: string // Se menor de idade

  // Parâmetros do Atendimento
  valorSessao: number
  duracaoMinutos: number // default 50
  periodicidade: string // default "Semanal"
  formaPagamento: string // "Pix", "Transferência", "Boleto", "Cartão"
  diaVencimento: number // default 5 ou 10

  // Cláusulas e Políticas
  politicaFaltas: string
  indiceReajusteNome: string // "IPCA", "IGP-M"
  indiceReajustePct: number
  mesReajusteAnual: string
  dataInicio: string
}

export const DEFAULT_POLITICA_FALTAS =
  'As sessões desmarcadas pelo(a) PACIENTE com antecedência mínima de 24 (vinte e quatro) horas poderão ser repostas conforme disponibilidade de agenda da(o) PSICÓLOGA(O). Faltas sem aviso prévio de 24 horas ou ausências não justificadas serão cobradas integralmente, visto que o horário ficou reservado exclusivamente à sua disposição.'

export const DEFAULT_CONTRACT_DATA: ClinicalContractData = {
  nomeProfissional: '',
  crp: '',
  cidadeUf: 'São Paulo - SP',
  telefoneContato: '',
  emailContato: '',
  nomePaciente: '',
  cpfPaciente: '',
  responsavelLegal: '',
  valorSessao: 180,
  duracaoMinutos: 50,
  periodicidade: 'Semanal',
  formaPagamento: 'PIX ou Transferência Bancária',
  diaVencimento: 5,
  politicaFaltas: DEFAULT_POLITICA_FALTAS,
  indiceReajusteNome: 'IPCA',
  indiceReajustePct: 4.83,
  mesReajusteAnual: 'Janeiro',
  dataInicio: new Date().toISOString().split('T')[0],
}

/**
 * Gera texto formal integral do Contrato de Prestação de Serviços Psicológicos
 */
export function generateContractText(data: ClinicalContractData): string {
  const profissionalStr = data.nomeProfissional || '[NOME COMPLETO DA PSICÓLOGA]'
  const crpStr = data.crp || '[NÚMERO DO CRP, EX: CRP 06/12345]'
  const cidadeStr = data.cidadeUf || '[CIDADE - UF]'
  const pacienteStr = data.nomePaciente || '[NOME COMPLETO DO(A) PACIENTE]'
  const cpfPacienteStr = data.cpfPaciente || '[CPF DO(A) PACIENTE]'
  const valorFormatado = data.valorSessao.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS PSICOLÓGICOS E TERMO DE ENQUADRAMENTO ÉTICO

Pelo presente instrumento particular de prestação de serviços profissionais, de um lado:

CONTRATADA(O): ${profissionalStr}, psicóloga(o) devidamente inscrita(o) no Conselho Regional de Psicologia sob o ${crpStr}, com atuação profissional na cidade de ${cidadeStr}.

CONTRATANTE: ${pacienteStr}, portador(a) do CPF nº ${cpfPacienteStr}${data.responsavelLegal ? `, representado(a) por ${data.responsavelLegal}` : ''}.

Têm, entre si, justo e acordado o presente Contrato de Prestação de Serviços de Psicoterapia, que se regerá pelas seguintes cláusulas e condições:

CLÁUSULA PRIMEIRA – DO OBJETO
O presente instrumento tem por objeto a prestação de serviços psicológicos clínicos (psicoterapia), na modalidade individual, com atendimentos de ${data.duracaoMinutos} minutos de duração, em frequência ${data.periodicidade.toLowerCase()}, em dias e horários previamente acordados entre as partes.

CLÁUSULA SEGUNDA – DOS HONORÁRIOS E FORMA DE PAGAMENTO
2.1. O valor de cada sessão individual de psicoterapia é fixado em ${valorFormatado} (${data.valorSessao} reais).
2.2. A forma de pagamento acordada é via ${data.formaPagamento}, devendo o acerto ser realizado até o dia ${data.diaVencimento} de cada mês (ou a cada sessão/ciclo acordado), mediante fornecimento de recibo para fins fiscais e dedução em Imposto de Renda Pessoa Física.

CLÁUSULA TERCEIRA – DA POLÍTICA DE CANCELAMENTOS, FALTAS E REPOSIÇÕES
3.1. ${data.politicaFaltas}
3.2. Na hipótese de necessidade de desmarcação ou afastamento por parte da(o) PSICÓLOGA(O), a sessão será tempestivamente comunicada e reposta sem qualquer ônus ao(à) PACIENTE.

CLÁUSULA QUARTA – DO REAJUSTE ANUAL DE HONORÁRIOS
4.1. Conforme a prática clínica ética e para preservação do poder de compra frente à inflação oficial, os honorários serão atualizados anualmente no mês de ${data.mesReajusteAnual}, aplicando-se a variação acumulada do índice oficial de inflação (${data.indiceReajusteNome}, atualmente projetado em ${data.indiceReajustePct.toFixed(2)}%), ou índice oficial congênere do período.
4.2. A comunicação da atualização será realizada com antecedência mínima de 30 (trinta) dias.

CLÁUSULA QUINTA – DO SIGILO PROFISSIONAL E ÉTICA CLÍNICA
5.1. A(O) PSICÓLOGA(O) compromete-se ao rigoroso cumprimento do Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005), assegurando sigilo e confidencialidade absoluta sobre todas as informações reveladas no decurso dos atendimentos clínicos.
5.2. As exceções ao dever de sigilo limitam-se estritamente às hipóteses legais previstas em lei e no Código de Ética (risco iminente à vida do(a) paciente ou de terceiros).

CLÁUSULA SEXTA – DA DURAÇÃO E RESCISÃO
6.1. O acompanhamento terapêutico tem prazo indeterminado, cabendo a ambas as partes decidir pela alta clínica ou encerramento do processo, recomendando-se a realização de uma sessão final de encerramento e síntese do processo terapêutico.
6.2. Qualquer das partes poderá rescindir o presente contrato mediante aviso prévio simples, sem incidência de multa rescisória, quitando-se os atendimentos efetivamente realizados até a data.

CLÁUSULA SÉTIMA – DO FORO
Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro da Comarca de ${cidadeStr}, com renúncia expressa a qualquer outro.

E, por estarem justos e contratados, firmam o presente termo.

${cidadeStr}, data de início: ${data.dataInicio}.


_________________________________________
${profissionalStr}
${crpStr}


_________________________________________
${pacienteStr}
CONTRATANTE`
}

/**
 * Gera proposta simplificada de honorários para envio ao paciente/família
 */
export function generateProposalText(data: ClinicalContractData): string {
  const profissionalStr = data.nomeProfissional || 'Psicóloga Clínica'
  const crpStr = data.crp ? `(${data.crp})` : ''
  const pacienteStr = data.nomePaciente ? `para ${data.nomePaciente}` : ''
  const valorFormatado = data.valorSessao.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return `PROPOSTA DE ACOMPANHAMENTO CLÍNICO E HONORÁRIOS

Profissional: ${profissionalStr} ${crpStr}
Destinatário: Proposta de atendimento terapêutico ${pacienteStr}

Prezado(a),

Apresento as diretrizes para início do nosso acompanhamento em psicoterapia:

1. MODALIDADE E CARGA HORÁRIA
• Sessões individuais com duração de ${data.duracaoMinutos} minutos.
• Frequência recomendada: ${data.periodicidade}.

2. VALOR DO INVESTIMENTO E PAGAMENTO
• Valor por sessão: ${valorFormatado}.
• Forma de pagamento: ${data.formaPagamento}, com acerto mensal até o dia ${data.diaVencimento}.
• Emissão regular de recibo profissional para fins de comprovação e dedução no IRPF.

3. ACORDO DE CANCELAMENTO E PONTUALIDADE
• ${data.politicaFaltas}

4. COMPROMISSO ÉTICO E SIGILO
• Todo o processo é conduzido em estrita conformidade com o Código de Ética Profissional do Psicólogo (CFP), garantindo absoluto sigilo e ambiente seguro.

5. REAJUSTE ANUAL
• Atualização anual prevista no mês de ${data.mesReajusteAnual} com base no índice oficial de inflação (${data.indiceReajusteNome}).

Fico à inteira disposição para acolher qualquer dúvida e agendar nosso primeiro encontro.

Atenciosamente,
${profissionalStr}
${data.telefoneContato ? `Contato: ${data.telefoneContato}` : ''}
${data.emailContato ? `E-mail: ${data.emailContato}` : ''}`
}
