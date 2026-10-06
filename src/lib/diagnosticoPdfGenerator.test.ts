import { describe, it, expect } from 'vitest'
import {
  calcularDiagnosticoV2,
  ResultadoDiagnosticoV2,
  ContextoInicial,
  RespostasAbertasPilares,
  CuidadoClinico,
} from './diagnosticoFacEngine'
import { buildDiagnosticoPdfDocument, downloadDiagnosticoPdf } from './diagnosticoPdfGenerator'

describe('Gerador de PDF do Diagnóstico FAC Aprofundado — Versão 2', () => {
  // Cenário real com 24 respostas e 2 perguntas de cuidado preenchidas
  const respostas24: Record<number, number> = {
    1: 3,
    2: 2,
    3: 4,
    4: 3,
    5: 2,
    6: 3,
    7: 1,
    8: 3, // Fundação
    9: 2,
    10: 3,
    11: 4,
    12: 2,
    13: 3,
    14: 2,
    15: 3,
    16: 4, // Atração
    17: 3,
    18: 2,
    19: 3,
    20: 3,
    21: 4,
    22: 2,
    23: 3,
    24: 3, // Conexão
  }

  const contextoCompleto: ContextoInicial = {
    momentoCarreira: 'Clínica em consolidação (3 a 7 anos)',
    formasAtendimento: ['online', 'presencial'],
    sessoesAtuais: 14,
    sessoesDesejadas: 18,
    origensUltimosPacientes: ['indicacao_pacientes', 'instagram'],
    oQueMaisTrava: 'Oscilação na atração de novos pacientes e insegurança ao atualizar valores.',
  }

  const respostasAbertasCompletas: RespostasAbertasPilares = {
    fundacao: 'Tentei criar uma planilha de fluxo de caixa mas não mantive a consistência.',
    atracao: 'O Instagram gerou alguns contatos orgânicos ano passado.',
    conexao:
      'Muitos pacientes chegam para a primeira sessão mas não continuam após o primeiro mês.',
  }

  const cuidadoCompleto: CuidadoClinico = {
    conducaoClinica: 2,
    supervisaoRegular: 3,
  }

  it('calcula o diagnóstico completo e gera o objeto jsPDF sem erros', () => {
    const resultado: ResultadoDiagnosticoV2 | null = calcularDiagnosticoV2(
      respostas24,
      contextoCompleto,
      respostasAbertasCompletas,
      cuidadoCompleto,
    )

    expect(resultado).not.toBeNull()
    if (!resultado) return

    expect(resultado.somaTotal).toBeGreaterThan(0)
    expect(resultado.mediaFac).toBeGreaterThanOrEqual(0)
    expect(resultado.mediaFac).toBeLessThanOrEqual(100)
    expect(resultado.pilares.fundacao.percentual).toBeDefined()
    expect(resultado.pilares.atracao.percentual).toBeDefined()
    expect(resultado.pilares.conexao.percentual).toBeDefined()

    // Gera o documento jsPDF
    const doc = buildDiagnosticoPdfDocument(resultado, {
      alunaNome: 'Tati Administradora',
      dataEmissao: '04 de outubro de 2026',
    })

    expect(doc).toBeDefined()
    // Deve possuir ao menos 3 páginas (capa executiva, 12 dimensões, contexto/cuidados)
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(3)

    // O output arraybuffer deve conter bytes válidos de um arquivo PDF
    const pdfData = doc.output('arraybuffer')
    expect(pdfData.byteLength).toBeGreaterThan(1000)

    // Os primeiros 4 bytes de um PDF válido são %PDF
    const headerBytes = new Uint8Array(pdfData.slice(0, 4))
    const headerStr = String.fromCharCode(...headerBytes)
    expect(headerStr).toBe('%PDF')
  })

  it('downloadDiagnosticoPdf executa com sucesso e chama doc.save com o nome correto', async () => {
    const resultado = calcularDiagnosticoV2(
      respostas24,
      contextoCompleto,
      respostasAbertasCompletas,
      cuidadoCompleto,
    )
    expect(resultado).not.toBeNull()
    if (!resultado) return

    const res = await downloadDiagnosticoPdf(resultado)

    expect(res.success).toBe(true)
    expect(res.filename).toBe('diagnostico-fac-aprofundado.pdf')
    expect(res.error).toBeUndefined()
  })

  it('downloadDiagnosticoPdf trata falha gracefully sem travar ou deixar exceção solta', async () => {
    // Passar resultado inválido
    const res = await downloadDiagnosticoPdf(null as unknown as ResultadoDiagnosticoV2)

    expect(res.success).toBe(false)
    expect(res.filename).toBe('diagnostico-fac-aprofundado.pdf')
    expect(res.error).toBeDefined()
    expect(res.error).toContain('incompleto')
  })
})
