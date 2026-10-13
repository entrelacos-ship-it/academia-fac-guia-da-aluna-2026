import React, { useRef, useEffect, useState, Component, type ReactNode } from 'react'

/**
 * Error Boundary resiliente para isolar qualquer falha gráfica
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

type RotationAxis = 'x' | 'y' | 'z'

interface LayerTurnState {
  axis: RotationAxis
  layerIndex: number // -1, 0, 1
  angle: number // graus atuais da fatia
  targetAngle: number
  progress: number // 0 a 1
}

interface PieceState {
  id: string
  x: number // -1, 0, 1
  y: number // -1, 0, 1
  z: number // -1, 0, 1
  // Matriz de orientação 3x3 para rastrear rotações cumulativas sem gimbal lock
  rotMatrix: [[number, number, number], [number, number, number], [number, number, number]]
}

// Multiplicação de matriz 3x3 por 3x3
function multiply3x3(
  a: [[number, number, number], [number, number, number], [number, number, number]],
  b: [[number, number, number], [number, number, number], [number, number, number]],
): [[number, number, number], [number, number, number], [number, number, number]] {
  const r: [[number, number, number], [number, number, number], [number, number, number]] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      r[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]
    }
  }
  return r
}

// Matriz de rotação de 90° ao redor de um eixo principal
function getRotationMatrix90(
  axis: RotationAxis,
  dir: number,
): [[number, number, number], [number, number, number], [number, number, number]] {
  // dir = 1 ou -1
  if (axis === 'x') {
    // Rotação em torno do eixo X
    // [1,   0,    0]
    // [0, cos, -sin]
    // [0, sin,  cos]
    const s = dir
    return [
      [1, 0, 0],
      [0, 0, -s],
      [0, s, 0],
    ]
  } else if (axis === 'y') {
    // Rotação em torno do eixo Y
    // [ cos, 0, sin]
    // [   0, 1,   0]
    // [-sin, 0, cos]
    const s = dir
    return [
      [0, 0, s],
      [0, 1, 0],
      [-s, 0, 0],
    ]
  } else {
    // Rotação em torno do eixo Z
    // [cos, -sin, 0]
    // [sin,  cos, 0]
    // [  0,    0, 1]
    const s = dir
    return [
      [0, -s, 0],
      [s, 0, 0],
      [0, 0, 1],
    ]
  }
}

/**
 * HeroMagicCube: Reconstrução cinematográfica do Cubo Mágico 3x3
 * Inspirado na direção de arte Resend ("Dark Premium Minimalism")
 * adaptado estritamente à identidade Academia FAC:
 * - Fundo compartilhado com o roxo profundo da marca (#0D0522)
 * - Cubo surge organicamente através da LUZ DE ESTÚDIO (highlights, bevel metálico de 1px, facetamento)
 * - Superfícies com gradiente anisotrópico escuro simulando acabamento metálico anodizado / fosco de precisão
 * - 2 a 3 peças estratégicas com sutil acento laranja (#EA580C / #FB923C) da marca
 * - 1 a 2 peças com reflexo ametista/lilás luminoso (#7C3AED / #C084FC)
 * - Rotação orbital suave contínua com inclinação isométrica natural
 * - Mecânica de cubo mágico verídica: fatias giram em 90° com easing suave e pausa elegante entre movimentos
 * - Sombra de contato e reflexo elíptico difuso projetados na base
 * - Respeito integral a prefers-reduced-motion e responsividade fluida
 */
