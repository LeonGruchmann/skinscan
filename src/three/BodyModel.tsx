import { useMemo } from 'react'
import * as THREE from 'three'

// A stylized, anonymized humanoid — a single lathed (radially revolved)
// silhouette per body part (torso, each arm, each leg) instead of stacked
// primitives, so the surface tapers smoothly the way a sculpted mannequin
// does rather than reading as a stack of visibly-seamed capsules.

interface Props {
  /** 'dark' (default) for the dark 3D skin-map panel — translucent teal, glowing wireframe.
   *  'light' for light backgrounds (the booth) — a solid, visible slate tone, minimal wireframe. */
  variant?: 'dark' | 'light'
}

const VARIANTS = {
  dark: { skin: '#8fd6dc', opacity: 0.22, wire: '#bdf0f4', wireOpacity: 0.3 },
  light: { skin: '#c4cdd2', opacity: 1, wire: '#5b6b72', wireOpacity: 0.06 },
} as const

type Palette = (typeof VARIANTS)[keyof typeof VARIANTS]

function useLathe(profile: [number, number][], segments = 28) {
  return useMemo(() => {
    const points = profile.map(([r, y]) => new THREE.Vector2(r, y))
    const geo = new THREE.LatheGeometry(points, segments)
    geo.computeVertexNormals()
    return geo
  }, [profile, segments])
}

function LatheBody({ profile, palette }: { profile: [number, number][]; palette: Palette }) {
  const geometry = useLathe(profile)
  return (
    <>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={palette.skin} transparent opacity={palette.opacity} roughness={0.45} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={palette.wire} wireframe transparent opacity={palette.wireOpacity} />
      </mesh>
    </>
  )
}

// Absolute world-space profile (y measured from the floor).
const TORSO_PROFILE: [number, number][] = [
  [0.078, 1.565],
  [0.15, 1.5],
  [0.183, 1.42],
  [0.172, 1.33],
  [0.145, 1.19],
  [0.134, 1.1],
  [0.155, 1.0],
  [0.178, 0.92],
  [0.164, 0.87],
  [0.088, 0.83],
]

// Local profile, y=0 at the shoulder pivot, negative toward the wrist.
const ARM_PROFILE: [number, number][] = [
  [0.058, 0],
  [0.05, -0.05],
  [0.047, -0.14],
  [0.04, -0.24],
  [0.036, -0.28],
  [0.032, -0.4],
  [0.027, -0.5],
  [0.022, -0.555],
]
const ARM_LENGTH = 0.555

// Local profile, y=0 at the hip pivot, negative toward the ankle.
const LEG_PROFILE: [number, number][] = [
  [0.1, 0],
  [0.097, -0.09],
  [0.086, -0.22],
  [0.068, -0.38],
  [0.057, -0.45],
  [0.054, -0.52],
  [0.049, -0.65],
  [0.041, -0.79],
  [0.032, -0.88],
]

function Hand({ palette }: { palette: Palette }) {
  return (
    <mesh scale={[0.85, 1.2, 0.65]}>
      <sphereGeometry args={[0.038, 12, 12]} />
      <meshStandardMaterial color={palette.skin} transparent opacity={palette.opacity} roughness={0.45} metalness={0.05} />
    </mesh>
  )
}

function Foot({ palette }: { palette: Palette }) {
  return (
    <group position={[0, -0.015, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <capsuleGeometry args={[0.042, 0.13, 4, 10]} />
        <meshStandardMaterial color={palette.skin} transparent opacity={palette.opacity} roughness={0.5} metalness={0.04} />
      </mesh>
      <mesh>
        <capsuleGeometry args={[0.042, 0.13, 4, 10]} />
        <meshBasicMaterial color={palette.wire} wireframe transparent opacity={palette.wireOpacity} />
      </mesh>
    </group>
  )
}

function Arm({ side, palette }: { side: 'left' | 'right'; palette: Palette }) {
  const sign = side === 'left' ? -1 : 1
  return (
    <group position={[sign * 0.28, 1.5, 0]} rotation={[0, 0, sign * 0.1]}>
      <LatheBody profile={ARM_PROFILE} palette={palette} />
      <group position={[0, -ARM_LENGTH, 0]}>
        <Hand palette={palette} />
      </group>
    </group>
  )
}

function Leg({ side, palette }: { side: 'left' | 'right'; palette: Palette }) {
  const sign = side === 'left' ? -1 : 1
  return (
    <group position={[sign * 0.1, 0.92, 0]}>
      <LatheBody profile={LEG_PROFILE} palette={palette} />
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
      {/* head — slightly oval */}
      <mesh position={[0, 1.685, 0]} scale={[0.92, 1.05, 0.95]}>
        <sphereGeometry args={[0.115, 24, 24]} />
        <meshStandardMaterial color={palette.skin} transparent opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.685, 0]} scale={[0.92, 1.05, 0.95]}>
        <sphereGeometry args={[0.115, 16, 16]} />
        <meshBasicMaterial color={palette.wire} wireframe transparent opacity={palette.wireOpacity} />
      </mesh>

      {/* neck, tapered */}
      <mesh position={[0, 1.54, 0]}>
        <cylinderGeometry args={[0.042, 0.06, 0.07, 16]} />
        <meshStandardMaterial color={palette.skin} transparent opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>

      {/* shoulder blend — softens the arm/torso junction */}
      <mesh position={[-0.27, 1.49, 0]} scale={[1, 0.85, 1]}>
        <sphereGeometry args={[0.058, 16, 16]} />
        <meshStandardMaterial color={palette.skin} transparent opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>
      <mesh position={[0.27, 1.49, 0]} scale={[1, 0.85, 1]}>
        <sphereGeometry args={[0.058, 16, 16]} />
        <meshStandardMaterial color={palette.skin} transparent opacity={palette.opacity} roughness={0.45} metalness={0.05} />
      </mesh>

      <LatheBody profile={TORSO_PROFILE} palette={palette} />
      <Arm side="left" palette={palette} />
      <Arm side="right" palette={palette} />
      <Leg side="left" palette={palette} />
      <Leg side="right" palette={palette} />
    </group>
  )
}
