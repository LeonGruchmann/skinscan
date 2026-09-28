import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { BodyModel } from './BodyModel'
import { LesionMarker } from './LesionMarker'
import type { Lesion } from '../lib/mockData'

export interface SkinMapCanvasHandle {
  setAzimuthDeg: (deg: number) => void
  rotateBy: (deltaDeg: number) => void
  zoomBy: (factor: number) => void
}

interface Props {
  lesions: Lesion[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const TARGET = new THREE.Vector3(0, 0.92, 0)

function Scene({ lesions, selectedId, onSelect, controlsRef }: Props & { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 3, 2]} intensity={1.05} />
      <directionalLight position={[-2, 1.5, -2]} intensity={0.3} color="#8fd6dc" />
      <pointLight position={[0, 1.2, 1.5]} intensity={0.35} color="#ffffff" />
      {/* soft rim light from behind/above to separate silhouette edges and soften seams between parts */}
      <directionalLight position={[0, 2.4, -2.4]} intensity={0.4} color="#cdeef2" />

      <BodyModel />
      {lesions.map((lesion) => (
        <LesionMarker key={lesion.id} lesion={lesion} selected={selectedId === lesion.id} onSelect={onSelect} />
      ))}

      {/* floor ring for technical grounding */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.48, 64]} />
        <meshBasicMaterial color="#0e7c86" transparent opacity={0.4} />
      </mesh>
      <gridHelper args={[1.6, 16, '#1f2e33', '#162327']} position={[0, 0, 0]} />

      <OrbitControls
        ref={controlsRef}
        target={TARGET}
        enablePan={false}
        minDistance={1.1}
        maxDistance={3.2}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.6}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  )
}

export const SkinMapCanvas = forwardRef<SkinMapCanvasHandle, Props>(function SkinMapCanvas(props, ref) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  useImperativeHandle(ref, () => ({
    setAzimuthDeg(deg: number) {
      const controls = controlsRef.current
      if (!controls) return
      const camera = controls.object
      const radius = camera.position.distanceTo(controls.target)
      const rad = THREE.MathUtils.degToRad(deg)
      const polar = THREE.MathUtils.degToRad(72) // fixed elevation, slightly above eye level
      const x = controls.target.x + radius * Math.sin(polar) * Math.sin(rad)
      const z = controls.target.z + radius * Math.sin(polar) * Math.cos(rad)
      const y = controls.target.y + radius * Math.cos(polar)
      camera.position.set(x, y, z)
      controls.update()
    },
    rotateBy(deltaDeg: number) {
      const controls = controlsRef.current
      if (!controls) return
      const camera = controls.object
      const offset = camera.position.clone().sub(controls.target)
      const rad = THREE.MathUtils.degToRad(deltaDeg)
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rad)
      camera.position.copy(controls.target).add(offset)
      controls.update()
    },
    zoomBy(factor: number) {
      const controls = controlsRef.current
      if (!controls) return
      const camera = controls.object
      const offset = camera.position.clone().sub(controls.target)
      const newLength = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance)
      offset.setLength(newLength)
      camera.position.copy(controls.target).add(offset)
      controls.update()
    },
  }))

  return (
    <Canvas
      camera={{ position: [0, 1.5, -3.1], fov: 36 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <Scene {...props} controlsRef={controlsRef} />
    </Canvas>
  )
})
