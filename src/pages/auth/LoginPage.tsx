/**
 * LoginPage — email / password plus Google and Apple sign-in. Sign-up is a mode on this page.
 * Signed-in visitors are sent home; SSO failures come back here as `?error=<code>`.
 */
import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import PageLoader from '@/components/layout/PageLoader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { extractAxiosError } from '@/errors'
import { login, signUp, ssoStartUrl, useAuth, type SsoProvider } from '@/hooks/auth/authStore'
import { useSsoProviders } from '@/hooks/auth/useSsoProviders'
import { paths } from '@/routing/paths'
import { notify } from '@/utils/notify'

const SSO_ERRORS: Record<string, string> = {
  sso_unavailable: "That sign-in option isn't set up yet.",
  sso_cancelled: 'Sign-in was cancelled.',
  sso_expired: 'Sign-in took too long. Please try again.',
  sso_email_unverified: "Your provider hasn't verified that email address.",
  sso_email_missing: "Your provider didn't share an email address.",
  sso_failed: "We couldn't sign you in. Please try again.",
}

const SSO_BUTTONS: { id: SsoProvider; label: string }[] = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
]

export default function LoginPage() {
  const { status } = useAuth()
  const providers = useSsoProviders()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const ssoError = (() => {
    const code = searchParams.get('error')
    return code ? SSO_ERRORS[code] ?? SSO_ERRORS.sso_failed : null
  })()
  const isSignup = mode === 'signup'
  const redirectTo = (location.state as { from?: string } | null)?.from ?? paths.home

  useEffect(() => {
    if (ssoError) notify.error(ssoError)
  }, [ssoError])

  if (status === 'loading') return <PageLoader />
  if (status === 'authenticated' && !submitting) return <Navigate to={redirectTo} replace />

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      if (isSignup) await signUp(name, email, password)
      else await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err: unknown) {
      notify.error(extractAxiosError(err, isSignup ? 'Could not create your account.' : 'Could not log you in.'))
      setSubmitting(false)
    }
  }

  const switchMode = () => {
    setMode(isSignup ? 'login' : 'signup')
  }

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

      <form className="mt-6 space-y-4" onSubmit={(event) => { void submit(event) }}>
        {isSignup && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Alex Morgan"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            minLength={isSignup ? 8 : undefined}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {isSignup && <p className="text-xs text-content-muted">At least 8 characters.</p>}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-content-muted">or continue with</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid gap-2">
        {SSO_BUTTONS.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="secondary"
            className="w-full"
            disabled={!providers[provider.id] || submitting}
            title={providers[provider.id] ? undefined : `${provider.label.replace('Continue with ', '')} sign-in isn't configured`}
            onClick={() => window.location.assign(ssoStartUrl(provider.id))}
          >
            {provider.label}
          </Button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-content-secondary">
        {isSignup ? 'Already have an account?' : 'New here?'}{' '}
        <button type="button" className="font-medium text-accent hover:opacity-80" onClick={switchMode}>
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
