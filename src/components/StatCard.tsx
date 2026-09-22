interface StatCardProps {
  label: string
  value: string
  sublabel?: string
  accent: string
}

export function StatCard({ label, value, sublabel, accent }: StatCardProps) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm border-r-4"
      style={{ borderRightColor: accent }}
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-slate-900">{value}</div>
      {sublabel && <div className="mt-1 text-xs text-slate-400">{sublabel}</div>}
    </div>
  )
}
