import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { weeklyCsatTrend } from '../../utils/kpi'
import { CATEGORICAL, INK } from '../../utils/colors'
import type { Ticket } from '../../types/ticket'

interface CsatTrendChartProps {
  tickets: Ticket[]
}

export function CsatTrendChart({ tickets }: CsatTrendChartProps) {
  const data = weeklyCsatTrend(tickets, 5)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-slate-700">מגמת שביעות רצון (CSAT) — לפי שבוע</h3>
      <div className="mt-2 h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke={INK.grid} vertical={false} />
            <XAxis
              dataKey="weekLabel"
              tick={{ fill: INK.muted, fontSize: 11 }}
              axisLine={{ stroke: INK.axis }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fill: INK.muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.axis }}
              formatter={(value) =>
                value === null || value === undefined ? 'אין דירוגים' : Number(value).toFixed(1)
              }
            />
            <Line
              type="monotone"
              dataKey="avgCsat"
              name="CSAT ממוצע"
              stroke={CATEGORICAL.blue}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
