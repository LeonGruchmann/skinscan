import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'
import { BodyModel } from './BodyModel'
import type { CapturedImage } from '../lib/mockData'

type View = CapturedImage['view']

// Fixed camera framing per capture view, in the same world-space
// conventions as the rest of the 3D scene (BodyModel: feet at y=0, head
// top ~1.78). Distance/fov are derived from that range (with margin) rather
// than eyeballed, so the figure isn't clipped: for a vertical fov f at
// distance d, the visible vertical extent is 2*d*tan(f/2).
const FRAMING: Record<View, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
  Front: { position: [0, 0.89, 3.5], target: [0, 0.89, 0], fov: 32 },
  Back: { position: [0, 0.89, -3.5], target: [0, 0.89, 0], fov: 32 },
  Left: { position: [-3.5, 0.89, 0], target: [0, 0.89, 0], fov: 32 },
  Right: { position: [3.5, 0.89, 0], target: [0, 0.89, 0], fov: 32 },
  Upper: { position: [0, 1.465, 1.1], target: [0, 1.465, 0], fov: 36 },
  Lower: { position: [0, 0.3, 1.05], target: [0, 0.3, 0], fov: 36 },
  Elevated: { position: [0, 1.9, 2.9], target: [0, 0.89, 0], fov: 34 },
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
