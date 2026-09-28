import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { Lesion } from '../lib/mockData'

interface Props {
  lesion: Lesion
  selected: boolean
  onSelect: (id: string) => void
}

export function LesionMarker({ lesion, selected, onSelect }: Props) {
  const ref = useRef<Mesh>(null)
  const pulsing = lesion.changed && !selected

  useFrame(({ clock }) => {
    if (!ref.current) return
    if (pulsing) {
      const t = clock.getElapsedTime()
      const s = 1 + Math.sin(t * 3.2) * 0.28
      ref.current.scale.setScalar(s)
    } else {
      ref.current.scale.setScalar(selected ? 1.6 : 1)
    }
  })

  const color = selected ? '#0e7c86' : lesion.changed ? '#c2661a' : '#8fd6dc'

  return (
    <mesh
      ref={ref}
      position={lesion.pos3d}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(lesion.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <sphereGeometry args={[0.014, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={selected ? 0.9 : 0.5}
        roughness={0.3}
      />
    </mesh>
  )
}
