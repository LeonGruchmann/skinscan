import { useMemo } from 'react'
import * as THREE from 'three'
import { cameraPosition3D, PERSON_TARGET } from './boothGeometry'
import type { CameraModule } from '../lib/mockData'

// A flat translucent triangle from the selected camera to two points
// straddling the person — a simple, always-correctly-oriented stand-in
// for a field-of-view cone.
export function FovFan({ cam }: { cam: CameraModule }) {
  const geometry = useMemo(() => {
    const camPos = new THREE.Vector3(...cameraPosition3D(cam))
    const target = new THREE.Vector3(...PERSON_TARGET)
    const dir = target.clone().sub(camPos)
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(0.34)
    const left = target.clone().add(perp)
    const right = target.clone().sub(perp)

    const positions = new Float32Array([
      camPos.x, camPos.y, camPos.z,
      left.x, left.y, left.z,
      right.x, right.y, right.z,
    ])
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [cam])

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color="#0e7c86" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}
