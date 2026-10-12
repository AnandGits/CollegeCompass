import { useEffect, useState } from 'react'
import {
  listApplications, addApplication, setApplicationStage, removeApplication,
  toggleTask, addTask, removeTask, type Application,
} from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card, CardLabel } from '../components/Card'
import { Button } from '../components/Button'
import { TextField, SelectField } from '../components/Field'
import { EmptyState } from '../components/EmptyState'
import { Seal } from '../components/Seal'

const ROUND_OPTIONS = ['Regular Decision', 'Early Decision', 'Early Action', 'Restrictive Early Action', 'Rolling Admission']
const STAGES = ['Considering', 'Planning', 'In Progress', 'Ready to Submit', 'Submitted', 'Decision Received']

export default function Applications() {
  return <RequireIdentity prompt="Enter your email to track your college applications.">{(email) => <Body email={email} />}</RequireIdentity>
}

function Body({ email }: { email: string }) {
  const [apps, setApps] = useState<Application[] | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const refresh = () => listApplications(email).then(setApps)
  useEffect(() => { refresh() }, [email])

  if (!apps) return <div className="text-ink-soft">Loading your applications…</div>

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Applications</div>
      <h1 className="font-display font-semibold text-3xl">Applications</h1>
      <p className="text-ink-soft mt-1 mb-6">Your application workspace — one checklist for every college.</p>

      <AddApplicationForm email={email} onAdded={refresh} />

      {apps.length === 0 ? (
        <EmptyState icon="🗂️" title="No applications yet" body="Add your first college above to start tracking tasks and deadlines." />
      ) : (
        <div className="space-y-3 mt-4">
          {apps.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              email={email}
              expanded={expanded === app._id}
              onToggleExpand={() => setExpanded(expanded === app._id ? null : app._id)}
              onChange={refresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AddApplicationForm({ email, onAdded }: { email: string; onAdded: () => void }) {
  const [name, setName] = useState('')
  const [round, setRound] = useState(ROUND_OPTIONS[0])
  const [deadline, setDeadline] = useState('')
  const [major, setMajor] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a college name.')
      return
    }
    setError('')
    await addApplication(email, { college_name: name.trim(), application_round: round, deadline: deadline.trim(), intended_major: major.trim() })
    setName(''); setDeadline(''); setMajor('')
    onAdded()
  }

  return (
    <Card className="mb-4">
      <CardLabel>Add a college</CardLabel>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <TextField label="College name" value={name} onChange={(e) => setName(e.target.value)} />
        <SelectField label="Application round" options={ROUND_OPTIONS} value={round} onChange={(e) => setRound(e.target.value)} />
        <TextField label="Deadline" placeholder="e.g. 2026-11-01…" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <TextField label="Intended major (optional)" value={major} onChange={(e) => setMajor(e.target.value)} />
        {error && <div className="text-danger text-sm sm:col-span-2">{error}</div>}
        <Button variant="primary" type="submit" className="sm:col-span-2 bg-[#548770]! hover:bg-[#436c5a]!">Add to Applications</Button>
      </form>
    </Card>
  )
}

function ApplicationCard({
  app, email, expanded, onToggleExpand, onChange,
}: { app: Application; email: string; expanded: boolean; onToggleExpand: () => void; onChange: () => void }) {
  const done = app.tasks.filter((t) => t.done).length
  const pct = app.tasks.length ? Math.round((done / app.tasks.length) * 100) : 0
  const [newTask, setNewTask] = useState('')

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold truncate">{app.college_name}</div>
          <div className="text-sm text-ink-soft">{app.application_round} {app.deadline && `· Due ${app.deadline}`}</div>
        </div>
        <Seal pct={pct} label="" size={48} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <SelectField
          label="Stage"
          options={STAGES}
          value={app.stage}
          onChange={(e) => setApplicationStage(email, app._id, e.target.value).then(onChange)}
        />
        <div className="flex items-end">
          <Button className="w-full" onClick={onToggleExpand}>{expanded ? 'Hide checklist' : `Checklist (${done}/${app.tasks.length})`}</Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-border pt-4">
          <ul className="space-y-2">
            {app.tasks.map((t) => (
              <li key={t.id} className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id={`task-${t.id}`}
                  checked={t.done}
                  onChange={(e) => toggleTask(email, app._id, t.id, e.target.checked).then(onChange)}
                  className="w-4 h-4"
                />
                <label htmlFor={`task-${t.id}`} className={t.done ? 'text-ink-soft line-through flex-1' : 'flex-1'}>{t.name}</label>
                <button
                  onClick={() => removeTask(email, app._id, t.id).then(onChange)}
                  aria-label={`Remove task: ${t.name}`}
                  className="text-xs text-danger"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <form
            className="flex gap-2 mt-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (!newTask.trim()) return
              addTask(email, app._id, newTask.trim()).then(() => { setNewTask(''); onChange() })
            }}
          >
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task…"
              aria-label="Add a task"
              className="flex-1 min-h-10 px-3 rounded-lg border border-border bg-surface"
            />
            <Button variant="primary" type="submit" className="bg-[#548770]! hover:bg-[#436c5a]!">Add</Button>
          </form>
          <Button className="w-full mt-3" onClick={() => removeApplication(email, app._id).then(onChange)}>
            Remove this application
          </Button>
        </div>
      )}
    </Card>
  )
}
