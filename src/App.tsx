import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { useAppStore } from './store/appStore'
import { OverviewSection } from './sections/OverviewSection'
import { BoothSection } from './sections/BoothSection'
import { ScanSection } from './sections/ScanSection'
import { CapturedSection } from './sections/CapturedSection'
import { SkinMapSection } from './sections/SkinMapSection'
import { ChangesSection } from './sections/ChangesSection'
import { ResultsSection } from './sections/ResultsSection'

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
          {section === 'skin-map' && <SkinMapSection />}
          {section === 'changes' && <ChangesSection />}
          {section === 'results' && <ResultsSection />}
        </main>
      </div>
    </div>
  )
}

export default App
