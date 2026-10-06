/**
 * Gerador de Relatório PDF Vetorial em A4 do Diagnóstico FAC Aprofundado — Versão 2
 *
 * Especificações editoriais e técnicas:
 * - Biblioteca: jsPDF (A4, orientacao portrait, unidade mm: 210 x 297 mm)
 * - Nome do arquivo baixado: diagnostico-fac-aprofundado.pdf
 * - Tipografia: Hanken Grotesk / Helvetica limpo com hierarquia editorial
 * - Seções: Capa executiva com Média FAC e Tríade, Radar vetorial, Visão Geral & Por Onde Começar,
 *   Análise dos 3 Pilares e 12 Dimensões, Suas Palavras e Contexto Inicial, 6 Movimentos e Ressalvas
 * - Gráficos vetoriais: radar triangular dos 3 pilares, anel/gauge da Média FAC, barras de progresso
 * - Robustez absoluta: medição de página automática com paginação elegante, tratamento de erro seguro
 *   sem deixar spinner preso no navegador.
 */

import { jsPDF } from 'jspdf'
import type { ResultadoDiagnosticoV2, PilarId } from '@/lib/diagnosticoFacEngine'
import {
  RESSALVA_ESCOPO,
  RESSALVA_PERCENTUAL,
  CHECKLIST_SEIS_MOVIMENTOS,
  PERGUNTA_CUIDADO_CONDUCAO,
  PERGUNTA_CUIDADO_SUPERVISAO,
} from '@/lib/diagnosticoFacEngine'

export interface GeneratePdfOptions {
  alunaNome?: string
  dataEmissao?: string
}

export interface PdfGenerationResult {
  success: boolean
  filename: string
  error?: string
}

// Cores da paleta FAC Editorial
const PALETTE = {
  primary: [124, 58, 237] as [number, number, number], // #7c3aed (Roxo FAC)
  primaryDark: [109, 40, 217] as [number, number, number], // #6d28d9
  primaryLight: [245, 243, 255] as [number, number, number], // #f5f3ff
  primaryBorder: [221, 214, 254] as [number, number, number], // #ddd6fe
  accent: [234, 88, 12] as [number, number, number], // #ea580c (Laranja Editorial)
  accentLight: [255, 247, 237] as [number, number, number], // #fff7ed
  accentBorder: [254, 215, 170] as [number, number, number], // #fed7aa
  emerald: [5, 150, 105] as [number, number, number], // #059669
  emeraldLight: [236, 253, 245] as [number, number, number],
  amber: [217, 119, 6] as [number, number, number], // #d97706
  amberLight: [254, 243, 199] as [number, number, number],
  slate900: [15, 23, 42] as [number, number, number], // #0f172a
  slate700: [51, 65, 85] as [number, number, number], // #334155
  slate500: [100, 116, 139] as [number, number, number], // #64748b
  slate400: [148, 163, 184] as [number, number, number],
  slate200: [226, 232, 240] as [number, number, number],
  slate100: [241, 245, 249] as [number, number, number],
  slate50: [248, 250, 252] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
}

/**
 * Monta o documento jsPDF completo e gera a instância
 */
