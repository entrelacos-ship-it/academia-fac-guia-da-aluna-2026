import React, { useState } from 'react'
import {
  Star,
  Plus,
  Trash2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  GripVertical,
  Edit2,
  Check,
  X,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CircleId, CircleItem } from '@/types/ikigai'
import { CIRCLE_DEFINITIONS, IKIGAI_ETHICAL_REMINDER } from '@/config/ikigaiContent'

interface StepCircleViewProps {
  circleId: CircleId
  items: CircleItem[]
  trayItems: string[]
  onAddItem: (text: string) => void
  onRemoveItem: (id: string) => void
  onToggleStar: (id: string) => void
  onUpdateText: (id: string, newText: string) => void
  onMoveTrayItem: (trayIndex: number) => void
  onNext: () => void
  onPrev: () => void
  canGoNext: boolean
}

export const StepCircleView: React.FC<StepCircleViewProps> = ({
  circleId,
  items,
  trayItems,
  onAddItem,
  onRemoveItem,
  onToggleStar,
  onUpdateText,
  onMoveTrayItem,
  onNext,
  onPrev,
  canGoNext,
}) => {
  const def = CIRCLE_DEFINITIONS[circleId]
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const starredCount = items.filter((i) => i.starred).length
  const isMinReached = items.length >= def.minSuggested

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return
    onAddItem(inputText.trim())
    setInputText('')
  }

  const startEdit = (item: CircleItem) => {
    setEditingId(item.id)
    setEditingText(item.text)
  }

  const saveEdit = (id: string) => {
    if (editingText.trim()) {
      onUpdateText(id, editingText.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Header do Círculo */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs uppercase tracking-wider">
            {def.subtitle}
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
            Etapa {def.number} de 4 dos círculos
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          {def.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          {def.description}
        </p>
      </div>

      {/* Perguntas-guia para reflexão da aluna */}
      <Card className="astral-card p-5 bg-purple-50/40 dark:bg-[#121216]/60 border-purple-100 dark:border-[#27272A] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
          <HelpCircle className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
          <span>Perguntas-guia para sua reflexão:</span>
        </div>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {def.questions.map((q, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC] mt-0.5">
                0{i + 1}.
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Campo de adição de etiquetas curtas */}
      <form onSubmit={handleAdd} className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={def.placeholder}
            className="flex-1 bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-sm h-11 focus:border-[#7c3aed]"
          />
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold h-11 px-5 rounded-[8px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#71717A] px-1">
          <span>
            {items.length} de {def.minSuggested} itens recomendados (sugestão de 5 a 8)
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 inline" />
            <span>{starredCount}/3 marcados como centrais</span>
          </span>
        </div>
      </form>

      {/* Bandeja de itens pendentes do Retrato de Autoria (se houver) */}
      {trayItems.length > 0 && (
        <div className="p-3.5 rounded-[10px] bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-orange-900 dark:text-orange-300">
              Itens da bandeja do Retrato ({trayItems.length})
            </span>
            <span className="text-[11px] text-slate-500">Toque para puxar para este círculo</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trayItems.slice(0, 6).map((txt, tIdx) => (
              <button
                key={`tray-sub-${tIdx}`}
                type="button"
                onClick={() => onMoveTrayItem(tIdx)}
                className="text-xs px-2.5 py-1 rounded-[6px] bg-white dark:bg-[#18181B] border border-orange-200 dark:border-orange-900 text-slate-800 dark:text-slate-200 hover:border-[#ea580c] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <Plus className="w-3 h-3 text-[#ea580c]" />
                <span className="truncate max-w-[200px]">{txt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Itens Adicionados */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-[#27272A] rounded-[12px] text-slate-400 space-y-2">
            <p className="text-sm font-medium">Nenhum item adicionado ainda neste círculo.</p>
            <p className="text-xs">
              Digite uma frase curta acima ou responda a uma das 3 perguntas-guia.
            </p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3 rounded-[10px] border transition-all flex items-center justify-between gap-3 ${
                item.starred
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-xs'
                  : 'bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A]'
              }`}
            >
              {/* Estrela / Destaque central */}
              <button
                type="button"
                onClick={() => onToggleStar(item.id)}
                disabled={!item.starred && starredCount >= 3}
                className={`p-1.5 rounded-[6px] transition-colors ${
                  item.starred
                    ? 'text-amber-500 hover:text-amber-600'
                    : starredCount >= 3
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-300 hover:text-amber-400'
                }`}
                title={
                  item.starred
                    ? 'Item central no seu IKIGAI (clique para remover estrela)'
                    : starredCount >= 3
                      ? 'Limite de 3 itens centrais por círculo atingido'
                      : 'Marcar como item central (máximo 3 por círculo)'
                }
              >
                <Star
                  className={`w-4 h-4 ${item.starred ? 'fill-amber-400 text-amber-500' : ''}`}
                />
              </button>

              {/* Texto ou Campo de Edição */}
              <div className="flex-1 min-w-0">
                {editingId === item.id ? (
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="h-8 text-xs bg-white dark:bg-[#18181B]"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => saveEdit(item.id)}
                      className="h-8 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="h-8 px-2 text-slate-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 block break-words">
                    {item.text}
                  </span>
                )}
              </div>

              {/* Ações de Edição e Exclusão */}
              {editingId !== item.id && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Editar item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Excluir item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Lembrete ético mandatório */}
      <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs text-slate-500 dark:text-[#71717A] flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>{IKIGAI_ETHICAL_REMINDER}</span>
      </div>

      {/* Barra de Ações Inferior */}
      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-1.5 border-slate-200 dark:border-[#27272A] min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Button>

        <Button
          onClick={onNext}
          disabled={!isMinReached}
          className={`gap-1.5 min-h-[44px] font-semibold rounded-[8px] cursor-pointer ${
            isMinReached
              ? 'bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14]'
              : 'bg-slate-200 dark:bg-[#27272A] text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>
            {isMinReached ? 'Avançar' : `Adicione pelo menos 3 itens (${items.length}/3)`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
