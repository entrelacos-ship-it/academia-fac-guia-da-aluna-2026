import React, { useEffect, useRef, useState } from 'react'

export interface MarqueeItem {
  text: string
  /** Se deve ter destaque em Instrument Serif itálico */
  italic?: boolean
  /** Cor de destaque opcional */
  highlight?: boolean
}

interface ScrollVelocityRowProps {
  items: (string | MarqueeItem)[]
  /** Velocidade base em pixels por segundo (positivo para esquerda, negativo para direita) */
  baseVelocity?: number
  /** Se inverte a direção de scroll */
  reverse?: boolean
  className?: string
  rowClassName?: string
}

const DEFAULT_ITEMS: (string | MarqueeItem)[] = [
  { text: 'Piso Ético', italic: true },
  { text: 'Custos Reais' },
  { text: 'Retirada' },
  { text: 'Markup Divisor', italic: true, highlight: true },
  { text: 'No-show' },
  { text: 'Reserva Técnica' },
  { text: 'Tributos' },
  { text: 'Modelos Clínicos', italic: true },
  { text: 'Sustentabilidade Clínica' },
  { text: 'Método FAC', highlight: true },
]

/**
 * Linha individual que rola continuamente e reage com aceleração suave à velocidade de rolagem (scrollY velocity).
 * Implementado com requestAnimationFrame para performance 60fps sem dependências externas.
 */
