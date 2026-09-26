/** Format integer cents as a locale currency string. Default CAD to match the mock catalog. */
export function formatMoney(amountCents: number, currency = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(amountCents / 100)
}
