import api, { type RequestOptions } from "@/lib/axios";
import type {
  CreatePartnerInput,
  Partner,
  SetCredentialsInput,
  UpdatePartnerInput,
} from "@/types/partner";

const PREFIX = "/partners";

export const partnersApi = {
  list: (options?: RequestOptions) => api.get<Partner[]>(PREFIX, options),
  create: (data: CreatePartnerInput) => api.post<Partner>(PREFIX, data),
  update: (id: number, data: UpdatePartnerInput) => api.patch<Partner>(`${PREFIX}/${id}`, data),
  resetPassword: (id: number, new_password: string) =>
    api.patch<{ ok: true }>(`${PREFIX}/${id}/password`, { new_password }),
  setCredentials: (id: number, data: SetCredentialsInput) =>
    api.patch<Partner>(`${PREFIX}/${id}/credentials`, data),
  remove: (id: number) => api.delete<void>(`${PREFIX}/${id}`),
};
