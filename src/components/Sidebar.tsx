import { useAppStore, type Section } from '../store/appStore'
import {
  LayoutGrid,
  Box,
  ScanLine,
  Images,
  Rotate3d,
  GitCompareArrows,
  ClipboardList,
} from 'lucide-react'

const NAV: { id: Section; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'booth', label: 'Booth', icon: Box },
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'captured', label: 'Captured Images', icon: Images },
  { id: 'skin-map', label: '3D Skin Map', icon: Rotate3d },
  { id: 'changes', label: 'Changes Over Time', icon: GitCompareArrows },
  { id: 'results', label: 'Results', icon: ClipboardList },
]

export function Sidebar() {
  const section = useAppStore((s) => s.section)
  const setSection = useAppStore((s) => s.setSection)

  return (
    <aside className="w-[248px] shrink-0 h-full border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
      <div className="px-6 py-6 border-b border-[var(--border-soft)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <ScanLine size={16} className="text-white" strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-display font-semibold text-[15px] leading-none text-[var(--ink)]">SkinScan</p>
            <p className="text-[11px] text-[var(--ink-faint)] mt-0.5">Concept prototype</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = section === id
          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors text-left ${
                active
                  ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                  : 'text-[var(--ink-soft)] hover:bg-[var(--border-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <Icon
                size={16}
                strokeWidth={2}
                className={active ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)] group-hover:text-[var(--ink-soft)]'}
              />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[var(--border-soft)]">
        <p className="text-[11px] leading-snug text-[var(--ink-faint)]">
          Illustrative concept visualization. Not a diagnostic device.
        </p>
      </div>
    </aside>
  )
}
