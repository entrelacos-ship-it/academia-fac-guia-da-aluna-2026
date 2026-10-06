import React, { useState } from 'react'
import {
  Star,
  Plus,
  Trash2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Heart,
  Award,
  Globe,
  Coins,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CircleId, CircleItem } from '@/types/ikigai'
import {
  CIRCLE_DEFINITIONS,
  CIRCLE_SUGGESTIONS,
  IKIGAI_ETHICAL_REMINDER,
} from '@/config/ikigaiContent'

interface StepMoment1CirclesProps {
  circles: Record<CircleId, CircleItem[]>
  onAddItem: (circleId: CircleId, text: string) => void
  onRemoveItem: (circleId: CircleId, id: string) => void
  onToggleStar: (circleId: CircleId, id: string) => void
  onUpdateText: (circleId: CircleId, id: string, newText: string) => void
  onNext: () => void
  onPrev: () => void
}

const CIRCLE_ICONS: Record<CircleId, React.ReactNode> = {
  love: <Heart className="w-4 h-4 text-rose-500 shrink-0" />,
  goodAt: <Award className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC] shrink-0" />,
  worldNeeds: <Globe className="w-4 h-4 text-emerald-500 shrink-0" />,
  paidFor: <Coins className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C] shrink-0" />,
}

const CIRCLE_ORDER: CircleId[] = ['love', 'goodAt', 'worldNeeds', 'paidFor']

