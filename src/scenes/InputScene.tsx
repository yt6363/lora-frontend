import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playKeystroke, playTap, playWhoosh } from '../utils/haptics'

const PRISM_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCfgxlE7kdPcGzzj7jMInZnQLoRCya76aTE8IupwwqT2FLs71HjKpmLY0qkA0DgGrBnkS6Wb4vyZPDcjUu-h40ndMoFTRuEkfzELsVcxUdSAaLcHBkMj87ORfOU8GXE45DUbQVtRjHpSJjjkTTTlp373MbuicD6xHm_j0mkIFz5L41cJSrWOmeGRwZhBaHTvS7kGVoo-csfyIjyAbTQzTx7RT90jJNqMYaiGzC-m2rklbj7eNuiF9Ydpvv_lWA8iSB-LvPo1DJGSCOI'
const CRYSTAL_STAR_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBD60615LInvcacHJFSfIv_k3olreekW2h0KYDpipV6jeX6V0IC5HTaMOSc6VFwph0gROnycS120Jvb7vfezFcwYuDxs0ZJlbpiZisJS01ugubTXDtufHRlGiNVJQSi7Rzo4q3nC3yHY-aUCGi4RC48TkpoJ5QWlyYQsyWkRpeNbGbg71MnMbSbs27XbVpe7yaAKTMPGIohyUs2qx_o6hdkx0b7C3FDWCVp2dzDiIOA6kF5AmHvNRWLxk0wwRON2Mdnc4lVf_DxztSe'
const DISCO_BALL_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD_NumKt8Jp6wypSvzSD_jjzwSU-CoH7Gf_jY4qe-Pf9QMdhGKeZp68OaZqz8zeq8xvdCcLsQzqbVhUxrVW4XTrjZa1oWsiDoAx7RoW6lPb5amjIgRToyrQ5yaQmKzeZIXHNRZLu20YF57Az-_Ww6mZkK3lzdmGd5L9QAZsMYbwhpthax4s1RNQrdPkvqPn5MZS-tIPaL_fjje62qRKLU2S_NSAJbk-kdcx3UNS4iXtbw1cfFvJKzzDOGsnugLYRkuc3YaVjkwU568G'

type Step = 'name' | 'phone' | 'submitting'

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const stepTransition = { duration: 0.4, ease: EXPO_OUT }
const enterSpring = { type: 'spring' as const, stiffness: 260, damping: 24 }
const staggerChildren = { staggerChildren: 0.15 }
const fadeSlideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
}
const childFadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface InputSceneProps {
  onSubmit: (data: { name: string; phone: string }) => void
}

