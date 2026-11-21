import api from "@/lib/axios";
import type { AuthPartner } from "@/types/partner";

const PREFIX = "/auth";

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  partner: AuthPartner;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

export const authApi = {
  login: (data: LoginInput) => api.post<LoginResponse>(`${PREFIX}/login`, data),
  changePassword: (data: ChangePasswordInput) =>
    api.patch<{ ok: true }>(`${PREFIX}/password`, data),
};
