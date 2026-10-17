import type { Mood, MoodKey } from './types'

/** Paleta cálida: rosa pastel, crema, borgoña y dorados suaves. */
export const MOODS: Record<MoodKey, Mood> = {
  rose: {
    sky: ['#2c1020', '#471631', '#661d44'],
    glow: '#ff9ec4',
    spark: '#ffdcea',
  },
  blush: {
    sky: ['#34151f', '#5a2130', '#7d3049'],
    glow: '#ffb3cd',
    spark: '#ffe9f2',
  },
  plum: {
    sky: ['#250f27', '#3a163a', '#53214f'],
    glow: '#c9a2ff',
    spark: '#e9dcff',
  },
  wine: {
    sky: ['#2c0b14', '#4c1122', '#6e1a32'],
    glow: '#ff8a7a',
    spark: '#ffd8cb',
  },
  amber: {
    sky: ['#2b170d', '#4b2511', '#6d3a19'],
    glow: '#ffc070',
    spark: '#ffe8c4',
  },
  night: {
    sky: ['#12172a', '#1a2942', '#273d5c'],
    glow: '#7fd3ff',
    spark: '#d6edff',
  },
}

export const DEFAULT_MOOD: MoodKey = 'rose'

export function getMood(key: MoodKey | undefined): Mood {
  return MOODS[key ?? DEFAULT_MOOD]
}