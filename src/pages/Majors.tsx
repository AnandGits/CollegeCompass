import { useEffect, useState } from 'react'
import { listMajors, getMajor, type MajorSummary, type MajorDetail } from '../lib/api'
import { Card, CardLabel } from '../components/Card'
import { SelectField } from '../components/Field'

export default function Majors() {
  const [majors, setMajors] = useState<MajorSummary[]>([])
  const [selected, setSelected] = useState('')
  const [detail, setDetail] = useState<MajorDetail | null>(null)

  useEffect(() => { listMajors().then(setMajors) }, [])
  useEffect(() => {
    if (!selected) { setDetail(null); return }
    getMajor(selected).then(setDetail)
  }, [selected])

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Explore</div>
      <h1 className="font-display font-semibold text-3xl">Majors &amp; Careers Explorer</h1>
      <p className="text-ink-soft mt-1 mb-6">Browse college majors, typical careers, and median earnings data.</p>

      {majors.length === 0 ? (
        <p className="text-sm text-ink-soft">Major data not loaded yet.</p>
      ) : (
        <SelectField
          label="Search or select a major"
          options={['Type to search…', ...majors.map((m) => m.title)]}
          value={selected || 'Type to search…'}
          onChange={(e) => setSelected(e.target.value === 'Type to search…' ? '' : e.target.value)}
        />
      )}

      {detail && (
        <div className="mt-6">
          <h2 className="font-display font-semibold text-2xl">{detail.title}</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardLabel>Median earnings (2 yrs after graduation)</CardLabel>
              <div className="font-mono text-2xl font-semibold">${detail.median_earnings_2yr.toLocaleString()}</div>
            </Card>
            <Card>
              <CardLabel>Schools reporting</CardLabel>
              <div className="font-mono text-2xl font-semibold">{detail.schools_reporting}</div>
            </Card>
          </div>

          <p className="text-xs italic text-ink-soft mt-2">
            Earnings data is sourced from a national government database. Actual median earnings can vary depending on the employer, industry, and location.
          </p>

          {detail.description && (
            <p className="mt-4"><strong>About this major:</strong> {detail.description}</p>
          )}

          {detail.careers && detail.careers.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-1">Common career paths:</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {detail.careers.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}

          {detail.fiske && (
            <div className="mt-6">
              <div className="font-semibold mb-2">Colleges recognized by Fiske Guide for {detail.fiske.area}:</div>
              {Object.entries(detail.fiske.by_category).map(([category, names]) => (
                <Card key={category} className="mb-2">
                  <CardLabel>{category}</CardLabel>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {names.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
