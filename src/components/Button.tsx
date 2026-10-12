import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary'

const base =
  'inline-flex items-center justify-center min-h-11 px-4 rounded-lg font-semibold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-brand'

function styles(variant: Variant) {
  return variant === 'primary'
    ? 'bg-accent text-white hover:bg-[#d0762f]'
    : 'bg-surface text-ink border border-border hover:bg-brand-tint'
}

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${styles(variant)} ${className}`} {...props} />
}

/** Same visual style as Button, but a real <Link> — use for navigation so
 * Cmd/Ctrl-click and middle-click work as expected. */
export function LinkButton({
  variant = 'secondary',
  className = '',
  ...props
}: LinkProps & { variant?: Variant }) {
  return <Link className={`${base} ${styles(variant)} ${className}`} {...props} />
}
