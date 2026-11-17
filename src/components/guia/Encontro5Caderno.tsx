import React from 'react'
import {
  ENCONTRO5_STORAGE_KEY,
  ENCONTRO5_ROTULO,
  ENCONTRO5_TITULO,
  ENCONTRO5_SUBTITULO,
  ETAPAS_ENCONTRO_5,
  SKILLS_ENCONTRO_5,
  CHECKLIST_ETAPA0,
  CHECKLIST_ETAPAS_1_2,
  CHECKLIST_ETAPA4,
  CHECKLIST_ETAPA5,
} from '@/config/encontro5Content'
import { Checklist, type ChecklistValues } from '@/components/guia/encontro4Shared'
import {
  Etapa0Conteudo,
  Etapa1Conteudo,
  Etapa2Conteudo,
} from '@/components/guia/encontro5Etapas012'
import { Etapa3Conteudo, Etapa4Conteudo } from '@/components/guia/encontro5Etapas34'
import { Etapa5Conteudo } from '@/components/guia/encontro5Etapa5'

// ─────────────────────────────────────────────────────────────
// Encontro 5 · Branding: Sua marca com rosto e voz
// Etapas 0 a 5 com conteúdo oficial; etapas 6 e 7 aguardam
// conteúdo nos próximos pedidos.
// ─────────────────────────────────────────────────────────────

// Checklist das skills, compartilhado pelas Etapas 4 e 5.
// Quando a aluna marca uma skill, o círculo dela no fluxo
// fica preenchido.
export const CHECKLIST_SKILLS: { id: string; texto: string }[] = SKILLS_ENCONTRO_5.map((s) => ({
  id: `skill-${s.numero}`,
  texto: `${s.nomeCompleto}: ${s.entrega}`,
}))

// O checklist da Etapa 4 (skills 1 a 5 + imagem gerada) usa as
// chaves skill-1 .. skill-5 (já contadas em CHECKLIST_SKILLS,
// compartilhadas com as Etapas 5 e 7) e a chave extra skill-imagem.
// O checklist da Etapa 5 (skills 6 a 8 + manual salvo + PVU em voz
// alta) usa skill-6 .. skill-8 (já contadas) e as chaves e5-*.
// A chave skill-imagem e as chaves e5-* entram uma única vez.
export const TOTAL_ITENS_CHECKLIST =
  CHECKLIST_SKILLS.length +
  CHECKLIST_ETAPAS_1_2.length +
  CHECKLIST_ETAPA0.length +
  (CHECKLIST_ETAPA4.length - 5) +
  (CHECKLIST_ETAPA5.length - 3)

const carregarChecklists = (): Record<string, ChecklistValues> => {
  try {
    const bruto = localStorage.getItem(ENCONTRO5_STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as Record<string, ChecklistValues>) : {}
  } catch {
    return {}
  }
}

