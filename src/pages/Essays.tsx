import { useEffect, useState } from 'react'
import {
  listEssays, addEssay, updateEssay, removeEssay, duplicateEssay, toggleEssayChecklist,
  listApplications, type Essay,
} from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card, CardLabel } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { TextField, SelectField, TextAreaField } from '../components/Field'
import { EmptyState } from '../components/EmptyState'

const ESSAY_STATUSES = ['Not Started', 'Brainstorming', 'Outline', 'First Draft', 'Revising', 'Final Review', 'Complete']

export default function Essays() {
  return <RequireIdentity prompt="Enter your email to track your essays.">{(email) => <Body email={email} />}</RequireIdentity>
}

function Body({ email }: { email: string }) {
  const [essays, setEssays] = useState<Essay[] | null>(null)
  const [colleges, setColleges] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  const refresh = () => listEssays(email).then(setEssays)
  useEffect(() => {
    refresh()
    listApplications(email).then((apps) => setColleges(apps.map((a) => a.college_name)))
  }, [email])

  if (!essays) return <div className="text-ink-soft">Loading your essays…</div>

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Essays</div>
      <h1 className="font-display font-semibold text-3xl">Essay Tracker</h1>
      <p className="text-ink-soft mt-1 mb-6">Every supplemental essay, in one place.</p>

      {colleges.length === 0 ? (
        <p className="text-sm text-ink-soft mb-4">Add a college in Applications first, then come back here to add its essays.</p>
      ) : (
        <AddEssayForm email={email} colleges={colleges} onAdded={refresh} />
      )}

      {essays.length === 0 ? (
        <EmptyState icon="✍️" title="No essays yet" body="Add your first essay above to start tracking drafts and deadlines." />
      ) : (
        <div className="space-y-3 mt-4">
          {essays.map((e) => (
            <EssayCard
              key={e._id}
              essay={e}
              email={email}
              colleges={colleges}
              expanded={expanded === e._id}
              onToggleExpand={() => setExpanded(expanded === e._id ? null : e._id)}
              onChange={refresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AddEssayForm({ email, colleges, onAdded }: { email: string; colleges: string[]; onAdded: () => void }) {
  const [college, setCollege] = useState(colleges[0] ?? '')
  const [title, setTitle] = useState('')
  const [wordLimit, setWordLimit] = useState(650)
  const [due, setDue] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please enter a prompt title.')
      return
    }
    setError('')
    await addEssay(email, { college_name: college || colleges[0], prompt_title: title.trim(), word_limit: wordLimit, due_date: due.trim() })
    setTitle(''); setDue('')
    onAdded()
  }

  return (
    <Card className="mb-4">
      <CardLabel>Add an essay</CardLabel>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <SelectField label="College" options={colleges} value={college} onChange={(e) => setCollege(e.target.value)} />
        <TextField label="Prompt title" placeholder="e.g. Why Stanford?…" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Word limit" type="number" min={0} value={wordLimit} onChange={(e) => setWordLimit(Number(e.target.value))} />
        <TextField label="Due date (optional)" placeholder="e.g. 2026-11-01…" value={due} onChange={(e) => setDue(e.target.value)} />
        {error && <div className="text-danger text-sm sm:col-span-2">{error}</div>}
        <Button variant="primary" type="submit" className="sm:col-span-2 bg-[#548770]! hover:bg-[#436c5a]!">Add essay</Button>
      </form>
    </Card>
  )
}

function EssayCard({
  essay, email, colleges, expanded, onToggleExpand, onChange,
}: { essay: Essay; email: string; colleges: string[]; expanded: boolean; onToggleExpand: () => void; onChange: () => void }) {
  const [draft, setDraft] = useState(essay)

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold">{essay.prompt_title}</div>
          <div className="text-sm text-ink-soft">{essay.college_name}</div>
        </div>
        <Badge label={essay.status} />
      </div>
      <div className="text-sm text-ink-soft mt-1 font-mono">{essay.current_word_count}/{essay.word_limit} words</div>

      <Button className="w-full mt-3" onClick={onToggleExpand}>{expanded ? 'Hide details' : 'Edit essay'}</Button>

      {expanded && (
        <div className="mt-4 border-t border-border pt-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <SelectField label="College" options={colleges.includes(draft.college_name) ? colleges : [draft.college_name, ...colleges]} value={draft.college_name} onChange={(e) => setDraft({ ...draft, college_name: e.target.value })} />
            <SelectField label="Status" options={ESSAY_STATUSES} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} />
            <TextField label="Due date" value={draft.due_date} onChange={(e) => setDraft({ ...draft, due_date: e.target.value })} />
            <TextField label="Current word count" type="number" min={0} value={draft.current_word_count} onChange={(e) => setDraft({ ...draft, current_word_count: Number(e.target.value) })} />
          </div>
          <TextAreaField label="Full prompt" value={draft.prompt_text} onChange={(e) => setDraft({ ...draft, prompt_text: e.target.value })} />
          <TextAreaField label="Draft text or document link" value={draft.draft_text} onChange={(e) => setDraft({ ...draft, draft_text: e.target.value })} />
          <TextAreaField label="Notes" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />

          <div>
            <CardLabel>Checklist</CardLabel>
            <ul className="space-y-1.5">
              {essay.checklist.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id={`chk-${item.id}`}
                    checked={item.done}
                    onChange={(e) => toggleEssayChecklist(email, essay._id, item.id, e.target.checked).then(onChange)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`chk-${item.id}`} className={item.done ? 'text-ink-soft line-through' : ''}>{item.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={() => updateEssay(email, essay._id, draft).then(onChange)}>Save essay</Button>
            <Button onClick={() => duplicateEssay(email, essay._id).then(onChange)}>Duplicate</Button>
            <Button onClick={() => removeEssay(email, essay._id).then(onChange)}>Delete</Button>
          </div>
        </div>
      )}
    </Card>
  )
}
