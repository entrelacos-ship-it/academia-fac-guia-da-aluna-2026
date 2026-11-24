import React from 'react'
import {
  ETAPA5_ABERTURA,
  MAPA_MARINA,
  ETAPA5_ESCADA_TITULO,
  ESCADA_MARINA,
  ETAPA5_PERCEBEU_TITULO,
  ETAPA5_PERCEBEU,
  ETAPA6_ESCADA_ABERTURA,
  ETAPA6_ESCADA_DICA,
  ETAPA6_ANTES_DEGRAU_TITULO,
  ETAPA6_ANTES_DEGRAU_PASSOS,
  ETAPA7_CUIDADO_TITULO,
  ETAPA7_CUIDADO,
  ETAPA7_ATENCAO_CVV,
  ETAPA7_LINK_CVV_TEXTO,
  ETAPA7_LINK_CVV_URL,
  ETAPA7_RESUMO_TITULO,
  ETAPA7_COMBINADO_TITULO,
  CHECKLIST_COMBINADO_SEMANA_E6,
  ETAPA7_FECHAMENTO,
  CHECKLIST_ETAPA0,
  CHECKLIST_ETAPAS_1_A_3,
  CHECKLIST_ETAPA4,
  TERRITORIOS,
} from '@/config/encontro6Content'
import {
  Callout,
  Checklist,
  LinkButton,
  type ChecklistValues,
} from '@/components/guia/encontro4Shared'
import { EscadaCoragem } from '@/components/guia/encontro6Elements'

// ─────────────────────────────────────────────────────────────
// Etapas 5 a 7 do Encontro 6 · Crenças sobre dinheiro, venda e
// exposição. Conteúdo verbatim da Tati; zero travessões; visual
// calmo (roxo/laranja, sem vermelho de alerta), muito espaço em
// branco e frases curtas.
// ─────────────────────────────────────────────────────────────

// Bloco de leitura com título e corpo
const Bloco: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div className="space-y-2">
    <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">{titulo}</p>
    <div className="text-sm text-editorial-primary leading-relaxed">{children}</div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 5 · Exemplo completo: as crenças da Marina
// ─────────────────────────────────────────────────────────────

