import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import axios from 'axios'
import { ArrowLeft, Check, Inbox, Mail, MessageSquare, Plus, RefreshCw, Settings2, Webhook, X } from 'lucide-react'
import PageTitle from '@/components/brand/PageTitle'
import Button from '@/components/buttons/Button'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import { Input } from '@/components/ui/input'
import { useStorefront } from '@/hooks/storefront/useStorefront'

type Source = { phoneNumber: string; providerId: string; label: string; expiryPolicy: 'parsed' | 'fixed'; fixedExpiryHours: number; active: boolean }
type Message = { externalId: string; fromNumber: string; toNumber: string; providerId: string; body: string; status: string; promotionId: string; parseError: string; receivedAt: string }
type EmailMessage = { externalId: string; sender: string; subject: string; body: string; status: string; promotionId: string; parseError: string; receivedAt: string }

export default function AdminPage() {
  const { loading, data, error } = useStorefront({ lightweight: true })
  const [sources, setSources] = useState<Source[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [form, setForm] = useState<Source>({ phoneNumber: '', providerId: '', label: '', expiryPolicy: 'parsed', fixedExpiryHours: 24, active: true })
  const [showConnect, setShowConnect] = useState(false)
  const [selectedPipeline, setSelectedPipeline] = useState<'sms' | 'email' | null>(null)
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
    try { await axios.post('/api/v1/sms/sources', form); setMessage('Source connected.'); setForm({ ...form, phoneNumber: '', label: '' }); setShowConnect(false); loadSources(); loadMessages() }
    catch (err) { setMessage(axios.isAxiosError(err) ? (err.response?.data?.message ?? 'Could not connect source.') : 'Could not connect source.') }
    finally { setSaving(false) }
  }

  if (selectedPipeline === null) return <div className="space-y-6">
    <div><PageTitle icon={<Settings2 size={20} />} title="Operations" /><p className="mt-2 text-sm text-content-secondary">Choose a pipeline to configure and monitor.</p></div>
    <section className="grid gap-4 small:grid-cols-2">
      <PipelineCard icon={<MessageSquare size={20} />} title="Text message discount pipeline" description="Receive provider deal messages, parse discount codes, and create promotions." status="Available" onClick={() => setSelectedPipeline('sms')} />
      <PipelineCard icon={<Mail size={20} />} title="Email discount pipeline" description="Connect a Gmail inbox for deal emails and automated promotion extraction." status="Available" onClick={() => setSelectedPipeline('email')} />
      <PipelineCard icon={<Webhook size={20} />} title="Webhook pipeline" description="Receive structured deal events from external systems." status="Coming soon" />
      <PipelineCard icon={<Inbox size={20} />} title="File import pipeline" description="Bring in provider deals from scheduled CSV or spreadsheet imports." status="Coming soon" />
    </section>
  </div>

  if (selectedPipeline === 'email') return <EmailPipeline onBack={() => setSelectedPipeline(null)} />

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><button type="button" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-content-muted hover:text-content" onClick={() => { setSelectedPipeline(null); setShowConnect(false) }}><ArrowLeft size={15} /> All pipelines</button><PageTitle icon={<MessageSquare size={20} />} title="Text message discount pipeline" /><p className="mt-2 text-sm text-content-secondary">Configure provider message sources and monitor discount processing.</p></div>
      <Button type="button" className="gap-2" onClick={() => { setShowConnect((visible) => !visible); setMessage('') }}>{showConnect ? <X size={16} /> : <Plus size={16} />}{showConnect ? 'Close' : 'Connect new source'}</Button>
    </div>

    {showConnect && <form onSubmit={save} className="space-y-5 rounded-2xl border border-border bg-surface p-5">
      <div><h2 className="font-semibold text-content">Connect a new source</h2><p className="mt-1 text-sm text-content-secondary">Add a phone number that Nibble can use to receive provider deal messages.</p></div>
      <div className="grid gap-4 small:grid-cols-2">
        <label className="text-sm font-medium text-content">Provider<select className="mt-1 h-9 w-full rounded-lg border border-input bg-surface px-3 text-sm" required value={form.providerId} onChange={(event) => setForm({ ...form, providerId: event.target.value })}><option value="">Choose a provider</option>{data.providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}</select></label>
        <label className="text-sm font-medium text-content">Source phone number<Input required className="mt-1" placeholder="+1 506 555 0100" value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} /></label>
        <label className="text-sm font-medium text-content">Label<Input className="mt-1" placeholder="Optional source name" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></label>
        <label className="text-sm font-medium text-content">Code expiry<select className="mt-1 h-9 w-full rounded-lg border border-input bg-surface px-3 text-sm" value={form.expiryPolicy} onChange={(event) => setForm({ ...form, expiryPolicy: event.target.value as Source['expiryPolicy'] })}><option value="parsed">Use expiry parsed from message</option><option value="fixed">Always use a fixed expiry</option></select></label>
        {form.expiryPolicy === 'fixed' && <label className="text-sm font-medium text-content">Fixed expiry (hours)<Input className="mt-1" type="number" min={1} max={8760} value={form.fixedExpiryHours} onChange={(event) => setForm({ ...form, fixedExpiryHours: Number(event.target.value) })} /></label>}
      </div>
      <div className="flex flex-wrap items-center gap-3"><Button type="submit" disabled={saving} className="gap-2"><Plus size={15} />{saving ? 'Connecting…' : 'Connect source'}</Button>{message && <p className="text-sm text-content-secondary">{message}</p>}</div>
    </form>}

    <section className="space-y-3"><SectionHeading icon={<Inbox size={17} />} title="Connected sources" count={sources.length} /><div className="rounded-2xl border border-border bg-surface p-5">{sources.length === 0 ? <p className="text-sm text-content-muted">No sources connected yet.</p> : <div className="space-y-4">{sources.map((source) => <div key={source.phoneNumber} className="flex items-center gap-3"><div className="grid size-8 shrink-0 place-items-center rounded-full bg-status-success/10 text-status-success"><Check size={15} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-content">{source.label || source.phoneNumber}</p><p className="truncate text-xs text-content-secondary">{source.phoneNumber} · {data.providers.find((provider) => provider.id === source.providerId)?.name ?? source.providerId}</p></div><span className="text-xs text-content-muted">{source.active ? 'Active' : 'Paused'}</span></div>)}</div>}</div></section>
    <section className="space-y-3"><div className="flex items-center justify-between gap-3"><SectionHeading icon={<MessageSquare size={17} />} title="Recent activity" count={messages.length} /><Button type="button" variant="outline" size="sm" onClick={loadMessages}><RefreshCw size={14} /> Refresh</Button></div><div className="rounded-2xl border border-border bg-surface p-5">{messages.length === 0 ? <p className="text-sm text-content-muted">No recent activity.</p> : <div className="space-y-3">{messages.slice(0, 5).map((sms) => <MessageRow key={sms.externalId} message={sms} providerName={data.providers.find((provider) => provider.id === sms.providerId)?.name ?? sms.providerId} onRetry={() => { void axios.post(`/api/v1/sms/messages/${encodeURIComponent(sms.externalId)}/retry`).then(loadMessages) }} />)}</div>}</div></section>
  </div>
}

function EmailPipeline({ onBack }: { onBack: () => void }) {
  const [connected, setConnected] = useState(false)
  const [email, setEmail] = useState('')
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null)
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [syncing, setSyncing] = useState(false)
  const [notice, setNotice] = useState('')

  const load = () => {
    void Promise.all([
      axios.get<{ connected: boolean; email?: string; lastSyncAt?: string }>('/api/v1/email/gmail/status'),
      axios.get<{ messages: EmailMessage[] }>('/api/v1/email/messages'),
    ]).then(([statusResponse, messagesResponse]) => {
      setConnected(statusResponse.data.connected)
      setEmail(statusResponse.data.email ?? '')
      setLastSyncAt(statusResponse.data.lastSyncAt ?? null)
      setMessages(messagesResponse.data.messages ?? [])
    }).catch(() => setNotice('Could not load Gmail status.'))
  }
  useEffect(load, [])

  const sync = async () => {
    setSyncing(true); setNotice('')
    try { const response = await axios.post<{ processed: number; failed: number }>('/api/v1/email/gmail/sync'); setNotice(`Checked Gmail: ${response.data.processed} processed${response.data.failed ? `, ${response.data.failed} failed` : ''}.`); load() }
    catch (err) { setNotice(axios.isAxiosError(err) ? (err.response?.data?.message ?? 'Gmail sync failed.') : 'Gmail sync failed.') }
    finally { setSyncing(false) }
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><button type="button" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-content-muted hover:text-content" onClick={onBack}><ArrowLeft size={15} /> All pipelines</button><PageTitle icon={<Mail size={20} />} title="Email discount pipeline" /><p className="mt-2 text-sm text-content-secondary">Read deal emails from Gmail and turn supported discounts into promotions.</p></div>{connected && <Button type="button" variant="outline" onClick={() => { void sync() }} disabled={syncing}><RefreshCw size={14} />{syncing ? 'Syncing…' : 'Sync now'}</Button>}</div>
    <section className="space-y-4 rounded-2xl border border-border bg-surface p-5"><div><h2 className="font-semibold text-content">Gmail connection</h2><p className="mt-1 text-sm text-content-secondary">Connect a Gmail inbox that receives provider deal emails. Nibble only requests read-only Gmail access.</p></div>{connected ? <div className="flex flex-wrap items-center gap-3 rounded-lg bg-surface-inset px-4 py-3"><Check size={17} className="text-status-success" /><div className="flex-1"><p className="text-sm font-medium text-content">{email}</p><p className="text-xs text-content-secondary">{lastSyncAt ? `Last synced ${new Date(lastSyncAt).toLocaleString()}` : 'Not synced yet'}</p></div><span className="text-xs font-medium text-status-success">Connected</span></div> : <Button type="button" onClick={() => { window.location.href = '/api/v1/email/gmail/start' }} className="gap-2"><Mail size={16} /> Connect Gmail</Button>}{notice && <p className="text-sm text-content-secondary">{notice}</p>}</section>
    <section className="space-y-3"><SectionHeading icon={<Inbox size={17} />} title="Recent email activity" count={messages.length} /><div className="rounded-2xl border border-border bg-surface p-5">{messages.length === 0 ? <p className="text-sm text-content-muted">No email activity yet.</p> : <div className="space-y-3">{messages.slice(0, 5).map((message) => <article key={message.externalId} className="rounded-lg bg-surface-inset px-3 py-2.5"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-status-success/10 px-2 py-0.5 text-xs font-semibold text-status-success">{message.status}</span><span className="text-xs text-content-muted">{message.sender} · {new Date(message.receivedAt).toLocaleString()}</span></div><p className="mt-1.5 text-sm font-medium text-content">{message.subject || 'Untitled email'}</p><p className="mt-1 line-clamp-2 text-sm text-content-secondary">{message.body}</p>{message.parseError && <p className="mt-1 text-xs text-status-danger">{message.parseError}</p>}</article>)}</div>}</div></section>
  </div>
}

function PipelineCard({ icon, title, description, status, onClick }: { icon: ReactNode; title: string; description: string; status: string; onClick?: () => void }) { return <button type="button" disabled={!onClick} onClick={onClick} className="group flex min-h-40 flex-col items-start rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-accent/50 hover:bg-surface-raised disabled:cursor-default disabled:hover:border-border disabled:hover:bg-surface"><div className="flex w-full items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">{icon}</span><span className="rounded-full bg-surface-inset px-2.5 py-1 text-xs font-medium text-content-muted">{status}</span></div><h2 className="mt-5 font-semibold text-content">{title}</h2><p className="mt-1 text-sm leading-5 text-content-secondary">{description}</p>{onClick && <span className="mt-auto pt-4 text-sm font-medium text-accent">Configure pipeline →</span>}</button> }

function SectionHeading({ icon, title, count }: { icon: ReactNode; title: string; count: number }) { return <div className="flex items-center gap-2"><span className="text-accent">{icon}</span><h2 className="font-semibold text-content">{title}</h2><span className="rounded-full bg-surface-inset px-2 py-0.5 text-xs text-content-muted">{count}</span></div> }
function MessageRow({ message, providerName, onRetry }: { message: Message; providerName: string; onRetry: () => void }) { const failed = message.status === 'parse_failed' || message.status === 'store_failed'; return <article className="rounded-lg bg-surface-inset px-3 py-2.5"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${failed ? 'bg-status-danger/10 text-status-danger' : message.status === 'processed' ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'}`}>{message.status}</span><span className="text-xs text-content-muted">{providerName || 'Unmatched provider'} · {new Date(message.receivedAt).toLocaleString()}</span>{failed && <Button type="button" size="xs" variant="outline" onClick={onRetry}><RefreshCw size={12} /> Retry</Button>}</div><p className="mt-1.5 line-clamp-2 text-sm text-content">{message.body}</p>{message.parseError && <p className="mt-1 text-xs text-status-danger">{message.parseError}</p>}</article> }
