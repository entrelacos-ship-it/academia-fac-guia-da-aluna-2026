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
  EXEMPLOS_BIOS_INSPIRACAO,
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

  it('os 3 prompts essenciais estão declarados como constantes e os prompts 1 e 2 possuem texto oficial preenchido', () => {
    expect(typeof PROMPT_BIO_MANIFESTO).toBe('string')
    expect(PROMPT_BIO_MANIFESTO.length).toBeGreaterThan(0)
    expect(typeof PROMPT_ARQUITETA_VITRINE).toBe('string')
    expect(PROMPT_ARQUITETA_VITRINE.length).toBeGreaterThan(0)
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

  it('exemplos de bio de inspiração seguem a estrutura de 3 linhas e respeitam limite de 150 caracteres', () => {
    expect(EXEMPLOS_BIOS_INSPIRACAO.length).toBeGreaterThanOrEqual(4)

    for (const bio of EXEMPLOS_BIOS_INSPIRACAO) {
      // 3 linhas preenchidas
      expect(bio.linha1.trim().length).toBeGreaterThan(0)
      expect(bio.linha2.trim().length).toBeGreaterThan(0)
      expect(bio.linha3.trim().length).toBeGreaterThan(0)

      // Linha 2 contém CRP ou autoridade profissional
      expect(bio.linha2).toContain('CRP 06/000000')

      // Linha 3 contém convite ético
      expect(bio.linha3).toMatch(/👇/)

      // Contagem total com quebras de linha (\n) não ultrapassa 150 caracteres
      const bioCompleta = `${bio.linha1}\n${bio.linha2}\n${bio.linha3}`
      expect(bioCompleta.length).toBeLessThanOrEqual(150)

      // Regra de zero travessões em todo o exemplo
      const textoBio = `${bio.foco} ${bio.publicoAbordagem} ${bioCompleta} ${bio.explicacao}`
      expect(textoBio).not.toContain('—')
      expect(textoBio).not.toContain('–')

      // Ética do método: sem preço, sem promessa de resultado ou cura mágica, sem engajamento apelativo
      expect(textoBio.toLowerCase()).not.toContain('r$')
      expect(textoBio.toLowerCase()).not.toContain('cura')
      expect(textoBio.toLowerCase()).not.toContain('dobre seu engajamento')
      expect(textoBio.toLowerCase()).not.toContain('clique em seguir')
    }
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

  it('PROMPT_ARQUITETA_VITRINE contém o texto oficial verbatim completo sem travessões e com ética CFP', () => {
    expect(PROMPT_ARQUITETA_VITRINE).toContain('### 🎯 OBJETIVO')
    expect(PROMPT_ARQUITETA_VITRINE).toContain(
      'Criar o **perfil completo do Instagram** de uma psicóloga, item por item, em 4 etapas:',
    )
    expect(PROMPT_ARQUITETA_VITRINE).toContain(
      '1. Topo do perfil: foto, @, campo Nome, categoria, bio e link do WhatsApp',
    )
    expect(PROMPT_ARQUITETA_VITRINE).toContain(
      '2. Os seis destaques, com roteiro de stories para cada um',
    )
    expect(PROMPT_ARQUITETA_VITRINE).toContain(
      '3. Os três posts fixados, com título, estrutura e legenda',
    )
    expect(PROMPT_ARQUITETA_VITRINE).toContain(
      '4. A grade: pilares de conteúdo e 9 ideias de posts',
    )
    expect(PROMPT_ARQUITETA_VITRINE).toContain('### 🧠 MINHA EXPERTISE')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('### 📥 O QUE VOCÊ VAI ME ENVIAR')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('### 📐 REGRAS ÉTICAS (OBRIGATÓRIAS)')
    expect(PROMPT_ARQUITETA_VITRINE).toContain(
      '* Nunca incluir preço, promoção, promessa de resultado ou depoimento de paciente',
    )
    expect(PROMPT_ARQUITETA_VITRINE).toContain('* Sempre incluir o CRP onde eu indicar')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('* Seguir a redação vigente das resoluções do CFP')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('### ✍️ COMO VAMOS TRABALHAR (4 ETAPAS)')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('1️⃣ **Etapa 1 · Topo do perfil**')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('2️⃣ **Etapa 2 · Os seis destaques**')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('3️⃣ **Etapa 3 · Os três posts fixados**')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('4️⃣ **Etapa 4 · A grade**')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('### ✅ APÓS CADA ETAPA, SEMPRE EXIBO ESTAS OPÇÕES:')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('1 - Gostei do resultado desta etapa')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('2 - Quero ajustar algo nesta etapa')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('3 - Dê a sua visão apontando o que pode melhorar')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('4 - Vamos para a próxima etapa')
    expect(PROMPT_ARQUITETA_VITRINE).toContain('### 💬 AGORA É COM VOCÊ!')
    expect(PROMPT_ARQUITETA_VITRINE).toContain(
      'Me envie seu **Manifesto**, sua **PVU** e seus dados',
    )
    expect(PROMPT_ARQUITETA_VITRINE).not.toContain('—')
    expect(PROMPT_ARQUITETA_VITRINE).not.toContain('–')
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
