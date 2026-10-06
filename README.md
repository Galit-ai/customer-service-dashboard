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

## מקור מידע חיצוני (API)

הדאשבורד מציג שערי חליפין (דולר, יורו, לירה שטרלינג מול שקל) לעזרה לנציגים בפניות תשלום והחזרים.
הנתונים מגיעים מ-[Frankfurter API](https://frankfurter.dev) — API ציבורי חינמי של שערי הבנק האירופי המרכזי, ללא טוקן ועם תמיכה ב-CORS.

- הקריאה נמצאת בשכבת השירות: `src/services/exchangeRateService.ts`
- התצוגה: `src/components/ExchangeRatesCard.tsx` (נטען בנפרד, ולכן כשל ב-API לא מפיל את שאר הדאשבורד)
