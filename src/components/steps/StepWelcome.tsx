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
    <div className="space-y-10 py-4 max-w-3xl mx-auto">
      {/* Hero Editorial */}
      <div className="text-center space-y-4">
        <Badge
          variant="secondary"
          className="bg-[#EDE8F5] text-[#5B3A8E] dark:bg-purple-950 dark:text-purple-300 font-semibold px-3 py-1 rounded-full text-xs inline-flex items-center gap-1.5 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Metodologia Financeira para Psicólogas(os)
        </Badge>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Calculadora de Precificação Clínica{' '}
          <span className="text-[#5B3A8E] dark:text-purple-400 italic">Método FAC</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Descubra o piso ético por sessão a partir do seu custo real de vida e da sua prática
          clínica — sem tabelas aleatórias e sem culpa por cobrar o valor justo.
        </p>

        {/* Chips de Problemas */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <ShieldAlert className="w-3.5 h-3.5" /> Subprecificação crônica
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <Flame className="w-3.5 h-3.5" /> Burnout na agenda
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Scale className="w-3.5 h-3.5" /> Tabela CFP defasada
          </span>
        </div>
      </div>

      {/* Ações de Entrada */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasSavedState ? (
            <>
              <Button
                size="lg"
                onClick={onContinue}
                className="w-full sm:w-auto h-13 px-8 text-base bg-[#5B3A8E] hover:bg-[#452A6F] text-white shadow-md rounded-xl gap-2 font-medium"
              >
                Continuar de onde parei
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onReset}
                className="w-full sm:w-auto h-13 px-6 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl gap-2 font-medium"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                Começar do zero
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                onClick={onStart}
                className="w-full sm:w-auto h-13 px-10 text-base bg-[#5B3A8E] hover:bg-[#452A6F] text-white shadow-md rounded-xl gap-2 font-medium"
              >
                Começar meu cálculo
                <ArrowRight className="w-5 h-5" />
              </Button>
              {onOpenTour && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onOpenTour}
                  className="w-full sm:w-auto h-13 px-6 text-[#5B3A8E] dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-[#EDE8F5]/60 dark:hover:bg-purple-950/40 rounded-xl gap-2 font-medium"
                >
                  <Sparkles className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
                  Ver Tour Guiado
                </Button>
              )}
            </>
          )}
        </div>

        {/* 4 Pilares da Metodologia */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
            <BookOpen className="w-4 h-4 text-[#5B3A8E] dark:text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Como funciona o Método FAC em 4 pilares:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#5B3A8E] dark:text-purple-400 uppercase tracking-wide block mb-1">
                Pilar 1
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-0.5">
                Custos Pessoais
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Moradia, alimentação, saúde e dignidade de vida.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#16746E] dark:text-emerald-400 uppercase tracking-wide block mb-1">
                Pilar 2
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-0.5">
                Custos Profissionais
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Consultório, supervisão, softwares e formação.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#5B3A8E] dark:text-purple-400 uppercase tracking-wide block mb-1">
                Pilar 3
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-0.5">
                Retirada (Pró-Labore)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Seu salário real para lazer e projetos futuros.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#DF694B] dark:text-rose-400 uppercase tracking-wide block mb-1">
                Pilar 4
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-0.5">
                Reserva & Tributos
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Markup divisor com férias, 13º e impostos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip / Citação CFP */}
      <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
        <p className="text-xs text-slate-600 dark:text-slate-400 italic max-w-xl mx-auto">
          &ldquo;A fixação de honorários deve garantir a dignidade do trabalho do psicólogo e o
          padrão ético do atendimento, considerando a complexidade e a formação técnica
          contínua.&rdquo;
        </p>
        <span className="text-[11px] text-slate-500 dark:text-slate-500 font-medium block mt-1">
          — Diretriz Ética do Conselho Federal de Psicologia (CFP)
        </span>
      </div>
    </div>
  )
}
