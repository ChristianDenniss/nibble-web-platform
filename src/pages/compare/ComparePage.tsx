import { useCompare } from '@/hooks/compare/useCompare'
import type { ComparePathRankWire } from '@/types/compare-wire'

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(cents / 100)
}

function PathCard({ path, title }: { path: ComparePathRankWire; title: string }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4 space-y-2">
      <h3 className="font-semibold text-content">{title}</h3>
      <p className="text-lg text-content">{path.headline}</p>
      <p className="text-content-secondary">
        All-in: {formatMoney(path.all_in.amount_cents, path.all_in.currency)}
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
          Calls <code className="text-sm">POST /v1/compare</code>. Seed demo data with{' '}
          <code className="text-sm">scripts/seed_compare_demo.sql</code> in local-dev.
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
          Dish ID
          <input
            className="rounded border border-border px-3 py-2"
            value={form.dishId}
            onChange={(e) => setForm((f) => ({ ...f, dishId: e.target.value }))}
          />
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

      {result?.compare_session_id && (
        <p className="text-sm text-content-muted">
          Session <code>{result.compare_session_id}</code>
          {result.observed_at ? ` · observed ${result.observed_at}` : null}
        </p>
      )}

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
