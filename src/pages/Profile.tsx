import { useEffect, useState } from 'react'
import { getProfile, saveProfile, type Profile as ProfileType } from '../lib/api'
import { RequireIdentity } from '../components/RequireIdentity'
import { Card, CardLabel } from '../components/Card'
import { Button } from '../components/Button'
import { TextField, TextAreaField, SelectField } from '../components/Field'

const GRADE_OPTIONS = ['9th (Freshman)', '10th (Sophomore)', '11th (Junior)', '12th (Senior)']
const SCHOOL_TYPE_OPTIONS = ['Public school', 'Private school', 'Charter school', 'Homeschool', 'Other']
const RIGOR_OPTIONS = ['Mostly standard / college-prep', 'Some Honors', 'Mostly Honors', 'AP/IB heavy', 'Dual-enrollment heavy']
const ACTIVITY_CATEGORIES = ['Academic', 'Athletics', 'Arts', 'Community Service', 'Leadership', 'Work Experience', 'Clubs', 'Research', 'Other']
const AWARD_LEVELS = ['School', 'Regional', 'State', 'National', 'International']
const AWARD_CATEGORIES = ['Academic', 'Athletic', 'Arts', 'Leadership', 'Community Service', 'Other']
const CAMPUS_SIZE_OPTIONS = ['Any', 'Small (under 10,000)', 'Medium (10,000-25,000)', 'Large (25,000+)']
const PUBLIC_PRIVATE_OPTIONS = ['Both', 'Public', 'Private']
const SETTING_OPTIONS = ['Any', 'Urban', 'Suburban', 'Rural']
const BUDGET_OPTIONS = ['Not sure yet', 'Under $20k/year', '$20k-$40k/year', '$40k-$60k/year', '$60k+/year', 'No budget constraint']
const AID_OPTIONS = ['Not sure yet', 'Significant need', 'Some need', 'Minimal need', 'Full-pay']
const DISTANCE_OPTIONS = ['No preference', 'Within driving distance', 'Same state', 'Same region', 'Anywhere in the US']

const thisYear = new Date().getFullYear()
const GRAD_YEARS = Array.from({ length: 5 }, (_, i) => String(thisYear + i))

export default function Profile() {
  return <RequireIdentity prompt="Enter your email to build and save your student profile.">{(email) => <ProfileBody email={email} />}</RequireIdentity>
}

