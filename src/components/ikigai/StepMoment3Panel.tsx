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
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Save,
  AlertCircle,
  History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { IkigaiState, CircleId } from '@/types/ikigai'
import {
  CIRCLE_DEFINITIONS,
  INTERSECTION_DEFINITIONS,
  IKIGAI_WARNING_NOTE,
  MISSION_TEMPLATE_SUGGESTION,
} from '@/config/ikigaiContent'
import { IkigaiSvgDiagram } from './IkigaiSvgDiagram'
import {
  generateCleanTextForAI,
  generateCommunityShareText,
  diagnoseEmptyIntersections,
  countSentences,
  sanitizeTypography,
} from '@/lib/ikigaiEngine'
import { safeToPng } from '@/lib/safeHtmlToImage'

interface StepMoment3PanelProps {
  state: IkigaiState
  onSaveMissionStatement: (statement: string) => void
  onRestoreMissionVersion: (text: string) => void
  onRestart: () => void
  onBackToConnect: () => void
  onOpenPresentation: () => void
  onImportJson: (imported: IkigaiState) => void
}

export const StepMoment3Panel: React.FC<StepMoment3PanelProps> = ({
  state,
  onSaveMissionStatement,
  onRestoreMissionVersion,
  onRestart,
  onBackToConnect,
  onOpenPresentation,
  onImportJson,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados de exportação
  const [copiedAi, setCopiedAi] = useState(false)
  const [copiedCommunity, setCopiedCommunity] = useState(false)
  const [isExportingPng, setIsExportingPng] = useState(false)
  const [showFullList, setShowFullList] = useState(false)

  // Seções recolhíveis para deixar a tela prática e direta
  const [showReadingDetails, setShowReadingDetails] = useState(false)
  const [showDiscussionQuestions, setShowDiscussionQuestions] = useState(false)
  const [showMissionEditor, setShowMissionEditor] = useState(!state.missionStatement)
  const [showMissionHistory, setShowMissionHistory] = useState(false)

  // Editor da missão
  const [missionInput, setMissionInput] = useState(state.missionStatement || '')
  const [savedMissionSuccess, setSavedMissionSuccess] = useState(false)

  const diag = diagnoseEmptyIntersections(state)
  const sentenceCount = countSentences(missionInput)
  const isMissionTooLong = sentenceCount > 2

  const dominantDef = diag.dominantCircle ? CIRCLE_DEFINITIONS[diag.dominantCircle] : null
  const leanestDef = diag.leanestCircle ? CIRCLE_DEFINITIONS[diag.leanestCircle] : null

  // Salvar missão
  const handleSaveMission = () => {
    const cleaned = sanitizeTypography(missionInput.trim())
    onSaveMissionStatement(cleaned)
    setSavedMissionSuccess(true)
    setTimeout(() => setSavedMissionSuccess(false), 2000)
  }

  const handleApplyMissionTemplate = () => {
    setMissionInput(MISSION_TEMPLATE_SUGGESTION)
  }

  const handleRestoreVersion = (itemText: string) => {
    setMissionInput(itemText)
    onRestoreMissionVersion(itemText)
  }

  // Copiar para IA
  const handleCopyForAI = async () => {
    const text = generateCleanTextForAI(state)
    await navigator.clipboard.writeText(text)
    setCopiedAi(true)
    setTimeout(() => setCopiedAi(false), 2000)
  }

  // Copiar para comunidade
  const handleCopyForCommunity = async () => {
    const text = generateCommunityShareText(state)
    await navigator.clipboard.writeText(text)
    setCopiedCommunity(true)
    setTimeout(() => setCopiedCommunity(false), 2000)
  }

  // Baixar JSON
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

  // Baixar PNG
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

  // Baixar PDF
  const handleExportPdf = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Topo com Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#27272A] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Momento 3 · Painel Consolidado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mt-1">
            Seu Painel IKIGAI Completo
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToConnect}
            className="h-9 gap-1.5 text-xs font-mono border-slate-200 dark:border-[#27272A] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Editar Encontros</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPresentation}
            className="h-9 gap-1.5 text-xs font-mono border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#18181B] cursor-pointer"
            title="Abrir em modo apresentação limpo da facilitadora"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Apresentação</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            className="h-9 gap-1 text-xs font-mono text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recomeçar</span>
          </Button>
        </div>
      </div>

      {/* BLOCO 1: DIAGNÓSTICO E LEITURA DOS VAZIOS (COMPACTO COM EXPANSÃO) */}
      <Card className="astral-card p-5 space-y-4 border-[#7c3aed]/30 bg-purple-50/40 dark:bg-[#121216]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              Leitura por regras fixas · Sem IA
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {diag.primaryReflection.title}
            </h2>
          </div>
          <Badge
            className={
              diag.emptyKeys.length === 0
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 w-fit'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 w-fit'
            }
          >
            {diag.emptyKeys.length === 0
              ? 'Painel Integrado'
              : `${diag.emptyKeys.length} encontro(s) em aberto`}
          </Badge>
        </div>

        <blockquote className="p-3 rounded-[8px] bg-white dark:bg-[#18181B] border-l-4 border-[#7c3aed] text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium italic">
          "{diag.primaryReflection.body}"
        </blockquote>

        <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          {diag.primaryReflection.guidance}
        </p>

        {/* Botão para ver detalhes da leitura dos círculos */}
        <div className="pt-2 border-t border-slate-200 dark:border-[#27272A] flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowReadingDetails(!showReadingDetails)}
            className="font-mono text-[#7c3aed] dark:text-[#C084FC] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>
              {showReadingDetails
                ? 'Ocultar detalhes dos círculos'
                : 'Ver balanço dos círculos (mais abundante vs mais enxuto)'}
            </span>
            {showReadingDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowDiscussionQuestions(!showDiscussionQuestions)}
            className="font-mono text-[#ea580c] dark:text-[#FB923C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>
              {showDiscussionQuestions
                ? 'Ocultar perguntas ao vivo'
                : 'Ver perguntas para o Encontro ao Vivo'}
            </span>
            {showDiscussionQuestions ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Detalhes expandidos: Mais Itens vs Menos Itens */}
        {showReadingDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-fadeIn">
            <div className="p-3.5 rounded-[10px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase text-[#7c3aed] dark:text-[#C084FC] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mais abundante: {dominantDef ? dominantDef.title : 'Uniforme'}</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                {diag.dominantCircle
                  ? `${diag.circleCounts[diag.dominantCircle]} itens cadastrados.`
                  : ''}{' '}
                Território de repertório espontâneo.
              </p>
            </div>

            <div className="p-3.5 rounded-[10px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase text-[#ea580c] dark:text-[#FB923C] flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                <span>Mais enxuto: {leanestDef ? leanestDef.title : 'Uniforme'}</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                {diag.leanestCircle
                  ? `${diag.circleCounts[diag.leanestCircle]} itens cadastrados.`
                  : ''}{' '}
                Espaço para novas permissões e ferramentas.
              </p>
            </div>
          </div>
        )}

        {/* Perguntas expandidas ao vivo */}
        {showDiscussionQuestions && (
          <div className="p-3.5 rounded-[10px] bg-orange-50/50 dark:bg-[#18181B] border border-orange-200 dark:border-[#27272A] space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ea580c] dark:text-[#FB923C]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Perguntas para debater no Encontro ao Vivo:</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              {diag.discussionQuestions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#ea580c] font-bold">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* BLOCO 2: DECLARAÇÃO DE MISSÃO NO CENTRO */}
      <Card className="astral-card p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Declaração de Missão (Centro do Diagrama)
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              Até 2 frases
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMissionEditor(!showMissionEditor)}
              className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:underline cursor-pointer"
            >
              {showMissionEditor ? 'Ocultar editor' : 'Editar declaração'}
            </button>
          </div>
        </div>

        {/* Seção de visualização rápida da missão atual se o editor estiver fechado */}
        {!showMissionEditor && (
          <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-center">
            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white italic">
              "
              {state.missionStatement ||
                'Nenhuma declaração formulada ainda. Clique em Editar para escrever.'}
              "
            </p>
          </div>
        )}

        {/* Editor da Declaração */}
        {showMissionEditor && (
          <div className="space-y-3 pt-1 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Sintetize quem você cuida, qual a transformação e como você intervém:
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleApplyMissionTemplate}
                className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#1f1f23] h-7 px-2 cursor-pointer"
              >
                Usar modelo
              </Button>
            </div>

            <Textarea
              value={missionInput}
              onChange={(e) => setMissionInput(e.target.value)}
              placeholder="Eu ajudo [quem] a [transformação], por meio de [como eu faço]."
              rows={3}
              className="font-sans text-sm bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] focus:border-[#7c3aed]"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                    sentenceCount === 0
                      ? 'bg-slate-100 dark:bg-[#18181B] text-slate-500'
                      : sentenceCount <= 2
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {sentenceCount} {sentenceCount === 1 ? 'frase' : 'frases'} detectada(s)
                </span>
                {isMissionTooLong && (
                  <span className="text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Recomendamos até 2 frases.</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {state.missionHistory && state.missionHistory.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMissionHistory(!showMissionHistory)}
                    className="h-8 text-xs font-mono border-slate-200 dark:border-[#27272A] cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 mr-1" />
                    <span>Histórico ({state.missionHistory.length})</span>
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleSaveMission}
                  disabled={!missionInput.trim()}
                  size="sm"
                  className="h-8 text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] gap-1 cursor-pointer"
                >
                  {savedMissionSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvo!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar na Nuvem</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Histórico recolhível */}
            {showMissionHistory && state.missionHistory && state.missionHistory.length > 0 && (
              <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-2 text-xs">
                <span className="font-mono font-bold uppercase text-slate-600 dark:text-slate-400 block text-[10px]">
                  Versões anteriores:
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {state.missionHistory.map((h) => (
                    <div
                      key={h.id}
                      className="p-2 rounded bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex items-center justify-between gap-2"
                    >
                      <p className="truncate italic text-slate-700 dark:text-slate-300">
                        "{h.text}"
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRestoreVersion(h.text)}
                        className="text-[#7c3aed] dark:text-[#C084FC] hover:underline font-mono text-[11px] shrink-0 cursor-pointer"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* BLOCO 3: ENTREGÁVEL VISUAL (SVG DOS 4 CÍRCULOS E ENCONTROS) */}
      <div
        ref={panelRef}
        className="p-6 sm:p-8 rounded-[16px] bg-white dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] shadow-md space-y-6 print:p-2 print:border-none print:shadow-none"
      >
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

        {/* Diagrama SVG dos 4 Círculos com estrelas e frases */}
        <div className="py-2 flex justify-center overflow-x-auto">
          <IkigaiSvgDiagram state={state} />
        </div>

        {/* Declaração no Entregável */}
        <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            DECLARAÇÃO DE MISSÃO NO CENTRO
          </span>
          <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white italic">
            "{state.missionStatement || 'Declaração ainda em construção'}"
          </p>
        </div>

        {/* Rodapé ético no entregável visual */}
        <p className="text-center text-[10px] font-mono text-slate-400 dark:text-[#71717A] pt-2 border-t border-slate-100 dark:border-[#27272A]">
          {IKIGAI_WARNING_NOTE} · Entrelaços Psicologia
        </p>
      </div>

      {/* BLOCO 4: EXPORTAÇÕES PRESERVADAS (PNG, PDF, JSON, TEXTO IA, COMUNIDADE) */}
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
              className="gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold h-10 rounded-[8px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPng ? 'Gerando...' : 'Baixar Imagem PNG'}</span>
            </Button>

            <Button
              onClick={handleExportPdf}
              variant="outline"
              className="gap-2 border-slate-200 dark:border-[#27272A] text-xs font-semibold h-10 rounded-[8px] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Baixar PDF (1 pág)</span>
            </Button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#27272A] flex items-center justify-between text-xs">
            <button
              onClick={handleExportJson}
              className="font-mono text-slate-600 dark:text-[#A1A1AA] hover:text-[#7c3aed] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Baixar arquivo JSON com todo o progresso"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Salvar progresso (JSON)</span>
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
            <span>Compartilhar & Contexto IA</span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleCopyForAI}
              variant="outline"
              className="w-full justify-between border-purple-200 dark:border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#18181B] text-xs font-semibold h-10 rounded-[8px] cursor-pointer"
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
              className="w-full justify-between border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18181B] text-xs font-semibold h-10 rounded-[8px] cursor-pointer"
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

      {/* BLOCO 5: LISTA COMPLETA DOS ITENS (Acessibilidade) */}
      <Card className="astral-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7c3aed]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Lista de itens dos 4 círculos (Acessibilidade)
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullList(!showFullList)}
            className="text-xs font-mono gap-1 text-slate-500 cursor-pointer"
          >
            <span>{showFullList ? 'Recolher' : 'Expandir todos os itens'}</span>
            {showFullList ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {showFullList && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-[#27272A] animate-fadeIn">
            {(['love', 'goodAt', 'worldNeeds', 'paidFor'] as CircleId[]).map((cId) => {
              const def = CIRCLE_DEFINITIONS[cId]
              const items = state.circles[cId] || []
              return (
                <div
                  key={cId}
                  className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272A] pb-1 font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
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
export default StepMoment3Panel