export const StepMoment1Circles: React.FC<StepMoment1CirclesProps> = ({
  circles,
  onAddItem,
  onRemoveItem,
  onToggleStar,
  onUpdateText,
  onNext,
  onPrev,
}) => {
  const [activeCircle, setActiveCircle] = useState<CircleId>('love')
  const [inputTexts, setInputTexts] = useState<Record<CircleId, string>>({
    love: '',
    goodAt: '',
    worldNeeds: '',
    paidFor: '',
  })
  const [editingState, setEditingState] = useState<{ id: string; text: string } | null>(null)
  const [openQuestions, setOpenQuestions] = useState<Record<CircleId, boolean>>({
    love: false,
    goodAt: false,
    worldNeeds: false,
    paidFor: false,
  })

  // Validação: Mínimo 3 itens por círculo
  const missingCounts = CIRCLE_ORDER.reduce(
    (acc, id) => {
      const count = (circles[id] || []).length
      acc[id] = Math.max(0, 3 - count)
      return acc
    },
    {} as Record<CircleId, number>,
  )

  const totalMissing = Object.values(missingCounts).reduce((sum, n) => sum + n, 0)
  const allCirclesValid = totalMissing === 0

  const currentDef = CIRCLE_DEFINITIONS[activeCircle]
  const currentItems = circles[activeCircle] || []
  const starredCount = currentItems.filter((i) => i.starred).length

  const handleAdd = (circleId: CircleId, e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = (inputTexts[circleId] || '').trim()
    if (!text) return
    onAddItem(circleId, text)
    setInputTexts((prev) => ({ ...prev, [circleId]: '' }))
  }

  const startEdit = (item: CircleItem) => {
    setEditingState({ id: item.id, text: item.text })
  }

  const saveEdit = (circleId: CircleId) => {
    if (editingState && editingState.text.trim()) {
      onUpdateText(circleId, editingState.id, editingState.text.trim())
    }
    setEditingState(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Cabeçalho do Momento 1 */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs uppercase tracking-wider">
            Momento 1 · Escrever
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
            Os 4 Círculos em tela única
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Escreva o que compõe a sua prática
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          Preencha os 4 círculos com itens curtos (mínimo de 3 por círculo) e destaque com estrela
          até 3 itens centrais em cada um.
        </p>
      </div>

      {/* Seletor único dos 4 Círculos com status de progresso integrado */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CIRCLE_ORDER.map((id) => {
          const def = CIRCLE_DEFINITIONS[id]
          const count = (circles[id] || []).length
          const missing = missingCounts[id]
          const isSelected = activeCircle === id
          const stars = (circles[id] || []).filter((i) => i.starred).length

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveCircle(id)}
              aria-pressed={isSelected}
              className={`p-3.5 rounded-[12px] border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${
                isSelected
                  ? 'bg-purple-50/80 dark:bg-[#1f1730] border-[#7c3aed] ring-2 ring-[#7c3aed]/25 shadow-xs'
                  : 'bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Topo do cartão: Ícone, Nome do Círculo e Ponto de status */}
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                    {CIRCLE_ICONS[id]}
                    <span className="font-mono text-[11px] font-bold text-editorial-secondary">
                      {def.badgeText}
                    </span>
                  </div>
                  {missing === 0 ? (
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                      title="Mínimo atingido"
                    />
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-500 shrink-0"
                      title={`Faltam ${missing}`}
                    />
                  )}
                </div>

                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[32px] mb-2">
                  {def.title}
                </div>
              </div>

              {/* Base do cartão: Quantidade de itens cadastrados, estrelas e status */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#27272A]/80">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {count} {count === 1 ? 'item' : 'itens'}
                  </span>
                  <span className="text-[11px] font-mono text-editorial-secondary">
                    ★ {stars}/3
                  </span>
                </div>

                <div className="mt-1 text-[11px] font-mono">
                  {missing === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Pronto
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      Falta {missing}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Conteúdo do Círculo Ativo */}
      <Card className="astral-card p-5 sm:p-6 space-y-5">
        {/* Título e Dica Curta */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#7c3aed] dark:text-[#C084FC]">
              {currentDef.subtitle}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
              {missingCounts[activeCircle] === 0
                ? `${currentItems.length} itens cadastrados (mínimo atingido)`
                : `Faltam ${missingCounts[activeCircle]} itens para o mínimo`}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{currentDef.description}</p>
        </div>

        {/* Perguntas-Guia Recolhíveis (Visíveis só se a aluna abrir) */}
        <div className="border border-purple-100 dark:border-[#27272A] rounded-[10px] overflow-hidden bg-purple-50/30 dark:bg-[#121216]/50">
          <button
            type="button"
            onClick={() =>
              setOpenQuestions((prev) => ({ ...prev, [activeCircle]: !prev[activeCircle] }))
            }
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50/60 dark:hover:bg-[#18181B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Ver perguntas-guia para reflexão</span>
            </div>
            {openQuestions[activeCircle] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {openQuestions[activeCircle] && (
            <div className="px-4 pb-3.5 pt-1 space-y-2 border-t border-purple-100/60 dark:border-[#27272A] animate-fadeIn">
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {currentDef.questions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#7c3aed] dark:text-[#C084FC] mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Campo de Adição Rápida */}
        <form onSubmit={(e) => handleAdd(activeCircle, e)} className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={inputTexts[activeCircle] || ''}
              onChange={(e) =>
                setInputTexts((prev) => ({ ...prev, [activeCircle]: e.target.value }))
              }
              placeholder={currentDef.placeholder}
              className="flex-1 bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] text-sm h-12 sm:h-11 focus:border-[#7c3aed]"
            />
            <Button
              type="submit"
              disabled={!(inputTexts[activeCircle] || '').trim()}
              className="gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] sm:h-11 px-5 rounded-[8px] cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar item</span>
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-editorial-secondary px-1">
            <span>
              {currentItems.length} de {currentDef.minSuggested} itens recomendados
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 inline" />
              <span>{starredCount}/3 marcados como centrais</span>
            </span>
          </div>

          {/* Sugestões Clicáveis por Círculo */}
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#A1A1AA]">
              <Sparkles className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC] shrink-0" />
              <span className="font-medium">
                Sugestões rápidas para inspirar (clique para adicionar):
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(CIRCLE_SUGGESTIONS[activeCircle] || []).map((suggestion, idx) => {
                const isAlreadyAdded = currentItems.some(
                  (item) => item.text.trim().toLowerCase() === suggestion.trim().toLowerCase(),
                )
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!isAlreadyAdded) {
                        onAddItem(activeCircle, suggestion)
                      }
                    }}
                    disabled={isAlreadyAdded}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] sm:min-h-[36px] sm:py-1.5 rounded-[8px] text-xs font-normal border transition-all text-left max-w-full ${
                      isAlreadyAdded
                        ? 'opacity-40 pointer-events-none bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500'
                        : 'bg-slate-100/90 hover:bg-slate-200 dark:bg-[#18181B] dark:hover:bg-[#222228] border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-[0.98]'
                    }`}
                    title={
                      isAlreadyAdded
                        ? 'Já adicionado ao círculo'
                        : 'Clique para adicionar esta sugestão'
                    }
                  >
                    {isAlreadyAdded ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC] shrink-0" />
                    )}
                    <span className="break-words line-clamp-2 sm:line-clamp-1">{suggestion}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </form>

        {/* Lista de Itens do Círculo */}
        <div className="space-y-2 pt-1">
          {currentItems.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-[#27272A] rounded-[12px] text-slate-400 space-y-1.5">
              <p className="text-xs sm:text-sm font-medium">
                Nenhum item adicionado ainda neste círculo.
              </p>
              <p className="text-xs">
                Digite um item acima ou abra as perguntas-guia se quiser inspiração.
              </p>
            </div>
          ) : (
            currentItems.map((item) => (
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
                  onClick={() => onToggleStar(activeCircle, item.id)}
                  disabled={!item.starred && starredCount >= 3}
                  className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer shrink-0 ${
                    item.starred
                      ? 'text-amber-500 hover:text-amber-600 bg-amber-100/50 dark:bg-amber-950/40'
                      : starredCount >= 3
                        ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-[#1f1f23]'
                  }`}
                  title={
                    item.starred
                      ? 'Item central no seu IKIGAI (clique para remover estrela)'
                      : starredCount >= 3
                        ? 'Limite de 3 itens centrais por círculo atingido'
                        : 'Marcar como item central (máximo 3 por círculo)'
                  }
                  aria-label={
                    item.starred ? 'Remover destaque central' : 'Marcar como destaque central'
                  }
                >
                  <Star
                    className={`w-5 h-5 ${item.starred ? 'fill-amber-400 text-amber-500' : ''}`}
                  />
                </button>

                {/* Texto ou Campo de Edição */}
                <div className="flex-1 min-w-0">
                  {editingState && editingState.id === item.id ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Input
                        value={editingState.text}
                        onChange={(e) => setEditingState({ id: item.id, text: e.target.value })}
                        className="min-h-[44px] text-xs bg-white dark:bg-[#18181B]"
                        autoFocus
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => saveEdit(activeCircle)}
                          className="min-h-[44px] px-3 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          aria-label="Salvar edição"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          <span>Salvar</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingState(null)}
                          className="min-h-[44px] px-3 text-slate-500 cursor-pointer"
                          aria-label="Cancelar edição"
                        >
                          <X className="w-4 h-4 mr-1" />
                          <span>Cancelar</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 block break-words">
                      {item.text}
                    </span>
                  )}
                </div>

                {/* Ações */}
                {(!editingState || editingState.id !== item.id) && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[8px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f1f23] transition-colors cursor-pointer"
                      title="Editar item"
                      aria-label="Editar item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(activeCircle, item.id)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[8px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Excluir item"
                      aria-label="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Lembrete Ético Mandatório */}
      <div className="p-3 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs text-editorial-secondary flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>{IKIGAI_ETHICAL_REMINDER}</span>
      </div>

      {/* Barra de Ações Inferior */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-1.5 border-slate-200 dark:border-[#27272A] min-h-[48px] sm:min-h-[44px] cursor-pointer w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </Button>

        <Button
          onClick={onNext}
          disabled={!allCirclesValid}
          className={`gap-1.5 min-h-[48px] sm:min-h-[44px] font-semibold rounded-[8px] cursor-pointer w-full sm:w-auto ${
            allCirclesValid
              ? 'bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14]'
              : 'bg-slate-200 dark:bg-[#27272A] text-slate-400 cursor-not-allowed'
          }`}
        >
          <span className="truncate">
            {allCirclesValid
              ? 'Avançar para Conectar (Encontros)'
              : `Complete os 4 círculos (${totalMissing} pendentes)`}
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Button>
      </div>
    </div>
  )
}
export default StepMoment1Circles
