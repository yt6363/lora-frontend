import { useState, useEffect, useCallback } from 'react'
// No auto-play sounds on intro — only tap/click sounds on user interaction
import { motion, AnimatePresence } from 'framer-motion'
import { playTap, playWhoosh, unlockAudio } from '../utils/haptics'

// Background + floating element assets
const SKY_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCFy4KSQVB7jKeau1VI6U1ii9I4cPgamQtEHIZ7LRoTRnIVmw12k744DFrHO2VXuUs4yw-mNzP3NJWmJDdbKaNelZw4nDLsTDcCObfjm7SUYePQSfcugWGUYY1GsihTGsdZFnpOCq0VwCLHxB0JD-UWVHLVbAE0Y6ujZMrXabH9LvDYhNpkftCz150c5fgMlNTnHcM6BsvKM1t0RxvC8Wdvopcs0IcDDSlHkIroNcZD_N2cIlWxIH2bhpFiU-bnZZDZ24YTfCaY2cMS'
const TAROT_CARD = '/intro-tarot.png'
const CELESTIAL_ORB = '/intro-orb.png'
const HEALING_CARD = '/intro-healing.png'

// Smooth easing — no bounce
const SMOOTH: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const ENTER_SMOOTH = { duration: 0.7, ease: SMOOTH }

interface IntroSceneProps {
  onComplete: () => void
}

