export interface MonthlyPartnerReport {
  partner_id: number
  partner_name: string
  share_percent: number
  opening_balance: number
  profit_share: number
  net_loan_balance: number
  closing_balance: number
  cash_collected: number
  settlement_diff: number
}

export interface MonthlyTransfer {
  from_partner_id: number
  to_partner_id: number
  amount: number
  from_partner_name?: string
  to_partner_name?: string
}

export interface MonthlyReport {
  year: number
  month: number
  total_revenue: number
  total_expense: number
  profit: number
  partners: MonthlyPartnerReport[]
  needed_transfers: MonthlyTransfer[]
}

export interface MonthlyBalanceRow {
  id: number
  partner_id: number
  year: number
  month: number
  opening_balance: string
  profit_share: string
  closing_balance: string
  is_settled: boolean
}

export interface GeneratedSettlement {
  id: number
  from_partner_id: number
  to_partner_id: number
  amount: string
  type: 'profit_settlement'
  entry_date: string
  period_year: number
  period_month: number
  note: string | null
  is_settled: boolean
  settled_at: string | null
  created_at: string
  from_partner_name?: string
  to_partner_name?: string
}

export interface GenerateSettlementsResponse {
  already_generated: boolean
  settlements: GeneratedSettlement[]
}

export interface TransactionsSummaryRow {
  type: string
  count: number
  total: string
}

export interface DailyPartnerReport {
  partner_id: number
  partner_name: string
  revenue: number
  expense: number
  transaction_count: number
}

export interface DailyReport {
  date: string
  partners: DailyPartnerReport[]
  workshop_total: {
    revenue: number
    expense: number
    profit: number
    transaction_count: number
  }
}
