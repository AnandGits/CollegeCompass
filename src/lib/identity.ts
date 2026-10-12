import { useCallback, useState } from 'react'

const KEY = 'ci_student_email'

export function useIdentity() {
  const [email, setEmailState] = useState(() => localStorage.getItem(KEY) ?? '')

  const setEmail = useCallback((value: string) => {
    const clean = value.trim().toLowerCase()
    localStorage.setItem(KEY, clean)
    setEmailState(clean)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(KEY)
    setEmailState('')
  }, [])

  return { email, setEmail, signOut }
}
