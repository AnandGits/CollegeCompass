import { useEffect, useState } from 'react'
import { listWikiColleges, getWikiCollege, askWiki, type WikiCollege, type WikiCollegeDetail } from '../lib/api'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { SelectField, TextField } from '../components/Field'

export default function Wiki() {
  const [colleges, setColleges] = useState<WikiCollege[]>([])
  const [selected, setSelected] = useState('')
  const [detail, setDetail] = useState<WikiCollegeDetail | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [asking, setAsking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { listWikiColleges().then(setColleges) }, [])
  useEffect(() => {
    setAnswer(null)
    setQuestion('')
    if (!selected) { setDetail(null); return }
    getWikiCollege(selected).then(setDetail)
  }, [selected])

  const ask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    setError('')
    setAsking(true)
    try {
      const r = await askWiki(selected, question.trim())
      setAnswer(r.answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setAsking(false)
    }
  }

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Explore</div>
      <h1 className="font-display font-semibold text-3xl">College Profiles</h1>
      <p className="text-ink-soft mt-1 mb-6">Browse Fiske Guide profiles for every college in our database.</p>

      {colleges.length === 0 ? (
        <p className="text-sm text-ink-soft">College profiles not loaded yet.</p>
      ) : (
        <SelectField
          label="Search or select a college"
          options={['Type to search…', ...colleges.map((c) => c.college_name)]}
          value={selected || 'Type to search…'}
          onChange={(e) => setSelected(e.target.value === 'Type to search…' ? '' : e.target.value)}
        />
      )}

      {detail && (
        <div className="mt-6">
          <h2 className="font-display font-semibold text-2xl">{detail.college_name}</h2>
          <p className="text-sm text-ink-soft">State: {detail.state_code || 'N/A'} · Source: Fiske Guide</p>

          {detail.programs.length > 0 && (
            <p className="text-sm mt-2"><strong>Fiske-recognized programs:</strong> {detail.programs.join(' · ')}</p>
          )}

          <div className="prose-sm mt-4 whitespace-pre-wrap text-sm leading-relaxed">{detail.text || 'No profile available.'}</div>

          <Card className="mt-6">
            <h3 className="font-semibold mb-3">Ask a question about this college</h3>
            <form onSubmit={ask} className="flex flex-col gap-3">
              <TextField
                label="Your question"
                placeholder={`e.g. What is student life like at ${selected}?…`}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              {error && <div className="text-danger text-sm">{error}</div>}
              <Button variant="primary" type="submit" disabled={asking} className="bg-[#548770]! hover:bg-[#436c5a]!">{asking ? 'Searching…' : 'Ask'}</Button>
            </form>
            {answer && <div className="mt-4 text-sm whitespace-pre-wrap">{answer}</div>}
          </Card>
        </div>
      )}
    </div>
  )
}
