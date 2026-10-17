/** Paletas de ambiente disponibles para cada parte de la carta. */
export type MoodKey = 'rose' | 'plum' | 'wine' | 'amber' | 'night' | 'blush'

export type Mood = {
  /** Fondo (de arriba hacia abajo). */
  sky: [string, string, string]
  /** Color de la luz / glow principal. */
  glow: string
  /** Color secundario (partículas, brillos). */
  spark: string
}

/** Proporción del marco de la foto. */
export type PhotoAspect = 'portrait' | 'landscape' | 'square'

/** Una foto dentro de la carta. */
export type Photo = {
  /** Ruta o import de la imagen. Si está vacía se dibuja un marcador. */
  src: string
  alt?: string
  caption?: string
  /**
   * Rotación del CONTENIDO de la foto en grados (0, 90, 180 o 270).
   * Útil cuando la foto salió girada desde el móvil.
   * Si es 90/270 el marco se pone apaisado automáticamente.
   */
  rotate?: 0 | 90 | 180 | 270
  /** Proporción deseada del marco. Por defecto vertical (polaroid). */
  aspect?: PhotoAspect
  /** Inclinación del polaroid, en grados. */
  tilt?: number
}

/** Una parte / capítulo de la historia. */
export type Chapter = {
  id: string
  /** Etiqueta pequeña arriba: 'Capítulo I', '2000', etc. */
  kicker?: string
  title: string
  /** Párrafos del paso. */
  paragraphs: string[]
  photo?: Photo
  /** Color de ambiente de este paso. */
  mood?: MoodKey
}

export type LetterContent = {
  recipient: string
  sender: string
  /** Saludo: 'Querida mi amor,' */
  opening: string
  date: string
  chapters: Chapter[]
  /** Frase corta antes de la firma. */
  closing: string
  signOff: string
  signature: string
  finale: {
    kicker: string
    title: string
    message: string
  }
  /** Galería del final. Se abre con el botón "Ver los recuerdos". */
  gallery?: Photo[]
  /** Audio ambiente opcional dentro de `public/`. Ej: '/audio/cancion.mp3' */
  musicSrc?: string
}