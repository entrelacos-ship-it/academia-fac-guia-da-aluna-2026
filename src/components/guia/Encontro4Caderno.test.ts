import { describe, it, expect, beforeEach } from 'vitest'
import {
  ETAPAS_ENCONTRO_4,
  TOTAL_ITENS_CHECKLIST,
  CHECKLIST_ETAPA_0,
  CHECKLIST_ETAPA_2,
  CHECKLIST_ETAPA_3,
  CHECKLIST_ETAPA_4,
  CHECKLIST_ETAPA_5,
} from '@/components/guia/Encontro4Caderno'
import {
  isGptLinkAtivo,
  GPT_BIO_MANIFESTO,
  GPT_ARQUITETA_VITRINE,
  GPT_ROTEIRISTA_WHATSAPP,
} from '@/components/guia/encontro4Shared'
import {
  PROMPT_BIO_MANIFESTO,
  PROMPT_ARQUITETA_VITRINE,
  PROMPT_ROTEIRISTA_WHATSAPP,
} from '@/config/encontro4Content'

describe('Encontro 4: Canais (Facebook, Instagram, WhatsApp Business)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('possui as 8 etapas estruturadas (etapas 0 a 7) com tempos estimados', () => {
    expect(ETAPAS_ENCONTRO_4).toHaveLength(8)
    expect(ETAPAS_ENCONTRO_4[0]).toMatchObject({
      id: 'etapa-0',
      numero: '0',
      titulo: 'Antes de começar',
      tempo: '3 min',
    })
    expect(ETAPAS_ENCONTRO_4[1]).toMatchObject({
      id: 'etapa-1',
      numero: '1',
      titulo: 'A IA trabalha para você',
      tempo: '15 min',
    })
    expect(ETAPAS_ENCONTRO_4[2]).toMatchObject({
      id: 'etapa-2',
      numero: '2',
      titulo: 'Facebook: perfil pessoal e Página profissional',
      tempo: '15 min',
    })
    expect(ETAPAS_ENCONTRO_4[3]).toMatchObject({
      id: 'etapa-3',
      numero: '3',
      titulo: 'Instagram: conta profissional e vitrine',
      tempo: '30 min',
    })
    expect(ETAPAS_ENCONTRO_4[4]).toMatchObject({
      id: 'etapa-4',
      numero: '4',
      titulo: 'Conectar Instagram e Facebook',
      tempo: '5 min',
    })
    expect(ETAPAS_ENCONTRO_4[5]).toMatchObject({
      id: 'etapa-5',
      numero: '5',
      titulo: 'WhatsApp Business',
      tempo: '25 min',
    })
    expect(ETAPAS_ENCONTRO_4[6]).toMatchObject({
      id: 'etapa-6',
      numero: '6',
      titulo: 'Todos os prompts (consulta)',
    })
    expect(ETAPAS_ENCONTRO_4[7]).toMatchObject({
      id: 'etapa-7',
      numero: '7',
      titulo: 'Checklist final e teste dos 5 segundos',
      tempo: '5 min',
    })
  })

  it('contabiliza o total de itens de checklist nas etapas', () => {
    const soma =
      CHECKLIST_ETAPA_0.length +
      CHECKLIST_ETAPA_2.length +
      CHECKLIST_ETAPA_3.length +
      CHECKLIST_ETAPA_4.length +
      CHECKLIST_ETAPA_5.length
    expect(TOTAL_ITENS_CHECKLIST).toBe(soma)
    expect(TOTAL_ITENS_CHECKLIST).toBeGreaterThan(0)
  })

  it('mantém os botões de GPT ocultos enquanto os links estiverem em placeholder', () => {
    expect(isGptLinkAtivo(GPT_BIO_MANIFESTO)).toBe(false)
    expect(isGptLinkAtivo(GPT_ARQUITETA_VITRINE)).toBe(false)
    expect(isGptLinkAtivo(GPT_ROTEIRISTA_WHATSAPP)).toBe(false)
  })

  it('os 3 prompts essenciais estão definidos e configurados', () => {
    expect(PROMPT_BIO_MANIFESTO).toContain('Bio do Manifesto')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('Arquiteta da Vitrine')
    expect(PROMPT_ROTEIRISTA_WHATSAPP).toContain('Roteirista do WhatsApp')
  })

  it('perfil fictício das ilustrações e textos usa Marina Alves | Psicóloga Online', () => {
    expect(PROMPT_BIO_MANIFESTO).toContain('Marina Alves')
    expect(PROMPT_BIO_MANIFESTO).toContain('@marinaalves.psi')
  })

  it('nenhum texto das etapas ou prompts utiliza o caractere travessão (—)', () => {
    const todosTextos = [
      ...ETAPAS_ENCONTRO_4.map((e) => e.titulo),
      PROMPT_BIO_MANIFESTO,
      PROMPT_ARQUITETA_VITRINE,
      PROMPT_ROTEIRISTA_WHATSAPP,
      ...CHECKLIST_ETAPA_2,
      ...CHECKLIST_ETAPA_3,
    ].join(' ')
    expect(todosTextos).not.toContain('—')
  })

  it('valida os checklists exatos da Etapa 2 e Etapa 3', () => {
    expect(CHECKLIST_ETAPA_2).toEqual([
      'Perfil pessoal com autenticação de dois fatores',
      'Página criada com nome, categoria e bio',
      'Foto de perfil e capa',
      'Contato preenchido',
      'Botão de WhatsApp ativo',
    ])

    expect(CHECKLIST_ETAPA_3).toEqual([
      'Conta profissional, categoria Psicólogo',
      'Foto com rosto visível',
      'Campo Nome com nome e palavra-chave',
      '@ simples de falar',
      'Bio em três linhas com CRP',
      'Primeiro link levando ao WhatsApp',
      'Seis destaques com capas padronizadas',
      'Três posts fixados',
      'Autenticação de dois fatores ativa',
    ])
  })
})
