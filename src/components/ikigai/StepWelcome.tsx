import React, { useState } from 'react'
import {
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IKIGAI_WARNING_NOTE } from '@/config/ikigaiContent'

interface StepWelcomeProps {
  hasExistingData: boolean
  lastUpdated?: string
  onStartNew: () => void
  onResume: () => void
  onImportRetrato: () => void
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({
  hasExistingData,
  lastUpdated,
  onStartNew,
  onResume,
  onImportRetrato,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header com selo Astral */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-xs font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
          <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
          <span>ENCONTRO 2 · ACADEMIA MÉTODO FAC</span>
          <span className="text-slate-400 dark:text-[#71717A]">•</span>
          <span className="text-slate-600 dark:text-[#A1A1AA]">AUTORIA CLÍNICA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-900 dark:text-white leading-tight">
          Meu <span className="text-[#7c3aed] dark:text-[#C084FC]">IKIGAI Clínico</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
          Propósito não é vocação romântica nem sacrifício pessoal. É a prestação de um serviço com
          sentido humano, técnico e com sustentabilidade financeira ética.
        </p>
      </div>

      {/* Card Principal de Orientações */}
      <Card className="astral-card p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 dark:border-[#27272A] pb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-purple-50 dark:bg-[#0A0A14] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold uppercase text-slate-500 dark:text-[#71717A] block">
                Duração estimada
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                20 a 30 minutos
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-orange-50 dark:bg-[#0A0A14] border border-orange-200 dark:border-[#27272A] text-[#ea580c] dark:text-[#FB923C] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold uppercase text-slate-500 dark:text-[#71717A] block">
                Os 4 Círculos
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                Amor, Dom, Dor e Renda
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-emerald-50 dark:bg-[#0A0A14] border border-emerald-200 dark:border-[#27272A] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold uppercase text-slate-500 dark:text-[#71717A] block">
                Sua Conta
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                Salvo na sua nuvem
              </span>
            </div>
          </div>
        </div>

        {/* O que a aluna constrói */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            O que você leva ao finalizar:
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-[#A1A1AA]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Painel IKIGAI estruturado</strong> com seus itens centrais destacados em
                cada dimensão.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Diagnóstico dos vazios</strong> para entender onde sua prática é forte e
                onde precisa de sustentação.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Declaração de Missão em até 2 frases</strong> clara, firme e comunicável a
                colegas e parceiros.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Exportações completas</strong> em imagem PNG, PDF de uma página e bloco para
                colar nos agentes de IA.
              </span>
            </li>
          </ul>
        </div>

        {/* Aviso de salvamento na nuvem da conta */}
        <div className="p-3.5 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] text-xs text-slate-600 dark:text-[#A1A1AA] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>
              Todos os seus dados ficam salvos na sua conta da Academia e sincronizados na nuvem.
              Você pode continuar de qualquer aparelho.
            </span>
          </div>
          {lastUpdated && (
            <span className="font-mono text-[11px] text-slate-400 dark:text-[#71717A] shrink-0 hidden sm:inline">
              Última alteração: {new Date(lastUpdated).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {hasExistingData ? (
            <>
              <Button
                onClick={onResume}
                className="flex-1 gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold min-h-[46px] rounded-[8px] cursor-pointer"
              >
                <span>Continuar de onde parei</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onStartNew}
                className="gap-2 border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f1f23] min-h-[46px] rounded-[8px] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Começar do zero</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onImportRetrato}
                className="flex-1 gap-2 bg-[#ea580c] hover:bg-[#c2410c] dark:bg-[#FB923C] dark:hover:bg-[#f97316] text-white dark:text-[#0A0A14] font-semibold min-h-[46px] rounded-[8px] cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Trazer do Retrato de Autoria</span>
              </Button>
              <Button
                variant="outline"
                onClick={onStartNew}
                className="gap-2 border-slate-200 dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f1f23] min-h-[46px] rounded-[8px] cursor-pointer"
              >
                <span>Começar sem o Retrato</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Nota ética de rodapé */}
      <p className="text-center text-xs font-mono text-slate-400 dark:text-[#71717A]">
        {IKIGAI_WARNING_NOTE}
      </p>
    </div>
  )
}
