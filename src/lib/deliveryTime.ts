export function formatDeliveryTime(min: number, max: number): string {
  return min === max ? `~${min} min` : `${min}–${max} min`
}
