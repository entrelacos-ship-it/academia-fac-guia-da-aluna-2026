import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Copy, Check, FileCode, Sparkles, BookOpen } from 'lucide-react'

interface SkillMentoraModalProps {
  isOpen: boolean
  onClose: () => void
  rawContent: string
  onDownload: () => void
}

export const SkillMentoraModal: React.FC<SkillMentoraModalProps> = ({
  isOpen,
  onClose,
  rawContent,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback para seleção manual caso clipboard falhe
      const textArea = document.createElement('textarea')
      textArea.value = rawContent
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#0c0915] border-purple-200 dark:border-[#221f2d] shadow-2xl">
        {/* Cabeçalho */}
        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-[#1e1b29] bg-gradient-to-r from-purple-50/70 via-white to-purple-50/30 dark:from-[#150f24] dark:via-[#0c0915] dark:to-[#120d20]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] text-[11px] font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#FB923C]" />
              Skill Oficial FAC
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-mono uppercase">
              Aluna Validada
            </Badge>
          </div>
          <DialogTitle className="font-serif-editorial text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white">
            Mentora do FAC — Instruções & Download
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] pt-1 leading-relaxed">
            Skill completa em Markdown criada para alunas da Academia Método FAC. Você pode baixar o
            arquivo{' '}
            <code className="font-mono text-purple-700 dark:text-[#C084FC]">Mentora-FAC.md</code> ou
            copiar todo o conteúdo para usar no seu assistente de IA preferido (ChatGPT, Claude,
            Cursor, etc.).
          </DialogDescription>
        </DialogHeader>

        {/* Barra de Ações Rápidas */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 dark:bg-[#120f1e] border-b border-slate-100 dark:border-[#1e1b29] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
            <FileCode className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
            <span>
              Arquivo: <strong>Mentora-FAC.md</strong> (~13 KB)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-9 px-3 text-xs font-mono gap-1.5 rounded-[8px] border-purple-200 dark:border-purple-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Markdown</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onDownload}
              className="h-9 px-4 text-xs font-mono gap-1.5 rounded-[8px] bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo .md</span>
            </Button>
          </div>
        </div>

        {/* Visualização rolável do código Markdown */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-text">
          <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#ea580c]" />
              Conteúdo Verbatim da Skill Mentora-FAC
            </span>
            <span>302 linhas</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-slate-200 text-xs break-words">
            {rawContent}
          </pre>
        </div>

        {/* Rodapé informativo */}
        <div className="p-4 px-5 sm:px-6 bg-slate-50 dark:bg-[#0f0c1a] border-t border-slate-100 dark:border-[#1e1b29] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#71717A]">
          <p className="text-[11px] leading-snug">
            💡 Dica: No ChatGPT Plus, acrie um GPT Customizado ou use no campo de instruções
            personalizadas.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs font-mono h-8 px-3 rounded-[6px]"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
