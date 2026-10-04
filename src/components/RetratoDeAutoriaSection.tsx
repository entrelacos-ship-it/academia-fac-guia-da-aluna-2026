import React, { useState } from 'react'
import {
  Download,
  Clock,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  FileText,
  Lightbulb,
  Compass,
  Bot,
  FolderArchive,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { downloadRetratoZip } from '@/lib/retratoZipBuilder'

/**
 * Logo oficial do Claude (Anthropic):
 * Asterisco orgânico com braços arredondados característico da identidade Anthropic Claude.
 * Tom coral/terracota #D97757.
 */
const ClaudeLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    {/* Asterisco de 8 braços arredondados característico do Claude */}
    <path d="M12 2c.6 0 1.1.4 1.2 1l.6 5.3 4.2-3.3c.5-.4 1.2-.3 1.6.2.4.5.3 1.2-.2 1.6l-4.2 3.3 5.3.6c.6.1 1 .6 1 1.2s-.4 1.1-1 1.2l-5.3.6 4.2 3.3c.5.4.6 1.1.2 1.6-.4.5-1.1.6-1.6.2l-4.2-3.3-.6 5.3c-.1.6-.6 1-1.2 1s-1.1-.4-1.2-1l-.6-5.3-4.2 3.3c-.5.4-1.2.3-1.6-.2-.4-.5-.3-1.2.2-1.6l4.2-3.3-5.3-.6c-.6-.1-1-.6-1-1.2s.4-1.1 1-1.2l5.3-.6-4.2-3.3c-.5-.4-.6-1.1-.2-1.6.4-.5 1.1-.6 1.6-.2l4.2 3.3.6-5.3c.1-.6.6-1 1.2-1z" />
  </svg>
)

/**
 * Logo oficial do ChatGPT (OpenAI):
 * Nó geométrico de 6 pétalas hexagonais entrelaçadas, fiel à referência enviada pela usuária.
 */
const ChatGPTLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M19.2 14.8a4.6 4.6 0 0 0 .5-3.3 4.8 4.8 0 0 0-3.4-3.5 5 5 0 0 0-1.1-.1v-1.4a4.8 4.8 0 0 0-4.1-4.7 4.7 4.7 0 0 0-4.7 2.7 4.6 4.6 0 0 0-2.3 2.5 4.8 4.8 0 0 0 .6 4.9v1.4a4.8 4.8 0 0 0 4.1 4.7 4.7 4.7 0 0 0 4.7-2.7 4.6 4.6 0 0 0 2.3-2.5 4.8 4.8 0 0 0-.6-4.9z" />
    <path d="M10.5 7.5l4.5 2.6" />
    <path d="M13.5 16.5l-4.5-2.6" />
    <path d="M7.5 13.5V8.3" />
    <path d="M16.5 10.5v5.2" />
    <path d="M9 14.8l4.5-7.8" />
  </svg>
)

