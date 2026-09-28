import { CHANGE_SUMMARY, LESIONS } from '../lib/mockData'
import { BodyFigureView } from '../three/BodyFigureView'
import { useAppStore } from '../store/appStore'
import { CheckCircle2 } from 'lucide-react'

export function ResultsSection() {
  const setSection = useAppStore((s) => s.setSection)
  const setSelectedId = useAppStore((s) => s.setSelectedLesionId)
  const reviewLesions = LESIONS.filter((l) => l.status === 'review-recommended')

  return (
    <div className="h-full overflow-y-auto pr-1 grid-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 size={18} className="text-[var(--ok)]" />
        <p className="text-[14px] font-semibold text-[var(--ink)]">Scan completed</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-2">
        <BigMetric value={CHANGE_SUMMARY.tracked} label="Skin lesions tracked" />
        <BigMetric value={CHANGE_SUMMARY.new} label="New lesions" tone="ok" />
        <BigMetric value={CHANGE_SUMMARY.changed} label="Meaningful changes detected" tone="warn" />
        <BigMetric value={CHANGE_SUMMARY.reviewRecommended} label="Recommended for professional review" tone="danger" />
      </div>
      <p className="text-[11px] text-[var(--ink-faint)] mb-6">Illustrative prototype data — not real clinical results.</p>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-b from-white to-[#f2f5f6] flex items-center justify-center py-8 relative">
          <div className="w-[200px] relative">
            <div className="aspect-[4/7]">
              <BodyFigureView className="w-full h-full" />
            </div>
            {reviewLesions.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedId(l.id)
                  setSection('changes')
                }}
                style={{ left: `${l.region.x}%`, top: `${l.region.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                title={l.label}
              >
                <span className="block w-4 h-4 rounded-full border-2 border-[var(--danger)] bg-[var(--danger)] scan-pulse" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-[11px] uppercase tracking-wide text-[var(--ink-faint)] font-semibold mb-3">Recommended for review</p>
          <div className="space-y-2">
            {reviewLesions.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedId(l.id)
                  setSection('changes')
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-[var(--border-soft)] hover:border-[var(--danger)] transition-colors"
              >
                <p className="text-[13px] font-medium text-[var(--ink)]">{l.label}</p>
                <p className="text-[11px] text-[var(--ink-faint)]">{l.location}</p>
              </button>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-[var(--ink-faint)] leading-relaxed">
            This system is intended to assist professional review — it does not replace evaluation by a qualified clinician.
          </p>
        </div>
      </div>
    </div>
  )
}

function BigMetric({ value, label, tone }: { value: number; label: string; tone?: 'ok' | 'warn' | 'danger' }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'danger' ? 'var(--danger)' : 'var(--ink)'
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5">
      <p className="text-[32px] font-display font-semibold tabular-nums leading-none" style={{ color }}>
        {value.toLocaleString()}
      </p>
      <p className="text-[12px] text-[var(--ink-faint)] mt-2">{label}</p>
    </div>
  )
}
