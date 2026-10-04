import { describe, it, expect } from 'vitest'
import {
  parseRetratoDeAutoriaText,
  diagnoseEmptyIntersections,
  countSentences,
  sanitizeTypography,
} from './ikigaiEngine'
import { FICTITIOUS_FACILITATOR_EXAMPLE, INITIAL_EMPTY_IKIGAI_STATE } from '@/config/ikigaiContent'

describe('ikigaiEngine', () => {
  it('remove travessões longos garantindo regra de pontuação do app', () => {
    const raw = 'O propósito não é sacrifício — é serviço com sentido -- e dignidade.'
    const sanitized = sanitizeTypography(raw)
    expect(sanitized).not.toContain('—')
    expect(sanitized).not.toContain('--')
    expect(sanitized).toContain(', ')
  })

  it('faz parse com sucesso de texto estruturado por títulos do Retrato de Autoria', () => {
    const sample = `
Matéria-prima para o seu painel IKIGAI

Círculo 1 · O que eu amo fazer
- Escutar mulheres em transição
- Conduzir rodas de acolhimento
- Ler artigos sobre autonomia

Círculo 2 · No que eu sou boa
- Devoluções clínicas claras
- Mediação serena em conflitos
- Organização de processos terapêuticos

Círculo 3 · Do que o mundo precisa
- Cuidado para mães sobrecarregadas
- Combate à medicalização da vida
- Espaços seguros de escuta

Círculo 4 · Pelo que posso ser remunerada com dignidade
- Sessão individual particular
- Grupos terapêuticos contratados
- Supervisão clínica
`
    const parsed = parseRetratoDeAutoriaText(sample)
    expect(parsed.success).toBe(true)
    expect(parsed.matchedBySection).toBe(true)
    expect(parsed.circles.love.length).toBe(3)
    expect(parsed.circles.goodAt.length).toBe(3)
    expect(parsed.circles.worldNeeds.length).toBe(3)
    expect(parsed.circles.paidFor.length).toBe(3)
    expect(parsed.totalItems).toBe(12)
  })

  it('coloca tudo na bandeja se o texto não contiver as seções separadas', () => {
    const rawUnstructured = `
- Atender adolescentes em sofrimento
- Capacidade de criar vínculo rápido
- Necessidade de apoio para jovens vestibulandos
- Consultas particulares com contrato
- Supervisão semanal
`
    const parsed = parseRetratoDeAutoriaText(rawUnstructured)
    expect(parsed.success).toBe(true)
    expect(parsed.matchedBySection).toBe(false)
    expect(parsed.tray.length).toBe(5)
    expect(parsed.circles.love.length).toBe(0)
  })

  it('diagnostica vazios conforme PRD para "Paixão sem Profissão"', () => {
    const testState = JSON.parse(JSON.stringify(FICTITIOUS_FACILITATOR_EXAMPLE))
    // Mantém Paixão preenchida, mas esvazia Profissão
    testState.intersections.profession = { text: '', notFound: true }

    const diag = diagnoseEmptyIntersections(testState)
    expect(diag.emptyKeys).toContain('profession')
    expect(diag.combinationKey).toBe('passion_without_profession')
    expect(diag.primaryReflection.title).toBe('Paixão sem Profissão')
    expect(diag.primaryReflection.body).toContain(
      'Você ama e faz bem, mas ainda não é sustentada por isso',
    )
  })

  it('conta sentenças corretamente para a declaração de missão', () => {
    const oneSentence = 'Eu ajudo psicólogas a precificarem sua clínica com dignidade.'
    const twoSentences =
      'Eu ajudo psicólogas a precificarem sua clínica com dignidade. Faço isso através de método claro e acolhedor.'
    const threeSentences = 'Primeira frase. Segunda frase! Terceira frase?'

    expect(countSentences(oneSentence)).toBe(1)
    expect(countSentences(twoSentences)).toBe(2)
    expect(countSentences(threeSentences)).toBe(3)
  })
})
