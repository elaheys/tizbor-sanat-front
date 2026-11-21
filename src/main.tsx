import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AUTH_EXPIRED_EVENT } from '@/lib/axios'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'
import { router } from './router'
import './styles/index.css'

window.addEventListener(AUTH_EXPIRED_EVENT, () => {
  useAuthStore.getState().logout()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
