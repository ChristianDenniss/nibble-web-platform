import { useCompare } from '@/hooks/compare/useCompare'
import type { ComparePathRankWire } from '@/types/compare-wire'

const skipSampleItems = [
  { id: 'SQ-01', placeId: 'pl_skip_sq', dishId: 'dish_sq_01', label: 'The Squeeze · Roasted Root' },
  { id: 'SQ-02', placeId: 'pl_skip_sq', dishId: 'dish_sq_02', label: 'The Squeeze · Chicken Salad Sandwich' },
  { id: 'SQ-03', placeId: 'pl_skip_sq', dishId: 'dish_sq_03', label: 'The Squeeze · Spicy Kale Caesar' },
  { id: 'GR-01', placeId: 'pl_skip_gr', dishId: 'dish_gr_01', label: 'Greco Pizza · Small Garlic Fingers' },
  { id: 'GR-02', placeId: 'pl_skip_gr', dishId: 'dish_gr_02', label: 'Greco Pizza · Wings' },
  { id: 'GR-03', placeId: 'pl_skip_gr', dishId: 'dish_gr_03', label: 'Greco Pizza · Small Mighty Meaty Pizza' },
  { id: 'GI-01', placeId: 'pl_skip_gi', dishId: 'dish_gi_01', label: "Gisele's Pizzeria · 12-inch Pepperoni Pizza" },
  { id: 'GI-02', placeId: 'pl_skip_gi', dishId: 'dish_gi_02', label: "Gisele's Pizzeria · Wings" },
  { id: 'GI-03', placeId: 'pl_skip_gi', dishId: 'dish_gi_03', label: "Gisele's Pizzeria · 9-inch Garlic Cheese Fingers" },
  { id: 'RZ-01', placeId: 'pl_skip_rz', dishId: 'dish_rz_01', label: 'Razia Kitchen · Chicken Biryani' },
  { id: 'RZ-02', placeId: 'pl_skip_rz', dishId: 'dish_rz_02', label: 'Razia Kitchen · Beef Biryani' },
  { id: 'RZ-03', placeId: 'pl_skip_rz', dishId: 'dish_rz_03', label: 'Razia Kitchen · Lamb Curry' },
]

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(cents / 100)
}

function PathCard({ path, title }: { path: ComparePathRankWire; title: string }) {
  const missingQuote = path.rationale_bullets?.some((bullet) => bullet.includes('no recent quote observation')) ?? false
  return (
    <article className="rounded-lg border border-border bg-surface p-4 space-y-2">
      <h3 className="font-semibold text-content">{title}</h3>
      <p className="text-lg text-content">{path.headline}</p>
      <p className="text-content-secondary">
        {missingQuote ? 'Menu subtotal (delivery fees unavailable): ' : 'All-in: '}
        {formatMoney(path.all_in.amount_cents, path.all_in.currency)}
        {path.delivery_executor
          ? ` · ${path.fulfillment_mode} / ${path.delivery_executor}`
          : ` · ${path.fulfillment_mode}`}
      </p>
      <ul className="list-disc pl-5 text-sm text-content-muted">
        {path.rationale_bullets?.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </article>
  )
}

export default function ComparePage() {
  const { form, setForm, loading, error, result, runCompare } = useCompare()

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-content-muted">Meta-pricing</p>
        <h1 className="text-3xl font-semibold tracking-tight text-content">Compare paths</h1>
        <p className="text-content-secondary">
          Compare the latest stored Skip menu price for the selected Fredericton item. Prices refresh in the backend collector.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-border bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault()
          runCompare()
        }}
      >
        <label className="grid gap-1 text-sm">
          Place ID
          <input
            className="rounded border border-border px-3 py-2"
            value={form.placeId}
            onChange={(e) => setForm((f) => ({ ...f, placeId: e.target.value }))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Sample Skip item
          <select
            className="rounded border border-border px-3 py-2"
            value={skipSampleItems.find((item) => item.placeId === form.placeId && item.dishId === form.dishId)?.id ?? ''}
            onChange={(e) => {
              const selected = skipSampleItems.find((item) => item.id === e.target.value)
              if (selected) setForm((f) => ({ ...f, placeId: selected.placeId, dishId: selected.dishId }))
            }}
          >
            {skipSampleItems.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            Dropoff lat
            <input
              className="rounded border border-border px-3 py-2"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm">
            Dropoff lng
            <input
              className="rounded border border-border px-3 py-2"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand px-4 py-2 font-medium text-brand-contrast disabled:opacity-50"
        >
          {loading ? 'Comparing…' : 'Compare'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result?.recommendation && (
        <PathCard path={result.recommendation} title="Recommendation" />
      )}

      {result?.runners_up?.length ? (
        <div className="space-y-3">
          <h2 className="font-semibold text-content">Runners-up</h2>
          {result.runners_up.map((p) => (
            <PathCard key={p.purchase_option_id} path={p} title={`#${p.rank}`} />
          ))}
        </div>
      ) : null}

      {result?.unavailable_paths?.length ? (
        <div className="space-y-2 text-sm text-content-muted">
          <h2 className="font-semibold text-content">Unavailable</h2>
          <ul className="list-disc pl-5">
            {result.unavailable_paths.map((u) => (
              <li key={u.purchase_option_id}>{u.code}: {u.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
