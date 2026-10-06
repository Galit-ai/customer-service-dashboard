# Customer Service Dashboard

דאשבורד שירות לקוחות — פרויקט לימודי.

- אפיון מלא: ראו [SPEC.md](./SPEC.md)
- כללי עבודה: ראו [Practice.md](./Practice.md)

## הרצה מקומית

```
npm install
npm run dev
```

נבנה עם React + TypeScript + Vite + Tailwind CSS + Recharts.

## מסך מחקר שוק (Apify) — בונוס

הטאב "מחקר שוק (Apify)" מציג אזכורי מתחרים (Zendesk, Freshdesk, Intercom, Help Scout) מ-Reddit: סנטימנט לפי מתחרה, מגמה שבועית והפוסטים עם הכי הרבה מעורבות, עם סינון לפי מתחרה.

- הנתונים נאספים עם ה-Actor `trudax/reddit-scraper-lite` של [Apify](https://www.apify.com).
- הקובץ `src/data/apifyMentions.json` מכיל כרגע **דגימת נתונים בפורמט הפלט של Apify** (לא נתונים חיים).
- לרענון עם נתונים אמיתיים: `APIFY_TOKEN=<הטוקן שלכם> npm run fetch:apify` (אפשר להעביר שמות מותגים כארגומנטים). הטוקן רץ רק מקומית ואינו נכנס לקוד הדפדפן.
- הסנטימנט מחושב בצד הלקוח לפי מילות מפתח (`src/utils/mentions.ts`) — פשוט במכוון, וניתן להחליף במודל.
