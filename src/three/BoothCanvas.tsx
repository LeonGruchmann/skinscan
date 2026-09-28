import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BodyModel } from './BodyModel'
import { CameraModule3D } from './CameraModule3D'
import { FovFan } from './FovFan'
import { CAMERAS } from '../lib/mockData'
import { BOOTH_MIN_Y, BOOTH_MAX_Y, BOOTH_RADIUS } from './boothGeometry'

interface Props {
  selectedCamera: number | null
  onSelect: (id: number) => void
}

function BoothFrame() {
  const uprightCount = 10
  const uprights = Array.from({ length: uprightCount }, (_, i) => {
    const angle = (i / uprightCount) * Math.PI * 2
    return [BOOTH_RADIUS * 1.06 * Math.sin(angle), BOOTH_RADIUS * 1.06 * Math.cos(angle)] as const
  })
  return (
    <group>
      {uprights.map(([x, z], i) => (
        <mesh key={i} position={[x, (BOOTH_MIN_Y + BOOTH_MAX_Y) / 2, z]}>
          <cylinderGeometry args={[0.006, 0.006, BOOTH_MAX_Y - BOOTH_MIN_Y, 8]} />
          <meshBasicMaterial color="#0e7c86" transparent opacity={0.22} />
        </mesh>
      ))}
      <mesh position={[0, BOOTH_MAX_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BOOTH_RADIUS * 1.04, BOOTH_RADIUS * 1.07, 48]} />
        <meshBasicMaterial color="#0e7c86" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, BOOTH_MIN_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BOOTH_RADIUS * 1.04, BOOTH_RADIUS * 1.07, 48]} />
        <meshBasicMaterial color="#0e7c86" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function LedPanels() {
  return (
    <>
      {CAMERAS.filter((c) => c.id % 3 === 1).map((cam) => {
        const rad = ((cam.angleDeg + 10) * Math.PI) / 180
        const y = BOOTH_MIN_Y + (cam.heightPct / 100) * (BOOTH_MAX_Y - BOOTH_MIN_Y)
        const x = BOOTH_RADIUS * 0.99 * Math.sin(rad)
        const z = BOOTH_RADIUS * 0.99 * Math.cos(rad)
        return (
          <mesh key={cam.id} position={[x, y, z]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#fff7dd" emissive="#fff2c2" emissiveIntensity={1.3} />
          </mesh>
        )
      })}
    </>
  )
}

function Floor() {
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[BOOTH_RADIUS * 0.98, 48]} />
        <meshStandardMaterial color="#eef2f3" roughness={0.95} />
      </mesh>
      <gridHelper args={[BOOTH_RADIUS * 2, 20, '#c7d3d6', '#dbe4e6']} position={[0, 0.002, 0]} />
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BOOTH_RADIUS * 0.46, BOOTH_RADIUS * 0.49, 64]} />
        <meshBasicMaterial color="#0e7c86" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BOOTH_RADIUS * 0.7, BOOTH_RADIUS * 0.715, 64]} />
        <meshBasicMaterial color="#0e7c86" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

export function BoothCanvas({ selectedCamera, onSelect }: Props) {
  const selectedCam = CAMERAS.find((c) => c.id === selectedCamera) ?? null

  return (
    <Canvas
      camera={{ position: [1.6, 1.7, -2.6], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 3, 2]} intensity={0.9} />
      <directionalLight position={[-2, 1.5, -2]} intensity={0.25} color="#8fd6dc" />

      <BodyModel variant="light" />
      <BoothFrame />
      <LedPanels />
      {CAMERAS.map((cam) => (
        <CameraModule3D key={cam.id} cam={cam} selected={selectedCamera === cam.id} onSelect={onSelect} />
      ))}
      {selectedCam && <FovFan cam={selectedCam} />}

      <Floor />

      <OrbitControls
        target={[0, 0.95, 0]}
        enablePan={false}
        minDistance={1.7}
        maxDistance={4.4}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.05}
        rotateSpeed={0.6}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
  )
}
