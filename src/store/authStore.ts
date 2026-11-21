import { create } from 'zustand'
import { authStorage } from '@/lib/authStorage'
import type { AuthPartner } from '@/types/partner'

const PARTNER_KEY = 'tizbor_auth_partner'

function readStoredPartner(): AuthPartner | null {
  const raw = localStorage.getItem(PARTNER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthPartner
  } catch {
    return null
  }
}

interface AuthState {
  partner: AuthPartner | null
  isAuthenticated: boolean
  login: (token: string, partner: AuthPartner) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  partner: readStoredPartner(),
  isAuthenticated: Boolean(authStorage.getToken() && readStoredPartner()),
  login: (token, partner) => {
    authStorage.setToken(token)
    localStorage.setItem(PARTNER_KEY, JSON.stringify(partner))
    set({ partner, isAuthenticated: true })
  },
  logout: () => {
    authStorage.clearToken()
    localStorage.removeItem(PARTNER_KEY)
    set({ partner: null, isAuthenticated: false })
  },
}))
