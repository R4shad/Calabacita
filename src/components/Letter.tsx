import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Fit } from './Fit'
import { Polaroid } from './Polaroid'
import { PhotoViewer } from './PhotoViewer'
import { RevealParagraph } from './RevealParagraph'
import { isNavLocked } from '../lib/navLock'
import { roman } from '../lib/text'
import type { LetterContent, MoodKey, Photo } from '../lib/types'

const MS = 720

type Step =
  | { kind: 'cover'; mood?: MoodKey }
  | { kind: 'chapter'; chapter: LetterContent['chapters'][number]; mood?: MoodKey }
  | { kind: 'closing'; mood?: MoodKey }

type Props = {
  content: LetterContent
  onMoodChange: (mood: MoodKey) => void
  /** Se llama cuando el lector termina la carta. */
  onFinish: () => void
}

/* ------------------------------------------------------------------ */
/*  Transición de página                                              */
/* ------------------------------------------------------------------ */
const pageVariants = {
  enter: (d: number) => ({
    opacity: 0,
    x: d * 72,
    rotateY: d * 30,
    scale: 0.94,
    filter: 'blur(9px)',
    pointerEvents: 'none',
  }),
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    filter: 'blur(0px)',
    pointerEvents: 'auto',
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d * -72,
    rotateY: d * -30,
    scale: 0.94,
    filter: 'blur(9px)',
    pointerEvents: 'none',
  }),
}

const EASE = [0.22, 1, 0.36, 1] as const

