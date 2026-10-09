import { describe, it, expect } from 'vitest'
import {
  calcularLacuna,
  calcularAlavanca,
  calcularForca,
  calcularMetricasSkigai,
  calcularMetricasFontes,
  gerarResumoPorRegras,
  processarCalculoSkigaiCompleto,
} from './skigaiEngine'
import { NecessidadeItem, FonteItem, SkigaiDataModel } from '@/types/skigai'

describe('SKIGAI Engine - Vetores Canônicos Obrigatórios', () => {
  // Vetor A: N=1, I=3, Int=2, H=3 -> lacuna 6, alavanca 2.5, força 3
  it('Vetor A: N=1, I=3, Int=2, H=3 deve resultar em lacuna=6, alavanca=2.5, força=3', () => {
    const lacuna = calcularLacuna(1, 3)
    const alavanca = calcularAlavanca(2, 3)
    const forca = calcularForca(1, 3)

    expect(lacuna).toBe(6)
    expect(alavanca).toBe(2.5)
    expect(forca).toBe(3)
  })

  // Vetor B: N=3, I=3, Int=1, H=1 -> lacuna 0, alavanca 1.0, força 9
  it('Vetor B: N=3, I=3, Int=1, H=1 deve resultar em lacuna=0, alavanca=1.0, força=9', () => {
    const lacuna = calcularLacuna(3, 3)
    const alavanca = calcularAlavanca(1, 1)
    const forca = calcularForca(3, 3)

    expect(lacuna).toBe(0)
    expect(alavanca).toBe(1.0)
    expect(forca).toBe(9)
  })

  // Vetor C: N=0, I=0, Int=3, H=3 -> lacuna 0, alavanca 3.0, força 0
  it('Vetor C: N=0, I=0, Int=3, H=3 deve resultar em lacuna=0, alavanca=3.0, força=0', () => {
    const lacuna = calcularLacuna(0, 0)
    const alavanca = calcularAlavanca(3, 3)
    const forca = calcularForca(0, 0)

    expect(lacuna).toBe(0)
    expect(alavanca).toBe(3.0)
    expect(forca).toBe(0)
  })

  // Vetor D: N=2, I=2, Int=0, H=1 -> lacuna 2, alavanca 0.5, força 4
  it('Vetor D: N=2, I=2, Int=0, H=1 deve resultar em lacuna=2, alavanca=0.5, força=4', () => {
    const lacuna = calcularLacuna(2, 2)
    const alavanca = calcularAlavanca(0, 1)
    const forca = calcularForca(2, 2)

    expect(lacuna).toBe(2)
    expect(alavanca).toBe(0.5)
    expect(forca).toBe(4)
  })

  // Vetor E: N=0, I=3, Int=3, H=0 -> lacuna 9, alavanca 1.5, força 0
  it('Vetor E: N=0, I=3, Int=3, H=0 deve resultar em lacuna=9, alavanca=1.5, força=0', () => {
    const lacuna = calcularLacuna(0, 3)
    const alavanca = calcularAlavanca(3, 0)
    const forca = calcularForca(0, 3)

    expect(lacuna).toBe(9)
    expect(alavanca).toBe(1.5)
    expect(forca).toBe(0)
  })
})

