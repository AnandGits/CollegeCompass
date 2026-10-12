import { Card } from '../components/Card'
import { LinkButton } from '../components/Button'
import { Seal } from '../components/Seal'

const STEPS = [
  { icon: '🧭', title: 'Build your student profile', body: 'Academics, activities, awards, and preferences — in one guided flow.' },
  { icon: '💬', title: 'Get an AI-powered profile review', body: "Ask the AI Advisor what's strong, what's missing, and how to improve." },
  { icon: '🎯', title: 'Create and organize your college list', body: 'Reach, target, likely, and financial-safety picks you can save and track.' },
]

export default function Home() {
  return (
    <div>
      <div className="relative overflow-hidden">
        <img
          src="/images/ehs-college-compass.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none hidden sm:block absolute -top-10 -right-12 w-[26rem] opacity-[0.22]"
        />

        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">College Compass</div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-tight max-w-xl text-balance">
            Build a smarter college list around who you actually are.
          </h1>
          <p className="text-ink-soft mt-4 max-w-lg leading-relaxed">
            Create your student profile, receive personalized guidance, and discover colleges
            that match your academics, interests, goals, and preferences.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <LinkButton variant="primary" to="/profile">
              Build My Profile
            </LinkButton>
            <LinkButton variant="secondary" to="/search">
              Explore Colleges
            </LinkButton>
          </div>
        </div>
      </div>

      <h2 className="font-display font-semibold text-xl mt-12 mb-4">How it works</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {STEPS.map((s, i) => (
          <Card key={s.title}>
            <div className="font-mono text-xs text-ink-soft mb-2">0{i + 1}</div>
            <div className="text-2xl">{s.icon}</div>
            <div className="font-semibold mt-2">{s.title}</div>
            <div className="text-sm text-ink-soft mt-1">{s.body}</div>
          </Card>
        ))}
      </div>

      <h2 className="font-display font-semibold text-xl mt-12 mb-4">What College Compass actually does</h2>
      <p className="text-sm text-ink-soft leading-relaxed max-w-2xl">
        College Compass combines your self-reported academic profile with a college database and Claude AI to
        suggest colleges and give feedback on your profile and activities. It does not access your school
        records, submit applications on your behalf, or predict admissions outcomes.
      </p>

      <h2 className="font-display font-semibold text-xl mt-12 mb-4">A preview of your dashboard</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <Seal pct={0} label="Profile completion" />
          <div className="text-sm text-ink-soft mt-3">Start your profile to unlock personalized recommendations.</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">Saved colleges</div>
          <div className="font-mono text-2xl font-semibold">0</div>
          <div className="text-sm text-ink-soft mt-1">Save colleges from your recommendations to track them here.</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">Recommended next step</div>
          <div className="font-semibold mt-1">Build your profile</div>
          <div className="text-sm text-ink-soft mt-1">This is the fastest way to get useful advice.</div>
        </Card>
      </div>

      <Card className="mt-8">
        <div className="font-semibold mb-2">Privacy & limitations</div>
        <ul className="text-sm text-ink-soft space-y-1.5 list-disc pl-4">
          <li>We store the profile info you enter (academics, activities, awards, preferences), your saved colleges, and your AI Advisor conversation history, associated with the email you provide.</li>
          <li>We don&rsquo;t use your data to train AI models, and we don&rsquo;t sell or share it with third parties.</li>
          <li>You can ask us to delete your data at any time (see the About page for contact info).</li>
          <li>AI-generated advice is guidance based on the information you provide — it is <strong>not</strong> an admissions guarantee and can be wrong or incomplete. Always verify deadlines and requirements on official college websites.</li>
        </ul>
      </Card>
    </div>
  )
}
