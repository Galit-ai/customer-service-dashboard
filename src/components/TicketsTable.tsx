import { useMemo, useState } from 'react'
import type { Ticket, TicketCategory, TicketStatus } from '../types/ticket'
import { CATEGORICAL, STATUS_COLORS } from '../utils/colors'

interface TicketsTableProps {
  tickets: Ticket[]
}

const ALL = 'הכל'

const STATUS_DOT: Record<TicketStatus, string> = {
  פתוח: STATUS_COLORS.warning,
  בטיפול: CATEGORICAL.blue,
  סגור: STATUS_COLORS.good,
}

function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: STATUS_DOT[status] }}
        aria-hidden
      />
      {status}
    </span>
  )
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TicketStatus | typeof ALL>(ALL)
  const [category, setCategory] = useState<TicketCategory | typeof ALL>(ALL)
  const [agent, setAgent] = useState<string>(ALL)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const agents = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.assignedAgent))).sort(),
    [tickets],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const from = fromDate ? new Date(fromDate) : null
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null

    return tickets.filter((t) => {
      if (status !== ALL && t.status !== status) return false
      if (category !== ALL && t.category !== category) return false
      if (agent !== ALL && t.assignedAgent !== agent) return false

      const created = new Date(t.createdAt)
      if (from && created < from) return false
      if (to && created > to) return false

      if (term) {
        const haystack = `${t.subject} ${t.customerName}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }

      return true
    })
  }, [tickets, search, status, category, agent, fromDate, toDate])

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs text-slate-500" htmlFor="search">
            חיפוש
          </label>
          <input
            id="search"
            type="text"
            placeholder="נושא או שם לקוח..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 w-48 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <FilterSelect
          label="סטטוס"
          value={status}
          onChange={(v) => setStatus(v as TicketStatus | typeof ALL)}
          options={[ALL, 'פתוח', 'בטיפול', 'סגור']}
        />
        <FilterSelect
          label="קטגוריה"
          value={category}
          onChange={(v) => setCategory(v as TicketCategory | typeof ALL)}
          options={[ALL, 'בעיות תשלום', 'תמיכה טכנית', 'החזרים', 'אחר']}
        />
        <FilterSelect label="נציג" value={agent} onChange={setAgent} options={[ALL, ...agents]} />

        <div className="flex flex-col">
          <label className="text-xs text-slate-500" htmlFor="fromDate">
            מתאריך
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500" htmlFor="toDate">
            עד תאריך
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mr-auto text-sm text-slate-400">
          מציג {filtered.length} מתוך {tickets.length} פניות
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] text-right text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-2 font-medium">מזהה</th>
              <th className="px-2 py-2 font-medium">נושא</th>
              <th className="px-2 py-2 font-medium">קטגוריה</th>
              <th className="px-2 py-2 font-medium">סטטוס</th>
              <th className="px-2 py-2 font-medium">עדיפות</th>
              <th className="px-2 py-2 font-medium">לקוח</th>
              <th className="px-2 py-2 font-medium">נציג</th>
              <th className="px-2 py-2 font-medium">נפתח בתאריך</th>
              <th className="px-2 py-2 font-medium">CSAT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-2 py-2 text-slate-500">{t.id}</td>
                <td className="px-2 py-2 text-slate-800">{t.subject}</td>
                <td className="px-2 py-2 text-slate-600">{t.category}</td>
                <td className="px-2 py-2">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-2 py-2 text-slate-600">{t.priority}</td>
                <td className="px-2 py-2 text-slate-600">{t.customerName}</td>
                <td className="px-2 py-2 text-slate-600">{t.assignedAgent}</td>
                <td className="px-2 py-2 text-slate-500">{formatDateTime(t.createdAt)}</td>
                <td className="px-2 py-2 text-slate-600">{t.csatScore ?? '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-2 py-6 text-center text-slate-400">
                  לא נמצאו פניות התואמות לחיפוש/סינון
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  const id = `filter-${label}`
  return (
    <div className="flex flex-col">
      <label className="text-xs text-slate-500" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
