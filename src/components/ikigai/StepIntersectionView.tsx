import React, { useState } from 'react'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { IntersectionId, IntersectionData, CircleItem } from '@/types/ikigai'
import { INTERSECTION_DEFINITIONS } from '@/config/ikigaiContent'

interface StepIntersectionViewProps {
  intersectionId: IntersectionId
  stepNumber: number // 1 a 4 dos encontros
  data: IntersectionData
  itemsA: CircleItem[]
  itemsB: CircleItem[]
  onChange: (text: string, notFound: boolean) => void
  onNext: () => void
  onPrev: () => void
}

export const StepIntersectionView: React.FC<StepIntersectionViewProps> = ({
  intersectionId,
  stepNumber,
  data,
  itemsA,
  itemsB,
  onChange,
  onNext,
  onPrev,
}) => {
  const def = INTERSECTION_DEFINITIONS[intersectionId]
  const [text, setText] = useState(data.text || '')
  const [notFound, setNotFound] = useState(data.notFound || false)

  const handleTextChange = (val: string) => {
    setText(val)
    if (val.trim()) {
      setNotFound(false)
      onChange(val, false)
    } else {
      onChange('', notFound)
    }
  }

  const handleNotFoundToggle = (checked: boolean) => {
    setNotFound(checked)
    if (checked) {
      setText('')
      onChange('', true)
    } else {
      onChange(text, false)
    }
  }

  const canAdvance = notFound || text.trim().length > 0

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs uppercase tracking-wider">
            Encontro {stepNumber} de 4 · Interseção
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
            {def.subtitle}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          {def.name}
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">{def.prompt}</p>
      </div>

      {/* Lado a Lado dos dois Círculos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Círculo A */}
        <Card className="astral-card p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272A] pb-2">
            <span className="text-xs font-mono font-bold uppercase text-[#7c3aed] dark:text-[#C084FC]">
              {def.circleAName}
            </span>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {itemsA.length} itens
            </Badge>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {itemsA.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum item preenchido.</p>
            ) : (
              itemsA.map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded-[6px] text-xs flex items-center gap-1.5 ${
                    item.starred
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900'
                      : 'bg-slate-50 dark:bg-[#121216] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.starred && <span className="text-amber-500">★</span>}
                  <span className="truncate">{item.text}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Círculo B */}
        <Card className="astral-card p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#27272A] pb-2">
            <span className="text-xs font-mono font-bold uppercase text-[#ea580c] dark:text-[#FB923C]">
              {def.circleBName}
            </span>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {itemsB.length} itens
            </Badge>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {itemsB.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum item preenchido.</p>
            ) : (
              itemsB.map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded-[6px] text-xs flex items-center gap-1.5 ${
                    item.starred
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900'
                      : 'bg-slate-50 dark:bg-[#121216] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.starred && <span className="text-amber-500">★</span>}
                  <span className="truncate">{item.text}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Campo para Escrever a Frase Síntese */}
      <Card className="astral-card p-6 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="intersection-statement-input"
            className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>Escreva uma frase que una os dois lados:</span>
            <span className="text-[11px] font-normal text-slate-400">Uma síntese autêntica</span>
          </label>
          <Textarea
            id="intersection-statement-input"
            value={text}
            disabled={notFound}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={def.examplePlaceholder}
            rows={3}
            className={`font-sans text-sm bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272A] focus:border-[#7c3aed] ${
              notFound ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
            }`}
          />
        </div>

        {/* Checkbox "Ainda não encontrei esse encontro" */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#27272A] flex items-start gap-3">
          <Checkbox
            id={`notfound-${intersectionId}`}
            checked={notFound}
            onCheckedChange={(c) => handleNotFoundToggle(Boolean(c))}
            className="mt-0.5"
          />
          <div className="space-y-0.5">
            <label
              htmlFor={`notfound-${intersectionId}`}
              className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Ainda não encontrei esse encontro
            </label>
            <p className="text-xs text-slate-500 dark:text-[#71717A]">
              Isso é informação diagnóstica preciosa, não erro. O app registrará essa lacuna para
              levar à reflexão na próxima etapa.
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
          <span>Voltar</span>
        </Button>

        <Button
          onClick={onNext}
          disabled={!canAdvance}
          className={`gap-1.5 min-h-[44px] font-semibold rounded-[8px] cursor-pointer ${
            canAdvance
              ? 'bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14]'
              : 'bg-slate-200 dark:bg-[#27272A] text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Avançar</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
