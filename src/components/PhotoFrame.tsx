import { assetUrl } from '../lib/assets'
import { ASPECT_CLASS, photoFrame } from '../lib/photo'
import type { Photo } from '../lib/types'

type Props = {
  photo: Photo
  className?: string
  /** Modo de encuadre dentro del marco. */
  fit?: 'cover' | 'contain'
  imgClassName?: string
  alt?: string
}

/**
 * Marco de foto que respeta la orientación original de la imagen.
 * Comparte lógica entre el polaroid de la carta y el visor de imágenes.
 */
export function PhotoFrame({
  photo,
  className = '',
  fit = 'cover',
  imgClassName = '',
  alt,
}: Props) {
  const { aspect, box, rotate } = photoFrame(photo)

  return (
    <div
      className={`relative overflow-hidden bg-[#2a1a24]/10 ${ASPECT_CLASS[aspect]} ${className}`}
    >
      <div
        className="absolute top-1/2 left-1/2"
        style={{ ...box, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
      >
        {photo.src ? (
          <img
            src={assetUrl(photo.src)}
            alt={alt ?? photo.alt ?? photo.caption ?? ''}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`h-full w-full ${
              fit === 'cover' ? 'object-cover' : 'object-contain'
            } ${imgClassName}`}
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center"
            style={{
              background:
                'linear-gradient(150deg, color-mix(in oklab, var(--glow) 32%, #2b1226), #170b1b 75%)',
            }}
          >
            <div className="flex flex-col items-center gap-2 px-4 text-center opacity-80">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="white"
                strokeWidth="1.2"
              >
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <circle cx="8.5" cy="10" r="1.6" />
                <path d="m4 17 4.5-4.2a2 2 0 0 1 2.7 0L20 20" />
              </svg>
              <span className="text-[9px] tracking-[0.24em] text-white/65 uppercase">
                tu foto aquí
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}