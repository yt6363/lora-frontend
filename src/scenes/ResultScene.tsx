import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LoraFooter from '../components/LoraFooter'
import { playRevealGong, playSectionReveal, playTap } from '../utils/haptics'

const CRYSTAL_CLUSTER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbMjOkLYgdw3SjB0JDP5zYns2ep9izR5jdKiktbOfu5aJC8D7vaxjKko2a0TzTxLktRPcXuH3Luzu4RCoXySdcM1fw7MD1sIwpYmKHJ2PUSIMZoGZz3wKbu642ELwmbHFe_-Wpedg3ZpwG5jITI-gN5nz1970_iTW6ZlkyhXIsOjA_6j7TrBCdf7ROlFVVlQckz4R9Oy-Kge0bmR7p8G8OKG9rDrhKbGuh7Ku_tIEzG-xYqr-JGovjejXQ-LTLVGF5gyHGsvHrQwSE'
const SUNSET_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkPAwrtIuczf43pENVBss9mNwVuwnoJVPjolc7VDtw2iGqqDBjBQvN4I1EtD91I9a3FPxlj7B4yKFKjmwZJBIND0xIZUSEQvJQGHUjLODJPVhwsuVfDJ1wxOdvxkYNvosI2gotJfi1GjdHH6YIXo03oRos2GuvTMuPkrOmRrUmI1u03fo93F120k6POzj97Hg1P6eVWnH0Ky6yCbOAv0WfRyjzyLxr9VIBpkl-r34PR7u0BsMs_7CyGCBJB7Rfh7Z2GyMnSgkHgTqw'
const MOON_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGFDSEdY6plVXNN0G21DSQ481OgEkz6al5814l9QEI_IH045JksWD05mGIC6hVIzsuaAF1DZAiEh8nHnQwL2lXfSiILvvtIDzyCALaSend7VtLfJ1xma85sQunCXso5pHJcjOyKSevIrpC-d0k5eEY-JHp0w2C7AI0fHLjgdFAQxSaAFi3s3vk_NRJOGFh9Lu-YXlqHJu7cH8ALqHYDnkj4bMB4d_VwfFNT3-h0vV-6M5rS3ieDjBvoyOTR_WR02Xnu0GlIqYUtx_4'

interface Reading {
  governing_planet: string
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
  raw?: Record<string, unknown>
}

interface ResultSceneProps {
  name: string
  reading: Reading
  onReset: () => void
}

const ROTATIONS = ['rotate-[-1deg]', 'rotate-[1.5deg]', 'rotate-[0.5deg]', 'rotate-[-1.5deg]', 'rotate-[-2deg]']
const CARD_BG = ['bg-surface', 'bg-primary-container', 'bg-surface', 'bg-secondary-container', 'bg-surface']
const CARD_TEXT = ['text-primary', 'text-on-primary-container', 'text-primary', 'text-white', 'text-primary']

