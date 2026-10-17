/**
 * ============================================================================
 *  ✦  EL CONTENIDO DE LA CARTA  ✦
 * ============================================================================
 *  Este es el ÚNICO archivo que necesitas tocar para cambiar la carta.
 *  Todo lo demás (estilos, animaciones, transiciones) es automático.
 *
 *  · Cada objeto del array `chapters` es un paso de la carta.
 *  · Para añadir un paso: duplica un objeto y cambia el texto.
 *  · Para cambiar una foto: edita `photo.src`.
 *  · `mood` es el color de ambiente de ese paso:
 *      rose · blush · plum · wine · amber · night
 * ============================================================================
 */

import foto1 from '../assets/fotos/1.jpeg'
import foto2 from '../assets/fotos/2.jpeg'
import foto3 from '../assets/fotos/3.jpeg'
import foto4 from '../assets/fotos/4.jpeg'
import foto5 from '../assets/fotos/5.jpeg'
import type { LetterContent } from '../lib/types'

export const letter: LetterContent = {
  // Se muestra como "Para {recipient}"
  recipient: 'mi Calabacita',

  sender: 'RASHAD',

  opening: 'Querida mi amor,',

  date: '17 de octubre',

  // --------------------------------------------------------------------------
  //  LOS PASOS DE LA HISTORIA
  // --------------------------------------------------------------------------
  chapters: [
    {
      id: 'milenio',
      kicker: 'Capítulo I · El milenio',
      title: 'El gran salto al año 2000',
      mood: 'plum',
      paragraphs: [
        'El mundo daba la bienvenida a un nuevo milenio en el año 2000. Las computadoras temían al efecto Y2K, el planeta entero celebraba una nueva era y la historia se reescribía con optimismo. Sin embargo, el evento más importante de ese año no fue tecnológico ni político; ocurrió el 17 de octubre del 2000, el preciso instante en el que el mundo ganó a una luz inmensa: tú llegaste a este plano para cambiarlo todo.',
      ],
      photo: { src: foto5, rotate: 0, aspect: 'portrait', caption: 'Un poco de mí, para siempre' },
    },
    {
      id: 'dia-del-amor',
      kicker: 'Capítulo II · Orígenes',
      title: 'El origen y el Día del Amor',
      mood: 'rose',
      paragraphs: [
        'Haciendo cuentas y cálculos cósmicos, todo apunta a que tu concepción fue por allá en febrero, en plenos carnavales entre risas, disfraces y festejos. Pero seamos sinceros: aunque el mundo celebre el amor el 14 de febrero, la verdadera historia del amor universal comenzó oficialmente el día que abriste los ojos por primera vez. ¡Una gran jugada del destino que merecía semejante recompensa!',
      ],
      photo: { src: foto1, rotate: 270, aspect: 'landscape', caption: 'Y entonces llegamos nosotros' },
    },
    {
      id: 'camino',
      kicker: 'Capítulo III · En camino',
      title: 'Entre febrero y octubre',
      mood: 'wine',
      paragraphs: [
        'Entre aquel febrero de fiesta y tu llegada en octubre, el mundo giró unos cuantos millones de kilómetros: se lanzaron misiones espaciales, la música sonaba a cassette o a los primeros MP3, y el universo se preparaba pacientemente. Lo que el universo no sabía es que estaba cocinando a fuego lento a una mujer con una chispa y una personalidad completamente irrepetibles.',
      ],
      photo: { src: foto2, rotate: 90, aspect: 'landscape', caption: 'Un día cualquiera, para siempre' },
    },
    {
      id: 'presente',
      kicker: 'Capítulo IV · 2026',
      title: 'El punto de inflexión',
      mood: 'blush',
      paragraphs: [
        'Y entonces dimos el salto al 2026. El año exacto en el que nuestros caminos se cruzaron y mi vida dio un giro de 180 grados, llenándose de un color que no sabía que existía. Eres una persona increíble, dueña de una personalidad única que mezcla lo mejor de dos mundos: eres alegre, positiva, sumamente divertida... y sí, también un poquito molestosa (de esa forma tan tierna que me vuelve loco).',
      ],
      photo: { src: foto3, rotate: 0, aspect: 'portrait', caption: 'En su propio trono' },
    },
    {
      id: 'sonrisa',
      kicker: 'Capítulo V · El hechizo',
      title: 'El poder de tu sonrisa',
      mood: 'amber',
      paragraphs: [
        'Si algo me conquistó de ti desde el primer segundo, fue tu sonrisa. Esa sonrisa tuya tiene el superpoder absurdo de alegrarme el día entero, de salvar mis peores momentos y de iluminar mi vida entera. Es, sin duda, mi paisaje favorito y lo que más amo ver últimamente.',
      ],
      photo: { src: foto4, rotate: 0, aspect: 'portrait', caption: 'Mi paisaje favorito' },
    },
    {
      id: 'hoy',
      kicker: 'Capítulo VI · Hoy',
      title: 'La mujer en la que te has convertido',
      mood: 'rose',
      paragraphs: [
        'Hoy admiro profundamente a la mujer en la que te has convertido y la intensidad con la que vives tu presente: estudias con pasión, te fajas terminando tus proyectos, te enamoras conmigo todos los días (¡jaja!) y hasta has comenzado el gimnasio como un nuevo hobby para conquistar el mundo con más energía todavía.',
      ],
    },
    {
      id: 'futuro',
      kicker: 'Capítulo VII · próximos commits',
      title: 'Lo que viene: nosotros dos',
      mood: 'plum',
      paragraphs: [
        'Confío ciegamente en ti. Tengo las expectativas más altas del mundo porque sé de lo que estás hecha, y te admiro con el alma. Espero que, día a día, de la mano, construyamos la mejor versión de nosotros mismos. Y como sé que lo tuyo es programar, miremos el futuro paso a paso, línea a línea de código: compilando nuestros sueños, encontrando el equilibrio perfecto entre enamorar, trabajar, descansar y lograr todo lo que nos propongamos.',
      ],
    },
    {
      id: 'cierre',
      kicker: 'Capítulo VIII · Compilado',
      title: '26 vueltas al sol',
      mood: 'wine',
      paragraphs: [
        'Hoy cumples 26 vueltas al sol, y mi único deseo es que la vida te devuelva un poquito de toda la felicidad que regalas con solo existir. Te invito a soñar en grande, a ser ambiciosa, a creer sin miedo que cada deseo que guardas en el corazón se va a hacer realidad. ¡Feliz cumpleaños, mi amor! Que este código llamado "nosotros" apenas esté compilando su mejor versión.',
      ],
    },
  ],

  // --------------------------------------------------------------------------
  //  DESPEDIDA
  // --------------------------------------------------------------------------
  closing: 'Eres mi línea de código favorita.',
  signOff: 'Siempre tuyo,',
  signature: 'RASHAD',

  // --------------------------------------------------------------------------
  //  EL FINAL
  // --------------------------------------------------------------------------
  finale: {
    kicker: 'Fin de la carta',
    title: '¡Feliz cumpleaños!',
    message:
      'Ocho capítulos, una vida entera por delante y un solo programa ejecutándose desde hoy: nosotros. Gracias por existir justo en mi vida.',
  },

  // Galería de recuerdos (se abre desde el botón del final).
  gallery: [
    { src: foto1, rotate: 270, aspect: 'landscape', caption: 'Nosotros' },
    { src: foto2, rotate: 90, aspect: 'landscape', caption: 'Un día cualquiera' },
    { src: foto3, rotate: 0, aspect: 'portrait', caption: 'En su trono' },
    { src: foto4, rotate: 0, aspect: 'portrait', caption: 'Sonrisa' },
    { src: foto5, rotate: 0, aspect: 'portrait', caption: 'Para siempre' },
  ],

  // Audio ambiente opcional (mp3 dentro de public/audio/).
  // Deja la línea comentada si no quieres música.
  // musicSrc: '/audio/nuestra-cancion.mp3',
}