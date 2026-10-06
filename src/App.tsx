import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { MarketIntelligence } from './components/MarketIntelligence'

const TABS = [
  { id: 'service', label: 'שירות לקוחות' },
  { id: 'market', label: 'מחקר שוק (Apify)' },
] as const

type TabId = (typeof TABS)[number]['id']

function App() {
  const [tab, setTab] = useState<TabId>('service')

  return (
    <>
      <nav className="flex gap-2 bg-pink-900 px-4 py-2 sm:px-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-4 py-1.5 text-sm transition ${
              tab === t.id ? 'bg-white font-medium text-pink-950' : 'text-pink-100 hover:bg-pink-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {tab === 'service' ? <Dashboard /> : <MarketIntelligence />}
    </>
  )
}

export default App
