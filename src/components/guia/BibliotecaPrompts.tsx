import React, { useState } from 'react'
import { PROMPTS_BIBLIOTECA_ENCONTRO_1, PromptApoio } from '@/config/encontro1Verbatim'
import { Copy, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const BibliotecaPrompts: React.FC = () => {
  const [copiadoId, setCopiadoId] = useState<string | null>(null)

  const handleCopiarPrompt = async (prompt: PromptApoio) => {
    try {
      await navigator.clipboard.writeText(prompt.texto)
      setCopiadoId(prompt.id)
      setTimeout(() => setCopiadoId(null), 3000)
    } catch (err) {
      console.warn('Falha ao copiar prompt:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
          BIBLIOTECA COPIÁVEL
        </span>
        <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white mt-1">
          Prompts para pensar com mais clareza.
        </h3>
        <p className="text-sm text-slate-600 dark:text-[#A1A1AA] mt-1.5 leading-relaxed font-light">
          Eles ajudam a organizar suas respostas. A decisão final continua com você. Preencha apenas
          informações da sua prática profissional; use exemplos fictícios quando precisar ilustrar
          uma situação.
        </p>
      </div>

      <div className="space-y-4">
        {PROMPTS_BIBLIOTECA_ENCONTRO_1.map((p) => {
          const foiCopiado = copiadoId === p.id

          return (
            <div
              key={p.id}
              className="rounded-[14px] border border-slate-200/90 dark:border-[#27272A] bg-white dark:bg-[#121216] p-5 sm:p-6 space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                      {p.kicker} {p.numero}
                    </span>
                  </div>
                  <h4 className="font-serif-editorial text-lg sm:text-xl font-normal text-slate-900 dark:text-white">
                    {p.titulo}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#A1A1AA] italic">
                    {p.momentoUso}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopiarPrompt(p)}
                  className={`min-h-[40px] px-3.5 gap-1.5 font-mono text-xs rounded-[8px] shrink-0 transition-colors cursor-pointer ${
                    foiCopiado
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-purple-200 dark:border-[#7c3aed]/40 text-[#7c3aed] dark:text-[#C084FC] hover:bg-purple-50 dark:hover:bg-[#18181B]'
                  }`}
                  aria-label={`Copiar prompt ${p.numero}`}
                >
                  {foiCopiado ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Prompt copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar prompt</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Caixa com o texto do prompt */}
              <div className="p-4 rounded-[10px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line select-all">
                {p.texto}
              </div>

              {p.notaPosCopia && (
                <p className="text-[11px] font-mono text-slate-500 dark:text-[#71717A] leading-relaxed">
                  <span className="text-[#7c3aed] dark:text-[#C084FC] font-semibold">Nota: </span>
                  {p.notaPosCopia}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
