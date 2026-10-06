export type Sentiment = 'חיובי' | 'ניטרלי' | 'שלילי'

// פריט גולמי כפי שמוחזר מ-Apify (Reddit Scraper) — רק השדות שבהם משתמשים
export interface ApifyRedditItem {
  id: string
  url: string
  username: string
  title: string
  body: string
  communityName: string
  upVotes: number
  numberOfComments: number
  createdAt: string
  searchTerm: string
}

// אזכור מנורמל לשימוש הדאשבורד
export interface Mention {
  id: string
  url: string
  brand: string
  title: string
  body: string
  community: string
  author: string
  upvotes: number
  comments: number
  createdAt: string
  sentiment: Sentiment
}
