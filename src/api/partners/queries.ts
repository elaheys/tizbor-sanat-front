import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { partnersApi } from "./index";
import { queryClient } from "@/lib/queryClient";
import type { CreatePartnerInput, SetCredentialsInput, UpdatePartnerInput } from "@/types/partner";

const all = ["partners"] as const;

export const partnerQueries = {
  all,
  list: () =>
    queryOptions({
      queryKey: [...all, "list"],
      queryFn: ({ signal }) => partnersApi.list({ signal }).then((res) => res.data),
    }),
};

export const usePartners = () => useQuery(partnerQueries.list());

// Changing a partner's share percent or active status changes how the monthly report
// splits profit going forward, so it has to invalidate "reports" too, not just the
// partners list.
const invalidatePartners = () => {
  queryClient.invalidateQueries({ queryKey: partnerQueries.list().queryKey });
  queryClient.invalidateQueries({ queryKey: ["reports"] });
};

export const useCreatePartner = () =>
  useMutation({
    mutationFn: (data: CreatePartnerInput) => partnersApi.create(data),
    onSuccess: invalidatePartners,
  });

export const useUpdatePartner = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePartnerInput }) =>
      partnersApi.update(id, data),
    onSuccess: invalidatePartners,
  });

export const useResetPartnerPassword = () =>
  useMutation({
    mutationFn: ({ id, newPassword }: { id: number; newPassword: string }) =>
      partnersApi.resetPassword(id, newPassword),
  });

export const useSetPartnerCredentials = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: SetCredentialsInput }) =>
      partnersApi.setCredentials(id, data),
    onSuccess: invalidatePartners,
  });

export const useDeletePartner = () =>
  useMutation({
    mutationFn: (id: number) => partnersApi.remove(id),
    onSuccess: invalidatePartners,
  });
