/**
 * browseIcons — presentation-only slug → Lucide icon for category and cuisine tiles.
 * Not a domain field; photos can replace this later.
 */
import {
  Baby,
  Beef,
  Bike,
  Coffee,
  CookingPot,
  Croissant,
  Donut,
  Drumstick,
  EggFried,
  Fish,
  Flame,
  Flower2,
  Gift,
  IceCreamCone,
  Leaf,
  PawPrint,
  Pill,
  Pizza,
  Salad,
  Sandwich,
  ShoppingBag,
  ShoppingCart,
  Shrimp,
  Soup,
  Sparkles,
  Store,
  Utensils,
  Vegan,
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
  pharmacy: Pill,
  flowers: Flower2,
  baby: Baby,
  beauty: Sparkles,
  bakery: Croissant,
  gifts: Gift,
  sushi: Fish,
  pizza: Pizza,
  burgers: Beef,
  mexican: Flame,
  indian: Soup,
  coffee: Coffee,
  healthy: Salad,
  dessert: IceCreamCone,
  chinese: CookingPot,
  thai: Leaf,
  seafood: Shrimp,
  sandwiches: Sandwich,
  wings: Drumstick,
  breakfast: EggFried,
  vegan: Vegan,
  donuts: Donut,
}

export const FEATURED_CATEGORY_SLUGS = ['food', 'grocery', 'convenience'] as const

export function browseIcon(slug: string): LucideIcon {
  return BY_SLUG[slug] ?? Utensils
}

export function isFeaturedCategory(slug: string): boolean {
  return (FEATURED_CATEGORY_SLUGS as readonly string[]).includes(slug)
}
