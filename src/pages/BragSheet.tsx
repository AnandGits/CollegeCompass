import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField, TextAreaField, inputCls } from '../components/Field'
import { trackSubmit } from '../lib/analytics'

/**
 * Senior Brag Sheet — mirrors the paper form counselors hand out. Purely
 * client-side: nothing is saved, the student fills it in and prints it
 * (or saves as PDF) via the browser's own print dialog.
 */

type YesNoValue = boolean | null
type CollegeEntry = { name: string; deadline: string }

type BragSheetFormData = {
  legalName: string
  nickname: string
  studentId: string
  email: string
  firstGenCollege: YesNoValue
  applyingEarlyActionOrDecision: YesNoValue
  has504OrIEP: YesNoValue
  counselorMayCommentOn504IEP: YesNoValue
  collegesApplyingTo: CollegeEntry[]
  essayForCounselor: string
  circumstancesAffectingEducation: string
  familyAdjectives: string[]
  friendAdjectives: string[]
  volunteer: { orgName: string; totalHours: string; whyThisOrg: string }
  extracurriculars: string
  jobsAndInternships: string
  summers: string
  intendedMajor: { major: string; why: string }
  anythingElse: string
  specificAskForLetter: string
  parent: {
    adjectives: string[]
    accomplishments: string
    whatMakesYouProud: string
    unusualCircumstances: string
    submittedByName: string
  }
}

const emptyForm: BragSheetFormData = {
  legalName: '',
  nickname: '',
  studentId: '',
  email: '',
  firstGenCollege: null,
  applyingEarlyActionOrDecision: null,
  has504OrIEP: null,
  counselorMayCommentOn504IEP: null,
  collegesApplyingTo: [{ name: '', deadline: '' }],
  essayForCounselor: '',
  circumstancesAffectingEducation: '',
  familyAdjectives: ['', '', ''],
  friendAdjectives: ['', '', ''],
  volunteer: { orgName: '', totalHours: '', whyThisOrg: '' },
  extracurriculars: '',
  jobsAndInternships: '',
  summers: '',
  intendedMajor: { major: '', why: '' },
  anythingElse: '',
  specificAskForLetter: '',
  parent: {
    adjectives: ['', '', '', '', ''],
    accomplishments: '',
    whatMakesYouProud: '',
    unusualCircumstances: '',
    submittedByName: '',
  },
}

const DEADLINES = [
  { due: 'October 1', request: 'September 3' },
  { due: 'October 15', request: 'September 17' },
  { due: 'November 3', request: 'October 2' },
  { due: 'November 18', request: 'October 14' },
  { due: 'December 1', request: 'October 22' },
  { due: 'December 15', request: 'November 6' },
  { due: 'January 1–31', request: 'November 14' },
]

