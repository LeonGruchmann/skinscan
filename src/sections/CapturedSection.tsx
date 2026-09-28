import { useState } from 'react'
import { CAPTURED_IMAGES, CAMERAS } from '../lib/mockData'
import { BodyPhotoView } from '../three/BodyPhotoView'
import { X } from 'lucide-react'

const TOTAL_LESIONS = CAPTURED_IMAGES.reduce((sum, img) => sum + img.lesionCount, 0)

export function CapturedSection() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = CAPTURED_IMAGES.find((i) => i.id === openId) ?? null

  return (
    <div className="h-full flex flex-col grid-fade-in">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-[var(--ink-soft)]">{CAPTURED_IMAGES.length} standardized clinical views from this scan</p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] text-[12px] font-semibold">
          {TOTAL_LESIONS} visible lesions detected
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="grid grid-cols-4 gap-4">
          {CAPTURED_IMAGES.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setOpenId(img.id)}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="relative overflow-hidden h-56">
                <BodyPhotoView view={img.view} seed={i} className="absolute inset-0" />
                {img.lesionCount > 0 && (
                  <div className="absolute inset-0">
                    {Array.from({ length: img.lesionCount }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          left: `${28 + ((i * 37) % 44)}%`,
                          top: `${22 + ((i * 53) % 56)}%`,
                        }}
                        className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)] bg-white/70 text-[8px] font-bold text-[var(--accent-strong)] flex items-center justify-center"
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                )}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/80 text-[10px] font-medium text-[var(--ink-soft)] border border-[var(--border-soft)]">
                  Cam {String(img.cameraId).padStart(2, '0')}
                </span>
              </div>
              <div className="px-3 py-2">
                <p className="text-[12px] font-medium text-[var(--ink)] truncate">{img.label}</p>
                <p className="text-[10.5px] text-[var(--ink-faint)]">{img.lesionCount} lesion{img.lesionCount === 1 ? '' : 's'} marked</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 grid-fade-in"
          onClick={() => setOpenId(null)}
        >
          <div
            className="bg-[var(--surface)] rounded-2xl overflow-hidden w-[440px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-soft)]">
              <div>
                <p className="text-[13px] font-semibold text-[var(--ink)]">{open.label}</p>
                <p className="text-[11px] text-[var(--ink-faint)]">
                  Camera {String(open.cameraId).padStart(2, '0')} · {CAMERAS.find((c) => c.id === open.cameraId)?.bodyArea}
                </p>
              </div>
              <button onClick={() => setOpenId(null)} className="text-[var(--ink-faint)] hover:text-[var(--ink)]">
                <X size={18} />
              </button>
            </div>
            <div className="relative overflow-hidden h-[480px]">
              <BodyPhotoView view={open.view} seed={CAPTURED_IMAGES.findIndex((i) => i.id === open.id)} className="absolute inset-0" />
              {Array.from({ length: open.lesionCount }).map((_, i) => (
                <span
                  key={i}
                  style={{ left: `${28 + ((i * 37) % 44)}%`, top: `${22 + ((i * 53) % 56)}%` }}
                  className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent)] bg-white/80 text-[11px] font-bold text-[var(--accent-strong)] flex items-center justify-center"
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <div className="px-5 py-3 text-[11px] text-[var(--ink-faint)] border-t border-[var(--border-soft)]">
              Markers indicate detected lesions for review — illustrative, not a diagnosis.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
