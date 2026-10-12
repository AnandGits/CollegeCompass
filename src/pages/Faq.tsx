import { useEffect, useState } from 'react'
import { listFaq, type Faq as FaqType } from '../lib/api'
import { Card } from '../components/Card'
import { SelectField } from '../components/Field'
import localFaqs from '../data/faqs.json'

// 'local' reads the bundled src/data/faqs.json snapshot; 'mongodb' calls the live /api/faq endpoint.
const FAQ_SOURCE = (import.meta.env.VITE_FAQ_SOURCE ?? 'local') as 'local' | 'mongodb'

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqType[]>([])
  const [source, setSource] = useState('All')
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  useEffect(() => {
    if (FAQ_SOURCE === 'mongodb') {
      listFaq().then((data) => setFaqs(data.slice(0, 10)))
    } else {
      setFaqs(localFaqs.slice(0, 10))
    }
  }, [])

  const sources = Array.from(new Set(faqs.map((f) => f.source).filter((s): s is string => Boolean(s)))).sort()
  const filtered = source === 'All' ? faqs : faqs.filter((f) => f.source === source)

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Resources</div>
      <h1 className="font-display font-semibold text-3xl">Top 10 FAQ on College Admission</h1>
      <p className="text-ink-soft mt-1 mb-6">Answers sourced from curated college admissions articles.</p>

      {faqs.length === 0 ? (
        <p className="text-sm text-ink-soft">No FAQs available yet.</p>
      ) : (
        <>
          {sources.length > 0 && (
            <SelectField label="Filter by article" options={['All', ...sources]} value={source} onChange={(e) => setSource(e.target.value)} />
          )}
          <div className="space-y-2 mt-4">
            {filtered.map((f, i) => (
              <Card key={i}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="text-left font-semibold w-full">
                  {f.question}
                </button>
                {openIdx === i && (
                  <div className="mt-2 text-sm">
                    <p>{f.answer}</p>
                    {f.source && <p className="text-xs text-ink-soft mt-2">Source: {f.source}</p>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Ask your own question — disabled for now
      <Card className="mt-6">
        <div className="font-semibold mb-1">Ask your own question</div>
        <p className="text-sm text-ink-soft mb-3">Ask anything about college admissions — answers are based on our article library only.</p>
        <form onSubmit={ask} className="flex flex-col gap-3">
          <TextField label="Your question" placeholder="e.g. How do I write a strong college essay?…" value={question} onChange={(e) => setQuestion(e.target.value)} />
          {error && <div className="text-danger text-sm">{error}</div>}
          <Button variant="primary" type="submit" disabled={asking} className="bg-[#548770]! hover:bg-[#436c5a]!">{asking ? 'Searching…' : 'Ask'}</Button>
        </form>
        {asked && !asking && answer === null && (
          <p className="text-sm text-accent mt-3">No relevant information found in our article library for that question.</p>
        )}
        {answer && <div className="text-sm whitespace-pre-wrap mt-3">{answer}</div>}
      </Card>
      */}
    </div>
  )
}
