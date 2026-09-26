/**
 * browseIcons — presentation-only slug → Lucide icon for category and cuisine tiles.
 * Not a domain field; photos can replace this later.
 */
import {
  Beef,
  Bike,
  Coffee,
  Fish,
  Flame,
  IceCreamCone,
  PawPrint,
  Pizza,
  Salad,
  ShoppingBag,
  ShoppingCart,
  Soup,
  Store,
  Utensils,
  Wine,
  type LucideIcon,
} from 'lucide-react'

const BY_SLUG: Record<string, LucideIcon> = {
  food: Utensils,
  grocery: ShoppingCart,
  convenience: ShoppingBag,
  alcohol: Wine,
  pickup: Bike,
  retail: Store,
  pets: PawPrint,
  sushi: Fish,
  pizza: Pizza,
  burgers: Beef,
  mexican: Flame,
  indian: Soup,
  coffee: Coffee,
  healthy: Salad,
  dessert: IceCreamCone,
}

export const FEATURED_CATEGORY_SLUGS = ['food', 'grocery', 'convenience'] as const

export function browseIcon(slug: string): LucideIcon {
  return BY_SLUG[slug] ?? Utensils
}

export function isFeaturedCategory(slug: string): boolean {
  return (FEATURED_CATEGORY_SLUGS as readonly string[]).includes(slug)
}
