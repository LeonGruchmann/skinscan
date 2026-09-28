import { useMemo } from 'react'
import * as THREE from 'three'

// A stylized, anonymized humanoid built from primitive capsules/spheres —
// stands in for the point-cloud → mesh reconstruction produced from the
// booth's synchronized camera captures.
//
// Limbs are modeled as a pivot (shoulder/hip) with the capsule hanging
// below it inside a nested group, so rotating the outer group swings the
// limb like a pendulum around the joint instead of around its own center.

const SKIN_COLOR = '#8fd6dc'
const SKIN_OPACITY = 0.22
const WIRE_COLOR = '#bdf0f4'

function CapsuleMesh({ radius, length, materialOpacity = SKIN_OPACITY }: { radius: number; length: number; materialOpacity?: number }) {
  return (
    <>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[radius, length, 6, 12]} />
        <meshStandardMaterial color={SKIN_COLOR} transparent opacity={materialOpacity} roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh>
        <capsuleGeometry args={[radius, length, 6, 12]} />
        <meshBasicMaterial color={WIRE_COLOR} wireframe transparent opacity={0.32} />
      </mesh>
    </>
  )
}

function Limb({
  pivot,
  rotation = [0, 0, 0],
  radius,
  length,
}: {
  pivot: [number, number, number]
  rotation?: [number, number, number]
  radius: number
  length: number
}) {
  const drop = length / 2 + radius
  return (
    <group position={pivot} rotation={rotation}>
      <group position={[0, -drop, 0]}>
        <CapsuleMesh radius={radius} length={length} />
      </group>
    </group>
  )
}

export function BodyModel() {
  const materialShared = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SKIN_COLOR,
        transparent: true,
        opacity: SKIN_OPACITY,
        roughness: 0.35,
        metalness: 0.1,
      }),
    [],
  )

  return (
    <group>
      {/* head */}
      <mesh position={[0, 1.685, 0]}>
        <sphereGeometry args={[0.115, 24, 24]} />
        <primitive object={materialShared} attach="material" />
      </mesh>
      <mesh position={[0, 1.685, 0]}>
        <sphereGeometry args={[0.115, 16, 16]} />
        <meshBasicMaterial color={WIRE_COLOR} wireframe transparent opacity={0.32} />
      </mesh>

      {/* neck */}
      <mesh position={[0, 1.535, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.05, 12]} />
        <primitive object={materialShared} attach="material" />
      </mesh>

      {/* torso — shoulders (y≈1.5) to hips (y≈0.9) */}
      <mesh position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.19, 0.22, 8, 16]} />
        <primitive object={materialShared} attach="material" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.19, 0.22, 8, 16]} />
        <meshBasicMaterial color={WIRE_COLOR} wireframe transparent opacity={0.28} />
      </mesh>

      {/* arms — hang from shoulder pivots, slight outward swing */}
      <Limb pivot={[-0.26, 1.5, 0]} rotation={[0, 0, 0.12]} radius={0.05} length={0.62} />
      <Limb pivot={[0.26, 1.5, 0]} rotation={[0, 0, -0.12]} radius={0.05} length={0.62} />

      {/* legs — hang from hip pivots */}
      <Limb pivot={[-0.1, 0.9, 0]} radius={0.08} length={0.64} />
      <Limb pivot={[0.1, 0.9, 0]} radius={0.08} length={0.64} />

      {/* feet */}
      <mesh position={[-0.1, 0.05, 0.045]}>
        <boxGeometry args={[0.085, 0.06, 0.2]} />
        <primitive object={materialShared} attach="material" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.045]}>
        <boxGeometry args={[0.085, 0.06, 0.2]} />
        <primitive object={materialShared} attach="material" />
      </mesh>
    </group>
  )
}
