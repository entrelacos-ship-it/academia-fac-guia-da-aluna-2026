import React, { useState } from 'react'
import { FACES_CUBO_FAC, FaceCubo } from '@/config/encontro1Verbatim'
import { ArrowRight, Box } from 'lucide-react'

interface CuboFacSelectorProps {
  onScrollToAnchor?: (anchorId: string) => void
}

export const CuboFacSelector: React.FC<CuboFacSelectorProps> = ({ onScrollToAnchor }) => {
  const [activeFace, setActiveFace] = useState<'F' | 'A' | 'C'>('F')
  const current: FaceCubo = FACES_CUBO_FAC[activeFace]

  const handleLinkClick = (e: React.MouseEvent, ancoraId: string) => {
    e.preventDefault()
    if (onScrollToAnchor) {
      onScrollToAnchor(ancoraId)
    } else {
      const el = document.getElementById(ancoraId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className="rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-6 sm:p-7 space-y-6">
      {/* Cabeçalho do seletor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-[#27272A] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            TRÊS FACES / UMA PRÁTICA
          </span>
          <h4 className="font-serif-editorial text-xl sm:text-2xl font-normal text-slate-900 dark:text-white mt-0.5">
            Explore o cubo FAC
          </h4>
        </div>

        {/* Botões seletores de Face */}
        <div className="inline-flex items-center p-1 rounded-[10px] bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] self-start sm:self-auto">
          <span className="text-[11px] font-mono text-slate-500 dark:text-[#A1A1AA] px-2.5 hidden sm:inline">
            Escolha uma face:
          </span>
          {(['F', 'A', 'C'] as const).map((letra) => {
            const isSelected = activeFace === letra
            const nomePilar = FACES_CUBO_FAC[letra].pilar
            return (
              <button
                key={letra}
                type="button"
                onClick={() => setActiveFace(letra)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-[8px] text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#27272A] text-slate-900 dark:text-white shadow-xs font-semibold border border-slate-200 dark:border-[#3f3f46]'
                    : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-pressed={isSelected}
              >
                <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] flex items-center justify-center font-bold text-[11px]">
                  {letra}
                </span>
                <span>{nomePilar}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo da Face Ativa */}
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/50">
            {current.kicker}
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-[#71717A]">•</span>
          <span className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA]">
            Pilar {current.pilar}
          </span>
        </div>

        <h5 className="font-serif-editorial text-xl sm:text-2xl font-normal text-slate-900 dark:text-white">
          "{current.pergunta}"
        </h5>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
          {current.corpo}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-[#1f1f23]">
          <div className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA] flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A]">
              Peça possível:
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {current.pecaPossivel}
            </span>
          </div>

          <a
            href={`#${current.ancoraId}`}
            onClick={(e) => handleLinkClick(e, current.ancoraId)}
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] hover:underline cursor-pointer"
          >
            <span>{current.linkRotulo}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
