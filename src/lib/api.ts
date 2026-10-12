const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8010'
const API_KEY = import.meta.env.VITE_API_KEY

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

const get = <T>(path: string) => request<T>(path)
const post = <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
const put = <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
const patch = <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' })

// ---------- Dashboard ----------
export type OnboardingItem = { label: string; done: boolean; target: string }
export type DeadlineRow = {
  id: string
  title: string
  due_date: string
  urgency: 'Overdue' | 'Due today' | 'Due this week' | 'Upcoming' | 'No date'
  type?: string
  college_name?: string
  priority?: string
  done?: boolean
  notes?: string
  source?: string
}
export type ApplicationSummary = { college_name: string; stage: string; pct: number }

export type DashboardData = {
  name: string
  season: string
  profile_pct: number
  application_pct: number
  onboarding: OnboardingItem[]
  upcoming_deadlines: DeadlineRow[]
  recommendation: string
  applications: ApplicationSummary[]
  recent_activity: string[]
}

export const getDashboard = (email: string) => get<DashboardData>(`/api/dashboard/${encodeURIComponent(email)}`)

// ---------- Profile ----------
export type Profile = {
  basic: Record<string, any>
  academics: Record<string, any>
  activities: any[]
  awards: any[]
  preferences: Record<string, any>
}

export const getProfile = (email: string) => get<Profile>(`/api/profile/${encodeURIComponent(email)}`)
export const saveProfile = (email: string, profile: Profile) =>
  put<{ saved: boolean; profile: Profile }>(`/api/profile/${encodeURIComponent(email)}`, profile)

// ---------- Saved colleges ----------
export type SavedCollege = {
  _id: string
  college_name: string
  category: string
  location: string
  intended_major: string
  application_plan: string
  deadline: string
  notes: string
  status: string
}

export const listSaved = (email: string) => get<SavedCollege[]>(`/api/saved/${encodeURIComponent(email)}`)
export const addSavedCollege = (email: string, college: { college_name: string; category?: string; location?: string }) =>
  post<{ added: boolean }>(`/api/saved/${encodeURIComponent(email)}`, college)
export const updateSaved = (docId: string, updates: Partial<SavedCollege>) => patch(`/api/saved/item/${docId}`, updates)
export const removeSaved = (docId: string) => del(`/api/saved/item/${docId}`)

// ---------- Applications ----------
export type Task = { id: string; name: string; done: boolean; type: string; due_date: string }
export type Application = {
  _id: string
  college_name: string
  application_round: string
  deadline: string
  intended_major: string
  stage: string
  decision: string
  financial_aid_status: string
  tasks: Task[]
  notes: string
  documents?: string
}

export const listApplications = (email: string) => get<Application[]>(`/api/applications/${encodeURIComponent(email)}`)
export const addApplication = (email: string, body: { college_name: string; application_round?: string; deadline?: string; intended_major?: string }) =>
  post<Application>(`/api/applications/${encodeURIComponent(email)}`, body)
export const updateApplication = (email: string, appId: string, updates: Partial<Application>) =>
  patch<Application>(`/api/applications/${encodeURIComponent(email)}/${appId}`, updates)
export const setApplicationStage = (email: string, appId: string, stage: string) =>
  post<Application>(`/api/applications/${encodeURIComponent(email)}/${appId}/stage`, { stage })
export const removeApplication = (email: string, appId: string) => del(`/api/applications/${encodeURIComponent(email)}/${appId}`)
export const addTask = (email: string, appId: string, name: string, due_date = '') =>
  post<Application>(`/api/applications/${encodeURIComponent(email)}/${appId}/tasks`, { name, due_date })
export const toggleTask = (email: string, appId: string, taskId: string, done: boolean) =>
  patch<Application>(`/api/applications/${encodeURIComponent(email)}/${appId}/tasks/${taskId}`, { done })
export const removeTask = (email: string, appId: string, taskId: string) =>
  del<Application>(`/api/applications/${encodeURIComponent(email)}/${appId}/tasks/${taskId}`)

