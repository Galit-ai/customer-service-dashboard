import { mockMentions } from '../data/mockMentions'
import type { Mention, MentionsResult } from '../types/mention'

interface MentionsFile {
  fetchedAt: string
  mentions: Mention[]
}

// הנתונים האמיתיים נמשכים מ-Apify ע"י scripts/fetch-apify-mentions.mjs ונשמרים ב-public/data/mentions.json.
// הטוקן של Apify לא מגיע לדפדפן. אם הקובץ לא קיים (עדיין לא הורץ הסקריפט) — מוצגים נתוני דוגמה.
export async function getMentions(): Promise<MentionsResult> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/mentions.json`)
    if (response.ok) {
      const file = (await response.json()) as MentionsFile
      if (Array.isArray(file.mentions) && file.mentions.length > 0) {
        return { mentions: file.mentions, source: 'apify', fetchedAt: file.fetchedAt }
      }
    }
  } catch {
    // נופלים לנתוני הדוגמה
  }
  return { mentions: mockMentions, source: 'sample', fetchedAt: null }
}
