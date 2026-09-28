import { useId } from 'react'
import type { CapturedImage } from '../lib/mockData'

interface Props {
  view: CapturedImage['view']
  seed?: number
  className?: string
}

// A synthetic, anonymized "clinical photograph" — studio-lit gradient skin
// tone + film grain, rendered entirely in SVG. Not a photo of a real person:
// this is a stand-in for what standardized booth photography would look
// like, kept deliberately faceless and non-identifiable.
const FRAMING: Record<CapturedImage['view'], { scale: number; x: number; y: number; mirror?: boolean; tilt?: number }> = {
  Front: { scale: 1, x: 0, y: 0 },
  Back: { scale: 1, x: 0, y: 0 },
  Left: { scale: 1.15, x: 10, y: 0, tilt: -3 },
  Right: { scale: 1.15, x: -10, y: 0, mirror: true, tilt: 3 },
  Upper: { scale: 1.9, x: 0, y: 32 },
  Lower: { scale: 1.7, x: 0, y: -58 },
  Elevated: { scale: 1.5, x: 0, y: 18, tilt: -2 },
}

export function ClinicalBodyPhoto({ view, seed = 0, className }: Props) {
  const uid = useId()
  const f = FRAMING[view]
  const lightX = 96 + ((seed * 37) % 30) - 15

  return (
    <svg
      viewBox="0 0 240 420"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id={`${uid}-skin`} cx={`${lightX}%`} cy="28%" r="75%">
          <stop offset="0%" stopColor="#e8c6ac" />
          <stop offset="45%" stopColor="#d3a988" />
          <stop offset="100%" stopColor="#a97e60" />
        </radialGradient>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef2f3" />
          <stop offset="100%" stopColor="#d6dfe2" />
        </linearGradient>
        <radialGradient id={`${uid}-vignette`} cx="50%" cy="38%" r="70%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </radialGradient>
        <filter id={`${uid}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed + 3} result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
      </defs>

      <rect x="0" y="0" width="240" height="420" fill={`url(#${uid}-bg)`} />

      <g
        transform={`translate(${120 + f.x}, ${210 + f.y}) scale(${f.scale}) ${f.mirror ? 'scale(-1,1)' : ''} rotate(${f.tilt ?? 0})`}
      >
        <g transform="translate(-120,-210)" fill={`url(#${uid}-skin)`}>
          {/* head */}
          <ellipse cx="120" cy="48" rx="27" ry="31" />
          {/* neck */}
          <rect x="103" y="72" width="34" height="22" rx="10" />
          {/* torso */}
          <path d="M 88 88 C 74 100 72 124 80 148 L 86 226 C 87 248 94 268 106 282 L 134 282 C 146 268 153 248 154 226 L 160 148 C 168 124 166 100 152 88 C 142 80 98 80 88 88 Z" />
          {/* arms */}
          <rect x="52" y="96" width="30" height="150" rx="15" transform="rotate(6 67 96)" />
          <rect x="158" y="96" width="30" height="150" rx="15" transform="rotate(-6 173 96)" />
          {/* legs */}
          <rect x="90" y="278" width="34" height="150" rx="16" />
          <rect x="116" y="278" width="34" height="150" rx="16" />
        </g>
      </g>

      {/* soft directional highlight to sell studio lighting */}
      <ellipse cx={lightX * 2.4} cy="90" rx="90" ry="140" fill="#ffffff" opacity="0.08" />

      <rect x="0" y="0" width="240" height="420" fill={`url(#${uid}-vignette)`} />
      <rect x="0" y="0" width="240" height="420" filter={`url(#${uid}-grain)`} />
    </svg>
  )
}
