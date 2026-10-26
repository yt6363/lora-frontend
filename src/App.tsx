import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IntroScene from './scenes/IntroScene'
import InputScene from './scenes/InputScene'
import LoadingScene from './scenes/LoadingScene'
import ResultScene from './scenes/ResultScene'
import LoraFooter from './components/LoraFooter'
import { playTap, playWhoosh, unlockAudio } from './utils/haptics'
import './index.css'

type Scene = 'intro' | 'input' | 'loading' | 'results'

interface ReadingResult {
  archetype: string
  hook: string
  lead: string
  body1: string
  body2: string
  body3: string
  energies: [string, string][]
  numberSays: string
  premium: [string, string][]
  luckyColors: string[]
}

const SCENES: Scene[] = ['intro', 'input', 'loading', 'results']

function App() {
  const [scene, setScene] = useState<Scene>('intro')
  const [transitioning, setTransitioning] = useState(false)
  const [userName, setUserName] = useState('')
  const [readingResult, setReadingResult] = useState<Partial<ReadingResult> | null>(null)
  const [readingDone, setReadingDone] = useState(false)
  const readingRun = useRef(0)
  const [cloudFaded, setCloudFaded] = useState(false)

  // Unlock audio on first user interaction anywhere
  useEffect(() => {
    const handler = () => { unlockAudio(); window.removeEventListener('pointerdown', handler) }
    window.addEventListener('pointerdown', handler, { once: true })
    return () => window.removeEventListener('pointerdown', handler)
  }, [])

  // Fade out white cloud after mount
  useEffect(() => {
    const t = setTimeout(() => setCloudFaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Cloud transition wrapper — fogs in, switches scene, fogs out
  // Skip cloud for intro (first load / reset)
  const transitionTo = useCallback((target: Scene) => {
    if (transitioning) return
    if (target === 'intro') {
      // No cloud for intro — just switch
      setScene(target)
      return
    }
    playWhoosh()
    setTransitioning(true)
    setTimeout(() => {
      setScene(target)
      setTimeout(() => setTransitioning(false), 600)
    }, 500)
  }, [transitioning])

  const handleIntroComplete = useCallback(() => {
    transitionTo('input')
  }, [transitionTo])

  // The reading streams in as NDJSON events, one per field. The results page
  // opens as soon as the hero and lead are ready; the rest fills in below.
  const handleSubmit = useCallback(async (data: { name: string; phone: string }) => {
    const run = ++readingRun.current
    setUserName(data.name)
    setReadingResult(null)
    setReadingDone(false)
    transitionTo('loading')

    let reading: Partial<ReadingResult> = {}
    let opened = false
    const update = (patch: Partial<ReadingResult>) => {
      if (run !== readingRun.current) return
      reading = { ...reading, ...patch }
      setReadingResult(reading)
      if (!opened && reading.archetype && reading.hook && reading.lead) {
        opened = true
        transitionTo('results')
      }
    }

    try {
      const res = await fetch('/api/analyze/reading/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, phone: data.phone }),
      })
      if (!res.ok || !res.body) throw new Error(`Server error: ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      let finished = false
      while (!finished) {
        const { value, done } = await reader.read()
        buf += decoder.decode(value, { stream: !done })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.trim()) continue
          const event = JSON.parse(line)
          if (event.type === 'colors') update({ luckyColors: event.luckyColors })
          else if (event.type === 'field') update({ [event.key]: event.value })
          else if (event.type === 'error') throw new Error(event.message)
          else if (event.type === 'done') finished = true
        }
        if (done) break
      }
      if (!finished) throw new Error('Reading stream ended early')
    } catch (err) {
      console.error('Analysis failed:', err)
      if (run !== readingRun.current) return
      // Once the page is open, keep what arrived rather than throwing it away
      if (!opened) {
        alert('We could not finish your reading. Please try again.')
        transitionTo('input')
        return
      }
    }
    if (run === readingRun.current) {
      // Fill gaps so a stream that stopped early still renders cleanly
      update({ body1: '', body2: '', body3: '', energies: [], numberSays: '', premium: [], luckyColors: [], ...reading })
      setReadingDone(true)
    }
  }, [transitionTo])

  const handleReset = useCallback(() => {
    transitionTo('intro')
    readingRun.current++
    setTimeout(() => {
      setUserName('')
      setReadingResult(null)
      setReadingDone(false)
    }, 600)
  }, [transitionTo])

  return (
    <>
      {scene === 'intro' && <IntroScene onComplete={handleIntroComplete} />}
      {scene === 'input' && <InputScene onSubmit={handleSubmit} />}
      {scene === 'loading' && (
        <LoadingScene name={userName} />
      )}
      {scene === 'results' && readingResult && (
        <ResultScene
          name={userName}
          reading={readingResult}
          complete={readingDone}
          onReset={handleReset}
        />
      )}

      {/* ── Cloud Transition Overlay ── */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[998] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Fog layers */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: 'radial-gradient(ellipse at 30% 40%, rgba(46,91,255,0.15), transparent 70%), radial-gradient(ellipse at 70% 60%, rgba(254,126,79,0.1), transparent 70%)',
              }}
            />
            {/* Swirling cloud shapes */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/60 rounded-full blur-3xl"
              animate={{ x: [0, 50, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.2, 0.9, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
              animate={{ x: [0, -40, 30, 0], y: [0, 40, -20, 0], scale: [1, 0.9, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── White Cloud Intro ── */}
      <AnimatePresence>
        {!cloudFaded && (
          <motion.div
            className="fixed inset-0 z-[1000] bg-white pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            onAnimationComplete={() => setCloudFaded(true)}
          />
        )}
      </AnimatePresence>

      {scene === 'intro' && <LoraFooter />}

      {/* Dev Navigation Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[999] flex gap-1 bg-black rounded-full px-2 py-1.5 shadow-2xl border border-white/10">
        {SCENES.map((s) => (
          <button
            key={s}
            onClick={() => {
              playTap()
              transitionTo(s)
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wide transition-all cursor-pointer ${
              scene === s
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </>
  )
}

export default App
