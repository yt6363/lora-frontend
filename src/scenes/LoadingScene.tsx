import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { playAmbientPad, playBell } from '../utils/haptics'

const LOADING_TIPS = [
  'Your North Node is currently dancing with the spirit of the Oracle.',
  'Every name carries a vibration — yours is being decoded right now.',
  'Numbers don\u2019t lie. They whisper truths most people never hear.',
  'The universe assigned you a frequency before you were born.',
  'Your phone number holds a hidden pattern. We\u2019re reading it.',
  'Ancient numerologists believed names shape destiny. Let\u2019s find yours.',
  'Some numbers attract abundance. Others attract chaos. Which are yours?',
  'Your energy signature is unlike anyone else\u2019s on the planet.',
  'The cosmos is aligning your reading as we speak.',
  'Fun fact: Pythagoras believed the universe was built on numbers.',
  'Your name isn\u2019t random — it\u2019s a cosmic fingerprint.',
  'We\u2019re cross-referencing your vibration with planetary cycles.',
]

const CRYSTAL_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCPjouBqM_5SKcGPSL1Xk2b8MlhGDO3G1CmmxTAYp0W26BxVzYUYLOhBi7sY4YkN9PCx0jDTIJ0ejNDVP0XzeSkFEHXHp9v9gUjWf2uvdFeZbRL6qRtkiwWzW-QuNIjG63P3C-VcFHE2QkY5xPn4IG074_MRbQ-Nh1xpvs8zigCMgmstIIRTJ-DyKyOhIkBMGdcA-LagpEiM77FFH7GnkHaJaXA7rKr62UEuhOG1bbaEr-96LUYFgGln66ZzrmXuDgV0CUw1tPfi9jO'
const CLOUD_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCydiA6u6or00OHKl8KVjEbnaJnpIqVp2KR9JTjJQgf19XeXmZu1PExJJ7muR-XUxmzew3dVbA-rxLrjLTs4cJUf3QaY4UGOhYCe8ixX52gWDyfLY0QxCKLStlXtuv0CWtSoAW216-G2duWyvRIzut3EpZNUvIv7D2l_qDajR8hFgq4tc-D6OORkybStsJDUolVsxXD2xkL_EN64sUyXjLbVweLbbVJQlSqXCA6Xc4PE4vFnkkY0196qP6rPXDZPHWAdlgWGORQZCaW'

interface LoadingSceneProps {
  name: string
}

export default function LoadingScene(_props: LoadingSceneProps) {
  const tip = useMemo(() => LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)], [])

  useEffect(() => {
    // Single gentle ambient pad — fades in slowly
    const stopPad = playAmbientPad()
    // One bell midway through
    const bellTimer = setTimeout(() => playBell(392, 0.03), 2000)
    return () => {
      clearTimeout(bellTimer)
      stopPad()
    }
  }, [])

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body text-on-surface">
      {/* TopAppBar — exact match 4-loading.html line 101 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent">
        <img src="/lora-logo.png" alt="Lora" className="h-10 w-auto object-contain" />
        <div className="flex gap-4">
          <button aria-label="Discover" className="material-symbols-outlined text-[#2E5BFF] hover:rotate-2 hover:scale-110 transition-transform p-2">
            auto_awesome
          </button>
          <button aria-label="Account" className="material-symbols-outlined text-[#2E5BFF] hover:rotate-2 hover:scale-110 transition-transform p-2">
            account_circle
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow sky-bg flex flex-col items-center justify-between relative px-6 overflow-hidden pt-20 pb-32">
        {/* Cloud layer */}
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '200%',
            height: '100%',
            backgroundImage: `url('${CLOUD_BG}')`,
            opacity: 0.4,
          }}
        />

        {/* Top section — Crystal (staggers in after cloud) */}
        <motion.div
          className="relative z-10 flex flex-col items-center mt-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative w-36 h-36 md:w-64 md:h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary opacity-10 blur-[60px] rounded-full" />

            <div className="relative animate-pulse floating-crystal rotate-12">
              <div className="w-32 h-32 md:w-52 md:h-52 rounded-2xl overflow-hidden">
                <img src={CRYSTAL_IMG} alt="Crystal" className="w-full h-full object-cover scale-[1.3]" />
              </div>
            </div>

            {/* Star Badge */}
            <motion.div
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-14 h-14 md:w-18 md:h-18 bg-secondary-container rounded-full flex items-center justify-center rotate-12 brutalist-shadow"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <span className="material-symbols-outlined text-white text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </motion.div>

            {/* Aligning Label */}
            <motion.div
              className="absolute -bottom-4 -left-2 rotate-[-8deg] bg-surface-container-highest px-4 py-2 brutalist-shadow"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <span className="font-headline italic text-on-surface text-base">Aligning...</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Middle section — Loading Text (staggers in second) */}
        <motion.div
          className="relative z-10 text-center space-y-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="font-headline text-3xl md:text-6xl text-on-background italic tracking-tight">
            Preparing your{' '}
            <span className="font-body font-black uppercase text-primary">vision</span>
          </h1>
          <motion.p
            className="font-handwritten text-3xl md:text-4xl text-secondary rotate-[-2deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            one sec, reading you...
          </motion.p>
        </motion.div>

        {/* Bottom section — Tooltip (staggers in third) */}
        <motion.div
          className="relative z-10 backdrop-blur-xl bg-surface/30 border-2 border-on-surface/5 p-3 rounded-xl max-w-xs text-center brutalist-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.4, ease: 'easeOut' }}
        >
          <p className="font-body text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Did you know?
          </p>
          <p className="font-headline text-sm md:text-lg italic leading-snug">
            {tip}
          </p>
        </motion.div>

        {/* Floating Annotations — stagger in last */}
        <motion.div
          className="fixed top-1/3 right-8 md:right-16 rotate-12 hidden lg:block z-20 pointer-events-none"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          <p className="font-handwritten text-xl text-tertiary-container max-w-[150px]">
            The stars are moving fast tonight! {'\u2728'}
          </p>
        </motion.div>
        <motion.div
          className="fixed bottom-1/3 left-8 md:left-16 rotate-[-10deg] hidden lg:block z-20 pointer-events-none"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.0, duration: 0.4 }}
        >
          <p className="font-handwritten text-xl text-tertiary-container max-w-[180px]">
            Energy feels very cobalt blue today. {'\uD83C\uDF00'}
          </p>
        </motion.div>
      </main>
    </div>
  )
}
