// מקור מידע חיצוני: Frankfurter API (שערי חליפין רשמיים של הבנק האירופי המרכזי).
// ציבורי, ללא מפתח/טוקן ועם תמיכה ב-CORS, ולכן אפשר לקרוא לו ישירות מהדפדפן.
// תיעוד: https://frankfurter.dev
const API_URL = 'https://api.frankfurter.dev/v1/latest'

export const FOREIGN_CURRENCIES = ['USD', 'EUR', 'GBP'] as const
export type ForeignCurrency = (typeof FOREIGN_CURRENCIES)[number]

export interface ExchangeRates {
  /** תאריך פרסום השערים (YYYY-MM-DD) */
  date: string
  /** כמה שקלים שווה יחידה אחת של כל מטבע */
  ilsPerUnit: Record<ForeignCurrency, number>
}

interface FrankfurterResponse {
  date: string
  rates: Record<string, number>
}

// ה-API מחזיר כמה יחידות של מטבע זר מקבלים עבור שקל אחד, ולכן הופכים את היחס.
export async function getExchangeRates(signal?: AbortSignal): Promise<ExchangeRates> {
  const url = `${API_URL}?base=ILS&symbols=${FOREIGN_CURRENCIES.join(',')}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Exchange rate API responded with ${res.status}`)

  const data = (await res.json()) as FrankfurterResponse
  const ilsPerUnit = {} as Record<ForeignCurrency, number>
  for (const code of FOREIGN_CURRENCIES) {
    const perShekel = data.rates[code]
    if (typeof perShekel !== 'number' || perShekel <= 0) {
      throw new Error(`Missing rate for ${code}`)
    }
    ilsPerUnit[code] = 1 / perShekel
  }
  return { date: data.date, ilsPerUnit }
}
