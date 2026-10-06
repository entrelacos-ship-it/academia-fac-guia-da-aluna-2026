import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Dimensões do cubo
const CUBE_SIZE = 0.94 // tamanho de cada cubie individual
const SPACING = 1.02 // espaçamento entre centros dos cubies
const CORNER_RADIUS = 0.09 // arredondamento sutil dos chanfros

// Cores dos adesivos inspiradas na identidade visual FAC e na imagem de referência
// Na imagem: tons profundos de violeta/roxo, lilás luminoso, berinjela e ametista brilhante
const STICKER_PALETTE = {
  brightViolet: '#a855f7', // roxo luminoso
  deepPurple: '#6b21a8', // roxo profundo
  lavender: '#c084fc', // lilás claro / destaque central
  midnightPurple: '#4c1d95', // roxo escuro
  grape: '#7e22ce', // uva / violeta intermediário
  accentLilac: '#d8b4fe', // adesivo destaque brilhante (como visto na face frontal)
  innerBody: '#09080e', // corpo plástico preto/grafite profundo com leve tom arroxeado
}

interface PieceConfig {
  id: number
  gridPos: [number, number, number] // [gx, gy, gz] em {-1, 0, 1}
  targetPos: [number, number, number]
  scatterPos: [number, number, number]
  scatterRot: [number, number, number]
  // Cores de cada uma das 6 faces: +X, -X, +Y, -Y, +Z, -Z (ou null se for face interna)
  faceColors: (string | null)[]
}

// Pseudo-gerador pseudo-aleatório determinístico baseado em seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generatePiecesConfig(): PieceConfig[] {
  const pieces: PieceConfig[] = []
  let id = 0

  for (let gx = -1; gx <= 1; gx++) {
    for (let gy = -1; gy <= 1; gy++) {
      for (let gz = -1; gz <= 1; gz++) {
        // Pula o miolo central invisível (0,0,0) -> 26 peças no total
        if (gx === 0 && gy === 0 && gz === 0) continue

        const targetPos: [number, number, number] = [gx * SPACING, gy * SPACING, gz * SPACING]

        // Direção radial a partir do centro
        const rLen = Math.sqrt(gx * gx + gy * gy + gz * gz)
        const dirX = gx / rLen
        const dirY = gy / rLen
        const dirZ = gz / rLen

        // Deslocamento de dispersão orgânico e expansivo
        const seed = id * 13.37
        const spreadDist = 2.4 + pseudoRandom(seed + 1) * 1.8
        const tangentOffset1 = (pseudoRandom(seed + 2) - 0.5) * 1.2
        const tangentOffset2 = (pseudoRandom(seed + 3) - 0.5) * 1.2

        const scatterPos: [number, number, number] = [
          targetPos[0] + dirX * spreadDist + tangentOffset1,
          targetPos[1] + dirY * spreadDist + tangentOffset2,
          targetPos[2] + dirZ * spreadDist + (pseudoRandom(seed + 4) - 0.5) * 1.0,
        ]

        // Rotação dispersa
        const scatterRot: [number, number, number] = [
          (pseudoRandom(seed + 5) - 0.5) * Math.PI * 2.8,
          (pseudoRandom(seed + 6) - 0.5) * Math.PI * 2.8,
          (pseudoRandom(seed + 7) - 0.5) * Math.PI * 2.8,
        ]

        // Definir as cores das faces externas
        // Na referência: o cubo é harmônico em roxos, com peças que variam entre lilás suave, violeta e roxo profundo
        const getStickerColor = (
          faceIndex: number,
          gxVal: number,
          gyVal: number,
          gzVal: number,
        ) => {
          // Destacar a peça central frontal (+Z) com lilás luminoso como na referência
          if (faceIndex === 4 && gxVal === 0 && gyVal === 0 && gzVal === 1) {
            return STICKER_PALETTE.accentLilac
          }
          if (faceIndex === 4 && (gxVal === 1 || gyVal === 1)) {
            return STICKER_PALETTE.lavender
          }
          const faceSeed = (id * 7 + faceIndex * 19) % 5
          switch (faceSeed) {
            case 0:
              return STICKER_PALETTE.deepPurple
            case 1:
              return STICKER_PALETTE.brightViolet
            case 2:
              return STICKER_PALETTE.grape
            case 3:
              return STICKER_PALETTE.midnightPurple
            default:
              return STICKER_PALETTE.lavender
          }
        }

        const faceColors: (string | null)[] = [
          gx === 1 ? getStickerColor(0, gx, gy, gz) : null, // +X (Right)
          gx === -1 ? getStickerColor(1, gx, gy, gz) : null, // -X (Left)
          gy === 1 ? getStickerColor(2, gx, gy, gz) : null, // +Y (Top)
          gy === -1 ? getStickerColor(3, gx, gy, gz) : null, // -Y (Bottom)
          gz === 1 ? getStickerColor(4, gx, gy, gz) : null, // +Z (Front)
          gz === -1 ? getStickerColor(5, gx, gy, gz) : null, // -Z (Back)
        ]

        pieces.push({
          id,
          gridPos: [gx, gy, gz],
          targetPos,
          scatterPos,
          scatterRot,
          faceColors,
        })
        id++
      }
    }
  }

  return pieces
}

