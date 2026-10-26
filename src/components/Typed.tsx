import { useEffect, useRef, useState } from 'react'

const reduceMotion = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Letters per second when caught up; a backlog adds speed so typing never
// falls far behind the stream (200 letters behind types about twice as fast).
const BASE_RATE = 110

// Types `text` out letter by letter. Paced by elapsed time, not frames, so a
// 120Hz phone types at the same speed as a 60Hz laptop.
export default function Typed({ text }: { text: string }) {
  const [shown, setShown] = useState(reduceMotion ? text : '')
  const shownRef = useRef(shown)

  useEffect(() => {
    const show = (s: string) => { shownRef.current = s; setShown(s) }
    if (reduceMotion) { show(text); return }

    // The text changed underneath us (a final cleaned version): keep the shared prefix
    const cur = shownRef.current
    if (!text.startsWith(cur)) {
      let i = 0
      while (i < cur.length && cur[i] === text[i]) i++
      show(text.slice(0, i))
    }

    let frame = 0
    let last: number | null = null
    let carry = 0
    const tick = (now: number) => {
      const n = shownRef.current.length
      if (n >= text.length) return
      const dt = last === null ? 1 / 60 : Math.min((now - last) / 1000, 0.1)
      last = now
      carry += dt * BASE_RATE * (1 + (text.length - n) / 200)
      const step = Math.floor(carry)
      if (step > 0) {
        carry -= step
        show(text.slice(0, n + step))
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text])

  return <>{shown}</>
}
