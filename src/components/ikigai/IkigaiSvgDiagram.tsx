import React from 'react'
import { IkigaiState } from '@/types/ikigai'
import { CIRCLE_DEFINITIONS, INTERSECTION_DEFINITIONS } from '@/config/ikigaiContent'

interface IkigaiSvgDiagramProps {
  state: IkigaiState
  className?: string
}

export const IkigaiSvgDiagram: React.FC<IkigaiSvgDiagramProps> = ({ state, className }) => {
  // Coletar itens estrelados de cada círculo (até 3)
  const getStarredItems = (circleKey: keyof typeof state.circles) => {
    const list = state.circles[circleKey].filter((i) => i.starred)
    if (list.length === 0) {
      // Se não houver estrelados, pega os primeiros 2
      return state.circles[circleKey].slice(0, 2)
    }
    return list.slice(0, 3)
  }

  const loveStarred = getStarredItems('love')
  const goodAtStarred = getStarredItems('goodAt')
  const worldNeedsStarred = getStarredItems('worldNeeds')
  const paidForStarred = getStarredItems('paidFor')

  const passionText = state.intersections.passion?.notFound
    ? '[Em aberto]'
    : state.intersections.passion?.text || ''

  const missionText = state.intersections.mission?.notFound
    ? '[Em aberto]'
    : state.intersections.mission?.text || ''

  const vocationText = state.intersections.vocation?.notFound
    ? '[Em aberto]'
    : state.intersections.vocation?.text || ''

  const professionText = state.intersections.profession?.notFound
    ? '[Em aberto]'
    : state.intersections.profession?.text || ''

  const missionStatement = state.missionStatement || 'Minha Declaração de Missão'

  return (
    <div className={`w-full relative flex items-center justify-center ${className || ''}`}>
      <svg
        viewBox="0 0 800 800"
        className="w-full h-auto max-w-[760px] drop-shadow-md select-none font-sans"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradientes dos Círculos */}
          {/* Topo: Círculo 1 - O que amo (#7C3AED / Roxo) */}
          <radialGradient id="gradLove" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#7C3AED" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.30" />
          </radialGradient>

          {/* Esquerda: Círculo 2 - No que sou boa (#3B82F6 / Azul) */}
          <radialGradient id="gradGoodAt" cx="40%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.30" />
          </radialGradient>

          {/* Direita: Círculo 3 - Do que o mundo precisa (#10B981 / Esmeralda) */}
          <radialGradient id="gradWorldNeeds" cx="60%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#059669" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.30" />
          </radialGradient>

          {/* Base: Círculo 4 - Pelo que posso ser remunerada (#EA580C / Laranja) */}
          <radialGradient id="gradPaidFor" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FB923C" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#EA580C" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#C2410C" stopOpacity="0.30" />
          </radialGradient>

          {/* Filtro de sombra suave para o núcleo */}
          <filter id="centerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Fundo sutil do diagrama */}
        <rect width="800" height="800" fill="transparent" />

        {/* 1. Os 4 Círculos Interconectados (Raio 190 cada) */}
        {/* Top: Amo (cx: 400, cy: 260) */}
        <circle
          cx="400"
          cy="260"
          r="190"
          fill="url(#gradLove)"
          stroke="#7C3AED"
          strokeWidth="2.5"
          className="transition-all duration-300 hover:stroke-[3.5]"
        />

        {/* Left: Sou boa (cx: 260, cy: 400) */}
        <circle
          cx="260"
          cy="400"
          r="190"
          fill="url(#gradGoodAt)"
          stroke="#2563EB"
          strokeWidth="2.5"
          className="transition-all duration-300 hover:stroke-[3.5]"
        />

        {/* Right: Mundo precisa (cx: 540, cy: 400) */}
        <circle
          cx="540"
          cy="400"
          r="190"
          fill="url(#gradWorldNeeds)"
          stroke="#059669"
          strokeWidth="2.5"
          className="transition-all duration-300 hover:stroke-[3.5]"
        />

        {/* Bottom: Remuneração (cx: 400, cy: 540) */}
        <circle
          cx="400"
          cy="540"
          r="190"
          fill="url(#gradPaidFor)"
          stroke="#EA580C"
          strokeWidth="2.5"
          className="transition-all duration-300 hover:stroke-[3.5]"
        />

        {/* 2. Textos e Etiquetas nos 4 Círculos (Extremidades) */}
        {/* Topo: O que amo */}
        <g transform="translate(400, 125)" textAnchor="middle">
          <rect x="-95" y="-14" width="190" height="22" rx="11" fill="#7C3AED" />
          <text y="1" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.5">
            O QUE EU AMO FAZER
          </text>
          {loveStarred.map((item, idx) => (
            <text
              key={item.id}
              y={24 + idx * 16}
              fill="currentColor"
              fontSize="10"
              fontWeight="500"
              className="text-slate-800 dark:text-slate-100"
            >
              ★ {item.text.length > 32 ? `${item.text.slice(0, 30)}...` : item.text}
            </text>
          ))}
        </g>

        {/* Esquerda: No que sou boa */}
        <g transform="translate(135, 385)" textAnchor="middle">
          <rect x="-85" y="-14" width="170" height="22" rx="11" fill="#2563EB" />
          <text y="1" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.5">
            NO QUE SOU BOA
          </text>
          {goodAtStarred.map((item, idx) => (
            <text
              key={item.id}
              y={24 + idx * 16}
              fill="currentColor"
              fontSize="10"
              fontWeight="500"
              className="text-slate-800 dark:text-slate-100"
            >
              ★ {item.text.length > 28 ? `${item.text.slice(0, 26)}...` : item.text}
            </text>
          ))}
        </g>

        {/* Direita: Do que o mundo precisa */}
        <g transform="translate(665, 385)" textAnchor="middle">
          <rect x="-95" y="-14" width="190" height="22" rx="11" fill="#059669" />
          <text y="1" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.5">
            DO QUE O MUNDO PRECISA
          </text>
          {worldNeedsStarred.map((item, idx) => (
            <text
              key={item.id}
              y={24 + idx * 16}
              fill="currentColor"
              fontSize="10"
              fontWeight="500"
              className="text-slate-800 dark:text-slate-100"
            >
              ★ {item.text.length > 28 ? `${item.text.slice(0, 26)}...` : item.text}
            </text>
          ))}
        </g>

        {/* Base: Remuneração digna */}
        <g transform="translate(400, 675)" textAnchor="middle">
          <rect x="-105" y="-14" width="210" height="22" rx="11" fill="#EA580C" />
          <text y="1" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="0.5">
            REMUNERAÇÃO COM DIGNIDADE
          </text>
          {paidForStarred.map((item, idx) => (
            <text
              key={item.id}
              y={24 + idx * 16}
              fill="currentColor"
              fontSize="10"
              fontWeight="500"
              className="text-slate-800 dark:text-slate-100"
            >
              ★ {item.text.length > 32 ? `${item.text.slice(0, 30)}...` : item.text}
            </text>
          ))}
        </g>

        {/* 3. As 4 Interseções Principais */}
        {/* Paixão: Amo + Sou boa (Noroeste: 280, 280) */}
        <g transform="translate(280, 280)" textAnchor="middle">
          <rect
            x="-60"
            y="-12"
            width="120"
            height="22"
            rx="6"
            fill="#FFFFFF"
            stroke="#7C3AED"
            strokeWidth="1.5"
            className="dark:fill-[#18181B]"
          />
          <text y="2" fill="#7C3AED" fontSize="11" fontWeight="700" className="dark:fill-[#C084FC]">
            PAIXÃO
          </text>
          {passionText && (
            <text
              y="22"
              fill="currentColor"
              fontSize="9"
              fontWeight="500"
              className="text-slate-600 dark:text-slate-300"
            >
              {passionText.length > 26 ? `${passionText.slice(0, 24)}...` : passionText}
            </text>
          )}
        </g>

        {/* Missão: Amo + Mundo precisa (Nordeste: 520, 280) */}
        <g transform="translate(520, 280)" textAnchor="middle">
          <rect
            x="-60"
            y="-12"
            width="120"
            height="22"
            rx="6"
            fill="#FFFFFF"
            stroke="#059669"
            strokeWidth="1.5"
            className="dark:fill-[#18181B]"
          />
          <text y="2" fill="#059669" fontSize="11" fontWeight="700" className="dark:fill-[#34D399]">
            MISSÃO
          </text>
          {missionText && (
            <text
              y="22"
              fill="currentColor"
              fontSize="9"
              fontWeight="500"
              className="text-slate-600 dark:text-slate-300"
            >
              {missionText.length > 26 ? `${missionText.slice(0, 24)}...` : missionText}
            </text>
          )}
        </g>

        {/* Profissão: Sou boa + Renda (Sudoeste: 280, 520) */}
        <g transform="translate(280, 520)" textAnchor="middle">
          <rect
            x="-60"
            y="-12"
            width="120"
            height="22"
            rx="6"
            fill="#FFFFFF"
            stroke="#2563EB"
            strokeWidth="1.5"
            className="dark:fill-[#18181B]"
          />
          <text y="2" fill="#2563EB" fontSize="11" fontWeight="700" className="dark:fill-[#60A5FA]">
            PROFISSÃO
          </text>
          {professionText && (
            <text
              y="22"
              fill="currentColor"
              fontSize="9"
              fontWeight="500"
              className="text-slate-600 dark:text-slate-300"
            >
              {professionText.length > 26 ? `${professionText.slice(0, 24)}...` : professionText}
            </text>
          )}
        </g>

        {/* Vocação: Mundo precisa + Renda (Sudeste: 520, 520) */}
        <g transform="translate(520, 520)" textAnchor="middle">
          <rect
            x="-60"
            y="-12"
            width="120"
            height="22"
            rx="6"
            fill="#FFFFFF"
            stroke="#EA580C"
            strokeWidth="1.5"
            className="dark:fill-[#18181B]"
          />
          <text y="2" fill="#EA580C" fontSize="11" fontWeight="700" className="dark:fill-[#FB923C]">
            VOCAÇÃO
          </text>
          {vocationText && (
            <text
              y="22"
              fill="currentColor"
              fontSize="9"
              fontWeight="500"
              className="text-slate-600 dark:text-slate-300"
            >
              {vocationText.length > 26 ? `${vocationText.slice(0, 24)}...` : vocationText}
            </text>
          )}
        </g>

        {/* 4. O Coração Central: IKIGAI & Declaração de Missão */}
        <g transform="translate(400, 400)" textAnchor="middle">
          <circle
            cx="0"
            cy="0"
            r="82"
            fill="#FFFFFF"
            stroke="#7C3AED"
            strokeWidth="3"
            filter="url(#centerShadow)"
            className="dark:fill-[#0A0A14] dark:stroke-[#C084FC]"
          />
          <text
            y="-38"
            fill="#7C3AED"
            fontSize="13"
            fontWeight="800"
            letterSpacing="2"
            className="dark:fill-[#C084FC]"
          >
            IKIGAI
          </text>
          <line
            x1="-40"
            y1="-28"
            x2="40"
            y2="-28"
            stroke="#7C3AED"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            className="dark:stroke-[#C084FC]"
          />

          {/* Missão em até 3 linhas dentro do círculo central */}
          <foreignObject x="-72" y="-22" width="144" height="88">
            <div className="w-full h-full flex items-center justify-center text-center px-1">
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-800 dark:text-slate-100 leading-tight line-clamp-4">
                "{missionStatement}"
              </p>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  )
}
