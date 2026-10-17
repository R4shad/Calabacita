import { useEffect, useRef } from 'react'

type Props = {
  sky: string[]
  glow: string
  spark: string
}

/**
 * Fondo de la escena: degradado del capítulo + manchas de luz que flotan
 * + grano + viñeta + un halo que sigue al cursor.
 */
export function Ambient({ sky, glow, spark }: Props) {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = glowRef.current
    if (!el) return
    if (window.matchMedia('(hover: none)').matches) return

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const loop = () => {
      cx += (x - cx) * 0.075
      cy += (y - cy) * 0.075
      el.style.transform = `translate3d(${cx - 320}px, ${cy - 320}px, 0)`
      raf = Math.abs(x - cx) > 0.5 || Math.abs(y - cy) > 0.5 ? requestAnimationFrame(loop) : 0
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Degradado base, se transiciona al cambiar de capítulo */}
      <div
        className="absolute inset-0 transition-[background] duration-[1400ms] ease-out"
        style={{
          background: `linear-gradient(175deg, ${sky[0]} 0%, ${sky[1]} 52%, ${sky[2]} 100%)`,
        }}
      />

      {/* Manchas de luz */}
      <div
        className="animate-float-slow absolute -top-[28%] -left-[18%] h-[78vmax] w-[78vmax] rounded-full opacity-45 blur-[110px]"
        style={{ background: `radial-gradient(circle at 40% 40%, ${glow}, transparent 62%)` }}
      />
      <div
        className="animate-float-slow absolute top-[26%] -right-[26%] h-[66vmax] w-[66vmax] rounded-full opacity-30 blur-[120px]"
        style={{
          background: `radial-gradient(circle at 60% 50%, ${spark}, transparent 64%)`,
          animationDelay: '-9s',
          animationDuration: '34s',
        }}
      />
      <div
        className="animate-float-slow absolute bottom-[-30%] left-[24%] h-[70vmax] w-[70vmax] rounded-full opacity-25 blur-[130px]"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow}, transparent 60%)`,
          animationDelay: '-18s',
          animationDuration: '42s',
        }}
      />

      {/* Halo que sigue al cursor */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 h-[640px] w-[640px] rounded-full opacity-[0.16] blur-[70px] transition-opacity duration-700"
        style={{ background: `radial-gradient(circle, ${spark}, transparent 58%)` }}
      />

      {/* Grano */}
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, transparent 38%, rgba(9,3,10,0.55) 100%)',
        }}
      />
    </div>
  )
}