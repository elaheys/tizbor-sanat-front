/** A fresh key per form submission attempt, so a retried request is never recorded twice. */
export function newIdempotencyKey(): string {
  return crypto.randomUUID()
}
