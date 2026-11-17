import React from 'react'
import {
  ETAPA5_ABERTURA_TITULO,
  ETAPA5_ABERTURA,
  TESTES_PVU,
  ETAPA5_DICA_PVU,
  ETAPA5_ENTREGA_TITULO,
  ETAPA5_ENTREGA_INTRO,
  PARTES_ENTREGA,
  ETAPA5_ETICA_ENTREGA,
  ETAPA5_SALVAR_TITULO,
  ETAPA5_SALVAR_INTRO,
  PASSOS_ETAPA5_SALVAR,
  ETAPA5_TESTE_VOZ_TITULO,
  ETAPA5_TESTE_VOZ,
  CHECKLIST_ETAPA5,
  SKILLS_ENCONTRO_5,
  TRAVOU_ETAPA5,
} from '@/config/encontro5Content'
import {
  StepCard,
  Checklist,
  Callout,
  StuckBox,
  type ChecklistValues,
} from '@/components/guia/encontro4Shared'
import { CartaoSkill, FluxoSkills } from '@/components/guia/encontro5Elements'

// ─────────────────────────────────────────────────────────────
// Etapa 5 · Proposta, entrega e manual: Skills 6 a 8.
// Conteúdo verbatim da Tati; zero travessões; mesmo padrão da
// Etapa 4 (CartaoSkill com CopyPromptBox, Callout, StepCard,
// Checklist).
// ─────────────────────────────────────────────────────────────

// Cartão de teste da PVU (com check)
const CartaoTestePvu: React.FC<{ texto: string }> = ({ texto }) => (
  <div className="rounded-[12px] border border-purple-200/90 dark:border-[#3f3f46] bg-purple-50/60 dark:bg-[#121216] p-4 flex items-start gap-3 shadow-2xs">
    <span
      className="w-6 h-6 rounded-full bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] flex items-center justify-center shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
    <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed font-medium">{texto}</p>
  </div>
)

// Cartão de uma parte da entrega (com ícone simples)
const CartaoParteEntrega: React.FC<{
  icone: 'tangivel' | 'transformacoes' | 'experiencia' | 'limites'
  titulo: string
  texto: string
}> = ({ icone, titulo, texto }) => {
  const iconeSvg: Record<string, React.ReactNode> = {
    tangivel: (
      <g>
        <rect
          x="4"
          y="6"
          width="14"
          height="12"
          rx="2"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.8"
        />
        <path d="M8 10h6M8 13h4" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    ),
    transformacoes: (
      <path
        d="M13 3 6 13h5l-1 8 7-10h-5l1-8Z"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
    experiencia: (
      <path
        d="M4 13h4l2-5 3 10 2-5h5"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    limites: (
      <g>
        <circle cx="11" cy="11" r="7" fill="none" stroke="#7c3aed" strokeWidth="1.8" />
        <path d="m16 16 4 4" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 11h6" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    ),
  }
  return (
    <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 space-y-2 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <svg width="26" height="26" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
          {iconeSvg[icone]}
        </svg>
        <p className="font-sans font-semibold text-sm text-editorial-primary">{titulo}</p>
      </div>
      <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">{texto}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Etapa 5 · Proposta, entrega e manual: Skills 6 a 8
// ─────────────────────────────────────────────────────────────
export const Etapa5Conteudo: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => (
  <div className="space-y-6">
    <FluxoSkills
      feitas={valores}
      onSelect={(skillId) => {
        document.getElementById(skillId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
    />

    {/* Bloco de abertura · Refinar a PVU */}
    <div className="space-y-3">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        {ETAPA5_ABERTURA_TITULO}
      </p>
      <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA5_ABERTURA}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {TESTES_PVU.map((teste) => (
          <CartaoTestePvu key={teste.id} texto={teste.texto} />
        ))}
      </div>
    </div>

    <Callout tipo="dica">{ETAPA5_DICA_PVU}</Callout>

    {/* Bloco · O que a sua solução entrega */}
    <div className="space-y-3">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        {ETAPA5_ENTREGA_TITULO}
      </p>
      <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA5_ENTREGA_INTRO}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {PARTES_ENTREGA.map((parte) => (
          <CartaoParteEntrega
            key={parte.id}
            icone={parte.icone}
            titulo={parte.titulo}
            texto={parte.texto}
          />
        ))}
      </div>
    </div>

    <Callout tipo="etica">{ETAPA5_ETICA_ENTREGA}</Callout>

    {/* Cartões das skills 6 a 8 */}
    <div className="space-y-4">
      {SKILLS_ENCONTRO_5.slice(5).map((skill) => (
        <CartaoSkill key={`e5-skill-${skill.numero}`} skillId={`skill-${skill.numero}`} />
      ))}
    </div>

    <StuckBox solucoes={TRAVOU_ETAPA5} />

    {/* Passos · Salvar o manual no Projeto */}
    <div className="space-y-3">
      <p className="font-sans font-semibold text-sm text-editorial-primary">
        {ETAPA5_SALVAR_TITULO}
      </p>
      <p className="text-sm text-editorial-secondary leading-relaxed">{ETAPA5_SALVAR_INTRO}</p>
      <div className="space-y-3">
        {PASSOS_ETAPA5_SALVAR.map((passo) => (
          <StepCard key={passo.numero} numero={passo.numero}>
            <p>
              {passo.partes.map((parte, i) =>
                parte.negrito ? (
                  <strong key={i} className="font-semibold">
                    {parte.texto}
                  </strong>
                ) : (
                  <React.Fragment key={i}>{parte.texto}</React.Fragment>
                ),
              )}
            </p>
          </StepCard>
        ))}
      </div>
    </div>

    {/* Bloco · Teste da PVU em voz alta */}
    <div className="space-y-2">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        {ETAPA5_TESTE_VOZ_TITULO}
      </p>
      <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA5_TESTE_VOZ}</p>
    </div>

    {/* Checklist da Etapa 5 */}
    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#18181B]">
      <p className="font-sans font-semibold text-sm text-editorial-primary">Checklist da Etapa 5</p>
      <Checklist itens={CHECKLIST_ETAPA5} valores={valores} onChange={onChange} />
    </div>
  </div>
)
