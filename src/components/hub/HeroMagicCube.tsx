import React, { useRef, useEffect, useState, Component, type ReactNode } from 'react'
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
  accentLilac: '#d8b4fe', // adesivo destaque brilhante (face frontal)
  innerBody: '#09080e', // corpo plástico preto/grafite profundo com leve tom arroxeado
}

interface PieceConfig {
  id: number
  gridPos: [number, number, number] // [gx, gy, gz] em {-1, 0, 1}
  targetPos: [number, number, number]
  scatterPos: [number, number, number]
  scatterRot: [number, number, number]
  staggerOffset: number
  // Cores de cada uma das 6 faces: +X, -X, +Y, -Y, +Z, -Z (ou null se for face interna)
  faceColors: (string | null)[]
}

// Pseudo-gerador pseudo-aleatório determinístico baseado em seed
function pseudoRandom(seed: number): number {
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

        // Stagger escalonado por peça baseado na distância do centro e id
        const dist = Math.sqrt(gx * gx + gy * gy + gz * gz)
        const normSeed = ((id * 17) % 100) / 100
        const staggerOffset = Math.min(0.35, Math.max(0, (dist - 1) * 0.18 + normSeed * 0.08))

        // Definir as cores das faces externas
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
          staggerOffset,
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

/**
 * Cria a geometria de adesivo com cantos arredondados
 */
function createStickerGeometry(): THREE.ShapeGeometry {
  const stickerWidth = CUBE_SIZE * 0.88
  const stickerHeight = CUBE_SIZE * 0.88
  const shape = new THREE.Shape()
  const w = stickerWidth / 2
  const h = stickerHeight / 2
  const r = CORNER_RADIUS

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
}

/**
 * Error Boundary resiliente para isolar qualquer falha 3D/WebGL
 * Se algo falhar internamente, apenas o cubo some, nunca a página do Hub.
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
    console.warn('[HeroMagicCube] Recuperado de erro no renderizador 3D:', error)
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

/**
 * Componente HeroMagicCube implementado com Three.js puro gerenciado via canvas + useRef.
 * - 100% livre de reconciliadores externos (R3F)
 * - Imune a contaminações de props (data-*, data-prohibitions, etc.)
 * - Ciclo de vida estrito com guarda isDisposed em todos os callbacks (rAF, resize, scroll)
 * - Zero re-renders do React durante animação / scroll
 * - Suporte a prefers-reduced-motion
 * - pointer-events-none (não intercepta scroll da página)
 */
export const HeroMagicCube: React.FC<HeroMagicCubeProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Referências mutáveis para animação suave desacoplada do ciclo do React
  const progressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const isHoveredRef = useRef(false)
  const reducedMotionRef = useRef(false)

  // Estado apenas para sincronizar reduced-motion inicial/reativo
  const [reducedMotionState, setReducedMotionState] = useState(false)

  // Detectar preferência de movimento reduzido (acessibilidade)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const matches = mediaQuery.matches
    reducedMotionRef.current = matches
    setReducedMotionState(matches)
    if (matches) {
      progressRef.current = 1
      targetProgressRef.current = 1
    }

    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
      setReducedMotionState(e.matches)
      if (e.matches) {
        progressRef.current = 1
        targetProgressRef.current = 1
      }
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Efeito principal: inicialização, loop de animação e cleanup do Three.js puro
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let isDisposed = false
    let animationFrameId: number | null = null

    // 1. Scene, Camera e Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, 7.8)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.15
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    } catch (err) {
      console.warn('[HeroMagicCube] Falha ao inicializar WebGLRenderer:', err)
      return
    }

    // 2. Luzes de estúdio profissionais (idênticas à especificação visual)
    const ambientLight = new THREE.AmbientLight(0xd8b4fe, 0.9)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(5, 8, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.0001
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x9333ea, 1.6)
    fillLight.position.set(-6, -3, 3)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xc084fc, 2.8, 15)
    rimLight.position.set(0, 4, -5)
    scene.add(rimLight)

    const frontLight = new THREE.PointLight(0xe9d5ff, 1.3, 12)
    frontLight.position.set(0, 0, 6)
    scene.add(frontLight)

    // 3. Geometrias e Materiais compartilhados
    const baseGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 4, 4, 4)
    const stickerGeometry = createStickerGeometry()

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(STICKER_PALETTE.innerBody),
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      reflectivity: 0.5,
    })

    const stickerMaterialsMap: Record<string, THREE.MeshPhysicalMaterial> = {}
    const colors = [
      STICKER_PALETTE.brightViolet,
      STICKER_PALETTE.deepPurple,
      STICKER_PALETTE.lavender,
      STICKER_PALETTE.midnightPurple,
      STICKER_PALETTE.grape,
      STICKER_PALETTE.accentLilac,
    ]

    colors.forEach((col) => {
      stickerMaterialsMap[col] = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(col),
        roughness: 0.18,
        metalness: 0.05,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        reflectivity: 0.85,
        emissive: new THREE.Color(col),
        emissiveIntensity: col === STICKER_PALETTE.accentLilac ? 0.18 : 0.06,
        side: THREE.DoubleSide,
      })
    })

    // 4. Montar o grafo da cena com as 26 peças e adesivos
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    const piecesConfig = generatePiecesConfig()
    const pieceNodes: {
      group: THREE.Group
      config: PieceConfig
    }[] = []

    const halfSize = CUBE_SIZE / 2 + 0.002 // ligeiramente acima da face para evitar z-fighting

    piecesConfig.forEach((cfg) => {
      const pieceGroup = new THREE.Group()

      // Cubo base de plástico
      const bodyMesh = new THREE.Mesh(baseGeometry, bodyMaterial)
      bodyMesh.castShadow = true
      bodyMesh.receiveShadow = true
      pieceGroup.add(bodyMesh)

      // Adesivos em cada face externa
      // +X
      if (cfg.faceColors[0] && stickerMaterialsMap[cfg.faceColors[0]]) {
        const m = new THREE.Mesh(stickerGeometry, stickerMaterialsMap[cfg.faceColors[0]])
        m.position.set(halfSize, 0, 0)
        m.rotation.set(0, Math.PI / 2, 0)
        m.castShadow = true
        m.receiveShadow = true
        pieceGroup.add(m)
      }
      // -X
      if (cfg.faceColors[1] && stickerMaterialsMap[cfg.faceColors[1]]) {
        const m = new THREE.Mesh(stickerGeometry, stickerMaterialsMap[cfg.faceColors[1]])
        m.position.set(-halfSize, 0, 0)
        m.rotation.set(0, -Math.PI / 2, 0)
        m.castShadow = true
        m.receiveShadow = true
        pieceGroup.add(m)
      }
      // +Y
      if (cfg.faceColors[2] && stickerMaterialsMap[cfg.faceColors[2]]) {
        const m = new THREE.Mesh(stickerGeometry, stickerMaterialsMap[cfg.faceColors[2]])
        m.position.set(0, halfSize, 0)
        m.rotation.set(-Math.PI / 2, 0, 0)
        m.castShadow = true
        m.receiveShadow = true
        pieceGroup.add(m)
      }
      // -Y
      if (cfg.faceColors[3] && stickerMaterialsMap[cfg.faceColors[3]]) {
        const m = new THREE.Mesh(stickerGeometry, stickerMaterialsMap[cfg.faceColors[3]])
        m.position.set(0, -halfSize, 0)
        m.rotation.set(Math.PI / 2, 0, 0)
        m.castShadow = true
        m.receiveShadow = true
        pieceGroup.add(m)
      }
      // +Z
      if (cfg.faceColors[4] && stickerMaterialsMap[cfg.faceColors[4]]) {
        const m = new THREE.Mesh(stickerGeometry, stickerMaterialsMap[cfg.faceColors[4]])
        m.position.set(0, 0, halfSize)
        m.rotation.set(0, 0, 0)
        m.castShadow = true
        m.receiveShadow = true
        pieceGroup.add(m)
      }
      // -Z
      if (cfg.faceColors[5] && stickerMaterialsMap[cfg.faceColors[5]]) {
        const m = new THREE.Mesh(stickerGeometry, stickerMaterialsMap[cfg.faceColors[5]])
        m.position.set(0, 0, -halfSize)
        m.rotation.set(0, Math.PI, 0)
        m.castShadow = true
        m.receiveShadow = true
        pieceGroup.add(m)
      }

      rootGroup.add(pieceGroup)
      pieceNodes.push({ group: pieceGroup, config: cfg })
    })

    // 5. Redimensionamento responsivo do Canvas
    const resize = () => {
      if (isDisposed || !renderer || !canvas) return
      const rect = canvas.getBoundingClientRect()
      const width = rect.width || 360
      const height = rect.height || 360

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    resize()

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (!isDisposed) resize()
      })
      resizeObserver.observe(canvas)
    }

    // 6. Cálculo do Scroll Progress
    const calculateScrollProgress = () => {
      if (isDisposed || !container) return

      if (reducedMotionRef.current) {
        targetProgressRef.current = 1
        progressRef.current = 1
        return
      }

      const windowHeight = window.innerHeight || document.documentElement.clientHeight || 800
      const scrollY = window.scrollY || window.pageYOffset || 0
      const maxScrollDistance = Math.min(Math.max(windowHeight * 0.5, 260), 400)

      let progress = scrollY / maxScrollDistance
      if (progress < 0) progress = 0
      if (progress > 1) progress = 1

      targetProgressRef.current = progress
    }

    calculateScrollProgress()

    let ticking = false
    const onScroll = () => {
      if (!ticking && !isDisposed) {
        window.requestAnimationFrame(() => {
          if (!isDisposed) calculateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    const onWindowResize = () => {
      if (!isDisposed) {
        calculateScrollProgress()
        resize()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onWindowResize)

    // 7. Loop de Animação com Clock
    const clock = new THREE.Clock()
    const baseRotationX = 0.38
    const baseRotationY = -0.65
    const baseRotationZ = 0.08
    const windowLength = 0.65

    const animate = () => {
      if (isDisposed || !renderer) return

      animationFrameId = window.requestAnimationFrame(animate)

      const delta = Math.min(clock.getDelta(), 0.1)
      const elapsedTime = clock.getElapsedTime()

      // Interpolação suave do progresso do scroll
      if (reducedMotionRef.current) {
        progressRef.current = 1
      } else {
        const target = targetProgressRef.current
        progressRef.current += (target - progressRef.current) * Math.min(1, delta * 7)
      }

      const p = progressRef.current
      const isHovered = isHoveredRef.current

      // Rotação suave da cena global
      const progressBonusY = (1 - p) * 0.35
      const hoverBonusY = isHovered ? Math.sin(elapsedTime * 2) * 0.08 : 0
      const hoverBonusX = isHovered ? Math.cos(elapsedTime * 2) * 0.05 : 0
      const idleY = Math.sin(elapsedTime * 0.5) * 0.06

      rootGroup.rotation.x = baseRotationX + hoverBonusX + (1 - p) * 0.2
      rootGroup.rotation.y = baseRotationY + idleY + progressBonusY + hoverBonusY
      rootGroup.rotation.z = baseRotationZ + Math.sin(elapsedTime * 0.7) * 0.02

      // Animar cada uma das 26 peças com stagger e flutuação orgânica
      for (let i = 0; i < pieceNodes.length; i++) {
        const node = pieceNodes[i]
        const cfg = node.config
        const group = node.group

        if (reducedMotionRef.current) {
          group.position.set(cfg.targetPos[0], cfg.targetPos[1], cfg.targetPos[2])
          group.rotation.set(0, 0, 0)
          continue
        }

        const localT = Math.min(1, Math.max(0, (p - cfg.staggerOffset) / windowLength))
        const eased = easeInOutCubic(localT)

        // Posição lerp
        const curX = THREE.MathUtils.lerp(cfg.scatterPos[0], cfg.targetPos[0], eased)
        const curY = THREE.MathUtils.lerp(cfg.scatterPos[1], cfg.targetPos[1], eased)
        const curZ = THREE.MathUtils.lerp(cfg.scatterPos[2], cfg.targetPos[2], eased)

        // Leve flutuação idle contínua quando o cubo estiver disperso
        const idleAmplitude = (1 - eased) * 0.08
        const floatY = Math.sin(elapsedTime * 1.5 + cfg.id) * idleAmplitude
        const floatX = Math.cos(elapsedTime * 1.2 + cfg.id) * idleAmplitude

        group.position.set(curX + floatX, curY + floatY, curZ)

        // Rotação lerp
        const rotX = THREE.MathUtils.lerp(cfg.scatterRot[0], 0, eased)
        const rotY = THREE.MathUtils.lerp(cfg.scatterRot[1], 0, eased)
        const rotZ = THREE.MathUtils.lerp(cfg.scatterRot[2], 0, eased)

        group.rotation.set(rotX, rotY, rotZ)
      }

      renderer.render(scene, camera)
    }

    animate()

    // 8. Cleanup estrito: cancela rAF, remove observers, listeners e faz dispose manual seguro
    return () => {
      isDisposed = true

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }

      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onWindowResize)

      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }

      // Descartar geometrias e materiais
      try {
        baseGeometry.dispose()
        stickerGeometry.dispose()
        bodyMaterial.dispose()

        Object.values(stickerMaterialsMap).forEach((mat) => {
          mat.dispose()
        })

        // Limpar scene
        while (rootGroup.children.length > 0) {
          const child = rootGroup.children[0]
          rootGroup.remove(child)
        }
        scene.remove(rootGroup)

        // Dispose renderer e liberar contexto WebGL
        if (renderer) {
          renderer.dispose()
          renderer.forceContextLoss()
          renderer = null
        }
      } catch (err) {
        console.warn('[HeroMagicCube] Erro durante dispose de recursos Three.js:', err)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false
      }}
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

      {/* Canvas 3D Three.js puro: isolado, pointer-events-none para não capturar scroll */}
      <div className="w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] relative pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
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