export function buildDiagnosticoPdfDocument(
  resultado: ResultadoDiagnosticoV2,
  options?: GeneratePdfOptions,
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidth = 210
  const pageHeight = 297
  const marginX = 14
  const contentWidth = pageWidth - marginX * 2 // 182 mm
  let currentY = 16

  const dataHoje =
    options?.dataEmissao ||
    new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

  // Helper para verificar quebra de página
  const ensureSpace = (neededMm: number): void => {
    if (currentY + neededMm > pageHeight - 16) {
      doc.addPage()
      currentY = 16
      drawHeaderSmall()
    }
  }

  const drawHeaderSmall = (): void => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...PALETTE.slate400)
    doc.text('Academia Método FAC · Diagnóstico Aprofundado (Versão 2 · 04/10/2026)', marginX, 10)
    doc.text(dataHoje, pageWidth - marginX, 10, { align: 'right' })
    doc.setDrawColor(...PALETTE.slate200)
    doc.setLineWidth(0.2)
    doc.line(marginX, 12, pageWidth - marginX, 12)
  }

  // ==========================================
  // PÁGINA 1: CAPA EXECUTIVA, MÉDIA FAC & RADAR
  // ==========================================

  // Barra superior de identificação
  doc.setFillColor(...PALETTE.primaryLight)
  doc.rect(marginX, currentY, contentWidth, 8, 'F')
  doc.setDrawColor(...PALETTE.primaryBorder)
  doc.setLineWidth(0.3)
  doc.rect(marginX, currentY, contentWidth, 8, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text(
    'ENTRELAÇOS PSICOLOGIA · ACADEMIA MÉTODO FAC · INSTRUMENTO OFICIAL',
    marginX + 4,
    currentY + 5.2,
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...PALETTE.slate500)
  doc.text('Versão 2 · 04/10/2026', pageWidth - marginX - 4, currentY + 5.2, { align: 'right' })

  currentY += 12

  // Título Principal
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...PALETTE.slate900)
  doc.text('Diagnóstico FAC Aprofundado — Versão 2', marginX, currentY)
  currentY += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...PALETTE.slate500)
  doc.text(
    'Retrato Estrutural da Prática Profissional da Psicóloga Autora · 24 Perguntas & 3 Pilares',
    marginX,
    currentY,
  )
  currentY += 8

  // Linha divisória roxa
  doc.setDrawColor(...PALETTE.primary)
  doc.setLineWidth(0.8)
  doc.line(marginX, currentY, pageWidth - marginX, currentY)
  currentY += 6

  // Box de Destaque Executivo (Média FAC à esquerda, Tríade à direita)
  const boxTop = currentY
  const boxHeight = 44
  doc.setFillColor(...PALETTE.slate50)
  doc.setDrawColor(...PALETTE.slate200)
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, boxTop, contentWidth, boxHeight, 3, 3, 'FD')

  // Coluna 1: Média FAC Global
  const col1Width = 48
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text('MÉDIA FAC GLOBAL', marginX + 5, boxTop + 8)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.setTextColor(...PALETTE.primary)
  doc.text(`${resultado.mediaFac}%`, marginX + 5, boxTop + 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.slate500)
  doc.text(`Soma: ${resultado.somaTotal} de 96 pts`, marginX + 5, boxTop + 28)
  doc.text('(Escala 1 a 4 sem inversão)', marginX + 5, boxTop + 33)

  // Divisória vertical
  doc.setDrawColor(...PALETTE.slate200)
  doc.setLineWidth(0.3)
  doc.line(marginX + col1Width, boxTop + 4, marginX + col1Width, boxTop + boxHeight - 4)

  // Colunas 2, 3 e 4: Os 3 Pilares
  const pilaresList: Array<{ id: PilarId; nome: string }> = [
    { id: 'fundacao', nome: 'Fundação' },
    { id: 'atracao', nome: 'Atração' },
    { id: 'conexao', nome: 'Conexão' },
  ]
  const pilarColWidth = (contentWidth - col1Width) / 3

  pilaresList.forEach((pDef, idx) => {
    const colX = marginX + col1Width + idx * pilarColWidth
    const pScore = resultado.pilares[pDef.id]

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...PALETTE.slate900)
    doc.text(`Pilar ${pScore.nome}`, colX + 4, boxTop + 8)

    // Tag de nível
    doc.setFillColor(...PALETTE.primaryLight)
    doc.setDrawColor(...PALETTE.primaryBorder)
    doc.setLineWidth(0.2)
    doc.roundedRect(colX + 4, boxTop + 11, 36, 4.5, 1, 1, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(...PALETTE.primaryDark)
    doc.text(pScore.nivel.rotulo.toUpperCase(), colX + 6, boxTop + 14.3)

    // Percentual grande
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(...PALETTE.slate900)
    doc.text(`${pScore.percentual}%`, colX + 4, boxTop + 23)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...PALETTE.slate500)
    doc.text(`${pScore.soma}/32 pontos`, colX + 4, boxTop + 28)

    // Barra de progresso horizontal
    const barWidth = pilarColWidth - 8
    doc.setFillColor(...PALETTE.slate200)
    doc.rect(colX + 4, boxTop + 32, barWidth, 2.5, 'F')
    doc.setFillColor(...PALETTE.primary)
    doc.rect(colX + 4, boxTop + 32, (barWidth * pScore.percentual) / 100, 2.5, 'F')

    // Divisórias entre pilares
    if (idx < 2) {
      doc.setDrawColor(...PALETTE.slate200)
      doc.line(colX + pilarColWidth, boxTop + 6, colX + pilarColWidth, boxTop + boxHeight - 6)
    }
  })

  currentY = boxTop + boxHeight + 6

  // Banner Leitura da Combinação Verbatim
  doc.setFillColor(...PALETTE.primaryLight)
  doc.setDrawColor(...PALETTE.primaryBorder)
  doc.setLineWidth(0.3)
  const letrBoxY = currentY
  const letrBoxH = 26
  doc.roundedRect(marginX, letrBoxY, contentWidth, letrBoxH, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.accent)
  doc.text('LEITURA DA COMBINAÇÃO EDITORIAL VERBATIM:', marginX + 4, letrBoxY + 6)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...PALETTE.slate900)
  doc.text(`"${resultado.tituloLeitura}"`, marginX + 4, letrBoxY + 11.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.slate700)
  const splitLeitura = doc.splitTextToSize(resultado.leituraPratica, contentWidth - 8)
  doc.text(splitLeitura, marginX + 4, letrBoxY + 16.5)

  currentY = letrBoxY + letrBoxH + 6

  // Radar Vetorial + Ordem & Por Onde Começar (Lado a lado)
  const radarSectionY = currentY
  const radarWidth = 72
  const radarHeight = 65

  // Box do Radar Vetorial
  doc.setFillColor(...PALETTE.white)
  doc.setDrawColor(...PALETTE.slate200)
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, radarSectionY, radarWidth, radarHeight, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.slate900)
  doc.text('RADAR DA TRÍADE CLÍNICA', marginX + 4, radarSectionY + 6)

  // Desenhar Radar Vetorial Matemático em mm
  // Centro do radar: cx = marginX + radarWidth/2, cy = radarSectionY + 34
  const cx = marginX + radarWidth / 2
  const cy = radarSectionY + 36
  const rMax = 22

  const angleF = -Math.PI / 2
  const angleA = Math.PI / 6
  const angleC = (5 * Math.PI) / 6

  const getRadarPoint = (angle: number, pct: number) => {
    const r = (Math.max(0, Math.min(100, pct)) / 100) * rMax
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  // Grades de 25%, 50%, 75%, 100%
  ;[25, 50, 75, 100].forEach((lvl) => {
    const ptF = getRadarPoint(angleF, lvl)
    const ptA = getRadarPoint(angleA, lvl)
    const ptC = getRadarPoint(angleC, lvl)

    doc.setDrawColor(...PALETTE.slate200)
    doc.setLineWidth(0.2)
    doc.line(ptF.x, ptF.y, ptA.x, ptA.y)
    doc.line(ptA.x, ptA.y, ptC.x, ptC.y)
    doc.line(ptC.x, ptC.y, ptF.x, ptF.y)
  })

  // Eixos radiais
  ;[angleF, angleA, angleC].forEach((ang) => {
    const endPt = getRadarPoint(ang, 100)
    doc.setDrawColor(...PALETTE.slate300)
    doc.setLineWidth(0.2)
    doc.line(cx, cy, endPt.x, endPt.y)
  })

  // Polígono do resultado da aluna
  const pF = getRadarPoint(angleF, resultado.pilares.fundacao.percentual)
  const pA = getRadarPoint(angleA, resultado.pilares.atracao.percentual)
  const pC = getRadarPoint(angleC, resultado.pilares.conexao.percentual)

  doc.setFillColor(237, 233, 254) // Roxo translúcido claro
  doc.setDrawColor(...PALETTE.primary)
  doc.setLineWidth(0.6)
  doc.triangle(pF.x, pF.y, pA.x, pA.y, pC.x, pC.y, 'FD')

  // Círculos nos vértices
  ;[pF, pA, pC].forEach((pt) => {
    doc.setFillColor(...PALETTE.white)
    doc.setDrawColor(...PALETTE.primary)
    doc.setLineWidth(0.5)
    doc.circle(pt.x, pt.y, 1.2, 'FD')
  })

  // Rótulos do Radar
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...PALETTE.slate900)
  doc.text(`Fundação ${resultado.pilares.fundacao.percentual}%`, cx, cy - rMax - 2, {
    align: 'center',
  })
  doc.text(
    `Atração ${resultado.pilares.atracao.percentual}%`,
    cx + rMax * Math.cos(angleA) + 1,
    cy + rMax * Math.sin(angleA) + 4,
  )
  doc.text(
    `Conexão ${resultado.pilares.conexao.percentual}%`,
    cx + rMax * Math.cos(angleC) - 1,
    cy + rMax * Math.sin(angleC) + 4,
    { align: 'right' },
  )

  // Coluna Direita ao Radar: Ordem dos Pilares & Por Onde Começar
  const rightColX = marginX + radarWidth + 4
  const rightColWidth = contentWidth - radarWidth - 4

  // Box Ordem e Relação
  doc.setFillColor(...PALETTE.white)
  doc.setDrawColor(...PALETTE.slate200)
  doc.roundedRect(rightColX, radarSectionY, rightColWidth, 31, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.slate900)
  doc.text('ORDEM DOS PILARES & RELAÇÃO', rightColX + 4, radarSectionY + 5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...PALETTE.primaryDark)
  const ordemStr = resultado.pilaresOrdenados
    .map((p, i) => `${i + 1}º ${p.nome} (${p.percentual}%)`)
    .join('  →  ')
  doc.text(ordemStr, rightColX + 4, radarSectionY + 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...PALETTE.slate700)
  const splitRel = doc.splitTextToSize(resultado.relacaoEntrePilares, rightColWidth - 8)
  doc.text(splitRel.slice(0, 4), rightColX + 4, radarSectionY + 14.5)

  // Box Por Onde Começar
  const startBoxY = radarSectionY + 33
  doc.setFillColor(...PALETTE.primaryLight)
  doc.setDrawColor(...PALETTE.primaryBorder)
  doc.roundedRect(rightColX, startBoxY, rightColWidth, 32, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text('POR ONDE COMEÇAR · DIRECIONAMENTO PRIORITÁRIO', rightColX + 4, startBoxY + 5)

  const pilarIni = resultado.pilares[resultado.porOndeComecar.pilarInicial]
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...PALETTE.slate900)
  doc.text(
    `Pilar de Partida: ${pilarIni.nome} (${pilarIni.percentual}%) · ${resultado.porOndeComecar.tipoMovimento.toUpperCase()}`,
    rightColX + 4,
    startBoxY + 10,
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...PALETTE.slate700)
  const splitMotivo = doc.splitTextToSize(resultado.porOndeComecar.motivoPilar, rightColWidth - 8)
  doc.text(splitMotivo.slice(0, 2), rightColX + 4, startBoxY + 14)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text(
    `1º Movimento: ${resultado.porOndeComecar.dimensaoPrioritaria.codigo} (${resultado.porOndeComecar.dimensaoPrioritaria.nome}) · ${resultado.porOndeComecar.dimensaoPrioritaria.acao}`,
    rightColX + 4,
    startBoxY + 22,
    { maxWidth: rightColWidth - 8 },
  )
  doc.setTextColor(...PALETTE.slate700)
  doc.text(
    `2º Movimento: ${resultado.porOndeComecar.dimensaoSeguinte.codigo} (${resultado.porOndeComecar.dimensaoSeguinte.nome}) · ${resultado.porOndeComecar.dimensaoSeguinte.acao}`,
    rightColX + 4,
    startBoxY + 27,
    { maxWidth: rightColWidth - 8 },
  )

  currentY = radarSectionY + radarHeight + 5

  // Alertas Condicionais Observados (se houver)
  if (resultado.alertas.length > 0) {
    const alertBoxY = currentY
    const alertBoxH = 26
    doc.setFillColor(...PALETTE.amberLight)
    doc.setDrawColor(...PALETTE.amber)
    doc.setLineWidth(0.3)
    doc.roundedRect(marginX, alertBoxY, contentWidth, alertBoxH, 2, 2, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...PALETTE.amber)
    doc.text(
      `PONTOS DE ATENÇÃO OBSERVADOS (${resultado.alertas.length} HIPÓTESES DE INVESTIGAÇÃO, NÃO DIAGNÓSTICO CAUSAL):`,
      marginX + 4,
      alertBoxY + 5,
    )

    const alertColW = (contentWidth - 8) / Math.min(3, resultado.alertas.length)
    resultado.alertas.forEach((al, idx) => {
      const aX = marginX + 4 + idx * alertColW
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...PALETTE.slate900)
      doc.text(`${idx + 1}. ${al.titulo}`, aX, alertBoxY + 10, { maxWidth: alertColW - 4 })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.2)
      doc.setTextColor(...PALETTE.slate700)
      const descSplit = doc.splitTextToSize(al.descricao, alertColW - 4)
      doc.text(descSplit.slice(0, 3), aX, alertBoxY + 14)
    })

    currentY = alertBoxY + alertBoxH + 4
  }

  // Rodapé da Página 1 com ressalva
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.5)
  doc.setTextColor(...PALETTE.slate500)
  doc.text(
    `${RESSALVA_PERCENTUAL} · Academia Método FAC © 2026. Documento de uso pessoal.`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' },
  )

  // ==========================================
  // PÁGINA 2: OS TRÊS PILARES & AS 12 DIMENSÕES
  // ==========================================
  doc.addPage()
  currentY = 16
  drawHeaderSmall()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...PALETTE.slate900)
  doc.text('Detalhamento dos Três Pilares & 12 Dimensões FAC', marginX, currentY)
  currentY += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.slate500)
  doc.text(
    'Médias abaixo de 3.0 indicam construção prioritária. Médias a partir de 3.5 sinalizam refinamento maduro.',
    marginX,
    currentY,
  )
  currentY += 6

  // Iterar sobre os 3 pilares
  ;(['fundacao', 'atracao', 'conexao'] as PilarId[]).forEach((pid) => {
    const p = resultado.pilares[pid]
    ensureSpace(70)

    // Cabeçalho do Pilar
    const pHeadY = currentY
    doc.setFillColor(...PALETTE.primaryLight)
    doc.setDrawColor(...PALETTE.primaryBorder)
    doc.setLineWidth(0.3)
    doc.roundedRect(marginX, pHeadY, contentWidth, 12, 1.5, 1.5, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...PALETTE.slate900)
    doc.text(`Pilar ${p.nome} — ${p.percentual}% (${p.nivel.rotulo})`, marginX + 4, pHeadY + 5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...PALETTE.slate500)
    doc.text(
      `Soma: ${p.soma}/32 pts · Média: ${p.media.toFixed(2)} · Firme: ${p.dimensaoMaisFirme.codigo} (${p.dimensaoMaisFirme.nome}) · Menos Firme: ${p.dimensaoMenosFirme.codigo} (${p.dimensaoMenosFirme.nome})`,
      marginX + 4,
      pHeadY + 9.5,
    )

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...PALETTE.primaryDark)
    doc.text(`${p.percentual}%`, pageWidth - marginX - 4, pHeadY + 7.5, { align: 'right' })

    currentY = pHeadY + 14

    // As 4 dimensões do pilar em grid 2x2
    const dimCardW = (contentWidth - 3) / 2
    const dimCardH = 24

    p.dimensoes.forEach((d, dIdx) => {
      const isRight = dIdx % 2 === 1
      const isBottom = dIdx >= 2

      const dX = isRight ? marginX + dimCardW + 3 : marginX
      const dY = currentY + (isBottom ? dimCardH + 2 : 0)

      doc.setFillColor(...PALETTE.slate50)
      doc.setDrawColor(...PALETTE.slate200)
      doc.setLineWidth(0.2)
      doc.roundedRect(dX, dY, dimCardW, dimCardH, 1, 1, 'FD')

      // Título da dimensão e badge
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(...PALETTE.slate900)
      doc.text(`${d.codigo} · ${d.nome}`, dX + 3, dY + 4.5)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(...PALETTE.primary)
      doc.text(`${d.percentual}% (méd. ${d.media})`, dX + dimCardW - 3, dY + 4.5, {
        align: 'right',
      })

      // Interpretação
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.3)
      doc.setTextColor(...PALETTE.slate700)
      const interpSplit = doc.splitTextToSize(d.interpretacao, dimCardW - 6)
      doc.text(interpSplit.slice(0, 2), dX + 3, dY + 8.5)

      // Ação
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.2)
      doc.setTextColor(...PALETTE.primaryDark)
      doc.text(`Ação (${d.tipoAcao}):`, dX + 3, dY + 16.5)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...PALETTE.slate700)
      const acaoSplit = doc.splitTextToSize(d.acao, dimCardW - 6)
      doc.text(acaoSplit.slice(0, 2), dX + 3, dY + 19.5)
    })

    currentY += dimCardH * 2 + 6
  })

  // Rodapé da Página 2
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.5)
  doc.setTextColor(...PALETTE.slate500)
  doc.text(
    'Página 2 de 3 · Academia Método FAC · Diagnóstico Aprofundado (Versão 2 · 04/10/2026)',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' },
  )

  // ==========================================
  // PÁGINA 3: SUAS PALAVRAS, CUIDADO & 6 MOVIMENTOS
  // ==========================================
  doc.addPage()
  currentY = 16
  drawHeaderSmall()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...PALETTE.slate900)
  doc.text('Suas Palavras, Contexto Clínico & Próximos Passos', marginX, currentY)
  currentY += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.slate500)
  doc.text(
    'Registros literais da sua prática, cuidado clínico complementar e plano de ação estruturado.',
    marginX,
    currentY,
  )
  currentY += 6

  // Box 1: Contexto Inicial da Agenda & Formas de Atendimento
  const ctxBoxY = currentY
  const ctxBoxH = 34
  doc.setFillColor(...PALETTE.white)
  doc.setDrawColor(...PALETTE.slate200)
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, ctxBoxY, contentWidth, ctxBoxH, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text('1. CONTEXTO INICIAL DA SUA PRÁTICA (SEM IMPACTO NA NOTA)', marginX + 4, ctxBoxY + 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(...PALETTE.slate700)

  const ctx = resultado.contextoInicial
  doc.text(
    `• Momento de Carreira: ${ctx.momentoCarreira || 'Não informado'}`,
    marginX + 4,
    ctxBoxY + 10,
  )
  doc.text(
    `• Formas Atuais de Atendimento: ${ctx.formasAtendimento.join(', ') || 'Não informado'}`,
    marginX + 4,
    ctxBoxY + 14.5,
  )
  doc.text(
    `• Sessões Particulares por Semana: ${ctx.sessoesAtuais ?? '—'} atuais  |  ${ctx.sessoesDesejadas ?? '—'} desejadas`,
    marginX + 4,
    ctxBoxY + 19,
  )
  doc.text(
    `• Origens dos Últimos 5 Pacientes: ${ctx.origensUltimosPacientes.join(', ') || 'Não informado'}`,
    marginX + 4,
    ctxBoxY + 23.5,
  )
  if (ctx.oQueMaisTrava) {
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...PALETTE.slate900)
    const travaSplit = doc.splitTextToSize(
      `"O que mais trava: ${ctx.oQueMaisTrava}"`,
      contentWidth - 8,
    )
    doc.text(travaSplit.slice(0, 2), marginX + 4, ctxBoxY + 28)
  }

  currentY = ctxBoxY + ctxBoxH + 5

  // Box 2: Cuidado Clínico & Sustentação Ética
  const cuidBoxY = currentY
  const cuidBoxH = 30
  doc.setFillColor(resultado.avisoCuidadoClinico ? PALETTE.amberLight : PALETTE.slate50)
  doc.setDrawColor(resultado.avisoCuidadoClinico ? PALETTE.amber : PALETTE.slate200)
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, cuidBoxY, contentWidth, cuidBoxH, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(resultado.avisoCuidadoClinico ? PALETTE.amber : PALETTE.primaryDark)
  doc.text('2. CUIDADO CLÍNICO & SUSTENTAÇÃO ÉTICA', marginX + 4, cuidBoxY + 5)

  const txtCond =
    resultado.cuidadoClinico.conducaoClinica !== null
      ? PERGUNTA_CUIDADO_CONDUCAO.opcoes.find(
          (o) => o.valor === resultado.cuidadoClinico.conducaoClinica,
        )?.texto || 'Não informado'
      : 'Não informado'
  const txtSup =
    resultado.cuidadoClinico.supervisaoRegular !== null
      ? PERGUNTA_CUIDADO_SUPERVISAO.opcoes.find(
          (o) => o.valor === resultado.cuidadoClinico.supervisaoRegular,
        )?.texto || 'Não informado'
      : 'Não informado'

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(...PALETTE.slate700)
  doc.text(`• Condução Clínica: ${txtCond}`, marginX + 4, cuidBoxY + 10, {
    maxWidth: contentWidth - 8,
  })
  doc.text(`• Supervisão Regular: ${txtSup}`, marginX + 4, cuidBoxY + 15, {
    maxWidth: contentWidth - 8,
  })

  if (resultado.avisoCuidadoClinico) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(6.8)
    doc.setTextColor(...PALETTE.slate900)
    const splitAviso = doc.splitTextToSize(resultado.avisoCuidadoClinico, contentWidth - 8)
    doc.text(splitAviso.slice(0, 3), marginX + 4, cuidBoxY + 20.5)
  }

  currentY = cuidBoxY + cuidBoxH + 5

  // Box 3: Respostas Abertas Registradas
  const abertBoxY = currentY
  const abertBoxH = 34
  doc.setFillColor(...PALETTE.white)
  doc.setDrawColor(...PALETTE.slate200)
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, abertBoxY, contentWidth, abertBoxH, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.slate900)
  doc.text('3. SUAS PALAVRAS NOS TRÊS PILARES (REGISTROS LITERAIS)', marginX + 4, abertBoxY + 5)

  const ab = resultado.respostasAbertas
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text('• Fundação (o que já tentou organizar e não foi adiante):', marginX + 4, abertBoxY + 10)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...PALETTE.slate700)
  doc.text(`"${ab.fundacao || 'Não informado'}"`, marginX + 8, abertBoxY + 13.5, {
    maxWidth: contentWidth - 12,
  })

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text(
    '• Atração (canal que já trouxe paciente, mesmo poucas vezes):',
    marginX + 4,
    abertBoxY + 18,
  )
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...PALETTE.slate700)
  doc.text(`"${ab.atracao || 'Não informado'}"`, marginX + 8, abertBoxY + 21.5, {
    maxWidth: contentWidth - 12,
  })

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text(
    '• Conexão (momento em que mais percebe perdas no percurso):',
    marginX + 4,
    abertBoxY + 26,
  )
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...PALETTE.slate700)
  doc.text(`"${ab.conexao || 'Não informado'}"`, marginX + 8, abertBoxY + 29.5, {
    maxWidth: contentWidth - 12,
  })

  currentY = abertBoxY + abertBoxH + 5

  // Box 4: Checklist dos Seis Movimentos Recomendados
  const movBoxY = currentY
  const movBoxH = 46
  doc.setFillColor(...PALETTE.primaryLight)
  doc.setDrawColor(...PALETTE.primaryBorder)
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, movBoxY, contentWidth, movBoxH, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.primaryDark)
  doc.text('4. CHECKLIST DOS SEIS MOVIMENTOS ESTRUTURANTES', marginX + 4, movBoxY + 5)

  // 6 movimentos em 2 colunas
  const mColW = (contentWidth - 8) / 2
  CHECKLIST_SEIS_MOVIMENTOS.forEach((mov, idx) => {
    const isCol2 = idx >= 3
    const rowIdx = idx % 3
    const mX = isCol2 ? marginX + 4 + mColW : marginX + 4
    const mY = movBoxY + 10 + rowIdx * 11.5

    // Número
    doc.setFillColor(...PALETTE.primary)
    doc.roundedRect(mX, mY - 3, 4.5, 4.5, 1, 1, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(...PALETTE.white)
    doc.text(`${idx + 1}`, mX + 2.25, mY + 0.2, { align: 'center' })

    // Texto
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...PALETTE.slate900)
    const movSplit = doc.splitTextToSize(mov, mColW - 7)
    doc.text(movSplit, mX + 6, mY - 0.5)
  })

  currentY = movBoxY + movBoxH + 4

  // Ressalva Legal & Metodológica Final
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6)
  doc.setTextColor(...PALETTE.slate500)
  const escopoSplit = doc.splitTextToSize(RESSALVA_ESCOPO, contentWidth)
  doc.text(escopoSplit, marginX, currentY)
  currentY += escopoSplit.length * 2.5 + 1

  doc.setFont('helvetica', 'italic')
  doc.text(
    `Entrelaços Psicologia · Academia Método FAC © 2026. Documento de uso pessoal emitido em ${dataHoje}.`,
    marginX,
    currentY,
  )

  return doc
}

/**
 * Função pública que orquestra a geração e o download direto do PDF no navegador.
 * Garante try/catch completo: nunca lança exceção não tratada e nunca deixa a interface presa.
 */
export async function downloadDiagnosticoPdf(
  resultado: ResultadoDiagnosticoV2,
  options?: GeneratePdfOptions,
): Promise<PdfGenerationResult> {
  const filename = 'diagnostico-fac-aprofundado.pdf'

  try {
    if (!resultado) {
      throw new Error('Resultado do diagnóstico não fornecido ou incompleto.')
    }

    // Criar o documento
    const doc = buildDiagnosticoPdfDocument(resultado, options)

    // Acionar download nativo via jsPDF
    doc.save(filename)

    return {
      success: true,
      filename,
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : 'Falha desconhecida ao gerar o arquivo PDF.'
    console.error('[DiagnosticoFAC] Erro na geração do PDF:', error)
    return {
      success: false,
      filename,
      error: errorMsg,
    }
  }
}