function YesNo({ value, onChange }: { value: YesNoValue; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      {([['Yes', true], ['No', false]] as const).map(([label, val]) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(val)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            value === val ? 'bg-[#548770] text-white border-transparent' : 'bg-surface text-ink-soft border-border hover:border-ink-soft'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function AdjectiveRow({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <span className="block text-sm font-medium text-ink mb-1">{label}</span>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(values.length, 3)}, minmax(0,1fr))` }}>
        {values.map((v, i) => (
          <input
            key={i}
            className={inputCls}
            placeholder={`Adjective ${i + 1}`}
            value={v}
            onChange={(e) => {
              const next = [...values]
              next[i] = e.target.value
              onChange(next)
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------- Printable Q&A summary ---------- */

const yn = (v: YesNoValue) => (v === true ? 'Yes' : v === false ? 'No' : '—')
const listOrDash = (arr: string[]) => (arr.filter(Boolean).length ? arr.filter(Boolean).join(', ') : '—')
const textOrDash = (v: string | undefined) => (v && v.trim() ? v : '—')

function PrintQA({ q, a }: { q: string; a: string | undefined }) {
  return (
    <div className="print-qa">
      <p className="print-q">{q}</p>
      <p className="print-a">{textOrDash(a)}</p>
    </div>
  )
}

function PrintView({ form, onBack }: { form: BragSheetFormData; onBack: () => void }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'EHS Brag Sheet'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div>
      <div className="no-print flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-sm text-ink-soft hover:underline">
          ← Back to form
        </button>
        <Button variant="primary" onClick={() => window.print()} className="bg-[#548770]! hover:bg-[#436c5a]!">
          Print
        </Button>
      </div>

      <div className="print-sheet">
        <h1 className="print-title">EHS Senior Brag Sheet — {form.legalName}</h1>
        <p className="print-subtitle">
          Nickname: {textOrDash(form.nickname)} &nbsp;·&nbsp; Student ID: {textOrDash(form.studentId)} &nbsp;·&nbsp; Email: {textOrDash(form.email)}
        </p>

        <h2 className="print-section">About</h2>
        <PrintQA q="First in family to attend college or university?" a={yn(form.firstGenCollege)} />
        <PrintQA q="Applying Early Action or Early Decision?" a={yn(form.applyingEarlyActionOrDecision)} />
        <PrintQA q="Has a 504 or IEP?" a={yn(form.has504OrIEP)} />
        {form.has504OrIEP && <PrintQA q="OK for counselor/teacher to reference it in the letter?" a={yn(form.counselorMayCommentOn504IEP)} />}

        <h2 className="print-section">Colleges & Essay</h2>
        <PrintQA
          q="Colleges/universities applying to"
          a={form.collegesApplyingTo
            .filter((c) => c.name)
            .map((c) => `${c.name}${c.deadline ? ` (${c.deadline})` : ''}`)
            .join('; ')}
        />
        <PrintQA q="Essay shared with counselor" a={form.essayForCounselor} />

        <h2 className="print-section">Self-Evaluation</h2>
        <PrintQA q="Circumstances affecting educational experience or personal development" a={form.circumstancesAffectingEducation} />
        <PrintQA q="Three adjectives your family would use" a={listOrDash(form.familyAdjectives)} />
        <PrintQA q="Three adjectives your friends would use" a={listOrDash(form.friendAdjectives)} />
        <PrintQA
          q="Volunteering"
          a={form.volunteer.orgName ? `${form.volunteer.orgName} — ${form.volunteer.totalHours || '?'} hrs. ${form.volunteer.whyThisOrg || ''}` : ''}
        />
        <PrintQA q="Extracurricular activities" a={form.extracurriculars} />
        <PrintQA q="Job experience or internships" a={form.jobsAndInternships} />
        <PrintQA q="How summers were spent" a={form.summers} />
        <PrintQA q="Intended major and why" a={form.intendedMajor.major ? `${form.intendedMajor.major} — ${form.intendedMajor.why || ''}` : ''} />
        <PrintQA q="Anything else the counselor should know" a={form.anythingElse} />
        <PrintQA q="Specific ask for the letter" a={form.specificAskForLetter} />

        <h2 className="print-section">Parent Evaluation</h2>
        <PrintQA q="Five adjectives that best describe your child" a={listOrDash(form.parent.adjectives)} />
        <PrintQA q="Most outstanding accomplishments in the past 3–4 years" a={form.parent.accomplishments} />
        <PrintQA q="What makes you most proud" a={form.parent.whatMakesYouProud} />
        <PrintQA q="Unusual circumstances affecting your child in school" a={form.parent.unusualCircumstances} />
        <PrintQA q="Completed by (parent name)" a={form.parent.submittedByName} />

        <p className="print-footer">
          Invite your recommender on the Common App or Coalition and submit this brag sheet at least 21 school days before your first deadline — your
          letter isn't guaranteed by your due date otherwise.
        </p>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
        .print-sheet { font-family: var(--font-display); color: var(--color-ink); }
        .print-title { font-size: 20px; font-weight: 600; border-bottom: 2px solid var(--color-brand); padding-bottom: 8px; margin-bottom: 4px; }
        .print-subtitle { font-size: 12px; color: var(--color-ink-soft); margin-bottom: 20px; }
        .print-section { font-size: 14px; font-weight: 600; color: var(--color-brand); margin-top: 22px; margin-bottom: 8px; }
        .print-qa { margin-bottom: 10px; }
        .print-q { font-size: 12px; font-weight: 600; color: var(--color-ink-soft); margin-bottom: 1px; }
        .print-a { font-size: 13px; white-space: pre-wrap; }
        .print-footer { margin-top: 24px; font-size: 11px; color: var(--color-ink-soft); }
      `}</style>
    </div>
  )
}

/* ---------- Main form ---------- */

export default function BragSheet() {
  const [form, setForm] = useState<BragSheetFormData>(emptyForm)
  const [showPrint, setShowPrint] = useState(false)

  const set = <K extends keyof BragSheetFormData>(key: K, value: BragSheetFormData[K]) => setForm((f) => ({ ...f, [key]: value }))
  const setVolunteer = (patch: Partial<BragSheetFormData['volunteer']>) => setForm((f) => ({ ...f, volunteer: { ...f.volunteer, ...patch } }))
  const setIntendedMajor = (patch: Partial<BragSheetFormData['intendedMajor']>) => setForm((f) => ({ ...f, intendedMajor: { ...f.intendedMajor, ...patch } }))
  const setParent = (patch: Partial<BragSheetFormData['parent']>) => setForm((f) => ({ ...f, parent: { ...f.parent, ...patch } }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    trackSubmit('bragsheet')
    setShowPrint(true)
  }

  if (showPrint) {
    return (
      <div className="max-w-2xl mx-auto">
        <PrintView form={form} onBack={() => setShowPrint(false)} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Resources</div>
      <h1 className="font-display font-semibold text-3xl">EHS Senior Brag Sheet</h1>
      <p className="text-ink-soft mt-1 mb-6">
        Gives your counselor and teachers what they need for a personal, specific letter of recommendation. Nothing here is saved — fill it in and print
        or save as a PDF when you're done.
      </p>

      <form onSubmit={submit}>
        <Card className="mb-4">
          <div className="font-semibold mb-3">About you</div>
          <div className="space-y-4">
            <TextField label="Legal name" value={form.legalName} onChange={(e) => set('legalName', e.target.value)} required />
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Nickname" value={form.nickname} onChange={(e) => set('nickname', e.target.value)} />
              <TextField label="Student ID #" value={form.studentId} onChange={(e) => set('studentId', e.target.value)} />
            </div>
            <TextField label="Email address" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            <div>
              <span className="block text-sm font-medium text-ink mb-1">Are you the first in your family to attend a college or university?</span>
              <YesNo value={form.firstGenCollege} onChange={(v) => set('firstGenCollege', v)} />
            </div>
            <div>
              <span className="block text-sm font-medium text-ink mb-1">Will you be applying Early Action or Early Decision?</span>
              <YesNo value={form.applyingEarlyActionOrDecision} onChange={(v) => set('applyingEarlyActionOrDecision', v)} />
            </div>
            <div>
              <span className="block text-sm font-medium text-ink mb-1">Do you have a 504 or IEP?</span>
              <YesNo value={form.has504OrIEP} onChange={(v) => set('has504OrIEP', v)} />
            </div>
            {form.has504OrIEP && (
              <div>
                <span className="block text-sm font-medium text-ink mb-1">Can your counselor or teacher comment on it in the letter?</span>
                <YesNo value={form.counselorMayCommentOn504IEP} onChange={(v) => set('counselorMayCommentOn504IEP', v)} />
              </div>
            )}
          </div>
        </Card>

        <Card className="mb-4">
          <div className="font-semibold mb-1">Colleges & essay</div>
          <div className="space-y-4 mt-3">
            <div>
              <span className="block text-sm font-medium text-ink mb-1">Colleges/universities you're applying to, with deadlines</span>
              <div className="space-y-2">
                {form.collegesApplyingTo.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={inputCls}
                      placeholder="College name"
                      value={c.name}
                      onChange={(e) => {
                        const next = [...form.collegesApplyingTo]
                        next[i] = { ...next[i], name: e.target.value }
                        set('collegesApplyingTo', next)
                      }}
                    />
                    <input
                      type="date"
                      className={`${inputCls} w-44`}
                      value={c.deadline}
                      onChange={(e) => {
                        const next = [...form.collegesApplyingTo]
                        next[i] = { ...next[i], deadline: e.target.value }
                        set('collegesApplyingTo', next)
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="text-sm text-brand hover:underline"
                  onClick={() => set('collegesApplyingTo', [...form.collegesApplyingTo, { name: '', deadline: '' }])}
                >
                  + Add another college
                </button>
              </div>
            </div>
            <TextAreaField
              label="Paste one essay you'll submit with your application"
              value={form.essayForCounselor}
              onChange={(e) => set('essayForCounselor', e.target.value)}
            />
          </div>
        </Card>

        <Card className="mb-4">
          <div className="font-semibold mb-3">Self-evaluation</div>
          <div className="space-y-4">
            <TextAreaField
              label="Have any circumstances affected your educational experience or personal development?"
              value={form.circumstancesAffectingEducation}
              onChange={(e) => set('circumstancesAffectingEducation', e.target.value)}
            />
            <AdjectiveRow label="Three adjectives your family would use to describe you" values={form.familyAdjectives} onChange={(v) => set('familyAdjectives', v)} />
            <AdjectiveRow label="Three adjectives your friends would use to describe you" values={form.friendAdjectives} onChange={(v) => set('friendAdjectives', v)} />

            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="text-sm font-medium text-ink">Volunteering</div>
              <TextField label="Organization name" value={form.volunteer.orgName} onChange={(e) => setVolunteer({ orgName: e.target.value })} />
              <TextField label="Total hours" type="number" value={form.volunteer.totalHours} onChange={(e) => setVolunteer({ totalHours: e.target.value })} />
              <TextAreaField
                label="Why did you choose to volunteer with this organization?"
                value={form.volunteer.whyThisOrg}
                onChange={(e) => setVolunteer({ whyThisOrg: e.target.value })}
              />
            </div>

            <TextAreaField label="Extracurricular activities" value={form.extracurriculars} onChange={(e) => set('extracurriculars', e.target.value)} />
            <TextAreaField label="Job experience or internships" value={form.jobsAndInternships} onChange={(e) => set('jobsAndInternships', e.target.value)} />
            <TextAreaField label="How did you spend your summers in high school?" value={form.summers} onChange={(e) => set('summers', e.target.value)} />
            <TextField label="Intended college major" value={form.intendedMajor.major} onChange={(e) => setIntendedMajor({ major: e.target.value })} />
            <TextAreaField label="Why this major?" value={form.intendedMajor.why} onChange={(e) => setIntendedMajor({ why: e.target.value })} />
            <TextAreaField label="Anything else we should know about you?" value={form.anythingElse} onChange={(e) => set('anythingElse', e.target.value)} />
            <TextAreaField
              label="Anything specific you want your counselor to write about?"
              value={form.specificAskForLetter}
              onChange={(e) => set('specificAskForLetter', e.target.value)}
            />
          </div>
        </Card>

        <Card className="mb-4">
          <div className="font-semibold mb-3">Parent evaluation</div>
          <div className="space-y-4">
            <AdjectiveRow label="Five adjectives that best describe your child" values={form.parent.adjectives} onChange={(v) => setParent({ adjectives: v })} />
            <TextAreaField
              label="Your child's most outstanding accomplishments in the past 3–4 years"
              value={form.parent.accomplishments}
              onChange={(e) => setParent({ accomplishments: e.target.value })}
            />
            <TextAreaField
              label="What makes you most proud of your student?"
              value={form.parent.whatMakesYouProud}
              onChange={(e) => setParent({ whatMakesYouProud: e.target.value })}
            />
            <TextAreaField
              label="Any unusual circumstances that affected your child in school?"
              value={form.parent.unusualCircumstances}
              onChange={(e) => setParent({ unusualCircumstances: e.target.value })}
            />
            <TextField label="Parent name" value={form.parent.submittedByName} onChange={(e) => setParent({ submittedByName: e.target.value })} />
          </div>
        </Card>

        <Card className="mb-4">
          <div className="font-semibold mb-3">Letter of recommendation deadlines</div>
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-brand-tint">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-ink-soft">Letter due</th>
                <th className="text-left px-3 py-2 font-medium text-ink-soft">Request by</th>
              </tr>
            </thead>
            <tbody>
              {DEADLINES.map((d) => (
                <tr key={d.due} className="border-t border-border">
                  <td className="px-3 py-2">{d.due}</td>
                  <td className="px-3 py-2">{d.request}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-ink-soft mt-2">
            Invite your recommender on the Common App or Coalition and submit this brag sheet at least 21 school days before your first deadline — your
            letter isn't guaranteed by your due date otherwise.
          </p>
        </Card>

        <Button variant="primary" type="submit" className="w-full bg-[#548770]! hover:bg-[#436c5a]!">
          Preview & print
        </Button>
      </form>
    </div>
  )
}
