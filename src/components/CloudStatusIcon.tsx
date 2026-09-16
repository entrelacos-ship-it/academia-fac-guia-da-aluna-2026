import React from 'react'
import { cn } from '@/lib/utils'

export type CloudIconStatus = 'disconnected' | 'connected' | 'syncing' | 'idle'

interface CloudStatusIconProps {
  status?: CloudIconStatus
  className?: string
  size?: number | string
  strokeWidth?: number
  action?: 'none' | 'upload' | 'download'
}

/**
 * Ícone de nuvem vetorial refinado com traço fino e elegante (estilo Lucide stroke 1.75),
 * com suporte a estados visuais nítidos:
 * - 'disconnected': nuvem com traço suave ou linha diagonal elegante
 * - 'connected': nuvem com checkmark de sincronização integrado
 * - 'syncing': nuvem com elos/setas de sincronia ou pulso de dados
 * - 'idle': nuvem minimalista limpa
 */
export const CloudStatusIcon: React.FC<CloudStatusIconProps> = ({
  status = 'connected',
  action = 'none',
  className,
  size = 18,
  strokeWidth = 1.75,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block shrink-0', className)}
      aria-hidden="true"
    >
      {/* Corpo da Nuvem de traço fino e curvatura suave */}
      {status === 'disconnected' ? (
        <>
          <path d="M 4 14.89 C 3.04 14.28 2.5 13.19 2.5 12 C 2.5 9.51 4.51 7.5 7 7.5 C 7.55 7.5 8.08 7.6 8.57 7.78 M 10.5 5.5 C 11.83 4.56 13.48 4 15.25 4 C 19.25 4 22.5 7.25 22.5 11.25 C 22.5 12.33 22.26 13.35 21.84 14.26" />
          <path d="M 7.5 19.5 L 18.5 19.5 C 20.43 19.5 22 17.93 22 16" />
          {/* Barra diagonal elegante de desconexão */}
          <line x1="2" y1="2" x2="22" y2="22" strokeWidth={strokeWidth} />
        </>
      ) : (
        <path d="M 17.5 19 C 19.98 19 22 16.98 22 14.5 C 22 12.15 20.2 10.22 17.9 10.03 C 17.45 6.64 14.55 4 11 4 C 7.74 4 5.03 6.16 4.22 9.17 C 2.42 9.87 1 11.64 1 13.75 C 1 16.51 3.24 18.75 6 18.75 L 17.5 18.75" />
      )}

      {/* Ação ou Estado Interno */}
      {status === 'syncing' && (
        <g className="animate-spin origin-[12px_13px]">
          <path d="M 10 11.5 A 2.5 2.5 0 0 1 14 11.5" strokeWidth={strokeWidth} />
          <path d="M 14 14.5 A 2.5 2.5 0 0 1 10 14.5" strokeWidth={strokeWidth} />
          <polyline points="13.5,10 14.5,11.5 13,12" strokeWidth={strokeWidth} />
          <polyline points="10.5,16 9.5,14.5 11,14" strokeWidth={strokeWidth} />
        </g>
      )}

      {status === 'connected' && action === 'none' && (
        <polyline points="9 13.5 11.2 15.5 15 11" strokeWidth={strokeWidth} />
      )}

      {action === 'upload' && (
        <>
          <line x1="12" y1="16.5" x2="12" y2="10" strokeWidth={strokeWidth} />
          <polyline points="9.5 12.5 12 10 14.5 12.5" strokeWidth={strokeWidth} />
        </>
      )}

      {action === 'download' && (
        <>
          <line x1="12" y1="10" x2="12" y2="16.5" strokeWidth={strokeWidth} />
          <polyline points="9.5 14 12 16.5 14.5 14" strokeWidth={strokeWidth} />
        </>
      )}
    </svg>
  )
}