describe('SKIGAI Engine - Propriedades e Regras de Negócio', () => {
  it('garante que lacuna fica estritamente na faixa de 0 a 9 e alavanca entre 0 e 3', () => {
    for (let n = 0; n <= 3; n++) {
      for (let i = 0; i <= 3; i++) {
        const lacuna = calcularLacuna(n, i)
        expect(lacuna).toBeGreaterThanOrEqual(0)
        expect(lacuna).toBeLessThanOrEqual(9)
      }
    }

    for (let intVal = 0; intVal <= 3; intVal++) {
      for (let h = 0; h <= 3; h++) {
        const alavanca = calcularAlavanca(intVal, h)
        expect(alavanca).toBeGreaterThanOrEqual(0)
        expect(alavanca).toBeLessThanOrEqual(3)
      }
    }
  })

  it('desempate de Recursos seleciona maiores forças com N >= 2, desempata por maior I e ordem estável', () => {
    const nec: NecessidadeItem[] = [
      {
        id: 1,
        nome: 'Satisfação',
        abreviacao: 'Satisfação',
        nutricao: 2,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // Força = 6, I=3
      {
        id: 2,
        nome: 'Crescimento',
        abreviacao: 'Crescimento',
        nutricao: 3,
        importancia: 2,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // Força = 6, I=2
      {
        id: 3,
        nome: 'Futuro',
        abreviacao: 'Futuro',
        nutricao: 3,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // Força = 9, I=3
      {
        id: 4,
        nome: 'Ressonância',
        abreviacao: 'Ressonância',
        nutricao: 1,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // N < 2 -> NÃO entra
      {
        id: 5,
        nome: 'Liberdade',
        abreviacao: 'Liberdade',
        nutricao: 2,
        importancia: 1,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // Força = 2
      {
        id: 6,
        nome: 'Autorrealização',
        abreviacao: 'Autorrealização',
        nutricao: 0,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
      {
        id: 7,
        nome: 'Significado',
        abreviacao: 'Significado',
        nutricao: 2,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // Força = 6, I=3 (empata com id 1)
    ]

    const res = calcularMetricasSkigai(nec)
    expect(res.recursos).toHaveLength(2)
    // 1º lugar: Futuro (Força 9)
    expect(res.recursos[0].id).toBe(3)
    // 2º lugar: Satisfação (Força 6, I=3, id 1 ganha de Crescimento por I maior e de Significado por id menor)
    expect(res.recursos[1].id).toBe(1)
  })

  it('desempate de Prioridades seleciona maiores lacunas >= 3, desempata por alavanca, depois I, depois ordem', () => {
    const nec: NecessidadeItem[] = [
      {
        id: 1,
        nome: 'Satisfação',
        abreviacao: 'Satisfação',
        nutricao: 0,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // Lacuna = 9, Alavanca = 1.0, I=3
      {
        id: 2,
        nome: 'Crescimento',
        abreviacao: 'Crescimento',
        nutricao: 1,
        importancia: 3,
        interesse: 3,
        habilidade: 3,
        reflexao: '',
      }, // Lacuna = 6, Alavanca = 3.0, I=3
      {
        id: 3,
        nome: 'Futuro',
        abreviacao: 'Futuro',
        nutricao: 1,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      }, // Lacuna = 6, Alavanca = 1.0, I=3
      {
        id: 4,
        nome: 'Ressonância',
        abreviacao: 'Ressonância',
        nutricao: 2,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      }, // Lacuna = 3, Alavanca = 2.0
      {
        id: 5,
        nome: 'Liberdade',
        abreviacao: 'Liberdade',
        nutricao: 3,
        importancia: 3,
        interesse: 3,
        habilidade: 3,
        reflexao: '',
      }, // Lacuna = 0 (< 3 não entra)
      {
        id: 6,
        nome: 'Autorrealização',
        abreviacao: 'Autorrealização',
        nutricao: 3,
        importancia: 2,
        interesse: 3,
        habilidade: 3,
        reflexao: '',
      }, // Lacuna = 0
      {
        id: 7,
        nome: 'Significado',
        abreviacao: 'Significado',
        nutricao: 3,
        importancia: 1,
        interesse: 3,
        habilidade: 3,
        reflexao: '',
      }, // Lacuna = 0
    ]

    const res = calcularMetricasSkigai(nec)
    expect(res.prioridades).toHaveLength(3)
    expect(res.prioridades[0].id).toBe(1) // Lacuna 9
    expect(res.prioridades[1].id).toBe(2) // Lacuna 6, Alavanca 3.0 (vence Futuro com Alavanca 1.0)
    expect(res.prioridades[2].id).toBe(3) // Lacuna 6, Alavanca 1.0
  })

  it('caso de borda: sem nenhuma N >= 2 retorna Recursos vazio sem crash', () => {
    const nec: NecessidadeItem[] = [
      {
        id: 1,
        nome: 'Satisfação',
        abreviacao: 'Satisfação',
        nutricao: 1,
        importancia: 3,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
      {
        id: 2,
        nome: 'Crescimento',
        abreviacao: 'Crescimento',
        nutricao: 0,
        importancia: 2,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
      {
        id: 3,
        nome: 'Futuro',
        abreviacao: 'Futuro',
        nutricao: 1,
        importancia: 2,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
      {
        id: 4,
        nome: 'Ressonância',
        abreviacao: 'Ressonância',
        nutricao: 0,
        importancia: 1,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
      {
        id: 5,
        nome: 'Liberdade',
        abreviacao: 'Liberdade',
        nutricao: 1,
        importancia: 1,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
      {
        id: 6,
        nome: 'Autorrealização',
        abreviacao: 'Autorrealização',
        nutricao: 0,
        importancia: 1,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
      {
        id: 7,
        nome: 'Significado',
        abreviacao: 'Significado',
        nutricao: 1,
        importancia: 1,
        interesse: 1,
        habilidade: 1,
        reflexao: '',
      },
    ]

    const res = calcularMetricasSkigai(nec)
    expect(res.recursos).toHaveLength(0)
    expect(res.cuidadoTotalGatilho).toBe(true) // todas <= 1
  })

  it('caso de borda: sem nenhuma lacuna >= 3 retorna Prioridades vazio sem crash', () => {
    const nec: NecessidadeItem[] = [
      {
        id: 1,
        nome: 'Satisfação',
        abreviacao: 'Satisfação',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 2,
        nome: 'Crescimento',
        abreviacao: 'Crescimento',
        nutricao: 2,
        importancia: 2,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      }, // lacuna 2
      {
        id: 3,
        nome: 'Futuro',
        abreviacao: 'Futuro',
        nutricao: 3,
        importancia: 2,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 4,
        nome: 'Ressonância',
        abreviacao: 'Ressonância',
        nutricao: 3,
        importancia: 1,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 5,
        nome: 'Liberdade',
        abreviacao: 'Liberdade',
        nutricao: 2,
        importancia: 1,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 6,
        nome: 'Autorrealização',
        abreviacao: 'Autorrealização',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 7,
        nome: 'Significado',
        abreviacao: 'Significado',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
    ]

    const res = calcularMetricasSkigai(nec)
    expect(res.prioridades).toHaveLength(0)
  })

  it('ativa gatilho de cuidado quando Ressonância (4) e Liberdade (5) têm N <= 1', () => {
    const necComCuidado: NecessidadeItem[] = [
      {
        id: 1,
        nome: 'Satisfação',
        abreviacao: 'Satisfação',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 2,
        nome: 'Crescimento',
        abreviacao: 'Crescimento',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 3,
        nome: 'Futuro',
        abreviacao: 'Futuro',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 4,
        nome: 'Ressonância',
        abreviacao: 'Ressonância',
        nutricao: 1,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 5,
        nome: 'Liberdade',
        abreviacao: 'Liberdade',
        nutricao: 0,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 6,
        nome: 'Autorrealização',
        abreviacao: 'Autorrealização',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
      {
        id: 7,
        nome: 'Significado',
        abreviacao: 'Significado',
        nutricao: 3,
        importancia: 3,
        interesse: 2,
        habilidade: 2,
        reflexao: '',
      },
    ]

    const res = calcularMetricasSkigai(necComCuidado)
    expect(res.cuidadoGatilho).toBe(true)
    expect(res.cuidadoTotalGatilho).toBe(false)
  })

  it('cálculo de fontes: soma de rendimentos zero retorna null e NUNCA NaN', () => {
    const fontesZero: FonteItem[] = [
      {
        id: '1',
        nome: 'Atividade sem rendimento',
        tipo: 'atividade',
        rendimento: 0,
        fragilidade: 3,
        alimenta: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        id: '2',
        nome: 'Outra fonte',
        tipo: 'pessoa',
        rendimento: 0,
        fragilidade: 1,
        alimenta: [0, 0, 0, 0, 0, 0, 0],
      },
    ]

    const metricas = calcularMetricasFontes(fontesZero)
    expect(metricas.concentracao).toBeNull()
    expect(metricas.fragilidadeMedia).toBeNull()
    expect(isNaN(metricas.concentracao as any)).toBe(false)
    expect(isNaN(metricas.fragilidadeMedia as any)).toBe(false)
    expect(metricas.necessidadesSemFonte).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('cálculo de fontes com dados reais calcula concentração e fragilidade ponderada', () => {
    const fontes: FonteItem[] = [
      {
        id: '1',
        nome: 'Consultório Particular',
        tipo: 'atividade',
        rendimento: 3,
        fragilidade: 1,
        alimenta: [2, 1, 3, 2, 2, 3, 2],
      },
      {
        id: '2',
        nome: 'Supervisão Clínica',
        tipo: 'atividade',
        rendimento: 1,
        fragilidade: 2,
        alimenta: [1, 2, 0, 1, 0, 1, 1],
      },
    ]

    const metricas = calcularMetricasFontes(fontes)
    // Soma = 4. Maior = 3. Concentração = 3/4 = 75%
    expect(metricas.concentracao).toBe(75)
    // Fragilidade ponderada = (3*1 + 1*2) / 4 = 5/4 = 1.25 -> round 1.3
    expect(metricas.fragilidadeMedia).toBe(1.3)
    // Alimenta >= 2: fonte 1 alimenta 1(2), 3(3), 4(2), 5(2), 6(3), 7(2). Necessidade 2 tem alimenta [1, 2], fonte 2 alimenta 2 com valor 2!
    // Então nenhuma ficou sem fonte
    expect(metricas.necessidadesSemFonte).toHaveLength(0)
  })
})
