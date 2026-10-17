import { AnimatePresence } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Ambient } from './components/Ambient'
import { EnvelopeIntro } from './components/EnvelopeIntro'
import { Finale } from './components/Finale'
import { Letter } from './components/Letter'
import { MusicToggle } from './components/MusicToggle'
import { Petals } from './components/Petals'
import { letter } from './content/letter'
import { useScrollLock } from './hooks/useScrollLock'
import { getMood } from './lib/theme'
import type { MoodKey } from './lib/types'

type Phase = 'intro' | 'letter' | 'finale'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [round, setRound] = useState(0)
  const [moodKey, setMoodKey] = useState<MoodKey>(letter.chapters[0]?.mood ?? 'rose')

  const mood = useMemo(() => getMood(moodKey), [moodKey])
  const playing = phase !== 'intro'

  useScrollLock(playing)

  /* Las variables CSS permiten que cualquier componente use el color del
     capítulo activo sin recibir props. */
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--glow', mood.glow)
    root.style.setProperty('--spark', mood.spark)
  }, [mood])

  const restart = () => {
    setRound((r) => r + 1)
    setPhase('letter')
  }

  return (
    <>
      <Ambient sky={mood.sky} glow={mood.glow} spark={mood.spark} />
      <Petals colors={[mood.spark, mood.glow, '#ffffff']} />

      <AnimatePresence>
        {phase === 'intro' && (
          <EnvelopeIntro
            key="intro"
            recipient={letter.recipient}
            date={letter.date}
            glow={mood.glow}
            onOpen={() => setPhase('letter')}
          />
        )}
      </AnimatePresence>

      <main>
        {phase === 'letter' && (
          <Letter
            key={`letter-${round}`}
            content={letter}
            onMoodChange={setMoodKey}
            onFinish={() => setPhase('finale')}
          />
        )}

        {phase === 'finale' && (
          <Finale key={`finale-${round}`} content={letter} onRestart={restart} />
        )}
      </main>

      <MusicToggle src={letter.musicSrc} />
    </>
  )
}