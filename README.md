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

> **שימו לב:** הפרויקט המשיך להתפתח בריפו [no-cable-customer-service](https://github.com/Galit-ai/no-cable-customer-service) (HTML + CSS + JavaScript רגיל, מחובר ל-Airtable). שם נמצאת הגרסה העדכנית והמלאה של מסך מחקר השוק, עם נתונים אמיתיים מ-Apify. הגרסה כאן (React) היא הגרסה הראשונה של המסך, עם נתוני דגימה בלבד.

## מסך מחקר שוק (Apify) — בונוס

הטאב "מחקר שוק (Apify)" מציג השוואת האזכורים ברשת של No Cable מול מתחרים (HOT, yes, Partner TV, Cellcom TV) ושירות סטרימינג (Netflix), מפייסבוק (תגובות לקוחות בדפי החברות): סנטימנט לפי חברה, מגמה שבועית והתגובות עם הכי הרבה מעורבות, עם סינון לפי חברה.

- הנתונים נאספים עם ה-Actors `apify/facebook-posts-scraper` ו-`apify/facebook-comments-scraper` של [Apify](https://www.apify.com).
- הקובץ `src/data/apifyMentions.json` מכיל כרגע **דגימת נתונים בפורמט הפלט של Apify** (לא נתונים חיים).
- לרענון עם נתונים אמיתיים: `APIFY_TOKEN=<הטוקן שלכם> npm run fetch:apify` (כתובות דפי הפייסבוק של המתחרים מוגדרות ב-`PAGES` בראש הסקריפט). הטוקן רץ רק מקומית ואינו נכנס לקוד הדפדפן.
- הסנטימנט מחושב בצד הלקוח לפי מילות מפתח (`src/utils/mentions.ts`) — פשוט במכוון, וניתן להחליף במודל.
- No Cable היא חברה בדיונית ולכן אין עבורה נתונים אמיתיים; הנתונים שלה בקובץ הם דגימה. הנתונים של המתחרים מתעדכנים בהרצת הסקריפט.
