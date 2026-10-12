import { Card } from '../components/Card'
import { LinkButton } from '../components/Button'

const EXPLORE_STEPS = [
  {
    icon: '🧩',
    title: 'Take the Holland Code Assessment',
    body: 'Start here to figure out the kinds of interests and work styles that fit you best.',
    to: '/holland',
    cta: 'Take the assessment',
  },
  {
    icon: '📚',
    title: 'Explore Majors & Careers',
    body: 'See what majors lead where, and narrow down what you actually want to study.',
    to: '/majors',
    cta: 'Explore majors',
  },
  {
    icon: '📖',
    title: 'Browse the College Profiles',
    body: 'Look up individual colleges — profiles, programs, and details in one place.',
    to: '/wiki',
    cta: 'Browse the profiles',
  },
  {
    icon: '🔎',
    title: 'Use the College Calculator',
    body: 'Put it all together and start exploring and saving colleges that fit you.',
    to: '/search',
    cta: 'Open the calculator',
  },
  {
    icon: '🎯',
    title: 'Get AI Driven College Recommendations',
    body: 'Get a personalized Reach, Target, and Likely list built from your profile and scores.',
    to: '/recommendations',
    cta: 'Get recommendations',
  },
]

const RESOURCES_STEPS = [
  {
    icon: '❓',
    title: 'Go through the FAQs',
    body: 'Get familiar with how admissions actually works before you start building a list.',
    to: '/faq',
    cta: 'Read the FAQs',
  },
  {
    icon: '📰',
    title: 'Read the Admissions Insights',
    body: 'Real talk on how admissions works, straight from people who study it.',
    to: '/blog',
    cta: 'Read the insights',
  },
  {
    icon: '🙋',
    title: 'Ask Me Anything',
    body: 'Have a specific question? Ask and get answers straight from the community.',
    to: '/ama',
    cta: 'Ask a question',
  },
  {
    icon: '📝',
    title: 'Fill Out the Brag Sheet',
    body: 'Give your counselor and teachers what they need for a personal, specific letter of recommendation.',
    to: '/brag-sheet',
    cta: 'Open the brag sheet',
  },
]

export default function Home() {
  return (
    <div>
      <h2 className="font-display font-semibold text-xl mb-4">Explore</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {EXPLORE_STEPS.map((s, i) => (
          <Card key={s.title} className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl" aria-hidden="true">{s.icon}</span>
              <span className="font-mono text-xs text-ink-soft">0{i + 1}</span>
            </div>
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-ink-soft mt-1 flex-1">{s.body}</div>
            <LinkButton variant="secondary" to={s.to} className="mt-4 self-start">
              {s.cta}
            </LinkButton>
          </Card>
        ))}
      </div>

      <h2 className="font-display font-semibold text-xl mt-12 mb-4">Resources</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {RESOURCES_STEPS.map((s, i) => (
          <Card key={s.title} className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl" aria-hidden="true">{s.icon}</span>
              <span className="font-mono text-xs text-ink-soft">0{i + 1}</span>
            </div>
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-ink-soft mt-1 flex-1">{s.body}</div>
            <LinkButton variant="secondary" to={s.to} className="mt-4 self-start">
              {s.cta}
            </LinkButton>
          </Card>
        ))}
      </div>

      <Card className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-semibold">Have feedback?</div>
          <div className="text-sm text-ink-soft mt-1">
            Tell us what's working, what's confusing, or what you'd like to see next.
          </div>
        </div>
        <a
          href="https://forms.gle/SZez3nDwjwSyQGJh7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-11 px-4 rounded-lg font-semibold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-brand bg-[#548770] text-white hover:bg-[#436c5a] shrink-0"
        >
          Share feedback
        </a>
      </Card>

      <Card className="mt-8">
        <div className="font-semibold mb-2">Legal Disclaimer</div>
        <ul className="text-sm text-ink-soft space-y-1.5 list-disc pl-4">
          <li><strong>Prototype status.</strong> This site is an early-stage prototype provided for informational and educational purposes only. It is under active development, may contain errors, and may be changed, suspended, or discontinued at any time without notice.</li>
          <li><strong>No professional advice.</strong> Nothing on this site constitutes admissions, academic, financial, legal, or other professional advice, and no advisor-client, fiduciary, or other special relationship is created by your use of it. Always consult a qualified school counselor, admissions professional, or other appropriate advisor before making decisions about your education.</li>
          <li><strong>Models and estimates only.</strong> Any recommendation, match, probability, or "fit" shown on this site is the output of an automated model based on limited, self-reported information. It is an estimate, not a guarantee, prediction, or assurance of any admissions outcome, and should not be relied upon as such.</li>
          <li><strong>Third-party content.</strong> Portions of the information presented have been curated or adapted from third-party blogs, publications, and other public sources. We do not independently verify, endorse, or guarantee the accuracy, completeness, timeliness, or reliability of that information. Always confirm details directly with the relevant college or institution's official website before relying on them.</li>
          <li><strong>No warranty.</strong> This site and all content, tools, and recommendations are provided "as is" and "as available," without warranties of any kind, whether express or implied, including as to accuracy, completeness, or fitness for a particular purpose.</li>
          <li><strong>Limitation of liability.</strong> To the fullest extent permitted by law, we disclaim all liability for any decisions made, or actions taken or not taken, in reliance on this site, and for any direct, indirect, incidental, or consequential damages arising from your use of it.</li>
        </ul>
      </Card>
    </div>
  )
}
