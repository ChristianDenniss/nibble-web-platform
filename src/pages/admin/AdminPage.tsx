import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import { Check, MessageSquare, Plus, RefreshCw, ShieldCheck } from 'lucide-react'
import PageTitle from '@/components/brand/PageTitle'
import Button from '@/components/buttons/Button'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import { Input } from '@/components/ui/input'
import { useStorefront } from '@/hooks/storefront/useStorefront'

type Source = { phoneNumber: string; providerId: string; label: string; expiryPolicy: 'parsed' | 'fixed'; fixedExpiryHours: number; active: boolean }
type Message = { externalId: string; fromNumber: string; toNumber: string; providerId: string; body: string; status: string; promotionId: string; parseError: string; receivedAt: string }

export default function AdminPage() {
  const { loading, data, error } = useStorefront({ lightweight: true })
  const [sources, setSources] = useState<Source[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [form, setForm] = useState<Source>({ phoneNumber: '', providerId: '', label: '', expiryPolicy: 'parsed', fixedExpiryHours: 24, active: true })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadSources = () => { void axios.get<{ sources: Source[] }>('/api/v1/sms/sources').then((response) => setSources(response.data.sources ?? [])).catch(() => setSources([])) }
  const loadMessages = () => { void axios.get<{ messages: Message[] }>('/api/v1/sms/messages').then((response) => setMessages(response.data.messages ?? [])).catch(() => setMessages([])) }
  useEffect(loadSources, [])
  useEffect(loadMessages, [])

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Admin unavailable" description={error ?? undefined} />

  const save = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage('')
    try { await axios.post('/api/v1/sms/sources', form); setMessage('SMS source saved.'); setForm({ ...form, phoneNumber: '', label: '' }); loadSources(); loadMessages() }
    catch (err) { setMessage(axios.isAxiosError(err) ? (err.response?.data?.message ?? 'Could not save SMS source.') : 'Could not save SMS source.') }
    finally { setSaving(false) }
  }

  return <div className="space-y-6">
    <PageTitle icon={<MessageSquare size={20} />} title="Deal message inbox" />
    <section className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
      <div className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-accent" size={20} /><div><h2 className="font-semibold text-content">Connect a provider’s SMS deal number</h2><p className="mt-1 text-sm text-content-secondary">Register the number Nibble will receive messages on. Then point that number’s Twilio webhook to <code className="rounded bg-surface px-1">/api/v1/integrations/twilio/inbound</code>.</p></div></div>
    </section>
    <form onSubmit={save} className="grid gap-4 rounded-2xl border border-border bg-surface p-5 small:grid-cols-2">
      <label className="text-sm font-medium text-content">Provider<select className="mt-1 h-8 w-full rounded-lg border border-input bg-surface px-3 text-sm" required value={form.providerId} onChange={(event) => setForm({ ...form, providerId: event.target.value })}><option value="">Choose a provider</option>{data.providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}</select></label>
      <label className="text-sm font-medium text-content">SMS number to receive deals<Input required className="mt-1" placeholder="+1 506 555 0100" value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} /></label>
      <label className="text-sm font-medium text-content">Label<Input className="mt-1" placeholder="Skip deal inbox" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></label>
      <label className="text-sm font-medium text-content">Code expiry<select className="mt-1 h-8 w-full rounded-lg border border-input bg-surface px-3 text-sm" value={form.expiryPolicy} onChange={(event) => setForm({ ...form, expiryPolicy: event.target.value as Source['expiryPolicy'] })}><option value="parsed">Use expiry parsed from the message</option><option value="fixed">Always use a fixed expiry</option></select></label>
      {form.expiryPolicy === 'fixed' && <label className="text-sm font-medium text-content">Fixed expiry (hours)<Input className="mt-1" type="number" min={1} max={8760} value={form.fixedExpiryHours} onChange={(event) => setForm({ ...form, fixedExpiryHours: Number(event.target.value) })} /></label>}
      <div className="flex items-end"><Button type="submit" disabled={saving} className="gap-2"><Plus size={15} />{saving ? 'Saving…' : 'Save SMS source'}</Button></div>
      {message && <p className="text-sm text-content-secondary small:col-span-2">{message}</p>}
    </form>
    <section className="space-y-3"><h2 className="text-sm font-semibold uppercase tracking-wide text-content-muted">Configured sources</h2>{sources.length === 0 ? <p className="rounded-xl border border-border bg-surface p-4 text-sm text-content-muted">No SMS sources configured yet.</p> : sources.map((source) => <div key={source.phoneNumber} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4"><div className="grid size-9 place-items-center rounded-full bg-status-success/10 text-status-success"><Check size={17} /></div><div className="min-w-0 flex-1"><p className="font-medium text-content">{source.label || source.phoneNumber}</p><p className="text-sm text-content-secondary">{source.phoneNumber} · {data.providers.find((provider) => provider.id === source.providerId)?.name ?? source.providerId}</p></div><span className="text-xs text-content-muted">{source.expiryPolicy === 'fixed' ? `${source.fixedExpiryHours}h expiry` : 'Parsed expiry'}</span></div>)}</section>
    <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold uppercase tracking-wide text-content-muted">Incoming messages</h2><Button type="button" variant="outline" size="sm" onClick={loadMessages}><RefreshCw size={14} /> Refresh</Button></div>{messages.length === 0 ? <p className="rounded-xl border border-border bg-surface p-4 text-sm text-content-muted">No messages received yet.</p> : messages.map((sms) => <MessageRow key={sms.externalId} message={sms} providerName={data.providers.find((provider) => provider.id === sms.providerId)?.name ?? sms.providerId} onRetry={() => { void axios.post(`/api/v1/sms/messages/${encodeURIComponent(sms.externalId)}/retry`).then(loadMessages) }} />)}</section>
  </div>
}

function MessageRow({ message, providerName, onRetry }: { message: Message; providerName: string; onRetry: () => void }) {
  const failed = message.status === 'parse_failed' || message.status === 'store_failed'
  return <article className="rounded-xl border border-border bg-surface p-4"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${failed ? 'bg-status-danger/10 text-status-danger' : message.status === 'processed' ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'}`}>{message.status}</span><span className="text-xs text-content-muted">{providerName || 'Unmatched provider'} · {new Date(message.receivedAt).toLocaleString()}</span>{failed && <Button type="button" size="xs" variant="outline" onClick={onRetry}><RefreshCw size={12} /> Retry</Button>}</div><p className="mt-2 text-sm text-content">{message.body}</p>{message.promotionId && <p className="mt-1 text-xs text-content-secondary">Promotion: {message.promotionId}</p>}{message.parseError && <p className="mt-1 text-xs text-status-danger">{message.parseError}</p>}</article>
}
