import { useEffect, useState } from 'react'
import { getTickets } from '../services/ticketService'
import type { Ticket, TicketCategory } from '../types/ticket'
import { KpiRow } from './KpiRow'
import { ALL, TicketsTable } from './TicketsTable'
import { VolumeTrendChart } from './charts/VolumeTrendChart'
import { CategoryBreakdownChart } from './charts/CategoryBreakdownChart'
import { StatusBreakdownChart } from './charts/StatusBreakdownChart'
import { CsatTrendChart } from './charts/CsatTrendChart'

export function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | typeof ALL>(ALL)

  useEffect(() => {
    let cancelled = false
    getTickets().then((data) => {
      if (!cancelled) setTickets(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!tickets) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-950 text-pink-200">
        טוען נתונים...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-950">
      <div className="h-1.5 bg-gradient-to-l from-blue-600 via-violet-600 to-emerald-500" />
      <div className="px-4 py-6 sm:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-white">דאשבורד שירות לקוחות</h1>
          <p className="mt-1 text-sm text-pink-200">תמונת מצב של פניות הלקוחות — נתוני דוגמה</p>
        </header>

        <div className="space-y-6">
          <KpiRow tickets={tickets} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <VolumeTrendChart tickets={tickets} />
            <CsatTrendChart tickets={tickets} />
            <CategoryBreakdownChart
              tickets={tickets}
              activeCategory={categoryFilter === ALL ? null : categoryFilter}
              onSelectCategory={(cat) =>
                setCategoryFilter((current) => (current === cat ? ALL : cat))
              }
            />
            <StatusBreakdownChart tickets={tickets} />
          </div>

          <TicketsTable
            tickets={tickets}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
          />
        </div>
      </div>
    </div>
  )
}
