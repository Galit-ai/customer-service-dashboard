import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getMentions } from '../services/mentionService'
import type { Mention, Sentiment } from '../types/mention'
import { brandSentiment, engagement, SENTIMENTS, weeklyTrend } from '../utils/mentions'
import { CATEGORICAL, INK, STATUS_COLORS } from '../utils/colors'
import { StatCard } from './StatCard'

const SENTIMENT_COLOR: Record<Sentiment, string> = {
  חיובי: STATUS_COLORS.good,
  ניטרלי: INK.muted,
  שלילי: STATUS_COLORS.critical,
}

const ALL = 'הכל'

export function MarketIntelligence() {
  const [mentions, setMentions] = useState<Mention[] | null>(null)
  const [brand, setBrand] = useState<string>(ALL)

  useEffect(() => {
    let cancelled = false
    getMentions().then((data) => {
      if (!cancelled) setMentions(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const brands = useMemo(() => (mentions ? brandSentiment(mentions) : []), [mentions])
  const filtered = useMemo(
    () => (mentions ?? []).filter((m) => brand === ALL || m.brand === brand),
    [mentions, brand],
  )
  const trend = useMemo(() => weeklyTrend(filtered), [filtered])
  const topPosts = useMemo(
    () => [...filtered].sort((a, b) => engagement(b) - engagement(a)).slice(0, 8),
    [filtered],
  )

  if (!mentions) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-950 text-pink-200">
        טוען נתונים...
      </div>
    )
  }

  const count = (s: Sentiment) => filtered.filter((m) => m.sentiment === s).length
  const negativePct = filtered.length ? Math.round((count('שלילי') / filtered.length) * 100) : 0
  const leader = brands[0]

  return (
    <div className="min-h-screen bg-pink-950">
      <div className="px-4 py-6 sm:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-white">מחקר שוק — אזכורי מתחרים ברשת</h1>
          <p className="mt-1 text-sm text-pink-200">
            מה אומרים ב-Reddit על פלטפורמות שירות הלקוחות המתחרות. הנתונים נאספים באמצעות Apify (Reddit
            Scraper) — כרגע מוצגת דגימת נתונים בפורמט הפלט של Apify.
          </p>
        </header>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {[ALL, ...brands.map((b) => b.brand)].map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  brand === b
                    ? 'bg-white font-medium text-pink-950'
                    : 'bg-pink-900 text-pink-100 hover:bg-pink-800'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="סה״כ אזכורים" value={String(filtered.length)} accent={CATEGORICAL.blue} />
            <StatCard label="אזכורים חיוביים" value={String(count('חיובי'))} accent={STATUS_COLORS.good} />
            <StatCard
              label="אזכורים שליליים"
              value={String(count('שלילי'))}
              sublabel={`${negativePct}% מהאזכורים`}
              accent={STATUS_COLORS.critical}
            />
            <StatCard
              label="המותג המדובר ביותר"
              value={leader?.brand ?? '—'}
              sublabel={leader ? `${leader.total} אזכורים` : undefined}
              accent={CATEGORICAL.violet}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-slate-700">סנטימנט לפי מתחרה</h3>
              <p className="mt-0.5 text-xs text-slate-400">מספר אזכורים, מחולק לפי טון הפוסט</p>
              <div className="mt-2 h-64" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brands} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke={INK.grid} vertical={false} />
                    <XAxis dataKey="brand" tick={{ fill: INK.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: INK.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.axis }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {SENTIMENTS.map((s) => (
                      <Bar key={s} dataKey={s} stackId="a" fill={SENTIMENT_COLOR[s]} maxBarSize={44} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-slate-700">מגמת אזכורים שבועית</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {brand === ALL ? 'כל המתחרים' : brand} · שבוע המתחיל ביום א׳
              </p>
              <div className="mt-2 h-64" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke={INK.grid} vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: INK.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: INK.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.axis }} />
                    <Line type="monotone" dataKey="count" name="אזכורים" stroke={CATEGORICAL.blue} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-700">הפוסטים עם הכי הרבה מעורבות</h3>
            <p className="mt-0.5 text-xs text-slate-400">מעורבות = הצבעות + 2 × תגובות</p>
            <ul className="mt-3 divide-y divide-slate-100">
              {topPosts.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      dir="ltr"
                      className="block text-left text-sm font-medium text-slate-900 hover:underline"
                    >
                      {m.title}
                    </a>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {m.brand} · <span dir="ltr">{m.community}</span> · ▲ {m.upvotes} · 💬 {m.comments}
                    </div>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: SENTIMENT_COLOR[m.sentiment] }}
                  >
                    {m.sentiment}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
