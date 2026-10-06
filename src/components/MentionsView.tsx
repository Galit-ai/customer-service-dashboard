import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getMentions } from '../services/mentionService'
import { classifySentiment } from '../utils/sentiment'
import { CATEGORICAL, INK, STATUS_COLORS } from '../utils/colors'
import type { Mention, MentionSentiment, MentionsResult } from '../types/mention'
import { StatCard } from './StatCard'

const ALL = 'הכל'
const SENTIMENTS: MentionSentiment[] = ['חיובי', 'ניטרלי', 'שלילי']

const SENTIMENT_COLOR: Record<MentionSentiment, string> = {
  חיובי: STATUS_COLORS.good,
  ניטרלי: INK.muted,
  שלילי: STATUS_COLORS.critical,
}

interface EnrichedMention extends Mention {
  sentiment: MentionSentiment
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function SentimentBadge({ sentiment }: { sentiment: MentionSentiment }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: SENTIMENT_COLOR[sentiment] }}
        aria-hidden
      />
      {sentiment}
    </span>
  )
}

export function MentionsView() {
  const [result, setResult] = useState<MentionsResult | null>(null)
  const [competitor, setCompetitor] = useState<string>(ALL)
  const [sentiment, setSentiment] = useState<MentionSentiment | typeof ALL>(ALL)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    getMentions().then((data) => {
      if (!cancelled) setResult(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const mentions = useMemo<EnrichedMention[]>(
    () =>
      (result?.mentions ?? [])
        .map((m) => ({ ...m, sentiment: classifySentiment(m) }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [result],
  )

  const competitors = useMemo(() => Array.from(new Set(mentions.map((m) => m.competitor))).sort(), [mentions])

  const chartData = useMemo(
    () =>
      competitors.map((name) => {
        const own = mentions.filter((m) => m.competitor === name)
        return {
          competitor: name,
          חיובי: own.filter((m) => m.sentiment === 'חיובי').length,
          ניטרלי: own.filter((m) => m.sentiment === 'ניטרלי').length,
          שלילי: own.filter((m) => m.sentiment === 'שלילי').length,
          total: own.length,
        }
      }),
    [competitors, mentions],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return mentions.filter((m) => {
      if (competitor !== ALL && m.competitor !== competitor) return false
      if (sentiment !== ALL && m.sentiment !== sentiment) return false
      if (term && !`${m.title} ${m.text} ${m.community}`.toLowerCase().includes(term)) return false
      return true
    })
  }, [mentions, competitor, sentiment, search])

  if (!result) {
    return <div className="py-24 text-center text-pink-200">טוען אזכורים...</div>
  }

  const negativeCount = mentions.filter((m) => m.sentiment === 'שלילי').length
  const topCompetitor = [...chartData].sort((a, b) => b.total - a.total)[0]
  const mostNegative = [...chartData]
    .filter((d) => d.total > 0)
    .sort((a, b) => b.שלילי / b.total - a.שלילי / a.total)[0]

  return (
    <div className="px-4 py-6 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">מחקר שוק — אזכורי מתחרים ברשת</h1>
        <p className="mt-1 text-sm text-pink-200">
          {result.source === 'apify' ? (
            `נתונים אמיתיים מ-Apify (Reddit), נמשכו ב-${new Date(result.fetchedAt ?? '').toLocaleString('he-IL')}`
          ) : (
            <>
              נתוני דוגמה — למשיכה אמיתית מ-Apify הריצו:{' '}
              <code dir="ltr" className="rounded bg-pink-900 px-1.5 py-0.5 text-xs">
                APIFY_TOKEN=... npm run fetch:mentions
              </code>
            </>
          )}
        </p>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="סה״כ אזכורים" value={String(mentions.length)} accent={CATEGORICAL.blue} />
          <StatCard
            label="אזכורים שליליים"
            value={String(negativeCount)}
            sublabel="לקוחות שוקלים לעזוב — הזדמנות"
            accent={STATUS_COLORS.critical}
          />
          <StatCard
            label="המתחרה המדובר ביותר"
            value={topCompetitor?.competitor ?? '—'}
            sublabel={topCompetitor ? `${topCompetitor.total} אזכורים` : undefined}
            accent={CATEGORICAL.violet}
          />
          <StatCard
            label="הכי הרבה ביקורת"
            value={mostNegative?.competitor ?? '—'}
            sublabel={mostNegative ? `${Math.round((mostNegative.שלילי / mostNegative.total) * 100)}% שליליים` : undefined}
            accent={CATEGORICAL.orange}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-700">אזכורים לפי מתחרה וסנטימנט</h3>
          <p className="mt-0.5 text-xs text-slate-400">סיווג אוטומטי לפי מילות מפתח — אומדן ראשוני בלבד</p>
          <div className="mt-2 h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                <XAxis
                  dataKey="competitor"
                  tick={{ fill: INK.secondary, fontSize: 12 }}
                  axisLine={{ stroke: INK.axis }}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} hide />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.axis }}
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {SENTIMENTS.map((s) => (
                  <Bar key={s} dataKey={s} stackId="a" fill={SENTIMENT_COLOR[s]} maxBarSize={56}>
                    <LabelList dataKey={s} position="center" style={{ fill: '#fff', fontSize: 11 }} />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-slate-500" htmlFor="mention-search">
                חיפוש
              </label>
              <input
                id="mention-search"
                type="text"
                placeholder="כותרת, טקסט או קהילה..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1 w-56 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <Select label="מתחרה" value={competitor} onChange={setCompetitor} options={[ALL, ...competitors]} />
            <Select
              label="סנטימנט"
              value={sentiment}
              onChange={(v) => setSentiment(v as MentionSentiment | typeof ALL)}
              options={[ALL, ...SENTIMENTS]}
            />
            <div className="mr-auto text-sm text-slate-400">
              מציג {filtered.length} מתוך {mentions.length} אזכורים
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="px-2 py-2 font-medium">תאריך</th>
                  <th className="px-2 py-2 font-medium">מתחרה</th>
                  <th className="px-2 py-2 font-medium">פוסט</th>
                  <th className="px-2 py-2 font-medium">קהילה</th>
                  <th className="px-2 py-2 font-medium">סנטימנט</th>
                  <th className="px-2 py-2 font-medium">הצבעות</th>
                  <th className="px-2 py-2 font-medium">תגובות</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 align-top hover:bg-slate-50">
                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">{formatDate(m.createdAt)}</td>
                    <td className="px-2 py-2 text-slate-700">{m.competitor}</td>
                    <td className="max-w-md px-2 py-2" dir="auto">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-700 hover:underline"
                      >
                        {m.title || m.text.slice(0, 80)}
                      </a>
                      {m.text && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{m.text}</p>}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-slate-600" dir="ltr">
                      {m.community}
                    </td>
                    <td className="px-2 py-2">
                      <SentimentBadge sentiment={m.sentiment} />
                    </td>
                    <td className="px-2 py-2 text-slate-600">{m.upVotes}</td>
                    <td className="px-2 py-2 text-slate-600">{m.commentsCount}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-2 py-8 text-center text-slate-400">
                      לא נמצאו אזכורים
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
