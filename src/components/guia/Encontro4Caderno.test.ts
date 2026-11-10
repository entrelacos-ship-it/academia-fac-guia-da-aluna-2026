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
    expect(TOTAL_ITENS_CHECKLIST).toBe(7 + 5 + 9 + 3 + 7)
  })

  it('mantém os botões de GPT ocultos enquanto os links estiverem em placeholder', () => {
    expect(isGptLinkAtivo(GPT_BIO_MANIFESTO)).toBe(false)
    expect(isGptLinkAtivo(GPT_ARQUITETA_VITRINE)).toBe(false)
    expect(isGptLinkAtivo(GPT_ROTEIRISTA_WHATSAPP)).toBe(false)
  })

  it('os 3 prompts essenciais estão declarados como constantes aguardando conteúdo oficial', () => {
    expect(typeof PROMPT_BIO_MANIFESTO).toBe('string')
    expect(typeof PROMPT_ARQUITETA_VITRINE).toBe('string')
    expect(typeof PROMPT_ROTEIRISTA_WHATSAPP).toBe('string')
  })

  it('nenhum texto das etapas ou itens de checklist utiliza o caractere travessão (—)', () => {
    // A regra de zero travessões vale para os textos redigidos para a aula e checklists.
    // O PROMPT_BIO_MANIFESTO é conteúdo oficial verbatim da usuária (mantém pontuação original).
    const textosRedigidosAula = [
      ...ETAPAS_ENCONTRO_4.map((e) => e.titulo),
      PROMPT_ARQUITETA_VITRINE,
      PROMPT_ROTEIRISTA_WHATSAPP,
      ...CHECKLIST_ETAPA_0.map((i) => i.texto),
      ...CHECKLIST_ETAPA_2.map((i) => i.texto),
      ...CHECKLIST_ETAPA_3.map((i) => i.texto),
      ...CHECKLIST_ETAPA_4.map((i) => i.texto),
      ...CHECKLIST_ETAPA_5.map((i) => i.texto),
    ].join(' ')
    expect(textosRedigidosAula).not.toContain('—')
    expect(textosRedigidosAula).not.toContain('–')
  })

  it('PROMPT_BIO_MANIFESTO contém o texto oficial verbatim completo', () => {
    expect(PROMPT_BIO_MANIFESTO).toContain('### 🎯 OBJETIVO')
    expect(PROMPT_BIO_MANIFESTO).toContain('### 🧠 MINHA EXPERTISE')
    expect(PROMPT_BIO_MANIFESTO).toContain('### ✍️ FORMATO PADRÃO DA BIOGRAFIA')
    expect(PROMPT_BIO_MANIFESTO).toContain('### 🧪 EXEMPLO DE BIO:')
    expect(PROMPT_BIO_MANIFESTO).toContain(
      '### ✅ APÓS A ENTREGA DAS 3 BIOGRAFIAS, SEMPRE EXIBO ESTAS OPÇÕES:',
    )
    expect(PROMPT_BIO_MANIFESTO).toContain(
      '1 - Gostou de alguma BIOGRAFIA ESPECÍFICA dos 3 exemplos acima?',
    )
    expect(PROMPT_BIO_MANIFESTO).toContain(
      '4 - Vamos trabalhar um refinamento na BIOGRAFIA (Selecione a opção)',
    )
    expect(PROMPT_BIO_MANIFESTO).toContain('### 💬 AGORA É COM VOCÊ!')
    expect(PROMPT_BIO_MANIFESTO).toContain('Me envie a sua **PROPOSTA DE VALOR**')
  })

  it('valida os checklists exatos de cada etapa', () => {
    expect(CHECKLIST_ETAPA_0.map((i) => i.texto)).toEqual([
      'Meu Manifesto e minha PVU copiados no bloco de notas do celular',
      'Celular com Instagram e WhatsApp atualizados na loja de aplicativos',
      'Computador com o ChatGPT aberto (a conta gratuita funciona, a paga funciona melhor)',
      'Senhas do Instagram e do Facebook, se já tiver conta',
      'Meu número de CRP',
      'O número de celular que vou usar com pacientes',
      'Uma foto minha com o rosto visível, fundo limpo e luz natural',
    ])

    expect(CHECKLIST_ETAPA_2.map((i) => i.texto)).toEqual([
      'Perfil pessoal com autenticação de dois fatores',
      'Página criada com nome, categoria e bio',
      'Foto de perfil e capa',
      'Contato preenchido',
      'Botão de WhatsApp ativo',
    ])

    expect(CHECKLIST_ETAPA_3.map((i) => i.texto)).toEqual([
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

    expect(CHECKLIST_ETAPA_4.map((i) => i.texto)).toEqual([
      'Página conectada ao Instagram',
      'Facebook adicionado à Central de Contas',
      'Compartilhamento automático decidido',
    ])

    expect(CHECKLIST_ETAPA_5.map((i) => i.texto)).toEqual([
      'WhatsApp Business instalado com o número da clínica',
      'Perfil comercial completo',
      'Mensagem de saudação ativa',
      'Mensagem de ausência ativa, com caminho para emergências',
      'Pelo menos 3 respostas rápidas',
      'Quatro etiquetas criadas',
      'Link do WhatsApp atualizado no Instagram e na Página',
    ])
  })
})
