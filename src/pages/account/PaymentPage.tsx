/**
 * PaymentPage — saved cards and a placeholder add-card form.
 */
import { CreditCard } from 'lucide-react'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import EmptyState from '@/components/misc/EmptyState'
import PageLoader from '@/components/layout/PageLoader'
import PageTitle from '@/components/brand/PageTitle'
import Button from '@/components/buttons/Button'
import Pill from '@/components/pills/Pill'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStorefront } from '@/hooks/storefront/useStorefront'
import { paths } from '@/routing/paths'

export default function PaymentPage() {
  const { loading, data, error } = useStorefront()

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Payment unavailable" description={error ?? undefined} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Profile', href: paths.profile }, { label: 'Payment' }]} />
      <PageTitle icon={<CreditCard size={20} />} title="Payment methods" count={data.account.paymentMethods.length} />
      <ul className="space-y-2">
        {data.account.paymentMethods.map((method) => (
          <li key={method.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
            <div>
              <p className="text-sm font-semibold text-content">{method.brand} ···· {method.last4}</p>
              <p className="text-xs text-content-muted">Expires {method.expMonth}/{method.expYear}</p>
            </div>
            {method.default && <Pill accent>Default</Pill>}
          </li>
        ))}
      </ul>
      <form className="max-w-lg space-y-3 rounded-xl border border-border bg-surface p-5" onSubmit={(event) => event.preventDefault()}>
        <h2 className="text-sm font-semibold text-content">Add a card</h2>
        <div className="space-y-1.5">
          <Label htmlFor="card-number">Card number</Label>
          <Input id="card-number" inputMode="numeric" placeholder="•••• •••• •••• ••••" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="card-exp">Expiry</Label>
            <Input id="card-exp" placeholder="MM/YY" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-cvc">CVC</Label>
            <Input id="card-cvc" placeholder="123" />
          </div>
        </div>
        <Button type="submit">Save card</Button>
        <p className="text-xs text-content-muted">Provider checkout may still ask you to confirm payment there.</p>
      </form>
    </div>
  )
}
