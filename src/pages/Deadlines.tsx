import { useEffect, useState } from 'react'
import { listDeadlines, addDeadline, updateDeadline, removeDeadline, listApplications, type DeadlineRow } from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card, CardLabel } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { TextField, SelectField } from '../components/Field'
import { EmptyState } from '../components/EmptyState'

const DEADLINE_TYPES = [
  'Early Decision', 'Early Action', 'Restrictive Early Action', 'Regular Decision',
  'Rolling Admission', 'Scholarship', 'Honors College', 'FAFSA', 'CSS Profile',
  'Portfolio', 'Interview', 'Recommendation', 'Transcript', 'Testing', 'Other',
]
const PRIORITIES = ['High', 'Medium', 'Low']

export default function Deadlines() {
  return <RequireIdentity prompt="Enter your email to see your deadlines.">{(email) => <Body email={email} />}</RequireIdentity>
}

function Body({ email }: { email: string }) {
  const [rows, setRows] = useState<DeadlineRow[] | null>(null)
  const [colleges, setColleges] = useState<string[]>([])
  const [hideDone, setHideDone] = useState(false)

  const refresh = () => listDeadlines(email).then(setRows)
  useEffect(() => {
    refresh()
    listApplications(email).then((apps) => setColleges(apps.map((a) => a.college_name)))
  }, [email])

  if (!rows) return <div className="text-ink-soft">Loading your deadlines…</div>
  const visible = hideDone ? rows.filter((r) => !r.done) : rows

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Deadlines</div>
      <h1 className="font-display font-semibold text-3xl">Deadlines</h1>
      <p className="text-ink-soft mt-1 mb-6">Every application, essay, and financial-aid deadline in one place.</p>

      <AddDeadlineForm email={email} colleges={colleges} onAdded={refresh} />

      {rows.length === 0 ? (
        <EmptyState icon="📅" title="No deadlines yet" body="Add a college in Applications or a custom deadline above." />
      ) : (
        <>
          <label className="flex items-center gap-2 text-sm mb-3 mt-4">
            <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="w-4 h-4" />
            Hide completed
          </label>
          <div className="space-y-2">
            {visible.map((r) => (
              <DeadlineCard key={r.id} row={r} email={email} onChange={refresh} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function AddDeadlineForm({ email, colleges, onAdded }: { email: string; colleges: string[]; onAdded: () => void }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState(DEADLINE_TYPES[0])
  const [due, setDue] = useState('')
  const [college, setCollege] = useState('(General)')
  const [priority, setPriority] = useState('Medium')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !due.trim()) {
      setError('Title and due date are required.')
      return
    }
    setError('')
    await addDeadline(email, {
      title: title.trim(), deadline_type: type, due_date: due.trim(),
      college_name: college === '(General)' ? '' : college, priority, notes: notes.trim(),
    })
    setTitle(''); setDue(''); setNotes('')
    onAdded()
  }

  return (
    <Card className="mb-4">
      <CardLabel>Add a deadline</CardLabel>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <TextField label="Title" placeholder="e.g. Submit FAFSA…" value={title} onChange={(e) => setTitle(e.target.value)} />
        <SelectField label="Type" options={DEADLINE_TYPES} value={type} onChange={(e) => setType(e.target.value)} />
        <TextField label="Due date" placeholder="e.g. 2026-12-01…" value={due} onChange={(e) => setDue(e.target.value)} />
        <SelectField label="College (optional)" options={['(General)', ...colleges]} value={college} onChange={(e) => setCollege(e.target.value)} />
        <SelectField label="Priority" options={PRIORITIES} value={priority} onChange={(e) => setPriority(e.target.value)} />
        <TextField label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {error && <div className="text-danger text-sm sm:col-span-2">{error}</div>}
        <Button variant="primary" type="submit" className="sm:col-span-2 bg-[#548770]! hover:bg-[#436c5a]!">Add deadline</Button>
      </form>
    </Card>
  )
}

function DeadlineCard({ row, email, onChange }: { row: DeadlineRow; email: string; onChange: () => void }) {
  const isCustom = row.source === 'custom'
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold truncate">{row.title}</div>
          <div className="text-sm text-ink-soft">{row.college_name || 'General'} · {row.type}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge label={row.urgency} />
          <span className="text-xs text-ink-soft font-mono">{row.due_date}</span>
        </div>
      </div>
      {isCustom && (
        <div className="flex items-center gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!row.done}
              onChange={(e) => updateDeadline(email, row.id, { done: e.target.checked }).then(onChange)}
              className="w-4 h-4"
            />
            Done
          </label>
          <button onClick={() => removeDeadline(email, row.id).then(onChange)} className="text-xs text-danger font-semibold">
            Remove
          </button>
        </div>
      )}
      {!isCustom && (
        <div className="text-xs text-ink-soft mt-2">{row.done ? 'Done' : 'Tracked via Applications'}</div>
      )}
    </Card>
  )
}
