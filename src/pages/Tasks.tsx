import { useEffect, useState } from 'react'
import { listAllTasks, toggleGlobalTask, listApplications, type FlatTask } from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card } from '../components/Card'
import { SelectField } from '../components/Field'
import { EmptyState } from '../components/EmptyState'

export default function Tasks() {
  return <RequireIdentity prompt="Enter your email to see your tasks.">{(email) => <Body email={email} />}</RequireIdentity>
}

function Body({ email }: { email: string }) {
  const [rows, setRows] = useState<FlatTask[] | null>(null)
  const [colleges, setColleges] = useState<string[]>([])
  const [filterCollege, setFilterCollege] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')

  const refresh = () => listAllTasks(email).then(setRows)
  useEffect(() => {
    refresh()
    listApplications(email).then((apps) => setColleges(apps.map((a) => a.college_name)))
  }, [email])

  if (!rows) return <div className="text-ink-soft">Loading your tasks…</div>
  if (colleges.length === 0) {
    return (
      <div>
        <PageTitle />
        <EmptyState icon="✅" title="No tasks yet" body="Add a college in Applications to generate a starter checklist." />
      </div>
    )
  }

  let filtered = rows
  if (filterCollege !== 'All') filtered = filtered.filter((r) => r.college_name === filterCollege)
  if (filterStatus === 'Incomplete') filtered = filtered.filter((r) => !r.done)
  else if (filterStatus === 'Complete') filtered = filtered.filter((r) => r.done)
  if (filterType !== 'All') filtered = filtered.filter((r) => r.type === filterType)

  return (
    <div>
      <PageTitle />
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <SelectField label="Filter by college" options={['All', ...colleges]} value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)} />
        <SelectField label="Filter by completion" options={['All', 'Incomplete', 'Complete']} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
        <SelectField label="Filter by type" options={['All', 'Task', 'Custom']} value={filterType} onChange={(e) => setFilterType(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="✅" title="Nothing here" body="Try adjusting your filters." />
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <Card key={`${r.app_id}-${r.id}`} className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2.5 min-w-0">
                <input
                  type="checkbox"
                  checked={r.done}
                  onChange={(e) => toggleGlobalTask(email, r.app_id, r.id, e.target.checked).then(refresh)}
                  className="w-4 h-4 shrink-0"
                />
                <span className={r.done ? 'text-ink-soft line-through truncate' : 'truncate'}>{r.name}</span>
              </label>
              <span className="text-xs text-ink-soft shrink-0">
                {r.college_name}{r.due_date ? ` · due ${r.due_date}` : ''}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function PageTitle() {
  return (
    <>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Tasks</div>
      <h1 className="font-display font-semibold text-3xl">Tasks</h1>
      <p className="text-ink-soft mt-1 mb-6">Every checklist item across all your applications.</p>
    </>
  )
}
