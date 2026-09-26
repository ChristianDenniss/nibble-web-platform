/**
 * LegalDocument — shared layout for Terms and Privacy: doc switcher, at-a-glance summary,
 * sticky table of contents, numbered sections. A string block renders as a paragraph,
 * a string[] block as a bullet list.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paths } from '@/routing/paths'

export interface LegalHighlight {
  icon: LucideIcon
  title: string
  body: string
}

export interface LegalSection {
  id: string
  title: string
  blocks: Array<string | string[]>
}

interface Props {
  title: string
  updated: string
  intro: ReactNode
  highlights: LegalHighlight[]
  sections: LegalSection[]
}

const DOCS = [
  { label: 'Terms of service', to: paths.terms },
  { label: 'Privacy policy', to: paths.privacy },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null)
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-120px 0px -65% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

function Toc({ sections, active }: { sections: LegalSection[]; active: string }) {
  return (
    <ol className="space-y-0.5">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className={cn(
              'flex gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
              active === section.id
                ? 'bg-brand/10 font-medium text-accent'
                : 'text-content-secondary hover:bg-surface-inset hover:text-content',
            )}
          >
            <span className="w-4 shrink-0 tabular-nums text-content-muted">{index + 1}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  )
}

export default function LegalDocument({ title, updated, intro, highlights, sections }: Props) {
  const [ids] = useState(() => sections.map((section) => section.id))
  const active = useActiveSection(ids)

  return (
    <article className="space-y-10">
      <header className="space-y-5">
        <nav className="flex gap-2" aria-label="Legal documents">
          {DOCS.map((doc) => (
            <NavLink
              key={doc.to}
              to={doc.to}
              className={({ isActive }) => cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-brand/30 bg-brand/10 text-accent'
                  : 'border-border bg-surface-inset text-content-tertiary hover:text-content',
              )}
            >
              {doc.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content">{title}</h1>
          <p className="mt-1 text-xs text-content-muted">Last updated {updated}</p>
        </div>
        <div className="max-w-2xl text-sm leading-relaxed text-content-secondary">{intro}</div>
      </header>

      <section aria-labelledby="at-a-glance" className="rounded-2xl bg-surface-inset p-5 small:p-6">
        <h2 id="at-a-glance" className="text-sm font-semibold text-content">At a glance</h2>
        <ul className="mt-4 grid gap-5 small:grid-cols-2">
          {highlights.map(({ icon: Icon, title: heading, body }) => (
            <li key={heading} className="flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-accent">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold text-content">{heading}</p>
                <p className="mt-0.5 text-sm text-content-secondary">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-content-muted">On this page</p>
            <Toc sections={sections} active={active} />
          </div>
        </aside>

        <details className="mb-8 rounded-2xl border border-border bg-surface px-4 py-3 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-content">On this page</summary>
          <div className="mt-3">
            <Toc sections={sections} active={active} />
          </div>
        </details>

        <div className="max-w-2xl space-y-10">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <h2 className="text-lg font-semibold tracking-tight text-content">
                <span className="mr-2 tabular-nums text-content-muted">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.blocks.map((block, blockIndex) =>
                  typeof block === 'string' ? (
                    <p key={blockIndex} className="text-sm leading-relaxed text-content-secondary">{block}</p>
                  ) : (
                    <ul key={blockIndex} className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-content-secondary marker:text-content-muted">
                      {block.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm">
            <p className="text-content-secondary">
              Questions about this page? <Link to={paths.help} className="font-medium text-accent hover:opacity-80">Visit Help</Link>
            </p>
            {DOCS.filter((doc) => doc.label !== title).map((doc) => (
              <Link key={doc.to} to={doc.to} className="font-medium text-accent hover:opacity-80">
                Read the {doc.label.toLowerCase()}
              </Link>
            ))}
          </footer>
        </div>
      </div>
    </article>
  )
}
