declare global {
  interface Window {
    __biancaMicActive?: boolean
    __biancaVoiceGuardInstalled?: boolean
  }
}

if (typeof window !== 'undefined' && !window.__biancaVoiceGuardInstalled) {
  window.__biancaVoiceGuardInstalled = true
  window.__biancaMicActive = false

  const W = window as any
  const Recognition = W.SpeechRecognition || W.webkitSpeechRecognition
  const proto = Recognition?.prototype

  if (proto) {
    const originalStart = proto.start
    const originalStop = proto.stop
    const originalAbort = proto.abort

    proto.start = function (...args: any[]) {
      window.__biancaMicActive = true
      return originalStart.apply(this, args)
    }
    proto.stop = function (...args: any[]) {
      window.__biancaMicActive = false
      return originalStop.apply(this, args)
    }
    proto.abort = function (...args: any[]) {
      window.__biancaMicActive = false
      return originalAbort.apply(this, args)
    }
  }

  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis
    const originalSpeak = synth.speak.bind(synth)
    synth.speak = ((utterance: SpeechSynthesisUtterance) => {
      // Cât timp utilizatorul dictează, Bianca nu vorbește peste el și nu își
      // poate recunoaște propria voce ca o comandă nouă. Pauzele rămân pauze.
      if (window.__biancaMicActive) return
      originalSpeak(utterance)
    }) as typeof synth.speak
  }
}

export {}
