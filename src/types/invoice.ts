export interface Invoice {
  id: number
  invoice_number: string | null
  customer_id: number | null
  partner_id: number
  transaction_id: number | null
  amount: string
  description: string | null
  issued_at: string
}

export interface InvoiceWithNames extends Invoice {
  customer_name: string | null
  partner_name: string
}

export interface InvoiceFilters {
  customer_id?: number
  partner_id?: number
  from?: string
  to?: string
}

export interface CreateInvoiceInput {
  customer_id?: number
  partner_id: number
  transaction_id?: number
  amount: number
  description?: string
}