// Cartão de um território do mapa da Marina: crença antiga em
// itálico, origem provável, o que custa e a frase de virada em
// destaque roxo no fim.
const CartaoMapaMarina: React.FC<{ cartao: (typeof MAPA_MARINA)[number] }> = ({ cartao }) => {
  const Icone = TERRITORIOS.find((t) => t.id === cartao.id)
  return (
    <div className="rounded-[14px] border border-purple-100 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-3 shadow-2xs">
      <p className="font-sans font-semibold text-sm text-editorial-primary">{cartao.nome}</p>

      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
          Crença antiga
        </p>
        <p className="text-sm italic text-editorial-primary leading-relaxed">
          "{cartao.crencaAntiga}"
        </p>
      </div>

      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
          Origem provável
        </p>
        <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">{cartao.origem}</p>
      </div>

      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
          O que custa
        </p>
        <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">{cartao.custo}</p>
      </div>

      <div className="rounded-[10px] border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/20 p-3.5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#7c3aed] dark:text-[#C084FC] font-semibold">
          Frase de virada
        </p>
        <p className="mt-1.5 font-serif text-sm sm:text-base text-editorial-primary leading-snug">
          "{cartao.virada}"
        </p>
      </div>
      <span className="sr-only">{Icone?.nome}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Etapa 5 · conteúdo completo
// ─────────────────────────────────────────────────────────────
export const Etapa5ConteudoE6: React.FC = () => (
  <div className="space-y-6">
    <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">{ETAPA5_ABERTURA}</p>

    {/* O mapa da Marina: três cartões, um por território */}
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        O mapa da Marina
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MAPA_MARINA.map((cartao) => (
          <CartaoMapaMarina key={cartao.id} cartao={cartao} />
        ))}
      </div>
    </div>

    {/* A escada da Marina: sete degraus, do Dia 1 ao Dia 7 */}
    <Bloco titulo={ETAPA5_ESCADA_TITULO}>
      <ol className="space-y-2">
        {ESCADA_MARINA.map((degrau) => (
          <li
            key={degrau.dia}
            className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] px-4 py-3 flex items-start gap-3"
          >
            <span className="font-mono text-[11px] font-semibold text-[#7c3aed] dark:text-[#C084FC] shrink-0 mt-0.5">
              {degrau.dia}
            </span>
            <span className="text-xs sm:text-sm text-editorial-primary leading-relaxed">
              {degrau.microacao}
            </span>
          </li>
        ))}
      </ol>
    </Bloco>

    {/* O que a Marina percebeu, em destaque */}
    <div className="rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-purple-50/80 dark:bg-purple-950/20 p-5 sm:p-6 space-y-2">
      <p className="font-sans font-semibold text-sm text-editorial-primary">
        {ETAPA5_PERCEBEU_TITULO}
      </p>
      <p className="font-serif text-base sm:text-lg text-editorial-primary leading-snug">
        {ETAPA5_PERCEBEU}
      </p>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 6 · Minha escada de coragem
// ─────────────────────────────────────────────────────────────
export const Etapa6ConteudoE6: React.FC = () => (
  <div className="space-y-6">
    <p className="text-sm sm:text-base text-editorial-primary leading-relaxed">
      {ETAPA6_ESCADA_ABERTURA}
    </p>

    {/* Escada de coragem: progresso guardado no aparelho */}
    <EscadaCoragem />

    <Callout tipo="dica">{ETAPA6_ESCADA_DICA}</Callout>

    {/* Antes de cada degrau: três passos numerados */}
    <div className="space-y-3">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        {ETAPA6_ANTES_DEGRAU_TITULO}
      </p>
      <ol className="space-y-2">
        {ETAPA6_ANTES_DEGRAU_PASSOS.map((passo, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">{passo}</p>
          </li>
        ))}
      </ol>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 7 · Cuidado com você e checklist final
// ─────────────────────────────────────────────────────────────

// Grupos do resumo: cada grupo usa a MESMA chave de estado do
// checklist original, então marcar aqui marca na etapa original.
const GRUPOS_RESUMO: {
  titulo: string
  itens: { id: string; texto: string }[]
  estadoKey: string
}[] = [
  { titulo: 'Etapa 0 · Antes de começar', itens: CHECKLIST_ETAPA0, estadoKey: 'etapa-0' },
  {
    titulo: 'Etapas 1 a 3 · O que é uma crença, Mito e Fato, dinâmica',
    itens: CHECKLIST_ETAPAS_1_A_3,
    estadoKey: 'etapas-1-3',
  },
  {
    titulo: 'Etapa 4 · As três skills',
    itens: CHECKLIST_ETAPA4,
    estadoKey: 'etapa-4',
  },
]

export const Etapa7ConteudoE6: React.FC<{
  checklists: Record<string, ChecklistValues>
  itensMarcados: number
  totalItens: number
  tudoMarcado: boolean
  onChange: (etapaKey: string, valores: ChecklistValues) => void
}> = ({ checklists, itensMarcados, totalItens, tudoMarcado, onChange }) => (
  <div className="space-y-6">
    {/* Cuidado com você */}
    <div className="rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-purple-50/80 dark:bg-purple-950/20 p-5 space-y-2">
      <p className="font-sans font-semibold text-sm text-editorial-primary">
        {ETAPA7_CUIDADO_TITULO}
      </p>
      <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA7_CUIDADO}</p>
    </div>

    <Callout tipo="atencao">{ETAPA7_ATENCAO_CVV}</Callout>
    <LinkButton href={ETAPA7_LINK_CVV_URL}>{ETAPA7_LINK_CVV_TEXTO}</LinkButton>

    {/* Barra de progresso geral da aula, acima do resumo */}
    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#18181B]">
      <div className="flex items-center justify-between text-xs font-mono text-editorial-secondary">
        <span>Progresso da aula</span>
        <span>
          {itensMarcados} de {totalItens} itens
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-[#27272A] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all duration-500"
          style={{
            width: `${totalItens > 0 ? Math.min(100, Math.round((itensMarcados / totalItens) * 100)) : 0}%`,
          }}
        />
      </div>
    </div>

    {/* Resumo dos checklists das Etapas 0 a 4, mesmo estado */}
    <div className="space-y-4">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        {ETAPA7_RESUMO_TITULO}
      </p>
      {GRUPOS_RESUMO.map((grupo) => (
        <div
          key={grupo.titulo}
          className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-slate-50/60 dark:bg-[#0c0914] p-3.5 space-y-3"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
            {grupo.titulo}
          </p>
          <Checklist
            itens={grupo.itens}
            valores={checklists[grupo.estadoKey] ?? {}}
            onChange={(v) => onChange(grupo.estadoKey, v)}
          />
        </div>
      ))}
    </div>

    {/* Combinado da semana */}
    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#18181B]">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        {ETAPA7_COMBINADO_TITULO}
      </p>
      <Checklist
        itens={CHECKLIST_COMBINADO_SEMANA_E6}
        valores={checklists['combinado'] ?? {}}
        onChange={(v) => onChange('combinado', v)}
      />
    </div>

    {/* Frase de fechamento, com comemoração discreta */}
    {tudoMarcado && (
      <style>{`@keyframes e6-coracao { 0% { transform: scale(1) } 35% { transform: scale(1.3) } 65% { transform: scale(0.92) } 100% { transform: scale(1) } }`}</style>
    )}
    {tudoMarcado && (
      <div className="rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 p-6 text-center animate-in fade-in zoom-in-95 duration-700">
        <p className="text-base sm:text-lg font-medium text-editorial-primary leading-relaxed">
          {ETAPA7_FECHAMENTO.split('💜')[0]}
          <span
            className="inline-block"
            style={{ animation: 'e6-coracao 900ms ease-in-out 300ms both' }}
            aria-hidden="true"
          >
            💜
          </span>
          {ETAPA7_FECHAMENTO.split('💜')[1] ? `💜${ETAPA7_FECHAMENTO.split('💜')[1]}` : ''}
        </p>
      </div>
    )}
  </div>
)
