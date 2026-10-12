import { Link } from 'react-router-dom'

export function ChecklistRow({
  label,
  done,
  to,
}: {
  label: string
  done: boolean
  to?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={
            'w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ' +
            (done ? 'bg-brand border-brand text-white' : 'border-border text-transparent')
          }
        >
          ✓
        </span>
        <span className={done ? 'text-ink-soft line-through' : 'text-ink'}>
          {label}
          <span className="sr-only">{done ? ' — done' : ' — not done'}</span>
        </span>
      </div>
      {!done && to && (
        <Link to={to} className="text-xs font-semibold text-brand hover:text-brand-hover shrink-0">
          Go <span className="sr-only">to: {label}</span> →
        </Link>
      )}
    </div>
  )
}
