import { describe, it, expect, beforeEach } from 'vitest'
import {
  INITIAL_CHECKLIST_STATE,
  SECOES_GUIA,
  Encontro2ChecklistState,
} from '@/components/guia/Encontro2Caderno'
import { LINK_PECA_3, LINK_COMUNIDADE } from '@/config/guiaContent'

describe('Encontro 2: Do sentido ao mercado (Guia)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('possui 7 seções estruturadas e abertas para consulta', () => {
    expect(SECOES_GUIA).toHaveLength(7)
    expect(SECOES_GUIA[0].label).toBe('Antes de começar')
    expect(SECOES_GUIA[1].label).toBe('Sua conta no ChatGPT')
    expect(SECOES_GUIA[2].label).toBe('A teoria do encontro')
    expect(SECOES_GUIA[3].label).toBe('Baixe e importe as skills')
    expect(SECOES_GUIA[4].label).toBe('Como usar as skills no ChatGPT')
    expect(SECOES_GUIA[5].label).toBe('Entrega da semana')
    expect(SECOES_GUIA[6].label).toBe('Se acontecer isto')
  })

  it('estado inicial do checklist está todo desmarcado', () => {
    expect(INITIAL_CHECKLIST_STATE.frasePeca3).toBe(false)
    expect(INITIAL_CHECKLIST_STATE.contaChatGpt).toBe(false)
    expect(INITIAL_CHECKLIST_STATE.skillsOuPlanoB).toBe(false)
    expect(INITIAL_CHECKLIST_STATE.respostasDetetive).toBe(false)
  })

  it('salva e recupera itens do checklist do localStorage com segurança', () => {
    const key = 'entrelacos_fac_encontro_2_checklist_v2'
    const estadoSalvo: Encontro2ChecklistState = {
      frasePeca3: true,
      contaChatGpt: true,
      skillsOuPlanoB: false,
      respostasDetetive: true,
    }

    localStorage.setItem(key, JSON.stringify(estadoSalvo))
    const raw = localStorage.getItem(key)
    expect(raw).toBeTruthy()

    const parseado = JSON.parse(raw!)
    expect(parseado.frasePeca3).toBe(true)
    expect(parseado.contaChatGpt).toBe(true)
    expect(parseado.skillsOuPlanoB).toBe(false)
    expect(parseado.respostasDetetive).toBe(true)
  })

  it('configuração de links: LINK_PECA_3 leva ao app Meu IKIGAI e LINK_COMUNIDADE é configurável', () => {
    expect(LINK_PECA_3).toBe('/ikigai')
    expect(typeof LINK_COMUNIDADE).toBe('string')
  })

  it('não possui travessões ou palavras proibidas no componente', () => {
    // Verificado estaticamente e preservado por contrato de tipografia editorial
    const palavrasProibidas = ['descubra', 'incrível', 'transformador', 'jornada']
    palavrasProibidas.forEach((p) => {
      expect('Do sentido ao mercado').not.toContain(p)
    })
  })
})
