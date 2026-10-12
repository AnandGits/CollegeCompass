import { useState } from 'react'
import { findColleges, type CollegeFinderResults, type CollegeFinderSchool } from '../lib/api'
import { trackSubmit } from '../lib/analytics'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField, SelectField, GroupedSelectField } from '../components/Field'
import { EmptyState } from '../components/EmptyState'
import { MAJOR_GROUPS, US_STATES } from '../lib/collegeFinderData'

const SCHOOL_TYPE_OPTIONS = [
  { value: 'all', label: 'All schools' },
  { value: 'public', label: 'Public universities only' },
  { value: 'private', label: 'Private universities only' },
]

const OWNERSHIP_LABEL: Record<number, string> = { 1: 'Public', 2: 'Private Nonprofit', 3: 'Private For-Profit' }
const FIT_LABEL: Record<string, string> = {
  match: 'Match', safety: 'Safety', reach: 'Reach', 'far-reach': 'Far Reach',
  'gpa-match': 'GPA Match', 'gpa-borderline': 'GPA Borderline', 'gpa-below': 'GPA Below', 'gpa-unknown': 'GPA Unknown',
}
const FIT_STYLE: Record<string, string> = {
  match: 'text-success bg-success-tint', 'gpa-match': 'text-success bg-success-tint',
  safety: 'text-brand bg-brand-tint',
  reach: 'text-accent bg-accent-tint', 'gpa-borderline': 'text-accent bg-accent-tint',
  'far-reach': 'text-danger bg-danger-tint', 'gpa-below': 'text-danger bg-danger-tint',
  'gpa-unknown': 'text-ink-soft bg-border/40',
}
const FIT_BORDER: Record<string, string> = {
  match: 'border-l-success', 'gpa-match': 'border-l-success',
  safety: 'border-l-brand',
  reach: 'border-l-accent', 'gpa-borderline': 'border-l-accent',
  'far-reach': 'border-l-danger', 'gpa-below': 'border-l-danger',
  'gpa-unknown': 'border-l-border',
}
const BADGE_STYLE: Record<string, string> = {
  instate: 'text-brand bg-brand-tint',
  guaranteed: 'text-success bg-success-tint',
  local: 'text-success bg-success-tint',
  gamble: 'text-danger bg-danger-tint',
  warning: 'text-accent bg-accent-tint',
  rigor: 'text-danger bg-danger-tint',
  ucdata: 'text-brand bg-brand-tint',
}

const AP_HONORS_MAX = 19

