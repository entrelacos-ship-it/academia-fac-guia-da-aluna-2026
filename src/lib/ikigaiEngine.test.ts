import { describe, it, expect } from 'vitest'
import {
  diagnoseEmptyIntersections,
  countSentences,
  sanitizeTypography,
  generateCleanTextForAI,
  generateCommunityShareText,
} from './ikigaiEngine'
import { FICTITIOUS_FACILITATOR_EXAMPLE, INITIAL_EMPTY_IKIGAI_STATE } from '@/config/ikigaiContent'
import { STEPS_CONFIG } from '@/components/ikigai/IkigaiWorkflow'

describe('ikigaiEngine e Novo Fluxo dos 3 Momentos', () => {
  it('remove travessões longos garantindo regra de pontuação do app', () => {
    const raw = 'O propósito não é sacrifício — é serviço com sentido -- e dignidade.'
    const sanitized = sanitizeTypography(raw)
    expect(sanitized).not.toContain('—')
    expect(sanitized).not.toContain('--')
    expect(sanitized).toContain(', ')
  })

  it('define exatamente os 3 momentos no fluxo pedagógico da aluna (sem etapa de importação do Retrato)', () => {
    expect(STEPS_CONFIG.length).toBe(4) // 0: Boas-vindas, 1: Escrever, 2: Conectar, 3: Painel
    expect(STEPS_CONFIG[0].title).toBe('Boas-vindas')
    expect(STEPS_CONFIG[1].title).toContain('Escrever')
    expect(STEPS_CONFIG[2].title).toContain('Conectar')
    expect(STEPS_CONFIG[3].title).toContain('Painel')
    // Não pode haver etapa ou título citando Retrato de Autoria no fluxo do IKIGAI
    const hasRetratoStep = STEPS_CONFIG.some((s) => s.title.toLowerCase().includes('retrato'))
    expect(hasRetratoStep).toBe(false)
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

  it('gera texto limpo para IA e texto de comunidade preservando formato do painel', () => {
    const aiText = generateCleanTextForAI(FICTITIOUS_FACILITATOR_EXAMPLE)
    expect(aiText).toContain('PAINEL IKIGAI CLÍNICO')
    expect(aiText).toContain('DECLARAÇÃO DE MISSÃO')

    const commText = generateCommunityShareText(FICTITIOUS_FACILITATOR_EXAMPLE)
    expect(commText).toContain('Compartilhando meu IKIGAI')
    expect(commText).toContain('Minha Declaração de Missão')
  })
})
