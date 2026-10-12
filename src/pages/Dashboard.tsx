import { useEffect, useState } from 'react'
import { getDashboard, type DashboardData } from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card, CardLabel } from '../components/Card'
import { Seal } from '../components/Seal'
import { Badge } from '../components/Badge'
import { ChecklistRow } from '../components/ChecklistRow'
import { LinkButton } from '../components/Button'
import { pathFor } from '../lib/nav'

export default function Dashboard() {
  return (
    <RequireIdentity>
      {(email) => <DashboardBody email={email} />}
    </RequireIdentity>
  )
}

function DashboardBody({ email }: { email: string }) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard(email)
      .then(setData)
      .catch(() => setError('Could not load your dashboard right now. Try again shortly.'))
  }, [email])

  if (error) return <div className="text-danger">{error}</div>
  if (!data) return <div className="text-ink-soft">Loading your dashboard…</div>

  const remaining = data.onboarding.filter((o) => !o.done)
  const primaryLabel = data.profile_pct < 80 ? 'Complete your profile' : data.applications.length === 0 ? 'Add a college' : 'Continue your applications'
  const primaryTarget = data.profile_pct < 80 ? 'profile' : 'applications'

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">
        Dashboard · {data.season}
      </div>
      <h1 className="font-display font-semibold text-3xl">
        {data.name ? `Welcome back, ${data.name}` : 'Welcome back'}
      </h1>

      <div className="grid sm:grid-cols-3 gap-4 mt-6 items-center">
        <Seal pct={data.profile_pct} label="Profile" />
        <Seal pct={data.application_pct} label="Applications" />
        <div>
          <CardLabel>Primary action</CardLabel>
          <LinkButton variant="primary" className="w-full" to={pathFor(primaryTarget)}>
            {primaryLabel}
          </LinkButton>
        </div>
      </div>

      {remaining.length > 0 && (
        <Card className="mt-6">
          <CardLabel>Get started</CardLabel>
          {data.onboarding.map((item) => (
            <ChecklistRow
              key={item.label}
              label={item.label}
              done={item.done}
              to={pathFor(item.target)}
            />
          ))}
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardLabel>Upcoming deadlines</CardLabel>
          {data.upcoming_deadlines.length === 0 && (
            <div className="text-sm text-ink-soft">No deadlines yet.</div>
          )}
          <div className="space-y-2">
            {data.upcoming_deadlines.map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-sm">
                <Badge label={d.urgency} />
                <span className="font-semibold">{d.title}</span>
                <span className="text-ink-soft font-mono text-xs">{d.due_date}</span>
              </div>
            ))}
          </div>
          <LinkButton className="w-full mt-3" to={pathFor('deadlines')}>
            View all deadlines
          </LinkButton>
        </Card>

        <Card>
          <CardLabel>Recommended next step</CardLabel>
          <div className="text-sm">{data.recommendation}</div>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardLabel>My applications</CardLabel>
          {data.applications.length === 0 && (
            <div className="text-sm text-ink-soft">No applications yet.</div>
          )}
          <div className="space-y-2">
            {data.applications.map((a) => (
              <div key={a.college_name} className="text-sm">
                <span className="font-semibold">{a.college_name}</span> — {a.stage} · {a.pct}% complete
              </div>
            ))}
          </div>
          <LinkButton className="w-full mt-3" to={pathFor('applications')}>
            Open Applications
          </LinkButton>
        </Card>

        <Card>
          <CardLabel>Recent activity</CardLabel>
          {data.recent_activity.length === 0 && (
            <div className="text-sm text-ink-soft">Nothing yet — start by adding a college.</div>
          )}
          <div className="space-y-1.5">
            {data.recent_activity.map((text, i) => (
              <div key={i} className="text-sm text-ink-soft">• {text}</div>
            ))}
          </div>
        </Card>
      </div>

      <h2 className="font-display font-semibold text-xl mt-8 mb-3">Quick actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <LinkButton to={pathFor('recommendations')}>
          <span aria-hidden="true">🎯</span>&nbsp;&nbsp;Get recommendations
        </LinkButton>
        <LinkButton to={pathFor('advisor')}>
          <span aria-hidden="true">💬</span>&nbsp;&nbsp;Ask the AI Advisor
        </LinkButton>
        <LinkButton to={pathFor('essays')}>
          <span aria-hidden="true">✍️</span>&nbsp;&nbsp;Essay Tracker
        </LinkButton>
        <LinkButton to={pathFor('deadlines')}>
          <span aria-hidden="true">📅</span>&nbsp;&nbsp;Deadlines
        </LinkButton>
      </div>
    </div>
  )
}
