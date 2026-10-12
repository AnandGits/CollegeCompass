import { useEffect, useRef, useState } from 'react'
import {
  listConversations, getAdvisorPrompts, newConversation, advisorChat, getProfile,
  type ChatMessage, type Conversation,
} from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card, CardLabel } from '../components/Card'
import { Button } from '../components/Button'

export default function Advisor() {
  return <RequireIdentity prompt="Enter your email so the AI Advisor can use your saved profile.">{(email) => <Body email={email} />}</RequireIdentity>
}

function Body({ email }: { email: string }) {
  const [convId, setConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [prompts, setPrompts] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [profileCompleteness, setProfileCompleteness] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getAdvisorPrompts().then(setPrompts)
    getProfile(email).then((p) => {
      const filled = [p.basic?.grade, p.basic?.grad_year, p.basic?.state, p.academics?.gpa, p.academics?.test_score, p.preferences?.intended_major].filter(Boolean).length
      setProfileCompleteness(Math.round((filled / 6) * 100))
    })
    listConversations(email).then((convs) => {
      setConversations(convs)
      if (convs.length > 0) {
        setConvId(convs[0]._id)
        setMessages(convs[0].messages)
      } else {
        newConversation(email).then((r) => setConvId(r.conv_id))
      }
    })
  }, [email])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startNew = async () => {
    const r = await newConversation(email)
    setConvId(r.conv_id)
    setMessages([])
  }

  const send = async (text: string) => {
    if (!text.trim() || !convId || sending) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setSending(true)
    try {
      const { reply } = await advisorChat(email, convId, next)
      setMessages([...next, { role: 'assistant', content: reply }])
      listConversations(email).then(setConversations)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">AI Advisor</div>
      <h1 className="font-display font-semibold text-3xl">AI Advisor</h1>
      <p className="text-ink-soft mt-1">Personalized guidance based on your saved student profile.</p>
      <p className="text-sm text-ink-soft mt-2">
        💡 This is guidance to help you think, not an admissions guarantee — always verify deadlines and requirements on official college websites.
      </p>

      {profileCompleteness !== null && profileCompleteness < 40 && (
        <p className="text-sm text-accent mt-2">
          Your profile is mostly empty — answers will be generic until you add academics and activities in My Profile.
        </p>
      )}

      <div className="flex justify-end my-4">
        <Button onClick={startNew}>+ New conversation</Button>
      </div>

      {conversations.length > 1 && (
        <Card className="mb-4">
          <CardLabel>Conversation history ({conversations.length})</CardLabel>
          <div className="flex flex-col gap-1.5">
            {conversations.map((c) => (
              <button
                key={c._id}
                onClick={() => { setConvId(c._id); setMessages(c.messages) }}
                className={`text-left text-sm px-3 py-2 rounded-lg ${c._id === convId ? 'bg-brand text-white' : 'hover:bg-brand-tint'}`}
              >
                {c.title || 'Untitled conversation'}
              </button>
            ))}
          </div>
        </Card>
      )}

      {messages.length === 0 ? (
        <div>
          <h2 className="font-display font-semibold text-xl mb-3">Suggested questions</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {prompts.map((p) => (
              <Button key={p} onClick={() => send(p)} className="text-left justify-start">{p}</Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-brand text-white' : 'bg-surface border border-border'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {sending && <div className="text-sm text-ink-soft">Thinking…</div>}
          <div ref={bottomRef} />
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input) }}
        className="flex gap-2 sticky bottom-4 mt-4"
      >
        <label htmlFor="advisor-input" className="sr-only">Ask about your profile, activities, majors, or college list</label>
        <input
          id="advisor-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your profile, activities, majors, or college list…"
          className="flex-1 min-h-11 px-3 rounded-lg border border-border bg-surface"
        />
        <Button variant="primary" type="submit" disabled={sending} className="bg-[#548770]! hover:bg-[#436c5a]!">Send</Button>
      </form>
    </div>
  )
}
