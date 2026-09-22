import type { Ticket, TicketCategory, TicketPriority, TicketStatus } from '../types/ticket'

// PRNG פשוט עם seed קבוע, כדי שנתוני הדוגמה יהיו זהים בכל טעינה
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(42)

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min
}

const CATEGORIES: readonly TicketCategory[] = ['בעיות תשלום', 'תמיכה טכנית', 'החזרים', 'אחר']

const SUBJECTS_BY_CATEGORY: Record<TicketCategory, readonly string[]> = {
  'בעיות תשלום': [
    'חיוב כפול בכרטיס האשראי',
    'התשלום לא עבר בהזמנה',
    'בקשה לחשבונית מתוקנת',
    'שאלה לגבי חיוב חודשי',
  ],
  'תמיכה טכנית': [
    'האפליקציה קורסת בעת התחברות',
    'לא מצליח לאפס סיסמה',
    'שגיאה בטעינת הדשבורד',
    'בעיית סנכרון נתונים',
  ],
  'החזרים': [
    'בקשה לביטול הזמנה והחזר כספי',
    'המוצר הוחזר אך ההחזר לא התקבל',
    'שאלה על מדיניות החזרים',
  ],
  'אחר': [
    'שאלה כללית על השירות',
    'משוב על חוויית שימוש',
    'בקשה לעדכון פרטי חשבון',
  ],
}

const PRIORITIES: readonly TicketPriority[] = ['נמוך', 'בינוני', 'גבוה']

const AGENTS = ['דנה כהן', 'יוסי לוי', 'מיכל אברהם', 'עומר דוד', 'שירה מזרחי'] as const

const CUSTOMER_FIRST_NAMES = [
  'נועה', 'איתי', 'רועי', 'ליאור', 'תמר', 'אורי', 'מאיה', 'גיל', 'הדר', 'עידן',
]
const CUSTOMER_LAST_NAMES = [
  'פרידמן', 'שפירא', 'גבע', 'רוזן', 'אזולאי', 'ברק', 'נחום', 'כץ', 'עמית', 'סגל',
]

function randomCustomerName(): string {
  return `${pick(CUSTOMER_FIRST_NAMES)} ${pick(CUSTOMER_LAST_NAMES)}`
}

function statusForTicket(): TicketStatus {
  const r = random()
  if (r < 0.35) return 'פתוח'
  if (r < 0.55) return 'בטיפול'
  return 'סגור'
}

const TICKET_COUNT = 70
const DAYS_BACK = 30
const NOW = new Date('2026-09-22T12:00:00Z')

function generateTickets(): Ticket[] {
  const tickets: Ticket[] = []

  for (let i = 0; i < TICKET_COUNT; i++) {
    const category = pick(CATEGORIES)
    const status = statusForTicket()
    const createdOffsetMinutes = randomInt(0, DAYS_BACK * 24 * 60)
    const createdAt = new Date(NOW.getTime() - createdOffsetMinutes * 60_000)

    // פנייה "פתוח" חדשה עשויה עדיין לא לקבל מענה ראשוני
    const hasFirstResponse = status !== 'פתוח' || random() < 0.6
    const firstResponseAt = hasFirstResponse
      ? new Date(createdAt.getTime() + randomInt(10, 240) * 60_000)
      : null

    const resolvedAt =
      status === 'סגור' && firstResponseAt
        ? new Date(firstResponseAt.getTime() + randomInt(30, 60 * 48) * 60_000)
        : null

    const csatScore = resolvedAt && random() < 0.7 ? randomInt(2, 5) : null

    tickets.push({
      id: `T-${1000 + i}`,
      subject: pick(SUBJECTS_BY_CATEGORY[category]),
      category,
      status,
      priority: pick(PRIORITIES),
      customerName: randomCustomerName(),
      assignedAgent: pick(AGENTS),
      createdAt: createdAt.toISOString(),
      firstResponseAt: firstResponseAt ? firstResponseAt.toISOString() : null,
      resolvedAt: resolvedAt ? resolvedAt.toISOString() : null,
      csatScore,
    })
  }

  return tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const mockTickets: Ticket[] = generateTickets()
