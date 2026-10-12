import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl p-5 shadow-[0_1px_2px_rgba(22,33,62,0.06)] ${className}`}
    >
      {children}
    </div>
  )
}

export function CardLabel({ children }: { children: ReactNode }) {
  return <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">{children}</div>
}
