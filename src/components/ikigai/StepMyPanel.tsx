import React, { useRef, useState } from 'react'
import {
  Sparkles,
  Download,
  Copy,
  FileText,
  Share2,
  Check,
  ArrowLeft,
  RotateCcw,
  Presentation,
  Upload,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IkigaiState, CircleId } from '@/types/ikigai'
import {
  CIRCLE_DEFINITIONS,
  INTERSECTION_DEFINITIONS,
  IKIGAI_WARNING_NOTE,
} from '@/config/ikigaiContent'
import { IkigaiSvgDiagram } from './IkigaiSvgDiagram'
import {
  generateCleanTextForAI,
  generateCommunityShareText,
  diagnoseEmptyIntersections,
} from '@/lib/ikigaiEngine'
import { safeToPng } from '@/lib/safeHtmlToImage'

interface StepMyPanelProps {
  state: IkigaiState
  onRestart: () => void
  onBackToEdit: () => void
  onOpenPresentation: () => void
  onImportJson: (imported: IkigaiState) => void
}

export const StepMyPanel: React.FC<StepMyPanelProps> = ({
  state,
  onRestart,
  onBackToEdit,
  onOpenPresentation,
  onImportJson,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [copiedAi, setCopiedAi] = useState(false)
  const [copiedCommunity, setCopiedCommunity] = useState(false)
  const [isExportingPng, setIsExportingPng] = useState(false)
  const [showFullList, setShowFullList] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const diag = diagnoseEmptyIntersections(state)

  // Copiar bloco de texto para IA
  const handleCopyForAI = async () => {
    const text = generateCleanTextForAI(state)
    await navigator.clipboard.writeText(text)
    setCopiedAi(true)
    setTimeout(() => setCopiedAi(false), 2000)
  }

  // Copiar texto para comunidade
  const handleCopyForCommunity = async () => {
    const text = generateCommunityShareText(state)
    await navigator.clipboard.writeText(text)
    setCopiedCommunity(true)
    setTimeout(() => setCopiedCommunity(false), 2000)
  }

  // Baixar JSON para trocar de aparelho
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(state, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meu-ikigai-fac-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Importar JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as IkigaiState
        if (parsed.circles && parsed.intersections) {
          onImportJson(parsed)
        } else {
          alert('Arquivo JSON inválido. Verifique se é um arquivo exportado do IKIGAI.')
        }
      } catch {
        alert('Não foi possível ler este arquivo JSON.')
      }
    }
    reader.readAsText(file)
  }

  // Baixar Imagem PNG
  const handleExportPng = async () => {
    if (!panelRef.current) return
    setIsExportingPng(true)
    try {
      const dataUrl = await safeToPng(panelRef.current, {
        backgroundColor: '#FFFFFF',
        pixelRatio: 2,
      })
      if (dataUrl) {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `meu-ikigai-fac-${new Date().toISOString().slice(0, 10)}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err) {
      console.warn('Erro ao gerar PNG do painel:', err)
    } finally {
      setIsExportingPng(false)
    }
  }

  // Baixar como PDF de uma página (via janela de impressão otimizada de alta fidelidade)
  const handleExportPdf = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Topo com Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#27272A] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>PAINEL FINAL CONSOLIDADO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mt-1">
            Meu IKIGAI na Prática Clínica
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToEdit}
            className="h-9 gap-1.5 text-xs font-mono border-slate-200 dark:border-[#27272A]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Editar Etapas</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPresentation}
            className="h-9 gap-1.5 text-xs font-mono border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50"
            title="Abrir em modo tela cheia para apresentação ou aula"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Modo Apresentação</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            className="h-9 gap-1 text-xs font-mono text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recomeçar</span>
          </Button>
        </div>
      </div>

      {/* ÁREA DO ENTREGÁVEL VISUAL (Capturável para PNG e formatada para Impressão) */}
      <div
        ref={panelRef}
        className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] shadow-md space-y-6 print:p-2 print:border-none print:shadow-none"
      >
        {/* Cabeçalho do Painel para Exportação */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272A] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] font-bold block">
              ACADEMIA MÉTODO FAC · ENCONTRO 2
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Painel IKIGAI da Psicóloga Autora
            </h2>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-400">
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Diagrama SVG dos 4 Círculos */}
        <div className="py-2 flex justify-center">
          <IkigaiSvgDiagram state={state} />
        </div>

        {/* Declaração de Missão Destacada Abaixo do Diagrama */}
        <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            DECLARAÇÃO DE MISSÃO NO CENTRO
          </span>
          <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white italic">
            "{state.missionStatement || 'Declaração ainda não preenchida'}"
          </p>
        </div>

        {/* Rodapé ético no entregável visual */}
        <p className="text-center text-[10px] font-mono text-slate-400 dark:text-[#71717A] pt-2 border-t border-slate-100 dark:border-[#27272A]">
          {IKIGAI_WARNING_NOTE} · Entrelaços Psicologia
        </p>
      </div>

      {/* SEÇÃO DE EXPORTAÇÕES E INTEGRAÇÕES (5.9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Baixar Arquivos (PNG, PDF, JSON) */}
        <Card className="astral-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Download className="w-4 h-4 text-[#7c3aed]" />
            <span>Baixar Meu Painel</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button
              onClick={handleExportPng}
              disabled={isExportingPng}
              className="gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold h-10 rounded-[8px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPng ? 'Gerando...' : 'Baixar Imagem PNG'}</span>
            </Button>

            <Button
              onClick={handleExportPdf}
              variant="outline"
              className="gap-2 border-slate-200 dark:border-[#27272A] text-xs font-semibold h-10 rounded-[8px]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Baixar PDF (1 pág)</span>
            </Button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#27272A] flex items-center justify-between text-xs">
            <button
              onClick={handleExportJson}
              className="font-mono text-slate-600 dark:text-[#A1A1AA] hover:text-[#7c3aed] flex items-center gap-1.5 transition-colors"
              title="Baixar arquivo JSON com todo o progresso"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Salvar progresso em arquivo (JSON)</span>
            </button>

            <label className="font-mono text-slate-600 dark:text-[#A1A1AA] hover:text-[#7c3aed] flex items-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Abrir de arquivo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </Card>

        {/* Card 2: Copiar para IA e Comunidade */}
        <Card className="astral-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Share2 className="w-4 h-4 text-[#ea580c]" />
            <span>Compartilhar & Contextualizar IA</span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleCopyForAI}
              variant="outline"
              className="w-full justify-between border-purple-200 dark:border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 text-xs font-semibold h-10 rounded-[8px]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Copiar como texto para IA (Agentes FAC)</span>
              </span>
              {copiedAi ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>

            <Button
              onClick={handleCopyForCommunity}
              variant="outline"
              className="w-full justify-between border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold h-10 rounded-[8px]"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar texto pronto para Comunidade</span>
              </span>
              {copiedCommunity ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* LISTA COMPLETA DOS ITENS (Acessibilidade e Consulta Detalhada) */}
      <Card className="astral-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7c3aed]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Lista Completa dos 4 Círculos (Acessibilidade)
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullList(!showFullList)}
            className="text-xs font-mono gap-1 text-slate-500"
          >
            <span>{showFullList ? 'Recolher lista' : 'Expandir todos os itens'}</span>
            {showFullList ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {showFullList && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#27272A]">
            {(['love', 'goodAt', 'worldNeeds', 'paidFor'] as CircleId[]).map((cId) => {
              const def = CIRCLE_DEFINITIONS[cId]
              const items = state.circles[cId]
              return (
                <div
                  key={cId}
                  className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272A] pb-1.5 font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
                    <span>{def.title}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {items.length}
                    </Badge>
                  </div>
                  <ul className="space-y-1">
                    {items.map((it) => (
                      <li key={it.id} className="flex items-start gap-1.5">
                        <span className="text-amber-500">{it.starred ? '★' : '•'}</span>
                        <span className="text-slate-800 dark:text-slate-200">{it.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
