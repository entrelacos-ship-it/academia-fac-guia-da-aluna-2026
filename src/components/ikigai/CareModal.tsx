import React from 'react'
import { AlertCircle, HeartHandshake, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CareModalProps {
  aberto: boolean
  motivo?: 'risco' | 'total' | 'ressonancia_liberdade' | 'termometro_baixo' | null
  onContinuar?: () => void
  onPausar?: () => void
}

export const CareModal: React.FC<CareModalProps> = ({
  aberto,
  motivo = 'risco',
  onContinuar,
  onPausar,
}) => {
  if (!aberto) return null

  const isRiscoCritico = motivo === 'risco'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="care-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
    >
      <div className="w-full max-w-lg rounded-[20px] border border-border bg-card p-6 sm:p-8 shadow-xl text-left space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Protocolo de Cuidado e Acolhimento
            </span>
            <h3
              id="care-dialog-title"
              className="font-serif-editorial text-2xl font-medium text-foreground"
            >
              O que você sente importa e merece cuidado.
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Obrigada por me contar isso. O seu sentir no trabalho é precioso e merece escuta
            delicada.
          </p>

          <p>
            Isto é para levar à sua psicoterapia, à sua supervisão clínica ou a alguém de sua
            inteira confiança. Eu não faço avaliação nem diagnóstico e não substituo acompanhamento
            terapêutico.
          </p>

          <div className="p-4 rounded-[12px] bg-muted/40 border border-border space-y-2 text-xs">
            <div className="flex items-center gap-2 font-mono font-semibold text-foreground">
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>Canais de Apoio Gratuitos e Confidenciais no Brasil:</span>
            </div>
            <p className="text-muted-foreground">
              • <strong>CVV (Centro de Valorização da Vida):</strong> disque <strong>188</strong>{' '}
              (ligação gratuita, 24 horas por dia).
            </p>
            <p className="text-muted-foreground">
              • <strong>SAMU (Emergência médica e psiquiátrica):</strong> disque{' '}
              <strong>192</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onPausar}
            className="w-full sm:w-auto min-h-[44px] text-xs font-mono rounded-[8px]"
          >
            Pausar e cuidar de mim
          </Button>

          {!isRiscoCritico ? (
            <Button
              type="button"
              onClick={onContinuar}
              className="w-full sm:w-auto min-h-[44px] text-xs font-mono rounded-[8px] bg-primary text-primary-foreground"
            >
              <span>Quero continuar por agora</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onPausar}
              className="w-full sm:w-auto min-h-[44px] text-xs font-mono rounded-[8px] bg-rose-600 text-white hover:bg-rose-700"
            >
              Salvar e sair
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
