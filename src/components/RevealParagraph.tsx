import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Props = {
  text: string
  /** Retardo en segundos antes de empezar a revelarse. */
  delay?: number
  /** Arranca (o no) la animación. */
  play?: boolean
  /** Tipografía manuscrita (para acentos y firmas). */
  hand?: boolean
  /** Se revela letra a letra en vez de palabra a palabra. */
  typewriter?: boolean
  /** `ink` para papel crema, `light` para fondos oscuros. */
  tone?: 'ink' | 'light'
}

/**
 * Revelado progresivo del párrafo: cada palabra entra con un pequeño
 * desplazamiento y desenfoque, como si se estuviera escribiendo.
 */
export function RevealParagraph({
  text,
  delay = 0,
  play = true,
  hand = false,
  typewriter = false,
  tone = 'ink',
}: Props) {
  const reduced = usePrefersReducedMotion()
  const words = text.split(' ')

  return (
    <p
      className="max-w-[46ch] text-pretty"
      style={
        hand
          ? {
              fontFamily: 'var(--font-hand)',
              fontSize: 'clamp(1.4rem, 2.1vw + 0.9rem, 2rem)',
              lineHeight: 1.3,
              color:
                tone === 'light'
                  ? 'rgba(255,255,255,0.92)'
                  : 'color-mix(in oklab, var(--color-ink) 72%, transparent)',
            }
          : {
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.97rem, 0.62vw + 0.76rem, 1.12rem)',
              lineHeight: 1.85,
              color:
                tone === 'light'
                  ? 'rgba(255,255,255,0.78)'
                  : 'color-mix(in oklab, #2e1a25 88%, transparent)',
            }
      }
    >
      {words.map((word, i) => (
        <motion.span
          key={`${i}-${word}`}
          className="inline-block will-change-[transform,opacity,filter]"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
          animate={play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
          transition={{
            duration: reduced ? 0.25 : 0.9,
            delay: reduced ? 0 : delay + i * (typewriter ? 0.03 : 0.05),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}

      {/* Cursor de escritura */}
      {typewriter && (
        <motion.span
          aria-hidden
          className="ml-[2px] inline-block h-[0.95em] w-[2px] translate-y-[0.14em] bg-[#c1436a]"
          initial={{ opacity: 0 }}
          animate={play ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
          transition={{
            delay: delay + words.length * 0.03 + 0.15,
            duration: 0.65,
            repeat: Infinity,
            repeatDelay: 0.75,
            times: [0, 0.06, 0.5, 0.56],
          }}
        />
      )}
    </p>
  )
}