/* ================================================================== */
export function Letter({ content, onMoodChange, onFinish }: Props) {
  const steps = useMemo<Step[]>(
    () => [
      { kind: 'cover', mood: content.chapters[0]?.mood },
      ...content.chapters.map<Step>((chapter) => ({
        kind: 'chapter',
        chapter,
        mood: chapter.mood,
      })),
      { kind: 'closing', mood: content.chapters[content.chapters.length - 1]?.mood },
    ],
    [content],
  )

  const last = steps.length - 1

  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)

  const busy = useRef(false)
  const wheelAcc = useRef(0)
  const touchY = useRef<number | null>(null)

  const goTo = useCallback(
    (next: number, direction: number) => {
      if (busy.current) return
      if (next < 0) return
      if (next > last) {
        onFinish()
        return
      }
      busy.current = true
      setDir(direction)
      setIndex(next)
      window.setTimeout(() => {
        busy.current = false
      }, MS)
    },
    [last, onFinish],
  )

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  /* Ambiente según el paso */
  useEffect(() => {
    const mood = steps[index]?.mood
    if (mood) onMoodChange(mood)
  }, [index, steps, onMoodChange])

  /* Teclado */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isNavLocked()) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  /* Rueda del ratón */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isNavLocked()) return
      wheelAcc.current += e.deltaY
      if (Math.abs(wheelAcc.current) > 90) {
        goTo(index + (wheelAcc.current > 0 ? 1 : -1), wheelAcc.current > 0 ? 1 : -1)
        wheelAcc.current = 0
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goTo, index])

  /* Gestos táctiles */
  useEffect(() => {
    const start = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY
    }
    const end = (e: TouchEvent) => {
      const y0 = touchY.current
      touchY.current = null
      if (y0 === null || isNavLocked()) return
      const dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dy) < 55) return
      goTo(index + (dy < 0 ? 1 : -1), dy < 0 ? 1 : -1)
    }
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchend', end, { passive: true })
    return () => {
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchend', end)
    }
  }, [goTo, index])

  const step = steps[index]
  const progress = last === 0 ? 1 : index / last

  /* Galería: todas las fotos de la carta, en orden */
  const gallery = useMemo<Photo[]>(
    () => [
      ...(content.gallery ?? content.chapters.flatMap((c) => (c.photo ? [c.photo] : []))),
    ],
    [content],
  )

  const openPhoto = (photo: Photo) => {
    const i = gallery.findIndex((p) => p.src === photo.src)
    setPhotoIndex(i < 0 ? null : i)
  }

  const isLast = index === last

  return (
    <div className="h-stage relative grid place-items-center overflow-hidden px-3 pt-3 pb-[84px] sm:px-4 sm:pb-[96px]">
      {/* Halo detrás del papel */}
      <motion.div
        aria-hidden
        className="paper-halo pointer-events-none absolute h-[58vmin] w-[58vmin] rounded-full blur-[85px]"
        style={{ background: 'radial-gradient(circle, var(--glow), transparent 66%)' }}
        animate={{ opacity: [0.26, 0.4, 0.26], scale: [1, 1.09, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ---------------------------------------------------------------- */}
      {/*  El papel                                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="paper-float relative">
        <motion.div
          className="relative aspect-[3/4] w-[min(92vw,54svh,540px)]"
          initial={{ opacity: 0, y: 130, rotate: -8, scale: 0.86 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
            scale: 1 - progress * 0.07,
          }}
          transition={{ type: 'spring', stiffness: 55, damping: 15, mass: 1 }}
        >
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ scale: 0.985 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-[5px]"
              style={{
                perspective: '1700px',
                background: 'linear-gradient(168deg, #fffdf8 0%, #fbf3e8 46%, #f4e7d6 100%)',
                boxShadow:
                  '0 30px 64px -20px rgba(8,2,10,0.6), 0 0 56px -20px var(--glow), 0 2px 0 rgba(255,255,255,0.6) inset',
              }}
            >
              {/* Fibras del papel + líneas tenues */}
              <div className="paper-grain pointer-events-none absolute inset-0" />

              {/* Margen rojo de cuaderno */}
              <div
                className="pointer-events-none absolute inset-y-0 left-[7%] w-px opacity-[0.14]"
                style={{
                  background: 'linear-gradient(180deg, transparent, #c1436a 22%, #c1436a 78%, transparent)',
                }}
              />

              {/* Brillo continuo */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
                style={{
                  backgroundImage:
                    'linear-gradient(104deg, transparent 36%, rgba(255,255,255,0.9) 50%, transparent 64%)',
                  backgroundSize: '230% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPositionX: `${30 + progress * 70}%`,
                }}
              />

              {/* Contenido del paso */}
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={index}
                  custom={dir}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.68, ease: EASE }}
                  className="absolute inset-0 grid place-items-center"
                  style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
                  aria-live="polite"
                >
                  <Fit>
                    <StepBody
                      step={step}
                      content={content}
                      index={index}
                      onOpenPhoto={openPhoto}
                    />
                  </Fit>
                </motion.div>
              </AnimatePresence>

              {/* Barrido de luz al pasar de página */}
              <motion.div
                key={`sweep-${index}`}
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-45 mix-blend-soft-light"
                initial={{ backgroundPositionX: '130%' }}
                animate={{ backgroundPositionX: '-70%' }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                style={{
                  backgroundImage:
                    'linear-gradient(102deg, transparent 34%, rgba(255,255,255,0.95) 50%, transparent 66%)',
                  backgroundSize: '240% 100%',
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Número de página */}
              <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
                <span className="h-px w-5 bg-[#2e1a25]/18" />
                <span className="font-display text-[10.5px] tracking-[0.32em] text-[#2e1a25]/35">
                  {roman(index + 1)}
                  <span className="opacity-50"> / {roman(steps.length)}</span>
                </span>
                <span className="h-px w-5 bg-[#2e1a25]/18" />
              </div>
            </div>

            {/* Canto del papel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-[6%]"
              style={{
                background:
                  'linear-gradient(270deg, rgba(60,25,20,0.2), rgba(60,25,20,0.04) 58%, transparent)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Barra de navegación (glassmorphism)                           */}
      {/* ---------------------------------------------------------------- */}
      <nav className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-3 sm:bottom-8 sm:px-4">
        <div className="flex w-full max-w-[430px] items-center gap-1.5 rounded-full border border-white/15 bg-white/8 p-1.5 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Volver al paso anterior"
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-white/80 transition hover:bg-white/15 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          {/* Puntos de progreso */}
          <div className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={`Ir al paso ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className="group grid h-6 place-items-center sm:h-7"
              >
                <span
                  className={[
                    'block rounded-full transition-all duration-400',
                    i === index
                      ? 'h-2 w-4 bg-[var(--glow)] shadow-[0_0_12px_var(--glow)] sm:w-5'
                      : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white/80',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="group flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--glow)] px-3 font-ui text-[9.5px] font-medium tracking-[0.14em] whitespace-nowrap text-[#2a0d18] uppercase shadow-[0_6px_20px_-6px_var(--glow)] transition hover:brightness-110 active:scale-95 sm:px-4 sm:text-[10.5px] sm:tracking-[0.18em]"
          >
            {isLast ? 'Final' : 'Continuar'}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Riel lateral de pasos (escritorio) */}
      <div className="absolute top-1/2 right-5 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        <span className="relative h-40 w-px bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 bg-[var(--glow)]"
            style={{ height: `${progress * 100}%`, boxShadow: '0 0 10px var(--glow)' }}
          />
        </span>
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i, i > index ? 1 : -1)}
            aria-label={`Ir al paso ${i + 1}`}
            className="group grid h-3 place-items-center"
          >
            <span
              className={[
                'block rounded-full transition-all duration-400',
                i === index
                  ? 'h-2 w-2 bg-[var(--glow)] shadow-[0_0_12px_var(--glow)]'
                  : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white/80',
              ].join(' ')}
            />
          </button>
        ))}
      </div>

      {/* Pista de interacción la primera vez */}
      {index === 0 && (
        <motion.p
          className="font-ui pointer-events-none absolute inset-x-0 bottom-[92px] z-10 text-center text-[10px] tracking-[0.34em] text-white/45 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.35] }}
          transition={{ duration: 4.5, times: [0, 0.2, 0.7, 1], delay: 1.6 }}
        >
          desliza o pulsa continuar
        </motion.p>
      )}

      <PhotoViewer
        photos={gallery}
        index={photoIndex}
        onClose={() => setPhotoIndex(null)}
        onIndexChange={setPhotoIndex}
      />
    </div>
  )
}

/* ================================================================== */
/*  Contenido de cada paso                                            */
/* ================================================================== */
function StepBody({
  step,
  content,
  index,
  onOpenPhoto,
}: {
  step: Step
  content: LetterContent
  index: number
  onOpenPhoto: (photo: Photo) => void
}) {
  /* ---------------- Portada ---------------- */
  if (step.kind === 'cover') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-2 text-center">
        <motion.span
          className="font-ui text-[9.5px] tracking-[0.52em] text-[#a1707f] uppercase"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {content.date}
        </motion.span>

        <motion.h1
          className="font-display text-[clamp(2rem,5.6vw,3.2rem)] leading-[1.05] font-semibold text-balance text-[#2e1a25]"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
        >
          Para {content.recipient}
        </motion.h1>

        <motion.span
          className="flex items-center gap-3 text-[#c1436a]"
          initial={{ opacity: 0, scaleX: 0.25 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.8 }}
        >
          <span className="h-px w-9 bg-current opacity-40" />
          <span className="text-[12px]">✦</span>
          <span className="h-px w-9 bg-current opacity-40" />
        </motion.span>

        <motion.p
          className="font-hand text-[clamp(1.45rem,3.2vw,2.05rem)] leading-tight text-[#6b5260]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95 }}
        >
          {content.opening}
        </motion.p>

        {/* Detalle "código ejecutándose" */}
        <motion.div
          className="mt-3 flex items-center gap-2 rounded-md border border-[#2e1a25]/10 bg-[#2e1a25]/[0.035] px-3 py-1.5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.25 }}
        >
          <span className="font-mono text-[10px] text-[#b08e9c]">$</span>
          <span className="font-mono text-[10px] text-[#4a3040]">node nosotros.js</span>
          <motion.span
            className="h-3 w-[2px] bg-[#c1436a]"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.5, 0.5, 1] }}
          />
          <span className="font-mono text-[10px] text-[#c1436a]">compilando ♥</span>
        </motion.div>
      </div>
    )
  }

  /* ---------------- Despedida ---------------- */
  if (step.kind === 'closing') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-5 px-2 text-center">
        <motion.span
          className="font-ui text-[9.5px] tracking-[0.52em] text-[#a1707f] uppercase"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {content.signOff}
        </motion.span>

        <RevealParagraph text={content.closing} delay={0.45} hand />

        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -22 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 13, delay: 0.9 }}
        >
          <div
            className="grid h-[62px] w-[62px] place-items-center rounded-full text-[#ffe9e0]"
            style={{
              background: 'radial-gradient(circle at 34% 30%, #e0576f, #8e1f3c 74%)',
              boxShadow:
                '0 10px 22px -8px rgba(80,10,30,0.7), 0 0 0 1px rgba(255,255,255,0.18) inset',
            }}
          >
            <span className="font-display text-[25px] leading-none font-semibold">♥</span>
          </div>
        </motion.div>

        <motion.p
          className="font-hand text-[clamp(1.9rem,4.6vw,2.7rem)] leading-tight text-[#2e1a25]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
        >
          {content.signature}
        </motion.p>

        <motion.p
          className="font-ui text-[9.5px] tracking-[0.42em] text-[#a1707f] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.35 }}
        >
          {content.date}
        </motion.p>
      </div>
    )
  }

  /* ---------------- Capítulo ---------------- */
  const { chapter } = step
  const side = index % 2 === 0 ? 'right' : 'left'

  return (
    <div className="flex min-h-full w-full flex-col gap-[clamp(0.6rem,1.5vh,1.05rem)] px-[5%]">
      <header className="flex flex-col gap-1.5">
        {chapter.kicker && (
          <motion.span
            className="font-ui text-[9.5px] tracking-[0.44em] text-[#c1436a] uppercase"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {chapter.kicker}
          </motion.span>
        )}

        <motion.h2
          className="font-display text-[clamp(1.45rem,4vw,2.35rem)] leading-[1.1] font-semibold text-balance text-[#2e1a25]"
          initial={{ opacity: 0, y: 20, filter: 'blur(9px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.95, delay: 0.28, ease: EASE }}
        >
          {chapter.title}
        </motion.h2>

        <motion.span
          className="mt-1 block h-px w-full origin-left bg-gradient-to-r from-[#c1436a]/60 via-[#c1436a]/22 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        />
      </header>

      <div className="flex flex-col gap-[clamp(0.5rem,1.2vh,0.85rem)]">
        {chapter.paragraphs.map((p, i) => (
          <RevealParagraph key={i} text={p} delay={0.45 + i * 0.14} />
        ))}
      </div>

      {chapter.photo && (
        <div
          className={
            side === 'right' ? 'flex justify-end pr-[1%]' : 'flex justify-start pl-[1%]'
          }
        >
          <Polaroid
            photo={chapter.photo}
            placement={side}
            onClick={() => onOpenPhoto(chapter.photo as Photo)}
          />
        </div>
      )}
    </div>
  )
}