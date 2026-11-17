import React from 'react'

// ─────────────────────────────────────────────────────────────
// Ilustração do Encontro 5 (Etapa 1): iceberg da marca.
// Padrão do projeto: traço limpo, cantos arredondados, cores do
// app (roxo #7c3aed, laranja #ea580c, linha #e2e8f0, texto
// #334155), com a água e o documento Manifesto como pontos de
// destaque laranja.
// ─────────────────────────────────────────────────────────────

const COR_ROXO = '#7c3aed'
const COR_LARANJA = '#ea580c'
const COR_LINHA = '#e2e8f0'
const COR_TEXTO = '#334155'
const COR_TEXTO_SUAVE = '#94a3b8'
const COR_FUNDO = '#f8fafc'

const IconeLogo: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x="-7"
      y="-6"
      width="14"
      height="12"
      rx="4"
      fill="none"
      stroke={COR_ROXO}
      strokeWidth="1.6"
    />
    <circle cx="0" cy="0" r="2.4" fill={COR_ROXO} />
  </g>
)

const IconeCores: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx="-4.5" cy="0" r="3.2" fill={COR_ROXO} opacity="0.85" />
    <circle cx="0" cy="-4" r="3.2" fill={COR_LARANJA} opacity="0.9" />
    <circle cx="4.5" cy="0" r="3.2" fill="#fbbf24" opacity="0.9" />
  </g>
)

const IconeFontes: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <text
      x="0"
      y="0"
      fontSize="13"
      fontWeight="700"
      fill={COR_ROXO}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      Aa
    </text>
  </g>
)

const IconeSimbolo: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d="M 0 -6 L 5.5 4 L -5.5 4 Z"
      fill="none"
      stroke={COR_ROXO}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="0" cy="4.5" r="1.6" fill={COR_ROXO} />
  </g>
)

export const IlustracaoIcebergMarca: React.FC = () => (
  <svg
    viewBox="0 0 420 380"
    className="w-full max-w-[440px]"
    role="img"
    aria-label="Iceberg da marca: acima da água aparecem logo, cores, fontes e símbolos; abaixo da água estão propósito, valores, crenças, voz e inimigo comum, e no fundo o documento Manifesto"
  >
    <rect width="420" height="380" rx="20" fill={COR_FUNDO} />

    {/* Água */}
    <rect x="10" y="120" width="400" height="250" rx="16" fill="#ffe9d8" opacity="0.75" />
    <path
      d="M 18 120 Q 60 114 105 120 T 210 120 T 315 120 T 402 120"
      fill="none"
      stroke={COR_LARANJA}
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.9"
    />

    {/* Iceberg: parte de cima (ponta) */}
    <path
      d="M 210 34 L 268 118 L 152 118 Z"
      fill="#ffffff"
      stroke={COR_ROXO}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Iceberg: parte de baixo (maior, embaixo d'água) */}
    <path
      d="M 152 118 L 268 118 L 296 168 L 274 232 L 236 268 L 196 296 L 160 254 L 142 196 L 128 150 Z"
      fill="#f5f3ff"
      stroke={COR_ROXO}
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.95"
    />

    {/* Palavras acima da água */}
    <text x="210" y="20" fontSize="12" fontWeight="700" fill={COR_TEXTO} textAnchor="middle">
      logo, cores, fontes, símbolos
    </text>
    <IconeLogo x={116} y={72} />
    <IconeCores x={306} y={70} />
    <IconeFontes x={100} y={100} />
    <IconeSimbolo x={324} y={98} />
    <line x1="140" y1="74" x2="172" y2="86" stroke={COR_TEXTO_SUAVE} strokeWidth="1.2" />
    <line x1="292" y1="72" x2="262" y2="86" stroke={COR_TEXTO_SUAVE} strokeWidth="1.2" />
    <line x1="122" y1="102" x2="164" y2="108" stroke={COR_TEXTO_SUAVE} strokeWidth="1.2" />
    <line x1="306" y1="100" x2="260" y2="108" stroke={COR_TEXTO_SUAVE} strokeWidth="1.2" />

    {/* Palavras abaixo da água, na parte maior */}
    <text x="212" y="150" fontSize="12" fontWeight="600" fill={COR_TEXTO} textAnchor="middle">
      propósito, valores, crenças
    </text>
    <text x="212" y="200" fontSize="12" fontWeight="600" fill={COR_TEXTO} textAnchor="middle">
      voz
    </text>
    <text x="212" y="222" fontSize="12" fontWeight="600" fill={COR_TEXTO} textAnchor="middle">
      inimigo comum
    </text>

    {/* Documento Manifesto, bem no fundo */}
    <g>
      <rect
        x="178"
        y="248"
        width="68"
        height="88"
        rx="8"
        fill="#ffffff"
        stroke={COR_LARANJA}
        strokeWidth="2.2"
      />
      <rect x="188" y="258" width="48" height="12" rx="4" fill="#ffedd5" />
      <text x="212" y="267" fontSize="8" fontWeight="700" fill={COR_LARANJA} textAnchor="middle">
        Manifesto
      </text>
      <line
        x1="188"
        y1="282"
        x2="236"
        y2="282"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="188"
        y1="292"
        x2="230"
        y2="292"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="188"
        y1="302"
        x2="236"
        y2="302"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="188"
        y1="312"
        x2="222"
        y2="312"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="188"
        y1="322"
        x2="236"
        y2="322"
        stroke={COR_LINHA}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </svg>
)
