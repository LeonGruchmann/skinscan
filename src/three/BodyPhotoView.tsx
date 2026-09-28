import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'
import { BodyModel } from './BodyModel'
import type { CapturedImage } from '../lib/mockData'

type View = CapturedImage['view']

// Fixed camera framing per capture view, in the same world-space
// conventions as the rest of the 3D scene (BodyModel: feet at y=0, head
// top ~1.78). Replaces the old flat-SVG per-view scale/x/y/tilt table.
const FRAMING: Record<View, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
  Front: { position: [0, 1.05, 2.5], target: [0, 0.95, 0], fov: 30 },
  Back: { position: [0, 1.05, -2.5], target: [0, 0.95, 0], fov: 30 },
  Left: { position: [-2.5, 1.05, 0], target: [0, 0.95, 0], fov: 30 },
  Right: { position: [2.5, 1.05, 0], target: [0, 0.95, 0], fov: 30 },
  Upper: { position: [0, 1.55, 1.1], target: [0, 1.5, 0], fov: 38 },
  Lower: { position: [0, 0.5, 1.1], target: [0, 0.45, 0], fov: 38 },
  Elevated: { position: [0, 2.1, 2.1], target: [0, 0.9, 0], fov: 34 },
}

interface Props {
  view: View
  seed?: number
  className?: string
}

/**
 * A static, non-interactive render of the shared BodyModel mesh, framed per
 * capture view — used by the Captured Images thumbnails/modal to simulate a
 * standardized clinical photo with the same 3D asset as the skin map and
 * booth, instead of a separate flat illustration.
 */
export function BodyPhotoView({ view, seed = 0, className }: Props) {
  const f = FRAMING[view]
  const lightAngleRad = (((seed * 37) % 60) - 30) * (Math.PI / 180)

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      className={className}
      style={{ width: '100%', height: '100%', background: '#eef2f3' }}
    >
      <color attach="background" args={['#eef2f3']} />
      <PerspectiveCamera
        makeDefault
        position={f.position}
        fov={f.fov}
        near={0.05}
        far={10}
        onUpdate={(self: PerspectiveCameraImpl) => self.lookAt(...f.target)}
      />
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[Math.sin(lightAngleRad) * 2, 3, Math.cos(lightAngleRad) * 2]}
        intensity={1.1}
      />
      <directionalLight position={[-1.5, 1, -1.5]} intensity={0.3} color="#dce8ea" />
      <BodyModel variant="photo" />
    </Canvas>
  )
}
