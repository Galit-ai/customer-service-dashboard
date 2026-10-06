// אוסף תגובות לקוחות מדפי הפייסבוק הציבוריים של החברות, דרך Apify, ושומר ל-src/data/apifyMentions.json
// שלב 1: apify/facebook-posts-scraper — הפוסטים האחרונים בכל דף
// שלב 2: apify/facebook-comments-scraper — התגובות לפוסטים (שם נמצא הסנטימנט של הלקוחות)
// שימוש: APIFY_TOKEN=xxx npm run fetch:apify
// הטוקן נשאר מקומי ואינו נכנס לקוד הדפדפן.
import { writeFileSync } from 'node:fs'

const token = process.env.APIFY_TOKEN
if (!token) {
  console.error('חסר APIFY_TOKEN (ניתן להשיג ב-https://console.apify.com/account/integrations)')
  process.exit(1)
}

// חשוב: עדכנו את הכתובות לדפי הפייסבוק הרשמיים בפועל (הכתובות כאן הן ניחוש ולא אומתו)
const PAGES = {
  'No Cable': 'https://www.facebook.com/nocable',
  HOT: 'https://www.facebook.com/HOT.net.il',
  yes: 'https://www.facebook.com/yestv.co.il',
  'Partner TV': 'https://www.facebook.com/PartnerIL',
  'Cellcom TV': 'https://www.facebook.com/cellcom.tv',
  Netflix: 'https://www.facebook.com/NetflixIsrael',
}
const POSTS_PER_PAGE = 5
const COMMENTS_PER_POST = 20

async function runActor(actor, input) {
  const url = `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${token}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`${actor} החזיר ${res.status}: ${await res.text()}`)
  return res.json()
}

const all = []
for (const [brand, pageUrl] of Object.entries(PAGES)) {
  console.log(`${brand}: מביא פוסטים...`)
  const posts = await runActor('apify~facebook-posts-scraper', {
    startUrls: [{ url: pageUrl }],
    resultsLimit: POSTS_PER_PAGE,
  })
  const postUrls = posts.map((p) => p.url).filter(Boolean)
  if (!postUrls.length) continue

  console.log(`${brand}: מביא תגובות ל-${postUrls.length} פוסטים...`)
  const comments = await runActor('apify~facebook-comments-scraper', {
    startUrls: postUrls.map((url) => ({ url })),
    resultsLimit: COMMENTS_PER_POST,
  })
  for (const [i, c] of comments.entries()) {
    all.push({
      id: c.id ?? `${brand}-${i}`,
      commentUrl: c.commentUrl ?? c.facebookUrl ?? c.postUrl,
      postUrl: c.postUrl ?? c.facebookUrl,
      profileName: c.profileName ?? 'משתמש',
      text: c.text ?? '',
      date: c.date,
      likesCount: Number(c.likesCount ?? 0),
      commentsCount: Number(c.commentsCount ?? 0),
      pageName: brand,
    })
  }
}

writeFileSync('src/data/apifyMentions.json', JSON.stringify(all.filter((c) => c.text), null, 2) + '\n')
console.log(`נשמרו ${all.length} תגובות`)
