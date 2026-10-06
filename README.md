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

## מסך מחקר שוק (Apify)

הלשונית "מחקר שוק (Apify)" מציגה אזכורי מתחרים (Zendesk, Freshdesk, Intercom) מ-Reddit, עם סיווג סנטימנט, גרף וטבלה מסוננת.

- הנתונים נמשכים מ-[Apify](https://www.apify.com) (Actor: `trudax/reddit-scraper-lite`) ע"י סקריפט, ונשמרים ב-`public/data/mentions.json`.
- הטוקן נשאר בצד המחשב/שרת בלבד ולא נכנס לקוד הדפדפן.
- בלי הקובץ — המסך מציג נתוני דוגמה.

```
APIFY_TOKEN=xxxx npm run fetch:mentions
COMPETITORS="Zendesk,Freshdesk" MAX_ITEMS=50 APIFY_TOKEN=xxxx npm run fetch:mentions
```

טוקן מקבלים ב-https://console.apify.com/settings/integrations