// ---------- Essays ----------
export type ChecklistItem = { id: string; label: string; done: boolean }
export type Essay = {
  _id: string
  college_name: string
  prompt_title: string
  prompt_text: string
  word_limit: number
  current_word_count: number
  due_date: string
  status: string
  draft_text: string
  notes: string
  themes: string[]
  checklist: ChecklistItem[]
}

export const listEssays = (email: string) => get<Essay[]>(`/api/essays/${encodeURIComponent(email)}`)
export const addEssay = (email: string, body: { college_name: string; prompt_title: string; prompt_text?: string; word_limit?: number; due_date?: string }) =>
  post<Essay>(`/api/essays/${encodeURIComponent(email)}`, body)
export const updateEssay = (email: string, essayId: string, updates: Partial<Essay>) =>
  patch<Essay>(`/api/essays/${encodeURIComponent(email)}/${essayId}`, updates)
export const removeEssay = (email: string, essayId: string) => del(`/api/essays/${encodeURIComponent(email)}/${essayId}`)
export const duplicateEssay = (email: string, essayId: string) => post(`/api/essays/${encodeURIComponent(email)}/${essayId}/duplicate`)
export const toggleEssayChecklist = (email: string, essayId: string, itemId: string, done: boolean) =>
  patch<Essay>(`/api/essays/${encodeURIComponent(email)}/${essayId}/checklist/${itemId}`, { done })

// ---------- Deadlines ----------
export const listDeadlines = (email: string) => get<DeadlineRow[]>(`/api/deadlines/${encodeURIComponent(email)}`)
export const addDeadline = (email: string, body: { title: string; deadline_type: string; due_date: string; college_name?: string; priority?: string; notes?: string }) =>
  post(`/api/deadlines/${encodeURIComponent(email)}`, body)
export const updateDeadline = (email: string, id: string, updates: Partial<DeadlineRow>) =>
  patch(`/api/deadlines/${encodeURIComponent(email)}/${id}`, updates)
export const removeDeadline = (email: string, id: string) => del(`/api/deadlines/${encodeURIComponent(email)}/${id}`)

// ---------- Tasks (flattened) ----------
export type FlatTask = Task & { college_name: string; app_id: string }
export const listAllTasks = (email: string) => get<FlatTask[]>(`/api/tasks/${encodeURIComponent(email)}`)
export const toggleGlobalTask = (email: string, appId: string, taskId: string, done: boolean) =>
  patch(`/api/tasks/${encodeURIComponent(email)}/${appId}/${taskId}`, { done })

// ---------- AI Advisor ----------
export type ChatMessage = { role: 'user' | 'assistant'; content: string }
export type Conversation = { _id: string; title?: string; messages: ChatMessage[]; updated_at?: string }

export const listConversations = (email: string) => get<Conversation[]>(`/api/advisor/${encodeURIComponent(email)}/conversations`)
export const getAdvisorPrompts = () => get<string[]>('/api/advisor/prompts')
export const newConversation = (email: string) => post<{ conv_id: string }>(`/api/advisor/${encodeURIComponent(email)}/new`)
export const advisorChat = (email: string, conv_id: string, messages: ChatMessage[]) =>
  post<{ reply: string }>(`/api/advisor/${encodeURIComponent(email)}/chat`, { conv_id, messages })

// ---------- Recommendations ----------
export type RecommendationRequest = {
  resident_state: string
  out_pref: 'in_state' | 'nationwide' | 'specific'
  specific_states?: string[]
  test_type: 'SAT' | 'ACT'
  score: number
  major?: string
  preference: 'Public' | 'Private' | 'Both'
  campus_size?: string | null
}
export type CollegeResult = {
  college_name: string
  location: string
  reason: string
  cost: string
  fit: string
  popular_majors: string
  website: string
  bucket_label: string
}
export type RecommendationResults = { reach: CollegeResult[]; target: CollegeResult[]; likely: CollegeResult[] }

export const getRecommendations = (body: RecommendationRequest) => post<RecommendationResults>('/api/recommendations', body)

// ---------- Majors ----------
export type MajorSummary = { title: string; median_earnings_2yr: number; schools_reporting: number }
export type MajorDetail = MajorSummary & {
  description?: string
  careers?: string[]
  fiske: { area: string; by_category: Record<string, string[]> } | null
}
export const listMajors = () => get<MajorSummary[]>('/api/majors')
export const getMajor = (title: string) => get<MajorDetail>(`/api/majors/${encodeURIComponent(title)}`)

