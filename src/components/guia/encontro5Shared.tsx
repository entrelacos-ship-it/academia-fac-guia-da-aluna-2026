import React from 'react'

// ─────────────────────────────────────────────────────────────
// Elementos que se repetem na Aula 5 (encontros 5+ podem reaproveitar).
// Segue o padrão visual do encontro4Shared.tsx: cantos arredondados,
// roxo do app como cor de ação, laranja como destaque único.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Cartão de passo: círculo numerado à esquerda, ação à direita,
// nomes de botões em negrito, ilustração abaixo no celular e ao
// lado no computador.
// ─────────────────────────────────────────────────────────────
interface PassoCardProps {
  numero: number
  children: React.ReactNode
  ilustracao?: React.ReactNode
}

export const PassoCard: React.FC<PassoCardProps> = ({ numero, children, ilustracao }) => (
  <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 shadow-2xs">
    <div className="flex gap-3 sm:gap-4 items-start">
      <span className="w-8 h-8 rounded-full bg-[#7c3aed] text-white font-mono text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
        {numero}
      </span>
      <div className="min-w-0 flex-1 space-y-3 text-sm text-editorial-primary leading-relaxed">
        {children}
      </div>
    </div>
    {ilustracao && <div className="mt-4 md:mt-0 md:pl-[calc(2rem+0.75rem)]">{ilustracao}</div>}
  </div>
)

// ─────────────────────────────────────────────────────────────
// CaminhoDeMenus: etiquetas arredondadas ligadas por setas.
// ─────────────────────────────────────────────────────────────
interface CaminhoDeMenusProps {
  passos: string[]
}

export const CaminhoDeMenus: React.FC<CaminhoDeMenusProps> = ({ passos }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {passos.map((passo, i) => (
      <React.Fragment key={`${passo}-${i}`}>
        {i > 0 && (
          <span aria-hidden="true" className="text-[#ea580c] dark:text-[#FB923C] font-bold text-xs">
            ›
          </span>
        )}
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#3f3f46] text-xs font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC]">
          {passo}
        </span>
      </React.Fragment>
    ))}
  </div>
)

// ─────────────────────────────────────────────────────────────
// CaixaDePrompt: fundo suave, título, no celular mostra só o
// começo com "Ver prompt completo", botão copia tudo e vira
// "Copiado ✓" por dois segundos.
// ─────────────────────────────────────────────────────────────
interface CaixaDePromptProps {
  titulo: string
  prompt: string
  idAnchor?: string
}

