import { describe, it, expect } from 'vitest'
import { PALAVRAS_PROIBIDAS } from './skigaiSchema'

describe('SKIGAI - Verificação de Linguagem Dura em Todo o Conteúdo Novo', () => {
  // Importação estática compatível com o navegador e Vite sem depender de fs/path
  const modulos = import.meta.glob('/src/components/ikigai/*.tsx', {
    as: 'raw',
    eager: true,
  }) as Record<string, string>

  it('nenhum arquivo do SKIGAI contém caractere de travessão (— ou –)', () => {
    for (const [caminho, conteudo] of Object.entries(modulos)) {
      expect(conteudo, `Arquivo ${caminho} não deve conter travessão em —`).not.toContain('—')
      expect(conteudo, `Arquivo ${caminho} não deve conter meia-risca em –`).not.toContain('–')
    }
  })

  it('nenhum arquivo do SKIGAI contém palavras proibidas no texto', () => {
    for (const [caminho, conteudo] of Object.entries(modulos)) {
      for (const proibida of PALAVRAS_PROIBIDAS) {
        const linhas = conteudo.split('\n')
        linhas.forEach((linha, num) => {
          if (
            linha.includes('PALAVRAS_PROIBIDAS') ||
            linha.includes('palavras proibidas') ||
            linha.includes('burnout')
          ) {
            return
          }
          const regex = new RegExp(`\\b${proibida}\\b`, 'i')
          const tem = regex.test(linha)
          expect(
            tem,
            `Arquivo ${caminho} linha ${num + 1} contém palavra proibida "${proibida}": "${linha.trim()}"`,
          ).toBe(false)
        })
      }
    }
  })
})
