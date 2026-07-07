export interface Tenant {
  id: string
  name: string
  cnpj: string
  phone: string
  email: string
  logo_url: string
  plan: 'basic' | 'premium' | 'unlimited'
  status: 'active' | 'blocked' | 'trial'
  createdAt: string
}

export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'agent'
  avatar_url: string
  createdAt: string
  lastLogin: string
}

export interface Lead {
  id: string
  tenantId: string
  name: string
  phone: string
  email: string
  source: 'whatsapp' | 'website' | 'manual' | 'referral'
  status: 'new' | 'qualified' | 'budget_sent' | 'negotiation' | 'closed' | 'lost'
  score: number
  assignedTo: string
  origin_city: string
  destination_city: string
  travel_date: string
  budget: number
  notes: string
  lastContact: string
  createdAt: string
  updatedAt: string
}

export interface Deal {
  id: string
  tenantId: string
  leadId: string
  stage: string
  value: number
  services: Service[]
  commission_value: number
  status: 'open' | 'won' | 'lost'
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  type: 'flight' | 'hotel' | 'package' | 'transfer' | 'insurance'
  supplier: string
  description: string
  cost_price: number
  sale_price: number
  commission_pct: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface Booking {
  id: string
  tenantId: string
  dealId: string
  traveler_data: TravelerData
  services: Service[]
  total: number
  commission_total: number
  payment_status: 'pending' | 'partial' | 'paid'
  issuance_status: 'pending' | 'issued' | 'cancelled'
  voucher_url: string
  createdAt: string
}

export interface TravelerData {
  name: string
  email: string
  phone: string
  document: string
  birth_date: string
  emergency_contact: string
}

export interface Payment {
  id: string
  tenantId: string
  type: 'in' | 'out'
  category: 'commission' | 'refund' | 'fee' | 'supplier'
  amount: number
  due_date: string
  paid_date: string
  status: 'pending' | 'paid' | 'overdue'
  supplier_id: string
  booking_id: string
  description: string
  createdAt: string
}

export interface Message {
  id: string
  role: 'customer' | 'agent' | 'ai'
  content: string
  timestamp: string
  metadata?: {
    intent?: string
    sentiment?: number
    score?: number
  }
}

export interface ChatSession {
  id: string
  tenantId: string
  customer_phone: string
  customer_name: string
  status: 'open' | 'closed' | 'transferred'
  messages: Message[]
  context: {
    last_intent: string
    qualified: boolean
    travel_prefs: Record<string, unknown>
  }
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export interface PipelineStage {
  id: string
  name: string
  order: number
  color: string
}

export interface Plan {
  id: string
  name: string
  price: number
  max_users: number
  max_leads_per_month: number
  features: string[]
  is_active: boolean
}
