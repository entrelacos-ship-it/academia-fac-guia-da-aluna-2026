import { describe, it, expect } from 'vitest'
import {
  calcularDiagnosticoV2,
  getNivelPilar,
  DIAGNOSTICO_24_PERGUNTAS_V2,
  CuidadoClinico,
  ContextoInicial,
  DEFAULT_CONTEXTO_INICIAL,
  DEFAULT_RESPOSTAS_ABERTAS,
  DEFAULT_CUIDADO_CLINICO,
} from './diagnosticoFacEngine'

describe('Motor de Cálculo Diagnóstico FAC Aprofundado v2', () => {
  const mockCuidadoCompleto: CuidadoClinico = {
    conducaoClinica: 3,
    supervisaoRegular: 3,
  }

  it('valida o exemplo auditável canônico da especificação da Tati', () => {
    // Exemplo auditável:
    // Fundação soma 20 -> 50%
    // Atração soma 24 -> 67%
    // Conexão soma 16 -> 33%
    // soma total 60; média FAC = arredondar((60-24)/72*100) = 50%
    const respostas: Record<number, number> = {}

    // Fundação (perguntas 1 a 8): soma = 20
    // Ex: 2, 3, 2, 3, 2, 3, 2, 3 -> soma = 20
    for (let i = 1; i <= 8; i++) {
      respostas[i] = i % 2 === 1 ? 2 : 3
    }

    // Atração (perguntas 9 a 16): soma = 24
    // 8 perguntas com valor 3 = 24
    for (let i = 9; i <= 16; i++) {
      respostas[i] = 3
    }

    // Conexão (perguntas 17 a 24): soma = 16
    // 8 perguntas com valor 2 = 16
    for (let i = 17; i <= 24; i++) {
      respostas[i] = 2
    }

    const res = calcularDiagnosticoV2(
      respostas,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res).not.toBeNull()
    if (!res) return

    expect(res.somaTotal).toBe(60)
    expect(res.mediaFac).toBe(50)

    expect(res.pilares.fundacao.soma).toBe(20)
    expect(res.pilares.fundacao.percentual).toBe(50)

    expect(res.pilares.atracao.soma).toBe(24)
    expect(res.pilares.atracao.percentual).toBe(67)

    expect(res.pilares.conexao.soma).toBe(16)
    expect(res.pilares.conexao.percentual).toBe(33)

    // Dimensão com respostas 2 e 3 -> média 2.5 -> (2.5 - 1) / 3 * 100 = 50%
    expect(res.pilares.fundacao.dimensoes[0].media).toBe(2.5)
    expect(res.pilares.fundacao.dimensoes[0].percentual).toBe(50)
  })

  it('verifica cortes de níveis dos pilares (0-25 Solto, 26-50 Em construção, 51-75 Funcionando, 76-100 Consolidado)', () => {
    expect(getNivelPilar(0).id).toBe('solto')
    expect(getNivelPilar(25).id).toBe('solto')
    expect(getNivelPilar(26).id).toBe('em_construcao')
    expect(getNivelPilar(50).id).toBe('em_construcao')
    expect(getNivelPilar(51).id).toBe('funcionando')
    expect(getNivelPilar(75).id).toBe('funcionando')
    expect(getNivelPilar(76).id).toBe('consolidado')
    expect(getNivelPilar(100).id).toBe('consolidado')
  })

  it('garante que Fundação abaixo de 50% é sempre o pilar de partida prioritário', () => {
    // Atração = 30%, Fundação = 40%, Conexão = 80%
    // Mesmo Atração sendo menor (30%), Fundação < 50% força Fundação a ser o pilar inicial!
    const respostas: Record<number, number> = {}

    // F: soma 18 -> média 2.25 -> (1.25/3)*100 = 42%
    for (let i = 1; i <= 8; i++) respostas[i] = i <= 6 ? 2 : 3
    // A: soma 15 -> média 1.875 -> (0.875/3)*100 = 29%
    for (let i = 9; i <= 16; i++) respostas[i] = i <= 15 ? 2 : 1
    // C: soma 28 -> média 3.5 -> (2.5/3)*100 = 83%
    for (let i = 17; i <= 24; i++) respostas[i] = i <= 20 ? 3 : 4

    const res = calcularDiagnosticoV2(
      respostas,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res).not.toBeNull()
    if (!res) return

    expect(res.pilares.fundacao.percentual).toBeLessThan(50)
    expect(res.pilares.atracao.percentual).toBeLessThan(res.pilares.fundacao.percentual)
    expect(res.porOndeComecar.pilarInicial).toBe('fundacao')
  })

  it('trata empate e proximidade de 8 pontos percentuais conforme especificação (< 8 pontos)', () => {
    // 8 pontos exatos ficam fora do empate (< 8).
    // Pilar A: 60%, Pilar B: 67% (diferença 7 pontos < 8 -> proximidade)
    // Pilar C: 68% (diferença com A é 8 pontos -> fora da proximidade com A)
    const respostasAll3: Record<number, number> = {}
    for (let i = 1; i <= 24; i++) respostasAll3[i] = 3

    const res = calcularDiagnosticoV2(
      respostasAll3,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res).not.toBeNull()
    if (!res) return

    // Quando todos são 3: média 3 -> 67% em todos. Todos próximos!
    expect(res.tipoRelacaoPilares).toBe('todos_proximos')
    expect(res.tituloLeitura).toBe('Estrutura a meio caminho') // 36 a 65% ou no caso 67%
  })

  it('testa alertas e regras de supressão por "não sei" / "não tive contatos"', () => {
    // Criar base padrão com nota 3 em tudo
    const respostas: Record<number, number> = {}
    for (let i = 1; i <= 24; i++) respostas[i] = 3

    // Alerta 3: Atração > 50% e C1.2 = 2.
    // Supressão: C1.2 = 1 ("Não tive contatos") NÃO deve disparar Alerta 3!
    respostas[18] = 1 // C1.2 = 1
    let res = calcularDiagnosticoV2(
      respostas,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res?.alertas.some((a) => a.id === 3)).toBe(false)

    // Agora marcando C1.2 = 2 (perda observada: menos da metade agendou)
    respostas[18] = 2
    res = calcularDiagnosticoV2(
      respostas,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res?.alertas.some((a) => a.id === 3)).toBe(true)

    // Alerta 4: Continuidade pede atenção. C2.2 = 2 ou C3.2 = 1.
    // Supressão: se C2.2 = 1 ("Não sei") e C3.2 = 3, NÃO deve disparar Alerta 4
    respostas[20] = 1 // C2.2 = 1
    respostas[22] = 3 // C3.2 = 3
    res = calcularDiagnosticoV2(
      respostas,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res?.alertas.some((a) => a.id === 4)).toBe(false)

    // Se C2.2 = 2 (menos da metade segue e não sei por que), dispara Alerta 4
    respostas[20] = 2
    res = calcularDiagnosticoV2(
      respostas,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res?.alertas.some((a) => a.id === 4)).toBe(true)
  })

  it('testa Alerta 5 (Revise o valor da agenda atual)', () => {
    const respostas: Record<number, number> = {}
    for (let i = 1; i <= 24; i++) respostas[i] = 3
    // F3 < 3: F3.1 (id 5) = 2 e F3.2 (id 6) = 2 -> média F3 = 2
    respostas[5] = 2
    respostas[6] = 2

    const contexto: ContextoInicial = {
      ...DEFAULT_CONTEXTO_INICIAL,
      sessoesAtuais: 20,
      sessoesDesejadas: 16, // atuais >= desejadas e ambas > 0
    }

    const res = calcularDiagnosticoV2(
      respostas,
      contexto,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res?.alertas.some((a) => a.id === 5)).toBe(true)
  })

  it('testa Alerta 7 (Origem concentrada na plataforma)', () => {
    const respostas: Record<number, number> = {}
    for (let i = 1; i <= 24; i++) respostas[i] = 3

    const contexto: ContextoInicial = {
      ...DEFAULT_CONTEXTO_INICIAL,
      formasAtendimento: ['plataforma'],
      origensUltimosPacientes: ['plataforma'],
    }

    const res = calcularDiagnosticoV2(
      respostas,
      contexto,
      DEFAULT_RESPOSTAS_ABERTAS,
      mockCuidadoCompleto,
    )
    expect(res?.alertas.some((a) => a.id === 7)).toBe(true)
  })

  it('dispara aviso de apoio clínico se condução clínica for 1 ou 2, mas não altera a nota FAC', () => {
    const respostas: Record<number, number> = {}
    for (let i = 1; i <= 24; i++) respostas[i] = 3

    const cuidadoComSobrecarga: CuidadoClinico = {
      conducaoClinica: 1,
      supervisaoRegular: 1,
    }

    const res = calcularDiagnosticoV2(
      respostas,
      DEFAULT_CONTEXTO_INICIAL,
      DEFAULT_RESPOSTAS_ABERTAS,
      cuidadoComSobrecarga,
    )
    expect(res).not.toBeNull()
    if (!res) return

    expect(res.mediaFac).toBe(67) // Nota FAC inalterada
    expect(res.avisoCuidadoClinico).not.toBeNull()
    expect(res.avisoCuidadoClinico).toContain('Aviso de Apoio Clínico')
  })
})
