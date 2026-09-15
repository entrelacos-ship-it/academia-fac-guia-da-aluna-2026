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
      {/* Banner Astral */}
      <div className="p-4 rounded-[12px] bg-[#18181B] border border-[#27272A] flex items-start gap-3">
        <div className="p-2 rounded-[8px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC] shrink-0 mt-0.5">
          <Percent className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#C084FC] uppercase tracking-wider">
            PASSO 4 / 7
          </span>
          <h2 className="font-sans text-lg font-semibold text-white">
            Reserva Técnica & Tributação
          </h2>
          <p className="text-xs text-[#A1A1AA] leading-relaxed mt-0.5">
            O Markup Divisor protege sua rentabilidade: as alíquotas incidem sobre a receita bruta
            total, garantindo fundos para férias, 13º e conformidade fiscal.
          </p>
        </div>
      </div>

      <div className="bg-[#18181B] rounded-[16px] p-6 sm:p-8 border border-[#27272A] shadow-xl space-y-8">
        {/* Slider Reserva Técnica Astral */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-[6px] bg-[#0A0A14] border border-[#27272A] text-[#FB923C]">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Reserva Técnica (Férias, 13º e Emergência)
                </span>
                <span className="text-[11px] text-[#A1A1AA]">
                  Recomendado: 10% para sustentar pausas remuneradas e sazonalidade
                </span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-[#FB923C] px-3 py-1 rounded-[8px] bg-[#0A0A14] border border-[#27272A]">
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
          <div className="flex justify-between text-[11px] font-mono text-[#71717A]">
            <span>0% (Sem reserva)</span>
            <span className="text-[#FB923C]">10% (Padrão FAC)</span>
            <span>30% (Alta provisão)</span>
          </div>
        </div>

        {/* Slider Tributos Astral */}
        <div className="space-y-3 pt-4 border-t border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-[6px] bg-[#0A0A14] border border-[#27272A] text-[#C084FC]">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Alíquota Tributária Estimada
                </span>
                <span className="text-[11px] text-[#A1A1AA]">
                  Simples Nacional (6% a 15,5%) ou Carnê-Leão PF + INSS + ISS
                </span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-[#C084FC] px-3 py-1 rounded-[8px] bg-[#0A0A14] border border-[#27272A]">
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
          <div className="flex justify-between text-[11px] font-mono text-[#71717A]">
            <span>0%</span>
            <span className="text-[#C084FC]">11% (Padrão estimado)</span>
            <span>40% (Alíquota teto)</span>
          </div>
        </div>

        {/* Card Combinado do Markup Divisor Astral */}
        <div className="p-4 rounded-[12px] bg-[#121216] border border-[#27272A] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1AA] block">
                Retenção Bruta Combinada
              </span>
              <p className="text-xs font-mono text-[#C084FC] mt-0.5">
                Reserva ({reserva}%) + Tributos ({tributos}%) = {pctBruto}%
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                  Markup Divisor
                </span>
                <span className="font-mono text-lg font-bold text-white">
                  1 - {(pctBruto / 100).toFixed(2)} ={' '}
                  <span className="text-[#C084FC]">
                    {divisor > 0 ? divisor.toFixed(2) : '0,00'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Alerta de Divisão por Zero / Soma >= 100% */}
          {isBlocked && (
            <div className="p-3 rounded-[8px] bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção: Cálculo Bloqueado.</strong> A soma da reserva e tributos (
                {pctBruto}%) não pode ser igual ou maior que 100%, pois inviabiliza o divisor
                contábil. Por favor, reduza uma das porcentagens.
              </div>
            </div>
          )}
        </div>

        {/* Detalhe Educativo Colapsável Astral */}
        <details className="group rounded-[12px] border border-[#27272A] p-3.5 bg-[#121216] text-xs text-[#A1A1AA] cursor-pointer">
          <summary className="font-semibold text-white flex items-center justify-between list-none">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FB923C]" />
              Entenda: Simples Nacional vs. Carnê-Leão na Psicologia
            </span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-[#71717A]" />
          </summary>
          <div className="pt-3 space-y-2 leading-relaxed border-t border-[#27272A] mt-3 text-[#A1A1AA]">
            <p>
              • <strong className="text-white">Pessoa Jurídica (Simples Nacional):</strong> Com
              planejamento contábil e uso do <em>Fator R</em> (folha/pró-labore ≥ 28%), psicólogas
              podem se enquadrar no Anexo III iniciando com alíquota de apenas{' '}
              <strong className="text-[#C084FC]">6%</strong>, gerando economia expressiva comparada
              à tabela progressiva da PF.
            </p>
            <p>
              • <strong className="text-white">Pessoa Física (Carnê-Leão + Livro Caixa):</strong>{' '}
              Exige recolhimento mensal de IRPF (até 27,5%) com dedução de despesas do consultório
              no Livro Caixa, mais carnê do INSS (20% sobre o salário mínimo ou teto) e ISS
              municipal.
            </p>
            <p className="text-[11px] font-mono text-[#71717A]">
              * Consulte sempre um contador especializado na área de saúde para formalizar a melhor
              estrutura societária e fiscal da sua clínica.
            </p>
          </div>
        </details>
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between pt-6 border-t border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white rounded-[8px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à Retirada Desejada
        </Button>
        <Button
          onClick={onNext}
          disabled={isBlocked}
          className="gap-2 bg-[#C084FC] hover:bg-[#a855f7] text-[#0A0A14] font-semibold px-6 rounded-[8px] shadow-md shadow-[#C084FC]/20 disabled:opacity-50"
        >
          Continuar para Capacidade Clínica
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
