/**
 * DefaultPreferencesForm — which ways of getting food, apps, and direct ordering a compare may use,
 * plus memberships that unlock member pricing. Edits stay local until saved.
 */
import { useState, type ReactNode } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import Button from '@/components/buttons/Button'
import Toggle from '@/components/buttons/Toggle'
import {
  DEFAULT_PREFERENCES,
  saveDefaultPreferences,
  useDefaultPreferences,
  type DefaultPreferences,
} from '@/hooks/account/comparePrefsStore'
import {
  APP_CHANNELS,
  DIRECT_CHANNELS,
  FULFILLMENT_OPTIONS,
  MEMBERSHIP_OPTIONS,
  type ChannelOption,
} from '@/lib/comparePrefOptions'
import { cn } from '@/lib/utils'
import { notify } from '@/utils/notify'

function toggleIn(list: string[], value: string, on: boolean) {
  return on ? [...new Set([...list, value])] : list.filter((entry) => entry !== value)
}

function Group({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-surface p-5 small:p-6">
      <div>
        <h2 className="text-base font-semibold text-content">{title}</h2>
        <p className="mt-0.5 text-sm text-content-muted">{description}</p>
      </div>
      {children}
    </section>
  )
}

function SwitchRow({ label, checked, onChange, disabled, strong }: {
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
  strong?: boolean
}) {
  return (
    <label className={cn('flex items-center justify-between gap-4 px-4 py-3', disabled && 'opacity-50')}>
      <span className={cn('text-sm', strong ? 'font-semibold text-content' : 'text-content-secondary')}>{label}</span>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </label>
  )
}

function ChannelList({ master, masterLabel, onMaster, channels, blocked, onChannel }: {
  master: boolean
  masterLabel: string
  onMaster: () => void
  channels: ChannelOption[]
  blocked: string[]
  onChannel: (channelId: string, allowed: boolean) => void
}) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      <SwitchRow label={masterLabel} checked={master} onChange={onMaster} strong />
      {channels.map((channel) => {
        const allowed = !blocked.includes(channel.channelId)
        return (
          <SwitchRow
            key={channel.channelId}
            label={channel.label}
            checked={master && allowed}
            disabled={!master}
            onChange={() => onChannel(channel.channelId, !allowed)}
          />
        )
      })}
    </div>
  )
}

export default function DefaultPreferencesForm() {
  const saved = useDefaultPreferences()
  const [draft, setDraft] = useState<DefaultPreferences>(saved)
  const { prefs, memberships } = draft
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)

  const update = (next: Partial<DefaultPreferences['prefs']>) => {
    setDraft((current) => ({ ...current, prefs: { ...current.prefs, ...next } }))
  }

  const setChannel = (channelId: string, allowed: boolean) => {
    update({ blockedChannelIds: toggleIn(prefs.blockedChannelIds, channelId, !allowed) })
  }

  const appsOpen = prefs.willingToUseAggregator && APP_CHANNELS.some((channel) => !prefs.blockedChannelIds.includes(channel.channelId))
  const directOpen = prefs.merchantDirectOK && DIRECT_CHANNELS.some((channel) => !prefs.blockedChannelIds.includes(channel.channelId))
  const inPersonOpen = prefs.allowedFulfillmentModes.some((mode) => mode === 'drive_thru' || mode === 'in_store')
  const nothingToCompare = !appsOpen && !directOpen && !inPersonOpen

  const save = () => {
    saveDefaultPreferences(draft)
    notify.success('Preferences saved')
  }

  return (
    <div className="space-y-4">
      <Group title="Ways to get food" description="Only these show up when we compare. Pick at least one.">
        <div className="grid grid-cols-2 gap-3 small:grid-cols-4">
          {FULFILLMENT_OPTIONS.map(({ mode, label, hint, icon: Icon }) => {
            const selected = prefs.allowedFulfillmentModes.includes(mode)
            const onlyOne = selected && prefs.allowedFulfillmentModes.length === 1
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={selected}
                disabled={onlyOne}
                onClick={() => update({ allowedFulfillmentModes: toggleIn(prefs.allowedFulfillmentModes, mode, !selected) })}
                className={cn(
                  'relative flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-colors',
                  selected
                    ? 'border-brand/40 bg-brand/10'
                    : 'border-border bg-surface hover:bg-surface-inset',
                  onlyOne && 'cursor-not-allowed',
                )}
              >
                <span className={cn('flex size-9 items-center justify-center rounded-xl', selected ? 'bg-brand/20 text-accent' : 'bg-surface-inset text-content-muted')}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-content">{label}</span>
                  <span className="block text-xs text-content-muted">{hint}</span>
                </span>
                {selected && <Check size={14} className="absolute right-3 top-3 text-accent" />}
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Delivery apps" description="Turn off apps you don’t have or don’t want to use.">
        <ChannelList
          master={prefs.willingToUseAggregator}
          masterLabel="Include delivery apps"
          onMaster={() => update({ willingToUseAggregator: !prefs.willingToUseAggregator })}
          channels={APP_CHANNELS}
          blocked={prefs.blockedChannelIds}
          onChannel={setChannel}
        />
      </Group>

      <Group title="Ordering direct" description="Restaurants are often cheaper when you skip the app.">
        <ChannelList
          master={prefs.merchantDirectOK}
          masterLabel="Include ordering from the restaurant"
          onMaster={() => update({ merchantDirectOK: !prefs.merchantDirectOK })}
          channels={DIRECT_CHANNELS}
          blocked={prefs.blockedChannelIds}
          onChannel={setChannel}
        />
      </Group>

      <Group title="Memberships" description="Tell us what you pay for so we use member pricing and free delivery.">
        <div className="flex flex-wrap gap-2">
          {MEMBERSHIP_OPTIONS.map((membership) => {
            const selected = memberships.includes(membership.slug)
            return (
              <button
                key={membership.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => setDraft((current) => ({ ...current, memberships: toggleIn(current.memberships, membership.slug, !selected) }))}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                  selected
                    ? 'border-brand/40 bg-brand/10 font-medium text-accent'
                    : 'border-border bg-surface text-content-secondary hover:bg-surface-inset',
                )}
              >
                {selected && <Check size={14} />}
                {membership.label}
                <span className="text-xs text-content-muted">· {membership.provider}</span>
              </button>
            )
          })}
        </div>
      </Group>

      {nothingToCompare && (
        <p className="flex items-start gap-2 rounded-xl bg-status-warning/10 px-4 py-3 text-sm text-content-secondary">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-status-warning" />
          With these settings there’s nothing left to compare. Turn on an app, ordering direct, or an in-person option.
        </p>
      )}

      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-5 py-3',
          dirty && 'sticky bottom-4 z-10 shadow-lg',
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-content-muted">{dirty ? 'Unsaved changes' : 'Saved on this device'}</span>
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_PREFERENCES)}
            className="text-sm font-medium text-accent hover:underline"
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <Button variant="ghost" onClick={() => setDraft(saved)}>Discard</Button>
          )}
          <Button onClick={save} disabled={!dirty}>Save preferences</Button>
        </div>
      </div>
    </div>
  )
}
