import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'
import { BodyModel } from './BodyModel'

interface Props {
  className?: string
}

/**
 * Static, non-interactive front-on render of the shared body model — used
 * wherever the app previously showed the flat neutral-pose stick figure
 * (Overview illustration, Results/Changes lesion overlays, Scan progress).
 */
export function BodyFigureView({ className }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Model spans y=[0, 1.78] (feet to head top); frame the full figure
          with ~12% vertical margin: distance/fov chosen so the frustum's
          vertical extent covers that range around the mid-height target. */}
      <PerspectiveCamera
        makeDefault
        position={[0, 0.89, 3.5]}
        fov={32}
        near={0.05}
        far={10}
        onUpdate={(self: PerspectiveCameraImpl) => self.lookAt(0, 0.89, 0)}
      />
      <ambientLight intensity={0.75} />
      <directionalLight position={[1.5, 3, 2]} intensity={0.9} />
      <directionalLight position={[-1.5, 1, -1.5]} intensity={0.35} color="#dce8ea" />
      <BodyModel variant="light" />
    </Canvas>
  )
}
