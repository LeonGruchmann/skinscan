import { Suspense, useRef, useState } from 'react'
import { LESIONS } from '../lib/mockData'
import { useAppStore } from '../store/appStore'
import { SkinMapCanvas, type SkinMapCanvasHandle } from '../three/SkinMapCanvas'
import { CanvasErrorBoundary } from '../three/CanvasErrorBoundary'
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  monitoring: 'Monitoring',
  'review-recommended': 'Review recommended',
  stable: 'Stable',
}

export function SkinMapSection() {
  const [view, setView] = useState<'front' | 'back'>('back')
  const canvasRef = useRef<SkinMapCanvasHandle>(null)
  const selectedId = useAppStore((s) => s.selectedLesionId)
  const setSelectedId = useAppStore((s) => s.setSelectedLesionId)
  const selected = LESIONS.find((l) => l.id === selectedId) ?? null

  function handleSetView(v: 'front' | 'back') {
    setView(v)
    canvasRef.current?.setAzimuthDeg(v === 'front' ? 0 : 180)
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 h-full grid-fade-in">
      <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#0e1520] to-[#151d29] flex flex-col overflow-hidden relative">
        <div className="flex-1 relative">
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <SkinMapCanvas ref={canvasRef} lesions={LESIONS} selectedId={selectedId} onSelect={setSelectedId} />
            </Suspense>
          </CanvasErrorBoundary>
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          {(['front', 'back'] as const).map((v) => (
            <button
              key={v}
              onClick={() => handleSetView(v)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium capitalize border ${
                view === v ? 'bg-white text-[#0e1520] border-white' : 'text-white/70 border-white/25 hover:border-white/50'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            onClick={() => canvasRef.current?.rotateBy(-30)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <RotateCw size={14} className="scale-x-[-1]" />
          </button>
          <button
            onClick={() => canvasRef.current?.rotateBy(30)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={() => canvasRef.current?.zoomBy(1.15)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => canvasRef.current?.zoomBy(0.87)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        <div className="absolute top-4 right-4 text-[11px] text-white/50 pointer-events-none">Reconstructed from 16 synchronized views</div>
        <div className="absolute bottom-4 left-4 text-[10.5px] text-white/35 pointer-events-none">Drag to orbit · scroll to zoom · click a marker</div>
      </div>

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        {selected ? (
          <div className="grid-fade-in">
            <p className="text-[11px] uppercase tracking-wide text-[var(--accent)] font-semibold mb-1">{selected.label}</p>
            <h3 className="font-display text-[18px] font-semibold text-[var(--ink)]">{selected.location}</h3>

            <dl className="mt-4 space-y-2.5 text-[13px]">
              <Row k="Current size" v={`${selected.sizeMm} mm`} />
              <Row k="First detected" v={selected.firstDetected} />
              <Row k="Previous scan" v={selected.previousSizeMm ? `${selected.previousSizeMm} mm` : 'No previous measurement'} />
              <Row
                k="Status"
                v={STATUS_LABEL[selected.status]}
                highlight={selected.status === 'review-recommended'}
              />
            </dl>

            <p className="mt-5 text-[11px] text-[var(--ink-faint)] leading-relaxed">
              Illustrative visualization. Image analysis does not constitute a medical diagnosis.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <p className="text-[13px] text-[var(--ink-soft)]">Click a marker on the model to inspect a detected lesion.</p>
          </div>
        )}
      </aside>
    </div>
  )
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2">
      <dt className="text-[var(--ink-faint)]">{k}</dt>
      <dd className={`font-medium ${highlight ? 'text-[var(--warn)]' : 'text-[var(--ink)]'}`}>{v}</dd>
    </div>
  )
}
