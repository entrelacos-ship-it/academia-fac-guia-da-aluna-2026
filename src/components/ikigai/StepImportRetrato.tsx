import React, { useState } from 'react'
import {
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  MoveRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { CircleId } from '@/types/ikigai'
import { CIRCLE_DEFINITIONS } from '@/config/ikigaiContent'
import { parseRetratoDeAutoriaText, ParseRetratoResult } from '@/lib/ikigaiEngine'

interface StepImportRetratoProps {
  onConfirmImport: (parsed: { circles: Record<CircleId, string[]>; tray: string[] }) => void
  onSkip: () => void
  onBack: () => void
}

export const StepImportRetrato: React.FC<StepImportRetratoProps> = ({
  onConfirmImport,
  onSkip,
  onBack,
}) => {
  const [pastedText, setPastedText] = useState('')
  const [parseResult, setParseResult] = useState<ParseRetratoResult | null>(null)
  const [editableCircles, setEditableCircles] = useState<Record<CircleId, string[]>>({
    love: [],
    goodAt: [],
    worldNeeds: [],
    paidFor: [],
  })
  const [editableTray, setEditableTray] = useState<string[]>([])

  const handleAnalyze = () => {
    if (!pastedText.trim()) return
    const res = parseRetratoDeAutoriaText(pastedText)
    setParseResult(res)
    setEditableCircles(res.circles)
    setEditableTray(res.tray)
  }

  const handleRemoveCircleItem = (circleId: CircleId, index: number) => {
    setEditableCircles((prev) => ({
      ...prev,
      [circleId]: prev[circleId].filter((_, i) => i !== index),
    }))
  }

  const handleMoveTrayToCircle = (trayIndex: number, targetCircle: CircleId) => {
    const item = editableTray[trayIndex]
    if (!item) return
    setEditableTray((prev) => prev.filter((_, i) => i !== trayIndex))
    setEditableCircles((prev) => ({
      ...prev,
      [targetCircle]: [...prev[targetCircle], item],
    }))
  }

  const handleRemoveTrayItem = (trayIndex: number) => {
    setEditableTray((prev) => prev.filter((_, i) => i !== trayIndex))
  }

  const handleFinalConfirm = () => {
    onConfirmImport({
      circles: editableCircles,
      tray: editableTray,
    })
  }

  const totalLoaded =
    editableCircles.love.length +
    editableCircles.goodAt.length +
    editableCircles.worldNeeds.length +
    editableCircles.paidFor.length +
    editableTray.length

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-[#18181B] border border-orange-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C]">
          <FileText className="w-3.5 h-3.5" />
          <span>RETRATO DE AUTORIA · MATÉRIA-PRIMA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
          Trazer do Retrato de Autoria (opcional)
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          Cole abaixo a lista de itens gerada na sua entrevista com a IA da Academia. O app separa o
          texto pelos títulos de cada círculo para você confirmar, editar ou descartar antes de
          começar.
        </p>
      </div>

      {/* Área de Colagem */}
      {!parseResult && (
        <Card className="astral-card p-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="retrato-paste-input"
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Cole o texto da matéria-prima aqui:</span>
              <span className="text-[11px] font-normal text-slate-400">
                Claude ou ChatGPT da Academia
              </span>
            </label>
            <Textarea
              id="retrato-paste-input"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={`Cole aqui o bloco gerado pela IA. Exemplo:

Círculo 1 · O que eu amo fazer
- Escuta profunda de famílias
- Mediação de grupos acolhedores

Círculo 2 · No que eu sou boa
- Capacidade de síntese clínica...`}
              rows={9}
              className="font-sans text-sm border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] focus:border-[#7c3aed]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleAnalyze}
              disabled={!pastedText.trim()}
              className="flex-1 gap-2 bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#f97316] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] rounded-[8px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Distribuir nos 4 Círculos</span>
            </Button>
            <Button
              variant="outline"
              onClick={onSkip}
              className="border-slate-200 dark:border-[#27272A] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#18181B] min-h-[44px] rounded-[8px] cursor-pointer"
            >
              <span>Não fiz o Retrato, começar do zero</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Revisão do Parse */}
      {parseResult && (
        <div className="space-y-6">
          <div className="p-4 rounded-[12px] bg-purple-50 dark:bg-[#121216] border border-purple-200 dark:border-[#27272A] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {parseResult.matchedBySection
                    ? 'Texto reconhecido e dividido pelos 4 círculos!'
                    : 'Texto reunido na bandeja de distribuição'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                {parseResult.matchedBySection
                  ? 'Revise os itens abaixo. Você pode apagar o que não fizer sentido ou mover itens da bandeja.'
                  : 'Não identificamos os títulos exatos dos círculos. Você pode tocar em cada item da bandeja para enviá-lo ao círculo correto.'}
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {totalLoaded} itens
            </Badge>
          </div>

          {/* Bandeja de Itens Não Alocados (se houver) */}
          {editableTray.length > 0 && (
            <Card className="p-5 border-amber-300 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Bandeja de Itens ({editableTray.length})
                  </span>
                </div>
                <span className="text-xs text-slate-500">Toque no círculo para onde enviar</span>
              </div>

              <div className="space-y-2">
                {editableTray.map((itemText, idx) => (
                  <div
                    key={`tray-${idx}`}
                    className="p-3 rounded-[8px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {itemText}
                    </span>
                    <div className="flex items-center gap-1 shrink-0 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveTrayToCircle(idx, 'love')}
                        className="h-7 text-[11px] px-2 text-[#7c3aed] border-purple-200"
                        title="Enviar para Círculo 1 (Amo)"
                      >
                        1. Amo
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveTrayToCircle(idx, 'goodAt')}
                        className="h-7 text-[11px] px-2 text-[#7c3aed] border-purple-200"
                        title="Enviar para Círculo 2 (Sou boa)"
                      >
                        2. Sou boa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveTrayToCircle(idx, 'worldNeeds')}
                        className="h-7 text-[11px] px-2 text-[#7c3aed] border-purple-200"
                        title="Enviar para Círculo 3 (Mundo precisa)"
                      >
                        3. Mundo precisa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveTrayToCircle(idx, 'paidFor')}
                        className="h-7 text-[11px] px-2 text-[#ea580c] border-orange-200"
                        title="Enviar para Círculo 4 (Remuneração)"
                      >
                        4. Renda
                      </Button>
                      <button
                        onClick={() => handleRemoveTrayItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Descartar item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Cards dos 4 Círculos com os Itens Alocados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['love', 'goodAt', 'worldNeeds', 'paidFor'] as CircleId[]).map((cId) => {
              const def = CIRCLE_DEFINITIONS[cId]
              const items = editableCircles[cId]
              return (
                <Card key={cId} className="astral-card p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272A] pb-2">
                    <span className="text-xs font-mono font-bold uppercase text-[#7c3aed] dark:text-[#C084FC]">
                      {def.badgeText} · {def.title}
                    </span>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {items.length} itens
                    </Badge>
                  </div>

                  <div className="space-y-1.5 min-h-[70px]">
                    {items.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        Nenhum item atribuído a este círculo ainda.
                      </p>
                    ) : (
                      items.map((it, idx) => (
                        <div
                          key={`c-${cId}-${idx}`}
                          className="flex items-center justify-between gap-2 p-2 rounded-[6px] bg-slate-50 dark:bg-[#121216] border border-slate-100 dark:border-[#27272A] text-xs"
                        >
                          <span className="text-slate-800 dark:text-slate-200 truncate">{it}</span>
                          <button
                            onClick={() => handleRemoveCircleItem(cId, idx)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                            title="Remover item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Botões de Confirmação Final da Importação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleFinalConfirm}
              className="flex-1 gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[46px] rounded-[8px] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar e ir para os 4 Círculos</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setParseResult(null)
                setPastedText('')
              }}
              className="border-slate-200 dark:border-[#27272A] text-slate-600 dark:text-slate-400 hover:bg-slate-100 min-h-[46px] rounded-[8px] cursor-pointer"
            >
              <span>Colar outro texto</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
