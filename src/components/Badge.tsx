const URGENCY_STYLE: Record<string, string> = {
  Overdue: 'text-danger bg-danger-tint',
  'Due today': 'text-danger bg-danger-tint',
  'Due this week': 'text-accent bg-accent-tint',
  Upcoming: 'text-brand bg-brand-tint',
  'No date': 'text-ink-soft bg-border/40',
}

export function Badge({ label }: { label: string }) {
  const cls = URGENCY_STYLE[label] ?? URGENCY_STYLE['No date']
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${cls}`}>
      {label}
    </span>
  )
}
