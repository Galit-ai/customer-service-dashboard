import type { Mention, Sentiment } from '../types/mention'

const POSITIVE = [
  'love', 'great', 'excellent', 'recommend', 'best', 'easy', 'delightful', 'impressive',
  'happy', 'smooth', 'fast', 'solid', 'clean', 'improved', 'saved', 'good transparency', 'useful',
]
const NEGATIVE = [
  'expensive', 'terrible', 'awful', 'hate', 'slow', 'outage', 'crash', 'bug', 'broken',
  'frustrating', 'disappointing', 'mess', 'confusing', 'unhelpful', 'annoying', 'surprise', 'lacks', 'missing',
]

// ניתוח סנטימנט פשוט מבוסס מילות מפתח — מספיק להדגמה; ניתן להחליף במודל אמיתי
export function detectSentiment(text: string): Sentiment {
  const lower = text.toLowerCase()
  const score =
    POSITIVE.filter((w) => lower.includes(w)).length - NEGATIVE.filter((w) => lower.includes(w)).length
  if (score > 0) return 'חיובי'
  if (score < 0) return 'שלילי'
  return 'ניטרלי'
}

export const SENTIMENTS: Sentiment[] = ['חיובי', 'ניטרלי', 'שלילי']

export interface BrandSentimentRow {
  brand: string
  total: number
  חיובי: number
  ניטרלי: number
  שלילי: number
}

export function brandSentiment(mentions: Mention[]): BrandSentimentRow[] {
  const rows = new Map<string, BrandSentimentRow>()
  for (const m of mentions) {
    const row = rows.get(m.brand) ?? { brand: m.brand, total: 0, חיובי: 0, ניטרלי: 0, שלילי: 0 }
    row.total += 1
    row[m.sentiment] += 1
    rows.set(m.brand, row)
  }
  return [...rows.values()].sort((a, b) => b.total - a.total)
}

export function weeklyTrend(mentions: Mention[]) {
  const buckets = new Map<string, number>()
  for (const m of mentions) {
    const d = new Date(m.createdAt)
    d.setUTCHours(0, 0, 0, 0)
    d.setUTCDate(d.getUTCDate() - d.getUTCDay()) // תחילת השבוע (יום א')
    const key = d.toISOString().slice(0, 10)
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, count]) => ({ week: week.slice(5).split('-').reverse().join('/'), count }))
}

export function engagement(m: Mention): number {
  return m.upvotes + m.comments * 2
}
