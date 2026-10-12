import { useEffect, useState } from 'react'
import { getAbout } from '../lib/api'

export default function About() {
  const [html, setHtml] = useState('')

  useEffect(() => { getAbout().then((r) => setHtml(r.html)) }, [])

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
          <h1 className="font-display font-semibold text-lg sm:text-xl leading-tight max-w-xl text-balance">
            All About Us
          </h1>
          <div className="mt-4 max-w-2xl space-y-4">
            <p className="text-ink-soft leading-relaxed">
              College Compass aims to ease the typically stressful college admissions process by providing
              students with an informative and simple to navigate resource. Our team strives to show
              parents, students, and educators that finding your path to college doesn't need to be an
              incredibly tedious and demanding process. We understand that every individual holds their
              own set of wants, needs, and ambitions for their future, so we've made it our mission to
              convey that a great future is accessible to all.
            </p>
            <p className="text-ink-soft leading-relaxed">
              Many individuals find themselves stressing over every single miniscule detail of their
              applications, convinced that one SAT score or even one rejection letter means the end of the
              world. But we're here to say that the future is what you make of it. Life isn't measured by
              how many AP classes or extracurriculars you've managed to take.
            </p>
            <p className="text-ink-soft leading-relaxed">
              We created College Compass for just this reason. Your college admissions don't need to be
              overwhelming or even complicated. With our website, we straighten out the path. We help to
              cut down the money families spend on applications and advice. In fact, the average student
              applies to about 15-20 schools, but this can actually be overkill. College Compass helps you
              create a realistic list based on your personal stats, saving money and stress for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2 mt-12">Resources</div> */}
      <div dangerouslySetInnerHTML={{ __html: html }} />

      {/* <Card className="mt-6">
        <h2 className="font-display font-semibold text-xl mb-3">Privacy &amp; Data</h2>
        <ul className="text-sm space-y-2 list-disc pl-4">
          <li>
            <strong>What we store:</strong> the academic profile, activities, awards, and preferences you enter in
            My Profile; colleges you save; and your AI Advisor conversation history — all linked to the email
            address you provide (no password).
          </li>
          <li><strong>Why:</strong> so recommendations and advisor answers reflect your profile, and so your list persists between visits.</li>
          <li><strong>AI training:</strong> your data is not used to train AI models.</li>
          <li><strong>Sharing:</strong> we don&rsquo;t sell or share your information with third parties.</li>
          <li><strong>Deleting your data:</strong> contact us using the information above and we&rsquo;ll delete your stored profile, saved colleges, and conversation history.</li>
          <li>
            <strong>Limitations:</strong> recommendations and AI Advisor answers are generated based on the information
            you provide and a college database — they are guidance, not admissions guarantees, and can be incomplete
            or wrong. Always verify deadlines and requirements on official college websites.
          </li>
        </ul>
      </Card> */}
    </div>
  )
}