function ProfileBody({ email }: { email: string }) {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getProfile(email).then(setProfile)
  }, [email])

  if (!profile) return <div className="text-ink-soft">Loading your profile…</div>

  const update = (section: keyof ProfileType, key: string, value: unknown) => {
    setProfile({ ...profile, [section]: { ...(profile[section] as object), [key]: value } })
    setSaved(false)
  }

  const handleSave = async () => {
    await saveProfile(email, profile)
    setSaved(true)
  }

  const b = profile.basic, a = profile.academics, p = profile.preferences

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Student Profile</div>
      <h1 className="font-display font-semibold text-3xl">My Profile</h1>
      <p className="text-ink-soft mt-1 mb-6">This powers your AI Advisor conversations and college recommendations.</p>

      <Card className="mb-4">
        <CardLabel>Basic information</CardLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Name (optional)" value={b.name ?? ''} onChange={(e) => update('basic', 'name', e.target.value)} />
          <SelectField label="Grade level" options={GRADE_OPTIONS} value={b.grade || GRADE_OPTIONS[0]} onChange={(e) => update('basic', 'grade', e.target.value)} />
          <SelectField label="Graduation year" options={GRAD_YEARS} value={b.grad_year || GRAD_YEARS[0]} onChange={(e) => update('basic', 'grad_year', e.target.value)} />
          <TextField label="State" placeholder="e.g. California or CA…" value={b.state ?? ''} onChange={(e) => update('basic', 'state', e.target.value)} />
          <SelectField label="School type (optional)" options={SCHOOL_TYPE_OPTIONS} value={b.school_type || SCHOOL_TYPE_OPTIONS[0]} onChange={(e) => update('basic', 'school_type', e.target.value)} />
        </div>
      </Card>

      <Card className="mb-4">
        <CardLabel>Academics</CardLabel>
        <div className="grid sm:grid-cols-3 gap-4">
          <TextField label="GPA" type="number" step="0.01" min="0" max="110" value={a.gpa ?? ''} onChange={(e) => update('academics', 'gpa', e.target.value)} />
          <SelectField label="GPA scale" options={['4.0', '5.0', '100-point', 'Other']} value={a.gpa_scale || '4.0'} onChange={(e) => update('academics', 'gpa_scale', e.target.value)} />
          <SelectField
            label="Weighted or unweighted?"
            options={['Weighted', 'Unweighted']}
            value={a.weighted === false ? 'Unweighted' : 'Weighted'}
            onChange={(e) => update('academics', 'weighted', e.target.value === 'Weighted')}
          />
          <TextField label="Class rank (optional)" placeholder="e.g. 45/320 or Top 10%…" value={a.class_rank ?? ''} onChange={(e) => update('academics', 'class_rank', e.target.value)} />
          <SelectField label="Course rigor" options={RIGOR_OPTIONS} value={a.rigor || RIGOR_OPTIONS[0]} onChange={(e) => update('academics', 'rigor', e.target.value)} />
          <SelectField label="Test type" options={['SAT', 'ACT', "Haven't tested / test-optional"]} value={a.test_type || 'SAT'} onChange={(e) => update('academics', 'test_type', e.target.value)} />
        </div>
        <div className="mt-4">
          <TextAreaField
            label="AP, IB, Honors, and dual-enrollment classes (optional)"
            placeholder="e.g. AP Calculus BC, AP US History, Honors Chemistry…"
            value={a.advanced_classes ?? ''}
            onChange={(e) => update('academics', 'advanced_classes', e.target.value)}
          />
        </div>
        {a.test_type !== "Haven't tested / test-optional" && (
          <div className="mt-4 max-w-xs">
            <TextField
              label={a.test_type === 'ACT' ? 'ACT score' : 'SAT score'}
              type="number"
              value={a.test_score ?? ''}
              onChange={(e) => update('academics', 'test_score', e.target.value)}
            />
          </div>
        )}
      </Card>

      <ActivitiesEditor profile={profile} setProfile={setProfile} />
      <AwardsEditor profile={profile} setProfile={setProfile} />

      <Card className="mb-4">
        <CardLabel>Interests &amp; preferences</CardLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Intended major" placeholder="e.g. Computer Science…" value={p.intended_major ?? ''} onChange={(e) => update('preferences', 'intended_major', e.target.value)} />
          <TextField label="Alternate major (optional)" value={p.alternate_major ?? ''} onChange={(e) => update('preferences', 'alternate_major', e.target.value)} />
          <TextField label="Preferred location (optional)" placeholder="e.g. Northeast, West Coast…" value={p.location ?? ''} onChange={(e) => update('preferences', 'location', e.target.value)} />
          <SelectField label="Campus size (optional)" options={CAMPUS_SIZE_OPTIONS} value={p.campus_size || CAMPUS_SIZE_OPTIONS[0]} onChange={(e) => update('preferences', 'campus_size', e.target.value)} />
          <SelectField label="Public or private?" options={PUBLIC_PRIVATE_OPTIONS} value={p.public_private || 'Both'} onChange={(e) => update('preferences', 'public_private', e.target.value)} />
          <SelectField label="Campus setting (optional)" options={SETTING_OPTIONS} value={p.setting || SETTING_OPTIONS[0]} onChange={(e) => update('preferences', 'setting', e.target.value)} />
          <SelectField label="Budget (optional)" options={BUDGET_OPTIONS} value={p.budget || BUDGET_OPTIONS[0]} onChange={(e) => update('preferences', 'budget', e.target.value)} />
          <SelectField label="Financial-aid needs (optional)" options={AID_OPTIONS} value={p.financial_aid_needs || AID_OPTIONS[0]} onChange={(e) => update('preferences', 'financial_aid_needs', e.target.value)} />
        </div>
        <div className="mt-4 max-w-xs">
          <SelectField label="Distance from home (optional)" options={DISTANCE_OPTIONS} value={p.distance || DISTANCE_OPTIONS[0]} onChange={(e) => update('preferences', 'distance', e.target.value)} />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={handleSave}>Save Profile</Button>
        {saved && <span className="text-sm text-success" role="status">Saved.</span>}
      </div>
    </div>
  )
}

