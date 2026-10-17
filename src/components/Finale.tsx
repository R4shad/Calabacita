import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { assetUrl } from '../lib/assets'
import { photoFrame } from '../lib/photo'
import type { LetterContent, Photo } from '../lib/types'
import { PhotoViewer } from './PhotoViewer'
import { RevealParagraph } from './RevealParagraph'

/** Pseudo-aleatorio determinista (evita `Math.random` durante el render). */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Explosión de corazones. */
function HeartBurst({ trigger }: { trigger: number }) {
  const hearts = Array.from({ length: 28 }, (_, i) => {
    const s = trigger * 31 + i
    return {
      id: `${trigger}-${i}`,
      x: (rand(s) - 0.5) * 620,
      y: -150 - rand(s + 1) * 460,
      r: rand(s + 2) * -90,
      d: rand(s + 3) * 0.55,
      size: 13 + rand(s + 4) * 26,
    }
  })

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-[var(--glow)]"
          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1, 1, 0.55],
            x: h.x,
            y: h.y,
            rotate: h.r,
          }}
          transition={{ duration: 2.5, delay: h.d, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: h.size }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

type Props = {
  content: LetterContent
  onRestart: () => void
}

/** Cierre de la carta: el feliz cumpleaños y la galería de recuerdos. */
export function Finale({ content, onRestart }: Props) {
  const [burst, setBurst] = useState(0)
  const [photo, setPhoto] = useState<number | null>(null)

  const gallery: Photo[] = content.gallery ?? []
  const hasGallery = gallery.length > 0

  return (
    <motion.section
      className="relative grid h-stage place-items-center overflow-y-auto px-6 py-24"
      initial={{ opacity: 0, scale: 1.06, filter: 'blur(16px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <HeartBurst trigger={burst} />

      {/* Halo */}
      <motion.div
        aria-hidden
        className="paper-halo pointer-events-none absolute h-[68vmin] w-[68vmin] rounded-full blur-[95px]"
        style={{
          background: 'radial-gradient(circle, var(--glow), transparent 64%)',
          opacity: 0.3,
        }}
      />

      <div className="relative flex w-full max-w-[640px] flex-col items-center gap-5 text-center sm:gap-6">
        {content.finale.kicker && (
          <motion.span
            className="font-ui text-[10px] tracking-[0.52em] text-white/70 uppercase"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            {content.finale.kicker}
          </motion.span>
        )}

        <motion.h2
          className="shimmer font-display text-[clamp(2.5rem,10vw,5.6rem)] leading-[0.98] font-semibold tracking-[-0.015em]"
          initial={{ opacity: 0, y: 34, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.finale.title}
        </motion.h2>

        <motion.span
          className="flex items-center gap-3 text-[var(--glow)]"
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <span className="h-px w-12 bg-current opacity-40" />
          <span className="text-sm">✦</span>
          <span className="h-px w-12 bg-current opacity-40" />
        </motion.span>

        <div className="flex justify-center">
          <RevealParagraph text={content.finale.message} delay={0.85} tone="light" />
        </div>

        {/* Firma */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
        >
          <span className="font-hand text-[clamp(2.1rem,6vw,3.1rem)] leading-none text-white/95">
            {content.signature}
          </span>
          <span className="font-ui text-[9.5px] tracking-[0.4em] text-white/55 uppercase">
            {content.date}
          </span>
        </motion.div>

        {/* Acciones */}
        <motion.div
          className="mt-3 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
        >
          {hasGallery && (
            <button
              type="button"
              onClick={() => {
                setPhoto(0)
                setBurst((b) => b + 1)
              }}
              className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-6 py-3 font-ui text-[10px] tracking-[0.26em] whitespace-nowrap text-white uppercase backdrop-blur-md transition hover:border-[var(--glow)] hover:bg-white/16 active:scale-95"
            >
              Ver los recuerdos
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="cursor-pointer rounded-full border border-white/15 px-6 py-3 font-ui text-[10px] tracking-[0.26em] whitespace-nowrap text-white/70 uppercase backdrop-blur-md transition hover:border-white/40 hover:text-white active:scale-95"
          >
            Volver a leer
          </button>
        </motion.div>

        {/* Miniaturas */}
        <AnimatePresence>
          {hasGallery && (
            <motion.div
              className="mt-2 flex flex-wrap items-center justify-center gap-2.5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.7 }}
            >
              {gallery.map((g, i) => (
                <Thumb key={g.src} photo={g} onClick={() => setPhoto(i)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PhotoViewer
        photos={gallery}
        index={photo}
        onClose={() => setPhoto(null)}
        onIndexChange={setPhoto}
      />
    </motion.section>
  )
}

/** Miniatura con la orientación real de la foto. */
function Thumb({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const { box, rotate } = photoFrame(photo)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ampliar: ${photo.caption ?? 'recuerdo'}`}
      className="relative h-16 w-16 cursor-zoom-in overflow-hidden rounded-lg border border-white/15 bg-black/30 transition hover:border-[var(--glow)] active:scale-95"
    >
      <div
        className="absolute top-1/2 left-1/2"
        style={{ ...box, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
      >
        <img
          src={assetUrl(photo.src)}
          alt={photo.caption ?? ''}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    </button>
  )
}