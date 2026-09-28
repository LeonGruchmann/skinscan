import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/appStore'
import { BodyFigureView } from '../three/BodyFigureView'
import { CAMERAS, POSES } from '../lib/mockData'
import { Camera, CheckCircle2, Loader2 } from 'lucide-react'

const STAGE_ORDER = ['preparing', 'pose-1', 'pose-2', 'pose-3', 'pose-4', 'complete'] as const

export function ScanSection() {
  const scanStage = useAppStore((s) => s.scanStage)
  const setScanStage = useAppStore((s) => s.setScanStage)
  const scanProgress = useAppStore((s) => s.scanProgress)
  const setScanProgress = useAppStore((s) => s.setScanProgress)
  const setScanCompleted = useAppStore((s) => s.setScanCompleted)
  const setSection = useAppStore((s) => s.setSection)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function startScan() {
    setScanStage('preparing')
    setScanProgress(0)
    runSequence(0)
  }

  function runSequence(stepIdx: number) {
    const stage = STAGE_ORDER[stepIdx]
    if (!stage) return
    setScanStage(stage)
    const stageProgress = Math.round(((stepIdx + 1) / STAGE_ORDER.length) * 100)

    // animate progress ticking up within the stage
    let p = stepIdx === 0 ? 0 : Math.round((stepIdx / STAGE_ORDER.length) * 100)
    const tick = () => {
      p = Math.min(p + 4, stageProgress)
      setScanProgress(p)
      if (p < stageProgress) {
        timeoutRef.current = window.setTimeout(tick, 40)
      } else {
        timeoutRef.current = window.setTimeout(() => {
          if (stepIdx + 1 < STAGE_ORDER.length) {
            runSequence(stepIdx + 1)
          } else {
            setScanCompleted(true)
          }
        }, 550)
      }
    }
    tick()
  }

  const isRunning = scanStage !== 'idle' && scanStage !== 'complete'
  const isComplete = scanStage === 'complete'
  const currentPose = POSES.find((p) => p.id === scanStage)

  return (
    <div className="grid grid-cols-[1fr_340px] gap-6 h-full grid-fade-in">
      <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-b from-white to-[#f2f5f6] flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative w-[220px]">
            <div className="aspect-[4/7]">
              <BodyFigureView className="w-full h-full" />
            </div>
            {isRunning && (
              <>
                {CAMERAS.filter((c) => c.id % 2 === 0).map((cam) => {
                  const rad = (cam.angleDeg * Math.PI) / 180
                  const x = 120 + 130 * Math.sin(rad)
                  const y = 120 - 90 * Math.cos(rad) * 0.4
                  return (
                    <span
                      key={cam.id}
                      style={{ left: x, top: y }}
                      className="scan-pulse absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                    />
                  )
                })}
              </>
            )}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-[var(--border-soft)] bg-white/70">
          {scanStage === 'idle' && (
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[var(--ink-soft)]">Ready to begin the standardized capture sequence.</p>
              <button
                onClick={startScan}
                className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-strong)] transition-colors"
              >
                Start scan
              </button>
            </div>
          )}

          {isRunning && (
            <div className="grid-fade-in">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
                  <span className="text-[13px] font-semibold text-[var(--ink)]">
                    {scanStage === 'preparing' ? 'Preparing' : currentPose?.name}
                  </span>
                </div>
                <span className="text-[12px] text-[var(--ink-faint)] tabular-nums">{scanProgress}%</span>
              </div>
              <p className="text-[12px] text-[var(--ink-faint)] mb-3">
                {scanStage === 'preparing' ? 'Lights turning on, cameras calibrating.' : currentPose?.detail}
              </p>
              <div className="h-1.5 rounded-full bg-[var(--border-soft)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-150 ease-linear"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="flex gap-1.5 mt-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-md border border-[var(--border)] bg-[#eef2f3] flex items-center justify-center grid-fade-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Camera size={12} className="text-[var(--ink-faint)]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {isComplete && (
            <div className="grid-fade-in flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[var(--ok)]" />
                <p className="text-[13px] font-medium text-[var(--ink)]">Scan complete — 16 cameras × 4 poses captured</p>
              </div>
              <button
                onClick={() => setSection('captured')}
                className="px-5 py-2.5 rounded-lg bg-[var(--ink)] text-white text-[13px] font-semibold hover:bg-black transition-colors"
              >
                View captured images
              </button>
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-[11px] uppercase tracking-wide text-[var(--ink-faint)] font-semibold mb-3">Sequence</p>
        <ol className="space-y-2">
          {POSES.map((pose, i) => {
            const stageIdx = STAGE_ORDER.indexOf(scanStage as (typeof STAGE_ORDER)[number])
            const thisIdx = STAGE_ORDER.indexOf(pose.id as (typeof STAGE_ORDER)[number])
            const done = isComplete || stageIdx > thisIdx
            const active = scanStage === pose.id
            return (
              <li
                key={pose.id}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                  active ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border-soft)]'
                }`}
              >
                <span
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    done ? 'bg-[var(--ok)] text-white' : active ? 'bg-[var(--accent)] text-white' : 'bg-[var(--border-soft)] text-[var(--ink-faint)]'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <div>
                  <p className="text-[12.5px] font-medium text-[var(--ink)]">{pose.name}</p>
                  <p className="text-[11.5px] text-[var(--ink-faint)]">{pose.detail}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </aside>
    </div>
  )
}
