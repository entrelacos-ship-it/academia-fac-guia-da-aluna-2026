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
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Cabeçalho Editorial */}
      <div className="border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] tracking-wider uppercase">
            Passo 07 de 07
          </span>
          <span className="text-slate-300 dark:text-zinc-700">•</span>
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
            Síntese Prática
          </span>
        </div>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-slate-900 dark:text-zinc-100">
          Comparativo dos 4 Modelos Clínicos de Atuação
        </h2>
        <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
          Compare os 4 modelos clínicos para decidir seu melhor formato de atuação profissional,
          pesando riscos de burnout, custos fixos e autonomia de honorários.
        </p>
      </div>

      {/* Grid de 4 Modelos em Estilo Linhas / Superfícies Sutis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Consultório Particular (Ouro FAC) */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0c0914] border border-[#7c3aed]/40 dark:border-[#C084FC]/30 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 bg-[#7c3aed]/10 dark:bg-[#C084FC]/15 text-[#7c3aed] dark:text-[#C084FC] text-[10px] font-mono font-medium uppercase tracking-wider py-1 px-3 rounded-bl-xl border-l border-b border-[#7c3aed]/20 dark:border-[#C084FC]/20">
            Padrão Ouro
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-[#7c3aed] dark:text-[#C084FC] block mt-1">
              01
            </span>
            <div>
              <h3 className="font-serif-editorial text-lg text-slate-900 dark:text-zinc-100">
                Consultório Particular
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-light mt-0.5">
                Modelo soberano de atendimento
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-light pt-3 border-t border-slate-200/60 dark:border-zinc-800/60">
              <li className="flex items-start gap-1.5">
                <span className="text-[#7c3aed] dark:text-[#C084FC]">•</span>
                <span>Autonomia total de precificação ética</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#7c3aed] dark:text-[#C084FC]">•</span>
                <span>Fixação de honorários baseada no Método FAC</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#7c3aed] dark:text-[#C084FC]">•</span>
                <span>Dedicação à escuta sem volume industrial</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] font-mono uppercase text-[#7c3aed] dark:text-[#C084FC] tracking-wider block">
              Recomendação FAC
            </span>
            <span className="text-xs font-medium text-slate-900 dark:text-zinc-200">
              Altamente Recomendado
            </span>
          </div>
        </div>

        {/* 2. Convênios / Planos de Saúde */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#0c0914] border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between transition-all">
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 dark:text-zinc-500 block">02</span>
            <div>
              <h3 className="font-serif-editorial text-lg text-slate-900 dark:text-zinc-100">
                Convênios / Planos
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-light mt-0.5">
                Intermediado por operadoras
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-light pt-3 border-t border-slate-200/60 dark:border-zinc-800/60">
              <li className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400">
                <span>•</span>
                <span>Repasse aviltado por sessão (R$ 20 a R$ 45)</span>
              </li>
              <li className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400">
                <span>•</span>
                <span>Exige volume alto (35+ sessões/sem)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>•</span>
                <span>Limites rígidos de reajuste e glosas</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] font-mono uppercase text-rose-600 dark:text-rose-400 tracking-wider block">
              Alerta Clínico
            </span>
            <span className="text-xs font-medium text-slate-900 dark:text-zinc-200">
              Risco alto de burnout
            </span>
          </div>
        </div>

        {/* 3. Sublocação / Coworking */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#0c0914] border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between transition-all">
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 dark:text-zinc-500 block">03</span>
            <div>
              <h3 className="font-serif-editorial text-lg text-slate-900 dark:text-zinc-100">
                Sublocação / Turnos
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-light mt-0.5">
                Compartilhamento por turno ou hora
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-light pt-3 border-t border-slate-200/60 dark:border-zinc-800/60">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">•</span>
                <span>Custos fixos iniciais reduzidos</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>•</span>
                <span>Menos controle de agenda</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">•</span>
                <span>Excelente rampa de transição</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
              Transição Segura
            </span>
            <span className="text-xs font-medium text-slate-900 dark:text-zinc-200">
              Ideal para início ou validação
            </span>
          </div>
        </div>

        {/* 4. Atendimento Online (Home Office) */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#0c0914] border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between transition-all">
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 dark:text-zinc-500 block">04</span>
            <div>
              <h3 className="font-serif-editorial text-lg text-slate-900 dark:text-zinc-100">
                Online / Home Office
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-light mt-0.5">
                Atendimento remoto regulado CFP
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-light pt-3 border-t border-slate-200/60 dark:border-zinc-800/60">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">•</span>
                <span>Sem despesa de aluguel físico</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">•</span>
                <span>Flexibilidade geográfica ampla</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>•</span>
                <span>Exige disciplina e sigilo rígido</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
              Alta Eficiência
            </span>
            <span className="text-xs font-medium text-slate-900 dark:text-zinc-200">
              Margem sustentável
            </span>
          </div>
        </div>
      </div>

      {/* Tabela Comparativa Detalhada - Editorial */}
      <div className="bg-white/70 dark:bg-[#0c0914] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
        <h3 className="font-serif-editorial text-xl text-slate-900 dark:text-zinc-100">
          Matriz Comparativa das Modalidades
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-zinc-800/70 bg-white/40 dark:bg-zinc-950/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 font-mono uppercase tracking-wider border-b border-slate-200/70 dark:border-zinc-800/70">
              <tr>
                <th className="py-3 px-4">Critério de Avaliação</th>
                <th className="py-3 px-4 text-[#7c3aed] dark:text-[#C084FC]">
                  Particular (Ouro FAC)
                </th>
                <th className="py-3 px-4 text-orange-600 dark:text-orange-400">
                  Convênios / Planos
                </th>
                <th className="py-3 px-4 text-slate-900 dark:text-zinc-100">Sublocação</th>
                <th className="py-3 px-4 text-[#7c3aed] dark:text-[#C084FC]">Online Home Office</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 text-slate-600 dark:text-zinc-400 font-light">
              <tr>
                <td className="py-3 px-4 font-normal text-slate-900 dark:text-zinc-100">
                  Custo de Instalação
                </td>
                <td className="py-3 px-4 font-mono">Médio / Alto</td>
                <td className="py-3 px-4 font-mono">Baixo (credenciamento)</td>
                <td className="py-3 px-4 font-mono">Baixo</td>
                <td className="py-3 px-4 font-mono">Mínimo</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-normal text-slate-900 dark:text-zinc-100">
                  Custo Mensal Estimado
                </td>
                <td className="py-3 px-4 font-mono">Fixo (R$ 800 a R$ 2.500)</td>
                <td className="py-3 px-4 font-mono">Variável / Dependente</td>
                <td className="py-3 px-4 font-mono">Variável por turno</td>
                <td className="py-3 px-4 font-mono">Mínimo</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-normal text-slate-900 dark:text-zinc-100">
                  Autonomia de Preço
                </td>
                <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">
                  Total (100% livre)
                </td>
                <td className="py-3 px-4 font-medium text-rose-600 dark:text-rose-400">
                  Nula (tabela do plano)
                </td>
                <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">
                  Total
                </td>
                <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">
                  Total
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-normal text-slate-900 dark:text-zinc-100">
                  Risco de Burnout
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-normal">
                  Baixo a Moderado
                </td>
                <td className="py-3 px-4 text-rose-600 dark:text-rose-400 font-medium">
                  Crítico (volume alto)
                </td>
                <td className="py-3 px-4">Moderado</td>
                <td className="py-3 px-4">Baixo a Moderado</td>
              </tr>
              <tr className="bg-purple-500/5 dark:bg-purple-400/5">
                <td className="py-3 px-4 text-[#7c3aed] dark:text-[#C084FC] font-mono font-medium">
                  Recomendação FAC
                </td>
                <td className="py-3 px-4 font-medium text-[#7c3aed] dark:text-[#C084FC]">
                  Meta Principal
                </td>
                <td className="py-3 px-4 text-rose-600 dark:text-rose-400">Desmame Planejado</td>
                <td className="py-3 px-4 text-orange-600 dark:text-orange-400">
                  Rampa de Transição
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">
                  Excelente Formato
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Caixa de Recomendação Final - Linha Editorial */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/70 dark:bg-[#0c0914] border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-mono font-medium text-[#7c3aed] dark:text-[#C084FC] uppercase tracking-wider block mb-1">
            Síntese Metodológica
          </span>
          <h4 className="font-serif-editorial text-2xl text-slate-900 dark:text-zinc-100">
            A soberania do consultório particular
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-light leading-relaxed mt-2">
            Para a imensa maioria das psicólogas(os), o{' '}
            <strong className="text-slate-900 dark:text-zinc-100 font-normal">
              Consultório Particular
            </strong>{' '}
            (presencial ou online) oferece o único caminho verdadeiramente ético para aliar escuta
            qualificada, tempo de estudo contínuo e remuneração condizente com a dignidade da
            profissão.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200/70 dark:border-zinc-800/70">
          <Button
            variant="outline"
            onClick={onKeepData}
            className="w-full sm:w-auto border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
          >
            Voltar ao Painel de Resultados
          </Button>
          <Button
            onClick={onReset}
            className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-medium gap-2 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Refazer o cálculo do zero
          </Button>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="flex items-center justify-start pt-4 border-t border-slate-200/80 dark:border-zinc-800/80">
        <Button
          variant="outline"
          onClick={onPrev}
          className="gap-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Painel de Resultados
        </Button>
      </div>
    </div>
  )
}
