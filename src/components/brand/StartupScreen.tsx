import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Pizza, Sandwich, IceCreamCone, Coffee, Cherry, Croissant, ArrowRight } from 'lucide-react'
import AppLogo from './AppLogo'
import { paths } from '@/routing/paths'
import { markSplashSeen } from '@/hooks/onboarding/onboardingStore'

const doodles = [Pizza, Sandwich, IceCreamCone, Coffee, Cherry, Croissant]

/** In-memory startup flow: replay on refresh, never on internal navigation. */
export default function StartupScreen({ onComplete }: { onComplete: () => void }) {
  const [ready, setReady] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const timer = window.setTimeout(() => {
      // Preserve sign-in links and OAuth error responses.
      if (location.pathname === paths.login) onComplete()
      else setReady(true)
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : 1700)
    return () => window.clearTimeout(timer)
  }, [location.pathname, onComplete])
  useEffect(() => { if (ready) heading.current?.focus() }, [ready])

  const enter = (mode: 'signup' | 'login' | 'guest') => {
    markSplashSeen()
    if (mode !== 'guest') {
      navigate(`${paths.login}${mode === 'signup' ? '?mode=signup' : ''}`, {
        state: { from: location.pathname === paths.welcome ? paths.home : location.pathname + location.search },
      })
    } else if (location.pathname === paths.welcome) {
      navigate(paths.welcome, { replace: true, state: { locationRequired: true, from: paths.home } })
    }
    onComplete()
  }

  return <main className={`startup-screen ${ready ? 'startup-screen--ready' : ''}`}>
    <div className="startup-doodles" aria-hidden="true">
      {doodles.map((Icon, index) => <span key={index} className={`startup-doodle startup-doodle--${index}`}><Icon strokeWidth={1.4} /></span>)}
    </div>
    <div className="startup-content">
      <div className="startup-logo"><AppLogo className="w-full h-auto" /></div>
      {ready ? <div className="startup-choices">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">Big cravings. Better prices.</p>
        <h1 ref={heading} tabIndex={-1} className="mt-4 text-4xl font-semibold tracking-tight text-content outline-none sm:text-5xl">Your next bite starts here.</h1>
        <p className="mx-auto mt-4 max-w-sm text-content-secondary">Find your favourites. Compare your cart. Dig in.</p>
        <div className="mx-auto mt-8 grid w-full max-w-sm gap-3">
          <button onClick={() => enter('signup')} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-on-brand hover:opacity-90">Sign up <ArrowRight size={18} /></button>
          <button onClick={() => enter('login')} className="min-h-12 rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-content hover:bg-brand/5">Sign in</button>
          <button onClick={() => enter('guest')} className="min-h-12 rounded-xl px-6 py-3 font-medium text-accent hover:bg-brand/5">Continue as guest →</button>
        </div>
      </div> : <p role="status" className="mt-6 text-sm font-medium tracking-widest text-accent">A little Nibble. A lot to love.</p>}
    </div>
  </main>
}