function ActivitiesEditor({ profile, setProfile }: { profile: ProfileType; setProfile: (p: ProfileType) => void }) {
  const activities = profile.activities

  const updateItem = (i: number, key: string, value: unknown) => {
    const next = [...activities]
    next[i] = { ...next[i], [key]: value }
    setProfile({ ...profile, activities: next })
  }
  const remove = (i: number) => setProfile({ ...profile, activities: activities.filter((_, idx) => idx !== i) })
  const add = () => setProfile({ ...profile, activities: [...activities, {}] })

  return (
    <Card className="mb-4">
      <CardLabel>Activities</CardLabel>
      <p className="text-sm text-ink-soft mb-3">Add your extracurricular activities and leadership roles.</p>
      <div className="space-y-4">
        {activities.map((item, i) => (
          <div key={i} className="border border-border rounded-lg p-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField label="Activity name" value={item.name ?? ''} onChange={(e) => updateItem(i, 'name', e.target.value)} />
              <SelectField label="Category" options={ACTIVITY_CATEGORIES} value={item.category || ACTIVITY_CATEGORIES[0]} onChange={(e) => updateItem(i, 'category', e.target.value)} />
              <TextField label="Role" placeholder="e.g. Captain, Member, Founder…" value={item.role ?? ''} onChange={(e) => updateItem(i, 'role', e.target.value)} />
              <TextField label="Organization" value={item.organization ?? ''} onChange={(e) => updateItem(i, 'organization', e.target.value)} />
              <TextField label="Hours/week" type="number" min={0} value={item.hours_per_week ?? ''} onChange={(e) => updateItem(i, 'hours_per_week', e.target.value)} />
              <TextField label="Weeks/year" type="number" min={0} value={item.weeks_per_year ?? ''} onChange={(e) => updateItem(i, 'weeks_per_year', e.target.value)} />
            </div>
            <div className="mt-3">
              <TextAreaField label="Description" value={item.description ?? ''} onChange={(e) => updateItem(i, 'description', e.target.value)} />
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => remove(i)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-3" onClick={add}>+ Add another activity</Button>
    </Card>
  )
}

function AwardsEditor({ profile, setProfile }: { profile: ProfileType; setProfile: (p: ProfileType) => void }) {
  const awards = profile.awards

  const updateItem = (i: number, key: string, value: unknown) => {
    const next = [...awards]
    next[i] = { ...next[i], [key]: value }
    setProfile({ ...profile, awards: next })
  }
  const remove = (i: number) => setProfile({ ...profile, awards: awards.filter((_, idx) => idx !== i) })
  const add = () => setProfile({ ...profile, awards: [...awards, {}] })

  return (
    <Card className="mb-4">
      <CardLabel>Awards</CardLabel>
      <p className="text-sm text-ink-soft mb-3">Add any awards, honors, or recognitions.</p>
      <div className="space-y-4">
        {awards.map((item, i) => (
          <div key={i} className="border border-border rounded-lg p-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField label="Award name" value={item.name ?? ''} onChange={(e) => updateItem(i, 'name', e.target.value)} />
              <SelectField label="Recognition level" options={AWARD_LEVELS} value={item.level || AWARD_LEVELS[0]} onChange={(e) => updateItem(i, 'level', e.target.value)} />
              <SelectField label="Category" options={AWARD_CATEGORIES} value={item.category || AWARD_CATEGORIES[0]} onChange={(e) => updateItem(i, 'category', e.target.value)} />
              <SelectField label="Grade received" options={['9', '10', '11', '12']} value={item.grade || '9'} onChange={(e) => updateItem(i, 'grade', e.target.value)} />
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => remove(i)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-3" onClick={add}>+ Add another award</Button>
    </Card>
  )
}