export const ScrollVelocityRow: React.FC<ScrollVelocityRowProps> = ({
  items,
  baseVelocity = 35,
  reverse = false,
  className = '',
  rowClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const contentGroupRef = useRef<HTMLDivElement>(null)

  // Referências mutáveis para o loop rAF
  const positionRef = useRef<number>(0)
  const contentWidthRef = useRef<number>(0)
  const lastScrollYRef = useRef<number>(0)
  const scrollVelocityRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const [repeatCount, setRepeatCount] = useState<number>(4)

  useEffect(() => {
    // Inicializar scrollY
    lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const deltaY = currentScrollY - lastScrollYRef.current
      lastScrollYRef.current = currentScrollY

      // Atualiza impulso de velocidade baseado na direção do scroll
      // Multiplicador calibrado para sensação elástica agradável
      scrollVelocityRef.current += deltaY * 1.8
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Medir largura de um bloco de conteúdo para calcular wrapping perfeito
  useEffect(() => {
    const measure = () => {
      if (contentGroupRef.current && containerRef.current) {
        const measuredWidth = contentGroupRef.current.offsetWidth
        contentWidthRef.current = measuredWidth

        const screenWidth = containerRef.current.offsetWidth || window.innerWidth
        if (measuredWidth > 0) {
          // Precisamos de repetições suficientes para preencher 2x a largura da viewport + sobra
          const needed = Math.max(3, Math.ceil((screenWidth * 2.5) / measuredWidth) + 1)
          setRepeatCount((prev) => (prev < needed ? needed : prev))
        }
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
    }
  }, [items])

  // Loop de animação rAF
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      // Movimento desativado pelo usuário: manter estático sem animar
      if (trackRef.current) {
        trackRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
      return
    }

    let animationFrameId: number

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time
      }
      const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.1) // limitador contra saltos após background tab
      lastTimeRef.current = time

      // Amortecimento suave da velocidade de rolagem (fricção física fluida)
      scrollVelocityRef.current *= 0.94

      // Direção base: reverse move para a direita (positivo), normal para a esquerda (negativo)
      // Quando rola para baixo (deltaY > 0), acelera na direção ou reverte dependendo do scroll
      const baseDirection = reverse ? 1 : -1
      const scrollImpulse = scrollVelocityRef.current * (reverse ? -1 : 1)
      const currentSpeed = baseVelocity * baseDirection - scrollImpulse

      // Incremento de posição
      positionRef.current += currentSpeed * deltaTime

      const singleWidth = contentWidthRef.current
      if (singleWidth > 0) {
        // Envolver continuamente sem sobressalto
        while (positionRef.current <= -singleWidth) {
          positionRef.current += singleWidth
        }
        while (positionRef.current > 0) {
          positionRef.current -= singleWidth
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [baseVelocity, reverse])

  const renderContentItems = (keyPrefix: string, isMeasureRef = false) => (
    <div
      ref={isMeasureRef ? contentGroupRef : undefined}
      key={keyPrefix}
      className={`inline-flex items-center shrink-0 whitespace-nowrap ${rowClassName}`}
      aria-hidden={!isMeasureRef}
    >
      {items.map((item, idx) => {
        const itemObj: MarqueeItem = typeof item === 'string' ? { text: item } : item

        return (
          <React.Fragment key={`${keyPrefix}-${idx}`}>
            <span
              className={`inline-flex items-center select-none font-sans font-normal tracking-tight transition-colors ${
                itemObj.highlight
                  ? 'text-slate-800 dark:text-purple-200/90 font-medium'
                  : 'text-slate-600 dark:text-white/60'
              }`}
            >
              {itemObj.italic ? (
                <em className="font-serif-anchor not-italic text-[#7c3aed] dark:text-[#C084FC] text-[1.12em] leading-none pr-0.5">
                  {itemObj.text}
                </em>
              ) : (
                <span>{itemObj.text}</span>
              )}
            </span>
            <span
              className="mx-3.5 sm:mx-5 text-slate-300 dark:text-purple-400/30 select-none text-xs font-mono"
              aria-hidden="true"
            >
              •
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none will-change-transform ${className}`}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform motion-reduce:transform-none motion-reduce:flex-wrap motion-reduce:justify-center"
      >
        {/* Renderiza repetições para loop contínuo infinito */}
        {Array.from({ length: repeatCount }).map((_, index) =>
          renderContentItems(`block-${index}`, index === 0),
        )}
      </div>
    </div>
  )
}

export interface ScrollVelocityMarqueeProps {
  className?: string
  /** Lista opcional de termos customizados */
  itemsRow1?: (string | MarqueeItem)[]
  itemsRow2?: (string | MarqueeItem)[]
}

/**
 * Letreiro animado tipo "Scroll Velocity Marquee" da Academia FAC.
 * Posicionado entre a Hero e a Faixa do Percurso Pedagógico.
 * Integração pura com o fundo roxo da marca (#0D0522) sem cards,
 * com 2 linhas em direções opostas reagindo à velocidade de rolagem da página.
 */
export const ScrollVelocityMarquee: React.FC<ScrollVelocityMarqueeProps> = ({
  className = '',
  itemsRow1,
  itemsRow2,
}) => {
  const row1 = itemsRow1 || DEFAULT_ITEMS

  const row2: (string | MarqueeItem)[] = itemsRow2 || [
    { text: 'Margem Segura' },
    { text: 'Enquadre Ético', italic: true },
    { text: 'Precificação Clínica', highlight: true },
    { text: 'Fórmula FAC' },
    { text: 'Teto & Piso' },
    { text: 'Capacidade Real' },
    { text: 'Horas Clínicas', italic: true },
    { text: 'Independência Financeira' },
    { text: 'Prática Sustentável', highlight: true },
    { text: 'Autoria & Nicho' },
  ]

  return (
    <section
      aria-label="Conceitos do Método FAC em rolagem contínua"
      className={`relative w-full my-0 py-2 sm:py-2.5 overflow-hidden border-y border-slate-200/60 dark:border-white/[0.05] bg-slate-100/40 dark:bg-[#0D0522] ${className}`}
    >
      {/* Máscara de fade suave nas laterais para entrada/saída editorial natural */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-[#F6F6F9] dark:from-[#0D0522] to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-[#F6F6F9] dark:from-[#0D0522] to-transparent z-10"
      />

      <div className="flex flex-col gap-1 sm:gap-1.5 text-sm sm:text-base lg:text-[1.125rem] tracking-tight">
        {/* Linha 1: Move para a esquerda */}
        <ScrollVelocityRow items={row1} baseVelocity={34} reverse={false} className="py-0.5" />

        {/* Linha 2: Move para a direita */}
        <ScrollVelocityRow items={row2} baseVelocity={30} reverse={true} className="py-0.5" />
      </div>
    </section>
  )
}
