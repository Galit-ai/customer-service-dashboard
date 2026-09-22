export type TicketStatus = 'פתוח' | 'בטיפול' | 'סגור'

export type TicketCategory = 'בעיות תשלום' | 'תמיכה טכנית' | 'החזרים' | 'אחר'

export type TicketPriority = 'נמוך' | 'בינוני' | 'גבוה'

export interface Ticket {
  id: string
  subject: string
  description: string
  category: TicketCategory
  status: TicketStatus
  priority: TicketPriority
  customerName: string
  assignedAgent: string
  createdAt: string
  firstResponseAt: string | null
  resolvedAt: string | null
  csatScore: number | null
}
