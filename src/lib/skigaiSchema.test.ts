import { describe, it, expect } from 'vitest'
import {
  criarEstadoInicialSkigai,
  exportarCapsulaSkigai,
  importarCapsulaOuJson,
  validarEImportarSkigaiJson,
  exportarJsonCompativelSkill,
  sanitizarTextoSemTravessao,
  validarTextoConformidade,
  PALAVRAS_PROIBIDAS,
} from './skigaiSchema'

describe('SKIGAI Schema e Regras de Troca / Validações', () => {
  it('cria estado inicial completo com 7 necessidades e 5 pilares de Mogi', () => {
    const estado = criarEstadoInicialSkigai()
    expect(estado.versao).toBe('1.0')
    expect(estado.tipo).toBe('mapa')
    expect(estado.necessidades).toHaveLength(7)
    expect(estado.pilares).toHaveLength(5)
    expect(estado.plano).toHaveLength(4)
  })

  it('exporta e importa JSON preservando fidelidade (ida e volta)', () => {
    const estado = criarEstadoInicialSkigai()
    estado.nome = 'Psicóloga Helena'
    estado.termometro = 8
    estado.necessidades[0].nutricao = 2
    estado.necessidades[0].importancia = 3

    const json = exportarJsonCompativelSkill(estado)
    const importado = validarEImportarSkigaiJson(json)

    expect(importado.sucesso).toBe(true)
    expect(importado.dados?.nome).toBe('Psicóloga Helena')
    expect(importado.dados?.termometro).toBe(8)
    expect(importado.dados?.necessidades[0].nutricao).toBe(2)
    expect(importado.dados?.necessidades[0].importancia).toBe(3)
  })

  it('exporta e importa Cápsula SKIGAI1|F{n}|{json}', () => {
    const estado = criarEstadoInicialSkigai()
    estado.app.faseAtual = 3
    estado.nome = 'Dra. Beatriz'

    const capsula = exportarCapsulaSkigai(estado)
    expect(capsula.startsWith('SKIGAI1|F3|')).toBe(true)

    const resultado = importarCapsulaOuJson(capsula)
    expect(resultado.sucesso).toBe(true)
    expect(resultado.faseCapsula).toBe(3)
    expect(resultado.dados?.nome).toBe('Dra. Beatriz')
    expect(resultado.dados?.app.faseAtual).toBe(3)
  })

  it('rejeita JSON contendo tags ou caracteres < e >', () => {
    const estado = criarEstadoInicialSkigai()
    const json = JSON.stringify(estado)
    const jsonMalicioso = json.replace(
      '"tipo": "mapa"',
      '"tipo": "mapa", "xss": "<script>alert(1)</script>"',
    )

    const resultado = validarEImportarSkigaiJson(jsonMalicioso)
    expect(resultado.sucesso).toBe(false)
    expect(resultado.erro).toContain('não permitidos')
  })

  it('rejeita valores fora de faixa ou não inteiros na nutrição/importância', () => {
    const estado = criarEstadoInicialSkigai() as any
    estado.necessidades[0].nutricao = 4 // limite é 3
    const jsonInvalido = JSON.stringify(estado)

    const resultado = validarEImportarSkigaiJson(jsonInvalido)
    expect(resultado.sucesso).toBe(false)
    expect(resultado.erro).toContain('fora da faixa')
  })

  it('rejeita arquivo com tamanho superior a 256 KB', () => {
    const estado = criarEstadoInicialSkigai()
    // Injeta texto de 300 KB
    const bigString = 'x'.repeat(300 * 1024)
    estado.carta = bigString
    const jsonGigante = JSON.stringify(estado)

    const resultado = validarEImportarSkigaiJson(jsonGigante)
    expect(resultado.sucesso).toBe(false)
    expect(resultado.erro).toContain('256 KB')
  })
})

describe('SKIGAI - Regras de Voz e Linguagem Proibida', () => {
  it('remove travessões substituindo por vírgula acolhedora', () => {
    const textoComTravessao = 'O mapa — que não é avaliação — serve como bússola interna.'
    const limpo = sanitizarTextoSemTravessao(textoComTravessao)
    expect(limpo).not.toContain('—')
    expect(limpo).toBe('O mapa, que não é avaliação, serve como bússola interna.')
  })

  it('detecta palavras proibidas como descubra, incrível, transformador, jornada, colapso, burnout', () => {
    for (const p of PALAVRAS_PROIBIDAS) {
      const texto = `Venha ter uma ${p} na sua clínica.`
      const checagem = validarTextoConformidade(texto)
      expect(checagem.valido).toBe(false)
      expect(checagem.motivos[0]).toContain(p)
    }

    const textoValido = 'Um momento para respirar e acolher o desgaste com cuidado e ética.'
    expect(validarTextoConformidade(textoValido).valido).toBe(true)
  })
})
