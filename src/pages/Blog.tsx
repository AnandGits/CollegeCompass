import { Link } from 'react-router-dom'
import { blogPosts } from '../lib/blogs'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'

export default function Blog() {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Resources</div>
      <h1 className="font-display font-semibold text-3xl mb-6">Admissions Insights</h1>

      {blogPosts.length === 0 ? (
        <EmptyState icon="📰" title="No posts yet" body="Add a .md file to the Blogs/ folder to see it here." />
      ) : (
        <div className="space-y-2">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="block">
              <Card className="hover:border-brand transition-colors">
                <div className="font-semibold">{post.title}</div>
                {post.date && <div className="text-xs text-ink-soft mt-1">{post.date}</div>}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
