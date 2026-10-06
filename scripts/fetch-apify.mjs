// מריץ Actor של Apify (Reddit Scraper Lite) ושומר את התוצאות ל-src/data/apifyMentions.json
// שימוש: APIFY_TOKEN=xxx npm run fetch:apify [מותג1 מותג2 ...]
// הטוקן נשאר בצד השרת/המחשב המקומי ואינו נכנס לקוד הדפדפן.
import { writeFileSync } from 'node:fs'

const token = process.env.APIFY_TOKEN
if (!token) {
  console.error('חסר APIFY_TOKEN (ניתן להשיג ב-https://console.apify.com/account/integrations)')
  process.exit(1)
}

const brands = process.argv.slice(2)
const searches = brands.length ? brands : ['Zendesk', 'Freshdesk', 'Intercom', 'Help Scout']
const ACTOR = 'trudax~reddit-scraper-lite'

const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${token}`
const all = []
for (const term of searches) {
  console.log(`מביא אזכורים של ${term}...`)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      searches: [term],
      searchPosts: true,
      searchComments: false,
      sort: 'new',
      maxItems: 25,
      proxy: { useApifyProxy: true },
    }),
  })
  if (!res.ok) throw new Error(`Apify החזיר ${res.status}: ${await res.text()}`)
  const items = await res.json()
  all.push(...items.filter((i) => i.dataType === 'post').map((i) => ({ ...i, searchTerm: term })))
}

writeFileSync('src/data/apifyMentions.json', JSON.stringify(all, null, 2) + '\n')
console.log(`נשמרו ${all.length} אזכורים`)
