import { useEffect, useState } from 'react'
import { getRecommendations, getProfile, listSaved, addSavedCollege, type CollegeResult, type RecommendationResults } from '../lib/api'
import { useIdentity } from '../lib/identity'
import { trackSubmit } from '../lib/analytics'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { TextField, SelectField } from '../components/Field'
import { EmptyState } from '../components/EmptyState'
import { Spinner } from '../components/Spinner'

const OUT_PREF_OPTIONS = [
  { value: 'in_state', label: 'No — in-state only' },
  { value: 'nationwide', label: 'Yes — nationwide' },
  { value: 'specific', label: 'Yes — specific states' },
]

const TAB_INFO: Record<'reach' | 'target' | 'likely', { title: string; body: string }> = {
  reach: {
    title: 'What is a Reach school?',
    body: 'Your profile is below this school\'s typical admitted range. Admission isn\'t guaranteed — these are ambitious picks worth applying to if they\'re otherwise a good fit.',
  },
  target: {
    title: 'What is a Target school?',
    body: 'Your profile matches this school\'s typical admitted range well. You have a solid shot here — these should make up the bulk of your list.',
  },
  likely: {
    title: 'What is a Likely school?',
    body: 'Your profile is above this school\'s typical admitted range. You\'re very likely to be admitted — good schools to have as a safe landing spot.',
  },
}

