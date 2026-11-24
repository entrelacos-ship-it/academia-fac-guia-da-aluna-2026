import React from 'react'
import {
  ETAPA4_PASSOS,
  SKILLS_ENCONTRO_6,
  ETAPA4_CONVERSA,
  TRAVOU_ITENS,
  CHECKLIST_ETAPA4,
  type Skill6Def,
} from '@/config/encontro6Content'
import {
  StepCard,
  CopyPromptBox,
  StuckBox,
  Checklist,
  type ChecklistValues,
} from '@/components/guia/encontro4Shared'

// ─────────────────────────────────────────────────────────────
// Etapa 4 · As três skills do Encontro 6. Mesmo padrão das etapas
// de skills do Encontro 5 (CartaoSkill com CopyPromptBox, Fluxo
// das skills, StuckBox, Checklist). Visual calmo: roxo/laranja,
// sem vermelho de alerta. Zero travessões.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// CartaoSkillE6: cartão da skill com número grande, nome, frase,
// rótulo da conversa e a caixa de prompt com botão Copiar prompt.
// ─────────────────────────────────────────────────────────────
const CartaoSkillE6: React.FC<{ skill: Skill6Def }> = ({ skill }) => (
  <div
    id={`skill-${skill.numero}`}
    className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-3 shadow-2xs scroll-mt-32"
  >
    <div className="flex items-start gap-3">
      <span className="w-12 h-12 rounded-[12px] bg-[#7c3aed] dark:bg-[#C084FC] text-white dark:text-[#0A0A14] font-mono text-xl font-bold flex items-center justify-center shrink-0">
        {skill.numero}
      </span>
      <div className="min-w-0 space-y-1">
        <h4 className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
          {skill.nomeCompleto}
        </h4>
        <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">{skill.frase}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300 font-semibold">
          Conversa: {skill.conversa}
        </p>
      </div>
    </div>
    <CopyPromptBox titulo="Prompt da skill" prompt={skill.prompt} />
  </div>
)

// ─────────────────────────────────────────────────────────────
// FluxoSkillsE6: três círculos numerados (1, 2 e 3) agrupados com
// o rótulo "Conversa: Minhas crenças". Círculo preenchido quando
// o item correspondente do checklist da Etapa 4 está marcado.
// ─────────────────────────────────────────────────────────────
const FluxoSkillsE6: React.FC<{
  feitas: Record<string, boolean>
  onSelect: (skillId: string) => void
}> = ({ feitas, onSelect }) => (
  <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-4 shadow-2xs overflow-x-hidden">
    <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
      Fluxo das skills
    </p>
    <div className="space-y-2">
      <div className="flex items-center">
        {SKILLS_ENCONTRO_6.map((skill, si) => {
          const feita = Boolean(feitas[`skill-${skill.numero}`])
          return (
            <React.Fragment key={skill.numero}>
              {si > 0 && (
                <span
                  aria-hidden="true"
                  className="w-4 border-t-2 border-slate-200 dark:border-[#3f3f46]"
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(`skill-${skill.numero}`)}
                aria-label={`Ir para a Skill ${skill.numero}, ${skill.nomeCurto}`}
                className={`w-10 h-10 rounded-full font-mono text-sm font-bold flex items-center justify-center shrink-0 transition-colors cursor-pointer border-2 ${
                  feita
                    ? 'bg-[#7c3aed] border-[#7c3aed] text-white dark:bg-[#C084FC] dark:border-[#C084FC] dark:text-[#0A0A14]'
                    : 'bg-white dark:bg-[#121216] border-slate-300 dark:border-[#3f3f46] text-[#7c3aed] dark:text-[#C084FC] hover:border-[#7c3aed] dark:hover:border-[#C084FC]'
                }`}
              >
                {skill.numero}
              </button>
            </React.Fragment>
          )
        })}
      </div>
      <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-editorial-secondary max-w-[220px] leading-snug">
        {ETAPA4_CONVERSA}
      </p>
    </div>
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      <span className="text-[10px] font-mono text-editorial-secondary flex items-center gap-1.5">
        <span
          className="w-3.5 h-3.5 rounded-full bg-[#7c3aed] dark:bg-[#C084FC]"
          aria-hidden="true"
        />
        Skill feita
      </span>
      <span className="text-[10px] font-mono text-editorial-secondary flex items-center gap-1.5">
        <span
          className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-[#3f3f46]"
          aria-hidden="true"
        />
        Ainda não feita
      </span>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────
// Etapa 4 · conteúdo completo
// ─────────────────────────────────────────────────────────────
export const Etapa4ConteudoE6: React.FC<{
  valores: ChecklistValues
  onChange: (v: ChecklistValues) => void
}> = ({ valores, onChange }) => (
  <div className="space-y-6">
    <FluxoSkillsE6
      feitas={valores}
      onSelect={(skillId) => {
        document.getElementById(skillId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
    />

    {/* Passos numerados */}
    <div className="space-y-3">
      <p className="font-sans font-semibold text-sm sm:text-base text-editorial-primary">
        Passo a passo
      </p>
      <div className="space-y-3">
        {ETAPA4_PASSOS.map((passo, i) => (
          <StepCard key={i} numero={i + 1}>
            <p>{passo}</p>
          </StepCard>
        ))}
      </div>
    </div>

    {/* Cartões das skills 1 a 3 */}
    <div className="space-y-4">
      {SKILLS_ENCONTRO_6.map((skill) => (
        <CartaoSkillE6 key={`e6-skill-${skill.numero}`} skill={skill} />
      ))}
    </div>

    <StuckBox solucoes={TRAVOU_ITENS} />

    {/* Checklist da Etapa 4 */}
    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#18181B]">
      <p className="font-sans font-semibold text-sm text-editorial-primary">Checklist da Etapa 4</p>
      <Checklist itens={CHECKLIST_ETAPA4} valores={valores} onChange={onChange} />
    </div>
  </div>
)
