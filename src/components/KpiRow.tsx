import {
  avgCsat,
  avgResolutionHours,
  avgResponseMinutes,
  countClosed,
  countCreatedToday,
  countOpen,
} from '../utils/kpi'
import type { Ticket } from '../types/ticket'
import { StatCard } from './StatCard'

interface KpiRowProps {
  tickets: Ticket[]
}

export function KpiRow({ tickets }: KpiRowProps) {
  const responseMin = avgResponseMinutes(tickets)
  const resolutionHrs = avgResolutionHours(tickets)
  const csat = avgCsat(tickets)

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard label="פניות פתוחות" value={String(countOpen(tickets))} />
      <StatCard label="פניות שנסגרו" value={String(countClosed(tickets))} />
      <StatCard label="הגיעו היום" value={String(countCreatedToday(tickets))} />
      <StatCard
        label="זמן תגובה ממוצע"
        value={responseMin === null ? '—' : `${Math.round(responseMin)} דק'`}
      />
      <StatCard
        label="זמן פתרון ממוצע"
        value={resolutionHrs === null ? '—' : `${resolutionHrs.toFixed(1)} שעות`}
      />
      <StatCard
        label="שביעות רצון (CSAT)"
        value={csat === null ? '—' : `${csat.toFixed(1)} / 5`}
      />
    </div>
  )
}
