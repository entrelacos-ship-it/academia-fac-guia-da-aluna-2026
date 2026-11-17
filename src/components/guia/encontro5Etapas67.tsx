import React from 'react'
import {
  ETAPA6_ABERTURA,
  ETAPA6_MANIFESTO_TITULO,
  ETAPA6_MANIFESTO,
  ETAPA6_PERSONALIDADE_TITULO,
  ETAPA6_PERSONALIDADE,
  ETAPA6_PALETA_TITULO,
  ETAPA6_PALETA_LEITURA,
  PALETA_MARINA,
  ETAPA6_FONTES_TITULO,
  ETAPA6_FONTES,
  ETAPA6_FAMILIAS,
  ETAPA6_SIMBOLO_TITULO,
  ETAPA6_SIMBOLO,
  ETAPA6_LOGO_TITULO,
  ETAPA6_LOGO_DIRECAO,
  ETAPA6_PVU_TITULO,
  ETAPA6_PVU_ANTES_LABEL,
  ETAPA6_PVU_ANTES,
  ETAPA6_PVU_OBSERVACAO,
  ETAPA6_PVU_DEPOIS_LABEL,
  ETAPA6_PVU_DEPOIS,
  ETAPA6_PVU_CURTA_LABEL,
  ETAPA6_PVU_CURTA,
  ETAPA6_PVU_REGUA,
  ETAPA6_ENTREGA_TITULO,
  ETAPA6_ENTREGA_CARTOES,
  ETAPA6_DECLARACAO_TITULO,
  ETAPA6_DECLARACAO,
  ETAPA7_RESUMO_TITULO,
  ETAPA7_RESUMO_NOTA,
  ETAPA7_COMBINADO_TITULO,
  CHECKLIST_COMBINADO_SEMANA,
  ETAPA7_FECHAMENTO,
  CHECKLIST_ETAPA0,
  CHECKLIST_ETAPAS_1_2,
  CHECKLIST_ETAPA4,
  CHECKLIST_ETAPA5,
} from '@/config/encontro5Content'
import { Checklist, type ChecklistValues } from '@/components/guia/encontro4Shared'
import { AmostraPaleta, AntesDepois } from '@/components/guia/encontro5Elements'
import { CartaoParteEntrega } from '@/components/guia/encontro5Etapa5'

// ─────────────────────────────────────────────────────────────
// Etapas 6 e 7 do Encontro 5 · Branding.
// Conteúdo verbatim da Tati; zero travessões; reaproveita os
// elementos padrão do projeto (AmostraPaleta, AntesDepois,
// Checklist, CartaoParteEntrega).
// ─────────────────────────────────────────────────────────────

// Bloco de leitura com título e corpo
const Bloco: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div className="space-y-2">
    <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">{titulo}</p>
    <div className="text-sm text-editorial-primary leading-relaxed">{children}</div>
  </div>
)

// Símbolo da Marina: casa com porta aberta, #6B2E3A sobre #F5EFE6
const SimboloMarina: React.FC = () => (
  <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 flex justify-center shadow-2xs">
    <svg
      width="120"
      height="120"
      viewBox="0 0 96 96"
      role="img"
      aria-label="Símbolo: casa com porta aberta"
    >
      <rect x="0" y="0" width="96" height="96" rx="12" fill="#F5EFE6" />
      <g fill="none" stroke="#6B2E3A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 44 V76 H68 V44" />
        <path d="M22 46 L48 24 L74 46" />
        <rect
          x="42"
          y="54"
          width="11"
          height="22"
          strokeWidth="2.5"
          transform="rotate(-18 42 76)"
        />
      </g>
    </svg>
  </div>
)

