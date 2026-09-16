import React, { useState, useEffect, useMemo } from 'react'
import {
  Wallet,
  ShieldCheck,
  Target,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Sliders,
  DollarSign,
  ArrowUpRight,
  Percent,
  Check,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { CurrencyInput } from '@/components/CurrencyInput'
import { formatBRL, formatNumberBR } from '@/lib/currency'
import {
  FinancialGoal,
  FinancialPlanningState,
  DEFAULT_FINANCIAL_PLANNING_STATE,
  calculateCashFlow,
  calculateEmergencyReserve,
  calculateGoalMonthlyContribution,
  generateGrowthProjection,
  GoalPriority,
} from '@/lib/financialPlanningMath'
import { INFLATION_PRESETS } from '@/lib/readjustmentMath'
import { PricingState, CalculationResult } from '@/types/pricing'

const STORAGE_KEY_FINPLAN = 'entrelacos_fac_finplan_v1'

interface FinancialPlanningModuleProps {
  state: PricingState
  calculation: CalculationResult
}

export const FinancialPlanningModule: React.FC<FinancialPlanningModuleProps> = ({
  state,
  calculation,
}) => {
  // Estado local com persistência em localStorage
  const [finState, setFinState] = useState<FinancialPlanningState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINPLAN)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...DEFAULT_FINANCIAL_PLANNING_STATE,
          ...parsed,
          goals:
            parsed.goals && Array.isArray(parsed.goals)
              ? parsed.goals
              : DEFAULT_FINANCIAL_PLANNING_STATE.goals,
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar planejamento financeiro:', e)
    }
    return DEFAULT_FINANCIAL_PLANNING_STATE
  })

  // Salvar no localStorage sempre que finState for modificado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FINPLAN, JSON.stringify(finState))
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('entrelacos_fac_data_changed'))
      }
    } catch (e) {
      console.warn('Erro ao salvar planejamento financeiro:', e)
    }
  }, [finState])

  // Preço e sessões de referência para o fluxo de caixa
  const precoSessaoUsado = state.precoAtual > 0 ? state.precoAtual : calculation.pisoMinimoSessao
  const sessoesEfetivas = calculation.sessoesEfetivas
  const custosProfissionais = calculation.somaCustosProfissionais
  const custoVidaPessoal = calculation.somaCustosPessoais

  // 1. Cálculos de Fluxo de Caixa Mensal
  const cashFlow = useMemo(() => {
    return calculateCashFlow(
      precoSessaoUsado,
      sessoesEfetivas,
      custosProfissionais,
      state.tributosPct,
      state.reservaPct,
      state.retiradaDesejada,
      custoVidaPessoal,
      state.precoAtual > 0,
    )
  }, [
    precoSessaoUsado,
    sessoesEfetivas,
    custosProfissionais,
    state.tributosPct,
    state.reservaPct,
    state.retiradaDesejada,
    custoVidaPessoal,
    state.precoAtual,
  ])

  // Dados para o Gráfico de Barras do Fluxo de Caixa (Entradas vs Saídas vs Custo de Vida)
  const cashFlowChartData = useMemo(() => {
    return [
      {
        name: 'Faturamento Bruto',
        valor: cashFlow.faturamentoBrutoReal,
        fill: '#C084FC', // Roxo Astral
        categoria: 'Entrada',
      },
      {
        name: 'Custos Profissionais',
        valor: cashFlow.custosProfissionais,
        fill: '#FB923C', // Laranja Astral
        categoria: 'Saída Clínica',
      },
      {
        name: 'Provisão Tributos',
        valor: cashFlow.provisaoTributos,
        fill: '#EF4444', // Vermelho/Rosa alerta
        categoria: 'Saída Fiscal',
      },
      {
        name: 'Provisão Reserva FAC',
        valor: cashFlow.provisaoReserva,
        fill: '#A855F7',
        categoria: 'Poupança Clínica',
      },
      {
        name: 'Retirada / Pró-Labore',
        valor: cashFlow.retiradaLivre,
        fill: '#38BDF8', // Azul ciano
        categoria: 'Remuneração',
      },
      {
        name: 'Custo Vida (Passo 1)',
        valor: cashFlow.custoVidaPessoal,
        fill: '#E2E8F0',
        categoria: 'Custo de Vida',
      },
    ]
  }, [cashFlow])

  // 2. Cálculos da Reserva de Emergência
  const despesaEssencialReferencia =
    finState.despesasMensaisEssenciaisManual && finState.despesasMensaisEssenciaisManual > 0
      ? finState.despesasMensaisEssenciaisManual
      : custoVidaPessoal + custosProfissionais

  const emergencyReserve = useMemo(() => {
    return calculateEmergencyReserve(
      finState.capitalAcumuladoReserva,
      despesaEssencialReferencia,
      finState.mesesMetaReserva,
      finState.prazoMesesParaAtingirReserva,
    )
  }, [
    finState.capitalAcumuladoReserva,
    despesaEssencialReferencia,
    finState.mesesMetaReserva,
    finState.prazoMesesParaAtingirReserva,
  ])

  // 3. Gerenciamento de Metas Financeiras (CRUD)
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState(3000)
  const [newGoalSaved, setNewGoalSaved] = useState(0)
  const [newGoalMonths, setNewGoalMonths] = useState(6)
  const [newGoalPriority, setNewGoalPriority] = useState<GoalPriority>('alta')
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editSavedValue, setEditSavedValue] = useState(0)

  const handleAddGoal = () => {
    if (!newGoalName.trim() || newGoalTarget <= 0) return

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      name: newGoalName.trim(),
      targetAmount: newGoalTarget,
      savedAmount: Math.max(0, newGoalSaved),
      deadlineMonths: Math.max(1, newGoalMonths),
      priority: newGoalPriority,
      createdAt: new Date().toISOString(),
    }

    setFinState((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }))

    // Reset formulário
    setNewGoalName('')
    setNewGoalTarget(3000)
    setNewGoalSaved(0)
    setNewGoalMonths(6)
    setNewGoalPriority('alta')
    setIsAddingGoal(false)
  }

  const handleDeleteGoal = (id: string) => {
    setFinState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }))
  }

  const handleUpdateGoalSaved = (id: string, newSaved: number) => {
    setFinState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, savedAmount: Math.max(0, newSaved) } : g,
      ),
    }))
    setEditingGoalId(null)
  }

  // Total de aportes mensais necessários somando todas as metas ativas
  const totalAportesMetasMensais = useMemo(() => {
    return finState.goals.reduce((acc, g) => {
      const calc = calculateGoalMonthlyContribution(g)
      return acc + calc.monthlyContribution
    }, 0)
  }, [finState.goals])

  // 4. Projeção de Crescimento (12 a 24 meses)
  const projectionPoints = useMemo(() => {
    return generateGrowthProjection(
      precoSessaoUsado,
      sessoesEfetivas,
      custosProfissionais,
      state.tributosPct,
      state.reservaPct,
      state.retiradaDesejada,
      finState.capitalAcumuladoReserva,
      {
        projectionMonths: finState.projectionMonths,
        crescimentoPrecoPct: finState.crescimentoPrecoPct,
        crescimentoSessoesPct: finState.crescimentoSessoesPct,
        aplicarIndiceInflacao: finState.aplicarIndiceInflacao,
        indiceInflacaoAnualPct: finState.indiceInflacaoAnualPct,
      },
    )
  }, [
    precoSessaoUsado,
    sessoesEfetivas,
    custosProfissionais,
    state.tributosPct,
    state.reservaPct,
    state.retiradaDesejada,
    finState.capitalAcumuladoReserva,
    finState.projectionMonths,
    finState.crescimentoPrecoPct,
    finState.crescimentoSessoesPct,
    finState.aplicarIndiceInflacao,
    finState.indiceInflacaoAnualPct,
  ])

  // Resumo de projeção ao final do período
  const finalPoint = projectionPoints[projectionPoints.length - 1]

  return (
    <div className="space-y-8">
      {/* Cabeçalho do Módulo Astral */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-purple-200 dark:border-[#27272A] bg-purple-50 dark:bg-[#0A0A14] text-[#7c3aed] dark:text-[#C084FC] font-mono font-semibold text-[10px] px-2.5 py-0.5"
            >
              MÓDULO 4 · GESTÃO E PROJEÇÃO PATRIMONIAL
            </Badge>
            <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
              Fluxo · Reserva · Metas · Projeção 12–24m
            </span>
          </div>
          <h3 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mt-1.5">
            Planejamento Financeiro da Psicóloga
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] max-w-3xl mt-0.5">
            Consolide suas entradas e saídas mensais, estruture sua blindagem contra imprevistos,
            acompanhe metas estratégicas e projete a trajetória financeira do seu consultório nos
            próximos 12 a 24 meses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="secondary"
            className="bg-orange-50 dark:bg-[#18181B] text-[#ea580c] dark:text-[#FB923C] border border-orange-200 dark:border-[#27272A] font-mono text-xs px-3 py-1.5"
          >
            Sessão Ref.: {formatBRL(precoSessaoUsado)}
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SEÇÃO: FLUXO DE CAIXA MENSAL                                           */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                1. Fluxo de Caixa Mensal Consolidado
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                Entradas reais vs. saídas estruturadas e comparação direta com o seu custo de vida
                pessoal.
              </p>
            </div>
          </div>

          <Badge
            className={`font-mono text-xs px-2.5 py-1 ${
              cashFlow.isSuperavitario
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/40'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-500/40'
            }`}
          >
            {cashFlow.isSuperavitario ? 'SUPERÁVIT CLÍNICO' : 'DÉFICIT DETECTADO'}
          </Badge>
        </div>

        {/* Card Destaque do Veredito Astral */}
        <div
          className={`p-5 rounded-[16px] bg-white dark:bg-[#18181B] border transition-all ${
            cashFlow.isSuperavitario
              ? 'border-purple-200 dark:border-[#C084FC]/50 shadow-md dark:shadow-xl'
              : 'border-rose-300 dark:border-rose-500/50 shadow-md dark:shadow-xl'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Coluna 1: Entradas */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA] block">
                Entradas (Faturamento Bruto Real)
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {formatBRL(cashFlow.faturamentoBrutoReal)}
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
                {cashFlow.sessoesEfetivas} sessões/mês × {formatBRL(cashFlow.precoPorSessao)}
                {cashFlow.isUsandoPrecoAtual ? ' (preço atual informado)' : ' (piso mínimo FAC)'}
              </div>
            </div>

            {/* Coluna 2: Saídas Operacionais */}
            <div className="space-y-1 md:border-x md:border-slate-200 dark:md:border-[#27272A] md:px-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block">
                Total de Saídas Operacionais
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#ea580c] dark:text-[#FB923C]">
                {formatBRL(cashFlow.totalSaidasOperacionais)}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-[#71717A] space-y-0.5">
                <div>Custos Prof.: {formatBRL(cashFlow.custosProfissionais)}</div>
                <div>
                  Impostos + Reserva ({state.tributosPct + state.reservaPct}%):{' '}
                  {formatBRL(cashFlow.provisaoTributos + cashFlow.provisaoReserva)}
                </div>
                <div>Retirada Livre: {formatBRL(cashFlow.retiradaLivre)}</div>
              </div>
            </div>

            {/* Coluna 3: Saldo Frente ao Custo de Vida */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                Saldo Frente ao Custo de Vida
              </span>
              <div
                className={`font-mono text-2xl sm:text-3xl font-bold ${
                  cashFlow.isSuperavitario
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {cashFlow.saldoLiquidoVida >= 0 ? '+' : ''}
                {formatBRL(cashFlow.saldoLiquidoVida)}
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                {cashFlow.vereditoTexto}
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras do Fluxo Consolidado */}
        <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px]">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-[#27272A]/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="font-sans text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                Composição Comparativa das Entradas e Saídas Mensais
              </CardTitle>
              <span className="text-xs font-mono text-slate-500 dark:text-[#71717A]">
                Custo de Vida Pessoal Base: {formatBRL(cashFlow.custoVidaPessoal)}/mês
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashFlowChartData}
                  margin={{ top: 15, right: 15, left: 15, bottom: 25 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    className="dark:stroke-[#27272A]"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-slate-500 dark:text-[#A1A1AA]"
                    interval={0}
                    tickFormatter={(v) => (v.length > 14 ? `${v.slice(0, 12)}…` : v)}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-slate-500 dark:text-[#A1A1AA]"
                    tickFormatter={(v) => `R$ ${(v / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    formatter={(val: unknown) => [
                      formatBRL(typeof val === 'number' ? val : 0),
                      'Valor Mensal',
                    ]}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      const p = payload[0]
                      return (
                        <div className="bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] rounded-[8px] p-2.5 shadow-lg text-xs font-mono">
                          <span className="text-slate-600 dark:text-[#A1A1AA] block">{p.name}</span>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {formatBRL(Number(p.value) || 0)}
                          </span>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {cashFlowChartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda Resumida */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-[#27272A] text-xs font-mono">
              {cashFlowChartData.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-slate-600 dark:text-[#A1A1AA] truncate text-[10px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {formatBRL(item.valor)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 2. SEÇÃO: RESERVA DE EMERGÊNCIA                                           */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] flex items-center justify-center text-[#ea580c] dark:text-[#FB923C]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                2. Blindagem e Reserva de Emergência
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                Cálculo de meses de cobertura, meta canônica de sobrevivência e plano de aportes
                mensais.
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-orange-200 dark:border-[#27272A] bg-orange-50 dark:bg-[#0A0A14] text-[#ea580c] dark:text-[#FB923C] font-mono text-xs px-2.5 py-1"
          >
            Cobertura: {emergencyReserve.mesesCoberturaAtual.toFixed(1)} /{' '}
            {emergencyReserve.metaMeses} meses
          </Badge>
        </div>

        {/* Inputs de Configuração da Reserva e Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card de Configuração */}
          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                Parâmetros da Reserva
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                Informe o valor já acumulado e o prazo desejado para atingir a meta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CurrencyInput
                id="capital-acumulado"
                label="Capital Já Acumulado em Reserva"
                value={finState.capitalAcumuladoReserva}
                onChange={(val) =>
                  setFinState((prev) => ({ ...prev, capitalAcumuladoReserva: val }))
                }
                helperText="Em conta de alta liquidez (CDB 100% CDI, Tesouro Selic)."
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="meta-meses"
                    className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-[#A1A1AA]"
                  >
                    Meta de Cobertura
                  </Label>
                  <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
                    {finState.mesesMetaReserva} meses
                  </span>
                </div>
                <Slider
                  id="meta-meses"
                  value={[finState.mesesMetaReserva]}
                  min={3}
                  max={12}
                  step={1}
                  onValueChange={(vals) =>
                    setFinState((prev) => ({ ...prev, mesesMetaReserva: vals[0] }))
                  }
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
                  <span>3 meses (mínimo)</span>
                  <span>6 meses (padrão FAC)</span>
                  <span>12 meses</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="prazo-atingir"
                    className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-[#A1A1AA]"
                  >
                    Prazo para Atingir a Meta (X meses)
                  </Label>
                  <span className="font-mono text-xs font-bold text-[#ea580c] dark:text-[#FB923C]">
                    {finState.prazoMesesParaAtingirReserva} meses
                  </span>
                </div>
                <Slider
                  id="prazo-atingir"
                  value={[finState.prazoMesesParaAtingirReserva]}
                  min={3}
                  max={36}
                  step={1}
                  onValueChange={(vals) =>
                    setFinState((prev) => ({ ...prev, prazoMesesParaAtingirReserva: vals[0] }))
                  }
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
                  <span>3 meses</span>
                  <span>12 meses</span>
                  <span>36 meses</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-[#27272A]">
                <CurrencyInput
                  id="despesas-essenciais-manual"
                  label="Despesas Mensais Essenciais"
                  value={
                    finState.despesasMensaisEssenciaisManual &&
                    finState.despesasMensaisEssenciaisManual > 0
                      ? finState.despesasMensaisEssenciaisManual
                      : despesaEssencialReferencia
                  }
                  onChange={(val) =>
                    setFinState((prev) => ({ ...prev, despesasMensaisEssenciaisManual: val }))
                  }
                  helperText="Custo de vida pessoal + custos fixos do consultório."
                />
              </div>
            </CardContent>
          </Card>

          {/* Card Diagnóstico da Reserva (2 cols desktop) */}
          <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px] lg:col-span-2 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                  Diagnóstico e Plano de Aporte da Reserva
                </CardTitle>
                <Badge
                  className={`font-mono text-xs ${
                    emergencyReserve.status === 'meta_atingida'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40'
                      : emergencyReserve.status === 'confortavel'
                        ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/40'
                        : emergencyReserve.status === 'atencao'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/40'
                          : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40'
                  }`}
                >
                  {emergencyReserve.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                {emergencyReserve.statusTexto}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Barra de Progresso Astral */}
              <div className="space-y-2 p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className="text-slate-600 dark:text-[#A1A1AA]">
                    Progresso até a Meta de {emergencyReserve.metaMeses} Meses:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {formatNumberBR(emergencyReserve.percentualConcluido, 1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#0A0A14] border border-slate-300 dark:border-[#27272A] rounded-full h-3.5 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#7c3aed] to-[#ea580c] dark:from-[#C084FC] dark:to-[#FB923C]"
                    style={{
                      width: `${Math.min(100, Math.max(3, emergencyReserve.percentualConcluido))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-[#71717A] pt-1">
                  <span>Atual: {formatBRL(emergencyReserve.capitalAcumulado)}</span>
                  <span>Alvo: {formatBRL(emergencyReserve.valorAlvoReserva)}</span>
                </div>
              </div>

              {/* Grid Bento de Métricas da Reserva */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717A] block">
                    Meta Total ({emergencyReserve.metaMeses} meses)
                  </span>
                  <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                    {formatBRL(emergencyReserve.valorAlvoReserva)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                    {formatBRL(emergencyReserve.custoMensalEssencial)}/mês
                  </span>
                </div>

                <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA] block">
                    Quanto Falta
                  </span>
                  <div className="font-mono text-2xl font-bold text-[#ea580c] dark:text-[#FB923C]">
                    {formatBRL(emergencyReserve.valorFaltante)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                    {emergencyReserve.valorFaltante === 0 ? 'Meta já alcançada' : 'A ser acumulado'}
                  </span>
                </div>

                <div className="p-4 rounded-[12px] bg-purple-50/60 dark:bg-[#121216] border border-purple-200 dark:border-[#C084FC]/40 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block">
                    Aporte Mensal Necessário
                  </span>
                  <div className="font-mono text-2xl font-bold text-[#7c3aed] dark:text-[#C084FC]">
                    {formatBRL(emergencyReserve.aporteMensalNecessario)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 dark:text-[#A1A1AA]">
                    ao longo de {emergencyReserve.prazoMeses} meses
                  </span>
                </div>
              </div>

              {/* Nota Estratégica Astral */}
              <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] text-xs font-mono text-slate-600 dark:text-[#A1A1AA] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Lembre-se: no Método FAC, você já reservou <strong>{state.reservaPct}%</strong> de
                  cada atendimento ({formatBRL(cashFlow.provisaoReserva)}/mês). Esse aporte pode
                  alimentar diretamente sua reserva técnica.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEÇÃO: METAS FINANCEIRAS (CRUD)                                        */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] flex items-center justify-center text-[#7c3aed] dark:text-[#C084FC]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                3. Metas Financeiras da Clínica
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                Cursos, reformas, equipamentos e férias — calcule o aporte mensal exato para cada
                objetivo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-purple-50 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] border border-purple-200 dark:border-[#27272A] font-mono text-xs px-2.5 py-1">
              Aportes Metas: {formatBRL(totalAportesMetasMensais)}/mês
            </Badge>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              className="gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-mono text-xs font-bold rounded-[8px]"
            >
              <Plus className="w-3.5 h-3.5" />
              NOVA META
            </Button>
          </div>
        </div>

        {/* Formulário Colapsável de Nova Meta */}
        {isAddingGoal && (
          <Card className="bg-white dark:bg-[#18181B] border-purple-200 dark:border-[#C084FC]/50 shadow-md dark:shadow-xl rounded-[16px] animate-in fade-in-50">
            <CardHeader className="pb-3">
              <CardTitle className="font-sans text-sm font-semibold text-slate-900 dark:text-white">
                Cadastrar Nova Meta Financeira
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1 lg:col-span-2">
                  <Label className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                    Nome da Meta
                  </Label>
                  <Input
                    placeholder="Ex: Formação em TCC / Novo Consultório"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    className="h-10 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <CurrencyInput
                    id="nova-meta-alvo"
                    label="Valor Alvo"
                    value={newGoalTarget}
                    onChange={setNewGoalTarget}
                  />
                </div>

                <div className="space-y-1">
                  <CurrencyInput
                    id="nova-meta-guardado"
                    label="Já Guardado"
                    value={newGoalSaved}
                    onChange={setNewGoalSaved}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                    Prazo (Meses)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={newGoalMonths}
                    onChange={(e) =>
                      setNewGoalMonths(Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="h-10 text-sm bg-slate-50 dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#27272A]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                    Prioridade:
                  </span>
                  {(['alta', 'media', 'baixa'] as GoalPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewGoalPriority(p)}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-mono uppercase font-semibold transition-all ${
                        newGoalPriority === p
                          ? p === 'alta'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40'
                            : p === 'media'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/40'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40'
                          : 'bg-slate-100 dark:bg-[#121216] text-slate-600 dark:text-[#71717A] border border-slate-200 dark:border-[#27272A]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingGoal(false)}
                    className="border-slate-200 dark:border-[#27272A] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white text-xs font-mono rounded-[8px]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddGoal}
                    disabled={!newGoalName.trim() || newGoalTarget <= 0}
                    className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-mono text-xs font-bold rounded-[8px]"
                  >
                    Salvar Meta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Cards de Metas */}
        {finState.goals.length === 0 ? (
          <div className="p-8 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-center space-y-2">
            <Target className="w-8 h-8 text-slate-400 dark:text-[#71717A] mx-auto" />
            <h5 className="font-sans text-sm font-semibold text-slate-900 dark:text-white">
              Nenhuma meta cadastrada
            </h5>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
              Clique no botão "NOVA META" para criar objetivos financeiros personalizados para sua
              clínica.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finState.goals.map((goal) => {
              const calc = calculateGoalMonthlyContribution(goal)
              const isEditing = editingGoalId === goal.id

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl flex flex-col justify-between space-y-4 hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                            goal.priority === 'alta'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900/60'
                              : goal.priority === 'media'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-900/60'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-900/60'
                          }`}
                        >
                          Prioridade {goal.priority}
                        </span>
                        <h5 className="font-sans text-base font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {goal.name}
                        </h5>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (isEditing) {
                              setEditingGoalId(null)
                            } else {
                              setEditingGoalId(goal.id)
                              setEditSavedValue(goal.savedAmount)
                            }
                          }}
                          className="h-7 w-7 text-slate-500 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white rounded-[6px]"
                          title="Editar valor já guardado"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="h-7 w-7 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[6px]"
                          title="Excluir meta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500 dark:text-[#A1A1AA]">Progresso:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {calc.progressPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#0A0A14] border border-slate-300 dark:border-[#27272A] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#7c3aed] dark:bg-[#C084FC] transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(3, calc.progressPct))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Edição Rápida do Valor Já Guardado */}
                  {isEditing ? (
                    <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-[#121216] border border-purple-200 dark:border-[#C084FC]/40 space-y-2">
                      <Label className="text-[11px] font-mono text-slate-600 dark:text-[#A1A1AA]">
                        Atualizar valor já guardado:
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="50"
                          value={editSavedValue}
                          onChange={(e) => setEditSavedValue(parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs font-mono bg-white dark:bg-[#0A0A14] border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateGoalSaved(goal.id, editSavedValue)}
                          className="h-8 px-2 bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-mono text-xs font-bold"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {/* Números da Meta */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-[#27272A] font-mono text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase block">
                        Alvo Total
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatBRL(goal.targetAmount)}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-[#71717A] block">
                        Guardado: {formatBRL(goal.savedAmount)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase block">
                        Aporte ({goal.deadlineMonths}m)
                      </span>
                      <span className="font-bold text-[#ea580c] dark:text-[#FB923C] text-sm">
                        {formatBRL(calc.monthlyContribution)}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-[#A1A1AA] block">
                        / mês
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. SEÇÃO: PROJEÇÃO DE CRESCIMENTO (12–24 MESES)                           */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] flex items-center justify-center text-[#ea580c] dark:text-[#FB923C]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
                4. Projeção de Crescimento da Clínica ({finState.projectionMonths} Meses)
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                Simule aumentos graduais no preço por atendimento e na carga horária com proteção
                inflacionária.
              </p>
            </div>
          </div>

          {/* Seletor de Horizonte: 12, 18 ou 24 meses */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] p-1 rounded-[8px]">
            {([12, 18, 24] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFinState((prev) => ({ ...prev, projectionMonths: m }))}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-semibold transition-all ${
                  finState.projectionMonths === m
                    ? 'bg-white dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] shadow-sm'
                    : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m} MESES
              </button>
            ))}
          </div>
        </div>

        {/* Sliders de Simulação de Crescimento */}
        <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <CardTitle className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                Alavancas de Expansão da Clínica
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: Aumento no Preço */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                    Aumento Gradual no Honorário
                  </Label>
                  <span className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC]">
                    +{finState.crescimentoPrecoPct}%
                  </span>
                </div>
                <Slider
                  value={[finState.crescimentoPrecoPct]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(vals) =>
                    setFinState((prev) => ({ ...prev, crescimentoPrecoPct: vals[0] }))
                  }
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
                  <span>0% (estável)</span>
                  <span>+25%</span>
                  <span>+50%</span>
                </div>
              </div>

              {/* Slider 2: Aumento nas Sessões */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                    Expansão da Carga de Sessões
                  </Label>
                  <span className="font-mono text-xs font-bold text-[#ea580c] dark:text-[#FB923C]">
                    +{finState.crescimentoSessoesPct}%
                  </span>
                </div>
                <Slider
                  value={[finState.crescimentoSessoesPct]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={(vals) =>
                    setFinState((prev) => ({ ...prev, crescimentoSessoesPct: vals[0] }))
                  }
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A]">
                  <span>0% (mesma grade)</span>
                  <span>+20%</span>
                  <span>+40%</span>
                </div>
              </div>

              {/* Toggle 3: Reajuste Anual por Índice (IPCA / IGP-M) */}
              <div className="p-3 rounded-[12px] bg-slate-50 dark:bg-[#0A0A14] border border-slate-200 dark:border-[#27272A] space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="toggle-inflacao"
                    className="text-xs font-mono text-slate-900 dark:text-white cursor-pointer"
                  >
                    Reajuste Anual por Inflação
                  </Label>
                  <Switch
                    id="toggle-inflacao"
                    checked={finState.aplicarIndiceInflacao}
                    onCheckedChange={(checked) =>
                      setFinState((prev) => ({ ...prev, aplicarIndiceInflacao: checked }))
                    }
                  />
                </div>
                {finState.aplicarIndiceInflacao ? (
                  <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-200 dark:border-[#27272A]">
                    <span className="text-slate-600 dark:text-[#A1A1AA]">Índice Oficial:</span>
                    <span className="font-bold text-[#ea580c] dark:text-[#FB923C]">
                      {finState.tipoIndiceInflacao} ({finState.indiceInflacaoAnualPct.toFixed(2)}%
                      a.a.)
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 dark:text-[#71717A]">
                    Sem recomposição de poder de compra
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Linha Recharts: Projeção Mês a Mês */}
        <Card className="bg-white dark:bg-[#18181B] border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl rounded-[16px]">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-[#27272A]/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="font-sans text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                Trajetória Projetada: Faturamento, Retirada Líquida e Reserva Acumulada
              </CardTitle>
              {finalPoint && (
                <span className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC]">
                  Mês {finalPoint.mes}: Faturamento {formatBRL(finalPoint.faturamentoBruto)} ·
                  Reserva Total {formatBRL(finalPoint.reservaAcumuladaTotal)}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="h-80 sm:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectionPoints}
                  margin={{ top: 20, right: 25, left: 15, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    className="dark:stroke-[#27272A]"
                  />
                  <XAxis
                    dataKey="labelMes"
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-slate-500 dark:text-[#A1A1AA]"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-slate-500 dark:text-[#A1A1AA]"
                    tickFormatter={(val) => `R$ ${(val / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      const item = payload[0].payload as (typeof projectionPoints)[0]

                      return (
                        <div className="bg-white dark:bg-[#18181B] p-3.5 rounded-[12px] shadow-2xl border border-slate-200 dark:border-[#27272A] text-xs font-mono space-y-2 min-w-[240px]">
                          <div className="font-bold border-b border-slate-200 dark:border-[#27272A] pb-1 flex justify-between items-center text-slate-900 dark:text-white">
                            <span>{item.labelMes}</span>
                            <span className="text-[#7c3aed] dark:text-[#C084FC]">
                              {formatBRL(item.precoSessao)}/sessão
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[#7c3aed] dark:text-[#C084FC]">
                              <span>Faturamento Bruto:</span>
                              <span className="font-bold">{formatBRL(item.faturamentoBruto)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sky-600 dark:text-[#38BDF8]">
                              <span>Retirada Líquida:</span>
                              <span className="font-bold">{formatBRL(item.retiradaLiquida)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[#ea580c] dark:text-[#FB923C]">
                              <span>Reserva Acumulada:</span>
                              <span className="font-bold">
                                {formatBRL(item.reservaAcumuladaTotal)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-slate-200 dark:border-[#27272A] text-[10px] text-slate-500 dark:text-[#71717A]">
                            Sessões no mês: {item.sessoesMes} atendimentos
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{
                      paddingBottom: '12px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />

                  {/* Faturamento Bruto (Roxo Astral) */}
                  <Line
                    type="monotone"
                    dataKey="faturamentoBruto"
                    name="Faturamento Bruto"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#7c3aed' }}
                    activeDot={{ r: 6, fill: '#7c3aed' }}
                  />

                  {/* Retirada Líquida (Azul Ciano) */}
                  <Line
                    type="monotone"
                    dataKey="retiradaLiquida"
                    name="Retirada Líquida"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot={false}
                  />

                  {/* Reserva Acumulada (Laranja Astral) */}
                  <Line
                    type="monotone"
                    dataKey="reservaAcumuladaTotal"
                    name="Reserva Acumulada"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Destaque Bento ao Final da Projeção */}
            {finalPoint && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-[#27272A] text-xs font-mono">
                <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
                  <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase block font-bold">
                    Preço Final Projetado
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {formatBRL(finalPoint.precoSessao)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-[#71717A]">por sessão</span>
                </div>

                <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
                  <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase block font-bold">
                    Faturamento Mensal
                  </span>
                  <span className="text-base font-bold text-[#7c3aed] dark:text-[#C084FC] mt-0.5 block">
                    {formatBRL(finalPoint.faturamentoBruto)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-[#71717A]">
                    no Mês {finalPoint.mes}
                  </span>
                </div>

                <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
                  <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase block font-bold">
                    Retirada Mensal
                  </span>
                  <span className="text-base font-bold text-sky-600 dark:text-[#38BDF8] mt-0.5 block">
                    {formatBRL(finalPoint.retiradaLiquida)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-[#71717A]">
                    líquida de custos
                  </span>
                </div>

                <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-orange-200 dark:border-[#FB923C]/40">
                  <span className="text-slate-500 dark:text-[#71717A] text-[10px] uppercase block font-bold">
                    Patrimônio em Reserva
                  </span>
                  <span className="text-base font-bold text-[#ea580c] dark:text-[#FB923C] mt-0.5 block">
                    {formatBRL(finalPoint.reservaAcumuladaTotal)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-[#71717A]">
                    fundo acumulado
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
