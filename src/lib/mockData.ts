// Illustrative prototype data only — not real clinical data.

export interface CameraModule {
  id: number
  label: string
  bodyArea: string
  angleDeg: number
  heightPct: number // 0 = floor, 100 = top of booth
  mp: number
}

export const CAMERAS: CameraModule[] = Array.from({ length: 18 }, (_, i) => {
  const angleDeg = Math.round((360 / 18) * i)
  const heights = [18, 42, 68, 88]
  const areas = [
    'Lower legs / feet',
    'Torso / hips',
    'Chest / upper back',
    'Shoulders / scalp',
  ]
  const heightIdx = i % 4
  return {
    id: i + 1,
    label: `Camera ${String(i + 1).padStart(2, '0')}`,
    bodyArea: areas[heightIdx],
    angleDeg,
    heightPct: heights[heightIdx],
    mp: 12,
  }
})

export const POSES = [
  { id: 'pose-1', name: 'Pose 1 · Neutral', detail: 'Arms slightly away from the body' },
  { id: 'pose-2', name: 'Pose 2 · Arms raised', detail: 'Torso and armpits exposed' },
  { id: 'pose-3', name: 'Pose 3 · Arms extended', detail: 'Arms extended to reduce occlusion' },
  { id: 'pose-4', name: 'Pose 4 · Legs separated', detail: 'Additional skin surfaces exposed' },
] as const

export interface CapturedImage {
  id: string
  label: string
  view: 'Front' | 'Back' | 'Left' | 'Right' | 'Upper' | 'Lower' | 'Elevated'
  cameraId: number
  lesionCount: number
}

export const CAPTURED_IMAGES: CapturedImage[] = [
  { id: 'img-1', label: 'Front · Full body', view: 'Front', cameraId: 3, lesionCount: 6 },
  { id: 'img-2', label: 'Back · Full body', view: 'Back', cameraId: 11, lesionCount: 8 },
  { id: 'img-3', label: 'Left side', view: 'Left', cameraId: 6, lesionCount: 3 },
  { id: 'img-4', label: 'Right side', view: 'Right', cameraId: 14, lesionCount: 4 },
  { id: 'img-5', label: 'Upper back', view: 'Upper', cameraId: 10, lesionCount: 5 },
  { id: 'img-6', label: 'Upper chest', view: 'Upper', cameraId: 2, lesionCount: 2 },
  { id: 'img-7', label: 'Lower back', view: 'Lower', cameraId: 12, lesionCount: 1 },
  { id: 'img-8', label: 'Lower legs, front', view: 'Lower', cameraId: 1, lesionCount: 1 },
  { id: 'img-9', label: 'Elevated · left shoulder', view: 'Elevated', cameraId: 7, lesionCount: 2 },
  { id: 'img-10', label: 'Elevated · right shoulder', view: 'Elevated', cameraId: 15, lesionCount: 2 },
  { id: 'img-11', label: 'Left arm', view: 'Left', cameraId: 5, lesionCount: 1 },
  { id: 'img-12', label: 'Right arm', view: 'Right', cameraId: 13, lesionCount: 1 },
  { id: 'img-13', label: 'Scalp / crown', view: 'Elevated', cameraId: 4, lesionCount: 0 },
  { id: 'img-14', label: 'Feet, front', view: 'Front', cameraId: 18, lesionCount: 0 },
  { id: 'img-15', label: 'Torso, left oblique', view: 'Left', cameraId: 8, lesionCount: 3 },
  { id: 'img-16', label: 'Torso, right oblique', view: 'Right', cameraId: 16, lesionCount: 2 },
]

export interface Lesion {
  id: string
  label: string
  location: string
  sizeMm: number
  firstDetected: string
  status: 'monitoring' | 'review-recommended' | 'stable'
  changed?: boolean
  previousSizeMm?: number
  /** legacy 2D placement, used by the flat SVG silhouettes elsewhere in the app */
  region: { x: number; y: number; view: 'front' | 'back' }
  /** position on the reconstructed 3D body model, in model-space meters (y up, z+ = front) */
  pos3d: [number, number, number]
}

export const LESIONS: Lesion[] = [
  {
    id: 'L-001',
    label: 'Lesion #001',
    location: 'Left upper back',
    sizeMm: 4.2,
    firstDetected: '12 Mar 2026',
    status: 'monitoring',
    region: { x: 38, y: 28, view: 'back' },
    pos3d: [-0.1, 1.42, -0.13],
  },
  {
    id: 'L-002',
    label: 'Lesion #002',
    location: 'Right shoulder',
    sizeMm: 2.8,
    firstDetected: '12 Mar 2026',
    status: 'stable',
    region: { x: 68, y: 18, view: 'back' },
    pos3d: [0.22, 1.52, -0.05],
  },
  {
    id: 'L-014',
    label: 'Lesion #014',
    location: 'Left forearm',
    sizeMm: 3.1,
    firstDetected: '12 Mar 2026',
    status: 'stable',
    region: { x: 22, y: 46, view: 'front' },
    pos3d: [-0.32, 0.95, 0.08],
  },
  {
    id: 'L-042',
    label: 'Lesion #042',
    location: 'Left upper back',
    sizeMm: 4.5,
    previousSizeMm: 3.8,
    firstDetected: '12 Mar 2026',
    status: 'review-recommended',
    changed: true,
    region: { x: 42, y: 24, view: 'back' },
    pos3d: [-0.08, 1.37, -0.14],
  },
  {
    id: 'L-078',
    label: 'Lesion #078',
    location: 'Right lower back',
    sizeMm: 5.1,
    previousSizeMm: 4.4,
    firstDetected: '12 Mar 2026',
    status: 'review-recommended',
    changed: true,
    region: { x: 62, y: 52, view: 'back' },
    pos3d: [0.14, 1.12, -0.13],
  },
  {
    id: 'L-103',
    label: 'Lesion #103',
    location: 'Left chest',
    sizeMm: 3.6,
    previousSizeMm: 3.1,
    firstDetected: '12 Mar 2026',
    status: 'review-recommended',
    changed: true,
    region: { x: 40, y: 32, view: 'front' },
    pos3d: [-0.13, 1.32, 0.14],
  },
]

export const SCANS = [
  { id: 'scan-01', label: 'Scan 01', date: 'March 2026' },
  { id: 'scan-02', label: 'Scan 02', date: 'September 2026' },
] as const

export const CHANGE_SUMMARY = {
  tracked: 1247,
  unchanged: 1221,
  new: 18,
  changed: 8,
  reviewRecommended: 3,
}
