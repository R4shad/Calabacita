import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { Photo } from '../lib/types'
import { PhotoFrame } from './PhotoFrame'

type Props = {
  photo: Photo
  placement?: 'left' | 'right' | 'center'
  /** Abre el visor al hacer clic. */
  onClick?: () => void
}

/** Polaroid con inclinación 3D al mover el cursor y marco de cinta. */
export function Polaroid({ photo, placement = 'center', onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const sx = useSpring(mx, { stiffness: 190, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 190, damping: 18, mass: 0.4 })

  const rotateY = useTransform(sx, [-0.5, 0.5], [13, -13])
  const rotateX = useTransform(sy, [-0.5, 0.5], [-11, 11])
  const glare = useTransform(
    [sx, sy],
    ([x, y]: string[]) =>
      `radial-gradient(closest-side circle at ${x} ${y}, rgba(255,255,255,0.5), transparent 72%)`,
  )

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const tilt = photo.tilt ?? (placement === 'left' ? -3.5 : placement === 'right' ? 3.5 : -1.2)
  const from = placement === 'left' ? -64 : placement === 'right' ? 64 : 0

  const body = (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="group relative rounded-[3px] bg-[#fbf4ea] p-2.5 pb-8 shadow-[0_18px_38px_-18px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]"
      style={{ rotateX, rotateY }}
    >
      <PhotoFrame
        photo={photo}
        className="rounded-[2px]"
        imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />

      {/* Brillo que sigue al cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[3px] opacity-0 transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: glare }}
      />
      {/* Tinte cálido */}
      <div className="pointer-events-none absolute inset-2.5 top-2.5 rounded-[2px] bg-gradient-to-t from-[#2a1024]/25 via-transparent to-[#ffd9a8]/10" />

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-1.5 text-center">
        <span className="font-hand text-[15px] leading-none text-[#5a4250]">
          {photo.caption ?? ''}
        </span>
      </figcaption>

      {/* Cinta adhesiva */}
      <span
        className="absolute -top-[10px] left-1/2 h-5 w-16 -translate-x-1/2 -rotate-2 rounded-[1px] opacity-55"
        style={{
          background: 'linear-gradient(180deg, rgba(255,252,246,0.55), rgba(255,238,222,0.25))',
          boxShadow: '0 1px 3px rgba(90,50,40,0.16)',
          backdropFilter: 'blur(1px)',
        }}
      />
    </motion.div>
  )

  return (
    <motion.figure
      className={placement === 'center' ? 'mx-auto w-full max-w-[230px]' : 'w-full max-w-[225px]'}
      initial={{ opacity: 0, x: from, y: 46, rotate: tilt * 2.6, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: tilt, scale: 1 }}
      transition={{ type: 'spring', stiffness: 88, damping: 15 }}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={`Ampliar la foto: ${photo.caption ?? ''}`}
          className="block w-full cursor-zoom-in rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c1436a]"
        >
          {body}
        </button>
      ) : (
        body
      )}
    </motion.figure>
  )
}