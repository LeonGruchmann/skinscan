import { useState } from 'react'
import { SCANS, CHANGE_SUMMARY, LESIONS } from '../lib/mockData'
import { useAppStore } from '../store/appStore'
import { HumanFigure } from '../components/HumanFigure'

export function ChangesSection() {
  const activeScanIndex = useAppStore((s) => s.activeScanIndex)
  const setActiveScanIndex = useAppStore((s) => s.setActiveScanIndex)
  const [compareLesionId, setCompareLesionId] = useState<string | null>(null)
  const changedLesions = LESIONS.filter((l) => l.changed)
  const compare = changedLesions.find((l) => l.id === compareLesionId) ?? null

  return (
    <div className="h-full flex flex-col gap-5 grid-fade-in overflow-y-auto pr-1">
      {/* timeline */}
      <div className="flex items-center gap-3">
        {SCANS.map((scan, i) => (
          <button
            key={scan.id}
            onClick={() => setActiveScanIndex(i as 0 | 1)}
            className={`flex-1 rounded-xl border px-4 py-3 text-left transition-colors ${
              activeScanIndex === i ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--surface)]'
            }`}
          >
            <p className="text-[11px] uppercase tracking-wide text-[var(--ink-faint)]">{scan.label}</p>
            <p className="text-[14px] font-semibold text-[var(--ink)]">{scan.date}</p>
          </button>
        ))}
      </div>

      {/* summary metrics */}
      <div className="grid grid-cols-5 gap-3">
        <Metric label="Lesions tracked" value={CHANGE_SUMMARY.tracked} />
        <Metric label="Unchanged" value={CHANGE_SUMMARY.unchanged} />
        <Metric label="New" value={CHANGE_SUMMARY.new} tone="ok" />
        <Metric label="Changed" value={CHANGE_SUMMARY.changed} tone="warn" />
        <Metric label="Recommended for review" value={CHANGE_SUMMARY.reviewRecommended} tone="danger" />
      </div>
      <p className="text-[11px] text-[var(--ink-faint)] -mt-2">Illustrative prototype values, not clinical results.</p>

      <div className="grid grid-cols-[1fr_1fr] gap-5 flex-1 min-h-0">
        {/* body with highlighted changes */}
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-b from-white to-[#f2f5f6] flex items-center justify-center relative">
          <div className="w-[200px] relative">
            <HumanFigure pose="neutral" className="w-full h-auto" />
            {changedLesions.map((l) => (
              <button
                key={l.id}
                onClick={() => setCompareLesionId(l.id)}
                style={{ left: `${l.region.x}%`, top: `${l.region.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span className="block w-3.5 h-3.5 rounded-full border-2 border-[var(--warn)] bg-[var(--warn)] scan-pulse" />
              </button>
            ))}
          </div>
          <p className="absolute top-3 left-3 text-[11px] text-[var(--ink-faint)]">Click a highlighted lesion to compare</p>
        </div>

        {/* changed lesion list */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-wide text-[var(--ink-faint)] font-semibold mb-2">Lesions with detected change</p>
          <div className="space-y-2">
            {changedLesions.map((l) => (
              <button
                key={l.id}
                onClick={() => setCompareLesionId(l.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                  compareLesionId === l.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border-soft)] hover:border-[var(--border)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[var(--ink)]">{l.label}</span>
                  <span className="text-[11px] text-[var(--warn)] font-medium">
                    {l.previousSizeMm} → {l.sizeMm} mm
                  </span>
                </div>
                <p className="text-[11px] text-[var(--ink-faint)]">{l.location}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {compare && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 grid-fade-in">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-[var(--ink)]">{compare.label} — {compare.location}</p>
            <button onClick={() => setCompareLesionId(null)} className="text-[11px] text-[var(--ink-faint)] hover:text-[var(--ink)]">Close</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ScanPanel title="Previous scan" date="March 2026" sizeMm={compare.previousSizeMm ?? 0} />
            <ScanPanel title="Current scan" date="September 2026" sizeMm={compare.sizeMm} highlight />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <MeasureRow k="Diameter" v={`${compare.previousSizeMm} mm → ${compare.sizeMm} mm`} />
            <MeasureRow k="Area" v={`+${Math.round((((compare.sizeMm - (compare.previousSizeMm ?? compare.sizeMm)) / (compare.previousSizeMm ?? 1)) * 100))}%`} />
            <MeasureRow k="Shape / color" v="Change detected" />
          </div>
          <div className="mt-4 px-4 py-3 rounded-lg bg-[var(--warn-soft)] text-[var(--warn)] text-[13px] font-medium">
            Professional review recommended
          </div>
          <p className="mt-3 text-[11px] text-[var(--ink-faint)]">
            Illustrative visualization. Image analysis does not constitute a medical diagnosis.
          </p>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: 'ok' | 'warn' | 'danger' }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'danger' ? 'var(--danger)' : 'var(--ink)'
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <p className="text-[20px] font-display font-semibold tabular-nums" style={{ color }}>{value.toLocaleString()}</p>
      <p className="text-[11px] text-[var(--ink-faint)] mt-0.5">{label}</p>
    </div>
  )
}

function ScanPanel({ title, date, sizeMm, highlight }: { title: string; date: string; sizeMm: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? 'border-[var(--warn)]' : 'border-[var(--border-soft)]'}`}>
      <p className="text-[11px] uppercase tracking-wide text-[var(--ink-faint)]">{title}</p>
      <p className="text-[12px] text-[var(--ink-soft)] mb-2">{date}</p>
      <div className="aspect-[4/3] rounded-lg bg-[linear-gradient(150deg,#eef2f3,#dbe4e6)] flex items-center justify-center relative">
        <HumanFigure pose="neutral" className="w-14 h-auto opacity-50" strokeColor="#8fa0a5" />
        <span
          className={`absolute w-4 h-4 rounded-full border-2 ${highlight ? 'border-[var(--warn)] bg-[var(--warn)]' : 'border-[var(--ink-faint)] bg-white'}`}
          style={{ left: '46%', top: '40%' }}
        />
      </div>
      <p className="text-[12px] text-[var(--ink)] font-medium mt-2">{sizeMm} mm</p>
    </div>
  )
}

function MeasureRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-[var(--border-soft)] px-3 py-2">
      <p className="text-[10.5px] text-[var(--ink-faint)]">{k}</p>
      <p className="text-[13px] font-medium text-[var(--ink)]">{v}</p>
    </div>
  )
}