export default function Recommendations() {
  const { email } = useIdentity()
  const [residentState, setResidentState] = useState('')
  const [outPref, setOutPref] = useState<'in_state' | 'nationwide' | 'specific'>('in_state')
  const [specificStates, setSpecificStates] = useState('')
  const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT')
  const [score, setScore] = useState(1200)
  const [major, setMajor] = useState('')
  const [preference, setPreference] = useState<'Public' | 'Private' | 'Both'>('Both')
  const [campusSize] = useState<string | null>(null)
  const [results, setResults] = useState<RecommendationResults | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'reach' | 'target' | 'likely'>('target')
  const [savedNames, setSavedNames] = useState<string[]>([])

  useEffect(() => {
    if (!email) return
    getProfile(email).then((p) => {
      setResidentState(p.basic?.state ?? '')
      if (p.academics?.test_type === 'ACT') setTestType('ACT')
      if (p.academics?.test_score) setScore(Number(p.academics.test_score))
      setMajor(p.preferences?.intended_major ?? '')
      if (p.preferences?.public_private) setPreference(p.preferences.public_private)
    })
    listSaved(email).then((s) => setSavedNames(s.map((c) => c.college_name)))
  }, [email])

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    trackSubmit('recommendations')
    if (!residentState.trim()) {
      setError('Please enter your resident state.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const r = await getRecommendations({
        resident_state: residentState.trim(),
        out_pref: outPref,
        specific_states: specificStates.split(',').map((s) => s.trim()).filter(Boolean),
        test_type: testType,
        score,
        major: major.trim(),
        preference,
        campus_size: campusSize,
      })
      setResults(r)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Recommendations</div>
      <h1 className="font-display font-semibold text-3xl">College Recommendations</h1>
      <p className="text-ink-soft mt-1 mb-6">Grouped by fit — not fake admissions odds.</p>

      {!email && <p className="text-sm text-ink-soft mb-4">Browsing without a saved profile — sign in from any page below to save schools to a list.</p>}

      <Card className="mb-4">
        <form onSubmit={search} className="grid sm:grid-cols-2 gap-4">
          <TextField label="Resident state" placeholder="e.g. Washington or WA…" value={residentState} onChange={(e) => setResidentState(e.target.value)} />
          <SelectField
            label="Out-of-state colleges?"
            options={OUT_PREF_OPTIONS.map((o) => o.label)}
            value={OUT_PREF_OPTIONS.find((o) => o.value === outPref)?.label}
            onChange={(e) => setOutPref(OUT_PREF_OPTIONS.find((o) => o.label === e.target.value)!.value as typeof outPref)}
          />
          {outPref === 'specific' && (
            <TextField label="States (comma-separated)" placeholder="e.g. California, Oregon…" value={specificStates} onChange={(e) => setSpecificStates(e.target.value)} containerClassName="sm:col-span-2" />
          )}
          <SelectField label="Test type" options={['SAT', 'ACT']} value={testType} onChange={(e) => setTestType(e.target.value as 'SAT' | 'ACT')} />
          <TextField
            label={testType === 'SAT' ? 'SAT score' : 'ACT score'}
            type="number"
            min={testType === 'SAT' ? 400 : 1}
            max={testType === 'SAT' ? 1600 : 36}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
          <TextField label="Preferred major (optional)" placeholder="e.g. Computer Science…" value={major} onChange={(e) => setMajor(e.target.value)} />
          <SelectField label="Institution type" options={['Public', 'Private', 'Both']} value={preference} onChange={(e) => setPreference(e.target.value as typeof preference)} />
          {error && <div className="text-danger text-sm sm:col-span-2">{error}</div>}
          <Button variant="primary" type="submit" className="sm:col-span-2 bg-[#548770]! hover:bg-[#436c5a]! gap-2" disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Searching…' : 'Find My Colleges'}
          </Button>
          {loading && (
            <p className="text-sm text-ink-soft sm:col-span-2 flex items-center gap-2">
              <Spinner className="shrink-0" />
              Our AI is finding your best-fit colleges — this can take up to 20 seconds. Thanks for your patience!
            </p>
          )}
        </form>
      </Card>

      {results && (
        <>
          <div className="flex gap-2 mb-4">
            {(['reach', 'target', 'likely'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setTab(b)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${tab === b ? 'bg-brand text-white' : 'bg-surface border border-border'}`}
              >
                {b} ({results[b].length})
              </button>
            ))}
          </div>

          <Card className="mb-4 bg-brand-tint! border-brand-tint!">
            <div className="font-semibold text-sm">{TAB_INFO[tab].title}</div>
            <div className="text-sm text-ink-soft mt-1">{TAB_INFO[tab].body}</div>
          </Card>

          {results[tab].length === 0 ? (
            <EmptyState icon="📭" title={`No ${tab} schools`} body="Try adjusting your state or institution preference." />
          ) : (
            <div className="space-y-3">
              {results[tab].map((c) => (
                <CollegeCard key={c.college_name} college={c} email={email} isSaved={savedNames.includes(c.college_name)} onSaved={(name) => setSavedNames((prev) => [...prev, name])} />
              ))}
            </div>
          )}
        </>
      )}

      <p className="text-xs text-ink-soft mt-6">Guidance only — not an admissions guarantee. Categories reflect academic/statistical fit, not certainty.</p>
    </div>
  )
}

function CollegeCard({ college, email, isSaved, onSaved }: { college: CollegeResult; email: string; isSaved: boolean; onSaved: (name: string) => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold">{college.college_name}</div>
          <div className="text-sm text-ink-soft">{college.location}</div>
        </div>
        <Badge label={college.bucket_label} />
      </div>
      <div className="text-sm mt-2">{college.reason}</div>
      <div className="text-sm text-ink-soft mt-1">{college.fit}</div>
      <div className="text-sm text-ink-soft">{college.cost}</div>
      {college.popular_majors && <div className="text-sm text-ink-soft mt-1">Popular majors: {college.popular_majors}</div>}

      <div className="flex gap-2 mt-3">
        <Button
          disabled={isSaved || !email}
          onClick={async () => {
            await addSavedCollege(email, { college_name: college.college_name, category: college.bucket_label, location: college.location })
            onSaved(college.college_name)
          }}
        >
          {isSaved ? '★ Saved' : '☆ Save'}
        </Button>
        {college.website && (
          <a
            href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-brand-tint"
          >
            Learn more
          </a>
        )}
      </div>
      {!email && <p className="text-xs text-ink-soft mt-2">Sign in to save colleges to your list.</p>}
    </Card>
  )
}