// Curva de interpolação suave (easeInOutCubic)
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

interface PieceMeshProps {
  config: PieceConfig
  progressRef: React.MutableRefObject<number>
  reducedMotion: boolean
  baseGeometry: THREE.BufferGeometry
  bodyMaterial: THREE.Material
  stickerMaterialsMap: Record<string, THREE.Material>
  stickerGeometry: THREE.BufferGeometry
}

const PieceMesh: React.FC<PieceMeshProps> = ({
  config,
  progressRef,
  reducedMotion,
  baseGeometry,
  bodyMaterial,
  stickerMaterialsMap,
  stickerGeometry,
}) => {
  const groupRef = useRef<THREE.Group>(null)

  // Stagger escalonado por peça baseado na distância do centro e id
  const staggerOffset = useMemo(() => {
    const dist = Math.sqrt(config.gridPos[0] ** 2 + config.gridPos[1] ** 2 + config.gridPos[2] ** 2)
    // Peças mais centrais se movem primeiro, cantos por último, com leve randomização
    const seed = (config.id * 17) % 100
    const normSeed = seed / 100
    return Math.min(0.35, Math.max(0, (dist - 1) * 0.18 + normSeed * 0.08))
  }, [config])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    if (reducedMotion) {
      groupRef.current.position.set(...config.targetPos)
      groupRef.current.rotation.set(0, 0, 0)
      return
    }

    const rawProg = progressRef.current
    // Mapeia o progresso global para a janela temporal específica desta peça [staggerOffset, staggerOffset + 0.65]
    const windowLength = 0.65
    const localT = Math.min(1, Math.max(0, (rawProg - staggerOffset) / windowLength))
    const eased = easeInOutCubic(localT)

    // Interpolação suave de posição
    const curX = THREE.MathUtils.lerp(config.scatterPos[0], config.targetPos[0], eased)
    const curY = THREE.MathUtils.lerp(config.scatterPos[1], config.targetPos[1], eased)
    const curZ = THREE.MathUtils.lerp(config.scatterPos[2], config.targetPos[2], eased)

    // Leve flutuação idle contínua quando o cubo estiver disperso
    const idleAmplitude = (1 - eased) * 0.08
    const time = state.clock.getElapsedTime()
    const floatY = Math.sin(time * 1.5 + config.id) * idleAmplitude
    const floatX = Math.cos(time * 1.2 + config.id) * idleAmplitude

    groupRef.current.position.set(curX + floatX, curY + floatY, curZ)

    // Interpolação suave de rotação
    const rotX = THREE.MathUtils.lerp(config.scatterRot[0], 0, eased)
    const rotY = THREE.MathUtils.lerp(config.scatterRot[1], 0, eased)
    const rotZ = THREE.MathUtils.lerp(config.scatterRot[2], 0, eased)

    groupRef.current.rotation.set(rotX, rotY, rotZ)
  })

  // Lista de adesivos para renderizar em cada face
  const stickers = useMemo(() => {
    const list: {
      key: string
      color: string
      pos: [number, number, number]
      rot: [number, number, number]
    }[] = []

    const halfSize = CUBE_SIZE / 2 + 0.002 // ligeiramente acima da superfície para evitar z-fighting

    // +X (Right)
    if (config.faceColors[0]) {
      list.push({
        key: 'px',
        color: config.faceColors[0],
        pos: [halfSize, 0, 0],
        rot: [0, Math.PI / 2, 0],
      })
    }
    // -X (Left)
    if (config.faceColors[1]) {
      list.push({
        key: 'nx',
        color: config.faceColors[1],
        pos: [-halfSize, 0, 0],
        rot: [0, -Math.PI / 2, 0],
      })
    }
    // +Y (Top)
    if (config.faceColors[2]) {
      list.push({
        key: 'py',
        color: config.faceColors[2],
        pos: [0, halfSize, 0],
        rot: [-Math.PI / 2, 0, 0],
      })
    }
    // -Y (Bottom)
    if (config.faceColors[3]) {
      list.push({
        key: 'ny',
        color: config.faceColors[3],
        pos: [0, -halfSize, 0],
        rot: [Math.PI / 2, 0, 0],
      })
    }
    // +Z (Front)
    if (config.faceColors[4]) {
      list.push({
        key: 'pz',
        color: config.faceColors[4],
        pos: [0, 0, halfSize],
        rot: [0, 0, 0],
      })
    }
    // -Z (Back)
    if (config.faceColors[5]) {
      list.push({
        key: 'nz',
        color: config.faceColors[5],
        pos: [0, 0, -halfSize],
        rot: [0, Math.PI, 0],
      })
    }

    return list
  }, [config.faceColors])

  return (
    <group ref={groupRef} dispose={null}>
      {/* Corpo plástico chanfrado/arredondado do cubinho - dispose={null} pois o ciclo de vida é gerido em CubeScene */}
      <mesh
        geometry={baseGeometry}
        material={bodyMaterial}
        castShadow
        receiveShadow
        dispose={null}
      />

      {/* Adesivos coloridos com cantos arredondados nas faces externas */}
      {stickers.map((st) => (
        <mesh
          key={st.key}
          geometry={stickerGeometry}
          material={stickerMaterialsMap[st.color]}
          position={st.pos}
          rotation={st.rot}
          castShadow
          receiveShadow
          dispose={null}
        />
      ))}
    </group>
  )
}