export default function ResultScene({ name, reading, onReset }: ResultSceneProps) {
  const [revealed, setRevealed] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [premiumRevealed, setPremiumRevealed] = useState(0)

  useEffect(() => {
    // Gong on hero reveal
    playRevealGong()

    const timer = setInterval(() => {
      setRevealed((r) => {
        if (r >= 5) { clearInterval(timer); return 5 }
        const next = r + 1
        playSectionReveal(next)
        return next
      })
    }, 400)
    return () => clearInterval(timer)
  }, [])

  // total items = insight cards + 1 for colors
  const totalPremiumItems = reading.premium.length + (reading.luckyColors.length > 0 ? 1 : 0)

  const handleUnlock = () => {
    if (unlocked) return
    playTap()
    setUnlocked(true)
    let count = 0
    const timer = setInterval(() => {
      count++
      if (count > totalPremiumItems) { clearInterval(timer); return }
      playSectionReveal(count)
      setPremiumRevealed(count)
    }, 350)
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar — exact match Stitch reading.html line 85 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent">
        <img src="/lora-logo.png" alt="Lora" className="h-10 w-auto object-contain" />
        <div className="flex gap-4">
          <button aria-label="Account" className="text-[#2E5BFF] hover:rotate-2 hover:scale-110 transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </button>
          <button aria-label="Discover" className="text-[#2E5BFF] hover:rotate-2 hover:scale-110 transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
          </button>
        </div>
      </header>

      <main className="overflow-x-hidden">
        {/* ─── HERO — match Stitch line 98 ─── */}
        <section className="min-h-screen bg-primary-container flex flex-col justify-center items-center relative px-6 pt-24 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 opacity-20 pointer-events-none">
            <img src={CRYSTAL_CLUSTER} alt="" className="w-full h-full object-contain" />
          </div>

          <motion.div
            className="relative z-10 text-center max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="flex flex-wrap justify-center items-baseline gap-x-3 md:gap-x-4">
              <span className="font-headline italic text-4xl md:text-9xl text-white">The</span>
              <span className="font-body font-black text-3xl md:text-8xl text-on-primary-container uppercase tracking-tighter">
                {reading.archetype}
              </span>
              <span className="font-handwritten text-3xl md:text-7xl text-secondary-container rotate-[-4deg] block w-full md:w-auto">
                Truth
              </span>
              <span className="font-headline italic text-4xl md:text-9xl text-white">
                of {name}
              </span>
            </h1>
            <p className="font-handwritten text-2xl md:text-5xl text-white mt-8 md:mt-12 rotate-[-2deg] opacity-90">
              &ldquo;{reading.hook}&rdquo;
            </p>
          </motion.div>

          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 bg-secondary text-white font-label font-bold px-4 py-2 md:px-6 md:py-3 text-xs md:text-base rounded-full rotate-6 shadow-xl border-2 border-on-surface">
            SOUL ARCHETYPE
          </div>
        </section>

        {/* ─── THE READING — match Stitch line 120: py-32 px-6 max-w-3xl ─── */}
        {revealed >= 1 && (
          <motion.section
            className="py-32 px-6 max-w-3xl mx-auto space-y-16 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="font-headline italic text-4xl md:text-5xl text-primary leading-tight" style={{ textWrap: 'balance' }}>
              {reading.lead}
            </div>

            <div className="space-y-12 text-xl md:text-2xl font-body leading-relaxed text-on-surface/80">
              <p>{reading.body1}</p>

              {/* Cinematic image break — match Stitch line 129 */}
              <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-24 group">
                <img src={SUNSET_IMG} alt="" className="w-full h-[300px] md:h-[614px] object-cover" />
                <div className="absolute top-1/4 left-10 md:left-1/4 font-handwritten text-4xl md:text-6xl text-white rotate-[-5deg] drop-shadow-lg">
                  this is so you!
                </div>
                <div className="absolute bottom-10 right-10">
                  <span
                    className="material-symbols-outlined text-white text-8xl opacity-40"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star_half
                  </span>
                </div>
              </div>

              <p>{reading.body2}</p>
              <p>{reading.body3}</p>
            </div>
          </motion.section>
        )}

        {/* ─── ENERGY SNAPSHOT — match Stitch line 147: py-32 px-6 ─── */}
        {revealed >= 2 && (
          <motion.section
            className="bg-surface-container-low py-32 px-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-headline italic text-4xl md:text-7xl text-center mb-12 md:mb-20 text-on-background">
              Energy Snapshot
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {reading.energies.map(([title, desc], i) => {
                const isMiddle = i === 1
                const rotation = i === 0
                  ? 'rotate-[-1deg]'
                  : i === 1
                    ? 'rotate-[2deg]'
                    : 'rotate-[-2deg]'
                return (
                  <div
                    key={title}
                    className={`p-10 border-4 border-on-surface shadow-[8px_8px_0_0_#1b1d0e] ${rotation} hover:rotate-0 transition-all ${isMiddle ? 'bg-secondary-container' : 'bg-surface'}`}
                  >
                    <span
                      className={`font-body font-black text-5xl block mb-6 uppercase tracking-tighter ${isMiddle ? 'text-white' : 'text-primary'}`}
                    >
                      {title}
                    </span>
                    <p
                      className={`font-body text-lg leading-snug ${isMiddle ? 'text-on-secondary-container' : ''}`}
                    >
                      {desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* ─── YOUR NUMBER SAYS — match Stitch line 168: py-40 px-6 ─── */}
        {revealed >= 3 && (
          <motion.section
            className="bg-on-background text-surface-bright py-40 px-6 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h3 className="font-headline italic text-3xl md:text-6xl mb-8 md:mb-12" style={{ textWrap: 'balance' }}>Your number says&hellip;</h3>
              <p className="font-body text-xl md:text-4xl leading-relaxed opacity-90">
                {reading.numberSays}
              </p>
              <div className="mt-20 flex justify-center gap-8 opacity-20">
                <span className="material-symbols-outlined text-9xl">lock_open</span>
                <span
                  className="material-symbols-outlined text-9xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_fix_high
                </span>
                <span className="material-symbols-outlined text-9xl">star_half</span>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 opacity-30">
              <img src={MOON_IMG} alt="" className="w-full h-full object-contain" />
            </div>
          </motion.section>
        )}

        {/* ─── UNLOCK GATE ─── */}
        {revealed >= 4 && !unlocked && (
          <motion.section
            className="py-20 px-6 flex flex-col items-center justify-center bg-surface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={handleUnlock}
              className="group relative bg-on-background text-surface-bright border-4 border-on-surface px-6 py-4 md:px-10 md:py-5 font-body font-black text-base md:text-2xl uppercase tracking-wider md:tracking-widest shadow-[8px_8px_0_0_#2E5BFF] hover:shadow-[12px_12px_0_0_#2E5BFF] hover:scale-105 rotate-[-1deg] hover:rotate-0 transition-all active:scale-95 cursor-pointer flex items-center gap-3 md:gap-4"
            >
              <span className="material-symbols-outlined text-3xl group-hover:animate-pulse">lock</span>
              Unlock More About You
              <span className="material-symbols-outlined text-3xl group-hover:animate-pulse">lock</span>
            </button>
            <p className="mt-6 font-handwritten text-2xl text-on-surface/50 rotate-[-2deg]">
              there&rsquo;s so much more to see&hellip;
            </p>
          </motion.section>
        )}

        {/* ─── PREMIUM CONTENT ─── */}
        {unlocked && premiumRevealed >= 1 && (
          <motion.section
            className="py-24 px-6 bg-surface-container-low"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-headline italic text-5xl md:text-7xl text-center mb-16 text-on-background">
              Deeper Truths
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {reading.premium.map(([title, text], i) => {
                if (premiumRevealed < i + 1) return null
                return (
                  <motion.div
                    key={i}
                    className={`p-8 border-4 border-on-surface shadow-[8px_8px_0_0_#1b1d0e] ${ROTATIONS[i % ROTATIONS.length]} hover:rotate-0 transition-all ${CARD_BG[i % CARD_BG.length]}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <span className={`font-body font-black text-2xl block mb-4 uppercase tracking-tighter ${CARD_TEXT[i % CARD_TEXT.length]}`}>
                      {title}
                    </span>
                    <p className={`font-body text-lg leading-relaxed ${i % CARD_BG.length === 3 ? 'text-on-secondary-container' : ''}`}>
                      {text}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Lucky Colors */}
            {reading.luckyColors.length > 0 && premiumRevealed > reading.premium.length && (
              <motion.div
                className="mt-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className="font-label font-bold text-sm uppercase tracking-widest text-on-surface/40">Your Colors</span>
                <div className="flex flex-wrap justify-center gap-3">
                  {reading.luckyColors.map((color) => (
                    <span key={color} className="bg-on-background text-surface-bright font-body font-bold px-5 py-2 border-2 border-on-surface shadow-[4px_4px_0_0_#1b1d0e] text-sm uppercase tracking-wide">
                      {color}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* ─── CTA ─── */}
        {revealed >= 4 && (unlocked ? premiumRevealed >= totalPremiumItems : true) && (
          <section className="py-32 px-6 flex flex-col items-center justify-center bg-surface">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-primary-container rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <button
                onClick={() => { playTap(); onReset() }}
                className="relative bg-primary text-white border-4 border-on-surface px-12 py-6 rounded-full font-body font-black text-2xl uppercase tracking-widest hover:scale-110 hover:rotate-2 transition-all active:scale-90 cursor-pointer"
              >
                Read Another
              </button>
            </div>
            <div className="mt-12 flex flex-col items-center">
              <div className="font-handwritten text-4xl text-on-surface rotate-[-3deg]">
                thanks for letting us in
              </div>
              <div className="mt-4">
                <span className="material-symbols-outlined text-secondary text-5xl">favorite</span>
              </div>
            </div>
          </section>
        )}

        {revealed >= 4 && <LoraFooter fixed={false} />}

        <div className="h-32" />
      </main>

      {/* ─── BOTTOM NAV — decorative bar ─── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-4 bg-[#f5f5dc] rounded-t-full border-t-4 border-[#1b1d0e] shadow-[0_-8px_0_0_rgba(46,91,255,1)]">
        <div className="h-8" />
      </nav>
    </div>
  )
}
