// ── Haptic Vibration (mobile devices) ──
export function vibrate(pattern: number | number[] = 15) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

// ── Web Audio ──
let audioCtx: AudioContext | null = null
let _unlocked = false
let _muted = false

/** Toggle global mute — returns new muted state */
export function toggleMute(): boolean {
  _muted = !_muted
  return _muted
}

/** Check if audio is muted */
export function isMuted(): boolean {
  return _muted
}

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  // Always try to resume — browsers may re-suspend between gestures
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/** Check if audio context is active and ready to play */
export function isAudioReady(): boolean {
  return !!audioCtx && audioCtx.state === 'running'
}

/** Pre-warm AudioContext on first user gesture so subsequent plays never get blocked */
export function unlockAudio() {
  if (_unlocked) return
  _unlocked = true
  const c = ctx()
  // Play a silent buffer to fully unlock on iOS/Safari
  const buf = c.createBuffer(1, 1, c.sampleRate)
  const src = c.createBufferSource()
  src.buffer = buf
  src.connect(c.destination)
  src.start(0)
}

/** Create a reverb convolver for spacious sound */
function createReverb(duration = 1.5, decay = 2): ConvolverNode {
  const c = ctx()
  const rate = c.sampleRate
  const length = rate * duration
  const impulse = c.createBuffer(2, length, rate)

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }

  const convolver = c.createConvolver()
  convolver.buffer = impulse
  return convolver
}

// ── Sounds ──

/** Warm bell tone — for phase reveals */
export function playBell(freq = 440, vol = 0.06) {
  if (_muted) return
  const c = ctx()
  const t = c.currentTime

  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = freq

  // Add soft harmonic
  const osc2 = c.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2.01 // slight detune for warmth

  const gain = c.createGain()
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)

  const gain2 = c.createGain()
  gain2.gain.setValueAtTime(vol * 0.3, t)
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.8)

  const reverb = createReverb(1.5, 2.5)
  const dry = c.createGain()
  dry.gain.value = 0.6
  const wet = c.createGain()
  wet.gain.value = 0.4

  osc.connect(gain)
  osc2.connect(gain2)
  gain.connect(dry)
  gain2.connect(dry)
  gain.connect(reverb)
  gain2.connect(reverb)
  reverb.connect(wet)
  dry.connect(c.destination)
  wet.connect(c.destination)

  osc.start(t)
  osc.stop(t + 1.5)
  osc2.start(t)
  osc2.stop(t + 1)

  vibrate(8)
}

/** Gentle tap — button clicks */
export function playTap() {
  if (_muted) return
  const c = ctx()
  const t = c.currentTime

  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(500, t)
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.06)

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.08, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)

  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.08)

  vibrate(10)
}

/** Soft cloud whoosh — scene transitions */
export function playWhoosh() {
  if (_muted) return
  const c = ctx()
  const t = c.currentTime
  const len = c.sampleRate * 0.6
  const buf = c.createBuffer(2, len, c.sampleRate)

  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) {
      const env = Math.sin((i / len) * Math.PI) // bell curve envelope
      d[i] = (Math.random() * 2 - 1) * env * 0.3
    }
  }

  const src = c.createBufferSource()
  src.buffer = buf

  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(800, t)
  bp.frequency.exponentialRampToValueAtTime(200, t + 0.6)
  bp.Q.value = 1.5

  const gain = c.createGain()
  gain.gain.value = 0.05

  src.connect(bp)
  bp.connect(gain)
  gain.connect(c.destination)
  src.start(t)

  vibrate([5, 30, 5])
}

/** Rising crystal sparkle — logo reveal */
export function playSparkle() {
  if (_muted) return
  const c = ctx()
  const t = c.currentTime
  const notes = [523, 659, 784, 1047] // C5 E5 G5 C6

  const reverb = createReverb(2, 3)
  const wet = c.createGain()
  wet.gain.value = 0.5
  reverb.connect(wet)
  wet.connect(c.destination)

  notes.forEach((freq, i) => {
    const start = t + i * 0.15
    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    const gain = c.createGain()
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.05, start + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8)

    osc.connect(gain)
    gain.connect(c.destination)
    gain.connect(reverb)

    osc.start(start)
    osc.stop(start + 0.9)
  })

  vibrate([5, 40, 5, 40, 5, 40, 10])
}

/** Keystroke tick — typing */
export function playKeystroke() {
  if (_muted) return
  const c = ctx()
  const t = c.currentTime

  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.value = 700 + Math.random() * 300

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.03, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03)

  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.04)

  vibrate(3)
}

/** Gentle ambient pad — loading scene, returns stop() */
export function playAmbientPad(): () => void {
  if (_muted) return () => {}
  const c = ctx()
  const t = c.currentTime

  // Soft pad chord: C3 + E3 + G3
  const freqs = [131, 165, 196]
  const oscs: OscillatorNode[] = []

  const masterGain = c.createGain()
  masterGain.gain.setValueAtTime(0, t)
  masterGain.gain.linearRampToValueAtTime(0.03, t + 1) // slow fade in

  const reverb = createReverb(3, 2)
  const wet = c.createGain()
  wet.gain.value = 0.7
  reverb.connect(wet)
  wet.connect(c.destination)
  masterGain.connect(c.destination)
  masterGain.connect(reverb)

  freqs.forEach((freq) => {
    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(masterGain)
    osc.start(t)
    oscs.push(osc)
  })

  return () => {
    const now = c.currentTime
    masterGain.gain.linearRampToValueAtTime(0.001, now + 0.8)
    setTimeout(() => oscs.forEach((o) => { try { o.stop() } catch {} }), 900)
  }
}

/** Deep reveal — results hero */
export function playRevealGong() {
  if (_muted) return
  const c = ctx()
  const t = c.currentTime

  const reverb = createReverb(3, 2)
  const wet = c.createGain()
  wet.gain.value = 0.6
  reverb.connect(wet)
  wet.connect(c.destination)

  // Low gong
  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(110, t)
  osc.frequency.exponentialRampToValueAtTime(55, t + 2.5)

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.1, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5)

  osc.connect(gain)
  gain.connect(c.destination)
  gain.connect(reverb)
  osc.start(t)
  osc.stop(t + 3)

  vibrate([20, 50, 10, 50, 30])
}

/** Section reveal — ascending bell per section */
export function playSectionReveal(index: number) {
  const notes = [262, 330, 392, 523, 659]
  playBell(notes[index % notes.length], 0.04)
}
