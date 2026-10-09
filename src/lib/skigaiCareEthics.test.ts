import { describe, it, expect } from 'vitest'
import { detectarTermoDeRisco, detectarDadoDePaciente } from './skigaiCareEthics'

describe('SKIGAI Protocolo de Cuidado e Ética - Heurísticas Locais', () => {
  it('detecta termos de risco curados no navegador sem rede', () => {
    expect(detectarTermoDeRisco('Hoje sinto vontade de morrer')).toBe(true)
    expect(detectarTermoDeRisco('Não aguento mais viver nesse ritmo')).toBe(true)
    expect(detectarTermoDeRisco('Pensei em me matar ontem')).toBe(true)
    expect(detectarTermoDeRisco('Estou apenas com cansaço do dia')).toBe(false)
  })

  it('detecta dados de terceiros / pacientes suavemente', () => {
    const comCpf = detectarDadoDePaciente('O CPF registrado é 123.456.789-00')
    expect(comCpf.detectado).toBe(true)
    expect(comCpf.motivo).toContain('CPF')

    const comTelefone = detectarDadoDePaciente('Ligar para (11) 98765-4321')
    expect(comTelefone.detectado).toBe(true)
    expect(comTelefone.motivo).toContain('telefone')

    const comNomePaciente = detectarDadoDePaciente('Minha paciente Gabriela disse que...')
    expect(comNomePaciente.detectado).toBe(true)
    expect(comNomePaciente.motivo).toContain('paciente')

    const textoPessoalValido = 'Sinto que meu consultório particular exige muito da minha atenção.'
    expect(detectarDadoDePaciente(textoPessoalValido).detectado).toBe(false)
  })
})
