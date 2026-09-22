import { mockTickets } from '../data/mockTickets'
import type { Ticket } from '../types/ticket'

// נקודת החיבור העתידית ל-API אמיתי: יש להחליף כאן את המימוש הפנימי בלבד.
export async function getTickets(): Promise<Ticket[]> {
  return mockTickets
}
