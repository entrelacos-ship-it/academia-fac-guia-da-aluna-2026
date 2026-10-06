import React, { useState } from 'react'
import { FAQ_ENCONTRO_1, FaqItem } from '@/config/encontro1Verbatim'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqEncontro1: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
          DÚVIDAS COMUNS
        </span>
        <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white mt-1">
          Se algo travar.
        </h3>
        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] mt-1 leading-relaxed font-light">
          Orientações rápidas sobre acesso, tempo do diagnóstico, perda da aula ao vivo e
          compartilhamento seguro do seu resultado.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ENCONTRO_1.map((item: FaqItem) => {
          const isOpen = openIds.includes(item.id)

          return (
            <div
              key={item.id}
              className="rounded-[12px] border border-slate-200/90 dark:border-[#27272A] bg-white dark:bg-[#121216] transition-all overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(item.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#18181B] transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-sans font-medium text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] shrink-0" />
                  <span>{item.pergunta}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 dark:text-[#71717A] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#7c3aed] dark:text-[#C084FC]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed border-t border-slate-100 dark:border-[#1f1f23] animate-in fade-in duration-150 font-light">
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
