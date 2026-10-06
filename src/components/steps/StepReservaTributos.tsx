import React from 'react'
import {
  ShieldAlert,
  Percent,
  PiggyBank,
  Receipt,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { PricingState } from '@/types/pricing'

interface StepReservaTributosProps {
  state: PricingState
  onSetReservaPct: (pct: number) => void
  onSetTributosPct: (pct: number) => void
  onNext: () => void
  onPrev: () => void
}

export const StepReservaTributos: React.FC<StepReservaTributosProps> = ({
  state,
  onSetReservaPct,
  onSetTributosPct,
  onNext,
  onPrev,
}) => {
  const reserva = state.reservaPct ?? 10
  const tributos = state.tributosPct ?? 11
  const pctBruto = reserva + tributos
  const divisor = 1 - pctBruto / 100
  const isBlocked = pctBruto >= 100 || divisor <= 0

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Cabeçalho Editorial */}
      <div className="border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] tracking-wider uppercase">
            Passo 04 de 07
          </span>
          <span className="text-slate-400 dark:text-zinc-600">•</span>
          <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">Pilar 04</span>
        </div>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-slate-900 dark:text-zinc-100 tracking-tight">
          Reserva Técnica & Tributação
        </h2>
        <p className="text-sm text-slate-700 dark:text-zinc-300 mt-2 max-w-2xl font-normal leading-relaxed">
          O Markup Divisor protege sua rentabilidade: as alíquotas incidem sobre a receita bruta
          total, garantindo fundos para férias, 13º e conformidade fiscal.
        </p>
      </div>

      <div className="bg-white/80 dark:bg-[#0c0914] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-8">
        {/* Slider Reserva Técnica Astral */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-[6px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C]">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Reserva Técnica (Férias, 13º e Emergência)
                </span>
                <span className="text-xs text-slate-600 dark:text-zinc-400">
                  Recomendado: 10% para sustentar pausas remuneradas e sazonalidade
                </span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-[#ea580c] dark:text-[#FB923C] px-3 py-1 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A]">
              {reserva}%
            </span>
          </div>

          <Slider
            value={[reserva]}
            min={0}
            max={30}
            step={1}
            onValueChange={(vals) => onSetReservaPct(vals[0] || 0)}
            className="py-2"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-600 dark:text-zinc-400">
            <span>0% (Sem reserva)</span>
            <span className="text-[#ea580c] dark:text-[#FB923C] font-semibold">
              10% (Padrão FAC)
            </span>
            <span>30% (Alta provisão)</span>
          </div>
        </div>

        {/* Slider Tributos Astral */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-[6px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC]">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Alíquota Tributária Estimada
                </span>
                <span className="text-xs text-slate-600 dark:text-zinc-400">
                  Simples Nacional (6% a 15,5%) ou Carnê-Leão PF + INSS + ISS
                </span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-[#7c3aed] dark:text-[#C084FC] px-3 py-1 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A]">
              {tributos}%
            </span>
          </div>

          <Slider
            value={[tributos]}
            min={0}
            max={40}
            step={1}
            onValueChange={(vals) => onSetTributosPct(vals[0] || 0)}
            className="py-2"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-600 dark:text-zinc-400">
            <span>0%</span>
            <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">
              11% (Padrão estimado)
            </span>
            <span>40% (Alíquota teto)</span>
          </div>
        </div>

        {/* Card Combinado do Markup Divisor Astral */}
        <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 block">
                Retenção Bruta Combinada
              </span>
              <p className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] mt-0.5">
                Reserva ({reserva}%) + Tributos ({tributos}%) = {pctBruto}%
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
                  Markup Divisor
                </span>
                <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                  1 - {(pctBruto / 100).toFixed(2)} ={' '}
                  <span className="text-[#7c3aed] dark:text-[#C084FC]">
                    {divisor > 0 ? divisor.toFixed(2) : '0,00'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Alerta de Divisão por Zero / Soma >= 100% */}
          {isBlocked && (
            <div className="p-3 rounded-[8px] bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção: Cálculo Bloqueado.</strong> A soma da reserva e tributos (
                {pctBruto}%) não pode ser igual ou maior que 100%, pois inviabiliza o divisor
                contábil. Por favor, reduza uma das porcentagens.
              </div>
            </div>
          )}
        </div>

        {/* Detalhe Educativo Colapsável Astral */}
        <details className="group rounded-[12px] border border-slate-200 dark:border-[#27272A] p-3.5 bg-slate-50/70 dark:bg-[#121216] text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
          <summary className="font-semibold text-slate-900 dark:text-white flex items-center justify-between list-none">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
              Entenda: Simples Nacional vs. Carnê-Leão na Psicologia
            </span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-slate-500 dark:text-zinc-400" />
          </summary>
          <div className="pt-3 space-y-2 leading-relaxed border-t border-slate-200 dark:border-[#27272A] mt-3 text-slate-700 dark:text-zinc-300">
            <p>
              •{' '}
              <strong className="text-slate-900 dark:text-white">
                Pessoa Jurídica (Simples Nacional):
              </strong>{' '}
              Com planejamento contábil e uso do <em>Fator R</em> (folha/pró-labore ≥ 28%),
              psicólogas podem se enquadrar no Anexo III iniciando com alíquota de apenas{' '}
              <strong className="text-[#7c3aed] dark:text-[#C084FC]">6%</strong>, gerando economia
              expressiva comparada à tabela progressiva da PF.
            </p>
            <p>
              •{' '}
              <strong className="text-slate-900 dark:text-white">
                Pessoa Física (Carnê-Leão + Livro Caixa):
              </strong>{' '}
              Exige recolhimento mensal de IRPF (até 27,5%) com dedução de despesas do consultório
              no Livro Caixa, mais carnê do INSS (20% sobre o salário mínimo ou teto) e ISS
              municipal.
            </p>
            <p className="text-[11px] font-mono text-slate-600 dark:text-zinc-400">
              * Consulte sempre um contador especializado na área de saúde para formalizar a melhor
              estrutura societária e fiscal da sua clínica.
            </p>
          </div>
        </details>
      </div>

      {/* Botões de Navegação */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-slate-200/80 dark:border-zinc-800/80">
        <Button
          variant="outline"
          onClick={onPrev}
          className="min-h-[44px] justify-center gap-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={isBlocked}
          className="min-h-[44px] justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-medium px-6 rounded-lg transition-all disabled:opacity-50"
        >
          <span>Capacidade Clínica</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
