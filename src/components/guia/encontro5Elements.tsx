import React from 'react'
import {
  SKILLS_ENCONTRO_5,
  CONVERSA_IDENTIDADE,
  CONVERSA_PROPOSTA,
  CORES_RODA,
  type CorRodaDef,
  type CorPaletaDef,
} from '@/config/encontro5Content'
import { CopyPromptBox } from '@/components/guia/encontro4Shared'

// ─────────────────────────────────────────────────────────────
// Cartão de skill: número grande, nome, o que entrega, rótulo
// da conversa e a caixa de prompt logo abaixo.
// ─────────────────────────────────────────────────────────────
export const CartaoSkill: React.FC<{ skillId: string }> = ({ skillId }) => {
  const skill = SKILLS_ENCONTRO_5.find((s) => `skill-${s.numero}` === skillId)
  if (!skill) return null
  return (
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
          <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
            {skill.entrega}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300 font-semibold">
            Conversa: {skill.conversa.nome}
          </p>
        </div>
      </div>
      <CopyPromptBox titulo="Prompt da skill" prompt={skill.prompt} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Fluxo das skills: 8 círculos numerados ligados por linha.
// Grupos: 1 a 5 (identidade), 6 e 7 (proposta), 8 (volta).
// Círculo preenchido quando a skill está marcada no checklist.
// ─────────────────────────────────────────────────────────────
interface FluxoSkillsProps {
  feitas: Record<string, boolean>
  onSelect: (skillId: string) => void
}

export const FluxoSkills: React.FC<FluxoSkillsProps> = ({ feitas, onSelect }) => {
  const grupos: { rotulo: string; skills: typeof SKILLS_ENCONTRO_5 }[] = [
    { rotulo: 'Conversa: Minha identidade visual', skills: SKILLS_ENCONTRO_5.slice(0, 5) },
    { rotulo: 'Conversa: Minha proposta e entrega', skills: SKILLS_ENCONTRO_5.slice(5, 7) },
    { rotulo: 'Volta para Minha identidade visual', skills: SKILLS_ENCONTRO_5.slice(7, 8) },
  ]

  return (
    <div className="rounded-[14px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-4 shadow-2xs overflow-x-hidden">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        Fluxo das skills
      </p>
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
        {grupos.map((grupo, gi) => (
          <React.Fragment key={grupo.rotulo}>
            {gi > 0 && (
              <span
                aria-hidden="true"
                className="hidden sm:block self-center w-6 border-t-2 border-dashed border-slate-300 dark:border-[#3f3f46]"
              />
            )}
            <div className="min-w-0 space-y-2">
              <div className="flex items-center">
                {grupo.skills.map((skill, si) => {
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
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-editorial-secondary max-w-[180px] leading-snug">
                {grupo.rotulo}
              </p>
            </div>
          </React.Fragment>
        ))}
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
}

// ─────────────────────────────────────────────────────────────
// Roda das cores interativa: 8 fatias em SVG. Tocar numa fatia
// mostra o cartão com nome, associações e leitura na psicologia.
// ─────────────────────────────────────────────────────────────
export const RodaCores: React.FC = () => {
  const [selecionada, setSelecionada] = React.useState<CorRodaDef | null>(null)
  const uid = React.useId().replace(/[:]/g, '')
  const cx = 110
  const cy = 110
  const r = 100

  // 8 fatias de 45 graus, começando no topo (−90°)
  const fatias = CORES_RODA.map((cor, i) => {
    const a0 = ((-90 + i * 45) * Math.PI) / 180
    const a1 = ((-90 + (i + 1) * 45) * Math.PI) / 180
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy + r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    const am = ((-90 + i * 45 + 22.5) * Math.PI) / 180
    const xm = cx + r * 0.68 * Math.cos(am)
    const ym = cy + r * 0.68 * Math.sin(am)
    return { cor, path: `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`, xm, ym }
  })

  return (
    <div className="rounded-[14px] border border-purple-200/90 dark:border-[#3f3f46] bg-white dark:bg-[#121216] p-4 sm:p-5 space-y-4 shadow-2xs">
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        Roda das cores · toque numa fatia
      </p>
      <div className="mx-auto w-full max-w-[240px]">
        <svg
          viewBox="0 0 220 220"
          className="w-full h-auto block"
          role="group"
          aria-label="Roda das cores com oito fatias"
        >
          {fatias.map(({ cor, path, xm, ym }) => (
            <g key={cor.id}>
              <path
                id={`${uid}-${cor.id}`}
                d={path}
                fill={cor.fill}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="cursor-pointer transition-opacity hover:opacity-85"
                onClick={() => setSelecionada(cor)}
              >
                <title>{cor.nome}</title>
              </path>
              <text
                x={xm}
                y={ym}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
                fill={cor.texto}
                className="pointer-events-none select-none"
              >
                {cor.nome.charAt(0)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {selecionada && (
        <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#0c0914] p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full border border-slate-300 dark:border-[#3f3f46] shrink-0"
              style={{ backgroundColor: selecionada.fill }}
              aria-hidden="true"
            />
            <p className="font-sans font-semibold text-sm text-editorial-primary">
              {selecionada.nome}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-editorial-primary leading-relaxed">
            <span className="font-semibold">Associações:</span> {selecionada.associacoes}
          </p>
          <p className="text-xs sm:text-sm text-editorial-secondary leading-relaxed">
            <span className="font-semibold text-editorial-primary">Numa marca de psicologia:</span>{' '}
            {selecionada.leituraPsicologia}
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Amostra de paleta: 5 quadrados com nome, HEX e função.
// Tocar no código copia e mostra "Copiado ✓".
// ─────────────────────────────────────────────────────────────
const QuadradoPaleta: React.FC<{ cor: CorPaletaDef }> = ({ cor }) => {
  const [copiado, setCopiado] = React.useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(cor.hex)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sem clipboard: o código continua visível para copiar à mão.
    }
  }
  return (
    <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#121216] overflow-hidden shadow-2xs">
      <div
        className="h-14 border-b border-slate-200 dark:border-[#27272A]"
        style={{ backgroundColor: cor.hex }}
        aria-hidden="true"
      />
      <div className="p-3 space-y-1">
        <p className="font-sans font-semibold text-xs text-editorial-primary">{cor.nome}</p>
        <button
          type="button"
          onClick={copiar}
          className="font-mono text-xs font-bold text-[#7c3aed] dark:text-[#C084FC] hover:underline cursor-pointer min-h-[24px]"
        >
          {copiado ? 'Copiado ✓' : cor.hex}
        </button>
        <p className="text-[10px] font-mono text-editorial-secondary">{cor.funcao}</p>
      </div>
    </div>
  )
}

export const AmostraPaleta: React.FC<{ paleta: CorPaletaDef[] }> = ({ paleta }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    {paleta.map((cor) => (
      <QuadradoPaleta key={cor.hex} cor={cor} />
    ))}
  </div>
)

// ─────────────────────────────────────────────────────────────
// Comparativo Antes e Depois: dois cartões, empilhados no mobile.
// ─────────────────────────────────────────────────────────────
interface AntesDepoisProps {
  tituloExemplo: string
  antes: React.ReactNode
  depois: React.ReactNode
  rotuloAntes?: string
  rotuloDepois?: string
}

export const AntesDepois: React.FC<AntesDepoisProps> = ({
  tituloExemplo,
  antes,
  depois,
  rotuloAntes = 'Antes',
  rotuloDepois = 'Depois',
}) => (
  <div className="space-y-2">
    {tituloExemplo && (
      <p className="font-mono text-[10px] uppercase tracking-wider text-editorial-secondary font-semibold">
        {tituloExemplo}
      </p>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-[12px] border border-slate-200 dark:border-[#27272A] bg-slate-100 dark:bg-[#0c0914] p-4 space-y-2">
        <span className="inline-block font-mono text-[10px] uppercase tracking-wider font-semibold text-editorial-secondary">
          {rotuloAntes}
        </span>
        <div className="text-xs sm:text-sm text-editorial-primary leading-relaxed space-y-2">
          {antes}
        </div>
      </div>
      <div className="relative rounded-[12px] border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/20 p-4 space-y-2">
        <span
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            width="12"
            height="12"
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
        <span className="inline-block font-mono text-[10px] uppercase tracking-wider font-semibold text-[#7c3aed] dark:text-[#C084FC]">
          {rotuloDepois}
        </span>
        <div className="text-xs sm:text-sm text-editorial-primary leading-relaxed space-y-2">
          {depois}
        </div>
      </div>
    </div>
  </div>
)
