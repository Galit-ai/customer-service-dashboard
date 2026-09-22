// פלטת צבעים מאומתת לנגישות (colorblind-safe), לשימוש עקבי בכל הגרפים

import type { TicketCategory } from '../types/ticket'

export const CATEGORICAL = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
  yellow: '#eda100',
  magenta: '#e87ba4',
  violet: '#4a3aa7',
} as const

export const STATUS_COLORS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
} as const

// מיפוי קבוע — צבע צמוד לזהות הקטגוריה, לא לדירוג שלה (כדי שסינון לא "יצבע מחדש" קטגוריות)
export const CATEGORY_COLOR_MAP: Record<TicketCategory, string> = {
  'בעיות תשלום': CATEGORICAL.blue,
  'תמיכה טכנית': CATEGORICAL.orange,
  'החזרים': CATEGORICAL.aqua,
  'אחר': CATEGORICAL.yellow,
}

export const INK = {
  primary: '#0b0b0b',
  secondary: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
} as const
