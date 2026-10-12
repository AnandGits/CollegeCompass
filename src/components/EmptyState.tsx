export function EmptyState({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="text-center py-10 px-6 border border-border rounded-xl bg-surface max-w-md mx-auto">
      <div aria-hidden="true" className="w-11 h-11 rounded-full bg-brand-tint flex items-center justify-center text-lg mx-auto mb-3">
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-ink-soft mt-1">{body}</div>
    </div>
  )
}
