export type Sentiment = 'חיובי' | 'ניטרלי' | 'שלילי'

// תגובה גולמית כפי שמוחזרת מ-Apify (Facebook Comments Scraper), לאחר הוספת שם החברה (pageName) —
// רק השדות שבהם משתמשים
export interface ApifyFacebookComment {
  id: string
  commentUrl: string
  postUrl: string
  profileName: string
  text: string
  date: string
  likesCount: number
  commentsCount: number
  pageName: string
}

// אזכור מנורמל לשימוש הדאשבורד
export interface Mention {
  id: string
  url: string
  brand: string
  text: string
  author: string
  likes: number
  replies: number
  createdAt: string
  sentiment: Sentiment
}
