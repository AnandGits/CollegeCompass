export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
    />
  )
}
