import { useMemo } from 'react'
import * as THREE from 'three'

// A stylized, anonymized humanoid built from lofted (stacked-ring) surfaces
// — one continuous mesh per body part, each ring an ellipse (wider
// side-to-side than front-to-back, like a real torso/limb) rather than a
// perfect circle. That's what separates this from a lathe/capsule model:
// the silhouette actually changes shape between front and side views.

interface Props {
  /** 'dark' (default) for the dark 3D skin-map panel — translucent teal, glowing wireframe.
   *  'light' for light backgrounds (the booth) — a solid, opaque slate tone, no wireframe. */
  variant?: 'dark' | 'light'
}

const VARIANTS = {
  dark: { skin: '#8fd6dc', opacity: 0.22, wire: '#bdf0f4', wireOpacity: 0.28 },
  light: { skin: '#c7cfd4', opacity: 1, wire: '#5b6b72', wireOpacity: 0 },
} as const

type Palette = (typeof VARIANTS)[keyof typeof VARIANTS]

interface Ring {
  y: number
  rx: number
  rz: number
  cx?: number
}

/** Builds a smooth tube from stacked elliptical rings, capped at both ends. */
function buildLoftGeometry(rings: Ring[], radialSegments = 28): THREE.BufferGeometry {
  const positions: number[] = []
  const indices: number[] = []
  const ringCount = rings.length

  for (const { y, rx, rz, cx = 0 } of rings) {
    for (let j = 0; j < radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2
      positions.push(cx + rx * Math.cos(theta), y, rz * Math.sin(theta))
    }
  }

  for (let i = 0; i < ringCount - 1; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * radialSegments + j
      const b = i * radialSegments + ((j + 1) % radialSegments)
      const c = (i + 1) * radialSegments + j
      const d = (i + 1) * radialSegments + ((j + 1) % radialSegments)
      indices.push(a, c, b, b, c, d)
    }
  }

  // end caps (fan to the ring's centroid) so the mesh reads as solid
  const capFan = (ringIndex: number, flip: boolean) => {
    const base = ringIndex * radialSegments
    const centerIdx = positions.length / 3
    const ring = rings[ringIndex]
    positions.push(ring.cx ?? 0, ring.y, 0)
    for (let j = 0; j < radialSegments; j++) {
      const a = base + j
      const b = base + ((j + 1) % radialSegments)
      indices.push(...(flip ? [centerIdx, b, a] : [centerIdx, a, b]))
    }
  }
  capFan(0, true)
  capFan(ringCount - 1, false)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

function useLoft(rings: Ring[], segments = 28) {
  return useMemo(() => buildLoftGeometry(rings, segments), [rings, segments])
}

function LoftBody({ rings, palette }: { rings: Ring[]; palette: Palette }) {
  const geometry = useLoft(rings)
  return (
    <>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={palette.skin} transparent={palette.opacity < 1} opacity={palette.opacity} roughness={0.45} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      {palette.wireOpacity > 0 && (
        <mesh geometry={geometry}>
          <meshBasicMaterial color={palette.wire} wireframe transparent opacity={palette.wireOpacity} />
        </mesh>
      )}
    </>
  )
}

// Absolute world-space rings (y measured from the floor), tuned against an
// 8-angle reference turnaround: broader shoulders (~29% of height across)
// than the earlier pass had, narrowing at the waist and flaring at the hip.
// Wider (rx) than deep (rz) — a real torso is roughly 1.5-1.7x wider than
// it is thick.
const TORSO_RINGS: Ring[] = [
  { y: 1.565, rx: 0.078, rz: 0.066 },
  { y: 1.5, rx: 0.175, rz: 0.105 },
  { y: 1.42, rx: 0.205, rz: 0.125 },
  { y: 1.33, rx: 0.18, rz: 0.108 },
  { y: 1.19, rx: 0.148, rz: 0.092 },
  { y: 1.1, rx: 0.136, rz: 0.085 },
  { y: 1.0, rx: 0.155, rz: 0.1 },
  { y: 0.92, rx: 0.178, rz: 0.118 },
  { y: 0.87, rx: 0.162, rz: 0.107 },
  { y: 0.83, rx: 0.088, rz: 0.07 },
]

// Local rings, y=0 at the shoulder pivot, negative toward the wrist.
// The reference shows fingertips reaching to roughly mid-thigh when the
// arm hangs — the earlier pass had the arm ending at the waist, visibly
// too short. Full arm length is now ~43% of total body height.
const ARM_RINGS: Ring[] = [
  { y: 0, rx: 0.058, rz: 0.055 },
  { y: -0.07, rx: 0.053, rz: 0.05 },
  { y: -0.2, rx: 0.049, rz: 0.045 },
  { y: -0.335, rx: 0.041, rz: 0.038 },
  { y: -0.39, rx: 0.037, rz: 0.034 },
  { y: -0.56, rx: 0.032, rz: 0.029 },
  { y: -0.7, rx: 0.027, rz: 0.024 },
  { y: -0.78, rx: 0.021, rz: 0.019 },
]
const ARM_LENGTH = 0.78

