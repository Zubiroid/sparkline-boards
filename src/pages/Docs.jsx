import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Book, 
  Rocket, 
  FolderKanban, 
  FileText, 
  CheckSquare, 
  Bell,
  Code,
  ChevronRight
} from 'lucide-react';

const sections = [
  { id: 'introduction', title: 'Introduction', icon: Book },
  { id: 'getting-started', title: 'Getting Started', icon: Rocket },
  { id: 'projects', title: 'Projects & Workflows', icon: FolderKanban },
  { id: 'content-models', title: 'Content Models', icon: FileText },
  { id: 'content-lifecycle', title: 'Content Lifecycle', icon: FileText },
  { id: 'tasks', title: 'Tasks & Planning', icon: CheckSquare },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'integrations', title: 'Integrations', icon: Code },
];

const docsContent = {
  'introduction': {
    title: 'Introduction to Workbench',
    content: `Workbench is a headless CMS and content workflow management platform designed for developers, agencies, and product teams managing custom-coded websites and applications.

## What is Workbench?

Workbench provides a centralized hub for managing content across multiple projects, platforms, and teams. Unlike traditional CMS solutions, Workbench is headless—meaning your content is accessible via API and can be used with any frontend technology.

## Key Features

- **Headless CMS**: Define custom content models with typed fields
- **Project Management**: Organize content and tasks by project
- **Content Workflow**: Track content from idea to publication
- **Task Management**: Assign, prioritize, and track tasks
- **Team Collaboration**: Role-based access control
- **Real-time Notifications**: Stay updated on changes

## Who is Workbench for?

- Development teams managing content for custom applications
- Agencies handling multiple client projects
- Product teams coordinating content workflows`,
  },
  'getting-started': {
    title: 'Getting Started',
    content: `## Quick Start Guide

### 1. Create Your First Project

Projects are the foundation of Workbench. Each project can contain content entries, tasks, and team members.

Navigate to **Projects** and click **New Project** to create your first project.

### 2. Define Content Models

Content models define the structure of your content. Go to **Models** and create fields like text, rich text, boolean, dates, and relations.

### 3. Create Content

With your models defined, start creating content entries. Use the rich text editor for formatted content.

### 4. Manage Tasks

Create tasks to track work. Assign priorities, due dates, and link tasks to content entries.

### 5. Invite Team Members

Add collaborators to your projects with appropriate roles (Admin, Moderator, Member).`,
  },
  'projects': {
    title: 'Projects & Workflows',
    content: `## Understanding Projects

Projects in Workbench serve as containers for related content, tasks, and team members.

### Project Structure

- **Content Entries**: All content associated with the project
- **Tasks**: Work items and to-dos
- **Team Members**: Collaborators with assigned roles
- **Content Models**: Custom schemas for content types

### Project Roles

- **Owner**: Full control over project settings and members
- **Admin**: Can manage content, tasks, and invite members
- **Member**: Can create and edit content and tasks

### Best Practices

1. Create separate projects for distinct clients or products
2. Use consistent naming conventions
3. Define content models before creating content`,
  },
  'content-models': {
    title: 'Headless CMS Models',
    content: `## Content Model Definition

Content models define the schema for your content types. Each model has a name, API slug, and a collection of fields.

### Field Types

| Type | Description | Use Case |
|------|-------------|----------|
| Text | Single line text | Titles, names |
| Rich Text | Formatted content | Blog posts, descriptions |
| Boolean | True/false toggle | Publish flags, features |
| Date | Date picker | Publication dates |
| Relation | Link to other content | Author references |

### Validation Rules

- **Required**: Field must have a value
- **Unique**: No duplicate values allowed

### API Access

Content is accessible via the Workbench API using your project's API key and the model's slug.`,
  },
  'content-lifecycle': {
    title: 'Content Lifecycle',
    content: `## Content Status Workflow

Content in Workbench follows a defined lifecycle:

### Status Types

1. **Idea**: Initial concept or placeholder
2. **Draft**: Work in progress
3. **Review**: Ready for review/approval
4. **Scheduled**: Approved and scheduled for publication
5. **Published**: Live and accessible

### Workflow Tips

- Use the Calendar view to visualize deadlines
- Set priority levels to focus on critical content
- Add tags for easy filtering and organization
- Link related tasks to content entries`,
  },
  'tasks': {
    title: 'Tasks & Planning',
    content: `## Task Management

Tasks help you track work and coordinate with team members.

### Task Properties

- **Title & Description**: What needs to be done
- **Status**: To Do, In Progress, Done
- **Priority**: Low, Medium, High
- **Due Date**: Deadline for completion
- **Assignee**: Who is responsible
- **Project Link**: Associated project
- **Content Link**: Related content entry

### Kanban Board

The Tasks page provides a Kanban-style board for visual task management. Drag tasks between columns to update status.

### Best Practices

1. Break large tasks into smaller, actionable items
2. Set realistic due dates
3. Update status regularly
4. Link tasks to related content`,
  },
  'notifications': {
    title: 'Notifications',
    content: `## Real-time Notifications

Stay informed about important updates with Workbench notifications.

### Notification Types

- **Content Updates**: Status changes, new content
- **Task Assignments**: New tasks assigned to you
- **Deadline Reminders**: Approaching due dates
- **Team Activity**: Member additions, role changes

### Managing Notifications

- Mark individual notifications as read
- Clear all notifications at once
- Configure notification preferences in Settings

### Real-time Updates

Notifications are delivered in real-time using WebSocket connections. You'll see updates instantly without refreshing.`,
  },
  'integrations': {
    title: 'Integrations',
    content: `## Integrating Workbench

Access your content in any application using the Workbench API.

### React Integration

\`\`\`javascript
import { useEffect, useState } from 'react';

function BlogPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/content?model=blog_post')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return posts.map(post => (
    <article key={post.id}>
      <h2>{post.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  ));
}
\`\`\`

### Node.js Integration

\`\`\`javascript
const workbench = require('@workbench/sdk');

const client = workbench.createClient({
  projectId: 'your-project-id',
  apiKey: process.env.WORKBENCH_API_KEY
});

const posts = await client.content.list('blog_post');
\`\`\`

### Python Integration

\`\`\`python
from workbench import Client

client = Client(
    project_id="your-project-id",
    api_key=os.environ["WORKBENCH_API_KEY"]
)

posts = client.content.list("blog_post")
\`\`\``,
  },
};

export default function Docs() {
  const [activeSection, setActiveSection] = useState('introduction');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span className="font-semibold text-lg">Workbench</span>
          </Link>
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
            Sign In
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <nav className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              <h3 className="font-semibold text-foreground mb-4">Documentation</h3>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <main className="lg:col-span-3">
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <h1>{docsContent[activeSection]?.title}</h1>
              <div className="whitespace-pre-wrap">
                {docsContent[activeSection]?.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-semibold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                  } else if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                  } else if (line.startsWith('```')) {
                    return null;
                  } else if (line.trim()) {
                    return <p key={i} className="mb-4">{line}</p>;
                  }
                  return null;
                })}
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
