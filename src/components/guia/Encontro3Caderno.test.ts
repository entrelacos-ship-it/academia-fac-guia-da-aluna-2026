import { describe, it, expect, beforeEach } from 'vitest'
import {
  INITIAL_CARTAO_STATE,
  INITIAL_CHECKLIST_E3,
  SECOES_ENCONTRO_3,
} from '@/components/guia/Encontro3Caderno'
import { ENCONTRO_3_CONTENT } from '@/config/guiaContent'

describe('Encontro 3: Princípios da Sustentabilidade Financeira da Clínica', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('possui 7 seções estruturadas no caderno do Encontro 3', () => {
    expect(SECOES_ENCONTRO_3).toHaveLength(7)
    expect(SECOES_ENCONTRO_3[0].label).toBe('Visão geral')
    expect(SECOES_ENCONTRO_3[1].label).toBe('Roteiro de 90 min')
    expect(SECOES_ENCONTRO_3[2].label).toBe('Os 7 Princípios em Slides')
    expect(SECOES_ENCONTRO_3[3].label).toBe('Atividade 1: Meu piso')
    expect(SECOES_ENCONTRO_3[4].label).toBe('Laboratório: Leitura ao vivo')
    expect(SECOES_ENCONTRO_3[5].label).toBe('Atividade 2: Cartão de Preço')
    expect(SECOES_ENCONTRO_3[6].label).toBe('Combinado & Plano B')
  })

  it('estado inicial do cartão de preço e checklist está limpo', () => {
    expect(INITIAL_CARTAO_STATE.piso).toBe('')
    expect(INITIAL_CARTAO_STATE.precoPraticado).toBe('')
    expect(INITIAL_CHECKLIST_E3.postarGrupo).toBe(false)
    expect(INITIAL_CHECKLIST_E3.conferirCustos).toBe(false)
    expect(INITIAL_CHECKLIST_E3.confirmarContador).toBe(false)
  })

  it('contém exatamente 11 slides verbatim na teoria com a fórmula no Slide 6 e exemplo no Slide 7', () => {
    expect(ENCONTRO_3_CONTENT.slides).toHaveLength(11)
    expect(ENCONTRO_3_CONTENT.slides[0].titulo).toContain('Slide 1 · Abertura')
    expect(ENCONTRO_3_CONTENT.slides[5].isFormula).toBe(true)
    expect(ENCONTRO_3_CONTENT.slides[5].titulo).toContain('Slide 6 · A fórmula do piso')
    expect(ENCONTRO_3_CONTENT.slides[6].isExemploCalculado).toBe(true)
    expect(ENCONTRO_3_CONTENT.slides[6].tabelaExemplo).toHaveLength(8)
    expect(ENCONTRO_3_CONTENT.slides[10].titulo).toContain(
      'Slide 11 · Os sinais de que o preço está errado',
    )
  })

  it('roteiro possui 6 blocos estruturados somando 90 minutos', () => {
    expect(ENCONTRO_3_CONTENT.roteiro).toHaveLength(6)
    expect(ENCONTRO_3_CONTENT.roteiro[0].bloco).toContain('Abertura')
    expect(ENCONTRO_3_CONTENT.roteiro[1].bloco).toContain('Teoria')
    expect(ENCONTRO_3_CONTENT.roteiro[2].bloco).toContain('Atividade 1')
    expect(ENCONTRO_3_CONTENT.roteiro[3].bloco).toContain('Laboratório')
    expect(ENCONTRO_3_CONTENT.roteiro[4].bloco).toContain('Atividade 2')
    expect(ENCONTRO_3_CONTENT.roteiro[5].bloco).toContain('Combinado da semana')
  })

  it('prompt verbatim para o ChatGPT possui as 4 perguntas éticas e realistas', () => {
    const prompt = ENCONTRO_3_CONTENT.atividade2.testeChatGPT.promptTemplate
    expect(prompt).toContain('consultora de sustentabilidade financeira para psicólogas')
    expect(prompt).toContain(
      '1. Me diga, com franqueza, se a minha regra protege a minha sustentabilidade ou deixa brechas.',
    )
    expect(prompt).toContain(
      '2. Aponte qual item da regra tem mais risco de eu mesma não cumprir, e por quê.',
    )
    expect(prompt).toContain(
      '3. Se meu preço atual estiver abaixo do piso, sugira um plano de transição em até 3 etapas, sem prejudicar os pacientes atuais.',
    )
    expect(prompt).toContain(
      '4. Escreva uma frase curta, firme e acolhedora para eu comunicar meu valor quando alguém perguntar o preço.',
    )
  })

  it('plano B para tecnologia conta com os 4 passos de cálculo no papel', () => {
    expect(ENCONTRO_3_CONTENT.planoB.passos).toHaveLength(4)
    expect(ENCONTRO_3_CONTENT.planoB.limite).toContain('5 minutos')
  })
})