export const CaixaDePrompt: React.FC<CaixaDePromptProps> = ({ titulo, prompt, idAnchor }) => {
  const [copiado, setCopiado] = React.useState(false)
  const [expandido, setExpandido] = React.useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sem clipboard: a aluna ainda pode selecionar o texto na tela.
    }
  }

  return (
    <div
      id={idAnchor}
      className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-3 shadow-2xs scroll-mt-32"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
          {titulo}
        </h4>
        <button
          type="button"
          onClick={copiar}
          className={`inline-flex items-center gap-1.5 rounded-[8px] px-3.5 py-2 min-h-[40px] text-xs font-mono font-semibold transition-colors cursor-pointer ${
            copiado
              ? 'bg-emerald-600 text-white'
              : 'bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14]'
          }`}
        >
          {copiado ? 'Copiado ✓' : 'Copiar prompt'}
        </button>
      </div>
      <div
        className={`relative overflow-y-auto rounded-[10px] bg-slate-50 dark:bg-[#0c0914] border border-slate-200 dark:border-[#27272A] p-3 sm:p-4 ${
          expandido ? 'max-h-[1400px]' : 'max-h-56'
        }`}
      >
        <pre className="whitespace-pre-wrap font-mono text-xs sm:text-[13px] leading-relaxed text-editorial-primary">
          {prompt}
        </pre>
        {!expandido && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 dark:from-[#0c0914] to-transparent" />
        )}
      </div>
      {!expandido && (
        <button
          type="button"
          onClick={() => setExpandido(true)}
          className="text-xs font-mono font-semibold text-[#7c3aed] dark:text-[#C084FC] hover:underline cursor-pointer"
        >
          Ver prompt completo
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// BotaoGPT: destaque "Abrir no ChatGPT" em nova aba + link
// discreto para a caixa de prompt correspondente na etapa
// "Todos os prompts". Esconde o botão enquanto o link não for
// preenchido (Tati informa os links depois).
// ─────────────────────────────────────────────────────────────
const LINK_GPT_PADRAO = 'COLE_AQUI_O_LINK_DO_GPT'

export const isGptLinkAtivo = (valor: string) =>
  Boolean(valor && valor.trim() !== '' && valor.trim() !== LINK_GPT_PADRAO)

interface BotaoGPTProps {
  link: string
  promptAnchorId: string
}

export const BotaoGPT: React.FC<BotaoGPTProps> = ({ link, promptAnchorId }) => {
  const rolarAtePrompt = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(promptAnchorId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      {isGptLinkAtivo(link) && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] text-xs font-mono font-semibold px-3.5 py-2 min-h-[40px] transition-colors"
        >
          Abrir no ChatGPT
        </a>
      )}
      <a
        href={`#${promptAnchorId}`}
        onClick={rolarAtePrompt}
        className="text-[11px] font-mono text-editorial-secondary hover:underline"
      >
        Prefere copiar e colar? Use o prompt
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Aviso: Dica (roxo claro, lâmpada), Atenção (laranja claro,
// alerta) e Ética (cinza claro, balança).
// ─────────────────────────────────────────────────────────────
export type AvisoTipo = 'dica' | 'atencao' | 'etica'

interface AvisoProps {
  tipo: AvisoTipo
  children: React.ReactNode
}

const ESTILOS_AVISO: Record<AvisoTipo, { box: string; rotulo: string; icone: React.ReactNode }> = {
  dica: {
    box: 'bg-purple-50/80 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60',
    rotulo: 'Dica',
    icone: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-[#7c3aed] dark:text-[#C084FC]"
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  atencao: {
    box: 'bg-orange-50/80 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/60',
    rotulo: 'Atenção',
    icone: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-[#ea580c] dark:text-[#FB923C]"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  etica: {
    box: 'bg-slate-50 dark:bg-[#121216] border-slate-200 dark:border-[#27272A]',
    rotulo: 'Ética',
    icone: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-editorial-secondary"
      >
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </svg>
    ),
  },
}

export const Aviso: React.FC<AvisoProps> = ({ tipo, children }) => {
  const estilo = ESTILOS_AVISO[tipo]
  return (
    <div className={`rounded-[12px] border p-4 flex gap-3 items-start ${estilo.box}`}>
      <span className="shrink-0 mt-0.5 flex flex-col items-start gap-1">
        {estilo.icone}
        <span
          className={`text-[10px] font-mono uppercase tracking-wider ${
            tipo === 'dica'
              ? 'text-[#7c3aed] dark:text-[#C084FC]'
              : tipo === 'atencao'
                ? 'text-[#ea580c] dark:text-[#FB923C]'
                : 'text-editorial-secondary'
          }`}
        >
          {estilo.rotulo}
        </span>
      </span>
      <div className="text-xs sm:text-sm text-editorial-primary leading-relaxed min-w-0">
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CaixaTravou: "Travou?" fechado por padrão, abre ao tocar e
// mostra soluções curtas.
// ─────────────────────────────────────────────────────────────
interface CaixaTravouProps {
  solucoes: string[]
}

export const CaixaTravou: React.FC<CaixaTravouProps> = ({ solucoes }) => {
  const [aberto, setAberto] = React.useState(false)
  return (
    <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-slate-50/70 dark:bg-[#0c0914] overflow-hidden">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] cursor-pointer text-left"
      >
        <span className="font-sans font-semibold text-sm text-editorial-primary">Travou?</span>
        <span className="text-xs font-mono text-editorial-secondary">
          {aberto ? 'Fechar' : 'Ver soluções'}
        </span>
      </button>
      {aberto && (
        <ul className="px-4 pb-4 space-y-2 list-disc pl-8">
          {solucoes.map((s, i) => (
            <li key={i} className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Checklist: caixas de marcar, item riscado suavemente ao
// marcar, progresso salvo no aparelho (localStorage com
// try/catch). Se não der para guardar, a lista segue
// funcionando do mesmo jeito.
// ─────────────────────────────────────────────────────────────
export type ChecklistValores = Record<string, boolean>

interface ChecklistProps {
  itens: { id: string; texto: string }[]
  valores: ChecklistValores
  onChange: (novos: ChecklistValores) => void
}

export const Checklist: React.FC<ChecklistProps> = ({ itens, valores, onChange }) => (
  <div className="space-y-2">
    {itens.map((item) => {
      const marcado = Boolean(valores[item.id])
      return (
        <label
          key={item.id}
          className="flex items-start gap-3 p-3.5 rounded-[10px] bg-white dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A] cursor-pointer select-none"
        >
          <input
            type="checkbox"
            checked={marcado}
            onChange={(e) => onChange({ ...valores, [item.id]: e.target.checked })}
            className="w-5 h-5 rounded-[4px] accent-[#7c3aed] cursor-pointer mt-0.5"
          />
          <span
            className={`text-xs sm:text-sm leading-relaxed transition-opacity duration-200 ${
              marcado
                ? 'line-through opacity-70 text-editorial-secondary'
                : 'text-editorial-primary font-medium'
            }`}
          >
            {item.texto}
          </span>
        </label>
      )
    })}
  </div>
)

// ─────────────────────────────────────────────────────────────
// BotaoLinkOficial: botão secundário para site externo em nova
// aba, com pequeno ícone de seta saindo.
// ─────────────────────────────────────────────────────────────
interface BotaoLinkOficialProps {
  href: string
  children: React.ReactNode
}

export const BotaoLinkOficial: React.FC<BotaoLinkOficialProps> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 rounded-[8px] border border-purple-200 dark:border-[#3f3f46] bg-purple-50 dark:bg-[#18181B] text-[#7c3aed] dark:text-[#C084FC] text-xs font-mono font-semibold px-3.5 py-2 min-h-[40px] hover:border-[#7c3aed]/60 dark:hover:border-[#C084FC]/60 transition-colors"
  >
    <span>{children}</span>
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  </a>
)

// ─────────────────────────────────────────────────────────────
// CronometroCincoSegundos: círculo grande com botão "Iniciar"
// no centro, conta de 5 até 0 com o arco se preenchendo, ao
// chegar em 0 mostra as três perguntas grandes e "Recomeçar".
// ─────────────────────────────────────────────────────────────
const PERGUNTAS_5S = ['O que ela faz?', 'Para quem?', 'Como eu agendo?']

export const CronometroCincoSegundos: React.FC = () => {
  const [rodando, setRodando] = React.useState(false)
  const [restante, setRestante] = React.useState(5)
  const [finalizado, setFinalizado] = React.useState(false)

  React.useEffect(() => {
    if (!rodando) return
    if (restante <= 0) {
      setRodando(false)
      setFinalizado(true)
      return
    }
    const t = setTimeout(() => setRestante((v) => v - 1), 1000)
    return () => clearTimeout(t)
  }, [rodando, restante])

  const iniciar = () => {
    setRestante(5)
    setFinalizado(false)
    setRodando(true)
  }

  const raio = 56
  const circunferencia = 2 * Math.PI * raio
  const progresso = restante / 5

  return (
    <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 128 128" className="w-32 h-32 -rotate-90" aria-hidden="true">
            <circle
              cx="64"
              cy="64"
              r={raio}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-[#27272A]"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r={raio}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia * (1 - progresso)}
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          {rodando || (!finalizado && restante < 5) ? (
            <span className="absolute inset-0 flex items-center justify-center font-mono text-4xl font-bold text-[#7c3aed] dark:text-[#C084FC]">
              {restante}
            </span>
          ) : (
            <button
              type="button"
              onClick={iniciar}
              className="absolute inset-0 m-auto w-fit h-fit rounded-[8px] bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] text-sm font-semibold px-5 py-2.5 min-h-[44px] transition-colors cursor-pointer"
            >
              Iniciar
            </button>
          )}
        </div>
        {finalizado && (
          <button
            type="button"
            onClick={iniciar}
            className="rounded-[8px] border border-slate-200 dark:border-[#27272A] px-5 py-2.5 min-h-[44px] text-sm font-semibold text-editorial-primary hover:bg-slate-50 dark:hover:bg-[#121216] transition-colors cursor-pointer"
          >
            Recomeçar
          </button>
        )}
      </div>

      {finalizado && (
        <div className="rounded-[12px] bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 p-4 space-y-2 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary">
            Responda sem pensar muito:
          </p>
          {PERGUNTAS_5S.map((pergunta) => (
            <p key={pergunta} className="text-base sm:text-lg font-semibold text-editorial-primary">
              {pergunta}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PontoDeToque: círculo laranja com onda pulsando suavemente.
// ─────────────────────────────────────────────────────────────
export const PontoDeToque: React.FC<{
  x: number
  y: number
  svgWidth: number
  svgHeight: number
}> = ({ x, y, svgWidth, svgHeight }) => (
  <span
    aria-hidden="true"
    className="absolute -translate-x-1/2 -translate-y-1/2 e5-touch-point"
    style={{
      left: `${(x / svgWidth) * 100}%`,
      top: `${(y / svgHeight) * 100}%`,
    }}
  >
    <span className="e5-touch-wave" />
  </span>
)
