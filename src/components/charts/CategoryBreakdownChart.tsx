import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { categoryBreakdown } from '../../utils/kpi'
import { CATEGORICAL, INK } from '../../utils/colors'
import type { Ticket } from '../../types/ticket'

interface CategoryBreakdownChartProps {
  tickets: Ticket[]
}

const CATEGORY_COLORS = [CATEGORICAL.blue, CATEGORICAL.orange, CATEGORICAL.aqua, CATEGORICAL.yellow]

export function CategoryBreakdownChart({ tickets }: CategoryBreakdownChartProps) {
  const data = categoryBreakdown(tickets)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-slate-700">פניות לפי קטגוריה</h3>
      <div className="mt-2 h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
            <XAxis type="number" allowDecimals={false} hide />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: INK.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.axis }}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            />
            <Bar dataKey="count" name="פניות" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {data.map((entry, i) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: INK.primary, fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
