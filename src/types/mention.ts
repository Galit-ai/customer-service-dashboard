export type MentionSentiment = 'חיובי' | 'ניטרלי' | 'שלילי'

export interface Mention {
  id: string
  // המתחרה / המותג שאליו האזכור שייך (לפי מילת החיפוש שהביאה אותו)
  competitor: string
  platform: string
  community: string
  author: string
  title: string
  text: string
  url: string
  upVotes: number
  commentsCount: number
  createdAt: string
}

export type MentionsSource = 'apify' | 'sample'

export interface MentionsResult {
  mentions: Mention[]
  source: MentionsSource
  // מתי הנתונים נמשכו מ-Apify (רק כשהמקור הוא apify)
  fetchedAt: string | null
}
