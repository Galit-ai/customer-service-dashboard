import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dailyVolumeTrend } from '../../utils/kpi'
import { CATEGORICAL, INK } from '../../utils/colors'
import type { Ticket } from '../../types/ticket'

interface VolumeTrendChartProps {
  tickets: Ticket[]
}

export function VolumeTrendChart({ tickets }: VolumeTrendChartProps) {
  const data = dailyVolumeTrend(tickets, 30)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-slate-700">נפח פניות — 30 הימים האחרונים</h3>
      <div className="mt-2 h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke={INK.grid} vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fill: INK.muted, fontSize: 11 }}
              axisLine={{ stroke: INK.axis }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: INK.muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.axis }}
              labelStyle={{ color: INK.primary }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="פניות"
              stroke={CATEGORICAL.blue}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
