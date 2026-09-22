import { useEffect, useState } from 'react'
import { getTickets } from '../services/ticketService'
import type { Ticket } from '../types/ticket'
import { KpiRow } from './KpiRow'
import { TicketsTable } from './TicketsTable'
import { VolumeTrendChart } from './charts/VolumeTrendChart'
import { CategoryBreakdownChart } from './charts/CategoryBreakdownChart'
import { StatusBreakdownChart } from './charts/StatusBreakdownChart'
import { CsatTrendChart } from './charts/CsatTrendChart'

export function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null)

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
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        טוען נתונים...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">דאשבורד שירות לקוחות</h1>
        <p className="mt-1 text-sm text-slate-500">תמונת מצב של פניות הלקוחות — נתוני דוגמה</p>
      </header>

      <div className="space-y-6">
        <KpiRow tickets={tickets} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <VolumeTrendChart tickets={tickets} />
          <CsatTrendChart tickets={tickets} />
          <CategoryBreakdownChart tickets={tickets} />
          <StatusBreakdownChart tickets={tickets} />
        </div>

        <TicketsTable tickets={tickets} />
      </div>
    </div>
  )
}
