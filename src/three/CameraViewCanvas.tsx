import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'
import { BodyModel } from './BodyModel'
import { cameraPosition3D, PERSON_TARGET } from './boothGeometry'
import type { CameraModule } from '../lib/mockData'

// Renders the same booth scene from inside the selected camera's actual
// 3D position and orientation — a genuine "what this camera sees" render,
// not a static placeholder.
export function CameraViewCanvas({ cam }: { cam: CameraModule }) {
  const pos = cameraPosition3D(cam)

  return (
    <Canvas gl={{ antialias: true }} style={{ background: '#0e1520' }}>
      <PerspectiveCamera
        makeDefault
        position={pos}
        fov={50}
        near={0.05}
        far={8}
        onUpdate={(self: PerspectiveCameraImpl) => self.lookAt(...PERSON_TARGET)}
      />
      <ambientLight intensity={0.7} />
      <directionalLight position={[1, 2, 1]} intensity={1} />
      <directionalLight position={[-1, 1, -1]} intensity={0.35} color="#8fd6dc" />
      <BodyModel />
      <gridHelper args={[3, 12, '#233238', '#182226']} />
    </Canvas>
  )
}
