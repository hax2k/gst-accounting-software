/**
 * A zero has no direction, so it never earns a semantic colour: `₹0.00` in
 * emerald under "Customers owe you" reads as good news that is not there.
 * Amounts arrive as decimal strings, so the comparison is numeric.
 */
export function moneyTone(
  value: number | string | null | undefined,
  toneClassName: string,
) {
  if (value === null || value === undefined) return 'text-foreground'
  const amount = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(amount) || amount === 0) return 'text-foreground'
  return toneClassName
}
