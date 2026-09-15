import React, { useMemo, useState } from 'react'
import {
  Lightbulb,
  Receipt,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
  Percent,
  FileCheck2,
  SlidersHorizontal,
  Target,
  ArrowRight,
  Sparkles,
  Sliders,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PricingState, CalculationResult } from '@/types/pricing'
import {
  StrategicInsight,
  InsightCategory,
  generateStrategicInsights,
  ActionTarget,
} from '@/lib/strategicInsightsEngine'

interface StrategicInsightsProps {
  state: PricingState
  calculation: CalculationResult
  onNavigateTab?: (tab: 'painel' | 'tributario' | 'reajuste' | 'contrato') => void
  onNavigateStep?: (step: number) => void
  onScrollToSection?: (elementId: string) => void
}

export const StrategicInsights: React.FC<StrategicInsightsProps> = ({
  state,
  calculation,
  onNavigateTab,
  onNavigateStep,
  onScrollToSection,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory | 'all'>('all')

  const insights = useMemo(() => {
    return generateStrategicInsights(state, calculation)
  }, [state, calculation])

  const filteredInsights = useMemo(() => {
    if (selectedCategory === 'all') return insights
    return insights.filter((i) => i.category === selectedCategory)
  }, [insights, selectedCategory])

  const highPriorityCount = useMemo(() => {
    return insights.filter((i) => i.priority === 'alta').length
  }, [insights])

  const handleAction = (insight: StrategicInsight) => {
    if (!insight.action) return

    const { target, tab, step, anchorId } = insight.action

    if (tab && onNavigateTab) {
      onNavigateTab(tab)
      return
    }

    if (step !== undefined && onNavigateStep) {
      onNavigateStep(step)
      return
    }

    if (anchorId && onScrollToSection) {
      onScrollToSection(anchorId)
      return
    }

    // Fallback para scroll nativo suave
    if (anchorId) {
      const el = document.getElementById(anchorId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const getCategoryIcon = (category: InsightCategory) => {
    switch (category) {
      case 'deficit':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />
      case 'tributos':
        return <Receipt className="w-4 h-4 text-[#C084FC]" />
      case 'faltas':
        return <AlertTriangle className="w-4 h-4 text-[#FB923C]" />
      case 'capacidade':
        return <Flame className="w-4 h-4 text-[#FB923C]" />
      case 'superavit':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      case 'retirada':
        return <Target className="w-4 h-4 text-[#C084FC]" />
      case 'cfp':
        return <Sparkles className="w-4 h-4 text-[#C084FC]" />
      case 'reajuste':
        return <Percent className="w-4 h-4 text-[#FB923C]" />
      case 'reserva':
      default:
        return <Lightbulb className="w-4 h-4 text-[#C084FC]" />
    }
  }

  const getPriorityBadge = (priority: StrategicInsight['priority']) => {
    switch (priority) {
      case 'alta':
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-bold border-[#FB923C]/50 bg-[#0A0A14] text-[#FB923C] px-2 py-0.5 uppercase tracking-wider"
          >
            Prioridade Alta
          </Badge>
        )
      case 'media':
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-bold border-[#C084FC]/50 bg-[#0A0A14] text-[#C084FC] px-2 py-0.5 uppercase tracking-wider"
          >
            Oportunidade
          </Badge>
        )
      case 'baixa':
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-medium border-[#27272A] bg-[#0A0A14] text-[#A1A1AA] px-2 py-0.5 uppercase tracking-wider"
          >
            Boas Práticas
          </Badge>
        )
    }
  }

  const getMetricBadgeStyle = (variant?: 'rose' | 'amber' | 'emerald' | 'purple' | 'slate') => {
    switch (variant) {
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
      case 'purple':
        return 'bg-purple-50 text-[#5B3A8E] border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900'
      case 'slate':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
    }
  }

  return (
    <Card className="bg-[#18181B] border-[#27272A] shadow-xl rounded-[16px] overflow-hidden">
      {/* Header com identidade Astral */}
      <CardHeader className="bg-[#0A0A14] border-b border-[#27272A] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-[#18181B] border border-[#27272A] text-[#C084FC] flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <CardTitle className="font-sans text-lg font-semibold text-white flex items-center gap-2">
                Insights Estratégicos & Decisões Clínicas
                <Badge
                  variant="secondary"
                  className="bg-[#18181B] text-[#C084FC] border border-[#27272A] text-[10px] font-mono font-semibold px-2"
                >
                  {insights.length} INSIGHTS
                </Badge>
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-[#A1A1AA]">
              Diagnósticos curtos e recomendações práticas acionáveis geradas a partir dos seus
              números reais.
            </CardDescription>
          </div>

          {highPriorityCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181B] border border-[#FB923C]/40 text-xs font-mono font-semibold text-[#FB923C] self-start sm:self-auto shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
              <span>{highPriorityCount} ATENÇÃO CRÍTICA</span>
            </div>
          )}
        </div>

        {/* Filtros rápidos por categoria — Astral Style */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 text-xs font-mono">
          <span className="text-[10px] font-semibold text-[#71717A] shrink-0 flex items-center gap-1 mr-1 uppercase">
            <Filter className="w-3 h-3" />
            FILTRAR:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#C084FC] text-[#0A0A14] font-bold'
                : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white'
            }`}
          >
            TODOS ({insights.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('deficit')}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'deficit'
                ? 'bg-[#FB923C] text-[#0A0A14] font-bold'
                : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white'
            }`}
          >
            PISO & LACUNA
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('tributos')}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'tributos'
                ? 'bg-[#C084FC] text-[#0A0A14] font-bold'
                : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white'
            }`}
          >
            TRIBUTOS PF×PJ
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('faltas')}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'faltas'
                ? 'bg-[#FB923C] text-[#0A0A14] font-bold'
                : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white'
            }`}
          >
            FALTAS
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('capacidade')}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'capacidade'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white'
            }`}
          >
            BURNOUT & GRADE
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('reajuste')}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'reajuste'
                ? 'bg-[#FB923C] text-[#0A0A14] font-bold'
                : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white'
            }`}
          >
            REAJUSTE
          </button>
        </div>
      </CardHeader>

      {/* Conteúdo com lista de cards escaneáveis */}
      <CardContent className="p-4 sm:p-6 space-y-3.5">
        {filteredInsights.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Nenhum insight nesta categoria no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className="group relative p-4 rounded-[12px] bg-[#121216] border border-[#27272A] hover:border-[#C084FC]/40 transition-all flex flex-col justify-between space-y-3"
              >
                {/* Linha Top: Ícone, Título e Badge de Prioridade */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-[6px] bg-[#0A0A14] flex items-center justify-center shrink-0 border border-[#27272A]">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <h4 className="font-sans font-semibold text-sm text-white leading-tight">
                        {insight.title}
                      </h4>
                    </div>
                    {getPriorityBadge(insight.priority)}
                  </div>

                  {/* Descrição curta dos dados */}
                  <p className="text-xs text-[#A1A1AA] leading-relaxed pt-0.5">
                    {insight.description}
                  </p>
                </div>

                {/* Badge métrica em destaque (se houver) */}
                {insight.metricBadge && (
                  <div className="inline-flex items-center justify-between px-2.5 py-1.5 rounded-[6px] border border-[#27272A] bg-[#0A0A14] text-xs font-mono self-start text-[#C084FC]">
                    <span className="text-[10px] text-[#71717A] mr-2 uppercase">
                      {insight.metricBadge.label}:
                    </span>
                    <strong className="font-bold">{insight.metricBadge.value}</strong>
                  </div>
                )}

                {/* Recomendação Prática e Ação de Navegação */}
                <div className="pt-2 border-t border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-[#A1A1AA] leading-snug flex-1">
                    <span className="text-[#C084FC] font-mono font-bold mr-1">RECOMENDAÇÃO:</span>
                    {insight.recommendation}
                  </div>

                  {insight.action && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(insight)}
                      className="text-xs font-mono font-semibold text-[#C084FC] hover:text-white hover:bg-[#18181B] p-1.5 h-auto self-end sm:self-auto shrink-0 gap-1 rounded-[6px]"
                    >
                      <span>{insight.action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