export const HeroMagicCube: React.FC<HeroMagicCubeProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Rotação global do cubo
  const rotXRef = useRef(-22)
  const rotYRef = useRef(38)
  const mouseOffsetRef = useRef({ x: 0, y: 0 })
  const mouseSmoothRef = useRef({ x: 0, y: 0 })
  const isHoveredRef = useRef(false)

  // Estado da camada ativa girando
  const currentTurnRef = useRef<LayerTurnState | null>(null)
  const nextTurnTimerRef = useRef(1.4) // tempo antes do primeiro giro de fatia

  // Referências DOM
  const piecesDomRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const cubeRootRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)

  // Detectar prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Gerar estado inicial dos 26 cubinhos
  const piecesStateRef = useRef<Map<string, PieceState>>(
    (() => {
      const map = new Map<string, PieceState>()
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue // interior oco
            const id = `p_${x}_${y}_${z}`
            map.set(id, {
              id,
              x,
              y,
              z,
              rotMatrix: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
              ],
            })
          }
        }
      }
      return map
    })(),
  )

  // Lista estática de ids para iteração no render
  const pieceIds = useRef<string[]>(Array.from(piecesStateRef.current.keys()))

  // Loop de Animação a 60fps via rAF
  useEffect(() => {
    if (reducedMotion) return

    let animId: number
    let lastTime = performance.now()

    // Sequência de movimentos do cubo mágico: giros elegantes com sentido e eixos variados
    const possibleTurns: Array<{ axis: RotationAxis; layerIndex: number; dir: number }> = [
      { axis: 'y', layerIndex: 1, dir: 1 }, // topo gira horário
      { axis: 'x', layerIndex: 1, dir: -1 }, // face direita gira
      { axis: 'z', layerIndex: 1, dir: 1 }, // frontal gira
      { axis: 'y', layerIndex: -1, dir: -1 }, // base gira anti-horário
      { axis: 'x', layerIndex: 0, dir: 1 }, // camada central gira
      { axis: 'y', layerIndex: 1, dir: -1 }, // topo reverte
      { axis: 'z', layerIndex: -1, dir: 1 }, // traseira gira
      { axis: 'x', layerIndex: -1, dir: 1 }, // face esquerda gira
    ]
    let turnSequenceIdx = 0

    const updateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08)
      lastTime = now

      // 1. Rotação orbital suave e hipnótica do cubo todo
      const idleSpeedY = isHoveredRef.current ? 7 : 12 // graus por segundo
      rotYRef.current = (rotYRef.current + idleSpeedY * dt) % 360

      // Interpolação suave do mouse (damping / lerp)
      mouseSmoothRef.current.x += (mouseOffsetRef.current.x - mouseSmoothRef.current.x) * 0.08
      mouseSmoothRef.current.y += (mouseOffsetRef.current.y - mouseSmoothRef.current.y) * 0.08

      // Flutuação vertical cinematográfica suave (bobbing)
      const floatOffsetY = Math.sin(now * 0.0012) * 5
      const oscPitch = Math.sin(now * 0.0007) * 3

      const currentRotX = -20 + oscPitch + mouseSmoothRef.current.y * 14
      const currentRotY = rotYRef.current + mouseSmoothRef.current.x * 20

      if (cubeRootRef.current) {
        cubeRootRef.current.style.transform = `translate3d(0, ${floatOffsetY.toFixed(2)}px, 0) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`
      }

      if (shadowRef.current) {
        // Sombra pulsa sutilmente com a flutuação
        const shadowScale = 1 - floatOffsetY * 0.015
        const shadowOpacity = 0.55 + floatOffsetY * 0.01
        shadowRef.current.style.transform = `scale(${shadowScale.toFixed(3)})`
        shadowRef.current.style.opacity = shadowOpacity.toFixed(3)
      }

      // 2. Animação de giro das fatias (peças do cubo mágico)
      if (!currentTurnRef.current) {
        nextTurnTimerRef.current -= dt
        if (nextTurnTimerRef.current <= 0) {
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
        const turnDuration = 1.05 // duração suave e refinada
        turn.progress += dt / turnDuration

        if (turn.progress >= 1) {
          // Concluir giro e rotacionar as coordenadas no espaço discreto
          const dir = turn.targetAngle > 0 ? 1 : -1
          const rotM = getRotationMatrix90(turn.axis, dir)

          piecesStateRef.current.forEach((piece) => {
            let inLayer = false
            if (turn.axis === 'x' && piece.x === turn.layerIndex) inLayer = true
            if (turn.axis === 'y' && piece.y === turn.layerIndex) inLayer = true
            if (turn.axis === 'z' && piece.z === turn.layerIndex) inLayer = true

            if (inLayer) {
              // Atualizar coordenadas discretas (x, y, z)
              let nx = piece.x
              let ny = piece.y
              let nz = piece.z

              if (turn.axis === 'x') {
                ny = -piece.z * dir
                nz = piece.y * dir
              } else if (turn.axis === 'y') {
                nx = piece.z * dir
                nz = -piece.x * dir
              } else if (turn.axis === 'z') {
                nx = -piece.y * dir
                ny = piece.x * dir
              }

              piece.x = Math.round(nx)
              piece.y = Math.round(ny)
              piece.z = Math.round(nz)

              // Multiplicar matriz de rotação da orientação interna da peça
              piece.rotMatrix = multiply3x3(rotM, piece.rotMatrix)
            }
          })

          currentTurnRef.current = null
          nextTurnTimerRef.current = 1.35 // pausa elegante de contemplação entre movimentos
        } else {
          // Easing quintic suave (muito cinematográfico, sem tranco)
          const p = turn.progress
          const eased = p < 0.5 ? 16 * Math.pow(p, 5) : 1 - Math.pow(-2 * p + 2, 5) / 2
          turn.angle = turn.targetAngle * eased
        }
      }

      // 3. Atualizar estilos 3D de cada peça
      const spacing = 52 // 48px tamanho do bloco + 4px de gap chanfrado

      piecesStateRef.current.forEach((piece) => {
        const dom = piecesDomRefs.current.get(piece.id)
        if (!dom) return

        let inActiveTurn = false
        if (currentTurnRef.current) {
          const t = currentTurnRef.current
          if (t.axis === 'x' && piece.x === t.layerIndex) inActiveTurn = true
          if (t.axis === 'y' && piece.y === t.layerIndex) inActiveTurn = true
          if (t.axis === 'z' && piece.z === t.layerIndex) inActiveTurn = true
        }

        const m = piece.rotMatrix
        const posX = piece.x * spacing
        const posY = -piece.y * spacing // Inversão do eixo Y no CSS 3D
        const posZ = piece.z * spacing

        if (inActiveTurn && currentTurnRef.current) {
          const t = currentTurnRef.current
          const turnAngle = t.angle
          const rotTransform =
            t.axis === 'x'
              ? `rotateX(${turnAngle.toFixed(2)}deg)`
              : t.axis === 'y'
                ? `rotateY(${-turnAngle.toFixed(2)}deg)`
                : `rotateZ(${turnAngle.toFixed(2)}deg)`

          dom.style.transform = `${rotTransform} translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${posZ.toFixed(1)}px) matrix3d(${m[0][0]}, ${m[1][0]}, ${m[2][0]}, 0, ${m[0][1]}, ${m[1][1]}, ${m[2][1]}, 0, ${m[0][2]}, ${m[1][2]}, ${m[2][2]}, 0, 0, 0, 0, 1)`
        } else {
          dom.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${posZ.toFixed(1)}px) matrix3d(${m[0][0]}, ${m[1][0]}, ${m[2][0]}, 0, ${m[0][1]}, ${m[1][1]}, ${m[2][1]}, 0, ${m[0][2]}, ${m[1][2]}, ${m[2][2]}, 0, 0, 0, 0, 1)`
        }
      })

      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)
    return () => cancelAnimationFrame(animId)
  }, [reducedMotion])

  // Interatividade suave com o mouse
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

  // Estilização das 6 faces de um bloco individual
  // Simulação de luz de estúdio e materiais metálicos anodizados:
  // - Topo: recebe luz superior direta (+brilho suave, vivó prateado/ametista)
  // - Frontal e Direita: luz lateral chave (key light) e de preenchimento (fill light)
  // - Base e Traseira: sombras profundas em roxo profundo
  // - 2 peças com acabamento em laranja da marca (acento pontual de alta classe)
  // - 1 peça com acabamento em lilás acetinado
  const getFaceClass = (
    face: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom',
    id: string,
  ) => {
    // Acentos pontuais em peças icônicas (pelo id original de montagem)
    // Peça 1: Acento Laranja da marca (canto frontal direito superior)
    if (id === 'p_1_1_1') {
      if (face === 'top') {
        return 'bg-gradient-to-br from-[#fb923c] via-[#ea580c] to-[#c2410c] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45)] border border-[#fed7aa]/50'
      }
      if (face === 'front') {
        return 'bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#9a3412] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#fdba74]/40'
      }
      if (face === 'right') {
        return 'bg-gradient-to-br from-[#ea580c] via-[#c2410c] to-[#7c2d12] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2)] border border-[#ea580c]/30'
      }
    }

    // Peça 2: Acento Laranja secundário mais sóbrio (aresta frontal inferior)
    if (id === 'p_0_-1_1' && face === 'front') {
      return 'bg-gradient-to-br from-[#fb923c] via-[#ea580c] to-[#7c2d12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] border border-[#fdba74]/40'
    }

    // Peça 3: Centro frontal em Lilás Ametista Luminoso (luz chave do Método FAC)
    if (id === 'p_0_0_1' && face === 'front') {
      return 'bg-gradient-to-br from-[#c084fc] via-[#9333ea] to-[#6b21a8] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5)] border border-[#e9d5ff]/50'
    }

    // Peça 4: Bloco metálico polido com reflexo violeta intenso
    if (id === 'p_-1_1_1' && face === 'top') {
      return 'bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#1e0a45] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.35)] border border-[#a855f7]/30'
    }

    // Blocos padrão com iluminação de estúdio direcional:
    switch (face) {
      case 'top':
        // Face superior: máxima luminosidade de estúdio, chanfro superior com brilho fino
        return 'bg-gradient-to-b from-[#2d1157] via-[#1f0b3e] to-[#15062c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] border border-purple-400/25'
      case 'front':
        // Face frontal: luz principal moderada, reflexo acetinado escuro
        return 'bg-gradient-to-br from-[#240e47] via-[#170830] to-[#0f0422] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.18)] border border-purple-500/20'
      case 'right':
        // Face lateral direita: luz de preenchimento mais fria e densa
        return 'bg-gradient-to-bl from-[#1c0a37] via-[#120526] to-[#0a0319] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.12)] border border-purple-600/15'
      case 'left':
        // Face lateral esquerda: penumbra suave
        return 'bg-gradient-to-br from-[#18082f] via-[#100421] to-[#090216] border border-purple-900/30'
      case 'bottom':
        // Face inferior: sombra de oclusão profunda
        return 'bg-[#0a0319] border border-purple-950/40'
      case 'back':
        // Face traseira: profundidade escura
        return 'bg-gradient-to-tr from-[#130626] to-[#0a0318] border border-purple-900/20'
    }
  }

  const cubieSize = 48
  const half = cubieSize / 2 // 24px

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center select-none py-6 sm:py-8 ${className}`}
      style={{ perspective: '1200px' }}
      aria-label="Cubo Mágico 3x3 tridimensional animado da Academia FAC"
    >
      {/* 1. Iluminação de estúdio ambiental (Studio Lights & Reflections) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-visible"
        aria-hidden="true"
      >
        {/* Luz de preenchimento roxa de grande raio (aura atmosférica) */}
        <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full bg-radial from-[#7c3aed]/20 via-[#4c1d95]/10 to-transparent blur-3xl opacity-80" />

        {/* Luz direcional pontual em lilás (key light superior) */}
        <div className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full bg-radial from-[#c084fc]/25 via-transparent to-transparent blur-2xl opacity-75 -translate-y-16 -translate-x-12" />

        {/* Luz de recorte quente em laranja (rim light pontual do design system) */}
        <div className="w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] rounded-full bg-radial from-[#ea580c]/18 via-transparent to-transparent blur-2xl opacity-70 translate-x-16 translate-y-8" />
      </div>

      {/* 2. Palco 3D do Cubo Mágico */}
      <div className="w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] flex items-center justify-center relative">
        {/* Sombra projetada flutuante abaixo do objeto (contato de produto cinematográfico) */}
        <div
          ref={shadowRef}
          aria-hidden="true"
          className="absolute bottom-6 sm:bottom-8 w-[240px] sm:w-[300px] h-[36px] sm:h-[44px] rounded-[100%] bg-radial from-black/80 via-[#120526]/50 to-transparent blur-xl pointer-events-none transition-transform duration-300"
        />

        {/* Raiz 3D com perspective e transform-style preservado */}
        <div
          ref={cubeRootRef}
          className="relative w-0 h-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-22deg) rotateY(38deg)',
            transition: reducedMotion ? 'transform 0.4s ease' : 'none',
          }}
        >
          {/* As 26 peças individuais do cubo */}
          {pieceIds.current.map((id) => (
            <div
              key={id}
              ref={(el) => {
                if (el) piecesDomRefs.current.set(id, el)
                else piecesDomRefs.current.delete(id)
              }}
              className="absolute w-[48px] h-[48px] -left-[24px] -top-[24px] rounded-[8px]"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
              }}
            >
              {/* Face Superior (+Y) */}
              <div
                className={`absolute inset-0 rounded-[7px] ${getFaceClass('top', id)}`}
                style={{
                  transform: `rotateX(90deg) translateZ(${half}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Linha de reflexo especular de estúdio de 1px */}
                <div className="w-full h-full rounded-[6px] bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* Face Inferior (-Y) */}
              <div
                className={`absolute inset-0 rounded-[7px] ${getFaceClass('bottom', id)}`}
                style={{
                  transform: `rotateX(-90deg) translateZ(${half}px)`,
                  backfaceVisibility: 'hidden',
                }}
              />

              {/* Face Frontal (+Z) */}
              <div
                className={`absolute inset-0 rounded-[7px] ${getFaceClass('front', id)}`}
                style={{
                  transform: `translateZ(${half}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="w-full h-full rounded-[6px] bg-gradient-to-b from-white/8 via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Face Traseira (-Z) */}
              <div
                className={`absolute inset-0 rounded-[7px] ${getFaceClass('back', id)}`}
                style={{
                  transform: `rotateY(180deg) translateZ(${half}px)`,
                  backfaceVisibility: 'hidden',
                }}
              />

              {/* Face Direita (+X) */}
              <div
                className={`absolute inset-0 rounded-[7px] ${getFaceClass('right', id)}`}
                style={{
                  transform: `rotateY(90deg) translateZ(${half}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="w-full h-full rounded-[6px] bg-gradient-to-r from-white/6 via-transparent to-black/35 pointer-events-none" />
              </div>

              {/* Face Esquerda (-X) */}
              <div
                className={`absolute inset-0 rounded-[7px] ${getFaceClass('left', id)}`}
                style={{
                  transform: `rotateY(-90deg) translateZ(${half}px)`,
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Legenda editorial minimalista estilo Resend */}
      <div className="mt-3 text-center pointer-events-none select-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300/80 dark:border-white/[0.1] bg-white/60 dark:bg-white/[0.03] text-[11px] font-mono tracking-widest uppercase text-slate-700 dark:text-[#cbd5e1] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] dark:bg-[#FB923C]" />
          <span>FUNDAÇÃO · ATRAÇÃO · CONEXÃO</span>
        </div>
      </div>
    </div>
  )
}

export default HeroMagicCube