// Logo da Marina: casa aberta à esquerda, nome e assinatura
const LogoMarina: React.FC = () => (
  <div className="space-y-3">
    <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 flex items-center justify-center gap-3 shadow-2xs">
      <svg width="56" height="56" viewBox="0 0 96 96" aria-hidden="true" className="shrink-0">
        <g
          fill="none"
          stroke="#6B2E3A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M28 44 V76 H68 V44" />
          <path d="M22 46 L48 24 L74 46" />
          <rect
            x="42"
            y="54"
            width="11"
            height="22"
            strokeWidth="3.5"
            transform="rotate(-18 42 76)"
          />
        </g>
      </svg>
      <div className="min-w-0">
        <p
          className="text-xl sm:text-2xl leading-tight"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", color: '#2E2A28' }}
        >
          Marina Alves
        </p>
        <p
          className="text-[11px] sm:text-xs mt-0.5"
          style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#6B2E3A' }}
        >
          Psicóloga · Psicanálise
        </p>
      </div>
    </div>
    <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 flex items-center justify-center shadow-2xs">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ border: '2.5px solid #6B2E3A', backgroundColor: '#F5EFE6' }}
        aria-label="Versão ícone: casa aberta num círculo"
      >
        <svg width="30" height="30" viewBox="0 0 96 96" aria-hidden="true">
          <g
            fill="none"
            stroke="#6B2E3A"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M28 44 V76 H68 V44" />
            <path d="M22 46 L48 24 L74 46" />
            <rect
              x="42"
              y="54"
              width="11"
              height="22"
              strokeWidth="4.5"
              transform="rotate(-18 42 76)"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 6 · Exemplo completo: a marca da Marina
// ─────────────────────────────────────────────────────────────
export const Etapa6Conteudo: React.FC = () => (
  <div className="space-y-6">
    <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA6_ABERTURA}</p>

    <Bloco titulo={ETAPA6_MANIFESTO_TITULO}>{ETAPA6_MANIFESTO}</Bloco>

    <Bloco titulo={ETAPA6_PERSONALIDADE_TITULO}>{ETAPA6_PERSONALIDADE}</Bloco>

    <Bloco titulo={ETAPA6_PALETA_TITULO}>
      <div className="space-y-3">
        <AmostraPaleta paleta={PALETA_MARINA} />
        <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
          {ETAPA6_PALETA_LEITURA}
        </p>
      </div>
    </Bloco>

    <Bloco titulo={ETAPA6_FONTES_TITULO}>
      <div className="space-y-3">
        <p>{ETAPA6_FONTES}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {ETAPA6_FAMILIAS.map((f) => (
            <div
              key={f.nome}
              className="rounded-[10px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] px-4 py-3 shadow-2xs"
            >
              <p className="text-lg leading-snug truncate" style={{ fontFamily: f.css }}>
                {f.nome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Bloco>

    <Bloco titulo={ETAPA6_SIMBOLO_TITULO}>
      <div className="space-y-3">
        <SimboloMarina />
        <p>{ETAPA6_SIMBOLO}</p>
      </div>
    </Bloco>

    <Bloco titulo={ETAPA6_LOGO_TITULO}>
      <div className="space-y-3">
        <LogoMarina />
        <p>{ETAPA6_LOGO_DIRECAO}</p>
      </div>
    </Bloco>

    <Bloco titulo={ETAPA6_PVU_TITULO}>
      <AntesDepois
        tituloExemplo="Teste da PVU na prática"
        antes={
          <div className="space-y-2">
            <p className="font-medium">{ETAPA6_PVU_ANTES_LABEL}</p>
            <p>“{ETAPA6_PVU_ANTES}”</p>
            <p className="text-editorial-secondary text-xs">{ETAPA6_PVU_OBSERVACAO}</p>
          </div>
        }
        depois={
          <div className="space-y-2">
            <p className="font-medium">{ETAPA6_PVU_DEPOIS_LABEL}</p>
            <p>“{ETAPA6_PVU_DEPOIS}”</p>
            <p className="text-xs">
              <span className="font-semibold">{ETAPA6_PVU_CURTA_LABEL}</span> {ETAPA6_PVU_CURTA}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400">
              {ETAPA6_PVU_REGUA}
            </p>
          </div>
        }
      />
    </Bloco>

    <Bloco titulo={ETAPA6_ENTREGA_TITULO}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {ETAPA6_ENTREGA_CARTOES.map((cartao) => (
          <CartaoParteEntrega
            key={cartao.id}
            icone={cartao.id as 'tangivel' | 'transformacoes' | 'experiencia' | 'limites'}
            titulo={cartao.titulo}
            texto={cartao.texto}
          />
        ))}
      </div>
    </Bloco>

    <div className="rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-purple-50/80 dark:bg-purple-950/20 p-5 space-y-2">
      <p className="font-sans font-semibold text-sm text-editorial-primary">
        {ETAPA6_DECLARACAO_TITULO}
      </p>
      <p className="text-sm text-editorial-primary leading-relaxed italic">“{ETAPA6_DECLARACAO}”</p>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 7 · Checklist final e combinado da semana
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
    titulo: 'Etapas 1 e 2 · O que é uma marca e Psicologia das cores',
    itens: CHECKLIST_ETAPAS_1_2,
    estadoKey: 'etapas-1-2',
  },
  {
    titulo: 'Etapa 4 · Identidade visual: Skills 1 a 5',
    itens: CHECKLIST_ETAPA4,
    estadoKey: 'skills',
  },
  {
    titulo: 'Etapa 5 · Proposta, entrega e manual: Skills 6 a 8',
    itens: CHECKLIST_ETAPA5,
    estadoKey: 'skills',
  },
]

export const Etapa7Conteudo: React.FC<{
  checklists: Record<string, ChecklistValues>
  itensMarcados: number
  totalItens: number
  tudoMarcado: boolean
  onChange: (etapaKey: string, valores: ChecklistValues) => void
}> = ({ checklists, itensMarcados, totalItens, tudoMarcado, onChange }) => (
  <div className="space-y-6">
    {/* Barra de progresso geral da aula */}
    <div className="space-y-2">
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
            width: `${totalItens > 0 ? Math.round((itensMarcados / totalItens) * 100) : 0}%`,
          }}
        />
      </div>
    </div>

    {/* Resumo de todos os checklists das Etapas 0 a 5 */}
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
          {ETAPA7_RESUMO_TITULO}
        </p>
        <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
          {ETAPA7_RESUMO_NOTA}
        </p>
      </div>
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
        itens={CHECKLIST_COMBINADO_SEMANA}
        valores={checklists['combinado'] ?? {}}
        onChange={(v) => onChange('combinado', v)}
      />
    </div>

    {/* Frase de fechamento, com comemoração discreta */}
    {tudoMarcado && (
      <style>{`@keyframes e5-coracao { 0% { transform: scale(1) } 35% { transform: scale(1.3) } 65% { transform: scale(0.92) } 100% { transform: scale(1) } }`}</style>
    )}
    {tudoMarcado && (
      <div className="rounded-[14px] border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 p-6 text-center animate-in fade-in zoom-in-95 duration-700">
        <p className="text-base sm:text-lg font-medium text-editorial-primary leading-relaxed">
          {ETAPA7_FECHAMENTO.split('💜')[0]}
          <span
            className="inline-block"
            style={{ animation: 'e5-coracao 900ms ease-in-out 300ms both' }}
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
