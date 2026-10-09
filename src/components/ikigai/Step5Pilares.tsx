import React from 'react'
import { SkigaiDataModel, PilarKenMogiItem, Escala0a3 } from '@/types/skigai'
import { PILARES_MOGI_DEFINICOES } from '@/lib/skigaiEngine'
import { ArrowRight, ArrowLeft, HeartHandshake, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Step5PilaresProps {
  model: SkigaiDataModel
  onAtualizar: (novosDados: Partial<SkigaiDataModel>) => void
  onAvancar: () => void
  onVoltar: () => void
  onDispararRisco: () => void
}

export const Step5Pilares: React.FC<Step5PilaresProps> = ({
  model,
  onAtualizar,
  onAvancar,
  onVoltar,
  onDispararRisco,
}) => {
  const pilares = model.pilares || []

  const atualizarPilar = (id: number, campo: Partial<PilarKenMogiItem>) => {
    const atualizados = pilares.map((p) => (p.id === id ? { ...p, ...campo } : p))
    onAtualizar({ pilares: atualizados })
  }

  // Se no pilar 4 (id 4, Alegria nas pequenas coisas) presenca for 0 e ela registrar que nada traz alegria, pode disparar protocolo
  const checarRiscoAlegria = (presenca: number) => {
    if (presenca === 0) {
      // Pergunta gentilmente se quer pausar para acolhimento
    }
  }

  // Mini-radar SVG dos 5 pilares
  const center = 120
  const maxR = 85
  const getPilCoord = (idx: number, valor: number) => {
    const angleDeg = -90 + idx * (360 / 5)
    const angleRad = (angleDeg * Math.PI) / 180
    const r = maxR * (0.1 + 0.9 * (valor / 3))
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    }
  }

  const pontosMiniRadar = pilares
    .map((p, idx) => {
      const { x, y } = getPilCoord(idx, p.presenca || 0)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const rotulosPresenca = ['Ausente (0)', 'Rara (1)', 'Frequente (2)', 'Constante (3)']

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left animate-fade-in">
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
          Fase 5 de 8 · Os Cinco Pilares de Ken Mogi
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-foreground">
          A sustentação nos pequenos detalhes
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O neurocientista Ken Mogi identificou cinco pilares práticos que nutrem o sentimento de
          ikigai no cotidiano. Avalie a presença de cada um na sua rotina profissional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista dos 5 Pilares */}
        <div className="lg:col-span-8 space-y-4">
          {PILARES_MOGI_DEFINICOES.map((def, idx) => {
            const pilarAtual = pilares.find((p) => p.id === def.id) || {
              id: def.id,
              nome: def.nome,
              pergunta: def.pergunta,
              presenca: 0,
              nota: '',
            }

            return (
              <div
                key={`pilar-${def.id}`}
                className="p-5 rounded-[16px] border border-border bg-card space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs flex items-center justify-center font-bold">
                    0{def.id}
                  </span>
                  <h3 className="font-serif-editorial text-lg font-medium text-foreground">
                    {def.nome}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{def.pergunta}</p>

                {/* Seletor de Presença 0 a 3 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[0, 1, 2, 3].map((val) => (
                    <button
                      key={`pres-${val}`}
                      type="button"
                      onClick={() => {
                        atualizarPilar(def.id, { presenca: val as Escala0a3 })
                        if (def.id === 4 && val === 0) {
                          onDispararRisco()
                        }
                      }}
                      className={`p-2 rounded-[8px] text-xs font-mono text-center transition-all ${
                        pilarAtual.presenca === val
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {rotulosPresenca[val]}
                    </button>
                  ))}
                </div>

                {/* Nota de uma linha */}
                <Input
                  type="text"
                  placeholder="Nota breve de reflexão (uma linha)..."
                  value={pilarAtual.nota}
                  onChange={(e) => atualizarPilar(def.id, { nota: e.target.value })}
                  className="text-xs font-mono h-9"
                />
              </div>
            )
          })}
        </div>

        {/* Mini-Radar dos 5 Pilares */}
        <div className="lg:col-span-4 p-5 rounded-[16px] border border-border bg-card flex flex-col items-center text-center space-y-3 sticky top-4">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Mini-Radar dos 5 Pilares
          </span>

          <svg width="240" height="240" viewBox="0 0 240 240" className="select-none">
            {/* Grade dos 5 eixos */}
            {[1, 2, 3].map((lvl) => (
              <circle
                key={`pil-ring-${lvl}`}
                cx={center}
                cy={center}
                r={maxR * (0.1 + 0.9 * (lvl / 3))}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.15"
                strokeDasharray="2 2"
              />
            ))}

            {PILARES_MOGI_DEFINICOES.map((_, i) => {
              const { x, y } = getPilCoord(i, 3)
              return (
                <line
                  key={`pil-axis-${i}`}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.2"
                />
              )
            })}

            {/* Polígono preenchido */}
            <polygon
              points={pontosMiniRadar}
              fill="#0EA5A5"
              fillOpacity="0.25"
              stroke="#0EA5A5"
              strokeWidth="2"
            />

            {/* Pontos nos vértices */}
            {pilares.map((p, i) => {
              const { x, y } = getPilCoord(i, p.presenca || 0)
              return <circle key={`pil-pt-${i}`} cx={x} cy={y} r="4" fill="#0EA5A5" />
            })}
          </svg>

          <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
            Turquesa representa o alinhamento dos seus hábitos cotidianos aos pilares de
            sustentação.
          </p>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onVoltar}
          className="text-xs font-mono gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à leitura</span>
        </Button>

        <Button
          type="button"
          onClick={onAvancar}
          className="min-h-[44px] px-6 text-xs font-mono font-semibold rounded-[8px] bg-primary text-primary-foreground gap-1.5"
        >
          <span>Avançar para o Redesenho do Trabalho</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
