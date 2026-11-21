import { BookUser, FileSpreadsheet, FileText, LayoutDashboard, Receipt, Settings, Users, Wallet } from 'lucide-react'
import type { ComponentType } from 'react'
import { paths } from '@/routes/paths'
import type { PartnerRole } from '@/types/partner'

export interface NavItem {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  adminOnly?: boolean
}

export const navItems: NavItem[] = [
  { label: 'داشبورد', to: paths.dashboard, icon: LayoutDashboard },
  { label: 'تراکنش‌ها', to: paths.transactions, icon: Receipt },
  { label: 'قرض و تسویه', to: paths.ledger, icon: Wallet },
  { label: 'گزارش ماهانه', to: paths.monthlyReport, icon: FileText },
  { label: 'مشتریان', to: paths.customers, icon: BookUser },
  { label: 'فاکتورها', to: paths.invoices, icon: FileSpreadsheet },
  { label: 'شرکا', to: paths.partners, icon: Users, adminOnly: true },
  { label: 'تنظیمات', to: paths.settings, icon: Settings },
]

export function navItemsForRole(role: PartnerRole): NavItem[] {
  return navItems.filter((item) => !item.adminOnly || role === 'admin')
}
