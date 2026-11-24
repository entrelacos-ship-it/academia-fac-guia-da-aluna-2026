// ═════════════════════════════════════════════════════════════
// Elementos interativos exclusivos do Encontro 6 · Crenças.
// Visual calmo: espaço em branco, frases curtas, nada de
// vermelho de alerta, destaque laranja nos ícones de traço.
// ═════════════════════════════════════════════════════════════
import React from 'react'
import { cn } from '@/lib/utils'
import {
  getUserStorageItem,
  setUserStorageItem,
  notifyLocalDataChanged,
} from '@/services/userStorage'
import type { TerritorioDef, MitoFatoDef, GrupoFrasesDef } from '@/config/encontro6Content'

// ─────────────────────────────────────────────────────────────
// Ícones de traço dos territórios (moeda, aperto de mãos, olho)
// ─────────────────────────────────────────────────────────────
function IconeMoeda({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M24 15v18M20 19.5c0-1.9 1.8-3 4-3s4 1.1 4 3c0 4.5-8 3.5-8 8 0 1.9 1.8 3 4 3s4-1.1 4-3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconeApertoMaos({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 24l8-8 7 4 6-4 9 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 16l8 9 6-5 8 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 27l4 4M24 31l3 3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconeOlho({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 24c5-8 11-12 18-12s13 4 18 12c-5 8-11 12-18 12S11 32 6 24z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="5.5" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

const ICONES_TERRITORIO: Record<TerritorioDef['id'], React.FC<{ className?: string }>> = {
  dinheiro: IconeMoeda,
  venda: IconeApertoMaos,
  exposicao: IconeOlho,
}

// ─────────────────────────────────────────────────────────────
// 1. Cartões de território: três cartões lado a lado
//    (empilhados no celular), frases de exemplo em itálico.
// ─────────────────────────────────────────────────────────────
export const CartoesTerritorio: React.FC<{ territorios: TerritorioDef[] }> = ({ territorios }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {territorios.map((t) => {
      const Icone = ICONES_TERRITORIO[t.id]
      return (
        <div
          key={t.id}
          className="rounded-[14px] border border-purple-100 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-2 shadow-2xs"
        >
          <Icone className="h-8 w-8 text-[#ff9b32]" />
          <p className="font-sans font-semibold text-sm text-editorial-primary">{t.nome}</p>
          <ul className="space-y-1.5">
            {t.frases.map((f) => (
              <li
                key={f}
                className="text-xs sm:text-sm italic text-editorial-secondary leading-relaxed"
              >
                "{f}"
              </li>
            ))}
          </ul>
        </div>
      )
    })}
  </div>
)

// ─────────────────────────────────────────────────────────────
// 2. Cartão Mito e Fato: frente com o Mito (rótulo cinza),
//    verso com o Fato (rótulo roxo e check). Vira ao toque.
// ─────────────────────────────────────────────────────────────
export const CartaoMitoFato: React.FC<{ item: MitoFatoDef }> = ({ item }) => {
  const [virado, setVirado] = React.useState(false)
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => setVirado((v) => !v)}
        aria-pressed={virado}
        className="block w-full text-left cursor-pointer [perspective:1200px]"
      >
        <div
          className={cn(
            'relative min-h-[9rem] w-full transition-transform duration-500 [transform-style:preserve-3d]',
            virado && '[transform:rotateY(180deg)]',
          )}
        >
          {/* Frente · Mito */}
          <div className="absolute inset-0 flex flex-col rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 shadow-2xs [backface-visibility:hidden]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-editorial-secondary">
              Mito
            </span>
            <p className="mt-2 text-sm sm:text-base text-editorial-primary leading-relaxed">
              {item.mito}
            </p>
          </div>
          {/* Verso · Fato */}
          <div className="absolute inset-0 flex flex-col rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/20 p-4 sm:p-5 shadow-2xs [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider font-semibold text-[#7c3aed] dark:text-[#C084FC]">
              Fato
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8.5l3 3 7-7" />
              </svg>
            </span>
            <p className="mt-2 text-sm sm:text-base text-editorial-primary leading-relaxed">
              {item.fato}
            </p>
          </div>
        </div>
      </button>
      <p className="text-center text-[10px] font-mono text-editorial-secondary">toque para virar</p>
    </div>
  )
}

export const CartoesMitoFato: React.FC<{ itens: MitoFatoDef[] }> = ({ itens }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {itens.map((item) => (
      <CartaoMitoFato key={item.id} item={item} />
    ))}
  </div>
)

// ─────────────────────────────────────────────────────────────
// 3. Caminho da virada: seis etapas ligadas por setas.
//    Horizontal no computador, vertical no celular.
// ─────────────────────────────────────────────────────────────
export const CaminhoVirada: React.FC<{ passos: string[] }> = ({ passos }) => (
  <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 shadow-2xs">
    {/* Computador: linha horizontal */}
    <ol className="hidden md:flex items-stretch justify-center gap-1">
      {passos.map((p, i) => (
        <li key={p} className="flex items-center gap-1">
          <div className="flex w-28 flex-col items-center text-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-purple-200 dark:border-[#3f3f46] bg-white dark:bg-[#121216] font-mono text-sm font-bold text-[#7c3aed] dark:text-[#C084FC]">
              {i + 1}
            </span>
            <span className="mt-2 text-xs font-medium leading-snug text-editorial-primary">
              {p}
            </span>
          </div>
          {i < passos.length - 1 && (
            <svg
              viewBox="0 0 24 24"
              className="mt-4 h-4 w-4 shrink-0 text-[#ff9b32]"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h13m0 0l-5-5m5 5l-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </li>
      ))}
    </ol>
    {/* Celular: vertical */}
    <ol className="flex flex-col gap-3 md:hidden">
      {passos.map((p, i) => (
        <li key={p} className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-purple-200 dark:border-[#3f3f46] bg-white dark:bg-[#121216] font-mono text-sm font-bold text-[#7c3aed] dark:text-[#C084FC]">
            {i + 1}
          </span>
          <span className="text-sm font-medium text-editorial-primary">{p}</span>
          {i < passos.length - 1 && (
            <svg
              viewBox="0 0 24 24"
              className="ml-auto h-4 w-4 text-[#ff9b32]"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 5v13m0 0l-5-5m5 5l5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </li>
      ))}
    </ol>
  </div>
)

// ─────────────────────────────────────────────────────────────
// 4. Frases da dinâmica: lista de frases incompletas com linha
//    pontilhada (a aluna escreve no papel) e botão discreto
//    "Iniciar 20 segundos" com contagem regressiva suave, sem som.
//    Sem campo de texto.
// ─────────────────────────────────────────────────────────────
export const GrupoFrasesDinamica: React.FC<{
  grupo: GrupoFrasesDef
  numeroInicial: number
}> = ({ grupo, numeroInicial }) => {
  const [segundos, setSegundos] = React.useState<number | null>(null)
  const intervalo = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    if (segundos === null) return
    if (segundos <= 0) {
      if (intervalo.current) clearInterval(intervalo.current)
      intervalo.current = null
      return
    }
    intervalo.current = setInterval(() => setSegundos((s) => (s ?? 1) - 1), 1000)
    return () => {
      if (intervalo.current) clearInterval(intervalo.current)
      intervalo.current = null
    }
  }, [segundos])

  const rodando = segundos !== null && segundos > 0

  return (
    <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-sans font-semibold text-sm text-editorial-primary">{grupo.nome}</h4>
        <div className="flex items-center gap-2">
          {segundos !== null && (
            <span
              className="font-mono text-sm tabular-nums text-[#7c3aed] dark:text-[#C084FC]"
              aria-live="polite"
            >
              {Math.max(0, segundos)}s
            </span>
          )}
          <button
            type="button"
            onClick={() => setSegundos(20)}
            disabled={rodando}
            className="rounded-[8px] border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#0c0914] px-3 py-1.5 min-h-[36px] text-[11px] font-mono font-semibold text-editorial-primary transition-colors hover:bg-slate-100 dark:hover:bg-[#18181B] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {rodando ? 'Contando...' : 'Iniciar 20 segundos'}
          </button>
        </div>
      </div>
      <ol className="space-y-4">
        {grupo.frases.map((f, i) => (
          <li key={f}>
            <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
              <span className="mr-1.5 font-mono text-xs text-editorial-secondary">
                {numeroInicial + i}.
              </span>
              {f}
            </p>
            <div className="mt-2 border-b border-dotted border-slate-300 dark:border-[#3f3f46]" />
          </li>
        ))}
      </ol>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 5. Escada de coragem: sete degraus (Dia 1 a Dia 7), do mais
//    baixo ao mais alto, com caixa de marcar. Progresso guardado
//    no aparelho (localStorage, com try/catch). Ao marcar um
//    degrau ele fica roxo claro com uma estrela; ao marcar os
//    sete, o topo ganha uma luz suave.
// ─────────────────────────────────────────────────────────────
const ESCADA_STORAGE_KEY = 'academia-fac:encontro6-escada'

export const EscadaCoragem: React.FC = () => {
  const [marcados, setMarcados] = React.useState<boolean[]>(() => {
    try {
      const bruto = localStorage.getItem(ESCADA_STORAGE_KEY)
      if (bruto) {
        const parsed = JSON.parse(bruto) as boolean[]
        if (Array.isArray(parsed) && parsed.length === 7) return parsed
      }
      return Array(7).fill(false)
    } catch {
      return Array(7).fill(false)
    }
  })

  const alternar = (dia: number) => {
    setMarcados((atual) => {
      const novo = [...atual]
      novo[dia] = !novo[dia]
      try {
        localStorage.setItem(ESCADA_STORAGE_KEY, JSON.stringify(novo))
        notifyLocalDataChanged()
      } catch {
        // Sem espaço no navegador: a escada segue funcionando,
        // apenas o progresso não fica salvo ao voltar.
      }
      return novo
    })
  }

  const todos = marcados.every(Boolean)

  return (
    <div
      className={cn(
        'rounded-[14px] border bg-white dark:bg-[#121216] p-4 sm:p-5 shadow-2xs transition-shadow',
        todos
          ? 'border-purple-200 dark:border-purple-900/60 shadow-[0_0_24px_rgba(124,58,237,0.18)]'
          : 'border-slate-200 dark:border-[#27272A]',
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold mb-3">
        Minha escada de coragem · um degrau por dia
      </p>
      {/* flex-col-reverse: Dia 1 fica no degrau mais baixo */}
      <div className="flex flex-col-reverse gap-2">
        {Array.from({ length: 7 }, (_, dia) => dia).map((dia) => {
          const marcado = marcados[dia]
          return (
            <button
              key={dia}
              type="button"
              onClick={() => alternar(dia)}
              aria-pressed={marcado}
              className={cn(
                'flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors cursor-pointer min-h-[44px]',
                marcado
                  ? 'border-purple-200 dark:border-purple-900/60 bg-purple-100 dark:bg-purple-950/40'
                  : 'border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] hover:bg-purple-50 dark:hover:bg-[#18181B]',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border text-[10px] font-bold',
                  marcado
                    ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                    : 'border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#121216] text-transparent',
                )}
                aria-hidden="true"
              >
                ✓
              </span>
              <span
                className={cn(
                  'text-sm font-medium',
                  marcado ? 'text-editorial-primary' : 'text-editorial-secondary',
                )}
              >
                Dia {dia + 1}
              </span>
              {marcado && (
                <span className="ml-auto text-base" aria-hidden="true">
                  ⭐
                </span>
              )}
            </button>
          )
        })}
      </div>
      {todos && (
        <p className="mt-3 text-center text-sm font-medium text-[#7c3aed] dark:text-[#C084FC]">
          Os sete degraus marcados. A luz no topo da escada é sua.
        </p>
      )}
    </div>
  )
}