// ---------- Wiki ----------
export type WikiCollege = { college_name: string; state_code: string }
export type WikiCollegeDetail = { college_name: string; state_code: string; text: string; programs: string[] }
export const listWikiColleges = () => get<WikiCollege[]>('/api/wiki/colleges')
export const getWikiCollege = (name: string) => get<WikiCollegeDetail>(`/api/wiki/colleges/${encodeURIComponent(name)}`)
export const askWiki = (name: string, question: string) =>
  post<{ answer: string }>(`/api/wiki/colleges/${encodeURIComponent(name)}/ask`, { question })

// ---------- Holland ----------
export type HollandScores = Record<'R' | 'I' | 'A' | 'S' | 'E' | 'C', number>
export type HollandResult = {
  holland_code: string
  score_summary: string
  sorted_types: [string, number][]
  analysis_text: string
}
export const analyzeHolland = (body: { scores: HollandScores; fav_subjects: string; subject_why: string; clubs: string; clubs_why: string }) =>
  post<HollandResult>('/api/holland/analyze', body)
export const emailHolland = (body: { to_email: string; holland_code: string; score_summary: string; analysis_md: string }) =>
  post<{ sent: boolean }>('/api/holland/email', body)

// ---------- Ask Me Anything ----------
export type AmaSource = { type: string; label: string }
export type AmaResponse = { answer: string; sources: AmaSource[] }
export const askAma = (question: string) => post<AmaResponse>('/api/ama', { question })

// ---------- FAQ ----------
export type Faq = { question: string; answer: string; source?: string }
export const listFaq = () => get<Faq[]>('/api/faq')
export const askFaq = (question: string) => post<{ answer: string | null }>('/api/faq/ask', { question })

// ---------- Static content ----------
export const getAbout = () => get<{ html: string }>('/api/about')

// ---------- College Finder ----------
export type CollegeFinderParams = {
  major: string
  state: string
  schoolType?: 'all' | 'public' | 'private'
  sat?: number
  zip?: string
  gpa?: number
  apHonors?: number
  limit?: number
  email?: string
}

export type CollegeFinderBadge = { type: string; label: string }
export type CollegeFinderFit = 'match' | 'safety' | 'reach' | 'far-reach' | 'gpa-match' | 'gpa-borderline' | 'gpa-below' | 'gpa-unknown'
export type CollegeFinderSchool = {
  id: number
  name: string
  state: string
  city: string
  zip: string
  ownership: 1 | 2 | 3
  satRange: { low: number; high: number } | null
  admissionRate: number | null
  tuitionInState: number | null
  tuitionOutOfState: number | null
  medianEarnings: number | null
  studentSize: number | null
  website: string | null
  fit: CollegeFinderFit
  badges: CollegeFinderBadge[]
  gpaRequired: number | null
  discipline: {
    name: string
    admitGPARange: [number, number]
    admitRate: number | null
    applicants: number | null
  } | null
}
export type CollegeFinderResults = {
  count: number
  majorTier: string
  isPublic: boolean
  rigorDataAvailable?: boolean
  results: CollegeFinderSchool[]
}

// ---------- Analytics ----------
export const trackToolUse = (tool: string, anonId: string) => post<{ ok: boolean }>('/api/analytics/track', { tool, anonId })

export const findColleges = async (params: CollegeFinderParams): Promise<CollegeFinderResults> => {
  const q = new URLSearchParams({ major: params.major, state: params.state })
  if (params.schoolType && params.schoolType !== 'all') q.set('schoolType', params.schoolType)
  if (params.sat != null) q.set('sat', String(params.sat))
  if (params.zip) q.set('zip', params.zip)
  if (params.gpa != null) q.set('gpa', String(params.gpa))
  if (params.apHonors != null) q.set('apHonors', String(params.apHonors))
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.email) q.set('email', params.email)

  const res = await fetch(`${BASE_URL}/api/colleges/search?${q}`, {
    headers: API_KEY ? { 'x-api-key': API_KEY } : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`)
  return data
}
