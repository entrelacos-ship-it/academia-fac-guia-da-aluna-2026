import React from 'react'

// ─────────────────────────────────────────────────────────────
// Constantes dos GPTs oficiais. Tati preenche depois com os links
// reais. Enquanto o valor for o padrão vazio, o botão de abrir o
// GPT fica oculto e a aluna usa só o prompt para copiar e colar.
// ─────────────────────────────────────────────────────────────
export const GPT_BIO_MANIFESTO = 'COLE_AQUI_O_LINK_DO_GPT'
export const GPT_ARQUITETA_VITRINE = 'COLE_AQUI_O_LINK_DO_GPT'
export const GPT_ROTEIRISTA_WHATSAPP = 'COLE_AQUI_O_LINK_DO_GPT'

const PADRAO = 'COLE_AQUI_O_LINK_DO_GPT'

export const isGptLinkAtivo = (valor: string) =>
  Boolean(valor && valor.trim() !== '' && valor.trim() !== PADRAO)

// ─────────────────────────────────────────────────────────────
// StepCard: uma ação por vez, cartão numerado, nome do botão em
// negrito dentro do texto.
// ─────────────────────────────────────────────────────────────
interface StepCardProps {
  numero: number
  children: React.ReactNode
  ilustracao?: React.ReactNode
}

export const StepCard: React.FC<StepCardProps> = ({ numero, children, ilustracao }) => (
  <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 flex gap-3 sm:gap-4 items-start shadow-2xs">
    <span className="w-8 h-8 rounded-full bg-[#7c3aed] text-white font-mono text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
      {numero}
    </span>
    <div className="min-w-0 flex-1 space-y-3 text-sm text-editorial-primary leading-relaxed">
      {children}
    </div>
    {ilustracao && <div className="shrink-0">{ilustracao}</div>}
  </div>
)

// ─────────────────────────────────────────────────────────────
// PhoneIllustration: moldura de celular com SVG interno e ponto
// de toque pulsante laranja (respeita prefers-reduced-motion).
// ─────────────────────────────────────────────────────────────
interface PhoneIllustrationProps {
  svg: React.ReactNode
  ariaLabel: string
  touchPoint?: { x: number; y: number }
  width?: number
  height?: number
}

