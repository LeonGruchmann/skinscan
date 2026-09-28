import { create } from 'zustand'

export type Section =
  | 'overview'
  | 'booth'
  | 'scan'
  | 'captured'
  | 'skin-map'
  | 'changes'
  | 'results'

export type ScanStage =
  | 'idle'
  | 'preparing'
  | 'pose-1'
  | 'pose-2'
  | 'pose-3'
  | 'pose-4'
  | 'complete'

interface AppState {
  section: Section
  setSection: (s: Section) => void

  scanStage: ScanStage
  setScanStage: (s: ScanStage) => void
  scanProgress: number
  setScanProgress: (n: number) => void

  selectedCamera: number | null
  setSelectedCamera: (n: number | null) => void

  selectedLesionId: string | null
  setSelectedLesionId: (id: string | null) => void

  activeScanIndex: 0 | 1
  setActiveScanIndex: (n: 0 | 1) => void

  scanCompleted: boolean
  setScanCompleted: (b: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  section: 'overview',
  setSection: (s) => set({ section: s }),

  scanStage: 'idle',
  setScanStage: (s) => set({ scanStage: s }),
  scanProgress: 0,
  setScanProgress: (n) => set({ scanProgress: n }),

  selectedCamera: null,
  setSelectedCamera: (n) => set({ selectedCamera: n }),

  selectedLesionId: null,
  setSelectedLesionId: (id) => set({ selectedLesionId: id }),

  activeScanIndex: 1,
  setActiveScanIndex: (n) => set({ activeScanIndex: n }),

  scanCompleted: false,
  setScanCompleted: (b) => set({ scanCompleted: b }),
}))
