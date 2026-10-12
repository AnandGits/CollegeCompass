import { useState } from 'react'
import { QUESTIONS, TYPE_NAMES, TYPE_ICONS, MAX_SCORE, type RiasecType } from '../lib/hollandQuestions'
import { analyzeHolland, type HollandResult } from '../lib/api'
import { trackSubmit } from '../lib/analytics'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField, TextAreaField } from '../components/Field'
import { Seal } from '../components/Seal'

export default function Holland() {
  const [favSubjects, setFavSubjects] = useState('')
  const [subjectWhy, setSubjectWhy] = useState('')
  const [clubs, setClubs] = useState('')
  const [clubsWhy, setClubsWhy] = useState('')
  const [ratings, setRatings] = useState<number[]>(() => QUESTIONS.map(() => 3))
  const [result, setResult] = useState<HollandResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackSubmit('holland')
    const scores: Record<RiasecType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    QUESTIONS.forEach(([, type], i) => { scores[type] += ratings[i] })
    setAnalyzing(true)
    try {
      const r = await analyzeHolland({ scores, fav_subjects: favSubjects, subject_why: subjectWhy, clubs, clubs_why: clubsWhy })
      setResult(r)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Explore</div>
      <h1 className="font-display font-semibold text-3xl">Holland Code (RIASEC) Assessment</h1>
      <p className="text-ink-soft mt-1 mb-6">
        Answer 42 statements honestly to discover your personality type and best-fit careers. Rate each from 1 (Strongly Disagree) to 5 (Strongly Agree).
      </p>

      <Card className="mb-4">
        <div className="font-semibold mb-2">What is the Holland Code?</div>
        <p className="text-sm text-ink-soft">
          The Holland RIASEC model groups people into six personality types based on their interests: Realistic, Investigative,
          Artistic, Social, Enterprising, and Conventional. Your top 3 types form your personal Holland Code (e.g. RIC or SAE).
        </p>
      </Card>

      {!result && (
        <form onSubmit={submit}>
          <Card className="mb-4">
            <div className="font-semibold mb-3">Part 1 — Tell us about you</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Favorite school subjects" placeholder="e.g. Biology, Art, Math…" value={favSubjects} onChange={(e) => setFavSubjects(e.target.value)} />
              <TextField label="School clubs or activities" placeholder="e.g. Robotics club, Drama…" value={clubs} onChange={(e) => setClubs(e.target.value)} />
            </div>
            <div className="mt-4 space-y-4">
              <TextAreaField label="What do you love most about those subjects?" value={subjectWhy} onChange={(e) => setSubjectWhy(e.target.value)} />
              <TextAreaField label="What do you enjoy most about those clubs?" value={clubsWhy} onChange={(e) => setClubsWhy(e.target.value)} />
            </div>
          </Card>

          <Card className="mb-4">
            <div className="font-semibold mb-1">Part 2 — Rate each statement</div>
            <p className="text-sm text-ink-soft mb-4">1 = Strongly Disagree, 5 = Strongly Agree</p>
            <div className="space-y-4">
              {QUESTIONS.map(([question], i) => (
                <div key={i}>
                  <label htmlFor={`q-${i}`} className="text-sm font-medium block mb-1">{i + 1}. {question}</label>
                  <input
                    id={`q-${i}`}
                    type="range"
                    min={1}
                    max={5}
                    value={ratings[i]}
                    onChange={(e) => setRatings((r) => r.map((v, idx) => (idx === i ? Number(e.target.value) : v)))}
                    className="w-full accent-[#548770]"
                  />
                  <div className="text-xs text-ink-soft font-mono">{ratings[i]} / 5</div>
                </div>
              ))}
            </div>
          </Card>

          <Button variant="primary" type="submit" className="w-full bg-[#548770]! hover:bg-[#436c5a]!" disabled={analyzing}>
            {analyzing ? 'Analyzing your personality profile…' : 'See My Results'}
          </Button>
        </form>
      )}

      {result && (
        <div>
          <Card className="mb-4">
            <div className="font-semibold mb-3">Your RIASEC score profile</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {result.sorted_types.map(([t, score]) => (
                <div key={t} className="flex items-center gap-3">
                  <span aria-hidden="true">{TYPE_ICONS[t as RiasecType]}</span>
                  <Seal pct={Math.round((score / MAX_SCORE) * 100)} label={`${TYPE_NAMES[t as RiasecType]} (${t})`} size={56} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-4">
            <div className="font-semibold mb-2">Your Holland Code: {result.holland_code}</div>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">{result.analysis_text}</div>
          </Card>

          <p className="text-xs text-ink-soft mb-4">
            This assessment is for exploration purposes only. Holland Codes are one useful lens — your interests and strengths can span multiple types.
          </p>
        </div>
      )}
    </div>
  )
}
