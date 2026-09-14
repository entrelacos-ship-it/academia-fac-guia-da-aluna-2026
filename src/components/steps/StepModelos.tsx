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
      {/* Banner */}
      <div className="p-4 rounded-xl bg-[#F5F2F9] dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#5B3A8E] text-white shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Passo 7: Comparativo dos 4 Modelos Clínicos de Atuação
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
            Compare os 4 modelos clínicos para decidir seu melhor formato de atuação profissional,
            pesando riscos de burnout, custos fixos e autonomia de honorários.
          </p>
        </div>
      </div>

      {/* Grid de 4 Cards de Modelos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Consultório Particular (Ouro FAC) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#5B3A8E] shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#5B3A8E] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-300" /> Ouro FAC
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#5B3A8E] flex items-center justify-center mt-2">
              <Award className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Consultório Particular
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modelo soberano de atendimento
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B3A8E] shrink-0 mt-0.5" />
                <span>Autonomia total de precificação ética</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B3A8E] shrink-0 mt-0.5" />
                <span>Fixação de honorários baseada no Método FAC</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B3A8E] shrink-0 mt-0.5" />
                <span>Dedicação integral à escuta sem volume industrial</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-[#5B3A8E] tracking-wider block">
              Recomendação FAC
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Altamente Recomendado (Padrão Ouro)
            </span>
          </div>
        </div>

        {/* 2. Convênios / Planos de Saúde */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Convênios / Planos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atendimento intermediado por operadoras
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-1.5 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Repasse aviltado por sessão (R$ 20 a R$ 45)</span>
              </li>
              <li className="flex items-start gap-1.5 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Exige volume alto (35+ sessões/sem)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5">•</span>
                <span>Limites rígidos de reajuste e glosas</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-rose-600 tracking-wider block">
              Risco Crítico
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Alto risco de burnout e déficit crônico
            </span>
          </div>
        </div>

        {/* 3. Sublocação / Coworking */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#16746E] dark:text-emerald-400 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Sublocação / Turnos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compartilhamento físico por hora ou bloco
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Custos fixos iniciais bastante reduzidos</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5">•</span>
                <span>Menos controle de agenda e personalização</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Excelente rampa de transição para o início</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider block">
              Transição Segura
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Recomendado para início ou validação
            </span>
          </div>
        </div>

        {/* 4. Atendimento Online (Home Office) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <MonitorSmartphone className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Online / Home Office
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atendimento remoto regulado pelo CFP
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Sem despesa de aluguel físico</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Flexibilidade geográfica nacional e internacional</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5">•</span>
                <span>Exige disciplina de gestão e sigilo rígido</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-teal-600 tracking-wider block">
              Alta Eficiência
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Margem de lucro elevada se bem posicionado
            </span>
          </div>
        </div>
      </div>

      {/* Tabela Comparativa Detalhada */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
          Matriz Comparativa das Modalidades
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Critério de Avaliação</th>
                <th className="py-2.5 px-3 font-semibold text-[#5B3A8E] dark:text-purple-300">
                  Particular (Ouro FAC)
                </th>
                <th className="py-2.5 px-3 font-semibold text-amber-700 dark:text-amber-400">
                  Convênios / Planos
                </th>
                <th className="py-2.5 px-3 font-semibold text-[#16746E] dark:text-emerald-400">
                  Sublocação
                </th>
                <th className="py-2.5 px-3 font-semibold text-teal-700 dark:text-teal-400">
                  Online Home Office
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-medium">Custo de Instalação</td>
                <td className="py-2.5 px-3">Médio / Alto</td>
                <td className="py-2.5 px-3">Baixo (credenciamento)</td>
                <td className="py-2.5 px-3">Baixo</td>
                <td className="py-2.5 px-3">Muito Baixo (computador/luz)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Custo Mensal Estimado</td>
                <td className="py-2.5 px-3">Fixo (R$ 800 a R$ 2.500)</td>
                <td className="py-2.5 px-3">Variável / Dependente</td>
                <td className="py-2.5 px-3">Variável por turno</td>
                <td className="py-2.5 px-3">Mínimo (internet/softwares)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Autonomia de Preço</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600">Total (100% livre)</td>
                <td className="py-2.5 px-3 font-bold text-rose-600">Nula (tabela do plano)</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600">Total</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600">Total</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Risco de Burnout</td>
                <td className="py-2.5 px-3 text-emerald-700 font-medium">Baixo a Moderado</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">Crítico (volume excessivo)</td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Moderado</td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Baixo a Moderado</td>
              </tr>
              <tr className="bg-purple-50/50 dark:bg-purple-950/20 font-semibold">
                <td className="py-2.5 px-3 text-[#5B3A8E] dark:text-purple-300">
                  Recomendação FAC
                </td>
                <td className="py-2.5 px-3 text-[#5B3A8E]">Meta Principal</td>
                <td className="py-2.5 px-3 text-rose-700">Evitar / Desmame</td>
                <td className="py-2.5 px-3 text-[#16746E]">Rampa de Transição</td>
                <td className="py-2.5 px-3 text-teal-700">Excelente Complemento</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Caixa de Recomendação Final & Próximos Passos */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F5F2F9] to-[#EDE8F5] dark:from-purple-950/40 dark:to-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#5B3A8E] text-white shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
              Síntese Metodológica do Método FAC
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
              Para a imensa maioria das psicólogas(os), o <strong>Consultório Particular</strong>{' '}
              (presencial ou online) oferece o único caminho verdadeiramente ético para aliar escuta
              qualificada, tempo de estudo contínuo e remuneração condizente com a dignidade da
              profissão.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-purple-200/60 dark:border-purple-900/60">
          <Button
            variant="outline"
            onClick={onKeepData}
            className="w-full sm:w-auto border-purple-300 dark:border-purple-800 text-[#5B3A8E] dark:text-purple-300 hover:bg-white"
          >
            Voltar ao Painel de Resultados
          </Button>
          <Button
            onClick={onReset}
            className="w-full sm:w-auto bg-[#5B3A8E] hover:bg-[#452A6F] text-white gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Refazer o cálculo do zero
          </Button>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="flex items-center justify-start pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-300 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Painel de Resultados
        </Button>
      </div>
    </div>
  )
}