export const RetratoDeAutoriaSection: React.FC = () => {
  const [copiedPlanB, setCopiedPlanB] = useState(false)
  const [copiedContext, setCopiedContext] = useState(false)

  const handleCopyPlanB = async () => {
    try {
      await navigator.clipboard.writeText(
        'Siga estas instruções. Quero fazer meu Retrato de Autoria.',
      )
      setCopiedPlanB(true)
      setTimeout(() => setCopiedPlanB(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleCopyStarter = async () => {
    try {
      await navigator.clipboard.writeText('Quero fazer meu Retrato de Autoria')
      setCopiedContext(true)
      setTimeout(() => setCopiedContext(false), 2000)
    } catch {
      // ignore
    }
  }

  const [downloading, setDownloading] = useState(false)

  const handleDownloadZip = (e: React.MouseEvent) => {
    e.preventDefault()
    setDownloading(true)
    try {
      downloadRetratoZip()
    } catch (err) {
      console.error('Erro ao gerar download do ZIP:', err)
    } finally {
      setTimeout(() => setDownloading(false), 1500)
    }
  }

  return (
    <article className="space-y-10 py-2 font-sans" id="retrato-de-autoria">
      {/* Cabeçalho da Seção */}
      <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-[#27272A]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="bg-purple-50 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] border-purple-200 dark:border-[#27272A] font-mono text-[11px] uppercase tracking-wider py-1 px-2.5"
          >
            Ciclo FAC · Primeira Entrega
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-[#A1A1AA]">
            Encontro 1 (06/10/2026) → Encontro 2 (13/10/2026)
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Retrato de Autoria: sua primeira entrega na Academia
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] max-w-3xl leading-relaxed">
          Uma skill que conduz uma entrevista em conversa com a aluna e entrega uma leitura profunda
          de quem ela e como profissional.
        </p>
      </header>

      {/* 1. O que é e para que serve */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2 text-[#7c3aed] dark:text-[#C084FC]">
          <Compass className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            1. O que é e para que serve
          </h2>
        </div>
        <div className="p-4 sm:p-5 rounded-[14px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-2.5">
            Gera um retrato profundo da sua atuação clínica e entrega:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-[#A1A1AA]">
            <li>• Padrão central, dom profissional e fonte de energia</li>
            <li>• O que trava, sustentação e coerência valor-prática</li>
            <li>• Ponto de partida no Método FAC e 3 movimentos p/ 7 dias</li>
            <li>
              • Perguntas p/ o Encontro 2 e <strong>bloco de contexto</strong> p/ os demais agentes
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Antes de começar */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2 text-[#ea580c] dark:text-[#FB923C]">
          <Clock className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            2. Antes de começar
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block mb-1">
              Tempo sugerido
            </span>
            <p className="text-xs text-slate-700 dark:text-[#A1A1AA] leading-snug">
              Reserve de 30 a 45 minutos sem interrupção.
            </p>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
              Autenticidade & Sigilo
            </span>
            <p className="text-xs text-slate-700 dark:text-[#A1A1AA] leading-snug">
              Traga cenas reais. Não inclua nomes nem dados identificáveis de pacientes.
            </p>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Diagnóstico FAC
            </span>
            <p className="text-xs text-slate-700 dark:text-[#A1A1AA] leading-snug">
              Se já fez o Diagnóstico FAC, tenha em mãos a pontuação por pilar.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Como instalar a skill / Acesso às ferramentas */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#7c3aed] dark:text-[#C084FC]">
          <Bot className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            3. Como instalar a skill
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA]">
          Abra a IA de sua preferência (ChatGPT ou Claude), baixe o pacote da skill logo abaixo e
          cole as instruções na conversa.
        </p>

        {/* Cartões de IA: ChatGPT primeiro (esquerda/em cima), Claude em seguida */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cartão ChatGPT (PRIMEIRO) */}
          <div className="p-4 sm:p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-[#27272A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#27272A] flex items-center justify-center text-slate-900 dark:text-white shrink-0 border border-slate-200 dark:border-[#3F3F46]">
                    <ChatGPTLogoIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                      ChatGPT
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA]">OpenAI</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  OpenAI
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Abra sua conta do ChatGPT e inicie o Retrato pelo <strong>Plano B</strong> colando o
                conteúdo do{' '}
                <code className="font-mono text-[11px] bg-slate-100 dark:bg-[#27272A] px-1 py-0.5 rounded">
                  SKILL.md
                </code>
                .
              </p>
            </div>

            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-9 px-4 rounded-[8px] bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-medium text-xs sm:text-sm transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <span>Abrir o ChatGPT</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
            </a>
          </div>

          {/* Cartão Claude (SEGUNDO) */}
          <div className="p-4 sm:p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs hover:border-[#D97757]/40 transition-all flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-[#27272A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D97757]/10 dark:bg-[#D97757]/20 flex items-center justify-center text-[#D97757] shrink-0 border border-[#D97757]/30">
                    <ClaudeLogoIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                      Claude
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA]">Anthropic</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] text-[#D97757] border-[#D97757]/30 bg-[#D97757]/5"
                >
                  Recomendado
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Abra sua conta do Claude e inicie o Retrato pelo <strong>Plano B</strong> colando o
                conteúdo do{' '}
                <code className="font-mono text-[11px] bg-slate-100 dark:bg-[#27272A] px-1 py-0.5 rounded">
                  SKILL.md
                </code>
                .
              </p>
            </div>

            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-9 px-4 rounded-[8px] bg-[#D97757] hover:bg-[#c66747] text-white font-medium text-xs sm:text-sm transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
            >
              <span>Abrir o Claude</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
            </a>
          </div>
        </div>

        {/* Download da skill: posicionado IMEDIATAMENTE após os cartões de IA */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white dark:bg-[#18181B] border border-purple-200 dark:border-purple-900/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <FolderArchive className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                Baixar pacote da skill
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
              Contém o{' '}
              <code className="font-mono text-[11px] bg-slate-100 dark:bg-[#27272A] px-1 py-0.5 rounded">
                SKILL.md
              </code>{' '}
              pronto para uso no ChatGPT ou Claude.
            </p>
          </div>

          <Button
            size="default"
            onClick={handleDownloadZip}
            disabled={downloading}
            className="w-full sm:w-auto min-h-[42px] px-5 gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-xs cursor-pointer text-xs sm:text-sm shrink-0"
          >
            {downloading ? (
              <>
                <Check className="w-4 h-4 shrink-0 text-emerald-300 dark:text-emerald-800" />
                <span>Baixando ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                <span>Baixar a skill Retrato de Autoria</span>
              </>
            )}
          </Button>
        </div>

        {/* Plano B (caminho direto sem configuração) */}
        <div className="p-4 rounded-[14px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                Plano B: Direto na conversa
              </h3>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              Sem configuração prévia
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-[#A1A1AA]">
            Abra o{' '}
            <code className="font-mono text-[11px] bg-slate-100 dark:bg-[#27272A] px-1 py-0.5 rounded">
              SKILL.md
            </code>{' '}
            do pacote baixado, copie todo o texto, cole na conversa da IA e envie:
          </p>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-[8px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A]">
            <code className="font-mono text-xs text-[#7c3aed] dark:text-[#C084FC] select-all truncate">
              Siga estas instruções. Quero fazer meu Retrato de Autoria.
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPlanB}
              className="gap-1.5 h-7 text-xs font-mono shrink-0 px-2.5"
            >
              {copiedPlanB ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar frase</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Como usar */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#7c3aed] dark:text-[#C084FC]">
          <FileText className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            4. Como usar
          </h2>
        </div>

        <div className="p-4 sm:p-5 rounded-[14px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2.5 flex-wrap p-2.5 sm:p-3 rounded-[8px] bg-purple-50/70 dark:bg-[#121216] border border-purple-200 dark:border-[#27272A]">
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              Frase de início:{' '}
              <strong className="font-mono text-[#7c3aed] dark:text-[#C084FC]">
                &ldquo;Quero fazer meu Retrato de Autoria&rdquo;
              </strong>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyStarter}
              className="gap-1.5 h-7 text-xs font-mono shrink-0 bg-white dark:bg-[#18181B] px-2.5"
            >
              {copiedContext ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar comando</span>
                </>
              )}
            </Button>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA]">
            <li className="flex items-start gap-2">
              <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
              <span>
                <strong>6 blocos:</strong> responda no seu ritmo, com calma e profundidade.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
              <span>
                <strong>Leitura preliminar:</strong> corrija o que soar forçado antes da versão
                final — você é a autoridade sobre a sua história.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">•</span>
              <span>
                <strong>Pausas:</strong> se precisar interromper, peça um resumo e retome colando-o
                em uma nova mensagem.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. O que fazer com o resultado */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#ea580c] dark:text-[#FB923C]">
          <Sparkles className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            5. O que fazer com o resultado
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 sm:p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
              Guarde seu documento
            </span>
            <ul className="text-xs text-slate-600 dark:text-[#A1A1AA] space-y-1">
              <li>• Salve o Retrato completo.</li>
              <li>
                • Guarde o <em>bloco de contexto</em> para colar no início das conversas com os
                próximos agentes da Academia.
              </li>
            </ul>
          </div>

          <div className="p-3.5 sm:p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block mb-1">
              Comunidade e Encontro 2
            </span>
            <ul className="text-xs text-slate-600 dark:text-[#A1A1AA] space-y-1">
              <li>• Compartilhe apenas o que quiser (ex.: padrão central e pilar de partida).</li>
              <li>• Leve para o Encontro 2 as perguntas geradas pelo Retrato.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Avisos (caixa de destaque visual: estilo callout amarelo/laranja do sistema) */}
      <section className="space-y-3">
        <div className="p-4 sm:p-5 rounded-[14px] bg-amber-50/90 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-600/50 shadow-xs space-y-2.5 text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-[6px] bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.2]" />
            </div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight">Avisos importantes</h2>
          </div>

          <ul className="text-xs sm:text-sm leading-relaxed space-y-1.5 font-normal text-amber-900 dark:text-amber-200">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                O Retrato é uma leitura em forma de hipótese, feita a partir do que você escreveu.
                Não é avaliação psicológica nem diagnóstico.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                Não substitui terapia nem supervisão. Se a entrevista mexer com você, leve para o
                seu espaço de cuidado.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>A IA pode errar — o que não fizer sentido, descarte.</span>
            </li>
          </ul>
        </div>
      </section>
    </article>
  )
}
export default RetratoDeAutoriaSection
