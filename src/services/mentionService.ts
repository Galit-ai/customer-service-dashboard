import rawItems from '../data/apifyMentions.json'
import type { ApifyRedditItem, Mention } from '../types/mention'
import { detectSentiment } from '../utils/mentions'

function normalize(item: ApifyRedditItem): Mention {
  return {
    id: item.id,
    url: item.url,
    brand: item.searchTerm,
    title: item.title,
    body: item.body,
    community: item.communityName,
    author: item.username,
    upvotes: item.upVotes,
    comments: item.numberOfComments,
    createdAt: item.createdAt,
    sentiment: detectSentiment(`${item.title} ${item.body}`),
  }
}

// נקודת החיבור ל-Apify: הקובץ src/data/apifyMentions.json מכיל פלט של Reddit Scraper.
// לרענון עם נתונים חיים: APIFY_TOKEN=... npm run fetch:apify
export async function getMentions(): Promise<Mention[]> {
  return (rawItems as ApifyRedditItem[]).map(normalize)
}
