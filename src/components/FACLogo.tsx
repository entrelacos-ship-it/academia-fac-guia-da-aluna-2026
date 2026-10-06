import React from 'react'
import { cn } from '@/lib/utils'
import facLogoSrc from '@/assets/academia-fac-41d14.png'

export { facLogoSrc }

interface FACLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withText?: boolean
  withBadge?: boolean
  subtitle?: string
  alt?: string
}

/**
 * Símbolo / Ícone oficial da Academia FAC:
 * Renderiza a nova logo quadrada da Academia Método FAC (com fundo preto, "MÉTODO" em laranja,
 * "FAC" em roxo grande e "ACADEMIA" em laranja, com o símbolo Ψ no canto superior).
 * Possui cantos arredondados suaves e badge escuro sutil que harmoniza tanto com o tema claro quanto escuro.
 */
export const FACSymbol: React.FC<{
  className?: string
  size?: number | string
  glow?: boolean
  alt?: string
}> = ({
  className,
  size = 36,
  glow = false,
  alt = 'Academia Método FAC — Entrelaços Psicologia',
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={cn(
        'relative shrink-0 select-none aspect-square rounded-[9px] sm:rounded-[10px] overflow-hidden bg-black shadow-xs ring-1 ring-black/10 dark:ring-white/10 transition-transform duration-200',
        glow && 'shadow-[0_0_12px_rgba(124,58,237,0.35)]',
        className,
      )}
    >
      <img
        src={facLogoSrc}
        alt={alt}
        className="w-full h-full object-cover select-none"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

/**
 * Componente completo de Marca da Academia Método FAC:
 * Logo oficial da Academia FAC integrada com suporte a temas claro/escuro
 * mantendo a proporção quadrada perfeita, cantos arredondados elegantes e alt descritivo.
 */
export const FACLogo: React.FC<FACLogoProps> = ({
  className,
  size = 'md',
  withText = true,
  withBadge = true,
  subtitle = 'Academia Entrelaços',
  alt = 'Academia Método FAC — Entrelaços Psicologia',
}) => {
  const sizeMap = {
    sm: {
      box: 'w-8 h-8 rounded-[8px]',
      imgSize: 32,
      title: 'text-sm',
      sub: 'text-[10px]',
      badge: 'text-[9px] px-1 py-0.2',
    },
    md: {
      box: 'w-10 h-10 rounded-[10px]',
      imgSize: 40,
      title: 'text-base',
      sub: 'text-[11px]',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    lg: {
      box: 'w-12 h-12 rounded-[12px]',
      imgSize: 48,
      title: 'text-lg',
      sub: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5',
    },
    xl: {
      box: 'w-14 h-14 rounded-[14px]',
      imgSize: 56,
      title: 'text-xl',
      sub: 'text-xs',
      badge: 'text-[11px] px-2 py-0.5',
    },
  }[size]

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      {/* Box arredondado com a logo oficial quadrada */}
      <div
        className={cn(
          sizeMap.box,
          'relative shrink-0 aspect-square overflow-hidden bg-black ring-1 ring-black/15 dark:ring-white/15 shadow-sm transition-transform duration-200 group-hover:scale-102 flex items-center justify-center p-0.5',
        )}
      >
        <img
          src={facLogoSrc}
          alt={alt}
          width={sizeMap.imgSize}
          height={sizeMap.imgSize}
          className="w-full h-full object-cover rounded-[inherit] select-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {withText && (
        <div className="flex flex-col text-left leading-none min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'font-sans font-bold tracking-tight text-slate-900 dark:text-white leading-tight truncate',
                sizeMap.title,
              )}
            >
              Academia FAC
            </span>
            {withBadge && (
              <span
                className={cn(
                  'font-mono font-semibold tracking-wider uppercase rounded-[4px] bg-purple-100/80 dark:bg-[#18181B] border border-purple-300 dark:border-[#27272A] text-[#6d28d9] dark:text-[#C084FC] shrink-0',
                  sizeMap.badge,
                )}
              >
                Método FAC
              </span>
            )}
          </div>
          {subtitle && (
            <span
              className={cn(
                'text-slate-500 dark:text-[#A1A1AA] font-normal truncate mt-0.5',
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
