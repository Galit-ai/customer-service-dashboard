// מושך אזכורי מתחרים מ-Reddit דרך Apify וכותב אותם ל-public/data/mentions.json.
// הטוקן נשאר בצד השרת/המחשב בלבד (משתנה סביבה) ולא נכנס לקוד הדפדפן.
//
// שימוש:
//   APIFY_TOKEN=xxxx npm run fetch:mentions
//
// אפשר לשנות את המתחרים עם COMPETITORS="Zendesk,Freshdesk,Intercom"
// ואת ה-Actor עם APIFY_ACTOR (ברירת מחדל: trudax/reddit-scraper-lite).

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const token = process.env.APIFY_TOKEN
if (!token) {
  console.error('חסר APIFY_TOKEN. את הטוקן מקבלים ב-https://console.apify.com/settings/integrations')
  process.exit(1)
}

const actor = (process.env.APIFY_ACTOR ?? 'trudax/reddit-scraper-lite').replace('/', '~')
const competitors = (process.env.COMPETITORS ?? 'Zendesk,Freshdesk,Intercom')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean)
const maxItems = Number(process.env.MAX_ITEMS ?? 30)

async function fetchCompetitor(competitor) {
  const url = `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${token}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      searches: [competitor],
      searchPosts: true,
      searchComments: false,
      sort: 'new',
      maxItems,
      maxPostCount: maxItems,
      proxy: { useApifyProxy: true },
    }),
  })
  if (!response.ok) {
    throw new Error(`Apify החזיר ${response.status} עבור "${competitor}": ${await response.text()}`)
  }
  const items = await response.json()
  return items.map((item) => normalize(item, competitor))
}

function normalize(item, competitor) {
  return {
    id: String(item.id ?? item.url),
    competitor,
    platform: 'Reddit',
    community: item.communityName ?? item.parsedCommunityName ?? '',
    author: item.username ?? '',
    title: item.title ?? '',
    text: (item.body ?? '').slice(0, 600),
    url: item.url ?? '',
    upVotes: Number(item.upVotes ?? 0),
    commentsCount: Number(item.numberOfComments ?? 0),
    createdAt: item.createdAt ?? new Date().toISOString(),
  }
}

const results = []
for (const competitor of competitors) {
  console.log(`מושך אזכורים של ${competitor}...`)
  results.push(...(await fetchCompetitor(competitor)))
}

const unique = [...new Map(results.map((m) => [m.id, m])).values()]
const output = { fetchedAt: new Date().toISOString(), actor, mentions: unique }

const outFile = resolve(dirname(fileURLToPath(import.meta.url)), '../public/data/mentions.json')
await mkdir(dirname(outFile), { recursive: true })
await writeFile(outFile, JSON.stringify(output, null, 2))
console.log(`נשמרו ${unique.length} אזכורים ב-${outFile}`)
