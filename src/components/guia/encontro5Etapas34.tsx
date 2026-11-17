import React from 'react'
import {
  ETAPA3_ABERTURA,
  PASSOS_ETAPA3,
  ETAPA3_DICA,
  ETAPA3_ETICA,
  TRAVOU_ETAPA3,
  ETAPA4_ABERTURA,
  LINK_COOLORS_URL,
  LINK_COOLORS_TEXTO,
  LINK_GOOGLE_FONTS_URL,
  LINK_GOOGLE_FONTS_TEXTO,
  ETAPA4_ATENCAO,
  CHECKLIST_ETAPA4,
  SKILLS_ENCONTRO_5,
} from '@/config/encontro5Content'
import {
  StepCard,
  Checklist,
  Callout,
  StuckBox,
  LinkButton,
  type ChecklistValues,
} from '@/components/guia/encontro4Shared'
import { CartaoSkill, FluxoSkills } from '@/components/guia/encontro5Elements'

// ─────────────────────────────────────────────────────────────
// Etapas 3 e 4 do Encontro 5 · Branding.
// Conteúdo verbatim da Tati; zero travessões; reaproveita os
// elementos padrão do projeto (StepCard, Callout, StuckBox,
// Checklist, LinkButton, CartaoSkill, FluxoSkills).
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Etapa 3 · Como usar as skills no seu Projeto
// ─────────────────────────────────────────────────────────────
export const Etapa3Conteudo: React.FC<{
  feitas: Record<string, boolean>
  onSelect: (skillId: string) => void
}> = ({ feitas, onSelect }) => (
  <div className="space-y-6">
    <FluxoSkills feitas={feitas} onSelect={onSelect} />

    <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA3_ABERTURA}</p>

    <div className="space-y-3">
      {PASSOS_ETAPA3.map((passo) => (
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

    <Callout tipo="dica">{ETAPA3_DICA}</Callout>

    <Callout tipo="etica">{ETAPA3_ETICA}</Callout>

    <StuckBox solucoes={TRAVOU_ETAPA3} />
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 4 · Identidade visual: Skills 1 a 5
// ─────────────────────────────────────────────────────────────
export const Etapa4Conteudo: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => (
  <div className="space-y-6">
    <p className="text-sm text-editorial-primary leading-relaxed">{ETAPA4_ABERTURA}</p>

    <div className="space-y-4">
      {SKILLS_ENCONTRO_5.slice(0, 5).map((skill) => (
        <React.Fragment key={`e5-skill-${skill.numero}`}>
          <CartaoSkill skillId={`skill-${skill.numero}`} />
          {skill.numero === 2 && (
            <div>
              <LinkButton href={LINK_COOLORS_URL}>{LINK_COOLORS_TEXTO}</LinkButton>
            </div>
          )}
          {skill.numero === 3 && (
            <div>
              <LinkButton href={LINK_GOOGLE_FONTS_URL}>{LINK_GOOGLE_FONTS_TEXTO}</LinkButton>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>

    <Callout tipo="atencao">{ETAPA4_ATENCAO}</Callout>

    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#18181B]">
      <p className="font-sans font-semibold text-sm text-editorial-primary">Checklist da Etapa 4</p>
      <Checklist itens={CHECKLIST_ETAPA4} valores={valores} onChange={onChange} />
    </div>
  </div>
)
