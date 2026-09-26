import { useState } from 'react'
import { useChannelStores, type SourceStoreWire } from '@/hooks/source/useChannelStores'
import { useSourceMenu } from '@/hooks/source/useSourceMenu'

// Channels written by the curated ingest adapter; only ch_store and ch_skip carry demo stores today.
const CHANNELS = [
  { id: 'ch_store', label: 'Store app (demo)' },
  { id: 'ch_skip', label: 'SkipTheDishes' },
  { id: 'ch_doordash', label: 'DoorDash' },
  { id: 'ch_ubereats', label: 'Uber Eats' },
  { id: 'ch_instacart', label: 'Instacart' },
  { id: 'ch_grubhub', label: 'Grubhub' },
  { id: 'ch_fantuan', label: 'Fantuan' },
  { id: 'ch_merchant_web', label: 'Merchant website' },
]

const PATHS = [
  { id: 'pickup', label: 'Pickup', fulfillmentMode: 'pickup', deliveryExecutor: '' },
  { id: 'delivery_3p', label: 'Delivery (third party)', fulfillmentMode: 'delivery', deliveryExecutor: 'third_party' },
  { id: 'delivery_merchant', label: 'Delivery (merchant)', fulfillmentMode: 'delivery', deliveryExecutor: 'merchant' },
]

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(cents / 100)
}

export default function SourceMenuPage() {
  const [channelId, setChannelId] = useState(CHANNELS[0].id)
  const [pathId, setPathId] = useState(PATHS[0].id)
  const [selected, setSelected] = useState<SourceStoreWire | null>(null)
  const storesQuery = useChannelStores()
  const menu = useSourceMenu()

  const path = PATHS.find((p) => p.id === pathId) ?? PATHS[0]

  const loadStores = () => {
    setSelected(null)
    menu.clear()
    void storesQuery.load(channelId)
  }

  const openMenu = (store: SourceStoreWire) => {
    setSelected(store)
    void menu.load(store.id, path.fulfillmentMode, path.deliveryExecutor)
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-content-muted">Source catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight text-content">Browse by channel</h1>
        <p className="text-content-secondary">
          Lists stores with <code className="text-sm">GET /v1/channels/{'{channelId}'}/source-stores</code>, then
          loads one menu path with <code className="text-sm">GET /v1/source-stores/{'{storeId}'}/menu</code>. Data
          comes from the curated ingest adapter.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3 rounded-lg border border-border bg-surface p-4 max-small:grid-cols-1">
        <label className="grid gap-1 text-sm">
          Channel
          <select
            className="rounded border border-border px-3 py-2"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            {CHANNELS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Fulfillment path
          <select
            className="rounded border border-border px-3 py-2"
            value={pathId}
            onChange={(e) => setPathId(e.target.value)}
          >
            {PATHS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={storesQuery.loading}
          onClick={loadStores}
          className="rounded-md bg-brand px-4 py-2 font-medium text-brand-contrast disabled:opacity-50"
        >
          {storesQuery.loading ? 'Loading…' : 'List stores'}
        </button>
      </div>

      {storesQuery.error && <p className="text-sm text-red-600">{storesQuery.error}</p>}

      {storesQuery.stores && storesQuery.stores.length === 0 && (
        <p className="text-sm text-content-muted">No source stores ingested for this channel yet.</p>
      )}

      {storesQuery.stores && storesQuery.stores.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {storesQuery.stores.map((store) => (
            <li key={store.id}>
              <button
                type="button"
                onClick={() => openMenu(store)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm hover:bg-surface-inset ${
                  selected?.id === store.id ? 'font-semibold' : ''
                }`}
              >
                <span className="text-content">{store.name}</span>
                <span className="text-content-muted">{store.location.address || store.externalStoreId}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {menu.loading && <p className="text-sm text-content-muted">Loading menu…</p>}
      {menu.error && selected && (
        <p className="text-sm text-red-600">
          {selected.name} has no {path.label.toLowerCase()} menu ({menu.error}).
        </p>
      )}

      {menu.data && (
        <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
          <p className="font-medium text-content">{menu.data.store.name}</p>
          <p className="text-sm text-content-muted">
            {menu.data.menu.fulfillmentMode}
            {menu.data.menu.deliveryExecutor ? ` / ${menu.data.menu.deliveryExecutor}` : ''}
          </p>
          {menu.data.categories.map((c) => (
            <div key={c.category.id}>
              <h2 className="font-semibold text-content">{c.category.name}</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {c.items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-4">
                    <span>{it.name}</span>
                    <span className="text-content-muted">
                      {it.price.currency ? formatMoney(it.price.amountCents, it.price.currency) : '—'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
