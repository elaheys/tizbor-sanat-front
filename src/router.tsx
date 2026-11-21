import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LoginPage } from "@/pages/Login/LoginPage";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";
import { TransactionsPage } from "@/pages/Transactions/TransactionsPage";
import { LedgerPage } from "@/pages/Ledger/LedgerPage";
import { MonthlyReportPage } from "@/pages/MonthlyReport/MonthlyReportPage";
import { CustomersPage } from "@/pages/Customers/CustomersPage";
import { CustomerDetailPage } from "@/pages/Customers/CustomerDetailPage";
import { InvoicesPage } from "@/pages/Invoices/InvoicesPage";
import { PartnersPage } from "@/pages/Partners/PartnersPage";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import { AdminRoute, ProtectedRoute } from "@/routes/ProtectedRoute";
import { paths } from "@/routes/paths";

export const router = createBrowserRouter([
  { path: paths.login, element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: paths.dashboard, element: <DashboardPage /> },
          { path: paths.transactions, element: <TransactionsPage /> },
          { path: paths.ledger, element: <LedgerPage /> },
          { path: paths.monthlyReport, element: <MonthlyReportPage /> },
          { path: paths.customers, element: <CustomersPage /> },
          { path: paths.customerDetail(":id"), element: <CustomerDetailPage /> },
          { path: paths.invoices, element: <InvoicesPage /> },
          { path: paths.settings, element: <SettingsPage /> },
          {
            element: <AdminRoute />,
            children: [{ path: paths.partners, element: <PartnersPage /> }],
          },
        ],
      },
    ],
  },
]);
