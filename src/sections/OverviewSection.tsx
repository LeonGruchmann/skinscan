import { useAppStore } from '../store/appStore'
import { BodyFigureView } from '../three/BodyFigureView'
import { Camera, Box, ScanLine, GitCompareArrows, ClipboardCheck } from 'lucide-react'

const STAGES = [
  { key: 'booth', icon: Camera, title: 'Capture', detail: '16–20 synchronized cameras' },
  { key: 'skin-map', icon: Box, title: 'Reconstruct', detail: 'Multiple views → 3D skin map' },
  { key: 'skin-map', icon: ScanLine, title: 'Detect', detail: 'Computer vision identifies skin lesions' },
  { key: 'changes', icon: GitCompareArrows, title: 'Compare', detail: 'Current scan vs previous scan' },
  { key: 'results', icon: ClipboardCheck, title: 'Review', detail: 'Changing areas presented to a clinician' },
] as const

export function OverviewSection() {
  const setSection = useAppStore((s) => s.setSection)

  return (
    <div className="h-full overflow-y-auto pr-1 grid-fade-in">
      <div className="grid grid-cols-[1fr_360px] gap-6 mb-6">
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-white to-[#eef4f5] p-8 flex flex-col justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[var(--accent)] font-semibold mb-2">Concept prototype</p>
            <h2 className="font-display text-[28px] font-semibold text-[var(--ink)] leading-tight max-w-[520px]">
              A controlled booth captures the whole body, then tracks how skin changes over time.
            </h2>
            <p className="text-[13.5px] text-[var(--ink-soft)] mt-3 max-w-[480px] leading-relaxed">
              A person stands inside the booth while synchronized cameras capture several standardized poses.
              The images are reconstructed into a 3D skin map, lesions are located and measured, and future
              scans are compared against the baseline to flag areas that may warrant professional review.
            </p>
          </div>
          <button
            onClick={() => setSection('booth')}
            className="mt-6 self-start px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-strong)] transition-colors"
          >
            Explore the booth
          </button>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center p-6">
          <div className="w-32 aspect-[4/7]">
            <BodyFigureView className="w-full h-full" />
          </div>
        </div>
      </div>

      <p className="text-[11px] uppercase tracking-wide text-[var(--ink-faint)] font-semibold mb-3">How it works</p>
      <div className="grid grid-cols-5 gap-3 mb-2">
        {STAGES.map(({ key, icon: Icon, title, detail }, i) => (
          <button
            key={title}
            onClick={() => setSection(key)}
            className="relative text-left rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--accent)] transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center mb-3">
              <Icon size={16} className="text-[var(--accent)]" />
            </div>
            <p className="text-[13px] font-semibold text-[var(--ink)]">{title}</p>
            <p className="text-[11.5px] text-[var(--ink-faint)] mt-1 leading-snug">{detail}</p>
            {i < STAGES.length - 1 && (
              <span className="hidden md:block absolute top-1/2 -right-3 w-3 h-px bg-[var(--border)]" />
            )}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-[var(--ink-faint)] mb-8">
        SkinScan is designed to assist professional review, not replace it — it does not diagnose skin cancer.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <FeatureCard title="360° coverage" detail="Multiple synchronized cameras and standardized poses eliminate blind spots without requiring the person to rotate." />
        <FeatureCard title="Longitudinal tracking" detail="Every scan is compared against prior scans so subtle, measurable changes over time can surface." />
        <FeatureCard title="Human-in-the-loop" detail="Flagged areas are routed to a healthcare professional for review — the system never issues a diagnosis." />
      </div>
    </div>
  )
}

function FeatureCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[13px] font-semibold text-[var(--ink)] mb-1.5">{title}</p>
      <p className="text-[12.5px] text-[var(--ink-faint)] leading-relaxed">{detail}</p>
    </div>
  )
}
