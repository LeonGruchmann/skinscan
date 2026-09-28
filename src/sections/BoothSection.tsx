import { Suspense, useMemo } from 'react'
import { CAMERAS } from '../lib/mockData'
import { useAppStore } from '../store/appStore'
import { BoothCanvas } from '../three/BoothCanvas'
import { CameraViewCanvas } from '../three/CameraViewCanvas'
import { CanvasErrorBoundary } from '../three/CanvasErrorBoundary'
import { Camera, Lightbulb, ScanLine } from 'lucide-react'

export function BoothSection() {
  const selected = useAppStore((s) => s.selectedCamera)
  const setSelected = useAppStore((s) => s.setSelectedCamera)
  const activeCam = useMemo(() => CAMERAS.find((c) => c.id === selected) ?? null, [selected])

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 h-full grid-fade-in">
      <div className="relative rounded-2xl border border-[var(--border)] bg-gradient-to-b from-white to-[#f2f5f6] overflow-hidden flex flex-col">
        <div className="flex-1 relative">
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <BoothCanvas selectedCamera={selected} onSelect={setSelected} />
            </Suspense>
          </CanvasErrorBoundary>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10.5px] text-[var(--ink-faint)] pointer-events-none">
            Drag to orbit · scroll to zoom · click a camera
          </p>
        </div>

        {/* labels */}
        <div className="flex items-center gap-6 px-6 py-4 border-t border-[var(--border-soft)] bg-white/70">
          <Badge icon={Camera} label="16 synchronized cameras" />
          <Badge icon={Lightbulb} label="Controlled lighting" />
          <Badge icon={ScanLine} label="360° body coverage" />
        </div>
      </div>

      {/* detail panel */}
      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col">
        {activeCam ? (
          <div className="grid-fade-in">
            <p className="text-[11px] uppercase tracking-wide text-[var(--accent)] font-semibold mb-1">Selected camera</p>
            <h3 className="font-display text-[20px] font-semibold text-[var(--ink)]">{activeCam.label}</h3>
            <p className="text-[13px] text-[var(--ink-soft)] mt-1">{activeCam.bodyArea}</p>

            <div className="mt-4 aspect-[4/3] rounded-lg border border-[var(--border)] overflow-hidden">
              <CanvasErrorBoundary>
                <Suspense fallback={null}>
                  <CameraViewCanvas cam={activeCam} />
                </Suspense>
              </CanvasErrorBoundary>
            </div>
            <p className="text-[11px] text-[var(--ink-faint)] mt-1.5">Live render from this camera's position</p>

            <dl className="mt-5 space-y-2.5 text-[13px]">
              <Row k="Resolution" v={`${activeCam.mp} MP`} />
              <Row k="Focus" v="Fixed focus" />
              <Row k="Capture" v="Synchronized capture" />
              <Row k="Mount height" v={`${activeCam.heightPct}% of booth height`} />
              <Row k="Viewing angle" v={`${activeCam.angleDeg}° azimuth`} />
            </dl>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <Camera size={22} className="text-[var(--ink-faint)] mb-3" />
            <p className="text-[13px] text-[var(--ink-soft)]">Click a camera on the booth to see its field of view and captured area.</p>
          </div>
        )}
      </aside>
    </div>
  )
}

function Badge({ icon: Icon, label }: { icon: typeof Camera; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-[var(--ink-soft)]">
      <Icon size={13} className="text-[var(--accent)]" strokeWidth={2} />
      {label}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2">
      <dt className="text-[var(--ink-faint)]">{k}</dt>
      <dd className="text-[var(--ink)] font-medium">{v}</dd>
    </div>
  )
}
