interface Props {
  pose?: 'neutral' | 'arms-raised' | 'arms-extended' | 'legs-separated'
  className?: string
  strokeColor?: string
  fillColor?: string
}

// A stylized, anonymized human silhouette used across the booth / scan / skin-map views.
export function HumanFigure({
  pose = 'neutral',
  className,
  strokeColor = 'var(--ink-soft)',
  fillColor = 'var(--surface)',
}: Props) {
  const arms: Record<string, { l: string; r: string }> = {
    neutral: {
      l: 'M 92 128 C 78 150 74 178 78 210',
      r: 'M 148 128 C 162 150 166 178 162 210',
    },
    'arms-raised': {
      l: 'M 92 122 C 68 108 52 78 46 48',
      r: 'M 148 122 C 172 108 188 78 194 48',
    },
    'arms-extended': {
      l: 'M 90 126 C 60 130 34 138 18 148',
      r: 'M 150 126 C 180 130 206 138 222 148',
    },
    'legs-separated': {
      l: 'M 92 128 C 78 150 74 178 78 210',
      r: 'M 148 128 C 162 150 166 178 162 210',
    },
  }
  const legs: Record<string, { l: string; r: string }> = {
    'legs-separated': {
      l: 'M 108 268 C 96 310 82 350 66 388',
      r: 'M 132 268 C 144 310 158 350 174 388',
    },
    default: {
      l: 'M 108 268 C 104 310 100 350 96 388',
      r: 'M 132 268 C 136 310 140 350 144 388',
    },
  }
  const armSet = arms[pose] ?? arms.neutral
  const legSet = pose === 'legs-separated' ? legs['legs-separated'] : legs.default

  return (
    <svg viewBox="0 0 240 420" className={className} fill="none">
      {/* head */}
      <circle cx="120" cy="46" r="26" stroke={strokeColor} strokeWidth="2.5" fill={fillColor} />
      {/* neck */}
      <path d="M 112 70 L 112 84 M 128 70 L 128 84" stroke={strokeColor} strokeWidth="2.5" />
      {/* torso */}
      <path
        d="M 96 88 C 84 100 82 120 88 140 L 92 210 C 92 230 98 250 108 264 L 132 264 C 142 250 148 230 148 210 L 152 140 C 158 120 156 100 144 88 C 136 82 104 82 96 88 Z"
        stroke={strokeColor}
        strokeWidth="2.5"
        fill={fillColor}
      />
      {/* arms */}
      <path d={armSet.l} stroke={strokeColor} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d={armSet.r} stroke={strokeColor} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* legs */}
      <path d={legSet.l} stroke={strokeColor} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d={legSet.r} stroke={strokeColor} strokeWidth="14" strokeLinecap="round" fill="none" />
    </svg>
  )
}
