import { Link, useParams } from 'react-router-dom'
import { getBlogPost } from '../lib/blogs'
import { EmptyState } from '../components/EmptyState'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getBlogPost(slug) : undefined

  if (!post) {
    return <EmptyState icon="📰" title="Post not found" body="This post doesn't exist or was removed from the Blogs/ folder." />
  }

  return (
    <div>
      <Link to="/blog" className="text-xs font-bold uppercase tracking-wider text-brand mb-2 inline-block">← Back to Blog</Link>
      {post.date && <div className="text-xs text-ink-soft mb-1">{post.date}</div>}
      <article
        className="prose-sm max-w-none [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_p]:leading-relaxed [&_p]:mt-2 [&_hr]:border-border [&_hr]:my-6 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  )
}
