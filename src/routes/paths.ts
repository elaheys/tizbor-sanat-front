export const paths = {
  login: "/login",
  dashboard: "/",
  transactions: "/transactions",
  ledger: "/ledger",
  monthlyReport: "/reports/monthly",
  customers: "/customers",
  customerDetail: (id: number | string) => `/customers/${id}`,
  invoices: "/invoices",
  partners: "/partners",
  settings: "/settings",
} as const;
