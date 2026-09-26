/**
 * LoginPage — email / password plus SSO actions. Sign-up is a mode on this page.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { paths } from '@/routing/paths'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const isSignup = mode === 'signup'

  return (
    <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-content-muted">Account</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-content">
        {isSignup ? 'Create an account' : 'Welcome back'}
      </h1>
      <p className="mt-2 text-sm text-content-secondary">
        {isSignup
          ? 'Save addresses and see past orders. Checkout still happens on the provider you pick.'
          : 'Log in to pick up where you left off.'}
      </p>

      <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
        {isSignup && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} />
        </div>
        <Button type="submit" className="w-full">
          {isSignup ? 'Create account' : 'Log in'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-content-muted">or continue with</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid gap-2">
        <Button type="button" variant="secondary" className="w-full">Continue with Google</Button>
        <Button type="button" variant="secondary" className="w-full">Continue with Apple</Button>
      </div>

      <p className="mt-6 text-center text-sm text-content-secondary">
        {isSignup ? 'Already have an account?' : 'New here?'}{' '}
        <button
          type="button"
          className="font-medium text-accent hover:opacity-80"
          onClick={() => setMode(isSignup ? 'login' : 'signup')}
        >
          {isSignup ? 'Log in' : 'Create an account'}
        </button>
      </p>
      <p className="mt-3 text-center text-xs text-content-muted">
        By continuing you agree to the <Link to={paths.terms} className="text-accent">Terms</Link> and{' '}
        <Link to={paths.privacy} className="text-accent">Privacy Policy</Link>.
      </p>
    </section>
  )
}
