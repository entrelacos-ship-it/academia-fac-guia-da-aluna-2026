import { describe, it, expect } from 'vitest'
import {
  SISTEMA_CATEGORIAS,
  SISTEMA_ITEMS_EXTRAS,
  SKILL_MENTORA_FAC_ITEM,
} from '@/config/sistemaHubConfig'
import mentoraFacVerbatimContent from '@/assets/skill-97bde.md?raw'

describe('Sistema Hub Categories and Mentora-FAC Skill Config', () => {
  it('contém as categorias esperadas incluindo Aplicativos e Skills', () => {
    const ids = SISTEMA_CATEGORIAS.map((c) => c.id)
    expect(ids).toContain('aplicativos')
    expect(ids).toContain('skills')
    expect(SISTEMA_CATEGORIAS.find((c) => c.id === 'skills')?.label).toBe('Skills')
    expect(SISTEMA_CATEGORIAS.find((c) => c.id === 'aplicativos')?.label).toBe('Aplicativos')
  })

  it('configuração da skill mentora-fac possui metadados corretos e conteúdo verbatim íntegro', () => {
    const mentoraExtra = SISTEMA_ITEMS_EXTRAS['mentora-fac']
    expect(mentoraExtra).toBeDefined()
    expect(mentoraExtra.categoria).toBe('skills')
    expect(mentoraExtra.tipo).toBe('skill')
    expect(mentoraExtra.download).toBeDefined()
    expect(mentoraExtra.download?.filename).toBe('Mentora-FAC.md')
    expect(mentoraExtra.download?.rawContent).toBe(mentoraFacVerbatimContent)
    expect(mentoraExtra.download?.rawContent).toContain('name: "mentora-do-fac"')
    expect(mentoraExtra.download?.rawContent).toContain('# Mentora do FAC')
    expect(mentoraExtra.download?.rawContent).toContain('Você é a Mentora do FAC')
    expect(mentoraExtra.download?.rawContent).toContain('Modo 5: Relatório final em HTML')
  })

  it('SKILL_MENTORA_FAC_ITEM possui exclusividade para alunas e atributos consistentes', () => {
    expect(SKILL_MENTORA_FAC_ITEM.bloco).toBe('sistema')
    expect(SKILL_MENTORA_FAC_ITEM.categoria).toBe('skills')
    expect(SKILL_MENTORA_FAC_ITEM.exclusivo_alunas).toBe(true)
    expect(SKILL_MENTORA_FAC_ITEM.chave).toBe('mentora-fac')
    expect(SKILL_MENTORA_FAC_ITEM.ativo).toBe(true)
  })
})
