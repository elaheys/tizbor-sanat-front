export interface Customer {
  id: number
  name: string
  phone: string | null
}

export interface CustomerAccountSummary {
  id: number
  customer_id: number
  total_amount: string
  description: string | null
  created_at: string
  paid_amount: string
}

export interface CustomerDetail extends Customer {
  accounts: CustomerAccountSummary[]
}

export interface CreateCustomerInput {
  name: string
  phone?: string
}

export interface UpdateCustomerInput {
  name?: string
  phone?: string
}

export interface CustomerPayment {
  id: number
  customer_account_id: number
  amount: string
  paid_at: string
}

export interface CustomerAccountDetail {
  id: number
  customer_id: number
  total_amount: string
  description: string | null
  created_at: string
  payments: CustomerPayment[]
  paid_amount: number
  remaining_balance: number
}

export interface CreateCustomerAccountInput {
  customer_id: number
  total_amount: number
  description?: string
}

export interface CreateCustomerPaymentInput {
  amount: number
  paid_at?: string
}

export interface CustomerOpenBalanceRow {
  customer_id: number
  customer_name: string
  phone: string | null
  account_id: number
  description: string | null
  total_amount: string
  paid_amount: string
  remaining_balance: string
}
