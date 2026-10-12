import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_GROUPS } from '../lib/nav'
import { useIdentity } from '../lib/identity'

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { email, signOut } = useIdentity()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const navBody = (
    <>
      <Link to="/" className="flex items-center gap-2 pl-5 pr-12 py-5" onClick={() => setMobileNavOpen(false)}>
        {/* <span aria-hidden="true" className="text-xl shrink-0">🎓</span> */}
        <span className="font-display font-semibold text-xl leading-tight">College Compass</span>
      </Link>

      {email && (
        <div className="px-5 pb-3 text-xs text-ink-soft">
          Signed in as
          <br />
          <span className="font-semibold text-ink">{email}</span>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="px-2 mb-1 text-[11px] font-bold uppercase tracking-wider text-brand">
              {group.label}
            </div>
            {group.items.map((item) => {
              if (item.comingSoon) {
                return (
                  <div
                    key={item.key}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 text-ink-soft cursor-not-allowed"
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide bg-brand-tint text-brand px-1.5 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </div>
                )
              }

              if (item.external) {
                return (
                  <a
                    key={item.key}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 text-ink hover:bg-brand-tint"
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                )
              }

              const active = pathname === item.path
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setMobileNavOpen(false)}
                  className={
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 ' +
                    (active ? 'bg-brand text-white' : 'text-ink hover:bg-brand-tint')
                  }
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {email && (
        <button
          onClick={signOut}
          className="mx-3 mb-4 min-h-10 rounded-lg border border-border text-sm font-medium hover:bg-brand-tint"
        >
          Sign out
        </button>
      )}

      <div className="px-5 py-3 text-[11px] text-ink-soft text-center border-t border-border">
        Created by the EHS community
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-paper text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:text-ink focus:px-3 focus:py-2 focus:rounded-lg focus:border focus:border-border"
      >
        Skip to content
      </a>

      <aside className="w-64 shrink-0 border-r border-border bg-surface hidden md:flex md:flex-col print:hidden">
        {navBody}
      </aside>

      <div className="md:hidden print:hidden fixed top-0 inset-x-0 z-30 flex items-center gap-3 px-4 py-3 bg-surface border-b border-border">
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileNavOpen}
          className="min-h-11 min-w-11 flex items-center justify-center rounded-lg border border-border"
        >
          <span aria-hidden="true" className="text-xl">☰</span>
        </button>
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span aria-hidden="true" className="text-xl shrink-0">🎓</span>
          <span className="font-display font-semibold text-lg leading-tight">College Compass</span>
        </Link>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[80%] bg-surface flex flex-col shadow-xl">
            <button
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
              className="absolute top-3 right-3 min-h-9 min-w-9 flex items-center justify-center rounded-lg border border-border"
            >
              <span aria-hidden="true">✕</span>
            </button>
            {navBody}
          </aside>
        </div>
      )}

      <main id="main-content" className="flex-1 min-w-0 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-20 md:pt-12 pb-8 sm:pb-12 print:p-0 print:max-w-none">
        {children}
      </main>
    </div>
  )
}
