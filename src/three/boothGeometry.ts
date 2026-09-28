import type { CameraModule } from '../lib/mockData'

// Shared spatial model for the booth: camera modules sit on a cylinder
// around the person, positioned by their angle (azimuth) and height
// percentage from the mock data. Used both by the 3D booth scene and by
// the per-camera POV render, so both agree on where each camera actually is.

export const BOOTH_RADIUS = 1.05
export const BOOTH_MIN_Y = 0.15
export const BOOTH_MAX_Y = 1.85
export const PERSON_TARGET: [number, number, number] = [0, 1.05, 0]

export function cameraPosition3D(cam: CameraModule): [number, number, number] {
  const rad = (cam.angleDeg * Math.PI) / 180
  const y = BOOTH_MIN_Y + (cam.heightPct / 100) * (BOOTH_MAX_Y - BOOTH_MIN_Y)
  const x = BOOTH_RADIUS * Math.sin(rad)
  const z = BOOTH_RADIUS * Math.cos(rad)
  return [x, y, z]
}
