import React from 'react'
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Flame,
  Scale,
  CheckCircle2,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StepWelcomeProps {
  onStart: () => void
  onContinue: () => void
  onReset: () => void
  hasSavedState: boolean
  onOpenTour?: () => void
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({
  onStart,
  onContinue,
  onReset,
  hasSavedState,
  onOpenTour,
}) => {
  return (
    <div className="space-y-12 py-8 max-w-3xl mx-auto">
      {/* Hero Editorial */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-300 dark:border-purple-400/20 text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
          <BookOpen className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" />
          <span>MÉTODO FAC</span>
          <span className="text-slate-400 dark:text-zinc-600">•</span>
          <span className="text-slate-700 dark:text-zinc-300">ENTRELAÇOS PSICOLOGIA</span>
        </div>

        <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-[58px] font-normal tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.08]">
          Transforme complexidade clínica em{' '}
          <span className="text-[#7c3aed] dark:text-[#C084FC] italic">clareza ética</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Descubra o piso ético por sessão a partir do seu custo real de vida e da sua prática
          clínica — sem tabelas aleatórias e sem culpa por cobrar o valor justo.
        </p>

        {/* Chips sutis em vez de blocos pesados */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
            <ShieldAlert className="w-3 h-3 text-[#7c3aed] dark:text-[#C084FC]" /> Subprecificação
            crônica
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
            <Flame className="w-3 h-3 text-[#ea580c] dark:text-orange-400" /> Risco de burnout
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
            <Scale className="w-3 h-3 text-[#7c3aed] dark:text-[#C084FC]" /> Tabela CFP defasada
          </span>
        </div>
      </div>

      {/* Cartão Central Editorial — sem sombras pesadas, com divisórias finas */}
      <div className="bg-white/80 dark:bg-[#0c0914] rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasSavedState ? (
            <>
              <Button
                size="lg"
                onClick={onContinue}
                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] shadow-md shadow-[#7c3aed]/20 dark:shadow-[#C084FC]/20 rounded-[8px] gap-2 transition-all"
              >
                <span>Continuar de onde parei</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onReset}
                className="w-full sm:w-auto h-12 px-6 text-slate-700 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-white border-slate-200 dark:border-[#27272A] hover:bg-slate-100 dark:hover:bg-[#27272A] rounded-[8px] gap-2 font-medium"
              >
                <RotateCcw className="w-4 h-4 text-slate-500 dark:text-[#71717A]" />
                Começar do zero
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                onClick={onStart}
                className="w-full sm:w-auto h-12 px-10 text-sm font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] shadow-md shadow-[#7c3aed]/20 dark:shadow-[#C084FC]/20 rounded-[8px] gap-2 transition-all"
              >
                <span>Começar meu cálculo ético</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              {onOpenTour && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onOpenTour}
                  className="w-full sm:w-auto h-12 px-6 text-[#7c3aed] dark:text-[#C084FC] border-slate-200 dark:border-[#27272A] hover:bg-slate-100 dark:hover:bg-[#27272A] rounded-[8px] gap-2 font-mono text-xs font-semibold"
                >
                  <Compass className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                  VER TOUR GUIADO
                </Button>
              )}
            </>
          )}
        </div>

        {/* 4 Pilares da Metodologia — Linhas editoriais com numeração sutil */}
        <div className="pt-6 border-t border-slate-200/70 dark:border-zinc-800/70 space-y-4">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <BookOpen className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              O Método FAC em 4 pilares:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="editorial-row p-4 rounded-xl border border-slate-300/80 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30">
              <span className="text-[10px] font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                01
              </span>
              <h4 className="font-serif-editorial text-base text-slate-900 dark:text-zinc-100 mb-1">
                Custos Pessoais
              </h4>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Moradia, alimentação, saúde e dignidade de vida.
              </p>
            </div>

            <div className="editorial-row p-4 rounded-xl border border-slate-300/80 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30">
              <span className="text-[10px] font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                02
              </span>
              <h4 className="font-serif-editorial text-base text-slate-900 dark:text-zinc-100 mb-1">
                Custos Profissionais
              </h4>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Consultório, supervisão, softwares e formação.
              </p>
            </div>

            <div className="editorial-row p-4 rounded-xl border border-slate-300/80 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30">
              <span className="text-[10px] font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                03
              </span>
              <h4 className="font-serif-editorial text-base text-slate-900 dark:text-zinc-100 mb-1">
                Retirada Desejada
              </h4>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Seu salário real para lazer e projetos futuros.
              </p>
            </div>

            <div className="editorial-row p-4 rounded-xl border border-slate-300/80 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30">
              <span className="text-[10px] font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] block mb-1">
                04
              </span>
              <h4 className="font-serif-editorial text-base text-slate-900 dark:text-zinc-100 mb-1">
                Reserva & Tributos
              </h4>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Markup divisor com férias, 13º e impostos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Citação CFP — editorial discreto */}
      <div className="text-center py-4 border-t border-b border-slate-200/60 dark:border-zinc-800/60 max-w-xl mx-auto">
        <p className="font-serif-editorial text-sm sm:text-base text-slate-700 dark:text-zinc-300 italic leading-relaxed">
          &ldquo;A fixação de honorários deve garantir a dignidade do trabalho do psicólogo e o
          padrão ético do atendimento, considerando a complexidade e a formação técnica
          contínua.&rdquo;
        </p>
        <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-widest block mt-2">
          Diretriz Ética CFP · Conselho Federal de Psicologia
        </span>
      </div>
    </div>
  )
}
