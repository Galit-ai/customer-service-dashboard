import { MOCK_NOW } from '../data/mockTickets'
import type { Ticket, TicketCategory, TicketStatus } from '../types/ticket'

const DAY_MS = 24 * 60 * 60 * 1000

export function countOpen(tickets: Ticket[]): number {
  return tickets.filter((t) => t.status !== 'סגור').length
}

export function countClosed(tickets: Ticket[]): number {
  return tickets.filter((t) => t.status === 'סגור').length
}

export function countCreatedToday(tickets: Ticket[]): number {
  const startOfToday = new Date(MOCK_NOW)
  startOfToday.setHours(0, 0, 0, 0)
  return tickets.filter((t) => new Date(t.createdAt) >= startOfToday).length
}

/** זמן תגובה ממוצע בדקות, בין פתיחת הפנייה למענה הראשון */
export function avgResponseMinutes(tickets: Ticket[]): number | null {
  const values = tickets
    .filter((t) => t.firstResponseAt)
    .map((t) => (new Date(t.firstResponseAt!).getTime() - new Date(t.createdAt).getTime()) / 60_000)
  return average(values)
}

/** זמן פתרון ממוצע בשעות, בין פתיחת הפנייה לסגירתה */
export function avgResolutionHours(tickets: Ticket[]): number | null {
  const values = tickets
    .filter((t) => t.resolvedAt)
    .map((t) => (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()) / 3_600_000)
  return average(values)
}

export function avgCsat(tickets: Ticket[]): number | null {
  const values = tickets.filter((t) => t.csatScore !== null).map((t) => t.csatScore as number)
  return average(values)
}

export interface CategoryCount {
  category: TicketCategory
  count: number
}

export function categoryBreakdown(tickets: Ticket[]): CategoryCount[] {
  const counts = new Map<TicketCategory, number>()
  for (const t of tickets) {
    counts.set(t.category, (counts.get(t.category) ?? 0) + 1)
  }
  return Array.from(counts, ([category, count]) => ({ category, count })).sort(
    (a, b) => b.count - a.count,
  )
}

export interface StatusCount {
  status: TicketStatus
  count: number
}

const STATUS_ORDER: TicketStatus[] = ['פתוח', 'בטיפול', 'סגור']

export function statusBreakdown(tickets: Ticket[]): StatusCount[] {
  const counts = new Map<TicketStatus, number>()
  for (const t of tickets) {
    counts.set(t.status, (counts.get(t.status) ?? 0) + 1)
  }
  return STATUS_ORDER.map((status) => ({ status, count: counts.get(status) ?? 0 }))
}

export interface DailyVolume {
  dateLabel: string
  count: number
}

/** נפח פניות יומי לאורך N הימים האחרונים (כולל ימים ללא פניות) */
export function dailyVolumeTrend(tickets: Ticket[], days = 30): DailyVolume[] {
  const buckets = new Map<string, number>()
  const start = new Date(MOCK_NOW)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (days - 1))

  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    buckets.set(dayKey(d), 0)
  }

  for (const t of tickets) {
    const key = dayKey(new Date(t.createdAt))
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }
  }

  return Array.from(buckets, ([key, count]) => ({ dateLabel: formatDayLabel(key), count }))
}

export interface WeeklyCsat {
  weekLabel: string
  avgCsat: number | null
}

/** ציון CSAT ממוצע לפי שבוע, לאורך N השבועות האחרונים */
export function weeklyCsatTrend(tickets: Ticket[], weeks = 5): WeeklyCsat[] {
  const rated = tickets.filter((t) => t.csatScore !== null)
  const end = new Date(MOCK_NOW)
  const result: WeeklyCsat[] = []

  for (let w = weeks - 1; w >= 0; w--) {
    const weekEnd = new Date(end.getTime() - w * 7 * DAY_MS)
    const weekStart = new Date(weekEnd.getTime() - 6 * DAY_MS)
    weekStart.setHours(0, 0, 0, 0)
    const weekEndBoundary = new Date(weekEnd)
    weekEndBoundary.setHours(23, 59, 59, 999)

    const inWeek = rated.filter((t) => {
      const created = new Date(t.createdAt)
      return created >= weekStart && created <= weekEndBoundary
    })

    result.push({
      weekLabel: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
      avgCsat: average(inWeek.map((t) => t.csatScore as number)),
    })
  }

  return result
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function formatDayLabel(key: string): string {
  const [, month, date] = key.split('-').map(Number)
  return `${date}/${month + 1}`
}
