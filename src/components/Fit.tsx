import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Escala su contenido para que quepa siempre dentro del espacio disponible,
 * sin cortar texto nunca. Necesario porque el papel cambia de tamaño con el
 * móvil y porque los párrafos de la carta son largos y variables.
 *
 * El contenido se centra con `position: absolute` + `translate(-50%, -50%)`
 * porque un `grid place-items-center` no lo centra cuando el elemento es más
 * alto que su contenedor (la fila crece), que es justo el caso que queremos.
 */
export function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const update = () => {
      const o = outer.current
      const i = inner.current
      if (!o || !i) return

      // clientHeight/Width incluyen el padding: hay que descontarlo.
      const cs = getComputedStyle(o)
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)

      const availH = o.clientHeight - padY
      const availW = o.clientWidth - padX
      const contentH = i.scrollHeight
      const contentW = Math.max(i.scrollWidth, 1)

      if (!availH || !contentH) return

      // Margen de seguridad para que nada roce los bordes del papel.
      const k = Math.min(1, (availH * 0.97) / contentH, (availW * 0.97) / contentW)
      setScale((prev) => (Math.abs(prev - k) > 0.004 ? k : prev))
    }

    update()

    const ro = new ResizeObserver(update)
    if (outer.current) ro.observe(outer.current)
    if (inner.current) ro.observe(inner.current)

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    void fonts?.ready.then(update).catch(() => {})
    const timers = [180, 500, 1000].map((d) => window.setTimeout(update, d))

    return () => {
      ro.disconnect()
      timers.forEach(window.clearTimeout)
    }
  }, [])

  return (
    <div ref={outer} className="relative h-full w-full overflow-hidden px-6 py-9">
      <div
        ref={inner}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'calc(100% - 3rem)',
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="will-change-transform"
      >
        {children}
      </div>
    </div>
  )
}