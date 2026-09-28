import { useMemo } from 'react'
import * as THREE from 'three'

// A stylized, anonymized humanoid built from primitive capsules/spheres —
// stands in for the point-cloud → mesh reconstruction produced from the
// booth's synchronized camera captures.
//
// Limbs are modeled as a pivot (shoulder/hip) with the capsule hanging
// below it inside a nested group, so rotating the outer group swings the
// limb like a pendulum around the joint instead of around its own center.

interface Props {
  /** 'dark' (default) for the dark 3D skin-map panel — translucent teal, glowing wireframe.
   *  'light' for light backgrounds (the booth) — a solid, visible slate tone. */
  variant?: 'dark' | 'light'
}

const VARIANTS = {
  dark: { skin: '#8fd6dc', opacity: 0.22, wire: '#bdf0f4', wireOpacity: 0.32 },
  light: { skin: '#aab6bd', opacity: 0.9, wire: '#5b6b72', wireOpacity: 0.18 },
} as const

function CapsuleMesh({
  radius,
  length,
  skin,
  opacity,
  wire,
  wireOpacity,
}: {
  radius: number
  length: number
  skin: string
  opacity: number
  wire: string
  wireOpacity: number
}) {
  return (
    <>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[radius, length, 6, 12]} />
        <meshStandardMaterial color={skin} transparent opacity={opacity} roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh>
        <capsuleGeometry args={[radius, length, 6, 12]} />
        <meshBasicMaterial color={wire} wireframe transparent opacity={wireOpacity} />
      </mesh>
    </>
  )
}

function Limb({
  pivot,
  rotation = [0, 0, 0],
  radius,
  length,
  skin,
  opacity,
  wire,
  wireOpacity,
}: {
  pivot: [number, number, number]
  rotation?: [number, number, number]
  radius: number
  length: number
  skin: string
  opacity: number
  wire: string
  wireOpacity: number
}) {
  const drop = length / 2 + radius
  return (
    <group position={pivot} rotation={rotation}>
      <group position={[0, -drop, 0]}>
        <CapsuleMesh radius={radius} length={length} skin={skin} opacity={opacity} wire={wire} wireOpacity={wireOpacity} />
      </group>
    </group>
  )
}

export function BodyModel({ variant = 'dark' }: Props) {
  const { skin, opacity, wire, wireOpacity } = VARIANTS[variant]

  const materialShared = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: skin,
        transparent: true,
        opacity,
        roughness: 0.4,
        metalness: 0.08,
      }),
    [skin, opacity],
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
        <meshBasicMaterial color={wire} wireframe transparent opacity={wireOpacity} />
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
        <meshBasicMaterial color={wire} wireframe transparent opacity={wireOpacity * 0.9} />
      </mesh>

      {/* arms — hang from shoulder pivots, slight outward swing */}
      <Limb pivot={[-0.26, 1.5, 0]} rotation={[0, 0, 0.12]} radius={0.05} length={0.62} skin={skin} opacity={opacity} wire={wire} wireOpacity={wireOpacity} />
      <Limb pivot={[0.26, 1.5, 0]} rotation={[0, 0, -0.12]} radius={0.05} length={0.62} skin={skin} opacity={opacity} wire={wire} wireOpacity={wireOpacity} />

      {/* legs — hang from hip pivots */}
      <Limb pivot={[-0.1, 0.9, 0]} radius={0.08} length={0.64} skin={skin} opacity={opacity} wire={wire} wireOpacity={wireOpacity} />
      <Limb pivot={[0.1, 0.9, 0]} radius={0.08} length={0.64} skin={skin} opacity={opacity} wire={wire} wireOpacity={wireOpacity} />

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
