import { useEffect, useState } from 'react'
import { listSaved, updateSaved, removeSaved, type SavedCollege } from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card } from '../components/Card'
import { Button, LinkButton } from '../components/Button'
import { Badge } from '../components/Badge'
import { TextField, SelectField, TextAreaField } from '../components/Field'
import { EmptyState } from '../components/EmptyState'
import { pathFor } from '../lib/nav'

const APPLICATION_PLANS = ['Regular Decision', 'Early Decision', 'Early Action', 'Rolling Admission', 'Not sure yet']
const STATUS_OPTIONS = ['Considering', 'Planning to apply', 'Applied', 'Accepted', 'Waitlisted', 'Denied', 'Committed']

export default function SavedColleges() {
  return <RequireIdentity prompt="Enter your email to view your saved colleges.">{(email) => <Body email={email} />}</RequireIdentity>
}

function Body({ email }: { email: string }) {
  const [saved, setSaved] = useState<SavedCollege[] | null>(null)
  const refresh = () => listSaved(email).then(setSaved)
  useEffect(() => { refresh() }, [email])

  if (!saved) return <div className="text-ink-soft">Loading your saved colleges…</div>

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">My List</div>
      <h1 className="font-display font-semibold text-3xl">Saved Colleges</h1>
      <p className="text-ink-soft mt-1 mb-6">Track the schools you&rsquo;re considering, applying to, and hearing back from.</p>

      {saved.length === 0 ? (
        <>
          <EmptyState icon="⭐" title="No saved colleges yet" body="Save schools from College Recommendations to start building your list." />
          <LinkButton variant="primary" to={pathFor('recommendations')} className="mt-4">Go to Recommendations</LinkButton>
        </>
      ) : (
        <div className="space-y-3">
          {saved.map((c) => (
            <SavedCard key={c._id} college={c} onChange={refresh} />
          ))}
        </div>
      )}
    </div>
  )
}

function SavedCard({ college, onChange }: { college: SavedCollege; onChange: () => void }) {
  const [draft, setDraft] = useState(college)
  const [savedMsg, setSavedMsg] = useState(false)

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold">{college.college_name || 'Unknown'}</div>
          <div className="text-sm text-ink-soft">{college.location}</div>
        </div>
        <Badge label={college.category || 'target'} />
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-3">
        <SelectField label="Application plan" options={APPLICATION_PLANS} value={draft.application_plan} onChange={(e) => setDraft({ ...draft, application_plan: e.target.value })} />
        <TextField label="Deadline" placeholder="e.g. Nov 1…" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} />
        <SelectField label="Status" options={STATUS_OPTIONS} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} />
      </div>
      <div className="mt-3">
        <TextField label="Intended major" value={draft.intended_major} onChange={(e) => setDraft({ ...draft, intended_major: e.target.value })} />
      </div>
      <div className="mt-3">
        <TextAreaField label="Notes" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
      </div>

      <div className="flex items-center gap-3 mt-3">
        <Button
          variant="primary"
          onClick={async () => {
            await updateSaved(college._id, draft)
            setSavedMsg(true)
          }}
        >
          Save changes
        </Button>
        {savedMsg && <span className="text-sm text-success" role="status">Updated.</span>}
        <Button onClick={() => removeSaved(college._id).then(onChange)}>Remove</Button>
      </div>
    </Card>
  )
}
