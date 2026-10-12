import { useState } from 'react'
import { marked } from 'marked'
import { askAma, type AmaSource } from '../lib/api'
import { trackSubmit } from '../lib/analytics'
import { Card, CardLabel } from '../components/Card'
import { Button } from '../components/Button'
import { TextField } from '../components/Field'

const EXAMPLE_QUESTIONS = [
  "What's UCSD's acceptance rate and tuition?",
  'How should I frame my PIQ if I just changed schools?',
  'What careers use a Computer Science degree?',
  'What is Rolling, Early Action, and Early Decision?',
]

export default function AskMeAnything() {
  const [question, setQuestion] = useState('')
  const [answerHtml, setAnswerHtml] = useState<string | null>(null)
  const [sources, setSources] = useState<AmaSource[]>([])
  const [asking, setAsking] = useState(false)
  const [error, setError] = useState('')

  const ask = async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || asking) return
    setQuestion(trimmed)
    setError('')
    setAsking(true)
    setAnswerHtml(null)
    try {
      const r = await askAma(trimmed)
      setAnswerHtml(marked.parse(r.answer, { async: false }) as string)
      setSources(r.sources)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setAsking(false)
    }
  }

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Resources</div>
      <h1 className="font-display font-semibold text-3xl">Ask Me Anything</h1>
      <p className="text-ink-soft mt-1 mb-6">
        Ask anything about colleges, admissions, essays, or majors — answers are grounded only in CollegeCompass's own
        college database, Fiske Guide profiles, and admissions articles.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); trackSubmit('ama'); ask(question) }} className="flex flex-col gap-3">
        <TextField
          label="Your question"
          placeholder="e.g. What is UCSD's acceptance rate?…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <p className="text-xs text-ink-soft -mt-1">Don't include personal information.</p>
        {error && <div className="text-danger text-sm">{error}</div>}
        <Button variant="primary" type="submit" disabled={asking} className="bg-[#548770]! hover:bg-[#436c5a]!">{asking ? 'Searching…' : 'Ask'}</Button>
      </form>

      {!answerHtml && !asking && (
        <div className="mt-6">
          <h2 className="font-display font-semibold text-xl mb-3">Example questions</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <Button key={q} onClick={() => ask(q)} className="text-left justify-start">{q}</Button>
            ))}
          </div>
        </div>
      )}

      {asking && <p className="text-sm text-ink-soft mt-6">Searching our college data…</p>}

      {answerHtml && (
        <Card className="mt-6">
          <article
            className="prose-sm max-w-none [&_h1]:font-display [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_p]:leading-relaxed [&_p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-2 [&_li]:mt-1 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: answerHtml }}
          />
          {sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <CardLabel>Sources</CardLabel>
              <ul className="text-xs text-ink-soft space-y-1">
                {sources.map((s, i) => <li key={i}>{s.label}</li>)}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
