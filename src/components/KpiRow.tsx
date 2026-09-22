import {
  avgCsat,
  avgResolutionHours,
  avgResponseMinutes,
  countClosed,
  countCreatedToday,
  countOpen,
} from '../utils/kpi'
import { CATEGORICAL, STATUS_COLORS } from '../utils/colors'
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
      <StatCard
        label="פניות פתוחות"
        value={String(countOpen(tickets))}
        accent={STATUS_COLORS.warning}
      />
      <StatCard
        label="פניות שנסגרו"
        value={String(countClosed(tickets))}
        accent={STATUS_COLORS.good}
      />
      <StatCard label="הגיעו היום" value={String(countCreatedToday(tickets))} accent={CATEGORICAL.blue} />
      <StatCard
        label="זמן תגובה ממוצע"
        value={responseMin === null ? '—' : `${Math.round(responseMin)} דק'`}
        accent={CATEGORICAL.violet}
      />
      <StatCard
        label="זמן פתרון ממוצע"
        value={resolutionHrs === null ? '—' : `${resolutionHrs.toFixed(1)} שעות`}
        accent={CATEGORICAL.orange}
      />
      <StatCard
        label="שביעות רצון (CSAT)"
        value={csat === null ? '—' : `${csat.toFixed(1)} / 5`}
        accent={CATEGORICAL.magenta}
      />
    </div>
  )
}