function fmtCurrency(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
function fmtNumber(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}
function fmtPercent(n: number | null) {
  if (n == null) return '—'
  return `${(n * 100).toFixed(1)}%`
}

export default function Search() {
  const [sat, setSat] = useState('')
  const [major, setMajor] = useState('')
  const [schoolType, setSchoolType] = useState<'all' | 'public' | 'private'>('all')
  const [state, setState] = useState('CA')
  const [zip, setZip] = useState('')
  const [gpa, setGpa] = useState('')
  const [apHonors, setApHonors] = useState('')
  const [limit, setLimit] = useState('40')
  const [email, setEmail] = useState('')

  const [results, setResults] = useState<CollegeFinderResults | null>(null)
  const [submittedGPA, setSubmittedGPA] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isCAPublic = schoolType === 'public' && state === 'CA'
  const isPrivate = schoolType === 'private'
  // AP/Honors course count is scored against UC's published admit-by-rigor data,
  // which only exists for CA public campuses — so ask whenever the state is CA
  // and the search can include public schools (Public or All).
  const showApHonors = state === 'CA' && schoolType !== 'private'

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    trackSubmit('calculator')
    if (!major) return setError('Please select a major.')
    if (!state) return setError('Please select a state.')
    if (!isCAPublic && !sat) return setError('SAT score is required.')
    if (showApHonors && apHonors !== '') {
      const n = Number(apHonors)
      if (!Number.isInteger(n) || n < 0 || n > AP_HONORS_MAX)
        return setError(`AP/Honors courses taken must be a whole number from 0 to ${AP_HONORS_MAX}.`)
    }

    setError('')
    setLoading(true)
    setSubmittedGPA(gpa ? parseFloat(gpa) : null)
    try {
      const r = await findColleges({
        major,
        state,
        schoolType,
        sat: !isCAPublic && sat ? Number(sat) : undefined,
        zip: zip || undefined,
        gpa: gpa ? Number(gpa) : undefined,
        apHonors: showApHonors && apHonors !== '' ? Number(apHonors) : undefined,
        limit: limit ? Number(limit) : undefined,
        email: email || undefined,
      })
      setResults(r)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setSat(''); setMajor(''); setSchoolType('all'); setState('CA'); setZip('')
    setGpa(''); setApHonors(''); setLimit('40'); setEmail('')
    setResults(null); setError('')
  }

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Explore</div>
      <h1 className="font-display font-semibold text-3xl">College Calculator</h1>
      <p className="text-ink-soft mt-1 mb-6">Find colleges that match your academic profile, location preferences, and career goals.</p>

      <Card className="mb-4">
        <form onSubmit={search} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <GroupedSelectField label="Intended major" placeholder="Select a major…" groups={MAJOR_GROUPS} value={major} onChange={(e) => setMajor(e.target.value)} required />
          <SelectField
            label="School type"
            options={SCHOOL_TYPE_OPTIONS.map((o) => o.label)}
            value={SCHOOL_TYPE_OPTIONS.find((o) => o.value === schoolType)?.label}
            onChange={(e) => setSchoolType(SCHOOL_TYPE_OPTIONS.find((o) => o.label === e.target.value)!.value as typeof schoolType)}
          />
          <SelectField label="State" options={US_STATES} value={state} onChange={(e) => setState(e.target.value)} />
          {/* <TextField label="Zip code" maxLength={5} placeholder="e.g. 95014" value={zip} onChange={(e) => setZip(e.target.value)} /> */}
          {!isPrivate && (
            <TextField label="Weighted GPA" type="number" min={1} max={5} step={0.1} placeholder="e.g. 4.2" value={gpa} onChange={(e) => setGpa(e.target.value)} />
          )}
          {showApHonors && (
            <TextField
              label="AP/Honors courses taken"
              type="number"
              min={0}
              max={AP_HONORS_MAX}
              step={1}
              placeholder="e.g. 8"
              value={apHonors}
              onChange={(e) => setApHonors(e.target.value)}
            />
          )}
          {!isCAPublic && (
            <TextField label="SAT score" type="number" min={400} max={1600} step={10} placeholder="e.g. 1350" value={sat} onChange={(e) => setSat(e.target.value)} />
          )}
          <TextField label="Max results" type="number" min={5} max={100} value={limit} onChange={(e) => setLimit(e.target.value)} />
          {/* <TextField label="Email results to (optional)" type="email" placeholder="student@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /> */}

          {error && <div className="text-danger text-sm sm:col-span-2 lg:col-span-3">{error}</div>}
          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3">
            <Button variant="primary" type="submit" disabled={loading} className="bg-[#548770]! hover:bg-[#436c5a]!">
              {loading ? 'Searching…' : 'Find Colleges'}
            </Button>
            <Button type="button" onClick={clear}>Clear</Button>
          </div>
        </form>
      </Card>

      {results && (
        results.results.length === 0 ? (
          <EmptyState icon="🔎" title="No schools found" body="Try adjusting your filters." />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-semibold">Results</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-brand bg-brand-tint">{results.count} schools found</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-brand bg-brand-tint">Major tier: {results.majorTier}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {results.results.map((s) => (
                <SchoolCard key={s.id} school={s} studentGPA={submittedGPA} />
              ))}
            </div>
          </>
        )
      )}

      <p className="text-xs text-ink-soft mt-6">Guidance only — not an admissions guarantee. Categories reflect academic/statistical fit, not certainty.</p>
    </div>
  )
}

function gpaGapClass(school: CollegeFinderSchool, studentGPA: number | null) {
  if (studentGPA == null || school.gpaRequired == null) return ''
  const gap = school.gpaRequired - studentGPA
  if (gap > 0.2) return 'text-danger font-semibold'
  if (gap > 0) return 'text-accent font-semibold'
  return 'text-success font-semibold'
}

function SchoolCard({ school, studentGPA }: { school: CollegeFinderSchool; studentGPA: number | null }) {
  const fit = school.fit || 'far-reach'
  return (
    <Card className={`border-l-4 ${FIT_BORDER[fit]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">
            {school.website ? (
              <a href={school.website} target="_blank" rel="noreferrer" className="hover:underline">{school.name}</a>
            ) : school.name}
          </div>
          <div className="text-sm text-ink-soft">{school.city}, {school.state} · {OWNERSHIP_LABEL[school.ownership] ?? ''}</div>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${FIT_STYLE[fit]}`}>{FIT_LABEL[fit]}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
        <Stat label="SAT range" value={school.satRange ? `${school.satRange.low} – ${school.satRange.high}` : '—'} />
        <Stat label="Admit rate" value={fmtPercent(school.admissionRate)} />
        <Stat label="GPA required (major)" value={school.gpaRequired != null ? school.gpaRequired.toFixed(1) : '—'} valueClassName={gpaGapClass(school, studentGPA)} />
        <Stat label="In-state tuition" value={fmtCurrency(school.tuitionInState)} />
        <Stat label="Out-of-state tuition" value={fmtCurrency(school.tuitionOutOfState)} />
        <Stat label="Median earnings (4yr)" value={fmtCurrency(school.medianEarnings)} />
        <Stat label="Enrollment" value={fmtNumber(school.studentSize)} />
      </div>

      {school.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {school.badges.map((b, i) => (
            <span key={i} className={`text-xs font-semibold px-2 py-0.5 rounded ${BADGE_STYLE[b.type] ?? 'text-ink-soft bg-border/40'}`}>{b.label}</span>
          ))}
        </div>
      )}
    </Card>
  )
}

function Stat({ label, value, valueClassName = '' }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-soft font-semibold">{label}</div>
      <div className={`mt-0.5 ${valueClassName}`}>{value}</div>
    </div>
  )
}
