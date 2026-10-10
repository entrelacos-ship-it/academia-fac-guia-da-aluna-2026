import React, { useState } from 'react'
import { FAQ_ENCONTRO_1, FaqItem } from '@/config/encontro1Verbatim'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqEncontro1: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-7">
      <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
          DÚVIDAS COMUNS
        </span>
        <h3 className="h-section font-medium text-editorial-primary mt-1">
          Se algo{' '}
          <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC]">
            travar
          </em>
          .
        </h3>
        <p className="text-sm sm:text-base text-editorial-secondary mt-2 leading-relaxed font-light">
          Orientações rápidas sobre acesso, tempo do diagnóstico, perda da aula ao vivo e
          compartilhamento seguro do seu resultado.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQ_ENCONTRO_1.map((item: FaqItem) => {
          const isOpen = openIds.includes(item.id)

          return (
            <div
              key={item.id}
              className="rounded-[16px] border border-slate-200/90 dark:border-[#27272A] bg-white dark:bg-[#121216] transition-all overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleFaq(item.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#18181B] transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-sans font-medium text-base sm:text-lg text-editorial-primary flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] shrink-0" />
                  <span>{item.pergunta}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-editorial-tertiary shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#7c3aed] dark:text-[#C084FC]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-3 text-sm sm:text-[15px] text-editorial-secondary leading-relaxed border-t border-slate-100 dark:border-[#1f1f23] animate-in fade-in duration-150 font-light">
                  {item.resposta}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