// Cena que rotaciona o cubo inteiro suavemente no espaço
const CubeScene: React.FC<{
  progressRef: React.MutableRefObject<number>
  targetProgressRef: React.MutableRefObject<number>
  reducedMotion: boolean
  isHovered: boolean
}> = ({ progressRef, targetProgressRef, reducedMotion, isHovered }) => {
  const sceneGroupRef = useRef<THREE.Group>(null)
  const pieces = useMemo(() => generatePiecesConfig(), [])

  // Geometria chanfrada para o corpo de plástico preto/grafite do cubie
  const baseGeometry = useMemo(() => {
    // Caixa ligeiramente chanfrada
    return new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 4, 4, 4)
  }, [])

  // Geometria para o adesivo: plano ligeiramente menor que a face com bordas pretas visíveis
  const stickerGeometry = useMemo(() => {
    const stickerWidth = CUBE_SIZE * 0.88
    const stickerHeight = CUBE_SIZE * 0.88
    const shape = new THREE.Shape()
    const w = stickerWidth / 2
    const h = stickerHeight / 2
    const r = CORNER_RADIUS

    // Retângulo com cantos arredondados
    shape.moveTo(-w + r, -h)
    shape.lineTo(w - r, -h)
    shape.quadraticCurveTo(w, -h, w, -h + r)
    shape.lineTo(w, h - r)
    shape.quadraticCurveTo(w, h, w - r, h)
    shape.lineTo(-w + r, h)
    shape.quadraticCurveTo(-w, h, -w, h - r)
    shape.lineTo(-w, -h + r)
    shape.quadraticCurveTo(-w, -h, -w + r, -h)

    return new THREE.ShapeGeometry(shape, 8)
  }, [])

  // Material do corpo plástico preto realista do cubinho
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(STICKER_PALETTE.innerBody),
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      reflectivity: 0.5,
    })
  }, [])

  // Mapa de materiais memoizados para cada tom de adesivo (brilho plástico premium)
  const stickerMaterialsMap = useMemo(() => {
    const map: Record<string, THREE.Material> = {}
    const colors = [
      STICKER_PALETTE.brightViolet,
      STICKER_PALETTE.deepPurple,
      STICKER_PALETTE.lavender,
      STICKER_PALETTE.midnightPurple,
      STICKER_PALETTE.grape,
      STICKER_PALETTE.accentLilac,
    ]

    colors.forEach((col) => {
      map[col] = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(col),
        roughness: 0.18,
        metalness: 0.05,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        reflectivity: 0.85,
        emissive: new THREE.Color(col),
        emissiveIntensity: col === STICKER_PALETTE.accentLilac ? 0.18 : 0.06,
      })
    })

    return map
  }, [])

  // Limpeza segura de recursos Three ao desmontar
  useEffect(() => {
    return () => {
      // Executa o descarte em macro/microtask assíncrono para permitir que o reconciliador
      // R3F desmonte com segurança todos os nós e nós-filhos do container sem tentar
      // acessar nós ou estruturas internas já descartadas concorrentemente.
      setTimeout(() => {
        try {
          baseGeometry.dispose()
          stickerGeometry.dispose()
          bodyMaterial.dispose()
          Object.values(stickerMaterialsMap).forEach((mat) => mat.dispose())
        } catch {
          // No-op para evitar falhas silenciosas na desmontagem
        }
      }, 0)
    }
  }, [baseGeometry, stickerGeometry, bodyMaterial, stickerMaterialsMap])

  // Ângulo isométrico similar à imagem de referência:
  // Cubo visto ligeiramente de cima e da direita (ex: rotação X de ~22º, rotação Y de ~-38º, rotação Z leve)
  const baseRotationX = 0.38 // ~22 graus para baixo
  const baseRotationY = -0.65 // ~-37 graus para a direita
  const baseRotationZ = 0.08

  useFrame((state, delta) => {
    // Amortecimento lerp do progresso de scroll para garantir transição suave e orgânica
    if (reducedMotion) {
      progressRef.current = 1
    } else {
      const target = targetProgressRef.current
      progressRef.current += (target - progressRef.current) * Math.min(1, delta * 7)
    }

    if (sceneGroupRef.current) {
      const time = state.clock.getElapsedTime()
      const p = progressRef.current

      // Rotação sutil da cena com o progresso de montagem + leve balanço dinâmico
      // Quando desmontado: inclinação levemente mais livre; quando montado: alinhamento nítido e elegante como na foto
      const progressBonusY = (1 - p) * 0.35
      const hoverBonusY = isHovered ? Math.sin(time * 2) * 0.08 : 0
      const hoverBonusX = isHovered ? Math.cos(time * 2) * 0.05 : 0

      // Rotação suave idle contínua
      const idleY = Math.sin(time * 0.5) * 0.06

      sceneGroupRef.current.rotation.x = baseRotationX + hoverBonusX + (1 - p) * 0.2
      sceneGroupRef.current.rotation.y = baseRotationY + idleY + progressBonusY + hoverBonusY
      sceneGroupRef.current.rotation.z = baseRotationZ + Math.sin(time * 0.7) * 0.02
    }
  })

  return (
    <group ref={sceneGroupRef} dispose={null}>
      {pieces.map((piece) => (
        <PieceMesh
          key={piece.id}
          config={piece}
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          baseGeometry={baseGeometry}
          bodyMaterial={bodyMaterial}
          stickerMaterialsMap={stickerMaterialsMap}
          stickerGeometry={stickerGeometry}
        />
      ))}
    </group>
  )
}

