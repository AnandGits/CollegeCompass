import { marked } from 'marked'

export type BlogPost = {
  slug: string
  title: string
  date?: string
  markdown: string
  html: string
}

const files = import.meta.glob(['/Blogs/*.md', '!/Blogs/welcome-to-the-blog.md'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parsePost(path: string, raw: string): BlogPost {
  const slug = path.replace('/Blogs/', '').replace(/\.md$/, '')
  let body = raw
  let title = slug
  let date: string | undefined

  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (frontmatterMatch) {
    body = raw.slice(frontmatterMatch[0].length)
    for (const line of frontmatterMatch[1].split(/\r?\n/)) {
      const idx = line.indexOf(':')
      if (idx === -1) continue
      const key = line.slice(0, idx).trim()
      const value = line.slice(idx + 1).trim()
      if (key === 'title' && value) title = value
      if (key === 'date' && value) date = value
    }
  } else {
    const h1Match = body.match(/^#\s+(.+)$/m)
    if (h1Match) title = h1Match[1].trim()
  }

  return { slug, title, date, markdown: body, html: marked.parse(body, { async: false }) as string }
}

export const blogPosts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title)
  })

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
