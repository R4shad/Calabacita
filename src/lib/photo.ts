import type { Photo, PhotoAspect } from './types'

const RATIO: Record<PhotoAspect, number> = {
  portrait: 4 / 5,
  landscape: 5 / 4,
  square: 1,
}

const SWAP: Record<PhotoAspect, PhotoAspect> = {
  portrait: 'landscape',
  landscape: 'portrait',
  square: 'square',
}

export const ASPECT_CLASS: Record<PhotoAspect, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[5/4]',
  square: 'aspect-square',
}

/**
 * Geometría de una foto dentro de su marco.
 * Si la foto está girada 90°, el marco se pone apaisado y la caja de la
 * imagen intercambia ancho y alto para que llene el marco sin deformarse.
 */
export function photoFrame(photo: Photo) {
  const rotate = photo.rotate ?? 0
  const base = photo.aspect ?? 'portrait'
  const flipped = rotate === 90 || rotate === 270
  const aspect: PhotoAspect = flipped ? SWAP[base] : base
  const ratio = RATIO[aspect]

  const box = flipped
    ? { width: `${(100 / ratio).toFixed(3)}%`, height: `${(ratio * 100).toFixed(3)}%` }
    : { width: '100%', height: '100%' }

  return { aspect, ratio, box, rotate, flipped }
}