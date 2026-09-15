import React, { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CalculationResult } from '@/types/pricing'
import { formatBRL, formatNumberBR } from '@/lib/currency'
import { PieChart as PieIcon, BarChart3, Layers } from 'lucide-react'

interface ChartsProps {
  calculation: CalculationResult
}

const COLORS = {
  pessoal: '#C084FC', // Astral Primary
  profissional: '#FB923C', // Astral Accent
  retirada: '#A855F7', // Purple complementary
  reserva: '#F97316', // Orange complementary
}

export const FinancialBreakdownCharts: React.FC<ChartsProps> = ({ calculation }) => {
  const [activeTab, setActiveTab] = useState('donut')

  // Dados para Donut e Barras Mensais
  const donutData = [
    {
      name: 'Custos Pessoais',
      value: calculation.somaCustosPessoais,
      color: COLORS.pessoal,
      pct:
        calculation.faturamentoBruto > 0
          ? (calculation.somaCustosPessoais / calculation.faturamentoBruto) * 100
          : 0,
    },
    {
      name: 'Custos Profissionais',
      value: calculation.somaCustosProfissionais,
      color: COLORS.profissional,
      pct:
        calculation.faturamentoBruto > 0
          ? (calculation.somaCustosProfissionais / calculation.faturamentoBruto) * 100
          : 0,
    },
    {
      name: 'Retirada Livre (Pró-Labore)',
      value: calculation.retiradaDesejada,
      color: COLORS.retirada,
      pct:
        calculation.faturamentoBruto > 0
          ? (calculation.retiradaDesejada / calculation.faturamentoBruto) * 100
          : 0,
    },
    {
      name: 'Reserva & Tributos',
      value: Math.round(calculation.faturamentoBruto * calculation.pctBruto * 100) / 100,
      color: COLORS.reserva,
      pct: calculation.pctBruto * 100,
    },
  ]

  // Dados para Decomposição por Sessão (Horizontal Bar)
  const sessionData = [
    {
      category: 'Reserva & Tributos',
      valor: calculation.decompReservaTributosPorSessao,
      pct: calculation.pctReservaTributos,
      fill: COLORS.reserva,
    },
    {
      category: 'Retirada Livre',
      valor: calculation.decompRetiradaPorSessao,
      pct: calculation.pctRetirada,
      fill: COLORS.retirada,
    },
    {
      category: 'Custos Profissionais',
      valor: calculation.decompProfissionalPorSessao,
      pct: calculation.pctProfissional,
      fill: COLORS.profissional,
    },
    {
      category: 'Custos Pessoais',
      valor: calculation.decompPessoalPorSessao,
      pct: calculation.pctPessoal,
      fill: COLORS.pessoal,
    },
  ]

  return (
    <div className="bg-[#18181B] rounded-[16px] p-6 border border-[#27272A] shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C084FC] block">
            VISUALIZAÇÃO ASTRAL
          </span>
          <h3 className="font-sans text-lg font-semibold text-white">
            Decomposição Financeira Visual
          </h3>
          <p className="text-xs text-[#A1A1AA]">
            Entenda como cada centavo do seu faturamento e do preço da sessão é distribuído
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-[#0A0A14] border border-[#27272A] h-9 p-1 rounded-[8px]">
            <TabsTrigger
              value="donut"
              className="text-xs font-mono gap-1.5 h-7 data-[state=active]:bg-[#18181B] data-[state=active]:text-[#C084FC] rounded-[6px]"
            >
              <PieIcon className="w-3.5 h-3.5" /> Donut
            </TabsTrigger>
            <TabsTrigger
              value="barras"
              className="text-xs font-mono gap-1.5 h-7 data-[state=active]:bg-[#18181B] data-[state=active]:text-[#C084FC] rounded-[6px]"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Barras
            </TabsTrigger>
            <TabsTrigger
              value="sessao"
              className="text-xs font-mono gap-1.5 h-7 data-[state=active]:bg-[#18181B] data-[state=active]:text-[#C084FC] rounded-[6px]"
            >
              <Layers className="w-3.5 h-3.5" /> Por Sessão
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab 1: Donut */}
      {activeTab === 'donut' && (
        <div className="space-y-4">
          <div className="h-64 sm:h-72 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={800}
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [
                    formatBRL(typeof val === 'number' ? val : 0),
                    'Total Mensal',
                  ]}
                  contentStyle={{
                    backgroundColor: '#18181B',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    border: '1px solid #27272A',
                    fontSize: '12px',
                    color: '#FFFFFF',
                  }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centro do Donut Astral */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
                Faturamento Bruto
              </span>
              <span className="font-mono font-bold text-lg sm:text-xl text-white">
                {formatBRL(calculation.faturamentoBruto)}
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">ao mês</span>
            </div>
          </div>

          {/* Legenda em 4 colunas Astral */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#27272A]">
            {donutData.map((item) => (
              <div
                key={item.name}
                className="p-2 rounded-[8px] bg-[#121216] border border-[#27272A] text-xs font-mono"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-[#A1A1AA] truncate text-[11px]">
                    {item.name}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{formatBRL(item.value)}</div>
                <div className="text-[10px] text-[#71717A]">
                  {formatNumberBR(item.pct, 1)}% do bruto
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Barras Mensais */}
      {activeTab === 'barras' && (
        <div className="space-y-4">
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donutData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  tickFormatter={(v) => (v.length > 12 ? `${v.slice(0, 10)}...` : v)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `R$ ${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  formatter={(val: unknown) => [
                    formatBRL(typeof val === 'number' ? val : 0),
                    'Mensal',
                  ]}
                  contentStyle={{
                    backgroundColor: '#18181B',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    border: '1px solid #27272A',
                    fontSize: '12px',
                    color: '#FFFFFF',
                  }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {donutData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Por Sessão (Decomposição Horizontal) */}
      {activeTab === 'sessao' && (
        <div className="space-y-4">
          <p className="text-xs text-[#A1A1AA]">
            Cada sessão de{' '}
            <strong className="text-white font-mono">
              {formatBRL(calculation.pisoMinimoSessao)}
            </strong>{' '}
            cobre exatamente as quatro obrigações abaixo:
          </p>

          <div className="space-y-3 pt-1">
            {sessionData.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{formatBRL(item.valor)}</span>
                    <span className="text-[11px] text-[#A1A1AA] font-mono">
                      ({formatNumberBR(item.pct, 2)}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#0A0A14] border border-[#27272A] rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(3, item.pct))}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-[8px] bg-[#121216] border border-[#C084FC]/30 text-center font-mono">
            <span className="text-xs font-semibold text-[#C084FC]">
              A soma das 4 parcelas é exatamente {formatBRL(calculation.pisoMinimoSessao)} (100% do
              Piso Ético).
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
