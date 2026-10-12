import { useState, type ReactNode } from 'react'
import { useIdentity } from '../lib/identity'

export function RequireIdentity({
  prompt = 'Enter your email to see your personalized dashboard.',
  children,
}: {
  prompt?: string
  children: (email: string) => ReactNode
}) {
  const { email, setEmail } = useIdentity()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  if (email) return <>{children(email)}</>

  return (
    <div className="max-w-sm mx-auto mt-10 text-center">
      <div aria-hidden="true" className="w-11 h-11 rounded-full bg-brand-tint flex items-center justify-center text-lg mx-auto mb-3">
        ✉️
      </div>
      <label htmlFor="student-email" className="font-semibold mb-4 block">
        {prompt}
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.includes('@')) {
            setError('Please enter a valid email address.')
            return
          }
          setError('')
          setEmail(draft)
        }}
        className="flex flex-col gap-3"
      >
        <input
          id="student-email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          inputMode="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'student-email-error' : undefined}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="you@example.com"
          className="min-h-11 px-3 rounded-lg border border-border bg-surface"
        />
        {error && (
          <div id="student-email-error" role="alert" aria-live="polite" className="text-danger text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-[#548770] text-white font-semibold hover:bg-[#436c5a]"
        >
          Continue
        </button>
      </form>
      <p className="text-xs text-ink-soft mt-3">
        No password needed — this just lets us remember your profile.
      </p>
    </div>
  )
}
