import React from 'react'
import {
  ENCONTRO6_STORAGE_KEY,
  ENCONTRO6_ROTULO,
  ENCONTRO6_TITULO,
  ENCONTRO6_SUBTITULO,
  ETAPAS_ENCONTRO_6,
  CHECKLIST_ETAPA0,
  CHECKLIST_ETAPAS_1_A_3,
  CHECKLIST_ETAPA4,
} from '@/config/encontro6Content'
import { type ChecklistValues } from '@/components/guia/encontro4Shared'
import {
  Etapa0ConteudoE6,
  Etapa1ConteudoE6,
  Etapa2ConteudoE6,
  Etapa3ConteudoE6,
} from '@/components/guia/encontro6Etapas0123'
import { Etapa4ConteudoE6 } from '@/components/guia/encontro6Etapa4'
import {
  Etapa5ConteudoE6,
  Etapa6ConteudoE6,
  Etapa7ConteudoE6,
} from '@/components/guia/encontro6Etapas567'

// ─────────────────────────────────────────────────────────────
// Encontro 6 · Crenças sobre dinheiro, venda e exposição
// As 8 etapas com o conteúdo oficial verbatim da Tati.
// ─────────────────────────────────────────────────────────────

const carregarChecklists = (): Record<string, ChecklistValues> => {
  try {
    const bruto = localStorage.getItem(ENCONTRO6_STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as Record<string, ChecklistValues>) : {}
  } catch {
    return {}
  }
}

// Total de itens da barra de progresso: o checklist "Tenho em
// mãos" da Etapa 0, o checklist compartilhado das Etapas 1 a 3
// (contado uma única vez) e o checklist das skills da Etapa 4.
// As chaves e123-2 também podem ser marcadas automaticamente ao
// virar os três cartões Mito e Fato, sem contar dobrado.
export const TOTAL_ITENS_CHECKLIST =
  CHECKLIST_ETAPA0.length + CHECKLIST_ETAPAS_1_A_3.length + CHECKLIST_ETAPA4.length

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
interface Encontro6CadernoProps {
  className?: string
}

