import React from 'react'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IkigaiState } from '@/types/ikigai'
import { CIRCLE_DEFINITIONS, INTERSECTION_DEFINITIONS } from '@/config/ikigaiContent'
import { diagnoseEmptyIntersections } from '@/lib/ikigaiEngine'

interface StepPanelReadingProps {
  state: IkigaiState
  onNext: () => void
  onPrev: () => void
}

export const StepPanelReading: React.FC<StepPanelReadingProps> = ({ state, onNext, onPrev }) => {
  const diag = diagnoseEmptyIntersections(state)

  const dominantDef = diag.dominantCircle ? CIRCLE_DEFINITIONS[diag.dominantCircle] : null
  const leanestDef = diag.leanestCircle ? CIRCLE_DEFINITIONS[diag.leanestCircle] : null

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs uppercase tracking-wider">
            Leitura Estrutural · Diagnóstico dos Vazios
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
            Sem IA · Análise Heurística Ética
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          A Leitura do seu Painel
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          O propósito nasce do equilíbrio e do reconhecimento honesto dos vazios. A precarização do
          trabalho é estrutural, não falha individual. Veja como seus círculos conversam hoje:
        </p>
      </div>

      {/* Balanço dos Círculos: Mais Itens vs Menos Itens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mais Itens */}
        <Card className="astral-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Círculo mais abundante</span>
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {diag.dominantCircle ? diag.circleCounts[diag.dominantCircle] : 0} itens
            </Badge>
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {dominantDef ? dominantDef.title : 'Distribuição uniforme'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">
            Este é o território onde sua mente transborda repertório e referências espontâneas.
          </p>
        </Card>

        {/* Menos Itens */}
        <Card className="astral-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-500" />
              <span>Círculo mais enxuto</span>
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {diag.leanestCircle ? diag.circleCounts[diag.leanestCircle] : 0} itens
            </Badge>
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {leanestDef ? leanestDef.title : 'Distribuição uniforme'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">
            Aqui está um espaço de acolhimento. Um círculo mais enxuto aponta onde você precisa de
            novas ferramentas e permissão para construir.
          </p>
        </Card>
      </div>

      {/* Reflexão Principal da Combinação dos Vazios */}
      <Card className="astral-card p-6 border-[#7c3aed]/40 bg-purple-50/50 dark:bg-[#121216] space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              Diagnóstico Central de Autoria
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {diag.primaryReflection.title}
            </h2>
          </div>
          <Badge
            className={
              diag.emptyKeys.length === 0
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
            }
          >
            {diag.emptyKeys.length === 0
              ? 'Integrado'
              : `${diag.emptyKeys.length} encontro(s) em aberto`}
          </Badge>
        </div>

        <blockquote className="p-3.5 rounded-[8px] bg-white dark:bg-[#18181B] border-l-4 border-[#7c3aed] text-sm text-slate-800 dark:text-slate-200 font-medium italic">
          "{diag.primaryReflection.body}"
        </blockquote>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
          {diag.primaryReflection.guidance}
        </p>
      </Card>

      {/* Lista dos Encontros em Aberto ou Consolidados */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Detalhamento dos Encontros:
        </h2>

        <div className="space-y-2">
          {(['passion', 'mission', 'vocation', 'profession'] as const).map((key) => {
            const def = INTERSECTION_DEFINITIONS[key]
            const inter = state.intersections[key]
            const isEmpty = inter.notFound || !inter.text?.trim()
            return (
              <div
                key={key}
                className="p-3.5 rounded-[10px] bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {def.name} ({def.subtitle})
                    </span>
                    {isEmpty ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        Em aberto
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        Preenchido
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-[#A1A1AA]">
                    {isEmpty
                      ? 'Marcado como ainda não encontrado. Oportunidade para debater no encontro ao vivo.'
                      : `"${inter.text.trim()}"`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Perguntas Abertas para Levar ao Encontro ao Vivo */}
      <Card className="astral-card p-6 bg-orange-50/40 dark:bg-[#121216]/60 border-orange-200 dark:border-[#27272A] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C]">
          <HelpCircle className="w-4 h-4" />
          <span>Perguntas para você levar ao Encontro ao Vivo da Academia:</span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {diag.discussionQuestions.map((q, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[#ea580c] dark:text-[#FB923C] mt-0.5">
                •
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Barra de Ações Inferior */}
      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-1.5 border-slate-200 dark:border-[#27272A] min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Encontros</span>
        </Button>

        <Button
          onClick={onNext}
          className="gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[44px] rounded-[8px] cursor-pointer"
        >
          <span>Ir para a Declaração de Missão</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
