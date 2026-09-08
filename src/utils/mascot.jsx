// Kisaan Kaka — Pasumai's Farmer Mascot
// High-detail animated SVG with watering can grip, waving hand with fingers, sprout, and dynamic expressions

export function MASCOT_SVG({ mood = 'idle', size = 180, isBlinking = false, isTalking = false }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 300 420"
      xmlns="http://www.w3.org/2000/svg"
      className="mascot select-none overflow-visible drop-shadow-md"
    >
      <defs>
        <linearGradient id="kakaHatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c48a" />
          <stop offset="100%" stopColor="#c99a5c" />
        </linearGradient>
        <linearGradient id="kakaShirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a9a70" />
          <stop offset="100%" stopColor="#2f7350" />
        </linearGradient>
        <linearGradient id="kakaOverallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a6182" />
          <stop offset="100%" stopColor="#33465f" />
        </linearGradient>
        <linearGradient id="kakaCanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe4e6" />
          <stop offset="100%" stopColor="#5fa8ac" />
        </linearGradient>
        <radialGradient id="kakaCheekGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0846a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f0846a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== Watering can + sprout (left of body) ===== */}
      <g className="can-group">
        <ellipse cx="70" cy="330" rx="26" ry="6" fill="rgba(30,20,10,0.18)" />

        {/* Sprout being watered */}
        <g transform="translate(118,300)">
          <g className="sprout">
            <path d="M0 30 L0 8" stroke="#3f8f5a" strokeWidth="3" strokeLinecap="round" />
            <path d="M0 16 Q-12 10 -14 -2 Q0 0 0 16Z" fill="#5fbf7a" />
            <path d="M0 10 Q12 4 15 -8 Q0 -4 0 10Z" fill="#7ad38f" />
          </g>
        </g>

        {/* Can body */}
        <g transform="translate(50,262)">
          <ellipse cx="118" cy="6" rx="18" ry="6.5" fill="#4fa8ad" stroke="#215a5e" strokeWidth="2" transform="rotate(-16 118 6)" />
          <path d="M46 6 Q76 -18 106 -2" fill="none" stroke="#2f7d82" strokeWidth="11" strokeLinecap="round" />
          <path d="M46 6 Q76 -18 106 -2" fill="none" stroke="#4fa8ad" strokeWidth="5" strokeLinecap="round" />
          <path d="M8 -2 Q30 -18 46 -6" fill="none" stroke="#2f7d82" strokeWidth="9" strokeLinecap="round" />
          <path d="M2 22 Q0 46 26 50 Q52 46 50 22 L48 4 Q48 -4 40 -4 L12 -4 Q4 -4 4 4 Z" fill="url(#kakaCanGrad)" stroke="#215a5e" strokeWidth="2.5" />
          <path d="M10 4 Q26 12 42 4" fill="none" stroke="#3d8f94" strokeWidth="3" opacity="0.6" />
          <ellipse cx="16" cy="18" rx="4" ry="9" fill="#ffffff" opacity="0.28" />
        </g>

        {/* Drops falling from spray head */}
        <g transform="translate(168,270)">
          <circle className="drop" cx="0" cy="0" r="3.2" fill="#bfe6ea" />
          <circle className="drop d2" cx="7" cy="-2" r="2.6" fill="#bfe6ea" />
          <circle className="drop d3" cx="-5" cy="2" r="2.2" fill="#bfe6ea" />
        </g>
        <ellipse className="splash" cx="168" cy="300" rx="10" ry="3" fill="#cdeef2" />
      </g>

      {/* ===== Body ===== */}
      {/* Back arm (left, gripping the watering-can handle) */}
      <path d="M118 210 Q92 222 88 250" stroke="#dd9c6c" strokeWidth="17" fill="none" strokeLinecap="round" />
      <circle cx="88" cy="250" r="11" fill="#dd9c6c" />
      <path d="M80 244 Q88 250 96 246 M79 251 Q88 256 97 252" stroke="#c2814f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />

      {/* Legs */}
      <path d="M132 330 L126 392" stroke="#33465f" strokeWidth="24" strokeLinecap="round" />
      <path d="M168 330 L176 392" stroke="#33465f" strokeWidth="24" strokeLinecap="round" />

      {/* Boots */}
      <path d="M110 392 Q108 408 128 408 Q140 408 140 398 L140 388 L116 388Z" fill="#5c3a22" />
      <path d="M162 392 Q160 408 180 408 Q192 408 192 398 L192 388 L168 388Z" fill="#5c3a22" />

      {/* Torso: Shirt */}
      <path d="M112 205 Q108 320 120 336 Q150 350 180 336 Q192 320 188 205 Q150 188 112 205Z" fill="url(#kakaShirtGrad)" />
      {/* Collar */}
      <path d="M136 202 L150 218 L164 202" stroke="#245c40" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Overalls */}
      <path d="M120 250 Q118 320 126 334 Q150 344 174 334 Q182 320 180 250 Q150 240 120 250Z" fill="url(#kakaOverallGrad)" />
      <path d="M126 250 L118 200 Q118 192 126 192 L134 192 L138 214Z" fill="url(#kakaOverallGrad)" />
      <path d="M174 250 L182 200 Q182 192 174 192 L166 192 L162 214Z" fill="url(#kakaOverallGrad)" />
      <circle cx="130" cy="220" r="4" fill="#c9a24a" />
      <circle cx="170" cy="220" r="4" fill="#c9a24a" />

      {/* Front arm (right, waving with palm, fingers and thumb) */}
      <g className="arm-wave">
        <path d="M182 214 Q206 206 216 182 Q220 168 214 156" stroke="#dd9c6c" strokeWidth="18" fill="none" strokeLinecap="round" />
        {/* Palm */}
        <circle cx="213" cy="153" r="12" fill="#dd9c6c" />
        {/* Fingers (rounded capsules) */}
        <path d="M202 149 L199 127" stroke="#dd9c6c" strokeWidth="7" strokeLinecap="round" />
        <path d="M213 145 L213 121" stroke="#dd9c6c" strokeWidth="7" strokeLinecap="round" />
        <path d="M224 149 L228 127" stroke="#dd9c6c" strokeWidth="7" strokeLinecap="round" />
        {/* Thumb */}
        <path d="M203 160 L189 157" stroke="#dd9c6c" strokeWidth="7" strokeLinecap="round" />
        {/* Knuckle creases */}
        <path d="M200 131 L200 137 M213 125 L213 131 M226 131 L225 137" stroke="#c2814f" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Neck */}
      <rect x="140" y="188" width="20" height="18" rx="6" fill="#dd9c6c" />

      {/* ===== Head group ===== */}
      <g id="headGroup" className={isTalking ? 'talking' : ''}>
        {/* Ears */}
        <ellipse cx="112" cy="168" rx="7" ry="11" fill="#dd9c6c" />
        <ellipse cx="188" cy="168" rx="7" ry="11" fill="#dd9c6c" />

        {/* Head */}
        <ellipse cx="150" cy="164" rx="38" ry="42" fill="#dd9c6c" />
        {/* Jaw shadow */}
        <path d="M118 178 Q150 208 182 178 Q182 196 150 202 Q118 196 118 178Z" fill="#c2814f" opacity="0.35" />

        {/* Hair sideburns */}
        <path d="M114 148 Q110 162 116 176 Q122 168 120 154Z" fill="#4a3420" />
        <path d="M186 148 Q190 162 184 176 Q178 168 180 154Z" fill="#4a3420" />
        {/* Hair on top */}
        <path d="M113 150 Q108 118 150 112 Q192 118 187 150 Q182 128 150 124 Q118 128 113 150Z" fill="#4a3420" />

        {/* Eyebrows */}
        <path className="brow" d="M124 144 Q134 138 144 142" stroke="#4a3420" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path className="brow" d="M156 142 Q166 138 176 144" stroke="#4a3420" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Left eye */}
        <g id="eyeL" className={isBlinking ? 'blink' : ''}>
          <ellipse cx="133" cy="158" rx="8" ry="9" fill="#ffffff" />
          <circle cx="135" cy="159" r="4.4" fill="#2c2013" />
          <circle cx="137" cy="157" r="1.4" fill="#ffffff" />
          <rect className="eyelid" x="123" y="147" width="20" height="12" fill="#dd9c6c" />
        </g>

        {/* Right eye */}
        <g id="eyeR" className={isBlinking ? 'blink' : ''}>
          <ellipse cx="167" cy="158" rx="8" ry="9" fill="#ffffff" />
          <circle cx="169" cy="159" r="4.4" fill="#2c2013" />
          <circle cx="171" cy="157" r="1.4" fill="#ffffff" />
          <rect className="eyelid" x="157" y="147" width="20" height="12" fill="#dd9c6c" />
        </g>

        {/* Cheeks */}
        <circle cx="121" cy="180" r="10" fill="url(#kakaCheekGrad)" />
        <circle cx="179" cy="180" r="10" fill="url(#kakaCheekGrad)" />

        {/* Nose */}
        <path d="M150 160 Q146 172 150 176 Q154 174 152 168" fill="none" stroke="#c2814f" strokeWidth="2.5" strokeLinecap="round" />

        {/* Moustache */}
        <path d="M132 186 Q142 180 150 184 Q158 180 168 186 Q158 190 150 188 Q142 190 132 186Z" fill="#4a3420" />

        {/* Mouths: Idle vs Talking */}
        <g id="mouthIdle" className="mouth-idle">
          <path d="M134 194 Q150 206 166 194" stroke="#7a3d2c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
        <g id="mouthTalk" className="mouth-talk">
          <ellipse className="mouth-talk-a" cx="150" cy="197" rx="11" ry="8" fill="#7a3d2c" />
          <ellipse cx="150" cy="200" rx="6" ry="3" fill="#3d1e14" />
        </g>
      </g>
    </svg>
  )
}

export const KAKA_FARM_LINES = [
  "Namaste! I'm Kisaan Kaka 👋",
  "Sun’s out — the pumps are running on solar power today ☀️",
  "Soil moisture in Zone 2 looks just right 🌱",
  "Water little and often — the roots will thank you 💧",
  "Tank’s at a healthy level, no refill needed yet 🚰",
  "A little sun, a little water, a lot of patience 🌾",
  "I watch the weather so you don’t have to 🌤️",
  "Every drop saved today is a drop for tomorrow’s harvest 🚜",
  "The coconut palms are looking happy this season! 🌴",
  "Tap me anytime — I’m always keeping an eye on the fields ✨",
]

export const KAKA_GREETINGS = [
  "Hello there, friend! 👋",
  "Good to see you — the fields are doing well! 🌾",
  "Ask me anything about today’s irrigation plan ☀️",
  "Sunshine and clear skies — perfect farming weather 🌤️",
  "Every visit helps me learn your fields a little better 🤖",
]

export function mascotMoodForZone(zone) {
  if (!zone) return 'idle'
  if (zone.health === 'warning') return 'warning'
  return 'celebrating'
}
