import React from 'react'
import {
  Building2,
  ShieldCheck,
  LayoutGrid,
  MonitorSmartphone,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StepModelosProps {
  onReset: () => void
  onKeepData: () => void
  onPrev: () => void
}

export const StepModelos: React.FC<StepModelosProps> = ({ onReset, onKeepData, onPrev }) => {
  return (
    <div className="space-y-8">
      {/* Banner de Explicação Astral */}
      <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex items-start gap-3">
        <div className="p-2 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7c3aed] dark:text-[#C084FC] uppercase tracking-wider">
            PASSO 7 / 7
          </span>
          <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-white">
            Comparativo dos 4 Modelos Clínicos de Atuação
          </h2>
          <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed mt-0.5">
            Compare os 4 modelos clínicos para decidir seu melhor formato de atuação profissional,
            pesando riscos de burnout, custos fixos e autonomia de honorários.
          </p>
        </div>
      </div>

      {/* Grid de 4 Cards de Modelos Astral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Consultório Particular (Ouro FAC) */}
        <div className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border-2 border-[#7c3aed] dark:border-[#C084FC] shadow-md dark:shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] text-[10px] font-mono font-bold uppercase tracking-wider py-1 px-3 rounded-bl-[12px] flex items-center gap-1 shadow-xs">
            <Crown className="w-3 h-3 text-white dark:text-[#0A0A14]" /> Ouro FAC
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center mt-2">
              <Award className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
            </div>

            <div>
              <h3 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                Consultório Particular
              </h3>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                Modelo soberano de atendimento
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#A1A1AA] pt-2 border-t border-slate-200 dark:border-[#27272A]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5" />
                <span>Autonomia total de precificação ética</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5" />
                <span>Fixação de honorários baseada no Método FAC</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5" />
                <span>Dedicação integral à escuta sem volume industrial</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#27272A]">
            <span className="text-[10px] font-mono font-bold uppercase text-[#7c3aed] dark:text-[#C084FC] tracking-wider block">
              Recomendação FAC
            </span>
            <span className="text-xs font-sans font-semibold text-slate-900 dark:text-white">
              Altamente Recomendado (Padrão Ouro)
            </span>
          </div>
        </div>

        {/* 2. Convênios / Planos de Saúde */}
        <div className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                Convênios / Planos
              </h3>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                Atendimento intermediado por operadoras
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#A1A1AA] pt-2 border-t border-slate-200 dark:border-[#27272A]">
              <li className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Repasse aviltado por sessão (R$ 20 a R$ 45)</span>
              </li>
              <li className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Exige volume alto (35+ sessões/sem)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A] shrink-0 mt-0.5">
                  •
                </span>
                <span>Limites rígidos de reajuste e glosas</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#27272A]">
            <span className="text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400 tracking-wider block">
              Risco Crítico
            </span>
            <span className="text-xs font-sans font-semibold text-slate-900 dark:text-white">
              Alto risco de burnout e déficit crônico
            </span>
          </div>
        </div>

        {/* 3. Sublocação / Coworking */}
        <div className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                Sublocação / Turnos
              </h3>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                Compartilhamento físico por hora ou bloco
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#A1A1AA] pt-2 border-t border-slate-200 dark:border-[#27272A]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Custos fixos iniciais bastante reduzidos</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A] shrink-0 mt-0.5">
                  •
                </span>
                <span>Menos controle de agenda e personalização</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Excelente rampa de transição para o início</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#27272A]">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
              Transição Segura
            </span>
            <span className="text-xs font-sans font-semibold text-slate-900 dark:text-white">
              Recomendado para início ou validação
            </span>
          </div>
        </div>

        {/* 4. Atendimento Online (Home Office) */}
        <div className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center">
              <MonitorSmartphone className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                Online / Home Office
              </h3>
              <p className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                Atendimento remoto regulado pelo CFP
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#A1A1AA] pt-2 border-t border-slate-200 dark:border-[#27272A]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Sem despesa de aluguel físico</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Flexibilidade geográfica nacional e internacional</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A] shrink-0 mt-0.5">
                  •
                </span>
                <span>Exige disciplina de gestão e sigilo rígido</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#27272A]">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
              Alta Eficiência
            </span>
            <span className="text-xs font-sans font-semibold text-slate-900 dark:text-white">
              Margem de lucro elevada se bem posicionado
            </span>
          </div>
        </div>
      </div>

      {/* Tabela Comparativa Detalhada Astral - Nested Surfaces */}
      <div className="bg-white dark:bg-[#18181B] rounded-[16px] p-6 border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-4">
        <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white">
          Matriz Comparativa das Modalidades
        </h3>

        <div className="overflow-x-auto rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#0A0A14]">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-[#121216] text-slate-700 dark:text-[#A1A1AA] font-mono uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-[#27272A]">
              <tr>
                <th className="py-2.5 px-3">Critério de Avaliação</th>
                <th className="py-2.5 px-3 text-[#7c3aed] dark:text-[#C084FC]">
                  Particular (Ouro FAC)
                </th>
                <th className="py-2.5 px-3 text-[#ea580c] dark:text-[#FB923C]">
                  Convênios / Planos
                </th>
                <th className="py-2.5 px-3 text-slate-900 dark:text-white">Sublocação</th>
                <th className="py-2.5 px-3 text-[#7c3aed] dark:text-[#C084FC]">
                  Online Home Office
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#27272A] text-slate-700 dark:text-[#A1A1AA]">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                  Custo de Instalação
                </td>
                <td className="py-2.5 px-3 font-mono">Médio / Alto</td>
                <td className="py-2.5 px-3 font-mono">Baixo (credenciamento)</td>
                <td className="py-2.5 px-3 font-mono">Baixo</td>
                <td className="py-2.5 px-3 font-mono">Muito Baixo (computador/luz)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                  Custo Mensal Estimado
                </td>
                <td className="py-2.5 px-3 font-mono">Fixo (R$ 800 a R$ 2.500)</td>
                <td className="py-2.5 px-3 font-mono">Variável / Dependente</td>
                <td className="py-2.5 px-3 font-mono">Variável por turno</td>
                <td className="py-2.5 px-3 font-mono">Mínimo (internet/softwares)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                  Autonomia de Preço
                </td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                  Total (100% livre)
                </td>
                <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">
                  Nula (tabela do plano)
                </td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                  Total
                </td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                  Total
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                  Risco de Burnout
                </td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                  Baixo a Moderado
                </td>
                <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">
                  Crítico (volume excessivo)
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-[#A1A1AA]">Moderado</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-[#A1A1AA]">Baixo a Moderado</td>
              </tr>
              <tr className="bg-purple-50/50 dark:bg-[#18181B] font-semibold">
                <td className="py-2.5 px-3 text-[#7c3aed] dark:text-[#C084FC] font-mono">
                  Recomendação FAC
                </td>
                <td className="py-2.5 px-3 text-[#7c3aed] dark:text-[#C084FC]">Meta Principal</td>
                <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">Evitar / Desmame</td>
                <td className="py-2.5 px-3 text-[#ea580c] dark:text-[#FB923C]">
                  Rampa de Transição
                </td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                  Excelente Complemento
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Caixa de Recomendação Final & Próximos Passos Astral */}
      <div className="p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-[#ea580c] dark:text-[#FB923C]" />
          </div>
          <div>
            <h4 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
              Síntese Metodológica do Método FAC
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed mt-1">
              Para a imensa maioria das psicólogas(os), o{' '}
              <strong className="text-slate-900 dark:text-white">Consultório Particular</strong>{' '}
              (presencial ou online) oferece o único caminho verdadeiramente ético para aliar escuta
              qualificada, tempo de estudo contínuo e remuneração condizente com a dignidade da
              profissão.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#27272A]">
          <Button
            variant="outline"
            onClick={onKeepData}
            className="w-full sm:w-auto border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A14] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] rounded-[8px]"
          >
            Voltar ao Painel de Resultados
          </Button>
          <Button
            onClick={onReset}
            className="w-full sm:w-auto bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#ea580c] text-white dark:text-[#0A0A14] font-semibold gap-2 rounded-[8px]"
          >
            <RotateCcw className="w-4 h-4" />
            Refazer o cálculo do zero
          </Button>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="flex items-center justify-start pt-4 border-t border-slate-200 dark:border-[#27272A]">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#27272A] rounded-[8px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Painel de Resultados
        </Button>
      </div>
    </div>
  )
}
