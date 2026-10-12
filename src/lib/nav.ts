interface NavItem {
  key: string
  icon: string
  label: string
  path: string
  comingSoon?: boolean
  external?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  /*{
    label: 'Main',
    items: [
      { key: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/dashboard' },
      { key: 'profile', icon: '🧭', label: 'My Profile', path: '/profile' },
      { key: 'advisor', icon: '💬', label: 'AI Advisor', path: '/advisor' },
      { key: 'applications', icon: '🗂️', label: 'Applications', path: '/applications' },
      { key: 'saved', icon: '⭐', label: 'My Colleges', path: '/saved' },
      { key: 'essays', icon: '✍️', label: 'Essay Tracker', path: '/essays' },
      { key: 'deadlines', icon: '📅', label: 'Deadlines', path: '/deadlines' },
      { key: 'tasks', icon: '✅', label: 'Tasks', path: '/tasks' },
    ],
  },*/
  {
    label: 'Explore',
    items: [
      { key: 'holland', icon: '🧩', label: 'Holland Code Assessment', path: '/holland' },
      { key: 'majors', icon: '📚', label: 'Majors & Careers', path: '/majors' },
      { key: 'wiki', icon: '📖', label: 'College Profiles', path: '/wiki' },
      { key: 'search', icon: '🔎', label: 'College Calculator', path: '/search' },
      { key: 'recommendations', icon: '🎯', label: 'AI Driven College Recommendation', path: '/recommendations' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { key: 'faq', icon: '❓', label: 'FAQs', path: '/faq' },
      { key: 'blog', icon: '📰', label: 'Admissions Insights', path: '/blog' },
      { key: 'ama', icon: '🙋', label: 'Ask Me Anything', path: '/ama' },
      { key: 'bragsheet', icon: '📝', label: 'Brag Sheet', path: '/brag-sheet' },
      { key: 'about', icon: 'ℹ️', label: 'About Us', path: '/about' },
      { key: 'feedback', icon: '💬', label: 'Feedback', path: 'https://forms.gle/SZez3nDwjwSyQGJh7', external: true },
    ],
  },
]

const PATH_BY_KEY = Object.fromEntries(NAV_GROUPS.flatMap((g) => g.items).map((i) => [i.key, i.path]))
export const pathFor = (target: string) => PATH_BY_KEY[target] ?? '/'
