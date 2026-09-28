import { Suspense, lazy } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { useAppStore } from './store/appStore'
import { OverviewSection } from './sections/OverviewSection'
import { BoothSection } from './sections/BoothSection'
import { ScanSection } from './sections/ScanSection'
import { CapturedSection } from './sections/CapturedSection'
import { ChangesSection } from './sections/ChangesSection'
import { ResultsSection } from './sections/ResultsSection'

// Three.js pulls in a large chunk — only load it when the 3D skin map is opened.
const SkinMapSection = lazy(() =>
  import('./sections/SkinMapSection').then((m) => ({ default: m.SkinMapSection })),
)

function App() {
  const section = useAppStore((s) => s.section)

  return (
    <div className="h-screen w-screen flex bg-[var(--bg)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar section={section} />
        <main className="flex-1 min-h-0 p-6">
          {section === 'overview' && <OverviewSection />}
          {section === 'booth' && <BoothSection />}
          {section === 'scan' && <ScanSection />}
          {section === 'captured' && <CapturedSection />}
          {section === 'skin-map' && (
            <Suspense fallback={<SkinMapFallback />}>
              <SkinMapSection />
            </Suspense>
          )}
          {section === 'changes' && <ChangesSection />}
          {section === 'results' && <ResultsSection />}
        </main>
      </div>
    </div>
  )
}

function SkinMapFallback() {
  return (
    <div className="h-full rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#0e1520] to-[#151d29] flex items-center justify-center">
      <p className="text-[13px] text-white/50">Loading 3D reconstruction…</p>
    </div>
  )
}

export default App
