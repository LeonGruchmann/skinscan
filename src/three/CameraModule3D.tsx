import { useMemo } from 'react'
import * as THREE from 'three'
import { cameraPosition3D, PERSON_TARGET } from './boothGeometry'
import type { CameraModule } from '../lib/mockData'

interface Props {
  cam: CameraModule
  selected: boolean
  onSelect: (id: number) => void
}

// A camera hardware module: small housing + lens, oriented to face the
// person so the lens visibly "points at" its capture target.
export function CameraModule3D({ cam, selected, onSelect }: Props) {
  const pos = useMemo(() => cameraPosition3D(cam), [cam])
  const quaternion = useMemo(() => {
    const dummy = new THREE.Object3D()
    dummy.position.set(...pos)
    dummy.lookAt(...PERSON_TARGET)
    return dummy.quaternion.clone()
  }, [pos])

  return (
    <group position={pos} quaternion={quaternion}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect(cam.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[0.052, 0.05, 0.038]} />
        <meshStandardMaterial color={selected ? '#0e7c86' : '#1c2b30'} roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />
        <meshStandardMaterial color="#060a0c" roughness={0.15} metalness={0.7} />
      </mesh>
      {selected && (
        <mesh position={[0, 0, -0.029]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.017, 0.022, 24]} />
          <meshBasicMaterial color="#8fd6dc" />
        </mesh>
      )}
    </group>
  )
}
