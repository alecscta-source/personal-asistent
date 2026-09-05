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
      try{this.addEventListener('end',()=>{window.__biancaMicActive=false},{once:true})}catch{}
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
      // În timpul unei note Bianca rămâne complet tăcută. Nota se citește
      // numai la o acțiune explicită a utilizatorului după ieșirea din mod Notă.
      const noteOpen=!!document.querySelector('.note-live')
      if (window.__biancaMicActive || noteOpen) return
      utterance.lang='ro-RO'
      originalSpeak(utterance)
    }) as typeof synth.speak
  }
}

export {}
