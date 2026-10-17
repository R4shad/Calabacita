import { useEffect } from 'react'

/** Bloquea el scroll del documento mientras `locked` sea `true`. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement } = document
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const scrollbar = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [locked])
}