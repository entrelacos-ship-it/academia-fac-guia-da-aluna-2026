import React from 'react'
import { cn } from '@/lib/utils'

interface FACLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withText?: boolean
  withBadge?: boolean
  subtitle?: string
}

/**
 * Símbolo vetorial exclusivo do Método FAC:
 * Geometria precisa inspirada em entrelaços, equilíbrio financeiro e acolhimento clínico.
 * Construído com traço fino e elegante (stroke ~1.6 - 1.8), roxo de identidade com gradiente sutil.
 */
export const FACSymbol: React.FC<{
  className?: string
  size?: number | string
  glow?: boolean
}> = ({ className, size = 24, glow = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none transition-transform duration-300', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="fac-symbol-grad"
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
        {glow && (
          <filter id="fac-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Traço 1: Elo geométrico superior esquerdo (Foco/Fundamento) */}
      <path
        d="M 16 4.5 C 10.5 4.5 6 9 6 14.5 C 6 18.5 8.5 21.8 12 23.2 L 13.5 20.2 C 11.2 19.2 9.5 17 9.5 14.5 C 9.5 10.9 12.4 8 16 8 C 19.6 8 22.5 10.9 22.5 14.5 C 22.5 15.6 22.2 16.6 21.7 17.5 L 24.8 19 C 25.6 17.7 26 16.1 26 14.5 C 26 9 21.5 4.5 16 4.5 Z"
        fill="url(#fac-symbol-grad)"
        opacity="0.9"
        filter={glow ? 'url(#fac-glow)' : undefined}
      />

      {/* Traço 2: Elo entrelaçado dinâmico (Ação/Acolhimento & Crescimento) */}
      <path
        d="M 16 12 C 14.6 12 13.5 13.1 13.5 14.5 C 13.5 15.4 14 16.2 14.7 16.6 L 9 27.5 L 12.5 27.5 L 16.5 19.8 L 20.5 27.5 L 24 27.5 L 17.8 15.5 C 18.2 15.2 18.5 14.9 18.5 14.5 C 18.5 13.1 17.4 12 16 12 Z"
        fill="url(#fac-symbol-grad)"
        filter={glow ? 'url(#fac-glow)' : undefined}
      />

      {/* Ponto focal de equilíbrio / Precificação Consciente */}
      <circle cx="16" cy="14.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

/**
 * Componente completo de Marca Método FAC:
 * Símbolo vetorial refinado em box estilizado + Wordmark tipográfico estruturado.
 */
export const FACLogo: React.FC<FACLogoProps> = ({
  className,
  size = 'md',
  withText = true,
  withBadge = true,
  subtitle = 'Precificação Clínica Ética',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7 rounded-[7px]', iconSize: 16, title: 'text-sm', sub: 'text-[10px]' },
    md: { box: 'w-9 h-9 rounded-[8px]', iconSize: 20, title: 'text-base', sub: 'text-[11px]' },
    lg: { box: 'w-11 h-11 rounded-[10px]', iconSize: 24, title: 'text-lg', sub: 'text-xs' },
    xl: { box: 'w-13 h-13 rounded-[12px]', iconSize: 28, title: 'text-xl', sub: 'text-xs' },
  }[size]

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <div
        className={cn(
          sizeMap.box,
          'bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center shadow-xs transition-colors shrink-0',
        )}
      >
        <FACSymbol size={sizeMap.iconSize} />
      </div>

      {withText && (
        <div className="flex flex-col text-left">
          <span
            className={cn(
              'font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight',
              sizeMap.title,
            )}
          >
            Método FAC
            {withBadge && (
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] bg-purple-100/70 dark:bg-[#18181B] border border-purple-300 dark:border-[#27272A] text-[#6d28d9] dark:text-[#C084FC]">
                Astral
              </span>
            )}
          </span>
          {subtitle && (
            <span
              className={cn(
                'text-slate-500 dark:text-[#A1A1AA] -mt-0.5 font-normal truncate',
                sizeMap.sub,
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
