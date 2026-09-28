import { useState } from 'react'
import { LESIONS } from '../lib/mockData'
import { HumanFigure } from '../components/HumanFigure'
import { useAppStore } from '../store/appStore'
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  monitoring: 'Monitoring',
  'review-recommended': 'Review recommended',
  stable: 'Stable',
}

export function SkinMapSection() {
  const [view, setView] = useState<'front' | 'back'>('back')
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const selectedId = useAppStore((s) => s.selectedLesionId)
  const setSelectedId = useAppStore((s) => s.setSelectedLesionId)
  const selected = LESIONS.find((l) => l.id === selectedId) ?? null

  const visibleLesions = LESIONS.filter((l) => l.region.view === view)

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 h-full grid-fade-in">
      <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#0e1520] to-[#151d29] flex flex-col overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center [perspective:1200px]">
          <div
            className="relative transition-transform duration-500 ease-out"
            style={{ transform: `rotateY(${rotation}deg) scale(${zoom})`, transformStyle: 'preserve-3d' }}
          >
            <div className="w-[220px] relative">
              <HumanFigure pose="neutral" className="w-full h-auto" strokeColor="#8fd6dc" fillColor="rgba(14,124,134,0.08)" />
              {visibleLesions.map((lesion) => (
                <button
                  key={lesion.id}
                  onClick={() => setSelectedId(lesion.id)}
                  style={{ left: `${lesion.region.x}%`, top: `${lesion.region.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    className={`block rounded-full border-2 transition-all ${
                      selectedId === lesion.id
                        ? 'w-4 h-4 border-white bg-[var(--accent)]'
                        : lesion.changed
                          ? 'w-3 h-3 border-[var(--warn)] bg-[var(--warn)] scan-pulse'
                          : 'w-2.5 h-2.5 border-[#8fd6dc] bg-[#8fd6dc]/70'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          {(['front', 'back'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
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
            onClick={() => setRotation((r) => r - 45)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <RotateCw size={14} className="scale-x-[-1]" />
          </button>
          <button
            onClick={() => setRotation((r) => r + 45)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        <div className="absolute top-4 right-4 text-[11px] text-white/50">Reconstructed from 16 synchronized views</div>
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
