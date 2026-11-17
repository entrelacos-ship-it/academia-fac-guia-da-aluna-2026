import React from 'react'
import {
  ETAPA0_ABERTURA,
  CHECKLIST_ETAPA0,
  ETAPA1_BLOCO1_TITULO,
  ETAPA1_BLOCO1,
  ETAPA1_BLOCO2_TITULO,
  ETAPA1_BLOCO2,
  ETAPA1_BLOCO3_TITULO,
  ETAPA1_BLOCO3,
  ETAPA1_ATENCAO,
  PECAS_IDENTIDADE,
  ETAPA1_DICA_SIMBOLO,
  ETAPA2_ABERTURA,
  ETAPA2_BLOCO_MUDA_TITULO,
  ETAPA2_BLOCO_MUDA,
  ETAPA2_ATENCAO,
  PERGUNTAS_CORES,
  ETAPA2_DICA,
  ETAPA2_LINK_URL,
  ETAPA2_LINK_TEXTO,
  CHECKLIST_ETAPAS_1_2,
} from '@/config/encontro5Content'
import {
  Checklist,
  Callout,
  LinkButton,
  type ChecklistValues,
} from '@/components/guia/encontro4Shared'
import { RodaCores } from '@/components/guia/encontro5Elements'
import { IlustracaoIcebergMarca } from '@/components/guia/encontro5Ilustracoes'

// ─────────────────────────────────────────────────────────────
// Etapas 0, 1 e 2 do Encontro 5 · Branding.
// Conteúdo verbatim da Tati; zero travessões; reaproveita os
// elementos padrão do projeto (Callout, Checklist, LinkButton,
// RodaCores).
// ─────────────────────────────────────────────────────────────

// Bloco de leitura com título e corpo
const Bloco: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div className="space-y-2">
    <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">{titulo}</p>
    <div className="text-sm text-editorial-primary leading-relaxed">{children}</div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 0 · Antes de começar
// ─────────────────────────────────────────────────────────────
export const Etapa0Conteudo: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => (
  <div className="space-y-5">
    <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA0_ABERTURA}</p>

    <div className="space-y-3">
      <p className="font-sans font-semibold text-sm text-editorial-primary">Tenho em mãos</p>
      <Checklist itens={CHECKLIST_ETAPA0} valores={valores} onChange={onChange} />
    </div>

    <Callout tipo="dica">
      A sua Proposta de Valor Única já nasceu no seu Manifesto. Hoje a gente não começa do zero: a
      gente lapida.
    </Callout>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 1 · O que é uma marca
// ─────────────────────────────────────────────────────────────
const ICONE_PECA: Record<string, React.ReactNode> = {
  paleta: (
    <g>
      <circle cx="10" cy="10" r="4" fill="#7c3aed" opacity="0.9" />
      <circle cx="17" cy="8" r="3" fill="#ea580c" opacity="0.9" />
      <circle cx="17" cy="15" r="3" fill="#f59e0b" opacity="0.9" />
    </g>
  ),
  fontes: (
    <text
      x="13"
      y="14"
      fontSize="12"
      fontWeight="700"
      fill="#7c3aed"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      Aa
    </text>
  ),
  simbolo: (
    <g>
      <path
        d="M 13 5 L 20 17 L 6 17 Z"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="17" r="1.8" fill="#7c3aed" />
    </g>
  ),
  logo: (
    <g>
      <rect
        x="5"
        y="7"
        width="16"
        height="12"
        rx="4"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.8"
      />
      <circle cx="13" cy="13" r="2.4" fill="#7c3aed" />
    </g>
  ),
}

const CartaoPeca: React.FC<{
  icone: string
  titulo: string
  texto: string
  children?: React.ReactNode
}> = ({ icone, titulo, texto, children }) => (
  <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 space-y-2 shadow-2xs">
    <div className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="shrink-0">
        {ICONE_PECA[icone]}
      </svg>
      <p className="font-sans font-semibold text-sm text-editorial-primary">{titulo}</p>
    </div>
    <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">{texto}</p>
    {children}
  </div>
)

export const Etapa1Conteudo: React.FC = () => (
  <div className="space-y-6">
    <Bloco titulo={ETAPA1_BLOCO1_TITULO}>{ETAPA1_BLOCO1}</Bloco>

    {/* Ilustração do iceberg da marca */}
    <div className="flex justify-center">
      <IlustracaoIcebergMarca />
    </div>

    <Bloco titulo={ETAPA1_BLOCO2_TITULO}>{ETAPA1_BLOCO2}</Bloco>

    <Bloco titulo={ETAPA1_BLOCO3_TITULO}>{ETAPA1_BLOCO3}</Bloco>

    <Callout tipo="atencao">{ETAPA1_ATENCAO}</Callout>

    <Bloco titulo="As peças da identidade visual">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {PECAS_IDENTIDADE.map((peca) => (
          <CartaoPeca key={peca.id} icone={peca.icone} titulo={peca.titulo} texto={peca.texto}>
            {peca.id === 'simbolo' && <Callout tipo="dica">{ETAPA1_DICA_SIMBOLO}</Callout>}
          </CartaoPeca>
        ))}
      </div>
    </Bloco>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 2 · Psicologia das cores
// ─────────────────────────────────────────────────────────────
const CartaoPergunta: React.FC<{ numero: number; texto: string }> = ({ numero, texto }) => (
  <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 flex gap-3 items-start shadow-2xs">
    <span className="w-7 h-7 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
      {numero}
    </span>
    <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">{texto}</p>
  </div>
)

export const Etapa2Conteudo: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => (
  <div className="space-y-6">
    <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA2_ABERTURA}</p>

    <RodaCores />

    <Bloco titulo={ETAPA2_BLOCO_MUDA_TITULO}>{ETAPA2_BLOCO_MUDA}</Bloco>

    <Callout tipo="atencao">{ETAPA2_ATENCAO}</Callout>

    <Bloco titulo="As três perguntas para escolher suas cores">
      <div className="grid grid-cols-1 gap-3 pt-1">
        {PERGUNTAS_CORES.map((p) => (
          <CartaoPergunta key={p.numero} numero={p.numero} texto={p.texto} />
        ))}
      </div>
    </Bloco>

    <Callout tipo="dica">{ETAPA2_DICA}</Callout>

    <div>
      <LinkButton href={ETAPA2_LINK_URL}>{ETAPA2_LINK_TEXTO}</LinkButton>
    </div>

    {/* Checklist único das Etapas 1 e 2 */}
    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#18181B]">
      <p className="font-sans font-semibold text-sm text-editorial-primary">
        Checklist das Etapas 1 e 2
      </p>
      <Checklist itens={CHECKLIST_ETAPAS_1_2} valores={valores} onChange={onChange} />
    </div>
  </div>
)
