import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

type Props = {
  recipient: string
  date: string
  /** Colores del primer capítulo, para que el sobre ya tenga su ambiente. */
  glow: string
  onOpen: () => void
}

/**
 * Intro: un sobre cerrado con un sello de lacre.
 * Al hacer clic, la solapa se abre, la carta sale del sobre
 * y todo se desvanece para dar paso a la experiencia de scroll.
 */
export function EnvelopeIntro({ recipient, date, glow, onOpen }: Props) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'leaving'>('closed')

  const open = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    window.setTimeout(() => setPhase('leaving'), 1150)
    window.setTimeout(onOpen, 2200)
  }

  const leaving = phase !== 'closed'

  return (
    <motion.div
      className="fixed inset-0 z-50 grid cursor-pointer place-items-center px-6"
      onClick={open}
      animate={leaving ? { opacity: 0, scale: 1.07 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: leaving ? 1.05 : 0, ease: [0.65, 0, 0.35, 1] }}
      style={{ pointerEvents: leaving ? 'none' : 'auto' }}
    >
      {/* Luz detrás del sobre */}
      <motion.div
        className="absolute h-[75vmin] w-[75vmin] rounded-full blur-[95px]"
        style={{ background: `radial-gradient(circle, ${glow}, transparent 65%)` }}
        animate={{ opacity: [0.32, 0.58, 0.32], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex flex-col items-center gap-12">
        {/* =============================================================== */}
        {/*  El sobre                                                      */}
        {/* =============================================================== */}
        <div className="relative [perspective:1600px]">
          <motion.button
            type="button"
            onClick={open}
            aria-label={`Abrir la carta para ${recipient}`}
            className="relative block cursor-pointer outline-none"
            animate={
              phase === 'closed'
                ? { y: [0, -9, 0], rotate: [-0.7, 0.7, -0.7] }
                : { y: -60, scale: 0.95 }
            }
            transition={
              phase === 'closed'
                ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
            }
            whileHover={phase === 'closed' ? { scale: 1.035 } : undefined}
            whileTap={phase === 'closed' ? { scale: 0.975 } : undefined}
          >
            <div className="relative h-[250px] w-[372px] sm:h-[282px] sm:w-[416px]">
              {/* -------------------------------------------------- */}
              {/*  1. La carta, asomando por arriba                 */}
              {/* -------------------------------------------------- */}
              <motion.div
                className="absolute inset-x-5 -top-[124px] h-[236px] overflow-hidden rounded-[5px] sm:-top-[138px] sm:h-[268px]"
                style={{
                  background: 'linear-gradient(180deg, #fffefb, #f7eee2)',
                  boxShadow: '0 -8px 22px rgba(60,20,15,0.22), 0 0 0 1px rgba(120,80,60,0.1)',
                }}
                animate={leaving ? { y: -120, opacity: 1 } : { y: 0 }}
                transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1], delay: leaving ? 0.45 : 0 }}
              >
                <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />
                <div className="flex h-full flex-col items-start justify-start gap-1 px-8 pt-8 text-center sm:pt-9">
                  <span className="self-center font-body text-[9px] tracking-[0.4em] text-[#9c7180] uppercase">
                    {date}
                  </span>
                  <span className="self-center font-display text-[clamp(1.5rem,3.2vw,2rem)] leading-none font-semibold text-[#3a2230]">
                    Para {recipient}
                  </span>
                  <span className="mt-0.5 h-px w-10 self-center bg-[#3a2230]/25" />
                  <span className="self-center font-body text-[8px] tracking-[0.34em] text-[#8a6472] uppercase">
                    una carta
                  </span>
                </div>
              </motion.div>

              {/* -------------------------------------------------- */}
              {/*  2. Cuerpo del sobre                              */}
              {/* -------------------------------------------------- */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[8px]"
                style={{
                  background: 'linear-gradient(168deg, #f6ead9 0%, #eddfc9 60%, #e5d0b4 100%)',
                  boxShadow:
                    '0 34px 70px -22px rgba(0,0,0,0.62), 0 2px 0 rgba(255,255,255,0.45) inset, 0 -20px 44px -30px rgba(90,50,40,0.5) inset',
                }}
              >
                <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />
              </div>

              {/* -------------------------------------------------- */}
              {/*  3. Mitades del bolsillo (encima de la carta)    */}
              {/* -------------------------------------------------- */}
              <div
                className="absolute bottom-0 left-0 h-[64%] w-[51%]"
                style={{
                  clipPath: 'polygon(0 100%, 0 12%, 100% 100%)',
                  background: 'linear-gradient(112deg, #f7ecdc 0%, #eddcc6 100%)',
                }}
              />
              <div
                className="absolute bottom-0 right-0 h-[64%] w-[51%]"
                style={{
                  clipPath: 'polygon(100% 100%, 100% 12%, 0 100%)',
                  background: 'linear-gradient(248deg, #f2e4d1 0%, #e8d6bd 100%)',
                }}
              />

              {/* -------------------------------------------------- */}
              {/*  4. Solapa (la que se abre)                       */}
              {/* -------------------------------------------------- */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[122px] origin-top sm:h-[138px]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: 'linear-gradient(178deg, #f8ecdd 0%, #ecdac2 72%, #e3cdb0 100%)',
                  boxShadow: '0 10px 18px -14px rgba(90,50,40,0.55)',
                }}
                animate={{ rotateX: leaving ? -158 : 0 }}
                transition={{
                  duration: 0.95,
                  ease: [0.65, 0, 0.35, 1],
                  delay: leaving ? 0.1 : 0,
                }}
              >
                {/* Sombra interior de la solapa */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(0deg, rgba(90,55,40,0.2), transparent 60%)',
                  }}
                />
              </motion.div>

              {/* ------------------------------------------------ */}
              {/*  Sello de lacre (encima de todo)                  */}
              {/* ------------------------------------------------ */}
              <motion.div
                className="absolute top-[62px] left-1/2 grid h-[70px] w-[70px] -translate-x-1/2 place-items-center rounded-full text-[#ffe9e0] sm:top-[70px] sm:h-[76px] sm:w-[76px]"
                style={{
                  background: 'radial-gradient(circle at 34% 30%, #e0576f, #8e1f3c 74%)',
                  boxShadow:
                    '0 9px 20px -6px rgba(80,10,30,0.75), 0 0 0 1px rgba(255,255,255,0.16) inset, 0 -6px 12px -6px rgba(60,0,20,0.6) inset',
                  fontFamily: 'var(--font-display)',
                }}
                initial={false}
                animate={{
                  scale: leaving ? 1.12 : 1,
                  opacity: leaving ? 0 : 1,
                }}
                transition={{ duration: 0.6, delay: leaving ? 0.7 : 0 }}
              >
                <motion.span
                  className="animate-wiggle-seal text-[28px] leading-none font-semibold drop-shadow-sm"
                  animate={{ rotate: leaving ? 24 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  ♥
                </motion.span>
              </motion.div>
            </div>

            {/* Anillo pulsante: pista de que se puede tocar */}
            {phase === 'closed' && (
              <motion.span
                className="pointer-events-none absolute top-[97px] left-1/2 h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 sm:top-[108px]"
                animate={{ scale: [0.9, 1.75], opacity: [0.6, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </motion.button>
        </div>

        {/* =============================================================== */}
        {/*  Aviso de interacción                                           */}
        {/* =============================================================== */}
        <AnimatePresence>
          {phase === 'closed' && (
            <motion.p
              className="font-body text-[11px] tracking-[0.42em] text-white/80 uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ delay: 0.9, duration: 0.9 }}
            >
              Toca el sobre
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}