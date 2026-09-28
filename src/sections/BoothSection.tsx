import { useMemo } from 'react'
import { CAMERAS } from '../lib/mockData'
import { HumanFigure } from '../components/HumanFigure'
import { useAppStore } from '../store/appStore'
import { Camera, Lightbulb, ScanLine } from 'lucide-react'

export function BoothSection() {
  const selected = useAppStore((s) => s.selectedCamera)
  const setSelected = useAppStore((s) => s.setSelectedCamera)
  const activeCam = useMemo(() => CAMERAS.find((c) => c.id === selected) ?? null, [selected])

  const radiusX = 220
  const radiusY = 90

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 h-full grid-fade-in">
      <div className="relative rounded-2xl border border-[var(--border)] bg-gradient-to-b from-white to-[#f2f5f6] overflow-hidden flex flex-col">
        <div className="flex-1 relative flex items-center justify-center [perspective:1400px]">
          <div className="relative w-[560px] h-[440px] [transform-style:preserve-3d] [transform:rotateX(18deg)]">
            {/* floor platform */}
            <div className="absolute left-1/2 top-[300px] -translate-x-1/2 w-[480px] h-[200px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,124,134,0.08),transparent_70%)] border border-[var(--border)]" />
            <div className="absolute left-1/2 top-[300px] -translate-x-1/2 w-[440px] h-[170px] rounded-full border border-dashed border-[var(--border)]" />
            <div className="absolute left-1/2 top-[300px] -translate-x-1/2 w-[300px] h-[110px] rounded-full border border-dashed border-[var(--accent)] opacity-40" />

            {/* booth glass frame */}
            <div className="absolute left-1/2 top-[60px] -translate-x-1/2 w-[420px] h-[330px] rounded-xl border border-[var(--border)] bg-white/20" />

            {/* person */}
            <div className="absolute left-1/2 top-[110px] -translate-x-1/2 w-[140px] z-10">
              <HumanFigure pose="neutral" className="w-full h-auto drop-shadow-sm" />
            </div>

            {/* cameras ring */}
            {CAMERAS.map((cam) => {
              const rad = (cam.angleDeg * Math.PI) / 180
              const x = 280 + radiusX * Math.sin(rad)
              const y = 240 - (cam.heightPct / 100) * 220 - radiusY * Math.cos(rad) * 0.25
              const isActive = selected === cam.id
              return (
                <button
                  key={cam.id}
                  onClick={() => setSelected(isActive ? null : cam.id)}
                  style={{ left: x, top: y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                >
                  {isActive && (
                    <svg
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      width="360"
                      height="240"
                      style={{ overflow: 'visible' }}
                    >
                      <polygon
                        points={`180,120 ${180 + (280 - x)},${120 + (110 - y) * 0.6} ${180 + (280 - x) * 1.1},${120 + (110 - y) * 0.9}`}
                        fill="var(--teal-glow)"
                      />
                    </svg>
                  )}
                  <span
                    className={`relative flex items-center justify-center w-7 h-7 rounded-md border shadow-sm transition-all ${
                      isActive
                        ? 'bg-[var(--accent)] border-[var(--accent-strong)] scale-110'
                        : 'bg-white border-[var(--border)] group-hover:border-[var(--accent)]'
                    }`}
                  >
                    <Camera size={13} className={isActive ? 'text-white' : 'text-[var(--ink-soft)]'} strokeWidth={2} />
                  </span>
                  {cam.id % 3 === 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent)]/50" />
                  )}
                </button>
              )
            })}

            {/* LED panels between cameras, sparser */}
            {CAMERAS.filter((c) => c.id % 3 === 1).map((cam) => {
              const rad = ((cam.angleDeg + 10) * Math.PI) / 180
              const x = 280 + (radiusX + 20) * Math.sin(rad)
              const y = 240 - (cam.heightPct / 100) * 220 - radiusY * Math.cos(rad) * 0.25
              return (
                <span
                  key={`led-${cam.id}`}
                  style={{ left: x, top: y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#fff7dd] border border-[#e8dfb8] shadow-[0_0_6px_2px_rgba(255,247,221,0.8)]"
                />
              )
            })}
          </div>
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

            <div className="mt-4 aspect-[4/3] rounded-lg bg-[linear-gradient(135deg,#eef2f3,#e2e8ea)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
              <HumanFigure pose="neutral" className="w-24 h-auto opacity-60" strokeColor="#94a3ac" />
            </div>
            <p className="text-[11px] text-[var(--ink-faint)] mt-1.5">Simulated camera preview</p>

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
