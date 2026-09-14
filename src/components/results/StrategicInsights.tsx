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
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
      case 'tributos':
        return <Receipt className="w-4 h-4 text-[#5B3A8E] dark:text-purple-300" />
      case 'faltas':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      case 'capacidade':
        return <Flame className="w-4 h-4 text-rose-500 dark:text-rose-400" />
      case 'superavit':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      case 'retirada':
        return <Target className="w-4 h-4 text-[#5B3A8E] dark:text-purple-300" />
      case 'cfp':
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
      case 'reajuste':
        return <Percent className="w-4 h-4 text-[#16746E] dark:text-emerald-400" />
      case 'reserva':
      default:
        return <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-300" />
    }
  }

  const getPriorityBadge = (priority: StrategicInsight['priority']) => {
    switch (priority) {
      case 'alta':
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-bold border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 px-2 py-0.5"
          >
            Atenção Crítica
          </Badge>
        )
      case 'media':
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-bold border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5"
          >
            Oportunidade
          </Badge>
        )
      case 'baixa':
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-medium border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 px-2 py-0.5"
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
    <Card className="border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Header com identidade Entrelaços */}
      <CardHeader className="bg-gradient-to-r from-purple-500/5 via-transparent to-emerald-500/5 dark:from-purple-950/20 dark:to-transparent border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#5B3A8E] text-white flex items-center justify-center shadow-xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <CardTitle className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Insights Estratégicos & Decisões Clínicas
                <Badge
                  variant="secondary"
                  className="bg-[#EDE8F5] text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300 text-xs font-semibold px-2"
                >
                  {insights.length} {insights.length === 1 ? 'dica' : 'dicas'}
                </Badge>
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Diagnósticos curtos e recomendações práticas acionáveis geradas a partir dos seus
              números reais.
            </CardDescription>
          </div>

          {highPriorityCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 self-start sm:self-auto shrink-0">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{highPriorityCount} ponto(s) de atenção crítica</span>
            </div>
          )}
        </div>

        {/* Filtros rápidos por categoria */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#5B3A8E] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Todos ({insights.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('deficit')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'deficit'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Piso & Lacuna
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('tributos')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'tributos'
                ? 'bg-[#5B3A8E] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tributos & PF×PJ
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('faltas')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'faltas'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Faltas
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('capacidade')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'capacidade'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Burnout & Grade
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('reajuste')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedCategory === 'reajuste'
                ? 'bg-[#16746E] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Reajuste
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
                className="group relative p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs"
              >
                {/* Linha Top: Ícone, Título e Badge de Prioridade */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {insight.title}
                      </h4>
                    </div>
                    {getPriorityBadge(insight.priority)}
                  </div>

                  {/* Descrição curta dos dados */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                    {insight.description}
                  </p>
                </div>

                {/* Badge métrica em destaque (se houver) */}
                {insight.metricBadge && (
                  <div
                    className={`inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium self-start ${getMetricBadgeStyle(
                      insight.metricBadge.variant,
                    )}`}
                  >
                    <span className="text-[11px] opacity-80 mr-2">
                      {insight.metricBadge.label}:
                    </span>
                    <strong className="font-mono font-bold">{insight.metricBadge.value}</strong>
                  </div>
                )}

                {/* Recomendação Prática e Ação de Navegação */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug flex-1">
                    <span className="text-[#5B3A8E] dark:text-purple-400 font-bold mr-1">
                      Recomendação:
                    </span>
                    {insight.recommendation}
                  </div>

                  {insight.action && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(insight)}
                      className="text-xs font-semibold text-[#5B3A8E] dark:text-purple-300 hover:text-[#452A6F] hover:bg-purple-50 dark:hover:bg-purple-950/50 p-1.5 h-auto self-end sm:self-auto shrink-0 gap-1"
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
