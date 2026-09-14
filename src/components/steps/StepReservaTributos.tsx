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
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-[#F5F2F9] dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#5B3A8E] text-white shrink-0 mt-0.5">
          <Percent className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Passo 4: Reserva Técnica & Tributação
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
            O Markup Divisor protege sua rentabilidade: as alíquotas incidem sobre a receita bruta
            total, garantindo fundos para férias, 13º e conformidade fiscal.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        {/* Slider Reserva Técnica (Terracota) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#DF694B]/10 text-[#DF694B]">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Reserva Técnica (Férias, 13º e Emergência)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Recomendado: 10% para sustentar pausas remuneradas e sazonalidade
                </span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-[#DF694B] px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900">
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
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0% (Sem reserva)</span>
            <span>10% (Padrão FAC)</span>
            <span>30% (Alta provisão)</span>
          </div>
        </div>

        {/* Slider Tributos (Âmbar) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#C86A1F]/10 text-[#C86A1F]">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Alíquota Tributária Estimada
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Simples Nacional (6% a 15,5%) ou Carnê-Leão PF + INSS + ISS
                </span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-[#C86A1F] px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
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
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0%</span>
            <span>11% (Padrão estimado)</span>
            <span>40% (Alíquota teto)</span>
          </div>
        </div>

        {/* Card Combinado do Markup Divisor */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Retenção Bruta Combinada
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reserva ({reserva}%) + Tributos ({tributos}%) = {pctBruto}%
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                  Markup Divisor
                </span>
                <span className="font-mono text-lg font-bold text-[#5B3A8E] dark:text-purple-300">
                  1 - {(pctBruto / 100).toFixed(2)} = {divisor > 0 ? divisor.toFixed(2) : '0,00'}
                </span>
              </div>
            </div>
          </div>

          {/* Alerta de Divisão por Zero / Soma >= 100% */}
          {isBlocked && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção: Cálculo Bloqueado.</strong> A soma da reserva e tributos (
                {pctBruto}%) não pode ser igual ou maior que 100%, pois inviabiliza o divisor
                contábil. Por favor, reduza uma das porcentagens.
              </div>
            </div>
          )}
        </div>

        {/* Detalhe Educativo Colapsável */}
        <details className="group rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
          <summary className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between list-none">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#5B3A8E]" />
              Entenda: Simples Nacional vs. Carnê-Leão na Psicologia
            </span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="pt-3 space-y-2 leading-relaxed border-t border-slate-100 dark:border-slate-800 mt-3">
            <p>
              • <strong>Pessoa Jurídica (Simples Nacional):</strong> Com planejamento contábil e uso
              do <em>Fator R</em> (folha/pró-labore ≥ 28%), psicólogas podem se enquadrar no Anexo
              III iniciando com alíquota de apenas <strong>6%</strong>, gerando economia expressiva
              comparada à tabela progressiva da PF.
            </p>
            <p>
              • <strong>Pessoa Física (Carnê-Leão + Livro Caixa):</strong> Exige recolhimento mensal
              de IRPF (até 27,5%) com dedução de despesas do consultório no Livro Caixa, mais carnê
              do INSS (20% sobre o salário mínimo ou teto) e ISS municipal.
            </p>
            <p className="text-[11px] text-slate-500">
              * Consulte sempre um contador especializado na área de saúde para formalizar a melhor
              estrutura societária e fiscal da sua clínica.
            </p>
          </div>
        </details>
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-300 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à Retirada Desejada
        </Button>
        <Button
          onClick={onNext}
          disabled={isBlocked}
          className="gap-2 bg-[#5B3A8E] hover:bg-[#452A6F] text-white px-6 font-medium shadow-sm disabled:opacity-50"
        >
          Continuar para Capacidade Clínica
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
