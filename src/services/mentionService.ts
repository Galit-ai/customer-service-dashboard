import rawItems from '../data/apifyMentions.json'
import type { ApifyFacebookComment, Mention } from '../types/mention'
import { detectSentiment } from '../utils/mentions'

function normalize(item: ApifyFacebookComment): Mention {
  return {
    id: item.id,
    url: item.commentUrl,
    brand: item.pageName,
    text: item.text,
    author: item.profileName,
    likes: item.likesCount,
    replies: item.commentsCount,
    createdAt: item.date,
    sentiment: detectSentiment(item.text),
  }
}

// נקודת החיבור ל-Apify: הקובץ src/data/apifyMentions.json מכיל פלט של Facebook Comments Scraper.
// לרענון עם נתונים חיים: APIFY_TOKEN=... npm run fetch:apify
export async function getMentions(): Promise<Mention[]> {
  return (rawItems as ApifyFacebookComment[]).map(normalize)
}
