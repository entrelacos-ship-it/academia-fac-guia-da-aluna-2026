import React from 'react'
import {
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Bot,
  CheckCircle2,
  Lock,
  Compass,
  AlertCircle,
  HelpCircle,
  Download,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CuboFacSelector } from '@/components/guia/CuboFacSelector'
import { SecaoChatGPT } from '@/components/guia/SecaoChatGPT'
import { BibliotecaPrompts } from '@/components/guia/BibliotecaPrompts'
import { MapaPessoal } from '@/components/guia/MapaPessoal'
import { FaqEncontro1 } from '@/components/guia/FaqEncontro1'

interface Encontro1CadernoCompletoProps {
  onAbrirDiagnostico: () => void
  isAlunaValidada: boolean
  onValidarEmail: () => void
  onAvancarEncontro2: () => void
}

export const Encontro1CadernoCompleto: React.FC<Encontro1CadernoCompletoProps> = ({
  onAbrirDiagnostico,
  isAlunaValidada,
  onValidarEmail,
  onAvancarEncontro2,
}) => {
  const scrollToAnchor = (anchorId: string) => {
    const el = document.getElementById(anchorId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <article className="space-y-16 sm:space-y-20">
      {/* 1. CABEÇALHO DO ENCONTRO / KICKER EDITORIAL */}
      <header className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-11 lg:p-14 space-y-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-[#27272A] pb-5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-[13px] font-mono">
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5">
              AULA ABERTA · ACESSO LIVRE
            </Badge>
            <span className="text-editorial-tertiary">•</span>
            <span className="text-editorial-secondary font-semibold">
              FUNDAÇÃO · ENCONTRO 01 · 06 de out
            </span>
          </div>

          <Badge
            variant="outline"
            className="text-[11px] font-mono border-purple-200 dark:border-purple-800 text-[#7c3aed] dark:text-[#C084FC] px-2.5 py-0.5"
          >
            Turma & Visitantes
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-normal tracking-tight text-editorial-primary leading-[1.14]">
            Aula Magna: o Método FAC e as boas-vindas
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-editorial-secondary leading-relaxed font-light max-w-4xl">
            Antes de construir novas peças, vamos enxergar a estrutura da sua prática hoje. Nesta
            Aula Magna, você conhece os três pilares e preenche o Diagnóstico FAC Aprofundado. O
            resultado mostra suas forças, fragilidades e por onde começar.
          </p>

          {/* Atalho direto no topo para abrir o Diagnóstico FAC */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={onAbrirDiagnostico}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs sm:text-sm rounded-[10px] min-h-[44px] px-5 gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Abrir Diagnóstico FAC Aprofundado</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Button>
            <span className="text-xs font-mono text-editorial-secondary">
              24 perguntas · 12 a 15 min · Resultado com Radar
            </span>
          </div>
        </div>

        {/* Destaque: A Pergunta do Encontro */}
        <div className="p-7 sm:p-9 rounded-[16px] bg-slate-50 dark:bg-[#0c0914] border-l-4 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-slate-200/80 dark:border-[#27272A] space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            A PERGUNTA DO ENCONTRO
          </span>
          <p className="font-serif-editorial text-2xl sm:text-3xl md:text-[2rem] text-editorial-primary font-normal italic leading-snug">
            Onde a sua prática pede estrutura primeiro?
          </p>
        </div>
      </header>

      {/* 2. 01 / ANTES DE COMEÇAR */}
      <section className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7">
        <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            01 / ANTES DE COMEÇAR
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-editorial-primary mt-1">
            Prepare o terreno.
          </h2>
        </div>

        <ul className="space-y-4 text-sm sm:text-base text-editorial-secondary font-light leading-relaxed">
          <li className="flex items-start gap-3.5">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] shrink-0 mt-2.5" />
            <span>
              Separe celular ou computador para preencher o Diagnóstico FAC Aprofundado durante a
              aula. Reserve de 12 a 15 minutos.
            </span>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] shrink-0 mt-2.5" />
            <span>
              Abra a transmissão pelo link divulgado no convite da aula aberta. Caso não o tenha
              recebido, use o canal de suporte informado nesse convite.
            </span>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] shrink-0 mt-2.5" />
            <span>
              Tenha caderno ou documento aberto. Responda com o que acontece hoje na sua prática,
              sem dados que identifiquem pacientes.
            </span>
          </li>
          <li className="flex items-start gap-3.5">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] shrink-0 mt-2.5" />
            <span>
              Se quiser testar os prompts de apoio depois do resultado, crie uma conta gratuita no
              ChatGPT. Isso não é necessário para fazer o diagnóstico.
            </span>
          </li>
        </ul>
      </section>

      {/* 3. 02 / DURANTE O ENCONTRO */}
      <section className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7">
        <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            02 / DURANTE O ENCONTRO
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-editorial-primary mt-1">
            Construa passo a passo.
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {[
            {
              num: '01',
              titulo: 'Receba as boas-vindas',
              texto:
                'Conheça o propósito da Aula Magna, o percurso do encontro e o que você levará para a sua prática.',
            },
            {
              num: '02',
              titulo: 'Acompanhe os slides do Método FAC',
              texto:
                'Entenda a lógica do cubo e a relação entre Fundação, Atração e Conexão antes de responder às perguntas.',
            },
            {
              num: '03',
              titulo: 'Faça o Diagnóstico FAC Aprofundado',
              texto:
                'Depois da explicação do método, responda às 24 perguntas no seu aparelho. Reserve cerca de 12 a 15 minutos.',
            },
            {
              num: '04',
              titulo: 'Leia o resultado e escolha um primeiro passo',
              texto:
                'Baixe o PDF e observe o pilar de partida sugerido. O Mapa Pessoal é um exercício opcional para transformar essa leitura em uma ação sua.',
            },
            {
              num: '05',
              titulo: 'Conheça o Ecossistema Entrelaços',
              texto:
                'No fim da aula, veja como a comunidade e os espaços da Academia apoiam a continuidade do seu percurso.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-5 sm:p-6 rounded-[14px] border border-slate-200/80 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] flex items-start gap-4 sm:gap-5"
            >
              <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {item.num}
              </span>
              <div className="space-y-1.5">
                <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
                  {item.titulo}
                </h4>
                <p className="text-sm sm:text-[15px] text-editorial-secondary leading-relaxed font-light">
                  {item.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MATERIAIS DO ENCONTRO */}
      <section className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7">
        <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            MATERIAIS DO ENCONTRO
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900 dark:text-white mt-1">
            Tenha por perto.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-6 rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#7c3aed] dark:text-[#C084FC]" />
                <h4 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                  Diagnóstico FAC Aprofundado
                </h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-[#A1A1AA] font-light leading-relaxed">
                24 perguntas e análise por dimensão com relatório em PDF.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={onAbrirDiagnostico}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs rounded-[8px] min-h-[42px] px-4 w-full sm:w-auto self-start cursor-pointer"
            >
              <span>Abrir Diagnóstico</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          <div className="p-6 rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-[#ea580c] dark:text-[#FB923C]" />
                <h4 className="font-sans font-semibold text-base text-slate-900 dark:text-white">
                  ChatGPT
                </h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-[#A1A1AA] font-light leading-relaxed">
                Conta gratuita é suficiente para começar a testar os prompts de apoio.
              </p>
            </div>
            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] border border-slate-200 dark:border-[#27272A] text-xs font-mono font-semibold text-slate-800 dark:text-white hover:border-[#7c3aed] min-h-[42px] self-start"
            >
              <span>Acessar ChatGPT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Nota e Lembrete */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1f1f23] text-xs font-mono">
          <p className="text-editorial-secondary">
            <span className="font-bold text-editorial-primary">Nota: </span>A Aula 1 é aberta. Links
            exclusivos da Academia aparecem apenas para alunas matriculadas.
          </p>
          <p className="text-editorial-secondary dark:text-[#C084FC] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>
              <strong className="text-editorial-primary dark:text-white">LEMBRETE:</strong> Seu
              diagnóstico e PDF ficam neste aparelho. Baixe o PDF para guardar o resultado.
            </span>
          </p>
        </div>
      </section>

      {/* 5. CADERNO DE ESTUDO / AULA MAGNA */}
      <section className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-8">
        <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            CADERNO DE ESTUDO / AULA MAGNA
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900 dark:text-white mt-1">
            O conteúdo para voltar, pensar e construir.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A1A1AA] mt-2 leading-relaxed font-light">
            Acompanhe as boas-vindas e os slides do Método FAC antes de fazer o diagnóstico. Depois,
            use o resultado para escolher um primeiro passo e conheça o Ecossistema Entrelaços.
          </p>
        </div>

        {/* Trilha do Caderno */}
        <div className="p-5 sm:p-6 rounded-[14px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-editorial-tertiary block">
            Trilha do Encontro
          </span>
          <p className="text-xs sm:text-sm font-mono text-editorial-secondary leading-relaxed">
            01 Acolher — Boas-vindas à aula · 02 Entender — Slides e Método FAC · 03 Diagnosticar —
            Seu ponto de partida · 04 Experimentar — Ferramentas de apoio · 05 Registrar — Primeira
            ação · 06 Continuar — Ecossistema Entrelaços
          </p>
        </div>

        {/* Ao terminar, você terá: */}
        <div className="space-y-4">
          <h3 className="font-sans font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
            Ao terminar, você terá:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              'Entender como Fundação, Atração e Conexão se sustentam mutuamente.',
              'Preencher o Diagnóstico FAC Aprofundado e ler a combinação dos três pilares.',
              'Reconhecer os pontos firmes e frágeis dentro de cada pilar, sem transformar resultado em julgamento.',
              'Sair com o PDF salvo e um primeiro foco para observar durante o ciclo.',
            ].map((meta, i) => (
              <div
                key={i}
                className="p-4 sm:p-4.5 rounded-[12px] border border-slate-200/80 dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-light leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{meta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. APRESENTAÇÃO DO MÉTODO FAC */}
      <section className="space-y-10 sm:space-y-12">
        <div className="border-b border-slate-200/80 dark:border-[#27272A] pb-4">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            APRESENTAÇÃO DO MÉTODO FAC
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900 dark:text-white mt-1">
            O que estamos construindo.
          </h2>
        </div>

        {/* 01 "Quando trabalhar muito não vira construção" */}
        <div className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              01
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white">
              Quando trabalhar muito não vira construção
            </h3>
            <p className="text-sm sm:text-base font-serif-editorial italic text-slate-600 dark:text-[#A1A1AA]">
              "A sensação de estar sempre recomeçando tem uma dimensão estrutural."
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
            <p>
              Uma agenda movimentada pode coexistir com renda imprevisível. Estudo constante pode
              coexistir com dificuldade de comunicar valor. Presença nas redes pode coexistir com
              dependência de convênios, plataformas ou indicações ocasionais. Esses sinais não
              resumem sua competência clínica.
            </p>
            <p>
              A proposta do FAC é olhar para a engrenagem da prática: o que sustenta o trabalho, por
              quais caminhos alguém o encontra e o que acontece quando essa pessoa chega. Nomear a
              estrutura diminui a culpa e abre espaço para decisões mais concretas.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-3 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              PARA LEVAR AO MAPA
            </span>
            <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-editorial-primary font-normal italic">
              "Qual parte do funcionamento da sua prática hoje depende de improviso?"
            </p>
          </div>
        </div>

        {/* 02 "A lógica do cubo FAC" */}
        <div className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              02
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white">
              A lógica do cubo FAC
            </h3>
            <p className="text-sm sm:text-base font-serif-editorial italic text-slate-600 dark:text-[#A1A1AA]">
              "Mover uma face sem considerar as outras pode desmontar o que já estava de pé."
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
            <p>
              Postar mais sem saber para quem você fala, investir em anúncios sem uma página clara
              ou baixar o preço sem conhecer o mínimo sustentável são movimentos que parecem ação,
              mas podem ampliar a confusão. O cubo representa a relação entre três dimensões da
              carreira.
            </p>
            <p>
              Fundação pergunta o que sustenta e torna compreensível seu trabalho. Atração pergunta
              como as pessoas certas chegam até ele. Conexão pergunta como a experiência se organiza
              da primeira aproximação à continuidade. O método existe para transformar essas
              perguntas em peças observáveis da sua prática.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light border-l-2 border-slate-200 dark:border-[#27272A] pl-5">
            <li>• Comece por clareza e estrutura.</li>
            <li>• Escolha rotas de chegada compatíveis com seus recursos.</li>
            <li>• Cuide da experiência de quem chega sem automatizar o vínculo clínico.</li>
          </ul>

          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-3 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              PARA LEVAR AO MAPA
            </span>
            <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-editorial-primary font-normal italic">
              "Qual face você tenta resolver por impulso quando sente que a carreira não anda?"
            </p>
          </div>
        </div>

        {/* SELETOR INTERATIVO DO CUBO FAC */}
        <CuboFacSelector onScrollToAnchor={scrollToAnchor} />

        {/* 03 "Fundação: a casa antes da visita" */}
        <div
          id="secao-fundacao"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-6 scroll-mt-24"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              03
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white">
              Fundação: a casa antes da visita
            </h3>
            <p className="text-sm sm:text-base font-serif-editorial italic text-slate-600 dark:text-[#A1A1AA]">
              "Clareza, mensagem, valor e sustentação formam a base."
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
            <p>
              Fundação é conseguir dizer para quem é seu trabalho, como explicá-lo e em quais
              condições você consegue sustentá-lo. O diagnóstico observa a estrutura que existe
              hoje. A investigação de propósito e IKIGAI fica para o Encontro 2.
            </p>
            <p>
              Se uma profissional atende bem, mas descreve seu trabalho apenas como "atendimento
              humanizado", talvez a questão inicial esteja na clareza da comunicação. Se cobra
              conforme a urgência do mês, talvez falte um critério de preço. São peças de estrutura,
              não defeitos da profissional.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light border-l-2 border-slate-200 dark:border-[#27272A] pl-5">
            <li>
              • <strong>Clareza:</strong> para quem é o trabalho hoje.
            </li>
            <li>
              • <strong>Mensagem:</strong> como a profissional é compreendida.
            </li>
            <li>
              • <strong>Valor:</strong> critério para cobrar.
            </li>
            <li>
              • <strong>Sustentação:</strong> conseguir se mostrar e comunicar condições sem culpa.
            </li>
          </ul>

          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-3 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              PARA LEVAR AO MAPA
            </span>
            <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-editorial-primary font-normal italic">
              "O que uma pessoa ainda não consegue entender com clareza ao encontrar seu trabalho?"
            </p>
          </div>
        </div>

        {/* 04 "Atração: escolher uma rota possível" */}
        <div
          id="secao-atracao"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-6 scroll-mt-24"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              04
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white">
              Atração: escolher uma rota possível
            </h3>
            <p className="text-sm sm:text-base font-serif-editorial italic text-slate-600 dark:text-[#A1A1AA]">
              "Ser encontrada não exige estar em todos os canais."
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
            <p>
              Existem caminhos offline, como parcerias e indicações; orgânicos, como conteúdo e
              busca; e pagos, como campanhas com orçamento de teste. A escolha depende de tempo,
              dinheiro, contexto e do que a Fundação já consegue sustentar.
            </p>
            <p>
              Uma indicação pode perder força quando a pessoa encontra um perfil vago ou não sabe
              como entrar em contato. Nesse caso, publicar todos os dias talvez não resolva. A peça
              que falta pode ser um caminho simples e claro de chegada.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-3 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              PARA LEVAR AO MAPA
            </span>
            <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-editorial-primary font-normal italic">
              "Hoje, qual é sua rota principal de chegada e onde essa ponte se interrompe?"
            </p>
          </div>
        </div>

        {/* 05 "Conexão: da chegada à continuidade" */}
        <div
          id="secao-conexao"
          className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-6 scroll-mt-24"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              05
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white">
              Conexão: da chegada à continuidade
            </h3>
            <p className="text-sm sm:text-base font-serif-editorial italic text-slate-600 dark:text-[#A1A1AA]">
              "Clareza e confiança aparecem também no processo."
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
            <p>
              Conexão observa o que acontece depois do primeiro contato: a pessoa compreende seu
              trabalho? Sabe como conversar com você? Entende o enquadre, os próximos passos e as
              condições do atendimento? Existe uma forma coerente de acompanhar essa relação?
            </p>
            <p>
              Uma resposta inicial organizada pode reduzir ruído sem transformar a conversa em
              roteiro mecânico. Conversão, aqui, é consequência de uma experiência compreensível e
              ética. Nenhuma mensagem pronta substitui escuta, consentimento, avaliação profissional
              ou supervisão clínica.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-3 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              PARA LEVAR AO MAPA
            </span>
            <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-editorial-primary font-normal italic">
              "Onde alguém que chega até você pode estar ficando sem orientação?"
            </p>
          </div>
        </div>
      </section>

      {/* 7. DEPOIS DE ENTENDER O MÉTODO / CHAMADA PARA O DIAGNÓSTICO */}
      <section className="rounded-[20px] border border-purple-200 dark:border-[#7c3aed]/50 bg-purple-50/70 dark:bg-purple-950/25 p-7 sm:p-10 lg:p-12 space-y-7">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            DEPOIS DE ENTENDER O MÉTODO / DIAGNÓSTICO FAC
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900 dark:text-white">
            Agora, olhe para a estrutura que existe hoje.
          </h2>
        </div>

        <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed font-light max-w-4xl">
          Responda 24 perguntas, mais contexto e um bloco de cuidado fora da nota. O resultado
          mostra a ordem dos pilares, os pontos firmes e frágeis em cada dimensão e um primeiro foco
          para o ciclo.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-2">
          <Button
            type="button"
            size="lg"
            onClick={onAbrirDiagnostico}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-sm sm:text-base rounded-[10px] min-h-[48px] px-6 cursor-pointer shadow-xs"
          >
            <span>Abrir Diagnóstico FAC Aprofundado</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <span className="text-xs sm:text-sm font-mono text-editorial-secondary">
            24 perguntas · 12 a 15 minutos
          </span>
        </div>
      </section>

      {/* 8. 06 "Do Diagnóstico à primeira ação" */}
      <section className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            06
          </span>
          <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white">
            Do Diagnóstico à primeira ação
          </h3>
          <p className="text-sm sm:text-base font-serif-editorial italic text-slate-600 dark:text-[#A1A1AA]">
            "O resultado aponta uma hipótese para investigar, não um rótulo sobre sua capacidade."
          </p>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
          <p>
            Olhe primeiro para o pilar que pede atenção. Depois pergunte: que situação concreta da
            minha prática confirma ou contesta esse sinal? A partir daí, escolha uma ação pequena
            que possa ser feita nesta semana. O diagnóstico orienta a pergunta; sua experiência
            ajuda a validar a resposta.
          </p>
          <div className="p-5 sm:p-6 rounded-[14px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] leading-relaxed">
            <strong className="font-semibold text-slate-900 dark:text-white font-sans block mb-1">
              Exemplo fictício:{' '}
            </strong>
            Ana tem Fundação 17%, Atração 42% e Conexão 75%. A leitura inicial sugere que sua
            experiência após a chegada está mais organizada que a clareza anterior a ela. Antes de
            comprar tráfego, Ana pode descrever melhor seu trabalho e iniciar a conta do preço. Isso
            é uma hipótese de trabalho, a ser testada na prática.
          </div>
        </div>

        {/* Mini-bloco de orientação */}
        <div className="p-5 rounded-[12px] bg-slate-50/80 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 space-y-1.5">
          <p>• Resultado: o que o diagnóstico mostra?</p>
          <p>• Estrutura: qual engrenagem pode explicar a dificuldade?</p>
          <p>• Primeiro passo: que ação pequena e observável posso datar?</p>
        </div>

        <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-3 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
            PARA LEVAR AO MAPA
          </span>
          <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-slate-900 dark:text-white font-normal italic">
            "Que situação concreta sustenta a escolha do seu pilar prioritário?"
          </p>
        </div>
      </section>

      {/* 9. PREPARE SUA FERRAMENTA — CHATGPT */}
      <SecaoChatGPT />

      {/* 10. BIBLIOTECA COPIÁVEL */}
      <BibliotecaPrompts />

      {/* 11. MEU PRIMEIRO PASSO NO CICLO FAC (MAPA PESSOAL) */}
      <MapaPessoal onAbrirDiagnostico={onAbrirDiagnostico} />

      {/* 12. ENCERRAMENTO DA AULA MAGNA */}
      <section className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            ENCERRAMENTO DA AULA MAGNA
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900 dark:text-white mt-1">
            Para continuar depois daqui.
          </h2>
        </div>

        {/* 07 "O Ecossistema Entrelaços e os próximos passos" */}
        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              07
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white">
              O Ecossistema Entrelaços e os próximos passos
            </h3>
            <p className="text-sm sm:text-base font-serif-editorial italic text-slate-600 dark:text-[#A1A1AA]">
              "No fim da Aula Magna, conheça o ecossistema que dá continuidade ao percurso."
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
            <p>
              O Ciclo FAC percorre Fundação, Atração e Conexão ao longo dos encontros. No
              encerramento da aula, apresentamos os espaços de aprendizagem, as ferramentas e a
              comunidade que apoiam a continuidade dessa construção.
            </p>
            <p>
              Você pode estudar este caderno e guardar o PDF mesmo sem estar matriculada. Se decidir
              seguir na Academia, o resultado de hoje ajudará a comparar o que mudou ao longo do
              ciclo.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[14px] bg-purple-50/60 dark:bg-purple-950/20 border-l-3 border-l-[#7c3aed] dark:border-l-[#C084FC] border-y border-r border-purple-100 dark:border-purple-900/30 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
              PARA CONTINUAR
            </span>
            <p className="font-serif-editorial text-base sm:text-lg md:text-xl text-slate-900 dark:text-white font-normal italic">
              "Que tipo de apoio ajudaria você a sustentar seu próximo passo?"
            </p>
          </div>

          {/* Chamada para alunas / continuação */}
          {isAlunaValidada ? (
            <div className="pt-3 flex flex-wrap gap-3">
              <Button
                type="button"
                size="sm"
                onClick={onAvancarEncontro2}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-mono text-xs sm:text-sm rounded-[8px] min-h-[44px] px-4 cursor-pointer"
              >
                <span>Avançar para o Encontro 2 (Meu IKIGAI) →</span>
              </Button>
            </div>
          ) : (
            <div className="pt-3 p-5 rounded-[12px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA]">
                Já é aluna da turma atual? Valide seu e-mail de compra para liberar o Encontro 2.
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onValidarEmail}
                className="border-purple-300 dark:border-[#7c3aed]/50 text-[#7c3aed] dark:text-[#C084FC] font-mono text-xs sm:text-sm rounded-[8px] min-h-[42px] px-4 shrink-0 cursor-pointer"
              >
                <span>Validar Matrícula</span>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 13. 03 / SUA ENTREGA */}
      <section className="rounded-[20px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-7 sm:p-10 lg:p-12 space-y-7">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#7c3aed] dark:text-[#C084FC] block">
            03 / SUA ENTREGA
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900 dark:text-white mt-1">
            O que precisa existir ao final.
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-light">
          Seu Diagnóstico FAC Aprofundado em PDF. Guarde o resultado completo para comparar mais
          adiante. Se quiser conversar sobre a aula, compartilhe apenas o que se sentir confortável
          em um espaço aberto da comunidade.
        </p>

        {/* Critério de pronto (destaque) */}
        <div className="p-5 sm:p-6 rounded-[14px] bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-3.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-light">
            <strong className="font-semibold block text-emerald-900 dark:text-emerald-100 font-sans">
              Critério de pronto:
            </strong>
            <p>
              Você respondeu às 24 perguntas pontuadas, leu a análise, conferiu se ela faz sentido
              para a sua prática e baixou o PDF.
            </p>
          </div>
        </div>

        {/* Chamada final */}
        <div className="p-5 sm:p-6 rounded-[14px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200/80 dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-light max-w-xl">
            Faça o diagnóstico nesta semana ou retome quando puder. O rascunho fica neste navegador;
            baixe o PDF para guardar seu resultado.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={onAbrirDiagnostico}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] font-semibold text-xs sm:text-sm rounded-[8px] min-h-[44px] px-4 shrink-0 cursor-pointer"
          >
            <span>Fazer Diagnóstico Agora</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </section>

      {/* 14. DÚVIDAS COMUNS (FAQ) */}
      <FaqEncontro1 />
    </article>
  )
}
