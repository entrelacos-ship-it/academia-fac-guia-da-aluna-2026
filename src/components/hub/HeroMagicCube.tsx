import React, { useRef, useEffect, useState, Component, type ReactNode } from 'react'

/**
 * Error Boundary resiliente para isolar qualquer falha
 */
export class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('[HeroMagicCube] Recuperado de erro no cubo 3D:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}

export interface HeroMagicCubeProps {
  className?: string
}

// Representação de uma camada girando
type RotationAxis = 'x' | 'y' | 'z'

interface LayerTurnState {
  axis: RotationAxis
  layerIndex: number // -1, 0, ou 1
  angle: number // radianos atuais da fatia
  targetAngle: number
  progress: number // 0 a 1
}

/**
 * HeroMagicCube: Cubo Mágico 3x3 estilizado na linguagem Resend / Academia FAC
 * - Implementado em CSS 3D puro (transform-style: preserve-3d, perspective)
 * - Rotação orbital suave contínua do cubo inteiro (3D)
 * - Animação contínua periódica de fatias/peças individuais girando (90 graus) simulando a resolução de um cubo mágico
 * - Tons escuros elegantes: corpo plástico grafite/roxo profundo (#0d0522, #180d38, #1e1045)
 *   com adesivos de acabamento acetinado com bevel em tons da marca:
 *   - Roxo profundo (#24104c, #3b1675)
 *   - Violeta (#6b21a8, #7c3aed)
 *   - Lilás luminoso (#a855f7, #c084fc)
 *   - Acento laranja pontual da marca (#ea580c / #fb923c) em faces seletivas como na referência da Resend
 * - Leveza total (zero dependências pesadas, sem Three.js / R3F)
 * - Respeita prefers-reduced-motion
 * - Suporte a interação por mouse/hover ou touch suave
 */
export const HeroMagicCube: React.FC<HeroMagicCubeProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Ângulos globais contínuos do cubo inteiro
  const rotXRef = useRef(-18) // inclinação isométrica natural estilo Resend
  const rotYRef = useRef(32)
  const mouseOffsetRef = useRef({ x: 0, y: 0 })
  const isHoveredRef = useRef(false)

  // Estado da animação de fatia ativa
  const currentTurnRef = useRef<LayerTurnState | null>(null)
  const nextTurnTimerRef = useRef(1.2) // tempo para iniciar primeira rotação de fatia

  // Elementos do DOM das 26 peças para atualizações diretas de alta performance via rAF
  const piecesDomRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const cubeRootRef = useRef<HTMLDivElement>(null)

  // Detectar prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Gerar coordenadas dos 26 cubinhos (x, y, z em {-1, 0, 1}, excluindo o centro [0,0,0])
  const pieces = useRef<Array<{ x: number; y: number; z: number; id: string }>>(
    (() => {
      const list: Array<{ x: number; y: number; z: number; id: string }> = []
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue
            list.push({ x, y, z, id: `p_${x}_${y}_${z}` })
          }
        }
      }
      return list
    })(),
  )

  // Track positions das peças no espaço discreto da grade
  const pieceCoordsRef = useRef<
    Map<string, { x: number; y: number; z: number; rx: number; ry: number; rz: number }>
  >(new Map())

  useEffect(() => {
    // Inicializar posições
    pieces.current.forEach((p) => {
      pieceCoordsRef.current.set(p.id, { x: p.x, y: p.y, z: p.z, rx: 0, ry: 0, rz: 0 })
    })
  }, [])

  // Loop de Animação 60fps via requestAnimationFrame
  useEffect(() => {
    if (reducedMotion) return

    let animId: number
    let lastTime = performance.now()

    const possibleTurns: Array<{ axis: RotationAxis; layerIndex: number; dir: number }> = [
      { axis: 'y', layerIndex: 1, dir: 1 }, // topo gira no sentido horário
      { axis: 'x', layerIndex: 1, dir: -1 }, // direita gira
      { axis: 'y', layerIndex: -1, dir: -1 }, // base gira
      { axis: 'z', layerIndex: 1, dir: 1 }, // frontal gira
      { axis: 'y', layerIndex: 1, dir: -1 }, // topo volta
      { axis: 'x', layerIndex: 0, dir: 1 }, // fatia do meio gira
      { axis: 'z', layerIndex: -1, dir: -1 }, // traseira gira
      { axis: 'x', layerIndex: -1, dir: 1 }, // esquerda gira
    ]
    let turnSequenceIdx = 0

    const updateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      // 1. Rotação orbital global lenta do cubo todo (estética Resend: elegante e hipnótica)
      const idleSpeedY = isHoveredRef.current ? 8 : 14 // graus/segundo
      const idleSpeedX = isHoveredRef.current ? 3 : 5

      rotYRef.current = (rotYRef.current + idleSpeedY * dt) % 360
      // Oscilação suave do eixo X
      const oscX = Math.sin(now * 0.0008) * 6
      const currentRotX = -18 + oscX + mouseOffsetRef.current.y * 12
      const currentRotY = rotYRef.current + mouseOffsetRef.current.x * 16

      if (cubeRootRef.current) {
        cubeRootRef.current.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`
      }

      // 2. Animação de giro das fatias (peças do cubo mágico)
      if (!currentTurnRef.current) {
        nextTurnTimerRef.current -= dt
        if (nextTurnTimerRef.current <= 0) {
          // Iniciar novo giro de fatia
          const nextTurnDef = possibleTurns[turnSequenceIdx % possibleTurns.length]
          turnSequenceIdx++

          currentTurnRef.current = {
            axis: nextTurnDef.axis,
            layerIndex: nextTurnDef.layerIndex,
            angle: 0,
            targetAngle: nextTurnDef.dir * 90,
            progress: 0,
          }
        }
      } else {
        const turn = currentTurnRef.current
        const turnDuration = 0.95 // segundos para girar uma camada com aceleração e desaceleração suave
        turn.progress += dt / turnDuration

        if (turn.progress >= 1) {
          // Concluir giro e persistir rotação na grade de coordenadas
          const finalAngle = turn.targetAngle
          const rad = (finalAngle * Math.PI) / 180
          const cos = Math.round(Math.cos(rad))
          const sin = Math.round(Math.sin(rad))

          // Atualizar coordenadas lógicas das peças afetadas
          pieceCoordsRef.current.forEach((coord, id) => {
            let inLayer = false
            if (turn.axis === 'x' && coord.x === turn.layerIndex) inLayer = true
            if (turn.axis === 'y' && coord.y === turn.layerIndex) inLayer = true
            if (turn.axis === 'z' && coord.z === turn.layerIndex) inLayer = true

            if (inLayer) {
              let nx = coord.x
              let ny = coord.y
              let nz = coord.z

              if (turn.axis === 'x') {
                ny = coord.y * cos - coord.z * sin
                nz = coord.y * sin + coord.z * cos
                coord.rx = (coord.rx + finalAngle) % 360
              } else if (turn.axis === 'y') {
                nx = coord.x * cos + coord.z * sin
                nz = -coord.x * sin + coord.z * cos
                coord.ry = (coord.ry + finalAngle) % 360
              } else if (turn.axis === 'z') {
                nx = coord.x * cos - coord.y * sin
                ny = coord.x * sin + coord.y * cos
                coord.rz = (coord.rz + finalAngle) % 360
              }

              coord.x = nx
              coord.y = ny
              coord.z = nz
            }
          })

          currentTurnRef.current = null
          nextTurnTimerRef.current = 1.1 // pausa elegante entre giros como um cubo sendo resolvido
        } else {
          // Easing cúbico suave para o movimento de giro da peça
          const p = turn.progress
          const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
          turn.angle = turn.targetAngle * eased
        }
      }

      // 3. Aplicar transformações CSS 3D a cada peça
      const pieceSizePx = 44 // base de tamanho por cubie (escala controlada)
      const spacingPx = 48 // pequeno espaçamento entre peças para chanfro realista

      pieces.current.forEach((p) => {
        const dom = piecesDomRefs.current.get(p.id)
        if (!dom) return

        const coord = pieceCoordsRef.current.get(p.id)
        if (!coord) return

        let extraAngleX = 0
        let extraAngleY = 0
        let extraAngleZ = 0

        if (currentTurnRef.current) {
          const turn = currentTurnRef.current
          let inLayer = false
          if (turn.axis === 'x' && coord.x === turn.layerIndex) inLayer = true
          if (turn.axis === 'y' && coord.y === turn.layerIndex) inLayer = true
          if (turn.axis === 'z' && coord.z === turn.layerIndex) inLayer = true

          if (inLayer) {
            if (turn.axis === 'x') extraAngleX = turn.angle
            if (turn.axis === 'y') extraAngleY = turn.angle
            if (turn.axis === 'z') extraAngleZ = turn.angle
          }
        }

        // Matriz de posicionamento no espaço 3D relativo ao centro do cubo
        const posX = coord.x * spacingPx
        const posY = -coord.y * spacingPx // Y invertido no CSS 3D
        const posZ = coord.z * spacingPx

        const totalRx = coord.rx + extraAngleX
        const totalRy = coord.ry + extraAngleY
        const totalRz = coord.rz + extraAngleZ

        dom.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px) rotateX(${totalRx}deg) rotateY(${totalRy}deg) rotateZ(${totalRz}deg)`
      })

      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [reducedMotion])

  // Tratar interação suave de mouse no contêiner
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseOffsetRef.current = { x, y }
  }

  const handleMouseEnter = () => {
    isHoveredRef.current = true
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    mouseOffsetRef.current = { x: 0, y: 0 }
  }

  // Paleta de cores para os adesivos / stickers das faces
  // Base do fundo é #0D0522; usamos tons ricos de roxo escuro, ametista, lilás luminoso
  // e acentos pontuais laranja (#ea580c / #fb923c) como na imagem de referência da Resend
  const getStickerFaceStyle = (
    face: 'front' | 'back' | 'top' | 'bottom' | 'right' | 'left',
    x: number,
    y: number,
    z: number,
  ) => {
    // Determinar se esta face é externa ou oculta no interior
    let isExternal = false
    if (face === 'front' && z === 1) isExternal = true
    if (face === 'back' && z === -1) isExternal = true
    if (face === 'right' && x === 1) isExternal = true
    if (face === 'left' && x === -1) isExternal = true
    if (face === 'top' && y === 1) isExternal = true
    if (face === 'bottom' && y === -1) isExternal = true

    if (!isExternal) {
      // Faces internas são do corpo plástico preto escuro fosco
      return 'bg-[#0a0518]'
    }

    // Acentos pontuais em laranja da marca (2 a 3 peças estratégicas na face frontal/superior como na foto)
    if (face === 'front' && x === 1 && y === -1) {
      return 'bg-gradient-to-br from-[#fb923c] to-[#ea580c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-[#fdba74]/50'
    }
    if (face === 'top' && x === 0 && z === 1) {
      return 'bg-gradient-to-br from-[#ea580c] to-[#c2410c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#fb923c]/40'
    }

    // Destaque brilhante em lilás acetinado na peça central frontal
    if (face === 'front' && x === 0 && y === 0) {
      return 'bg-gradient-to-br from-[#c084fc] to-[#9333ea] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] border border-[#e9d5ff]/40'
    }

    // Peças com acabamento texturizado grafite-metálico escuro com reflexo arroxeado (como no cubo Resend)
    if ((x + y + z) % 3 === 0) {
      return 'bg-gradient-to-br from-[#2a1355] to-[#14082c] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.18)] border border-purple-500/25'
    }

    if ((x + y + z) % 2 === 0) {
      return 'bg-gradient-to-br from-[#1b0a38] to-[#0f0524] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.12)] border border-purple-900/40'
    }

    // Roxo profundo elegante da marca
    return 'bg-gradient-to-br from-[#3b1578] to-[#1c083d] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22)] border border-purple-400/20'
  }

  // Estilos 3D de cada uma das 6 faces de cada cubie de 44px
  const cubieHalfSize = 22 // 44 / 2

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ perspective: '1100px' }}
      aria-label="Cubo Mágico 3x3 animado da Academia FAC"
    >
      {/* Halo de luz de estúdio roxo suave no fundo (ambient lighting) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] rounded-full bg-radial from-[#9333ea]/25 via-[#6b21a8]/12 to-transparent blur-3xl opacity-85" />
        <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full bg-radial from-[#fb923c]/15 to-transparent blur-2xl opacity-60 translate-x-8 -translate-y-8" />
      </div>

      {/* Palco 3D do Cubo */}
      <div className="w-[240px] h-[240px] xs:w-[270px] xs:h-[270px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] flex items-center justify-center relative">
        <div
          ref={cubeRootRef}
          className="relative w-0 h-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-18deg) rotateY(32deg)',
            transition: reducedMotion ? 'transform 0.3s ease' : 'none',
          }}
        >
          {/* 26 peças individuais do cubo mágico */}
          {pieces.current.map((p) => (
            <div
              key={p.id}
              ref={(el) => {
                if (el) piecesDomRefs.current.set(p.id, el)
                else piecesDomRefs.current.delete(p.id)
              }}
              className="absolute w-[44px] h-[44px] -left-[22px] -top-[22px]"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translate3d(${p.x * 48}px, ${-p.y * 48}px, ${p.z * 48}px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Face Frontal (+Z) */}
              <div
                className={`absolute inset-0 rounded-[5px] p-[2.5px] transition-colors duration-150 ${
                  p.z === 1 ? 'border border-black/40' : ''
                }`}
                style={{
                  transform: `translateZ(${cubieHalfSize}px)`,
                  backgroundColor: '#0a0518',
                  boxShadow: p.z === 1 ? '0 1px 3px rgba(0,0,0,0.6)' : 'none',
                }}
              >
                <div
                  className={`w-full h-full rounded-[3.5px] ${getStickerFaceStyle('front', p.x, p.y, p.z)}`}
                />
              </div>

              {/* Face Traseira (-Z) */}
              <div
                className={`absolute inset-0 rounded-[5px] p-[2.5px] transition-colors duration-150 ${
                  p.z === -1 ? 'border border-black/40' : ''
                }`}
                style={{
                  transform: `rotateY(180deg) translateZ(${cubieHalfSize}px)`,
                  backgroundColor: '#0a0518',
                }}
              >
                <div
                  className={`w-full h-full rounded-[3.5px] ${getStickerFaceStyle('back', p.x, p.y, p.z)}`}
                />
              </div>

              {/* Face Direita (+X) */}
              <div
                className={`absolute inset-0 rounded-[5px] p-[2.5px] transition-colors duration-150 ${
                  p.x === 1 ? 'border border-black/40' : ''
                }`}
                style={{
                  transform: `rotateY(90deg) translateZ(${cubieHalfSize}px)`,
                  backgroundColor: '#0a0518',
                }}
              >
                <div
                  className={`w-full h-full rounded-[3.5px] ${getStickerFaceStyle('right', p.x, p.y, p.z)}`}
                />
              </div>

              {/* Face Esquerda (-X) */}
              <div
                className={`absolute inset-0 rounded-[5px] p-[2.5px] transition-colors duration-150 ${
                  p.x === -1 ? 'border border-black/40' : ''
                }`}
                style={{
                  transform: `rotateY(-90deg) translateZ(${cubieHalfSize}px)`,
                  backgroundColor: '#0a0518',
                }}
              >
                <div
                  className={`w-full h-full rounded-[3.5px] ${getStickerFaceStyle('left', p.x, p.y, p.z)}`}
                />
              </div>

              {/* Face Superior (+Y) */}
              <div
                className={`absolute inset-0 rounded-[5px] p-[2.5px] transition-colors duration-150 ${
                  p.y === 1 ? 'border border-black/40' : ''
                }`}
                style={{
                  transform: `rotateX(90deg) translateZ(${cubieHalfSize}px)`,
                  backgroundColor: '#0a0518',
                }}
              >
                <div
                  className={`w-full h-full rounded-[3.5px] ${getStickerFaceStyle('top', p.x, p.y, p.z)}`}
                />
              </div>

              {/* Face Inferior (-Y) */}
              <div
                className={`absolute inset-0 rounded-[5px] p-[2.5px] transition-colors duration-150 ${
                  p.y === -1 ? 'border border-black/40' : ''
                }`}
                style={{
                  transform: `rotateX(-90deg) translateZ(${cubieHalfSize}px)`,
                  backgroundColor: '#0a0518',
                }}
              >
                <div
                  className={`w-full h-full rounded-[3.5px] ${getStickerFaceStyle('bottom', p.x, p.y, p.z)}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legenda técnica sutil estilo Resend em JetBrains Mono */}
      <div className="mt-2 text-center pointer-events-none select-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-300/60 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.02] text-[10px] font-mono tracking-widest uppercase text-slate-700 dark:text-[#C084FC]/90">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
          <span>FUNDAÇÃO · ATRAÇÃO · CONEXÃO</span>
        </div>
      </div>
    </div>
  )
}

export default HeroMagicCube
