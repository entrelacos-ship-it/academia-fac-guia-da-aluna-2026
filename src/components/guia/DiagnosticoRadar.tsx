import React from 'react'

interface RadarChartProps {
  fundacao: number // 0 a 100
  atracao: number // 0 a 100
  conexao: number // 0 a 100
}

export const DiagnosticoRadar: React.FC<RadarChartProps> = ({ fundacao, atracao, conexao }) => {
  // Centro (cx, cy) = (120, 110), Raio Máximo = 75
  const cx = 120
  const cy = 105
  const rMax = 75

  // 3 eixos a 120 graus:
  // Fundação (topo): -90° (0 radianos no topo: cos(-pi/2)=0, sin(-pi/2)=-1)
  // Atração (inferior direita): 30° (pi/6 radianos: cos(pi/6)=sqrt(3)/2, sin(pi/6)=0.5)
  // Conexão (inferior esquerda): 150° (5pi/6 radianos: cos(5pi/6)=-sqrt(3)/2, sin(5pi/6)=0.5)
  const angleFundacao = -Math.PI / 2
  const angleAtracao = Math.PI / 6
  const angleConexao = (5 * Math.PI) / 6

  const getPoint = (angle: number, pct: number) => {
    const r = (Math.max(0, Math.min(100, pct)) / 100) * rMax
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  // Círculos/Triângulos de fundo guia (25%, 50%, 75%, 100%)
  const gridLevels = [25, 50, 75, 100]

  const pF = getPoint(angleFundacao, fundacao)
  const pA = getPoint(angleAtracao, atracao)
  const pC = getPoint(angleConexao, conexao)

  const pointsPolygon = `${pF.x},${pF.y} ${pA.x},${pA.y} ${pC.x},${pC.y}`

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 240 220"
        className="w-full max-w-[240px] h-auto overflow-visible select-none"
        aria-label="Gráfico radar dos três pilares: Fundação, Atração e Conexão"
      >
        {/* Níveis da grade (triângulos concêntricos) */}
        {gridLevels.map((lvl) => {
          const ptF = getPoint(angleFundacao, lvl)
          const ptA = getPoint(angleAtracao, lvl)
          const ptC = getPoint(angleConexao, lvl)
          return (
            <polygon
              key={lvl}
              points={`${ptF.x},${ptF.y} ${ptA.x},${ptA.y} ${ptC.x},${ptC.y}`}
              fill="none"
              stroke="currentColor"
              strokeDasharray={lvl < 100 ? '2 2' : undefined}
              className="text-slate-200 dark:text-[#27272A]"
              strokeWidth="1"
            />
          )
        })}

        {/* Eixos do centro até os vértices de 100% */}
        {[angleFundacao, angleAtracao, angleConexao].map((ang, i) => {
          const endPt = getPoint(ang, 100)
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={endPt.x}
              y2={endPt.y}
              stroke="currentColor"
              className="text-slate-300 dark:text-[#3f3f46]"
              strokeWidth="1"
            />
          )
        })}

        {/* Polígono preenchido do resultado da aluna */}
        <polygon
          points={pointsPolygon}
          className="fill-purple-500/25 stroke-[#7c3aed] dark:stroke-[#C084FC]"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Pontos nos vértices */}
        {[
          { pt: pF, val: fundacao, label: 'F' },
          { pt: pA, val: atracao, label: 'A' },
          { pt: pC, val: conexao, label: 'C' },
        ].map((item, idx) => (
          <g key={idx}>
            <circle
              cx={item.pt.x}
              cy={item.pt.y}
              r="4.5"
              className="fill-white dark:fill-[#0A0A14] stroke-[#7c3aed] dark:stroke-[#C084FC]"
              strokeWidth="2.5"
            />
          </g>
        ))}

        {/* Rótulos dos vértices */}
        <text
          x={cx}
          y={cy - rMax - 10}
          textAnchor="middle"
          className="font-mono text-[11px] font-bold fill-slate-800 dark:fill-white"
        >
          Fundação ({fundacao}%)
        </text>

        <text
          x={cx + rMax * Math.cos(angleAtracao) + 6}
          y={cy + rMax * Math.sin(angleAtracao) + 14}
          textAnchor="start"
          className="font-mono text-[11px] font-bold fill-slate-800 dark:fill-white"
        >
          Atração ({atracao}%)
        </text>

        <text
          x={cx + rMax * Math.cos(angleConexao) - 6}
          y={cy + rMax * Math.sin(angleConexao) + 14}
          textAnchor="end"
          className="font-mono text-[11px] font-bold fill-slate-800 dark:fill-white"
        >
          Conexão ({conexao}%)
        </text>
      </svg>
    </div>
  )
}
