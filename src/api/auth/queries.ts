import { useMutation } from '@tanstack/react-query'
import { authApi, type ChangePasswordInput, type LoginInput } from './index'
import { useAuthStore } from '@/store/authStore'

export const useLogin = () => {
  const login = useAuthStore((state) => state.login)
  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (res) => {
      login(res.data.token, res.data.partner)
    },
  })
}

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
  })
