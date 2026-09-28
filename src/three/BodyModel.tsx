import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

// The body is a real scanned/sculpted base mesh (T-pose humanoid), loaded
// from a GLB and recolored per variant. We don't touch its shape — only its
// scale/position (normalized once to fit this scene's conventions) and its
// material (swapped per variant to match the skin-map vs. booth look).

interface Props {
  /** 'dark' (default) for the dark 3D skin-map panel — translucent teal, glowing wireframe.
   *  'light' for light backgrounds (the booth) — a solid, opaque slate tone, no wireframe.
   *  'photo' for the simulated clinical-photo thumbnails — matte skin tone, no wireframe. */
  variant?: 'dark' | 'light' | 'photo'
}

const VARIANTS = {
  dark: { skin: '#8fd6dc', opacity: 0.22, wire: '#bdf0f4', wireOpacity: 0.28 },
  light: { skin: '#c7cfd4', opacity: 1, wire: '#5b6b72', wireOpacity: 0 },
  photo: { skin: '#d8b394', opacity: 1, wire: '#5b6b72', wireOpacity: 0 },
} as const

const MODEL_URL = `${import.meta.env.BASE_URL}models/basemesh.glb`

// Target world-space height (matches the old model's head-top ~1.8m) so the
// existing camera framing/lesion-marker coordinates in the rest of the app
// stay valid without changes elsewhere.
const TARGET_HEIGHT = 1.78

function useNormalizedBodyGeometry(): THREE.BufferGeometry {
  const { scene } = useGLTF(MODEL_URL)

  return useMemo(() => {
    let found: THREE.BufferGeometry | undefined
    scene.traverse((child) => {
      if (!found && (child as THREE.Mesh).isMesh) {
        found = (child as THREE.Mesh).geometry
      }
    })
    if (!found) throw new Error('basemesh.glb has no mesh geometry')

    const geo = found.clone()
    geo.computeBoundingBox()
    const box = geo.boundingBox!
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    const height = box.max.y - box.min.y
    const scale = TARGET_HEIGHT / height

    // Center on X/Z, sit the feet at y=0, then scale to target height —
    // all in one matrix so it's a single geometry transform, not a
    // per-frame group transform.
    const m = new THREE.Matrix4()
      .makeScale(scale, scale, scale)
      .multiply(new THREE.Matrix4().makeTranslation(-centerX, -box.min.y, -centerZ))
    geo.applyMatrix4(m)
    geo.computeVertexNormals()
    return geo
  }, [scene])
}

export function BodyModel({ variant = 'dark' }: Props) {
  const palette = VARIANTS[variant]
  const geometry = useNormalizedBodyGeometry()

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={palette.skin}
          transparent={palette.opacity < 1}
          opacity={palette.opacity}
          roughness={0.45}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {palette.wireOpacity > 0 && (
        <mesh geometry={geometry}>
          <meshBasicMaterial color={palette.wire} wireframe transparent opacity={palette.wireOpacity} />
        </mesh>
      )}
    </group>
  )
}

useGLTF.preload(MODEL_URL)
