import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { customerAccountsApi, customersApi } from './index'
import { queryClient } from '@/lib/queryClient'
import type {
  CreateCustomerAccountInput,
  CreateCustomerInput,
  CreateCustomerPaymentInput,
  UpdateCustomerInput,
} from '@/types/customer'

const all = ['customers'] as const
const accountsAll = ['customer-accounts'] as const

export const customerQueries = {
  all,
  list: (q?: string) =>
    queryOptions({
      queryKey: [...all, 'list', q ?? ''],
      queryFn: ({ signal }) => customersApi.list(q, { signal }).then((res) => res.data),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...all, 'detail', id],
      queryFn: ({ signal }) => customersApi.get(id, { signal }).then((res) => res.data),
      enabled: Boolean(id),
    }),
}

export const customerAccountQueries = {
  all: accountsAll,
  detail: (id: number) =>
    queryOptions({
      queryKey: [...accountsAll, 'detail', id],
      queryFn: ({ signal }) => customerAccountsApi.get(id, { signal }).then((res) => res.data),
      enabled: Boolean(id),
    }),
}

export const useCustomers = (q?: string) => useQuery(customerQueries.list(q))
export const useCustomer = (id: number) => useQuery(customerQueries.detail(id))
export const useCustomerAccount = (id: number) => useQuery(customerAccountQueries.detail(id))

const invalidateCustomers = () => queryClient.invalidateQueries({ queryKey: all })

export const useCreateCustomer = () =>
  useMutation({
    mutationFn: (data: CreateCustomerInput) => customersApi.create(data),
    onSuccess: invalidateCustomers,
  })

export const useUpdateCustomer = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerInput }) => customersApi.update(id, data),
    onSuccess: invalidateCustomers,
  })

export const useDeleteCustomer = () =>
  useMutation({
    mutationFn: (id: number) => customersApi.delete(id),
    onSuccess: invalidateCustomers,
  })

export const useCreateCustomerAccount = () =>
  useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateCustomerAccountInput; idempotencyKey: string }) =>
      customerAccountsApi.create(data, idempotencyKey),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: [...all, 'detail', variables.data.customer_id] })
    },
  })

export const useAddCustomerPayment = () =>
  useMutation({
    mutationFn: ({
      accountId,
      data,
      idempotencyKey,
    }: {
      accountId: number
      data: CreateCustomerPaymentInput
      idempotencyKey: string
    }) => customerAccountsApi.addPayment(accountId, data, idempotencyKey),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: [...accountsAll, 'detail', variables.accountId] })
      queryClient.invalidateQueries({ queryKey: all })
    },
  })
