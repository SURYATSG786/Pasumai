import { useEffect, useState, useRef } from 'react'
import { useApp } from '../context/app-context'
import { MASCOT_SVG, KAKA_FARM_LINES, KAKA_GREETINGS, mascotMoodForZone } from '../utils/mascot'

export function MascotGuide({ zone }) {
  const { activeZoneId } = useApp()
  const [displayedText, setDisplayedText] = useState("Namaste! I'm Kisaan Kaka 👋")
  const [isTyping, setIsTyping] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [lineIdx, setLineIdx] = useState(0)
  const [sparkles, setSparkles] = useState([])

  const typingTimerRef = useRef(null)
  const cycleTimerRef = useRef(null)
  const blinkTimerRef = useRef(null)

  // Blinking loop
  useEffect(() => {
    const triggerBlink = () => {
      const delay = 2400 + Math.random() * 3200
      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => {
          setIsBlinking(false)
          triggerBlink()
        }, 140)
      }, delay)
    }

    triggerBlink()
    return () => clearTimeout(blinkTimerRef.current)
  }, [])

  // Typewriter effect function
  const typeMessage = (fullText, callback) => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    setIsTyping(true)
    setDisplayedText('')

    let charIdx = 0
    const step = () => {
      if (charIdx <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx))
        charIdx++
        const delay = 24 + Math.random() * 26
        typingTimerRef.current = setTimeout(step, delay)
      } else {
        setIsTyping(false)
        if (callback) callback()
      }
    }
    step()
  }

  // Auto-cycle tips periodically
  useEffect(() => {
    const cycle = () => {
      cycleTimerRef.current = setTimeout(() => {
        const nextIdx = (lineIdx + 1) % KAKA_FARM_LINES.length
        setLineIdx(nextIdx)
        typeMessage(KAKA_FARM_LINES[nextIdx], () => {
          cycle()
        })
      }, 8500)
    }

    cycle()
    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [lineIdx])

  // React to zone changes
  useEffect(() => {
    if (!zone) return
    const customLine =
      zone.health === 'warning'
        ? `Heads up: ${zone.name} soil moisture needs attention! Let's check irrigation.`
        : `Looking good in ${zone.name}! Solar power & moisture levels are optimal. 🌟`
    
    typeMessage(customLine)
  }, [activeZoneId])

  // Tap handler to cycle greetings and emit sparkles
  const handleTap = (e) => {
    // Generate sparkle coordinates
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      color: Math.random() > 0.5 ? '#f4a429' : '#52b788',
    }))

    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 800)

    // Pick a friendly greeting
    const greeting = KAKA_GREETINGS[Math.floor(Math.random() * KAKA_GREETINGS.length)]
    typeMessage(greeting)
  }

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[300px]">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="relative mb-3 speech-bubble speech-bubble--tail-bottom w-full min-h-[76px] flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-900 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span>Kisaan Kaka</span>
            <span className="text-earth-500 font-bold lowercase text-[10px]">· AI Advisor</span>
          </div>
          <p className="text-xs sm:text-[13px] font-extrabold leading-snug text-earth-950">
            {displayedText}
            {isTyping && <span className="caret" />}
          </p>
        </div>
      )}

      {/* Mascot Avatar Wrap */}
      <div
        onClick={handleTap}
        className="relative cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95 flex flex-col items-center"
        title="Tap Kisaan Kaka to talk!"
      >
        {/* Floating sparkles */}
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute w-2.5 h-2.5 rounded-full pointer-events-none animate-ping"
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              backgroundColor: s.color,
            }}
          />
        ))}

        {/* Mascot Bob Container */}
        <div className="mascot-bob">
          <MASCOT_SVG
            size={135}
            isBlinking={isBlinking}
            isTalking={isTyping}
          />
        </div>

        {/* Mascot Ground Shadow */}
        <div className="w-28 h-2.5 rounded-full bg-earth-900/15 -mt-1 blur-[3px] transition-transform duration-300 group-hover:scale-90" />

        {/* Tap Prompt */}
        <div className="mt-2 text-xs text-earth-800 font-black flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-2xl border border-sky-300/60 shadow-sm hover:bg-white transition-colors">
          <span>✨ Tap me to chat</span>
        </div>
      </div>
    </div>
  )
}
