import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { assetUrl } from '../lib/assets'
import { setNavLock } from '../lib/navLock'
import { photoFrame } from '../lib/photo'
import type { Photo } from '../lib/types'

type Props = {
  photos: Photo[]
  /** Índice inicial, o `null` si el visor está cerrado. */
  index: number | null
  onClose: () => void
  onIndexChange: (i: number) => void
}

/** Visor de imágenes a pantalla completa, con teclado y gestos. */
export function PhotoViewer({ photos, index, onClose, onIndexChange }: Props) {
  const open = index !== null

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndexChange((index + delta + photos.length) % photos.length)
    },
    [index, photos.length, onIndexChange],
  )

  /* Bloquea la navegación de la carta mientras el visor está abierto. */
  useEffect(() => {
    setNavLock(open)
    return () => setNavLock(false)
  }, [open])

  /* Teclado */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  /* Gesto de deslizar */
  useEffect(() => {
    if (!open) return
    let y0 = 0
    let x0 = 0
    const start = (e: TouchEvent) => {
      y0 = e.touches[0].clientY
      x0 = e.touches[0].clientX
    }
    const end = (e: TouchEvent) => {
      const dy = e.changedTouches[0].clientY - y0
      const dx = e.changedTouches[0].clientX - x0
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
      else if (Math.abs(dy) > 60) {
        if (dy < 0) go(1)
        else if (dy > 90) onClose()
      }
    }
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchend', end, { passive: true })
    return () => {
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchend', end)
    }
  }, [open, go, onClose])

  const photo = index === null ? null : photos[index]
  const frame = photo ? photoFrame(photo) : null

  return (
    <AnimatePresence>
      {open && photo && frame && (
        <motion.div
          className="fixed inset-0 z-60 grid place-items-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32 }}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de recuerdos"
        >
          <button
            type="button"
            aria-label="Cerrar el visor"
            onClick={onClose}
            className="absolute inset-0 cursor-zoom-out bg-[#0b040e]/96 backdrop-blur-lg"
          />

          {/* Imagen */}
          <motion.figure
            key={photo.src}
            className="relative flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            <div
              className="relative overflow-hidden rounded-lg bg-black/20 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
              style={{
                width: `min(92vw, ${(76 * frame.ratio).toFixed(2)}vh)`,
                aspectRatio: String(frame.ratio),
              }}
            >
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  ...frame.box,
                  transform: `translate(-50%, -50%) rotate(${frame.rotate}deg)`,
                }}
              >
                <ViewerImage key={photo.src} src={assetUrl(photo.src)} alt={photo.caption ?? ''} />
              </div>
            </div>

            <figcaption className="flex items-center gap-3 text-center">
              <span className="h-px w-8 bg-white/25" />
              <span className="font-hand text-[22px] text-white/90">
                {photo.caption ?? ''}
              </span>
              <span className="h-px w-8 bg-white/25" />
            </figcaption>
            <span className="font-ui text-[10px] tracking-[0.34em] text-white/50 uppercase">
              {(index ?? 0) + 1} / {photos.length}
            </span>
          </motion.figure>

          {/* Controles */}
          {photos.length > 1 && (
            <>
              <NavButton side="left" onClick={() => go(-1)} />
              <NavButton side="right" onClick={() => go(1)} />
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-5 right-5 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white/85 backdrop-blur-md transition hover:border-[var(--glow)] hover:text-white active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Imagen del visor con un fundido suave mientras carga. */
function ViewerImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={`h-full w-full object-contain transition-opacity duration-500 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const left = side === 'left'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? 'Foto anterior' : 'Foto siguiente'}
      className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white/85 backdrop-blur-md transition hover:scale-105 hover:border-[var(--glow)] active:scale-95 ${
        left ? 'left-3 sm:left-8' : 'right-3 sm:right-8'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d={left ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}