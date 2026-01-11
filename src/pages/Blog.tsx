import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

const blogPosts = [
  {
    slug: 'getting-started-content-operations',
    title: 'Getting Started with Content Operations',
    excerpt: 'Learn the fundamentals of organizing your content workflow for maximum efficiency.',
    date: '2026-01-05',
    readTime: '5 min read',
  },
  {
    slug: 'kanban-for-content-creators',
    title: 'Why Kanban Works for Content Creators',
    excerpt: 'Discover how visual workflow management can transform your content production.',
    date: '2025-12-20',
    readTime: '7 min read',
  },
  {
    slug: 'avoiding-content-burnout',
    title: 'Avoiding Content Burnout: A Systems Approach',
    excerpt: 'Sustainable content creation starts with the right processes and boundaries.',
    date: '2025-12-10',
    readTime: '6 min read',
  },
];

export default function Blog() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="heading-1 mb-4">Blog</h1>
          <p className="text-lg text-text-secondary mb-12">
            Insights on content operations, workflow optimization, and creator productivity.
          </p>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="card p-6 card-hover">
                <Link to={`/blog/${post.slug}`}>
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="heading-3 mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary">{post.excerpt}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
