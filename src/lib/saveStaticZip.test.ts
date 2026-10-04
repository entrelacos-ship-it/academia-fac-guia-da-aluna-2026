// Teste canônico do piso mínimo R$ 180,50 e validação adicional de isolamento
import { describe, it, expect } from 'vitest'
import { validateSection14TestCase } from './testCaseValidation'

describe('Validação Canônica de Regras Financeiras FAC', () => {
  it('garante que o piso canônico é exatamente R$ 180,50', () => {
    const passed = validateSection14TestCase()
    expect(passed).toBe(true)
  })
})
