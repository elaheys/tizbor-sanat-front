import axios, { type AxiosRequestConfig } from 'axios'
import { authStorage } from './authStorage'

export const AUTH_EXPIRED_EVENT = 'tizbor:auth-expired'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && authStorage.getToken()) {
      authStorage.clearToken()
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    }
    return Promise.reject(error)
  },
)

export type RequestOptions = Pick<AxiosRequestConfig, 'signal'>

export default api