export const Encontro6Caderno: React.FC<Encontro6CadernoProps> = ({ className }) => {
  const [etapaAtual, setEtapaAtual] = React.useState(0)
  const [checklists, setChecklists] = React.useState<Record<string, ChecklistValues>>(() =>
    carregarChecklists(),
  )

  React.useEffect(() => {
    try {
      localStorage.setItem(ENCONTRO6_STORAGE_KEY, JSON.stringify(checklists))
    } catch {
      // Sem espaço no navegador: a aula continua funcionando,
      // apenas o progresso não fica salvo ao voltar.
    }
  }, [checklists])

  const marcar = (etapaId: string) => (novos: ChecklistValues) =>
    setChecklists((atuais) => ({ ...atuais, [etapaId]: novos }))

  const itensMarcados = Object.values(checklists).reduce(
    (total, valores) => total + Object.values(valores).filter(Boolean).length,
    0,
  )
  const progressoGeral = Math.min(100, Math.round((itensMarcados / TOTAL_ITENS_CHECKLIST) * 100))
  const tudoMarcado = itensMarcados >= TOTAL_ITENS_CHECKLIST

  const irPara = (i: number) => {
    setEtapaAtual(i)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const etapa = ETAPAS_ENCONTRO_6[etapaAtual]

  // Ao virar os três cartões Mito e Fato (Etapa 2), o item
  // "Virei os três cartões de Mito e Fato" do checklist das
  // Etapas 1 a 3 se marca sozinho.
  const marcarMitossVirados = React.useCallback(() => {
    setChecklists((atuais) => {
      const atuaisE123 = atuais['etapas-1-3'] ?? {}
      if (atuaisE123['e123-2']) return atuais
      return { ...atuais, 'etapas-1-3': { ...atuaisE123, 'e123-2': true } }
    })
  }, [])

  return (
    <div className={className}>
      {/* Topo do Encontro 6 */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#ff9b32] mb-2">
          {ENCONTRO6_ROTULO}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-editorial-primary tracking-tight mb-3">
          {ENCONTRO6_TITULO}
        </h2>
        <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed max-w-2xl">
          {ENCONTRO6_SUBTITULO}
        </p>
      </div>

      {/* Barra de progresso geral no topo */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-editorial-secondary">
          <span>Progresso da aula</span>
          <span>
            {itensMarcados} de {TOTAL_ITENS_CHECKLIST} itens ({progressoGeral}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-[#27272A] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all duration-300"
            style={{ width: `${progressoGeral}%` }}
          />
        </div>
      </div>

      {/* Navegação horizontal das etapas (mobile e desktop) */}
      <nav aria-label="Etapas da aula" className="mb-8 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          {ETAPAS_ENCONTRO_6.map((e, i) => {
            const ativo = i === etapaAtual
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => irPara(i)}
                className={`flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-xs font-mono transition-all cursor-pointer ${
                  ativo
                    ? 'bg-[#7c3aed] text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-[#18181B] text-editorial-secondary hover:bg-slate-200 dark:hover:bg-[#27272A]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    ativo
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-[#27272A] text-editorial-primary'
                  }`}
                >
                  {i}
                </span>
                <span className="font-sans font-medium">{e.titulo}</span>
                {e.tempo && <span className="opacity-70 text-[10px]">({e.tempo})</span>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Conteúdo da etapa ativa */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 items-start">
        <div className="rounded-[16px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-5 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-[#18181B]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC]">
                Etapa {etapaAtual}
                {etapa.tempo && ` · ${etapa.tempo}`}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-editorial-primary tracking-tight mt-1">
                {etapa.titulo}
              </h3>
            </div>
            <span className="font-mono text-xs text-editorial-secondary">
              {etapaAtual + 1} de {ETAPAS_ENCONTRO_6.length}
            </span>
          </div>

          {etapaAtual === 0 && (
            <Etapa0ConteudoE6 valores={checklists['etapa-0'] ?? {}} onChange={marcar('etapa-0')} />
          )}
          {etapaAtual === 1 && <Etapa1ConteudoE6 />}
          {etapaAtual === 2 && <Etapa2ConteudoE6 aoVirarTodos={marcarMitossVirados} />}
          {etapaAtual === 3 && (
            <Etapa3ConteudoE6
              valores={checklists['etapas-1-3'] ?? {}}
              onChange={marcar('etapas-1-3')}
            />
          )}
          {etapaAtual === 4 && (
            <Etapa4ConteudoE6 valores={checklists['etapa-4'] ?? {}} onChange={marcar('etapa-4')} />
          )}
          {etapaAtual === 5 && <Etapa5ConteudoE6 />}
          {etapaAtual === 6 && <Etapa6ConteudoE6 />}
          {etapaAtual === 7 && (
            <Etapa7ConteudoE6
              checklists={checklists}
              itensMarcados={itensMarcados}
              totalItens={TOTAL_ITENS_CHECKLIST}
              tudoMarcado={tudoMarcado}
              onChange={(etapaKey, valores) => marcar(etapaKey)(valores)}
            />
          )}

          {/* Botões de avançar e voltar */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-slate-100 dark:border-[#18181B]">
            <button
              type="button"
              onClick={() => irPara(Math.max(0, etapaAtual - 1))}
              disabled={etapaAtual === 0}
              className="rounded-[8px] border border-slate-200 dark:border-[#27272A] px-3.5 py-2 min-h-[40px] text-xs font-mono font-semibold text-editorial-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => irPara(Math.min(ETAPAS_ENCONTRO_6.length - 1, etapaAtual + 1))}
              disabled={etapaAtual === ETAPAS_ENCONTRO_6.length - 1}
              className="rounded-[8px] bg-[#7c3aed] dark:bg-[#C084FC] px-3.5 py-2 min-h-[40px] text-xs font-mono font-semibold text-white dark:text-[#0A0A14] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        </div>

        {/* Índice lateral fixo no desktop */}
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-editorial-secondary mb-3">
              Nesta aula
            </p>
            {ETAPAS_ENCONTRO_6.map((e, i) => {
              const ativo = i === etapaAtual
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => irPara(i)}
                  className={`w-full text-left rounded-[8px] px-3 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer ${
                    ativo
                      ? 'bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#3f3f46]'
                      : 'border border-transparent hover:bg-slate-50 dark:hover:bg-[#121216]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                      ativo
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-slate-100 dark:bg-[#27272A] text-editorial-secondary'
                    }`}
                  >
                    {i}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-xs leading-snug ${ativo ? 'font-semibold text-editorial-primary' : 'text-editorial-secondary'}`}
                    >
                      {e.titulo}
                    </span>
                    {e.tempo && (
                      <span className="block font-mono text-[9px] text-editorial-secondary mt-0.5">
                        {e.tempo}
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
