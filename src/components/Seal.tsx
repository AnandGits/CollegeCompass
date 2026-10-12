type SealProps = {
  pct: number
  label: string
  size?: number
}

/** Circular "wax seal" progress medallion — the app's signature motif. */
export function Seal({ pct, label, size = 76 }: SealProps) {
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c

  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 shrink-0"
        role="img"
        aria-label={`${label}: ${pct}% complete`}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 origin-center font-mono font-semibold fill-ink"
          style={{ fontSize: size * 0.24, transformOrigin: '50% 50%' }}
        >
          {pct}%
        </text>
      </svg>
      <div className="text-sm font-medium text-ink-soft">{label}</div>
    </div>
  )
}
