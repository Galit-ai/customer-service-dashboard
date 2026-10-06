import type { Mention, MentionSentiment } from '../types/mention'

// סיווג סנטימנט פשוט לפי מילות מפתח — מספיק למחקר שוק ראשוני, לא תחליף למודל שפה
const POSITIVE = [
  'love', 'great', 'amazing', 'excellent', 'recommend', 'helpful', 'easy', 'best', 'happy', 'works well',
  'אוהב', 'מעולה', 'מצוין', 'ממליץ', 'שימושי',
]
const NEGATIVE = [
  'hate', 'terrible', 'awful', 'expensive', 'slow', 'buggy', 'bug', 'worst', 'cancel', 'switch', 'switching',
  'frustrat', 'outage', 'price increase', 'overpriced', 'alternative', 'leaving', 'support is bad',
  'גרוע', 'יקר', 'איטי', 'מאכזב', 'עוזב', 'מבטל',
]

function countHits(haystack: string, words: string[]): number {
  return words.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0)
}

export function classifySentiment(mention: Pick<Mention, 'title' | 'text'>): MentionSentiment {
  const haystack = `${mention.title} ${mention.text}`.toLowerCase()
  const score = countHits(haystack, POSITIVE) - countHits(haystack, NEGATIVE)
  if (score > 0) return 'חיובי'
  if (score < 0) return 'שלילי'
  return 'ניטרלי'
}
