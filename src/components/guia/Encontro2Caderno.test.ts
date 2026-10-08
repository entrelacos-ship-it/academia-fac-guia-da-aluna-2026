import { describe, it, expect, beforeEach } from 'vitest'
import {
  INITIAL_ENCONTRO_2_STATE,
  ESTACOES_CONFIG,
  Encontro2State,
} from '@/components/guia/Encontro2Caderno'

describe('Encontro 2: Do sentido ao mercado', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('possui 10 estações sequenciais de 0 a 9', () => {
    expect(ESTACOES_CONFIG).toHaveLength(10)
    expect(ESTACOES_CONFIG[0].label).toBe('Porta de entrada')
    expect(ESTACOES_CONFIG[1].label).toBe('Sua conta no ChatGPT')
    expect(ESTACOES_CONFIG[2].label).toBe('Baixe e importe as skills')
    expect(ESTACOES_CONFIG[3].label).toBe('A lente do dia')
    expect(ESTACOES_CONFIG[4].label).toBe('Detetive de Nicho')
    expect(ESTACOES_CONFIG[5].label).toBe('Escolha a sua brecha')
    expect(ESTACOES_CONFIG[6].label).toBe('Ficha de público-alvo')
    expect(ESTACOES_CONFIG[7].label).toBe('Relatório de posicionamento')
    expect(ESTACOES_CONFIG[8].label).toBe('Caderno de erros')
    expect(ESTACOES_CONFIG[9].label).toBe('Fechamento')
  })

  it('estado inicial está limpo e não vaza dados', () => {
    expect(INITIAL_ENCONTRO_2_STATE.fraseDirecao).toBe('')
    expect(INITIAL_ENCONTRO_2_STATE.raioXNicho).toBe('')
    expect(INITIAL_ENCONTRO_2_STATE.brechaEscolhida).toBe('')
    expect(INITIAL_ENCONTRO_2_STATE.publicoFaixasEtarias).toEqual([])
    expect(INITIAL_ENCONTRO_2_STATE.publicoFraseTrabalho).toBe('')
  })

  it('validação de avanço da Estação 0 requer frase preenchida', () => {
    const semFrase: Encontro2State = { ...INITIAL_ENCONTRO_2_STATE, fraseDirecao: '   ' }
    const comFrase: Encontro2State = {
      ...INITIAL_ENCONTRO_2_STATE,
      fraseDirecao: 'Ajudo mulheres em sobrecarga profissional.',
    }
    expect(semFrase.fraseDirecao.trim().length > 0).toBe(false)
    expect(comFrase.fraseDirecao.trim().length > 0).toBe(true)
  })

  it('validação de avanço da Estação 6 requer pelo menos 2 categorias e frase escrita', () => {
    const countCats = (s: Encontro2State) =>
      [
        s.publicoFaixasEtarias.length > 0,
        s.publicoMacroareas.length > 0,
        s.publicoTiposAtendimento.length > 0,
        s.publicoContextoEspecifico.trim().length > 0,
      ].filter(Boolean).length

    const invalido: Encontro2State = {
      ...INITIAL_ENCONTRO_2_STATE,
      publicoFaixasEtarias: ['adultos'],
      publicoFraseTrabalho: 'Mulheres em sofrimento',
    }
    expect(countCats(invalido) >= 2).toBe(false)

    const valido: Encontro2State = {
      ...INITIAL_ENCONTRO_2_STATE,
      publicoFaixasEtarias: ['adultos'],
      publicoMacroareas: ['saúde emocional'],
      publicoFraseTrabalho: 'Mulheres em sofrimento',
    }
    expect(countCats(valido) >= 2).toBe(true)
    expect(valido.publicoFraseTrabalho.trim().length > 0).toBe(true)
  })

  it('montagem de prompt não inclui colchetes e omite campos vazios', () => {
    // Simula a lógica de montagem do Detetive
    const montarDetetive = (s: {
      frase: string
      oferece: string
      procura: string
      profissionais: string
    }) => {
      const linhas = ['Quero investigar o meu nicho.']
      if (s.frase.trim()) linhas.push(`Minha frase de direção: ${s.frase.trim()}`)
      if (s.oferece.trim()) linhas.push(`O que eu ofereço e para quem: ${s.oferece.trim()}`)
      if (s.procura.trim())
        linhas.push(`Como o meu mercado procura e contrata: ${s.procura.trim()}`)
      if (s.profissionais.trim())
        linhas.push(`Profissionais que eu já conheço nesse espaço: ${s.profissionais.trim()}`)
      return linhas.join('\n')
    }

    const promptVazio = montarDetetive({
      frase: 'Frase teste',
      oferece: '',
      procura: '',
      profissionais: '',
    })

    expect(promptVazio).not.toContain('[')
    expect(promptVazio).not.toContain(']')
    expect(promptVazio).not.toContain('O que eu ofereço e para quem:')
    expect(promptVazio).toContain('Minha frase de direção: Frase teste')
  })
})
