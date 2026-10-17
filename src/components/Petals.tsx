import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Petal = {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  sway: number
  swaySpeed: number
  rot: number
  vrot: number
  alpha: number
  hue: number
  kind: 0 | 1 // 0 = pétalo, 1 = corazón
}

type Props = {
  /** Colores tomados del capítulo activo. */
  colors: string[]
  /** Cantidad de partículas (se reduce en móvil). */
  density?: number
}

/** Lluvia suave de pétalos y corazones que acompaña toda la carta. */
export function Petals({ colors, density = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorsRef = useRef(colors)
  const reduced = usePrefersReducedMotion()

  // Los colores del canvas se leen dentro del bucle de animación.
  useEffect(() => {
    colorsRef.current = colors
  }, [colors])

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let petals: Petal[] = []
    let raf = 0
    let last = performance.now()
    let running = true

    const isSmall = window.matchMedia('(max-width: 720px)').matches
    const count = Math.round((isSmall ? 22 : 42) * density)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const make = (initial: boolean): Petal => {
      const r = 3 + Math.random() * 7.5
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : -r * 4,
        r,
        vy: 0.1 + Math.random() * 0.32 + r * 0.006,
        vx: (Math.random() - 0.5) * 0.16,
        sway: 12 + Math.random() * 34,
        swaySpeed: 0.0004 + Math.random() * 0.0011,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.012,
        alpha: 0.14 + Math.random() * 0.34,
        hue: Math.floor(Math.random() * colorsRef.current.length),
        kind: Math.random() < 0.16 ? 1 : 0,
      }
    }

    const seed = () => {
      petals = Array.from({ length: count }, () => make(true))
    }

    const drawHeart = (s: number) => {
      ctx.beginPath()
      ctx.moveTo(0, s * 0.35)
      ctx.bezierCurveTo(0, -s * 0.25, -s, -s * 0.1, -s, s * 0.3)
      ctx.bezierCurveTo(-s, s * 0.85, 0, s * 1.05, 0, s * 1.25)
      ctx.bezierCurveTo(0, s * 1.05, s, s * 0.85, s, s * 0.3)
      ctx.bezierCurveTo(s, -s * 0.1, 0, -s * 0.25, 0, s * 0.35)
      ctx.closePath()
      ctx.fill()
    }

    const frame = (now: number) => {
      if (!running) return
      const dt = Math.min(now - last, 48)
      last = now
      ctx.clearRect(0, 0, width, height)

      for (const p of petals) {
        p.x += (p.vx + Math.sin(now * p.swaySpeed + p.rot) * (p.sway / 100)) * dt * 0.06
        p.y += p.vy * dt * 0.06
        p.rot += p.vrot * dt

        if (p.y - p.r > height) Object.assign(p, make(false))
        if (p.x < -p.r * 6) p.x = width + p.r * 6
        if (p.x > width + p.r * 6) p.x = -p.r * 6

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = colorsRef.current[p.hue] ?? '#ffffff'

        if (p.kind === 1) {
          drawHeart(p.r * 0.95)
        } else {
          // Pétalo: una lágrima asimétrica
          ctx.beginPath()
          ctx.moveTo(0, -p.r)
          ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.35, p.r * 0.7, p.r * 0.75, 0, p.r)
          ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.75, -p.r * 0.9, -p.r * 0.35, 0, -p.r)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      }

      raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    seed()
    const ro = new ResizeObserver(() => {
      resize()
      seed()
    })
    ro.observe(canvas)
    raf = requestAnimationFrame(frame)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced, density])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] h-full w-full"
    />
  )
}