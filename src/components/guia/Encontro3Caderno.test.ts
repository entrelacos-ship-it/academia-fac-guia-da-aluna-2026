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

  it('possui 6 seções estruturadas no caderno do Encontro 3 (sem roteiro e sem plano B)', () => {
    expect(SECOES_ENCONTRO_3).toHaveLength(6)
    expect(SECOES_ENCONTRO_3[0].label).toBe('Visão geral')
    expect(SECOES_ENCONTRO_3[1].label).toBe('Os 7 Princípios em Slides')
    expect(SECOES_ENCONTRO_3[2].label).toBe('Atividade 1: Meu piso')
    expect(SECOES_ENCONTRO_3[3].label).toBe('Laboratório: Leitura ao vivo')
    expect(SECOES_ENCONTRO_3[4].label).toBe('Atividade 2: Cartão de Preço')
    expect(SECOES_ENCONTRO_3[5].label).toBe('Combinado da semana')
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

  it('não expõe roteiro e plano B no conteúdo editorial para alunas', () => {
    expect((ENCONTRO_3_CONTENT as Record<string, unknown>).roteiro).toBeUndefined()
    expect((ENCONTRO_3_CONTENT as Record<string, unknown>).roteiroNota).toBeUndefined()
    expect((ENCONTRO_3_CONTENT as Record<string, unknown>).planoB).toBeUndefined()
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

  it('combinado da semana mantém o checklist de 3 itens e a frase de fechamento', () => {
    expect(ENCONTRO_3_CONTENT.combinado.checklist).toHaveLength(3)
    expect(ENCONTRO_3_CONTENT.combinado.fraseFechamento).toBe(
      'a partir de hoje, vocês não decidem preço pelo medo. Decidem pela conta.',
    )
  })
})
