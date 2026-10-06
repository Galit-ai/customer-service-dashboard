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

הטאב "מחקר שוק (Apify)" מציג השוואת האזכורים ברשת של No Cable מול מתחרים (HOT, yes, Partner TV, Cellcom TV) ושירות סטרימינג (Netflix), מפייסבוק (תגובות לקוחות בדפי החברות): סנטימנט לפי חברה, מגמה שבועית והתגובות עם הכי הרבה מעורבות, עם סינון לפי חברה.

- הנתונים נאספים עם ה-Actors `apify/facebook-posts-scraper` ו-`apify/facebook-comments-scraper` של [Apify](https://www.apify.com).
- הקובץ `src/data/apifyMentions.json` מכיל כרגע **דגימת נתונים בפורמט הפלט של Apify** (לא נתונים חיים).
- לרענון עם נתונים אמיתיים: `APIFY_TOKEN=<הטוקן שלכם> npm run fetch:apify` (כתובות דפי הפייסבוק מוגדרות ב-`PAGES` בראש הסקריפט ויש לאמת אותן). הטוקן רץ רק מקומית ואינו נכנס לקוד הדפדפן.
- הסנטימנט מחושב בצד הלקוח לפי מילות מפתח (`src/utils/mentions.ts`) — פשוט במכוון, וניתן להחליף במודל.