// Error Boundary resiliente exclusivo para o Canvas 3D para isolar qualquer falha WebGL/R3F
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('[HeroMagicCube] Recuperado de erro interno no renderizador 3D:', error)
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

export const HeroMagicCube: React.FC<HeroMagicCubeProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Detectar preferência de movimento reduzido (acessibilidade)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Scroll mapping robusto da janela da página:
  // Conforme o scroll avança a partir do topo até o cubo ultrapassar a hero, o valor de 0 a 1 evolui suavemente
  useEffect(() => {
    if (reducedMotion) {
      targetProgressRef.current = 1
      progressRef.current = 1
      return
    }

    const calculateScrollProgress = () => {
      if (!containerRef.current) return

      // Medição robusta baseada na posição do elemento na viewport e scroll da página
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      const scrollY = window.scrollY || window.pageYOffset || 0

      // Início do efeito: scrollY = 0 -> progress = 0 (totalmente desmontado)
      // Conforme o usuário rola a página, a hero viaja pela viewport.
      // Distância de montagem: entre 0 e min(windowHeight * 0.55, 380px)
      const maxScrollDistance = Math.min(Math.max(windowHeight * 0.5, 260), 400)
      let progress = scrollY / maxScrollDistance

      if (progress < 0) progress = 0
      if (progress > 1) progress = 1

      targetProgressRef.current = progress
    }

    calculateScrollProgress()

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', calculateScrollProgress)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', calculateScrollProgress)
    }
  }, [reducedMotion])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col items-center justify-center select-none pointer-events-auto ${className}`}
      aria-label="Cubo Mágico FAC em 3D: interativo via scroll da página"
    >
      {/* Halo de luz de estúdio roxo no fundo (astral glow sutil) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full bg-radial from-[#9333ea]/30 via-[#6b21a8]/15 to-transparent blur-3xl opacity-90" />
      </div>

      {/* Canvas 3D envolto com ErrorBoundary */}
      <div className="w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] relative pointer-events-none">
        <CanvasErrorBoundary>
          <Canvas
            dpr={[1, 2]} // Performance otimizada: cap em 2x retina
            camera={{ position: [0, 0, 7.8], fov: 42 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
            className="pointer-events-none"
          >
            {/* Iluminação de estúdio profissional */}
            {/* Luz ambiente suave com tom arroxeado frio */}
            <ambientLight intensity={0.9} color="#d8b4fe" />

            {/* Key Light principal: topo direito com tom lilás branco potente */}
            <directionalLight
              position={[5, 8, 6]}
              intensity={2.5}
              color="#ffffff"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />

            {/* Fill Light: lado esquerdo inferior com tom violeta da marca */}
            <directionalLight position={[-6, -3, 3]} intensity={1.6} color="#9333ea" />

            {/* Rim Light / Back Light: atrás do cubo para recortar as bordas de plástico escuro */}
            <pointLight position={[0, 4, -5]} intensity={2.8} color="#c084fc" distance={15} />

            {/* Luz frontal suave para realçar o adesivo de destaque lilás */}
            <pointLight position={[0, 0, 6]} intensity={1.3} color="#e9d5ff" distance={12} />

            {/* O Cubo Mágico Montável */}
            <CubeScene
              progressRef={progressRef}
              targetProgressRef={targetProgressRef}
              reducedMotion={reducedMotion}
              isHovered={isHovered}
            />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Legenda: FUNDAÇÃO · ATRAÇÃO · CONEXÃO */}
      <div className="mt-2 text-center pointer-events-none select-none">
        <div className="text-[11px] sm:text-xs font-mono font-bold uppercase text-purple-700 dark:text-[#C084FC]/95 tracking-[0.24em] transition-colors drop-shadow-xs">
          FUNDAÇÃO · ATRAÇÃO · CONEXÃO
        </div>
      </div>
    </div>
  )
}

export default HeroMagicCube
