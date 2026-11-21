import type { Partner } from '@/types/partner'

/**
 * Active partners only, for assigning NEW records (transactions/loans/invoices) —
 * a deactivated partner shouldn't be picked for new work. `currentId` keeps an
 * already-assigned partner visible when editing a record that references someone
 * who has since been deactivated, so the field doesn't end up pointing at a value
 * missing from its own option list.
 */
export function selectablePartners(partners: Partner[], currentId?: string): Partner[] {
  return partners.filter((p) => p.is_active || String(p.id) === currentId)
}
