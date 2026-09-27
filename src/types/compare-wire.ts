/** Wire shape from POST /v1/compare (matches OpenAPI + Go json tags). */

export interface CompareMoneyWire {
  amount_cents: number
  currency: string
}

export interface CompareFeeWire {
  kind: string
  amount: CompareMoneyWire
}

export interface CompareDiscountWire {
  scope: string
  label: string
  amount: CompareMoneyWire
}

export interface ComparePathRankWire {
  purchase_option_id: string
  rank: number
  kind: string
  headline: string
  confidence: string
  all_in: CompareMoneyWire
  fulfillment_mode: string
  delivery_executor?: string
  channel_id: string
  rationale_bullets?: string[]
  provider_id?: string
  provider_name?: string
  restaurant_id?: string
  menu_item_id?: string
  item_name?: string
  item_subtotal?: CompareMoneyWire
  fees?: CompareFeeWire[]
  discounts?: CompareDiscountWire[]
  delivery_cost?: CompareMoneyWire
  service_fee?: CompareMoneyWire
  eta_minutes?: number
  handoff_url?: string
}

export interface CompareUnavailableWire {
  purchase_option_id: string
  code: string
  message: string
}

export interface CompareResponseWire {
  compare_session_id?: string
  observed_at?: string
  recommendation?: ComparePathRankWire
  runners_up?: ComparePathRankWire[]
  unavailable_paths?: CompareUnavailableWire[]
}
