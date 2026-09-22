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

interface SubjectTemplate {
  subject: string
  description: string
}

const SUBJECTS_BY_CATEGORY: Record<TicketCategory, readonly SubjectTemplate[]> = {
  'בעיות תשלום': [
    {
      subject: 'חיוב כפול בכרטיס האשראי',
      description:
        'הלקוח דיווח כי חויב פעמיים עבור אותה הזמנה באותו יום. יש לבדוק ביומן הסליקה ולבצע זיכוי על החיוב הכפול.',
    },
    {
      subject: 'התשלום לא עבר בהזמנה',
      description:
        'בעת ביצוע ההזמנה התקבלה שגיאה מספק הסליקה וההזמנה לא הושלמה, אך הלקוח מדווח שנוכה סכום מהכרטיס.',
    },
    {
      subject: 'בקשה לחשבונית מתוקנת',
      description:
        'הלקוח מבקש לתקן פרט שגוי בחשבונית שהופקה (שם חברה / מספר עוסק) ולהנפיק חשבונית מעודכנת.',
    },
    {
      subject: 'שאלה לגבי חיוב חודשי',
      description: 'הלקוח אינו מזהה את סכום החיוב החודשי בדף האשראי ומבקש פירוט של הרכיבים הכלולים בו.',
    },
  ],
  'תמיכה טכנית': [
    {
      subject: 'האפליקציה קורסת בעת התחברות',
      description:
        'האפליקציה נסגרת מיד לאחר הזנת פרטי ההתחברות, לפני טעינת המסך הראשי. מתרחש במכשירי iOS ו-Android כאחד.',
    },
    {
      subject: 'לא מצליח לאפס סיסמה',
      description: 'הלינק לאיפוס סיסמה שנשלח למייל אינו נטען, או שמופיעה שגיאה בעת הזנת הסיסמה החדשה.',
    },
    {
      subject: 'שגיאה בטעינת הדשבורד',
      description: 'הדשבורד נתקע במסך טעינה (loading) ואינו מציג נתונים, לרוב בכניסה הראשונה ביום.',
    },
    {
      subject: 'בעיית סנכרון נתונים',
      description:
        'נתונים שעודכנו באפליקציית הנייד אינם מופיעים בגרסת הדסקטופ (והפך) — פער של כמה שעות בסנכרון.',
    },
  ],
  'החזרים': [
    {
      subject: 'בקשה לביטול הזמנה והחזר כספי',
      description: 'הלקוח מבקש לבטל הזמנה שטרם נשלחה ולקבל החזר מלא לאמצעי התשלום המקורי.',
    },
    {
      subject: 'המוצר הוחזר אך ההחזר לא התקבל',
      description:
        'הלקוח שלח את המוצר בחזרה (קיים אישור מסירה) לפני למעלה משבוע, אך טרם קיבל זיכוי לכרטיס האשראי.',
    },
    {
      subject: 'שאלה על מדיניות החזרים',
      description: 'הלקוח מבקש הבהרה לגבי חלון הזמן להחזרה ותנאי הזכאות למוצר שנרכש במבצע.',
    },
  ],
  'אחר': [
    {
      subject: 'שאלה כללית על השירות',
      description: 'פנייה כללית ללא בעיה ספציפית — הלקוח מבקש מידע נוסף על השירותים הקיימים.',
    },
    {
      subject: 'משוב על חוויית שימוש',
      description: 'הלקוח משתף חוויה (חיובית או שלילית) משימוש באתר/באפליקציה, ללא בקשה לפעולה מיידית.',
    },
    {
      subject: 'בקשה לעדכון פרטי חשבון',
      description: 'הלקוח מבקש לעדכן פרטים אישיים בחשבון — כתובת מייל, מספר טלפון או כתובת למשלוח.',
    },
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

// "עכשיו" קבוע עבור נתוני הדוגמה, כך שמדדים כמו "הגיעו היום" יהיו יציבים
export const MOCK_NOW = new Date('2026-09-22T12:00:00Z')
const NOW = MOCK_NOW

function generateTickets(): Ticket[] {
  const tickets: Ticket[] = []

  for (let i = 0; i < TICKET_COUNT; i++) {
    const category = pick(CATEGORIES)
    const template = pick(SUBJECTS_BY_CATEGORY[category])
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
      subject: template.subject,
      description: template.description,
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
