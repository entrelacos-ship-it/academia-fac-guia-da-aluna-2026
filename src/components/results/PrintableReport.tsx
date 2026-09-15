import React from 'react'
import { PricingState, CalculationResult } from '@/types/pricing'
import { formatBRL, formatNumberBR } from '@/lib/currency'

interface PrintableReportProps {
  state: PricingState
  calculation: CalculationResult
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ state, calculation }) => {
  const dateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 font-sans max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho Institucional */}
      <div className="border-b-2 border-[#7c3aed] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-[#7c3aed]">
            Entrelaços Psicologia — Método FAC
          </h1>
          <p className="text-xs text-slate-600">
            Relatório Oficial de Precificação Clínica e Piso Ético Mínimo
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 font-mono">
          <span>Data de Emissão: {dateStr}</span>
        </div>
      </div>

      {/* Destaque do Piso */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c3aed]">
            Piso Ético Mínimo Calculado por Sessão (V_min)
          </span>
          <div className="font-serif text-4xl font-bold text-slate-900 mt-1">
            {formatBRL(calculation.pisoMinimoSessao)}
          </div>
          <span className="text-xs text-slate-500">
            Faturamento Bruto Mensal Necessário: {formatBRL(calculation.faturamentoBruto)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-bold text-slate-500">Carga Semanal</span>
          <div className="font-serif text-2xl font-bold text-slate-900">
            {state.sessoesPorSemana} sessões/sem
          </div>
          <span className="text-xs text-slate-500">
            {calculation.sessoesEfetivas} efetivas/mês (taxa de falta {state.taxaFaltaPct}%)
          </span>
        </div>
      </div>

      {/* Resumo de Entradas */}
      <div className="space-y-2">
        <h2 className="font-serif text-base font-bold text-slate-900 border-b pb-1">
          1. Parâmetros Financeiros de Entrada
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Custos Pessoais (Vida/Moradia):</span>
              <span className="font-bold">{formatBRL(calculation.somaCustosPessoais)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Custos Profissionais (Consultório):</span>
              <span className="font-bold">{formatBRL(calculation.somaCustosProfissionais)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Retirada Desejada (Pró-Labore):</span>
              <span className="font-bold">{formatBRL(calculation.retiradaDesejada)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Provisão Reserva Técnica:</span>
              <span className="font-bold">{state.reservaPct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Alíquota Tributária Estimada:</span>
              <span className="font-bold">{state.tributosPct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Preço Atual Informado:</span>
              <span className="font-bold">
                {state.precoAtual > 0 ? formatBRL(state.precoAtual) : 'Não informado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Decomposição por Sessão */}
      <div className="space-y-2">
        <h2 className="font-serif text-base font-bold text-slate-900 border-b pb-1">
          2. Decomposição da Sessão (Onde vai cada real do piso)
        </h2>
        <table className="w-full text-xs text-left border border-slate-200">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="py-2 px-3 font-semibold">Pilar Metodológico</th>
              <th className="py-2 px-3 font-semibold">Valor por Atendimento</th>
              <th className="py-2 px-3 font-semibold">% do Piso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2 px-3 font-medium">Custos Pessoais de Vida</td>
              <td className="py-2 px-3 font-mono">
                {formatBRL(calculation.decompPessoalPorSessao)}
              </td>
              <td className="py-2 px-3 font-mono">{formatNumberBR(calculation.pctPessoal, 2)}%</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Custos Profissionais da Prática</td>
              <td className="py-2 px-3 font-mono">
                {formatBRL(calculation.decompProfissionalPorSessao)}
              </td>
              <td className="py-2 px-3 font-mono">
                {formatNumberBR(calculation.pctProfissional, 2)}%
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Retirada Livre (Pró-Labore)</td>
              <td className="py-2 px-3 font-mono">
                {formatBRL(calculation.decompRetiradaPorSessao)}
              </td>
              <td className="py-2 px-3 font-mono">{formatNumberBR(calculation.pctRetirada, 2)}%</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Reserva Técnica & Tributos (Markup)</td>
              <td className="py-2 px-3 font-mono">
                {formatBRL(calculation.decompReservaTributosPorSessao)}
              </td>
              <td className="py-2 px-3 font-mono">
                {formatNumberBR(calculation.pctReservaTributos, 2)}%
              </td>
            </tr>
            <tr className="bg-purple-50 font-bold border-t border-purple-200 font-mono">
              <td className="py-2 px-3 text-[#7c3aed]">TOTAL (Piso Ético Mínimo FAC)</td>
              <td className="py-2 px-3 font-mono text-[#7c3aed]">
                {formatBRL(calculation.pisoMinimoSessao)}
              </td>
              <td className="py-2 px-3 font-mono text-[#7c3aed]">100,00%</td>
            </tr>{' '}
          </tbody>
        </table>
      </div>

      {/* Diagnóstico de Lacuna (se houver preço atual) */}
      {calculation.hasPrecoAtual && (
        <div className="space-y-2">
          <h2 className="font-serif text-base font-bold text-slate-900 border-b pb-1">
            3. Diagnóstico de Lacuna Financeira (Gap Analysis)
          </h2>
          <div className="p-4 rounded-lg border text-xs space-y-1 bg-slate-50">
            <div className="flex justify-between">
              <span>Status Clínico:</span>
              <strong className={calculation.isDeficit ? 'text-rose-700' : 'text-emerald-700'}>
                {calculation.isDeficit
                  ? 'Déficit Clínico (Abaixo do Piso Ético)'
                  : 'Sustentável (Acima do Piso Ético)'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Diferença por Sessão:</span>
              <span className="font-mono font-bold">
                {formatBRL(Math.abs(calculation.deltaSessao))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Déficit / Margem Mensal:</span>
              <span className="font-mono font-bold">
                {formatBRL(Math.abs(calculation.deltaMensal))}
              </span>
            </div>
            {calculation.isDeficit && (
              <div className="flex justify-between pt-1 border-t text-rose-700 font-bold">
                <span>Prejuízo Anual Projetado:</span>
                <span className="font-mono">{formatBRL(calculation.prejuizoAnualProjetado)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rodapé e Disclaimer */}
      <div className="pt-6 border-t border-slate-300 text-[10px] text-slate-500 space-y-1">
        <p>
          <strong>Disclaimer Metodológico:</strong> Este relatório possui caráter estritamente
          pedagógico e de orientação clínica segundo a metodologia FAC (Formação e Precificação de
          Atendimento Clínico). Os cálculos não substituem assessoria contábil individualizada ou
          consultoria jurídica.
        </p>
        <p>Entrelaços Psicologia — Todos os direitos reservados © 2026.</p>
      </div>
    </div>
  )
}
