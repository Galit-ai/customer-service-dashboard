import { useEffect, useState } from 'react'
import {
  FOREIGN_CURRENCIES,
  getExchangeRates,
  type ExchangeRates,
} from '../services/exchangeRateService'
import { CATEGORICAL } from '../utils/colors'

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; rates: ExchangeRates }

const SYMBOLS = { USD: '$', EUR: '€', GBP: '£' } as const

const ACCENTS = [CATEGORICAL.blue, CATEGORICAL.violet, CATEGORICAL.aqua]

// כרטיס עזר לנציגים בפניות "בעיות תשלום" / "החזרים" של לקוחות שחויבו במטבע זר.
// נטען בנפרד מהפניות: כשל ב-API החיצוני לא מפיל את שאר הדאשבורד.
export function ExchangeRatesCard() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    getExchangeRates(controller.signal)
      .then((rates) => setState({ status: 'ready', rates }))
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error(err)
          setState({ status: 'error' })
        }
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">שערי חליפין לטיפול בפניות תשלום</h2>
        <span className="text-xs text-slate-400">מקור: Frankfurter API (ECB)</span>
      </div>

      {state.status === 'loading' && <p className="text-sm text-slate-500">טוען שערים...</p>}
      {state.status === 'error' && (
        <p className="text-sm text-red-600">לא ניתן לטעון שערי חליפין כרגע.</p>
      )}
      {state.status === 'ready' && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {FOREIGN_CURRENCIES.map((code, i) => (
              <div
                key={code}
                className="rounded-lg border border-slate-100 border-r-4 bg-slate-50 p-3"
                style={{ borderRightColor: ACCENTS[i] }}
              >
                <div className="text-sm text-slate-500">
                  {SYMBOLS[code]} 1 {code}
                </div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">
                  ₪{state.rates.ilsPerUnit[code].toFixed(3)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">שערים נכון ל-{state.rates.date}</p>
        </>
      )}
    </section>
  )
}
