import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { MentionsView } from './components/MentionsView'

type View = 'tickets' | 'mentions'

const TABS: { id: View; label: string }[] = [
  { id: 'tickets', label: 'פניות לקוחות' },
  { id: 'mentions', label: 'מחקר שוק (Apify)' },
]

function App() {
  const [view, setView] = useState<View>('tickets')

  return (
    <div className="min-h-screen bg-pink-950">
      <nav className="flex gap-2 px-4 pt-4 sm:px-8" aria-label="תצוגות">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            aria-current={view === tab.id ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              view === tab.id ? 'bg-white text-pink-950' : 'bg-pink-900 text-pink-100 hover:bg-pink-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {view === 'tickets' ? <Dashboard /> : <MentionsView />}
    </div>
  )
}

export default App
