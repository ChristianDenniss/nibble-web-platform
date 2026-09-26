import { useSourceMenu } from '@/hooks/source/useSourceMenu'

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(cents / 100)
}

export default function SourceMenuPage() {
  const { load, loading, error, data } = useSourceMenu()

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-content-muted">Source catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight text-content">Menu browse</h1>
        <p className="text-content-secondary">
          Calls <code className="text-sm">GET /v1/source-stores/ss_store/menu</code> with{' '}
          <code className="text-sm">fulfillment_mode=pickup</code>. Uses compare demo seed data.
        </p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => load()}
        className="rounded-md bg-brand px-4 py-2 font-medium text-brand-contrast disabled:opacity-50"
      >
        {loading ? 'Loading…' : 'Load menu'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
          <p className="font-medium text-content">{data.store.name}</p>
          <p className="text-sm text-content-muted">
            {data.menu.fulfillmentMode}
            {data.menu.deliveryExecutor ? ` / ${data.menu.deliveryExecutor}` : ''}
          </p>
          {data.categories.map((c) => (
            <div key={c.category.id}>
              <h2 className="font-semibold text-content">{c.category.name}</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {c.items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-4">
                    <span>{it.name}</span>
                    <span className="text-content-muted">
                      {it.price.currency
                        ? formatMoney(it.price.amountCents, it.price.currency)
                        : '—'}
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
