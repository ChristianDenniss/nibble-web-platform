/**
 * comparePrefOptions — labels for the Default preferences controls, keyed to the backend's
 * fulfillment modes, channel IDs, and membership slugs (see nibble-local-dev seed/global.sql).
 */
import { Car, ShoppingBag, Store, Truck, type LucideIcon } from 'lucide-react'

export interface FulfillmentOption {
  mode: string
  label: string
  hint: string
  icon: LucideIcon
}

export const FULFILLMENT_OPTIONS: FulfillmentOption[] = [
  { mode: 'delivery', label: 'Delivery', hint: 'Brought to your door', icon: Truck },
  { mode: 'pickup', label: 'Pickup', hint: 'Order ahead, grab it', icon: ShoppingBag },
  { mode: 'drive_thru', label: 'Drive-thru', hint: 'Order from the lane', icon: Car },
  { mode: 'in_store', label: 'In store', hint: 'Walk in and order', icon: Store },
]

export interface ChannelOption {
  channelId: string
  label: string
}

export const APP_CHANNELS: ChannelOption[] = [
  { channelId: 'ch_skip', label: 'Skip' },
  { channelId: 'ch_doordash', label: 'DoorDash' },
  { channelId: 'ch_ubereats', label: 'Uber Eats' },
  { channelId: 'ch_instacart', label: 'Instacart' },
  { channelId: 'ch_grubhub', label: 'Grubhub' },
  { channelId: 'ch_fantuan', label: 'Fantuan' },
]

export const DIRECT_CHANNELS: ChannelOption[] = [
  { channelId: 'ch_merchant_web', label: 'Restaurant websites and apps' },
  { channelId: 'ch_phone', label: 'Calling the restaurant' },
]

export interface MembershipOption {
  slug: string
  label: string
  provider: string
}

export const MEMBERSHIP_OPTIONS: MembershipOption[] = [
  { slug: 'dashpass', label: 'DashPass', provider: 'DoorDash' },
  { slug: 'skip-plus', label: 'Skip+', provider: 'Skip' },
  { slug: 'uber-one', label: 'Uber One', provider: 'Uber Eats' },
  { slug: 'instacart-plus', label: 'Instacart+', provider: 'Instacart' },
  { slug: 'grubhub-plus', label: 'Grubhub+', provider: 'Grubhub' },
]
