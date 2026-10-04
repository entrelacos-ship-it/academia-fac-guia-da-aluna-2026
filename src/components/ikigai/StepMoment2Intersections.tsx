import React, { useState } from 'react'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { IntersectionId, IntersectionData, CircleItem, CircleId } from '@/types/ikigai'
import { INTERSECTION_DEFINITIONS, CIRCLE_DEFINITIONS } from '@/config/ikigaiContent'

interface StepMoment2IntersectionsProps {
  intersections: Record<IntersectionId, IntersectionData>
  circles: Record<CircleId, CircleItem[]>
  onChangeIntersection: (id: IntersectionId, text: string, notFound: boolean) => void
  onNext: () => void
  onPrev: () => void
}

const INTERSECTION_ORDER: IntersectionId[] = ['passion', 'mission', 'vocation', 'profession']

export const StepMoment2Intersections: React.FC<StepMoment2IntersectionsProps> = ({
  intersections,
  circles,
  onChangeIntersection,
  onNext,
  onPrev,
}) => {
  const [activeTab, setActiveTab] = useState<IntersectionId>('passion')
  const [showCirclesDetails, setShowCirclesDetails] = useState<Record<IntersectionId, boolean>>({
    passion: true,
    mission: false,
    vocation: false,
    profession: false,
  })

  // Checagem se todos os 4 encontros têm resposta (texto preenchido ou checkbox marcado)
  const isComplete = (id: IntersectionId) => {
    const data = intersections[id]
    if (!data) return false
    return Boolean(data.notFound || (data.text && data.text.trim().length > 0))
  }

  const completedCount = INTERSECTION_ORDER.filter(isComplete).length
  const allComplete = completedCount === 4

  const activeDef = INTERSECTION_DEFINITIONS[activeTab]
  const activeData = intersections[activeTab] || { text: '', notFound: false }
  const itemsA = circles[activeDef.circleAId] || []
  const itemsB = circles[activeDef.circleBId] || []

  const handleTextChange = (id: IntersectionId, val: string) => {
    const current = intersections[id] || { text: '', notFound: false }
    if (val.trim()) {
      onChangeIntersection(id, val, false)
    } else {
      onChangeIntersection(id, '', current.notFound)
    }
  }

  const handleNotFoundToggle = (id: IntersectionId, checked: boolean) => {
    const current = intersections[id] || { text: '', notFound: false }
    if (checked) {
      onChangeIntersection(id, '', true)
    } else {
      onChangeIntersection(id, current.text || '', false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs uppercase tracking-wider">
            Momento 2 · Conectar
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
            Os 4 Encontros em tela única
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Conecte seus círculos nos 4 encontros
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          Para cada encontro, escreva uma frase síntese conectando os dois lados ou marque se ainda
          não o encontrou. Lacunas também são diagnósticos valiosos.
        </p>
      </div>

      {/* Cartões Resumo dos 4 Encontros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {INTERSECTION_ORDER.map((id, idx) => {
          const def = INTERSECTION_DEFINITIONS[id]
          const data = intersections[id]
          const complete = isComplete(id)
          const isSelected = activeTab === id
          const isNotFound = Boolean(data?.notFound)

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`p-3 rounded-[12px] border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/70 dark:bg-[#1f1730] border-[#7c3aed] ring-2 ring-[#7c3aed]/20 shadow-xs'
                  : 'bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-[#71717A]">
                  0{idx + 1}
                </span>
                {complete ? (
                  isNotFound ? (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-500 shrink-0"
                      title="Em aberto (não encontrado)"
                    />
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                      title="Preenchido"
                    />
                  )
                ) : (
                  <span
                    className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"
                    title="Pendente"
                  />
                )}
              </div>

              <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {def.name}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-[#71717A] truncate">
                {def.subtitle.replace('Encontro entre ', '')}
              </div>

              <div className="mt-1 text-[11px] font-mono">
                {complete ? (
                  isNotFound ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      Em aberto
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Preenchido
                    </span>
                  )
                ) : (
                  <span className="text-slate-400 dark:text-slate-600">Pendente</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Abas dos 4 Encontros */}
      <div className="flex border-b border-slate-200 dark:border-[#27272A] gap-1 overflow-x-auto scrollbar-none">
        {INTERSECTION_ORDER.map((id, idx) => {
          const def = INTERSECTION_DEFINITIONS[id]
          const isSelected = activeTab === id
          const complete = isComplete(id)
          const isNotFound = Boolean(intersections[id]?.notFound)

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'border-[#7c3aed] text-[#7c3aed] dark:text-[#C084FC] font-semibold'
                  : 'border-transparent text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="font-mono text-xs opacity-70">0{idx + 1}.</span>
              <span>{def.name}</span>
              {complete && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isNotFound ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Conteúdo do Encontro Selecionado */}
      <Card className="astral-card p-5 sm:p-6 space-y-5">
        {/* Título e Dica Curta */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#7c3aed] dark:text-[#C084FC]">
              {activeDef.subtitle}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
              Encontro {INTERSECTION_ORDER.indexOf(activeTab) + 1} de 4
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{activeDef.name}</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
            {activeDef.prompt}
          </p>
        </div>

        {/* Lado a Lado dos dois Círculos Envolvidos (Recolhível ou Direto) */}
        <div className="border border-slate-200 dark:border-[#27272A] rounded-[10px] overflow-hidden bg-slate-50/50 dark:bg-[#121216]">
          <button
            type="button"
            onClick={() =>
              setShowCirclesDetails((prev) => ({ ...prev, [activeTab]: !prev[activeTab] }))
            }
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18181B] transition-colors cursor-pointer"
          >
            <span className="font-bold flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>
                Ver itens de {activeDef.circleAName} e {activeDef.circleBName}
              </span>
            </span>
            {showCirclesDetails[activeTab] ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showCirclesDetails[activeTab] && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0E0E12] animate-fadeIn">
              {/* Lado A */}
              <div className="space-y-1.5 p-3 rounded-[8px] bg-purple-50/30 dark:bg-[#18181B] border border-purple-100 dark:border-[#27272A]">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#7c3aed] dark:text-[#C084FC]">
                  <span>{activeDef.circleAName}</span>
                  <span className="text-[10px] text-slate-400">{itemsA.length} itens</span>
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {itemsA.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-1">
                      Nenhum item adicionado ainda neste círculo
                    </p>
                  ) : (
                    itemsA.map((it) => (
                      <div
                        key={it.id}
                        className={`text-xs p-1.5 rounded flex items-start gap-1.5 ${
                          it.starred
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-amber-500 text-[11px] mt-0.5">
                          {it.starred ? '★' : '•'}
                        </span>
                        <span className="truncate">{it.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Lado B */}
              <div className="space-y-1.5 p-3 rounded-[8px] bg-orange-50/30 dark:bg-[#18181B] border border-orange-100 dark:border-[#27272A]">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#ea580c] dark:text-[#FB923C]">
                  <span>{activeDef.circleBName}</span>
                  <span className="text-[10px] text-slate-400">{itemsB.length} itens</span>
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {itemsB.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-1">
                      Nenhum item adicionado ainda neste círculo
                    </p>
                  ) : (
                    itemsB.map((it) => (
                      <div
                        key={it.id}
                        className={`text-xs p-1.5 rounded flex items-start gap-1.5 ${
                          it.starred
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-amber-500 text-[11px] mt-0.5">
                          {it.starred ? '★' : '•'}
                        </span>
                        <span className="truncate">{it.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Campo para Escrever a Frase Síntese */}
        <div className="space-y-2">
          <label
            htmlFor={`input-${activeTab}`}
            className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>Frase que une os dois lados:</span>
            <span className="text-[11px] font-normal text-slate-400">Síntese autêntica</span>
          </label>
          <Textarea
            id={`input-${activeTab}`}
            value={activeData.text || ''}
            disabled={activeData.notFound}
            onChange={(e) => handleTextChange(activeTab, e.target.value)}
            placeholder={activeDef.examplePlaceholder}
            rows={3}
            className={`font-sans text-sm bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] focus:border-[#7c3aed] ${
              activeData.notFound
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-[#18181B]'
                : ''
            }`}
          />
        </div>

        {/* Checkbox "Ainda não encontrei esse encontro" */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#27272A] flex items-start gap-3">
          <Checkbox
            id={`notfound-${activeTab}`}
            checked={Boolean(activeData.notFound)}
            onCheckedChange={(c) => handleNotFoundToggle(activeTab, Boolean(c))}
            className="mt-0.5"
          />
          <div className="space-y-0.5">
            <label
              htmlFor={`notfound-${activeTab}`}
              className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Ainda não encontrei esse encontro
            </label>
            <p className="text-xs text-slate-500 dark:text-[#71717A]">
              Isso é informação diagnóstica preciosa, não erro. O painel apontará essa lacuna para
              você trabalhar.
            </p>
          </div>
        </div>
      </Card>

      {/* Barra de Ações Inferior */}
      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-1.5 border-slate-200 dark:border-[#27272A] min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Círculos</span>
        </Button>

        <Button
          onClick={onNext}
          disabled={!allComplete}
          className={`gap-1.5 min-h-[44px] font-semibold rounded-[8px] cursor-pointer ${
            allComplete
              ? 'bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14]'
              : 'bg-slate-200 dark:bg-[#27272A] text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>
            {allComplete
              ? 'Avançar para o Painel'
              : `Complete os 4 encontros (${4 - completedCount} pendentes)`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
export default StepMoment2Intersections
