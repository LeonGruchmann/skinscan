const TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'How SkinScan works, end to end' },
  booth: { title: 'Imaging booth', subtitle: 'Multi-camera capture environment' },
  scan: { title: 'Scan sequence', subtitle: 'Standardized pose capture' },
  captured: { title: 'Captured views', subtitle: 'Raw synchronized camera output' },
  'skin-map': { title: '3D skin map', subtitle: 'Reconstructed body model with detected lesions' },
  changes: { title: 'Changes over time', subtitle: 'Longitudinal comparison across scans' },
  results: { title: 'Scan overview', subtitle: 'Summary and recommended follow-up' },
}

export function TopBar({ section }: { section: string }) {
  const copy = TITLES[section] ?? TITLES.overview
  return (
    <header className="h-16 shrink-0 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur flex items-center justify-between px-8">
      <div>
        <h1 className="font-display font-semibold text-[16px] text-[var(--ink)] leading-tight">{copy.title}</h1>
        <p className="text-[12px] text-[var(--ink-faint)] leading-tight">{copy.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[var(--ink-faint)]">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)]" />
          Concept prototype — illustrative data only
        </span>
      </div>
    </header>
  )
}
