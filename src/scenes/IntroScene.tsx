import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSparkle, playBell, playTap, playWhoosh, unlockAudio } from '../utils/haptics'

// Stitch asset URLs — exact from splash.html
const SKY_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCFy4KSQVB7jKeau1VI6U1ii9I4cPgamQtEHIZ7LRoTRnIVmw12k744DFrHO2VXuUs4yw-mNzP3NJWmJDdbKaNelZw4nDLsTDcCObfjm7SUYePQSfcugWGUYY1GsihTGsdZFnpOCq0VwCLHxB0JD-UWVHLVbAE0Y6ujZMrXabH9LvDYhNpkftCz150c5fgMlNTnHcM6BsvKM1t0RxvC8Wdvopcs0IcDDSlHkIroNcZD_N2cIlWxIH2bhpFiU-bnZZDZ24YTfCaY2cMS'
const CRYSTAL_BALL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDkN1DI_XdIxPhvtMdZBueCHS12nzXprK7U3lbB8Bdv4ZnSNm7e5pMag_Qbrsjdsst6srmHSbLwd64nA6AG_2s6TLFBJVLFuMCX8mMBoiV65GLw1pY9irAr-fo3vnEMI3FhzOGBu_u8NWa-XdVWmGHKYPLp_ZaT9VqJye64IUanDeTAbLCqJvsr8MfhZVgPf8n0lP5tK_f52bNZ7xBoMwsMgsewPQvRpQmQejGYwvJDLcpSHZMEv0-b0qlEO0TQRdVaiLdOCoBYX2_A'
const MYSTICAL_EYE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDkWvNnHx47Qn4xrzqeUo8_M_LHd7o7lQXp6_cqq1DeOquwZLpYxOzsegNzPWWWpUvRrtrHAmjD8NAW0tnIyatIuV_Z6KK0D8Qc9iUEPen02p_Pl8uW1jixJKje6SDoafEpf-c_ScFDqpoJezamkfYwSVzKrgel3qj9S9C6gfMTBO9G7vGTJ0m67Hosq6WnM6yapD2sYgVMS2HNDEHkjq76sg8P6WDHQ-d8MISrAeRkQAtn4S46otgDn0lIeVQENfkFrgYg5Qajw6sD'
const CANDLE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-3IwMPIUrMMBn6SLO-lOKXz8zfsPYMhB9s_72MCjg8LXUjWepC1dDDcupuz2ditqCSnDx6zldIrDwvUJMFJkxOKKc2b4008z96jQLXtg5XTkRuWl0T7uVN6xWGW56R9tAZ9-kech5Wj2F2JOdDlOqEHjROhpbKy2XaIeloMr2wCYCPcpOrOkPV1uIraQQhFOfmKKso1PiVTG6RCzP4ofDKYjMsGu-b9NWlI7IOKDuZ88Va-7FMFkZJEhWnhTLx1TJuVajKZ_QUmGI'

// Smooth easing — no bounce
const SMOOTH: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const ENTER_SMOOTH = { duration: 0.7, ease: SMOOTH }

interface IntroSceneProps {
  onComplete: () => void
}

export default function IntroScene({ onComplete }: IntroSceneProps) {
  const [phase, setPhase] = useState<'enter' | 'title' | 'tagline' | 'ready'>('enter')

  useEffect(() => {
    const timers = [
      setTimeout(() => { setPhase('title'); playSparkle() }, 600),
      setTimeout(() => { setPhase('tagline'); playBell(660) }, 1600),
      setTimeout(() => { setPhase('ready'); playBell(880) }, 2400),
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
          {/* Crystal Ball */}
          <motion.div
            layout={false}
            className="absolute top-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 opacity-90 drop-shadow-2xl rotate-[-12deg]"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.3, ...ENTER_SMOOTH }}
          >
            <img
              className="w-full h-full object-contain"
              alt="Crystal ball"
              src={CRYSTAL_BALL}
            />
          </motion.div>

          {/* Floating Stars */}
          <motion.div
            layout={false}
            className="absolute top-[20%] right-[15%] text-primary"
            style={{ willChange: 'transform, opacity', rotate: 12 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1.5 }}
            transition={{ delay: 0.36, ...ENTER_SMOOTH }}
          >
            <span
              className="material-symbols-outlined !text-6xl"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 15px rgba(46,91,255,0.5))' }}
            >
              star
            </span>
          </motion.div>

          {/* Mystical Eye */}
          <motion.div
            layout={false}
            className="absolute bottom-[25%] left-[12%] w-24 h-24 md:w-36 md:h-36 hover:rotate-6 transition-transform"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 0.85, x: 0 }}
            transition={{ delay: 0.42, ...ENTER_SMOOTH }}
          >
            <img
              className="w-full h-full object-contain rounded-full border-4 border-on-background shadow-xl"
              alt="Mystical eye"
              src={MYSTICAL_EYE}
            />
          </motion.div>

          {/* Magic Candle */}
          <motion.div
            layout={false}
            className="absolute bottom-[15%] right-[10%] w-28 h-40 opacity-90 rotate-3"
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.48, ...ENTER_SMOOTH }}
          >
            <img
              className="w-full h-full object-contain"
              alt="Magic candle"
              src={CANDLE}
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
                <div className="absolute -right-12 -bottom-8 text-on-background opacity-60">
                  <span className="material-symbols-outlined !text-4xl rotate-45">
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
                className="group relative px-12 py-6 bg-primary-container text-white font-label font-black text-2xl uppercase tracking-[0.2em] border-4 border-on-background rounded-full shadow-[8px_8px_0px_0px_rgba(27,29,14,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 cursor-pointer"
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
      <div className="fixed top-8 right-8 z-30">
        <div className="flex items-center gap-4">
          <button aria-label="Toggle sound" className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 hover:bg-white/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-background">volume_up</span>
          </button>
          <button aria-label="About LORA" className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 hover:bg-white/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-background">info</span>
          </button>
        </div>
      </div>
    </div>
  )
}
