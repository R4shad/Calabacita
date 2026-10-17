import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../lib/assets'

type Props = {
  src?: string
}

/** Botón de música ambiente. Solo aparece si defines `musicSrc` en la carta. */
export function MusicToggle({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = 0.34
    if (playing) void el.play().catch(() => setPlaying(false))
    else el.pause()
  }, [playing])

  const toggle = () => setPlaying((p) => !p)

  if (!src) return null

  return (
    <>
      <audio ref={audioRef} src={assetUrl(src)} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pausar la música' : 'Poner música'}
        className="fixed right-4 bottom-4 z-40 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/25 text-white/85 backdrop-blur-md transition hover:border-[var(--glow)] hover:text-white active:scale-95"
      >
        {playing ? (
          <span className="flex h-4 items-end gap-[3px]">
            <span className="animate-bob h-3 w-[3px] rounded-full bg-current" />
            <span className="animate-bob h-4 w-[3px] rounded-full bg-current [animation-delay:-0.4s]" />
            <span className="animate-bob h-2.5 w-[3px] rounded-full bg-current [animation-delay:-0.9s]" />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6.9l10-2.2v9.4a2.5 2.5 0 1 1-2-2.45V6.6L9 8.2z" />
          </svg>
        )}
      </button>
    </>
  )
}