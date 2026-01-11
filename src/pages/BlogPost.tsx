import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

const blogContent: Record<string, { title: string; date: string; content: string }> = {
  'getting-started-content-operations': {
    title: 'Getting Started with Content Operations',
    date: '2026-01-05',
    content: `Content operations is the discipline of managing the entire lifecycle of content creation, from ideation to publication and beyond. For creators and small teams, establishing good content ops practices early prevents the chaos that comes with scaling.

## Why Content Operations Matters

Without a system, content creation becomes reactive. You publish when inspiration strikes rather than when strategy demands. You lose track of ideas. Deadlines slip. Quality suffers.

Content operations provides structure without stifling creativity. It answers three critical questions:
- **What should we create next?** (Prioritization)
- **What's blocking progress?** (Bottleneck identification)
- **When does it go live?** (Scheduling)

## Starting Simple

You don't need complex tools to begin. Start with:

1. **A single source of truth** - One place where all content ideas live
2. **Clear status definitions** - What does "draft" mean? When is something "ready"?
3. **Regular reviews** - Weekly check-ins to move items forward

## Building From There

As your volume increases, you'll want visual workflows (Kanban boards), calendar views for scheduling, and metrics to understand your throughput. ContentOps provides all of these in a unified interface.

The key is starting with habits, not tools. Tools support good habits; they don't create them.`
  },
  'kanban-for-content-creators': {
    title: 'Why Kanban Works for Content Creators',
    date: '2025-12-20',
    content: `Kanban, originally developed for manufacturing, has become the go-to workflow method for knowledge workers. For content creators, it offers unique advantages over traditional to-do lists.

## Visual Clarity

A Kanban board shows the state of all work at a glance. You can immediately see:
- How many ideas are waiting to be developed
- What's currently being written
- What's ready for review or scheduling
- What's been published

This visibility prevents the "out of sight, out of mind" problem that plagues list-based systems.

## Work-in-Progress Limits

The most powerful concept in Kanban is limiting work-in-progress (WIP). If you set a limit of 3 items in your "Draft" column, you must finish or abandon something before starting new.

This sounds restrictive but it's liberating. It forces focus, reduces context-switching, and ensures items actually move to completion.

## Natural Flow

Content has a natural progression: idea → draft → review → publish. Kanban makes this flow explicit and manageable. When something gets stuck, it's visible. When a stage is overloaded, it's obvious.

## Getting Started

1. Define your stages (keep it simple: 3-5 stages)
2. Set WIP limits (start conservative)
3. Move items daily
4. Review and adjust weekly`
  },
  'avoiding-content-burnout': {
    title: 'Avoiding Content Burnout: A Systems Approach',
    date: '2025-12-10',
    content: `Creator burnout is epidemic. The pressure to constantly produce, combined with the emotional investment in creative work, makes it unsustainable without proper systems.

## The Burnout Pattern

Burnout typically follows a pattern:
1. High initial motivation
2. Overcommitment 
3. Quality decline as volume increases
4. Stress and exhaustion
5. Complete stop

Breaking this cycle requires changing the system, not just "trying harder."

## Sustainable Systems

**Batch similar work**: Write all outlines on Monday, draft on Tuesday/Wednesday, edit on Thursday. Context-switching is expensive.

**Buffer your pipeline**: Always have 2-3 items in "scheduled" before publishing. This removes the panic of empty queues.

**Set realistic cadence**: Publishing 3 quality pieces weekly beats 7 rushed ones. Your audience prefers consistency over frequency.

**Build in rest**: Creative work requires recovery. Schedule breaks like you schedule content.

## The Role of Tools

Good tools reduce friction. They don't add features you won't use; they make the essential actions effortless.

ContentOps is designed with sustainability in mind. Clear visibility reduces anxiety. Deadlines with warnings prevent last-minute rushes. Progress tracking shows you're moving forward, even on slow days.

Burnout isn't a personal failing. It's a systems failure. Fix the system.`
  }
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="heading-2 mb-4">Post Not Found</h1>
          <p className="text-text-secondary mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn btn-primary btn-md">Back to Blog</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="text-sm text-primary hover:underline mb-8 inline-block">
            ← Back to Blog
          </Link>
          <header className="mb-8">
            <time className="text-sm text-text-muted" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <h1 className="heading-1 mt-2">{post.title}</h1>
          </header>
          <div className="prose prose-neutral max-w-none">
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="heading-3 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('**') && paragraph.includes('**:')) {
                return <p key={i} className="text-text-secondary mb-4" dangerouslySetInnerHTML={{ 
                  __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>') 
                }} />;
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(l => l.startsWith('- '));
                return (
                  <ul key={i} className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ 
                        __html: item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>') 
                      }} />
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('1. ')) {
                const items = paragraph.split('\n').filter(l => /^\d+\./.test(l));
                return (
                  <ol key={i} className="list-decimal list-inside space-y-2 text-text-secondary mb-4">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ 
                        __html: item.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>') 
                      }} />
                    ))}
                  </ol>
                );
              }
              return <p key={i} className="text-text-secondary mb-4">{paragraph}</p>;
            })}
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}
