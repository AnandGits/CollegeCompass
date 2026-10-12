import { trackToolUse } from './api'

const ANON_ID_KEY = 'cc_anon_id'

function getAnonId(): string {
  let id = localStorage.getItem(ANON_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(ANON_ID_KEY, id)
  }
  return id
}

export type TrackedTool = 'recommendations' | 'calculator' | 'holland' | 'ama' | 'bragsheet'

export function trackSubmit(tool: TrackedTool) {
  trackToolUse(tool, getAnonId()).catch(() => {})
}
