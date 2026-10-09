import React, { useState, useRef, useId } from 'react'
import {
  NecessidadeItem,
  CalculoNecessidadeMetricas,
  SkigaiCalculoResultado,
  SkigaiDataModel,
} from '@/types/skigai'
import { calcularMetricasSkigai, NECESSIDADES_DEFINICOES } from '@/lib/skigaiEngine'
import { Eye, EyeOff, Sparkles, AlertCircle, Star, Compass, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SkigaiRadarProps {
  necessidades: NecessidadeItem[]
  termometro: number
  termometroAnterior?: number | null
  necessidadesAnteriores?: NecessidadeItem[] | null
  modoFoco?: 'todos' | 'recursos' | 'prioridades'
  modoApresentacao?: boolean
  mostrarAlavancaPadrao?: boolean
  tamanho?: number
  aoSelecionarEixo?: (id: number) => void
  onExportPng?: () => void
  className?: string
}

export const SkigaiRadar: React.FC<SkigaiRadarProps> = ({
  necessidades,
  termometro,
  termometroAnterior,
  necessidadesAnteriores,
  modoFoco = 'todos',
  modoApresentacao = false,
  mostrarAlavancaPadrao = false,
  tamanho = 540,
  aoSelecionarEixo,
  className = '',
}) => {
  const radarUid = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Filtros de camadas interativas
  const [exibirNutricao, setExibirNutricao] = useState(true)
  const [exibirImportancia, setExibirImportancia] = useState(true)
  const [exibirLacuna, setExibirLacuna] = useState(true)
  const [exibirAlavanca, setExibirAlavanca] = useState(mostrarAlavancaPadrao)

  // Eixo em hover / selecionado
  const [eixoSelecionado, setEixoSelecionado] = useState<number | null>(null)
  const [tabelaAberta, setTabelaAberta] = useState(false)

  // Cálculos do radar atual
  const calculo = calcularMetricasSkigai(necessidades)
  const { metricas, recursos, prioridades, cuidadoTotalGatilho } = calculo

  // Cálculos do radar anterior (se em revisão)
  const calculoAnterior = necessidadesAnteriores
    ? calcularMetricasSkigai(necessidadesAnteriores)
    : null

  // Geometria do Radar (7 eixos)
  const center = tamanho / 2
  const maxR = tamanho * 0.36 // raio máximo do anel 3

  /**
   * Fórmula prescritiva do PRD:
   * r(v) = R * (0.06 + 0.94 * v / 3)
   * (o valor 0 não colapsa no centro matemático, fica no raio mínimo de 6%)
   */
  const getRadius = (valor: number): number => {
    const v = Math.max(0, Math.min(3, valor))
    return maxR * (0.06 + 0.94 * (v / 3))
  }

  /**
   * Ângulo do eixo k (0 a 6):
   * θk = -90° + k * (360° / 7)
   */
  const getCoordinates = (index: number, valor: number) => {
    const angleDeg = -90 + index * (360 / 7)
    const angleRad = (angleDeg * Math.PI) / 180
    const r = getRadius(valor)
    const x = center + r * Math.cos(angleRad)
    const y = center + r * Math.sin(angleRad)
    return { x, y, angleDeg, angleRad }
  }

  // Gera pontos para polígono SVG
  const generatePolygonPoints = (valores: number[]) => {
    return valores
      .map((val, idx) => {
        const { x, y } = getCoordinates(idx, val)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }

  // Polígonos
  const nutricaoPontos = generatePolygonPoints(metricas.map((m) => m.nutricao))
  const importanciaPontos = generatePolygonPoints(metricas.map((m) => m.importancia))
  const alavancaPontos = generatePolygonPoints(metricas.map((m) => m.alavanca))
  const anteriorPontos = calculoAnterior
    ? generatePolygonPoints(calculoAnterior.metricas.map((m) => m.nutricao))
    : ''

  // Pontos de Lacuna (onde Importância > Nutrição, preenchimento com hachura)
  // Constrói caminhos fatiados eixo a eixo para hachura da lacuna
  const lacunaPaths = metricas.map((m, idx) => {
    if (m.importancia <= m.nutricao) return null
    const nextIdx = (idx + 1) % 7
    const p1 = getCoordinates(idx, m.nutricao)
    const p2 = getCoordinates(idx, m.importancia)
    const nextNutri = metricas[nextIdx].nutricao
    const nextImp = metricas[nextIdx].importancia
    const p3 = getCoordinates(nextIdx, nextImp)
    const p4 = getCoordinates(nextIdx, nextNutri)
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`
  })

  // Eixos destacados pelo modo de foco
  const isEixoDestacado = (id: number): boolean => {
    if (modoFoco === 'todos') return true
    if (modoFoco === 'recursos') return recursos.some((r) => r.id === id)
    if (modoFoco === 'prioridades') return prioridades.some((p) => p.id === id)
    return true
  }

  // Descrição detalhada para acessibilidade (Screen Readers)
  const maiorNutri = [...metricas].sort((a, b) => b.nutricao - a.nutricao)[0]
  const maiorLacuna = [...metricas].sort((a, b) => b.lacuna - a.lacuna)[0]
  const ariaDescricao = `Radar das 7 necessidades de ikigai-kan. Maior nutrição: ${maiorNutri?.nome} (${maiorNutri?.nutricao}). Maior lacuna: ${maiorLacuna?.nome} (lacuna ${maiorLacuna?.lacuna}). Termômetro do trabalho: ${termometro} de 10.`

  const detalheAtivo =
    eixoSelecionado !== null ? metricas.find((m) => m.id === eixoSelecionado) : null

  return (
    <div className={`skigai-radar-container flex flex-col items-center w-full ${className}`}>
      {/* Controles de Camadas Interativas */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3 text-xs font-mono">
        <button
          type="button"
          onClick={() => setExibirNutricao((prev) => !prev)}
          className={`px-2.5 py-1 rounded-[6px] border transition-all flex items-center gap-1.5 cursor-pointer ${
            exibirNutricao
              ? 'bg-[#F28A2E]/15 border-[#F28A2E] text-[#F28A2E] dark:text-[#FFB866] font-semibold'
              : 'opacity-50 border-border text-muted-foreground'
          }`}
          aria-pressed={exibirNutricao}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#F28A2E]" />
          <span>Nutrição (N)</span>
        </button>

        <button
          type="button"
          onClick={() => setExibirImportancia((prev) => !prev)}
          className={`px-2.5 py-1 rounded-[6px] border transition-all flex items-center gap-1.5 cursor-pointer ${
            exibirImportancia
              ? 'bg-[#6D28D9]/15 border-[#6D28D9] text-[#6D28D9] dark:text-[#A78BFA] font-semibold'
              : 'opacity-50 border-border text-muted-foreground'
          }`}
          aria-pressed={exibirImportancia}
        >
          <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#6D28D9]" />
          <span>Importância (I)</span>
        </button>

        <button
          type="button"
          onClick={() => setExibirLacuna((prev) => !prev)}
          className={`px-2.5 py-1 rounded-[6px] border transition-all flex items-center gap-1.5 cursor-pointer ${
            exibirLacuna
              ? 'bg-[#8E3B73]/15 border-[#8E3B73] text-[#8E3B73] dark:text-[#E08BC0] font-semibold'
              : 'opacity-50 border-border text-muted-foreground'
          }`}
          aria-pressed={exibirLacuna}
        >
          <span className="w-2.5 h-2.5 rounded-xs bg-[#8E3B73] opacity-60" />
          <span>Lacunas (I &gt; N)</span>
        </button>

        <button
          type="button"
          onClick={() => setExibirAlavanca((prev) => !prev)}
          className={`px-2.5 py-1 rounded-[6px] border transition-all flex items-center gap-1.5 cursor-pointer ${
            exibirAlavanca
              ? 'bg-[#0EA5A5]/15 border-[#0EA5A5] text-[#0EA5A5] dark:text-[#2DD4D4] font-semibold'
              : 'opacity-50 border-border text-muted-foreground'
          }`}
          aria-pressed={exibirAlavanca}
        >
          <span className="w-2.5 h-2.5 rounded-full border border-[#0EA5A5]" />
          <span>Ver Alavanca</span>
        </button>
      </div>

      {/* SVG Central do Radar */}
      <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${tamanho} ${tamanho}`}
          className="w-full h-full select-none"
          role="img"
          aria-label="Radar das 7 necessidades de ikigai-kan"
          aria-describedby={`desc-${radarUid}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEixoSelecionado(null)
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault()
              setEixoSelecionado((prev) => (prev === null ? 1 : prev === 7 ? 1 : prev + 1))
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault()
              setEixoSelecionado((prev) => (prev === null ? 7 : prev === 1 ? 7 : prev - 1))
            }
          }}
        >
          <desc id={`desc-${radarUid}`}>{ariaDescricao}</desc>

          <defs>
            {/* Gradiente Nutrição */}
            <linearGradient id={`grad-nutri-${radarUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F28A2E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFB866" stopOpacity="0.55" />
            </linearGradient>

            {/* Padrão de Hachura Diagonal para Lacuna */}
            <pattern
              id={`hatch-lacuna-${radarUid}`}
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#8E3B73"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
            </pattern>

            {/* Filtro Glow Suave para Recursos */}
            <filter id={`glow-star-${radarUid}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* CAMADA 1: Grade Circular e Eixos */}
          <g className="radar-grid" stroke="currentColor" strokeOpacity="0.15">
            {[1, 2, 3].map((lvl) => {
              const r = getRadius(lvl)
              return (
                <g key={`ring-${lvl}`}>
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    strokeWidth={lvl === 3 ? '1.5' : '1'}
                    strokeDasharray={lvl < 3 ? '3 3' : undefined}
                  />
                  {/* Rótulo numérico no eixo superior (id 1, topo) */}
                  <text
                    x={center + 6}
                    y={center - r + 11}
                    className="text-[10px] font-mono fill-muted-foreground font-semibold"
                  >
                    {lvl}
                  </text>
                </g>
              )
            })}

            {/* Linhas radiais dos 7 eixos */}
            {NECESSIDADES_DEFINICOES.map((_, idx) => {
              const { x, y } = getCoordinates(idx, 3)
              return (
                <line
                  key={`axis-${idx}`}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  strokeWidth="1"
                  strokeOpacity="0.25"
                />
              )
            })}
          </g>

          {/* CAMADA 9 (Revisão): Fantasma Antes (tracejado cinza) */}
          {calculoAnterior && anteriorPontos && (
            <g className="radar-ghost-before">
              <polygon
                points={anteriorPontos}
                fill="none"
                stroke="#A1A1AA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.75"
              />
            </g>
          )}

          {/* CAMADA 2: Importância (Violeta tracejado com preenchimento leve 8%) */}
          {exibirImportancia && (
            <g className="radar-importance transition-all duration-300">
              <polygon
                points={importanciaPontos}
                fill="#6D28D9"
                fillOpacity="0.08"
                stroke="#6D28D9"
                strokeWidth="1.75"
                strokeDasharray="5 4"
              />
            </g>
          )}

          {/* CAMADA 4: Lacunas (Hachura diagonal onde I > N) */}
          {exibirLacuna && (
            <g className="radar-lacunas">
              {lacunaPaths.map((p, i) =>
                p ? (
                  <path
                    key={`lacuna-path-${i}`}
                    d={p}
                    fill={`url(#hatch-lacuna-${radarUid})`}
                    stroke="#8E3B73"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                  />
                ) : null,
              )}
            </g>
          )}

          {/* CAMADA 3: Nutrição (Gradiente Laranja com contorno 2.5px) */}
          {exibirNutricao && (
            <g className="radar-nutrition transition-all duration-500">
              <polygon
                points={nutricaoPontos}
                fill={`url(#grad-nutri-${radarUid})`}
                stroke="#F28A2E"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* CAMADA 8: Alavanca (Turquesa #0EA5A5 fino opcional) */}
          {exibirAlavanca && (
            <g className="radar-alavanca">
              <polygon
                points={alavancaPontos}
                fill="none"
                stroke="#0EA5A5"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* CAMADA 5: Pontos 6px e Selos de Recursos / Prioridades */}
          {metricas.map((m, idx) => {
            const isRecurso = recursos.some((r) => r.id === m.id)
            const isPrioridade = prioridades.some((p) => p.id === m.id)
            const destacada = isEixoDestacado(m.id)

            const ptNutri = getCoordinates(idx, m.nutricao)
            const ptImp = getCoordinates(idx, m.importancia)
            const ptExt = getCoordinates(idx, 3.45) // Posição do rótulo exterior

            const isSelected = eixoSelecionado === m.id

            return (
              <g
                key={`points-axis-${m.id}`}
                className={`cursor-pointer transition-opacity ${destacada ? 'opacity-100' : 'opacity-20'}`}
                onClick={() => {
                  setEixoSelecionado(isSelected ? null : m.id)
                  aoSelecionarEixo?.(m.id)
                }}
              >
                {/* Ponto Importância (vazado) */}
                {exibirImportancia && (
                  <circle
                    cx={ptImp.x}
                    cy={ptImp.y}
                    r="4"
                    fill="var(--background, #fff)"
                    stroke="#6D28D9"
                    strokeWidth="2"
                  />
                )}

                {/* Ponto Nutrição (preenchido) */}
                {exibirNutricao && (
                  <circle
                    cx={ptNutri.x}
                    cy={ptNutri.y}
                    r="5"
                    fill="#F28A2E"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                )}

                {/* CAMADA 6: Selo de Recurso (Estrela Dourada com halo suave) */}
                {isRecurso && (
                  <g
                    transform={`translate(${ptNutri.x - 9}, ${ptNutri.y - 9})`}
                    filter={`url(#glow-star-${radarUid})`}
                  >
                    <path
                      d="M 9 1 L 11.5 6.5 L 17 7.5 L 13 11.5 L 14 17 L 9 14 L 4 17 L 5 11.5 L 1 7.5 L 6.5 6.5 Z"
                      fill="#D4A017"
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {/* CAMADA 7: Selo de Prioridade no Rótulo Externo (Anel com lacuna) */}
                {isPrioridade && (
                  <circle
                    cx={ptExt.x}
                    cy={ptExt.y}
                    r="19"
                    fill="none"
                    stroke="#8E3B73"
                    strokeWidth="1.75"
                    className="animate-pulse"
                  />
                )}

                {/* Rótulo Externo do Eixo com Número e Nome em 2 linhas */}
                <g transform={`translate(${ptExt.x}, ${ptExt.y})`}>
                  <circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill={isSelected ? '#7c3aed' : 'currentColor'}
                    fillOpacity={isSelected ? 1 : 0.08}
                    stroke={isSelected ? '#FFFFFF' : 'none'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    className={`text-[11px] font-mono font-bold ${
                      isSelected ? 'fill-white' : 'fill-foreground'
                    }`}
                  >
                    {m.id}
                  </text>
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    className="text-[10px] font-sans fill-foreground font-medium"
                  >
                    {m.abreviacao}
                  </text>
                </g>
              </g>
            )
          })}

          {/* CENTRO: Aro com o termômetro 0 a 10 e rótulo */}
          <g className="radar-center-hub">
            <circle
              cx={center}
              cy={center}
              r={getRadius(0) * 0.9}
              fill="var(--background, #fff)"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1.5"
            />
            <text
              x={center}
              y={center + 5}
              textAnchor="middle"
              className="text-2xl font-serif-editorial font-bold fill-foreground"
            >
              {termometroAnterior !== undefined && termometroAnterior !== null
                ? `${termometroAnterior} → ${termometro}`
                : termometro}
            </text>
            <text
              x={center}
              y={center + 18}
              textAnchor="middle"
              className="text-[7.5px] font-mono uppercase tracking-wider fill-muted-foreground"
            >
              o seu trabalho hoje
            </text>
          </g>
        </svg>
      </div>

      {/* Painel Inferior de Detalhe do Eixo Selecionado */}
      {detalheAtivo && (
        <div className="w-full max-w-lg mt-4 p-4 rounded-[14px] border border-border bg-card shadow-sm animate-fade-in relative">
          <button
            type="button"
            onClick={() => setEixoSelecionado(null)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1"
            aria-label="Fechar detalhe do eixo"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs flex items-center justify-center font-bold">
              {detalheAtivo.id}
            </span>
            <h4 className="font-serif-editorial text-lg font-medium text-foreground">
              {detalheAtivo.nome}
            </h4>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs font-mono">
            <div className="p-2 rounded-[8px] bg-muted/40">
              <span className="text-muted-foreground text-[10px] block">Nutrição (N)</span>
              <span className="text-base font-bold text-[#F28A2E]">{detalheAtivo.nutricao}</span>
            </div>
            <div className="p-2 rounded-[8px] bg-muted/40">
              <span className="text-muted-foreground text-[10px] block">Importância (I)</span>
              <span className="text-base font-bold text-[#6D28D9] dark:text-[#A78BFA]">
                {detalheAtivo.importancia}
              </span>
            </div>
            <div className="p-2 rounded-[8px] bg-muted/40">
              <span className="text-muted-foreground text-[10px] block">Lacuna</span>
              <span className="text-base font-bold text-[#8E3B73] dark:text-[#E08BC0]">
                {detalheAtivo.lacuna}
              </span>
            </div>
            <div className="p-2 rounded-[8px] bg-muted/40">
              <span className="text-muted-foreground text-[10px] block">Alavanca</span>
              <span className="text-base font-bold text-[#0EA5A5]">{detalheAtivo.alavanca}</span>
            </div>
          </div>

          {!modoApresentacao && detalheAtivo.reflexao && (
            <div className="mt-3 pt-3 border-t border-border/70 text-xs text-muted-foreground italic">
              &quot;{detalheAtivo.reflexao}&quot;
            </div>
          )}
        </div>
      )}

      {/* Acessibilidade: Tabela Equivalente Colapsável (aberta ou acessível a leitor de tela) */}
      <div className="w-full max-w-2xl mt-4">
        <button
          type="button"
          onClick={() => setTabelaAberta((prev) => !prev)}
          className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-1"
          aria-expanded={tabelaAberta}
        >
          <span>
            {tabelaAberta
              ? 'Ocultar tabela de dados do radar'
              : 'Ver tabela de dados acessível do radar'}
          </span>
        </button>

        {tabelaAberta && (
          <div className="overflow-x-auto mt-2 border border-border rounded-[10px] bg-card text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 font-mono text-[11px] text-muted-foreground">
                  <th className="p-2">#</th>
                  <th className="p-2">Necessidade</th>
                  <th className="p-2">Nutrição (N)</th>
                  <th className="p-2">Importância (I)</th>
                  <th className="p-2">Lacuna</th>
                  <th className="p-2">Alavanca</th>
                  <th className="p-2">Força</th>
                  <th className="p-2">Faixa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {metricas.map((m) => (
                  <tr key={`tab-row-${m.id}`} className="hover:bg-muted/20">
                    <td className="p-2 font-mono font-bold">{m.id}</td>
                    <td className="p-2 font-medium">{m.nome}</td>
                    <td className="p-2 font-mono">{m.nutricao}</td>
                    <td className="p-2 font-mono">{m.importancia}</td>
                    <td className="p-2 font-mono">{m.lacuna}</td>
                    <td className="p-2 font-mono">{m.alavanca}</td>
                    <td className="p-2 font-mono">{m.forca}</td>
                    <td className="p-2 capitalize font-mono text-[10px]">{m.faixaLacuna}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
