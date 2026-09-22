import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { statusBreakdown } from '../../utils/kpi'
import { CATEGORICAL, INK, STATUS_COLORS } from '../../utils/colors'
import type { Ticket, TicketStatus } from '../../types/ticket'

interface StatusBreakdownChartProps {
  tickets: Ticket[]
}

const STATUS_COLOR_MAP: Record<TicketStatus, string> = {
  פתוח: STATUS_COLORS.warning,
  בטיפול: CATEGORICAL.blue,
  סגור: STATUS_COLORS.good,
}

export function StatusBreakdownChart({ tickets }: StatusBreakdownChartProps) {
  const data = statusBreakdown(tickets)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-slate-700">פניות לפי סטטוס</h3>
      <div className="mt-2 h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
            <XAxis type="number" allowDecimals={false} hide />
            <YAxis
              type="category"
              dataKey="status"
              tick={{ fill: INK.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.axis }}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            />
            <Bar dataKey="count" name="פניות" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLOR_MAP[entry.status]} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: INK.primary, fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
