import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { categoryBreakdown } from '../../utils/kpi'
import { CATEGORY_COLOR_MAP, INK } from '../../utils/colors'
import type { Ticket, TicketCategory } from '../../types/ticket'

interface CategoryBreakdownChartProps {
  tickets: Ticket[]
  activeCategory: TicketCategory | null
  onSelectCategory: (category: TicketCategory) => void
}

export function CategoryBreakdownChart({
  tickets,
  activeCategory,
  onSelectCategory,
}: CategoryBreakdownChartProps) {
  const data = categoryBreakdown(tickets)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-slate-700">פניות לפי קטגוריה</h3>
      <p className="mt-0.5 text-xs text-slate-400">לחיצה על עמודה מסננת את הטבלה למטה</p>
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
            <Bar
              dataKey="count"
              name="פניות"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
              onClick={(entry) => onSelectCategory(entry.payload.category)}
              cursor="pointer"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLOR_MAP[entry.category]}
                  fillOpacity={activeCategory && activeCategory !== entry.category ? 0.35 : 1}
                />
              ))}
              <LabelList dataKey="count" position="right" style={{ fill: INK.primary, fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