export default function IntroScene({ onComplete }: IntroSceneProps) {
  const [phase, setPhase] = useState<'enter' | 'title' | 'tagline' | 'ready'>('enter')
  // Visual phases run silently — no auto-play sounds
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('title'), 600),
      setTimeout(() => setPhase('tagline'), 1600),
      setTimeout(() => setPhase('ready'), 2400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleBegin = useCallback(() => {
    unlockAudio()
    playTap()
    playWhoosh()
    onComplete()
  }, [onComplete])

  return (
    <div className="fixed inset-0 overflow-hidden bg-background font-body text-on-background selection:bg-primary-container selection:text-white">
      {/* ── Ethereal Background Canvas ── */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${SKY_BG}')` }}
        />
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
      </div>

      {/* ── Main Splash Container ── */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* ── Floating 3D Objects Cluster ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Tarot Card — top left */}
          <motion.div
            layout={false}
            className="absolute top-[8%] left-[3%] w-20 h-32 md:w-40 md:h-64 drop-shadow-2xl rotate-[-8deg]"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.3, ...ENTER_SMOOTH }}
          >
            <img
              className="w-full h-full object-contain"
              alt="Tarot card"
              src={TAROT_CARD}
            />
          </motion.div>

          {/* Floating Star */}
          <motion.div
            layout={false}
            className="absolute top-[10%] right-[8%] md:top-[20%] md:right-[15%] text-primary"
            style={{ willChange: 'transform, opacity', rotate: 12 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1.5 }}
            transition={{ delay: 0.36, ...ENTER_SMOOTH }}
          >
            <span
              className="material-symbols-outlined !text-4xl md:!text-6xl"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 15px rgba(46,91,255,0.5))' }}
            >
              star
            </span>
          </motion.div>

          {/* Celestial Orb — bottom left */}
          <motion.div
            layout={false}
            className="absolute bottom-[18%] left-[5%] w-20 h-20 md:bottom-[22%] md:left-[10%] md:w-44 md:h-44 drop-shadow-2xl"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ delay: 0.42, ...ENTER_SMOOTH }}
          >
            <img
              className="w-full h-full object-contain"
              alt="Celestial orb"
              src={CELESTIAL_ORB}
            />
          </motion.div>

          {/* Healing Quote — bottom right */}
          <motion.div
            layout={false}
            className="absolute bottom-[18%] right-[3%] w-24 h-24 md:bottom-[14%] md:right-[6%] md:w-44 md:h-44 rotate-[3deg] drop-shadow-2xl"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.48, ...ENTER_SMOOTH }}
          >
            <img
              className="w-full h-full object-contain"
              alt="Healing begins with letting go"
              src={HEALING_CARD}
            />
          </motion.div>
        </div>

        {/* ── Hero Content Section ── */}
        <div className="relative z-20 flex flex-col items-center">
          {/* 3D Chrome Branding */}
          <motion.div
            layout={false}
            className="mb-0 select-none"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{
              opacity: phase !== 'enter' ? 1 : 0,
              scale: phase !== 'enter' ? 1 : 0.8,
              y: phase !== 'enter' ? 0 : 40,
            }}
            transition={{ duration: 0.8, ease: SMOOTH }}
          >
            <img
              src="/lora-logo.png"
              alt="Lora"
              className="h-[160px] md:h-[260px] w-auto object-contain mix-blend-screen drop-shadow-2xl"
            />
          </motion.div>

          {/* Handwritten Tagline */}
          <AnimatePresence>
            {(phase === 'tagline' || phase === 'ready') && (
              <motion.div
                layout={false}
                className="relative -mt-6 md:-mt-12 mb-6"
                style={{ willChange: 'transform, opacity', rotate: -3 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: SMOOTH }}
              >
                <span className="font-handwritten text-2xl md:text-3xl text-secondary bg-surface-bright/80 backdrop-blur-sm px-4 py-1 rounded-full border-2 border-secondary shadow-sm">
                  the map to you
                </span>
                {/* Doodle Arrow */}
                <div className="absolute -right-8 md:-right-12 -bottom-8 text-on-background opacity-60">
                  <span className="material-symbols-outlined !text-3xl md:!text-4xl rotate-45">
                    south_east
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* "Sticker" Button */}
          <AnimatePresence>
            {phase === 'ready' && (
              <motion.button
                layout={false}
                onClick={handleBegin}
                className="group relative px-8 py-4 md:px-12 md:py-6 bg-primary-container text-white font-label font-black text-xl md:text-2xl uppercase tracking-[0.2em] border-4 border-on-background rounded-full shadow-[8px_8px_0px_0px_rgba(27,29,14,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 cursor-pointer"
                style={{ willChange: 'transform, opacity' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: SMOOTH, delay: 0.06 }}
              >
                <span className="relative z-10">begin</span>
                {/* Sparkle Icons inside Button */}
                <div className="absolute -top-4 -right-4 bg-secondary text-white p-2 rounded-full border-2 border-on-background group-hover:rotate-12 transition-transform">
                  <span
                    className="material-symbols-outlined !text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Bottom Annotation */}
          <AnimatePresence>
            {phase === 'ready' && (
              <motion.p
                layout={false}
                className="mt-12 font-body font-bold text-xs uppercase tracking-widest text-on-background"
                style={{ willChange: 'transform, opacity' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.4, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: SMOOTH, delay: 0.12 }}
              >
                Shift your orbit. Find your center.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Contextual "Easter Egg" UI elements ── */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.div
            layout={false}
            className="fixed bottom-8 left-8 z-30 hidden md:block"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: SMOOTH, delay: 0.18 }}
          >
            <div className="bg-surface-container-high border-2 border-on-background p-4 rounded-xl shadow-lg max-w-[200px]">
              <p className="font-handwritten text-lg leading-tight">
                &ldquo;The stars don&rsquo;t lie, but they do whisper&hellip;&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top-right controls ── */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-30 safe-area-top">
        <div className="flex items-center gap-2 md:gap-4">
          <button aria-label="Toggle sound" className="w-10 h-10 md:w-12 md:h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 hover:bg-white/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-background text-xl md:text-2xl">volume_up</span>
          </button>
          <button aria-label="About LORA" className="w-10 h-10 md:w-12 md:h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 hover:bg-white/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-background text-xl md:text-2xl">info</span>
          </button>
        </div>
      </div>
    </div>
  )
}