// Local rings, y=0 at the hip pivot, negative toward the ankle.
const LEG_RINGS: Ring[] = [
  { y: 0, rx: 0.105, rz: 0.1 },
  { y: -0.09, rx: 0.102, rz: 0.095 },
  { y: -0.22, rx: 0.09, rz: 0.084 },
  { y: -0.38, rx: 0.07, rz: 0.063 },
  { y: -0.45, rx: 0.059, rz: 0.052 },
  { y: -0.52, rx: 0.056, rz: 0.05 },
  { y: -0.65, rx: 0.051, rz: 0.045 },
  { y: -0.79, rx: 0.043, rz: 0.037 },
  { y: -0.88, rx: 0.033, rz: 0.028 },
]

// At full-body scale, individual finger capsules are sub-pixel noise —
// they read as scattered fragments rather than a hand. A simplified flat
// paddle (rounded rectangle, tapered at the wrist) reads as a hand instead.
function Hand({ side, palette }: { side: 'left' | 'right'; palette: Palette }) {
  const sign = side === 'left' ? -1 : 1
  const rings: Ring[] = [
    { y: 0, rx: 0.026, rz: 0.017 },
    { y: -0.02, rx: 0.03, rz: 0.016 },
    { y: -0.055, rx: 0.032, rz: 0.014 },
    { y: -0.075, rx: 0.024, rz: 0.011 },
  ]
  return (
    <group rotation={[0, 0, sign * -0.05]}>
      <LoftBody rings={rings} palette={palette} />
      {/* thumb nub */}
      <mesh position={[sign * 0.028, -0.02, 0.012]} rotation={[0.3, 0, sign * 0.6]} scale={[0.7, 1, 0.7]}>
        <capsuleGeometry args={[0.009, 0.022, 4, 8]} />
        <meshStandardMaterial color={palette.skin} transparent={palette.opacity < 1} opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>
    </group>
  )
}

function Foot({ palette }: { palette: Palette }) {
  return (
    <group position={[0, -0.015, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <capsuleGeometry args={[0.042, 0.13, 4, 10]} />
        <meshStandardMaterial color={palette.skin} transparent={palette.opacity < 1} opacity={palette.opacity} roughness={0.5} metalness={0.04} />
      </mesh>
    </group>
  )
}

function Arm({ side, palette }: { side: 'left' | 'right'; palette: Palette }) {
  const sign = side === 'left' ? -1 : 1
  return (
    <group position={[sign * 0.31, 1.49, 0]} rotation={[0, 0, sign * 0.2]}>
      <LoftBody rings={ARM_RINGS} palette={palette} />
      <group position={[0, -ARM_LENGTH, 0]}>
        <Hand side={side} palette={palette} />
      </group>
    </group>
  )
}

function Leg({ side, palette }: { side: 'left' | 'right'; palette: Palette }) {
  const sign = side === 'left' ? -1 : 1
  return (
    <group position={[sign * 0.1, 0.92, 0]}>
      <LoftBody rings={LEG_RINGS} palette={palette} />
      <group position={[0, -0.88, 0]}>
        <Foot palette={palette} />
      </group>
    </group>
  )
}

export function BodyModel({ variant = 'dark' }: Props) {
  const palette = VARIANTS[variant]

  return (
    <group>
      {/* head — slightly oval, flattened front-to-back */}
      <mesh position={[0, 1.685, 0]} scale={[0.92, 1.05, 0.85]}>
        <sphereGeometry args={[0.115, 24, 24]} />
        <meshStandardMaterial color={palette.skin} transparent={palette.opacity < 1} opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>
      {palette.wireOpacity > 0 && (
        <mesh position={[0, 1.685, 0]} scale={[0.92, 1.05, 0.85]}>
          <sphereGeometry args={[0.115, 16, 16]} />
          <meshBasicMaterial color={palette.wire} wireframe transparent opacity={palette.wireOpacity} />
        </mesh>
      )}

      {/* neck, tapered */}
      <mesh position={[0, 1.54, 0]}>
        <cylinderGeometry args={[0.042, 0.06, 0.07, 16]} />
        <meshStandardMaterial color={palette.skin} transparent={palette.opacity < 1} opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>

      {/* shoulder blend — softens the arm/torso junction */}
      <mesh position={[-0.29, 1.49, 0]} scale={[1, 0.85, 0.9]}>
        <sphereGeometry args={[0.062, 16, 16]} />
        <meshStandardMaterial color={palette.skin} transparent={palette.opacity < 1} opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>
      <mesh position={[0.29, 1.49, 0]} scale={[1, 0.85, 0.9]}>
        <sphereGeometry args={[0.062, 16, 16]} />
        <meshStandardMaterial color={palette.skin} transparent={palette.opacity < 1} opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>

      <LoftBody rings={TORSO_RINGS} palette={palette} />
      <Arm side="left" palette={palette} />
      <Arm side="right" palette={palette} />
      <Leg side="left" palette={palette} />
      <Leg side="right" palette={palette} />
    </group>
  )
}