// ─────────────────────────────────────────────────────────────
// Aviso padrão das etapas sem conteúdo ainda
// ─────────────────────────────────────────────────────────────
const ConteudoEmBreve: React.FC<{ children?: React.ReactNode }> = () => (
  <div className="rounded-[12px] border border-dashed border-slate-300 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] p-4 text-center">
    <p className="text-xs sm:text-sm text-editorial-secondary">
      O conteúdo desta etapa será adicionado em breve.
    </p>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
interface Encontro5CadernoProps {
  className?: string
}

export const Encontro5Caderno: React.FC<Encontro5CadernoProps> = ({ className }) => {
  const [etapaAtual, setEtapaAtual] = React.useState(0)
  const [checklists, setChecklists] = React.useState<Record<string, ChecklistValues>>(() =>
    carregarChecklists(),
  )

  React.useEffect(() => {
    try {
      localStorage.setItem(ENCONTRO5_STORAGE_KEY, JSON.stringify(checklists))
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
  const progressoGeral = Math.round((itensMarcados / TOTAL_ITENS_CHECKLIST) * 100)
  const tudoMarcado = itensMarcados >= TOTAL_ITENS_CHECKLIST

  // Skills marcadas (chave skill-1 .. skill-8) alimentam o fluxo.
  const feitasSkills = checklists['skills'] ?? {}

  const irPara = (i: number) => {
    setEtapaAtual(i)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const etapa = ETAPAS_ENCONTRO_5[etapaAtual]

  return (
    <div className={className}>
      {/* Topo do Encontro 5 */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#ff9b32] mb-2">
          {ENCONTRO5_ROTULO}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-editorial-primary tracking-tight mb-3">
          {ENCONTRO5_TITULO}
        </h2>
        <p className="text-sm sm:text-base text-editorial-secondary leading-relaxed max-w-2xl">
          {ENCONTRO5_SUBTITULO}
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
          {ETAPAS_ENCONTRO_5.map((e, i) => {
            const ativo = i === etapaAtual
            const concluida =
              e.id === 'etapa-4'
                ? SKILLS_ENCONTRO_5.slice(0, 5).every((s) => feitasSkills[`skill-${s.numero}`])
                : e.id === 'etapa-5'
                  ? SKILLS_ENCONTRO_5.slice(5).every((s) => feitasSkills[`skill-${s.numero}`])
                  : false

            return (
              <button
                key={e.id}
                type="button"
                onClick={() => irPara(i)}
                className={`flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-xs font-mono transition-all cursor-pointer ${
                  ativo
                    ? 'bg-[#7c3aed] text-white shadow-2xs'
                    : concluida
                      ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-200'
                      : 'bg-slate-100 dark:bg-[#18181B] text-editorial-secondary hover:bg-slate-200 dark:hover:bg-[#27272A]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    ativo
                      ? 'bg-white/20 text-white'
                      : concluida
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-[#27272A] text-editorial-primary'
                  }`}
                >
                  {concluida && !ativo ? '✓' : e.numero}
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
                Etapa {etapa.numero}
                {etapa.tempo && ` · ${etapa.tempo}`}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-editorial-primary tracking-tight mt-1">
                {etapa.titulo}
              </h3>
            </div>
            <span className="font-mono text-xs text-editorial-secondary">
              {etapaAtual + 1} de {ETAPAS_ENCONTRO_5.length}
            </span>
          </div>

          {etapaAtual === 0 && (
            <Etapa0 checklist={checklists['etapa-0'] ?? {}} onChange={marcar('etapa-0')} />
          )}
          {etapaAtual === 1 && <Etapa1 />}
          {etapaAtual === 2 && (
            <Etapa2
              checklist={checklists['etapas-1-2'] ?? {}}
              onChange={(v) => marcar('etapas-1-2')(v)}
            />
          )}
          {etapaAtual === 3 && <Etapa3Conteudo feitas={feitasSkills} onSelect={() => irPara(4)} />}
          {etapaAtual === 4 && (
            <Etapa4Conteudo valores={feitasSkills} onChange={(v) => marcar('skills')(v)} />
          )}
          {etapaAtual === 5 && (
            <Etapa5Conteudo valores={feitasSkills} onChange={(v) => marcar('skills')(v)} />
          )}
          {etapaAtual === 6 && <Etapa6 />}
          {etapaAtual === 7 && (
            <Etapa7
              feitas={feitasSkills}
              progressoGeral={progressoGeral}
              tudoMarcado={tudoMarcado}
              onChange={(v) => marcar('skills')(v)}
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
              onClick={() => irPara(Math.min(ETAPAS_ENCONTRO_5.length - 1, etapaAtual + 1))}
              disabled={etapaAtual === ETAPAS_ENCONTRO_5.length - 1}
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
            {ETAPAS_ENCONTRO_5.map((e, i) => {
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
                    {e.numero}
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

// ─────────────────────────────────────────────────────────────
// Etapas. Estrutura inicial: só o título e o aviso de conteúdo
// em preparação, mais um exemplo de cada elemento novo no lugar
// onde ele vai morar.
// ─────────────────────────────────────────────────────────────

// Etapa 0 · Antes de começar
const Etapa0: React.FC<{ checklist: ChecklistValues; onChange: (v: ChecklistValues) => void }> = ({
  checklist,
  onChange,
}) => <Etapa0Conteudo valores={checklist} onChange={onChange} />

// Etapa 1 · O que é uma marca
const Etapa1: React.FC = () => <Etapa1Conteudo />

// Etapa 2 · Psicologia das cores (checklist único com a Etapa 1)
const Etapa2: React.FC<{ checklist: ChecklistValues; onChange: (v: ChecklistValues) => void }> = ({
  checklist,
  onChange,
}) => <Etapa2Conteudo valores={checklist} onChange={onChange} />

// Etapa 6 · Exemplo completo: a marca da Marina (consulta)
const Etapa6: React.FC = () => (
  <>
    <ConteudoEmBreve />
  </>
)

// Etapa 7 · Checklist final e combinado da semana
const Etapa7: React.FC<{
  feitas: Record<string, boolean>
  progressoGeral: number
  tudoMarcado: boolean
  onChange: (v: ChecklistValues) => void
}> = ({ feitas, progressoGeral, tudoMarcado, onChange }) => (
  <>
    <ConteudoEmBreve />
    <div className="mt-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans font-semibold text-sm text-editorial-primary">Resumo das skills</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary">
          {progressoGeral}%
        </p>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-[#27272A] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all duration-500"
          style={{ width: `${progressoGeral}%` }}
        />
      </div>
      <Checklist itens={CHECKLIST_SKILLS} valores={feitas} onChange={onChange} />
      {tudoMarcado && (
        <div className="rounded-[14px] bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 p-5 text-center animate-in fade-in duration-500">
          <p className="text-sm sm:text-base font-medium text-editorial-primary leading-relaxed">
            Todas as skills concluídas 💜 Sua marca já tem rosto e voz.
          </p>
        </div>
      )}
    </div>
  </>
)