export default function InputScene({ onSubmit }: InputSceneProps) {
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNameSubmit = () => {
    if (!name.trim()) return
    playTap()
    playWhoosh()
    setStep('phone')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handlePhoneSubmit = () => {
    if (!phone.trim()) return
    playTap()
    playWhoosh()
    setStep('submitting')
    setTimeout(() => onSubmit({ name: name.trim(), phone: phone.trim() }), 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') action()
    else playKeystroke()
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col overflow-hidden bg-background font-body text-on-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ willChange: 'opacity' }}
    >
      <main className="grow flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {/* ─── NAME STEP — exact match 2-name.html ─── */}
          {step === 'name' && (
            <motion.div
              key="name"
              className="absolute inset-0 z-0 flex items-center justify-center"
              {...fadeSlideUp}
              transition={stepTransition}
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="w-full h-full bg-primary-container relative overflow-hidden flex flex-col items-center justify-center px-6">
                {/* Floating 3D Objects — stagger in after cloud */}
                <motion.div
                  className="absolute top-[10%] left-[15%] rotate-[-12deg] z-10 opacity-90 hover:scale-110 transition-transform"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                  <img alt="Crystal Star" className="w-32 md:w-48 h-auto drop-shadow-2xl" src={CRYSTAL_STAR_IMG} />
                </motion.div>
                <motion.div
                  className="absolute bottom-[15%] right-[10%] rotate-[15deg] z-10 hover:rotate-[25deg] transition-all duration-500"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                >
                  <img alt="Disco Ball" className="w-40 md:w-64 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" src={DISCO_BALL_IMG} />
                </motion.div>
                <motion.div
                  className="absolute top-[20%] right-[20%] rotate-[5deg] z-0 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
                >
                  <span className="material-symbols-outlined text-white text-[120px] lg:text-[200px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                    auto_awesome
                  </span>
                </motion.div>

                {/* Main Identity Poster Content */}
                <motion.div
                  className="relative z-20 w-full max-w-4xl text-center flex flex-col items-center"
                  initial="initial"
                  animate="animate"
                  transition={staggerChildren}
                  style={{ willChange: 'transform, opacity' }}
                >
                  {/* Heading */}
                  <motion.div
                    className="mb-8"
                    variants={childFadeUp}
                    transition={enterSpring}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <span className="font-handwritten text-white text-5xl md:text-7xl block rotate-[-3deg] -mb-4 tracking-wider">
                      what's
                    </span>
                    <h1 className="font-headline italic text-white text-7xl md:text-9xl font-bold tracking-tighter leading-none">
                      your name?
                    </h1>
                  </motion.div>

                  {/* Input with NEXT button inside */}
                  <motion.div
                    className="w-full max-w-2xl group"
                    variants={childFadeUp}
                    transition={enterSpring}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="relative">
                      {/* Annotation Doodle */}
                      <div className="absolute -top-12 -right-8 font-handwritten text-secondary-container text-3xl rotate-[8deg] hidden md:block">
                        don't be shy!
                        <span className="block text-xl">{'\u2728'}</span>
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, handleNameSubmit)}
                        placeholder="Type it here..."
                        autoFocus
                        className="w-full bg-surface-container-low border-none text-on-background font-headline italic text-3xl md:text-5xl px-8 py-10 rounded-none md:rounded-full shadow-[12px_12px_0px_0px_rgba(27,29,14,1)] focus:ring-4 focus:ring-secondary-container transition-all placeholder:text-outline-variant outline-none"
                      />
                      {/* Sticker CTA Button */}
                      <button
                        onClick={handleNameSubmit}
                        disabled={!name.trim()}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white font-label font-black uppercase tracking-widest px-8 py-4 rounded-full border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(27,29,14,1)] hover:rotate-2 hover:scale-110 active:scale-90 transition-all z-30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        NEXT
                      </button>
                    </div>
                  </motion.div>

                  {/* Step Indicator */}
                  <motion.div
                    className="mt-16 flex flex-col items-center space-y-4"
                    variants={childFadeUp}
                    transition={enterSpring}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-white opacity-40" />
                      <span className="w-10 h-3 rounded-full bg-secondary-container" />
                      <span className="w-3 h-3 rounded-full bg-white opacity-40" />
                    </div>
                    <p className="font-body text-white font-bold uppercase tracking-[0.3em] text-xs opacity-80">
                      Step 2 of 4: The Invocation
                    </p>
                  </motion.div>
                </motion.div>

                {/* Signature "Voice of a Friend" Margin Note */}
                <div className="absolute bottom-10 left-10 md:left-20 max-w-[200px] pointer-events-none">
                  <p className="font-handwritten text-white text-2xl rotate-[5deg] leading-tight">
                    "A name is the first key to the vault of the soul..."
                    <span className="block text-right mt-2">&mdash; Lora</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── PHONE STEP — exact match 3-phone.html ─── */}
          {step === 'phone' && (
            <motion.div
              key="phone"
              className="absolute inset-0 z-0 flex items-center justify-center"
              {...fadeSlideUp}
              transition={stepTransition}
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="w-full h-full bg-secondary-container rounded-none relative overflow-hidden flex flex-col items-center justify-center">
                {/* Decorative blurs */}
                <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-secondary opacity-20 rounded-full blur-2xl" />

                {/* Floating icon — moon (staggers in) */}
                <motion.div
                  className="absolute top-12 left-8 md:top-24 md:left-24 z-20 floating sticker-shadow"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="text-on-primary-container text-6xl md:text-8xl select-none">
                    <span className="material-symbols-outlined !text-[80px] md:!text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      brightness_3
                    </span>
                  </div>
                </motion.div>

                {/* Floating icon — heart (staggers in) */}
                <motion.div
                  className="absolute bottom-16 right-8 md:bottom-24 md:right-32 z-20 floating sticker-shadow"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="text-error text-5xl md:text-7xl select-none rotate-12">
                    <span className="material-symbols-outlined !text-[60px] md:!text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </div>
                </motion.div>

                {/* Content Container */}
                <motion.div
                  className="relative z-10 w-full max-w-lg px-8 flex flex-col items-center"
                  initial="initial"
                  animate="animate"
                  transition={staggerChildren}
                  style={{ willChange: 'transform, opacity' }}
                >
                  {/* Header Grouping */}
                  <motion.div
                    className="mb-12 text-center"
                    variants={childFadeUp}
                    transition={enterSpring}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <p className="font-body text-xl uppercase tracking-[0.2em] font-bold text-on-surface mb-2">
                      and your
                    </p>
                    <h1 className="font-headline italic text-7xl md:text-9xl font-bold leading-none text-on-surface">
                      number?
                    </h1>
                  </motion.div>

                  {/* Handwritten Annotation */}
                  <motion.div
                    className="absolute top-[-80px] right-[10px] md:top-[-90px] md:right-[-40px] rotate-[8deg] bg-surface-bright p-3 md:p-4 brutalist-shadow z-30 max-w-[260px] md:max-w-none"
                    initial={{ opacity: 0, scale: 0, rotate: 15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <p className="font-handwritten text-3xl md:text-5xl text-primary leading-none truncate">
                      hey {name}!
                    </p>
                  </motion.div>

                  {/* Input Field Area */}
                  <motion.div
                    className="w-full mb-8 relative"
                    variants={childFadeUp}
                    transition={enterSpring}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <label className="sr-only" htmlFor="phone">Phone Number</label>
                    <input
                      ref={inputRef}
                      id="phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handlePhoneSubmit)}
                      placeholder="dial into the cosmos..."
                      autoFocus
                      className="w-full bg-surface-container-low text-on-surface text-3xl md:text-4xl font-headline italic p-8 rounded-none border-4 border-on-background focus:ring-0 focus:border-primary placeholder:opacity-40 text-center tracking-widest outline-none"
                    />
                    {/* Small doodle underneath */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-2 bg-on-background rounded-full opacity-10" />
                  </motion.div>

                  {/* Action Button */}
                  <motion.button
                    onClick={handlePhoneSubmit}
                    disabled={!phone.trim()}
                    className="group relative bg-primary-container text-on-primary-container font-label font-black text-2xl md:text-3xl uppercase py-6 px-12 rounded-full border-4 border-on-background brutalist-shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    variants={childFadeUp}
                    transition={enterSpring}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      read me
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        magic_button
                      </span>
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity" />
                  </motion.button>

                  {/* Trust Annotation */}
                  <motion.div
                    className="mt-12 opacity-60 flex items-center gap-2"
                    variants={childFadeUp}
                    transition={enterSpring}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <p className="font-body text-sm font-bold uppercase tracking-widest">
                      Encrypted connections only
                    </p>
                  </motion.div>
                </motion.div>

                {/* Random Sticker Decorations */}
                <div className="absolute top-1/4 right-12 hidden lg:block rotate-12 opacity-40">
                  <img src={PRISM_IMG} alt="" className="w-24 h-24 object-contain" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── SUBMITTING ─── */}
          {step === 'submitting' && (
            <motion.div
              key="submitting"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              style={{ willChange: 'transform, opacity' }}
            >
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ willChange: 'transform' }}
              />
              <p className="font-headline text-2xl md:text-3xl italic text-primary">
                reading the cosmos&hellip;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  )
}
