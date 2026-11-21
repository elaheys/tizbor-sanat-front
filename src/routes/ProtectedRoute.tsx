import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { paths } from './paths'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}

export function AdminRoute() {
  const partner = useAuthStore((state) => state.partner)

  if (partner?.role !== 'admin') {
    return <Navigate to={paths.dashboard} replace />
  }

  return <Outlet />
}
