/**
 * HomePage — a focused entry point for finding something good to eat.
 */
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import AppLogo from '@/components/brand/AppLogo'
import PageLoader from '@/components/layout/PageLoader'
import EmptyState from '@/components/misc/EmptyState'
import SearchBar from '@/components/navigation/SearchBar'
import { currentAddress, useStorefront } from '@/hooks/storefront/useStorefront'
import { paths, searchPath } from '@/routing/paths'

export default function HomePage() {
  const { loading, data, error } = useStorefront()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  if (loading) return <PageLoader />
  if (!data) {
    return <EmptyState title="Nothing to browse yet" description={error ?? 'Storefront catalog is empty.'} />
  }

  const address = currentAddress(data)
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(searchPath(query))
  }

  return (
    <section className="relative isolate flex min-h-[62vh] flex-col items-center justify-center overflow-hidden py-14 text-center small:min-h-[68vh]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="food-doodle food-doodle--pizza">🍕</span>
        <span className="food-doodle food-doodle--burger">🍔</span>
        <span className="food-doodle food-doodle--taco">🌮</span>
        <span className="food-doodle food-doodle--fries">🍟</span>
        <span className="food-doodle food-doodle--noodles">🍜</span>
        <span className="food-doodle food-doodle--avocado">🥑</span>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <AppLogo className="mb-6 h-24 w-auto small:h-32" />
        <Link
          to={paths.location}
          className="mb-8 inline-flex max-w-full items-center gap-2 text-sm text-content-secondary transition-colors hover:text-accent"
        >
          <MapPin size={16} className="shrink-0 text-accent" />
          <span className="truncate">
            {address ? `${address.location.address}, ${address.location.city}` : 'Add your delivery location'}
          </span>
        </Link>

        <p className="mb-3 text-sm font-medium text-accent">Good food, zero overthinking.</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-content small:text-6xl">
          What are you <span className="text-accent">craving?</span>
        </h1>
        <p className="mt-4 text-base text-content-secondary">Say the word. We’ll find your next bite.</p>

        <form onSubmit={search} className="mt-8 flex w-full max-w-xl gap-2">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Tacos, noodles, something crispy..."
            size="lg"
            className="min-w-0 flex-1"
          />
          <button
            type="submit"
            aria-label="Search food"
            className="inline-flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-brand text-on-brand transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ArrowRight size={18} />
          </button>
        </form>

        {data.categories.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
            <span className="text-content-muted">Or start with</span>
            {data.categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                to={`${paths.search}?category=${category.slug}`}
                className="font-medium text-content underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
