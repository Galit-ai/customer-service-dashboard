interface StatCardProps {
  label: string
  value: string
  sublabel?: string
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-slate-900">{value}</div>
      {sublabel && <div className="mt-1 text-xs text-slate-400">{sublabel}</div>}
    </div>
  )
}