export const PhoneIllustration: React.FC<PhoneIllustrationProps> = ({
  svg,
  ariaLabel,
  touchPoint,
  width = 200,
  height = 400,
}) => {
  const uid = React.useId().replace(/[:]/g, '')
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="mx-auto w-full max-w-[240px]"
      style={{ maxWidth: width + 24 }}
    >
      <div className="rounded-[28px] border-[6px] border-slate-800 dark:border-[#3f3f46] bg-white dark:bg-[#0c0914] shadow-lg overflow-hidden">
        <div className="relative" style={{ aspectRatio: `${width} / ${height}` }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full block"
            aria-hidden="true"
            focusable="false"
          >
            {svg}
          </svg>
          {touchPoint && (
            <span
              aria-hidden="true"
              className="absolute -translate-x-1/2 -translate-y-1/2 e4-touch-point"
              style={{
                left: `${(touchPoint.x / width) * 100}%`,
                top: `${(touchPoint.y / height) * 100}%`,
              }}
            >
              <span className="e4-touch-wave" />
            </span>
          )}
        </div>
      </div>
      <span className="sr-only">{uid}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MenuPath: pílulas encadeadas com setas (caminho de menus).
// ─────────────────────────────────────────────────────────────
interface MenuPathProps {
  passos: string[]
}

export const MenuPath: React.FC<MenuPathProps> = ({ passos }) => (
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
// CopyPromptBox: prompt na tela, botão copiar que vira
// "Copiado ✓", altura limitada com "Ver prompt completo".
// ─────────────────────────────────────────────────────────────
interface CopyPromptBoxProps {
  titulo: string
  prompt: string
  idAnchor?: string
}

export const CopyPromptBox: React.FC<CopyPromptBoxProps> = ({ titulo, prompt, idAnchor }) => {
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
// GPTButton: some enquanto o link do GPT estiver no padrão.
// ─────────────────────────────────────────────────────────────
interface GPTButtonProps {
  link: string
  promptAnchorId: string
}

export const GPTButton: React.FC<GPTButtonProps> = ({ link, promptAnchorId }) => {
  if (!isGptLinkAtivo(link)) return null

  const rolarAtePrompt = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(promptAnchorId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] text-xs font-mono font-semibold px-3.5 py-2 min-h-[40px] transition-colors"
      >
        Abrir no ChatGPT
      </a>
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
// Callout: Dica (roxo), Atenção (laranja) e Ética (cinza).
// ─────────────────────────────────────────────────────────────
type CalloutTipo = 'dica' | 'atencao' | 'etica'

interface CalloutProps {
  tipo: CalloutTipo
  children: React.ReactNode
}

const CALLOUT_STYLES: Record<CalloutTipo, { box: string; icon: React.ReactNode }> = {
  dica: {
    box: 'bg-purple-50/80 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60',
    icon: <span className="text-[#7c3aed] dark:text-[#C084FC] font-bold">Dica</span>,
  },
  atencao: {
    box: 'bg-orange-50/80 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/60',
    icon: <span className="text-[#ea580c] dark:text-[#FB923C] font-bold">Atenção</span>,
  },
  etica: {
    box: 'bg-slate-50 dark:bg-[#121216] border-slate-200 dark:border-[#27272A]',
    icon: <span className="text-editorial-secondary font-bold">Ética</span>,
  },
}

export const Callout: React.FC<CalloutProps> = ({ tipo, children }) => {
  const style = CALLOUT_STYLES[tipo]
  return (
    <div className={`rounded-[12px] border p-4 flex gap-3 items-start ${style.box}`}>
      <span className="shrink-0 mt-0.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
        {tipo === 'etica' ? (
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
        ) : null}
        {style.icon}
      </span>
      <div className="text-xs sm:text-sm text-editorial-primary leading-relaxed min-w-0">
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// StuckBox "Travou?": acordeão fechado por padrão.
// ─────────────────────────────────────────────────────────────
interface StuckBoxProps {
  solucoes: string[]
}

export const StuckBox: React.FC<StuckBoxProps> = ({ solucoes }) => {
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
// Checklist: caixas marcáveis com progresso salvo no navegador.
// ─────────────────────────────────────────────────────────────
export type ChecklistValues = Record<string, boolean>

interface ChecklistProps {
  itens: { id: string; texto: string }[]
  valores: ChecklistValues
  onChange: (novos: ChecklistValues) => void
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
            className={`text-xs sm:text-sm leading-relaxed ${
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
// LinkButton: abre em nova aba com ícone de seta.
// ─────────────────────────────────────────────────────────────
interface LinkButtonProps {
  href: string
  children: React.ReactNode
}

export const LinkButton: React.FC<LinkButtonProps> = ({ href, children }) => (
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
// FiveSecondTimer: teste dos 5 segundos.
// ─────────────────────────────────────────────────────────────
export const FiveSecondTimer: React.FC = () => {
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

  // Círculo de progresso (r = 34, circunferência ≈ 213.6)
  const circunferencia = 2 * Math.PI * 34
  const progresso = restante / 5

  return (
    <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-5 sm:p-6 space-y-4 shadow-2xs">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90" aria-hidden="true">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-[#27272A]"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia * (1 - progresso)}
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-[#7c3aed] dark:text-[#C084FC]">
            {restante}
          </span>
        </div>
        <button
          type="button"
          onClick={iniciar}
          className="rounded-[8px] bg-[#7c3aed] hover:bg-[#6d28d9] dark:bg-[#C084FC] dark:hover:bg-[#a855f7] text-white dark:text-[#0A0A14] text-sm font-semibold px-5 py-2.5 min-h-[44px] transition-colors cursor-pointer"
        >
          Iniciar
        </button>
      </div>

      {finalizado && (
        <div className="rounded-[12px] bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 p-4 space-y-2">
          <p className="font-sans font-semibold text-sm text-editorial-primary">
            Responda sem pensar muito:
          </p>
          <p className="text-sm text-editorial-primary font-medium">O que ela faz?</p>
          <p className="text-sm text-editorial-primary font-medium">Para quem?</p>
          <p className="text-sm text-editorial-primary font-medium">Como eu agendo?</p>
        </div>
      )}
    </div>
  )
}
