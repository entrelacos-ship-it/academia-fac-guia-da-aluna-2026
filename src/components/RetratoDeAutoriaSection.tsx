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
  ArrowRight,
  ShieldAlert,
  Bot,
  HelpCircle,
  FolderArchive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { downloadRetratoZip } from '@/lib/retratoZipBuilder'

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

      {/* 1. O que e e para que serve (ate 5 linhas) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#7c3aed] dark:text-[#C084FC]">
          <Compass className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            1. O que e e para que serve
          </h2>
        </div>
        <div className="p-5 rounded-[14px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed">
            A aluna sai com um documento que traz: padrao central, dom profissional, fonte de
            energia, o que trava, coerencia entre valor e pratica, sustentacao, ponto de partida no
            Metodo FAC, tres movimentos para 7 dias, perguntas para levar ao encontro e sinais para
            a investigacao de nicho. No final vem um &ldquo;bloco de contexto&rdquo; que ela vai
            colar em todos os agentes da Academia.
          </p>
        </div>
      </section>

      {/* 2. Antes de comecar */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#ea580c] dark:text-[#FB923C]">
          <Clock className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            2. Antes de comecar
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block mb-1">
              Tempo sugerido
            </span>
            <p className="text-sm text-slate-700 dark:text-[#A1A1AA] leading-snug">
              Reserve de 30 a 45 minutos sem interrupcao.
            </p>
          </div>
          <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
              Autenticidade e Sigilo
            </span>
            <p className="text-sm text-slate-700 dark:text-[#A1A1AA] leading-snug">
              Responda com cenas reais, nao com respostas bonitas. Nao inclua nome nem dado que
              identifique paciente.
            </p>
          </div>
          <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Diagnostico FAC
            </span>
            <p className="text-sm text-slate-700 dark:text-[#A1A1AA] leading-snug">
              Se ja fez o Diagnostico FAC, tenha em maos a pontuacao por pilar.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Como instalar a skill: dois caminhos lado a lado (Claude x ChatGPT) + Plano B */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#7c3aed] dark:text-[#C084FC]">
          <Bot className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            3. Como instalar a skill
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA]">
          Escolha a ferramenta que voce ja utiliza no seu dia a dia. Os passos abaixo serao
          validados na tela.
        </p>

        {/* Dois caminhos lado a lado em desktop, empilhados no mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Coluna Claude */}
          <div className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#27272A]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
                  <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                    Instalar no Claude
                  </h3>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  Anthropic
                </Badge>
              </div>

              <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Acesse sua conta no Claude e abra o menu{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>
                    .
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    Selecione a opcao{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>{' '}
                    para adicionar ou carregar uma nova skill/projeto.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Envie o arquivo baixado ou cole o conteudo instrucional no campo{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>
                    .
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    Confirme clicando em{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>{' '}
                    e inicie a conversa.
                  </div>
                </li>
              </ol>

              {/* Espaco reservado para captura de tela Claude */}
              <div className="mt-4 border-2 border-dashed border-slate-200 dark:border-[#27272A] rounded-[12px] p-6 text-center bg-slate-50/50 dark:bg-[#121216]/50">
                <HelpCircle className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
                <p className="text-xs font-mono font-medium text-slate-500 dark:text-[#A1A1AA]">
                  [ESPACO RESERVADO PARA CAPTURA DE TELA: CLAUDE]
                </p>
                <p className="text-[11px] text-slate-400 dark:text-[#71717A] mt-1">
                  Validacao visual dos menus do Claude antes da publicacao
                </p>
              </div>
            </div>
          </div>

          {/* Coluna ChatGPT */}
          <div className="p-5 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#27272A]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] dark:text-[#C084FC]" />
                  <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                    Instalar no ChatGPT
                  </h3>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  OpenAI
                </Badge>
              </div>

              <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    No ChatGPT, clique no menu lateral em{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>
                    .
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    Acesse a secao de configuracao{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>
                    .
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Faca o upload dos arquivos ou insira os dados no campo{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>
                    .
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#27272A] text-slate-700 dark:text-[#A1A1AA] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    Salve clicando em{' '}
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-semibold border border-amber-300 dark:border-amber-800/60">
                      [CONFIRMAR NA TELA]
                    </span>{' '}
                    e comece seu Retrato.
                  </div>
                </li>
              </ol>

              {/* Espaco reservado para captura de tela ChatGPT */}
              <div className="mt-4 border-2 border-dashed border-slate-200 dark:border-[#27272A] rounded-[12px] p-6 text-center bg-slate-50/50 dark:bg-[#121216]/50">
                <HelpCircle className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
                <p className="text-xs font-mono font-medium text-slate-500 dark:text-[#A1A1AA]">
                  [ESPACO RESERVADO PARA CAPTURA DE TELA: CHATGPT]
                </p>
                <p className="text-[11px] text-slate-400 dark:text-[#71717A] mt-1">
                  Validacao visual dos menus do ChatGPT antes da publicacao
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plano B (valido para as duas ferramentas) */}
        <div className="p-5 rounded-[14px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                Plano B (valido para as duas ferramentas)
              </h3>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA]">
              Metodo direto sem configuracao previa
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-[#A1A1AA] leading-relaxed">
            Abra o arquivo <strong>SKILL.md</strong> que esta dentro do zip, copie todo o texto,
            cole em uma conversa nova e escreva em seguida:
          </p>

          <div className="flex items-center justify-between gap-3 p-3 rounded-[8px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A]">
            <code className="font-mono text-xs sm:text-sm text-[#7c3aed] dark:text-[#C084FC] select-all">
              Siga estas instrucoes. Quero fazer meu Retrato de Autoria.
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPlanB}
              className="gap-1.5 h-8 text-xs font-mono shrink-0"
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

        <div className="p-5 rounded-[14px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-[8px] bg-purple-50/70 dark:bg-[#121216] border border-purple-200 dark:border-[#27272A]">
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              Comece escrevendo:{' '}
              <strong className="font-mono text-[#7c3aed] dark:text-[#C084FC]">
                &ldquo;Quero fazer meu Retrato de Autoria&rdquo;
              </strong>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyStarter}
              className="gap-1.5 h-8 text-xs font-mono shrink-0 bg-white dark:bg-[#18181B]"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-slate-700 dark:text-[#A1A1AA]">
            <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
              <strong className="block text-slate-900 dark:text-white font-medium mb-1">
                6 blocos de conversa
              </strong>
              A conversa tem 6 blocos, um de cada vez. Responda no seu ritmo, com calma e
              profundidade.
            </div>

            <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A]">
              <strong className="block text-slate-900 dark:text-white font-medium mb-1">
                Leitura preliminar
              </strong>
              Antes do documento final, a IA devolve uma leitura preliminar. Corrija o que soar
              forcado. Voce e a autoridade sobre a sua historia.
            </div>

            <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-[#27272A] sm:col-span-2">
              <strong className="block text-slate-900 dark:text-white font-medium mb-1">
                Se precisar parar
              </strong>
              Se precisar parar, peca um resumo do que ja foi respondido e retome depois colando
              esse resumo em uma nova mensagem.
            </div>
          </div>
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
          <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] block mb-1">
              Guarde seu documento
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-[#A1A1AA] leading-relaxed">
              Salve o Retrato completo. Guarde o bloco de contexto em um lugar facil. Voce vai colar
              esse bloco no inicio das conversas com os proximos agentes da Academia.
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#FB923C] block mb-1">
              Comunidade e Encontro 2
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-[#A1A1AA] leading-relaxed">
              Poste na comunidade apenas o que quiser compartilhar. Sugestao: seu padrao central e
              seu pilar de partida. Leve para o Encontro 2 as &lsquo;perguntas para levar ao
              encontro&rsquo; que o Retrato gerou.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Avisos (caixa de destaque visual: estilo callout amarelo/laranja do sistema) */}
      <section className="space-y-3">
        <div className="p-5 sm:p-6 rounded-[16px] bg-amber-50/90 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-600/50 shadow-md space-y-3 text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[6px] bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5 shrink-0 stroke-[2.2]" />
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">Avisos importantes</h2>
          </div>

          <div className="text-xs sm:text-sm leading-relaxed space-y-2 font-normal text-amber-900 dark:text-amber-200">
            <p>
              O Retrato e uma leitura em forma de hipotese, feita a partir do que voce escreveu. Nao
              e avaliacao psicologica nem diagnostico. Ele nao substitui terapia nem supervisao.
            </p>
            <p>
              Se a entrevista mexer com voce, leve isso para o seu espaco de cuidado. A IA pode
              errar. O que nao fizer sentido, descarte.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Botao de download */}
      <section className="pt-2">
        <div className="p-6 rounded-[16px] bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <FolderArchive className="w-5 h-5 text-[#7c3aed] dark:text-[#C084FC]" />
              <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                Pronta para iniciar seu Retrato?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA]">
              Baixe o pacote oficial da skill (arquivo ZIP íntegro contendo as instruções do
              Retrato, o Design System da Academia e o inventário de referências).
            </p>
            <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              Pacote pronto para download imediato · retrato-de-autoria.zip
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleDownloadZip}
            disabled={downloading}
            className="w-full sm:w-auto min-h-[48px] px-6 gap-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold rounded-[8px] shadow-md shadow-[#7c3aed]/20 dark:shadow-[#C084FC]/20 transition-all cursor-pointer"
          >
            {downloading ? (
              <>
                <Check className="w-4 h-4 shrink-0 text-emerald-300 dark:text-emerald-800" />
                <span>Baixando retrato-de-autoria.zip...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                <span>Baixar a skill Retrato de Autoria</span>
              </>
            )}
          </Button>
        </div>
      </section>
    </article>
  )
}
export default RetratoDeAutoriaSection
