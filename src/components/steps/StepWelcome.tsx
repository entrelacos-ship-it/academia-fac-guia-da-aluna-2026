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
    <div className="space-y-10 py-6 max-w-3xl mx-auto">
      {/* Hero Astral — display-lg Inter 64px/1.04 weight 500 */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
          <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
          <span>ASTRAL · MÉTODO FAC</span>
          <span className="text-slate-400 dark:text-[#71717A]">•</span>
          <span className="text-slate-600 dark:text-[#A1A1AA]">ENTRELAÇOS PSICOLOGIA</span>
        </div>

        <h1 className="font-sans text-4xl sm:text-5xl md:text-[60px] font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
          Transforme complexidade clínica em{' '}
          <span className="text-[#7c3aed] dark:text-[#C084FC]">clareza ética</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
          Descubra o piso ético por sessão a partir do seu custo real de vida e da sua prática
          clínica — sem tabelas aleatórias e sem culpa por cobrar o valor justo.
        </p>

        {/* Chips de Problemas — JetBrains Mono */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-orange-50 dark:bg-[#18181B] text-[#ea580c] dark:text-[#FB923C] border border-orange-200 dark:border-[#FB923C]/30">
            <ShieldAlert className="w-3.5 h-3.5" /> SUBPRECIFICAÇÃO CRÔNICA
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-rose-50 dark:bg-[#18181B] text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
            <Flame className="w-3.5 h-3.5" /> RISCO DE BURNOUT
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-[#A1A1AA] border border-slate-200 dark:border-[#27272A]">
            <Scale className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#C084FC]" /> TABELA CFP DEFASADA
          </span>
        </div>
      </div>

      {/* Cartão Central Astral Surface */}
      <div className="bg-white dark:bg-[#18181B] rounded-[16px] p-6 sm:p-8 border border-slate-200 dark:border-[#27272A] shadow-md dark:shadow-xl space-y-6">
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
                  <Sparkles className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                  VER TOUR GUIADO
                </Button>
              )}
            </>
          )}
        </div>

        {/* 4 Pilares da Metodologia — Astral Nested Surfaces */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#27272A]">
          <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
            <BookOpen className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-[#A1A1AA]">
              Como funciona o Método FAC em 4 pilares:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 transition-colors">
              <span className="text-[10px] font-mono font-bold text-[#7c3aed] dark:text-[#C084FC] uppercase tracking-wider block mb-1">
                PILAR 01
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-0.5">
                Custos Pessoais
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] leading-tight">
                Moradia, alimentação, saúde e dignidade de vida.
              </p>
            </div>

            <div className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] hover:border-[#ea580c]/40 dark:hover:border-[#FB923C]/40 transition-colors">
              <span className="text-[10px] font-mono font-bold text-[#ea580c] dark:text-[#FB923C] uppercase tracking-wider block mb-1">
                PILAR 02
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-0.5">
                Custos Profissionais
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] leading-tight">
                Consultório, supervisão, softwares e formação.
              </p>
            </div>

            <div className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] hover:border-[#7c3aed]/40 dark:hover:border-[#C084FC]/40 transition-colors">
              <span className="text-[10px] font-mono font-bold text-[#7c3aed] dark:text-[#C084FC] uppercase tracking-wider block mb-1">
                PILAR 03
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-0.5">
                Retirada (Pró-Labore)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] leading-tight">
                Seu salário real para lazer e projetos futuros.
              </p>
            </div>

            <div className="p-3.5 rounded-[12px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] hover:border-[#ea580c]/40 dark:hover:border-[#FB923C]/40 transition-colors">
              <span className="text-[10px] font-mono font-bold text-[#ea580c] dark:text-[#FB923C] uppercase tracking-wider block mb-1">
                PILAR 04
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-0.5">
                Reserva & Tributos
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] leading-tight">
                Markup divisor com férias, 13º e impostos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip / Citação CFP */}
      <div className="text-center p-4 rounded-[12px] bg-slate-100/70 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
        <p className="text-xs text-slate-700 dark:text-[#A1A1AA] italic max-w-xl mx-auto leading-relaxed">
          &ldquo;A fixação de honorários deve garantir a dignidade do trabalho do psicólogo e o
          padrão ético do atendimento, considerando a complexidade e a formação técnica
          contínua.&rdquo;
        </p>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mt-1.5">
          — DIRETRIZ ÉTICA CFP · CONSELHO FEDERAL DE PSICOLOGIA
        </span>
      </div>
    </div>
  )
}
