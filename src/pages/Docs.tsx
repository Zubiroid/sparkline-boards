import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

export default function Docs() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-1 mb-6">Documentation</h1>
          <p className="text-lg text-text-secondary mb-12">
            Everything you need to understand ContentOps and integrate it with your backend.
          </p>

          <nav className="card p-6 mb-12">
            <h2 className="heading-4 mb-4">On This Page</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#concepts" className="text-primary hover:underline">Product Concepts</a></li>
              <li><a href="#workflow" className="text-primary hover:underline">Content Workflow</a></li>
              <li><a href="#data-models" className="text-primary hover:underline">Data Models</a></li>
              <li><a href="#authentication" className="text-primary hover:underline">Authentication</a></li>
              <li><a href="#integration" className="text-primary hover:underline">Backend Integration</a></li>
            </ul>
          </nav>

          <section id="concepts" className="mb-16">
            <h2 className="heading-2 mb-4">Product Concepts</h2>
            <p className="text-text-secondary mb-4">
              ContentOps organizes content creation into a visual workflow. Each piece of content moves through stages until publication.
            </p>
            <div className="card p-6 bg-background-subtle">
              <h3 className="heading-4 mb-3">Content Statuses</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><strong className="text-text-primary">Idea:</strong> Initial concept or topic to explore</li>
                <li><strong className="text-text-primary">Draft:</strong> Content being actively written</li>
                <li><strong className="text-text-primary">Scheduled:</strong> Complete and queued for publication</li>
                <li><strong className="text-text-primary">Published:</strong> Live content</li>
              </ul>
            </div>
          </section>

          <section id="workflow" className="mb-16">
            <h2 className="heading-2 mb-4">Content Workflow</h2>
            <p className="text-text-secondary mb-4">
              The Kanban board visualizes content across stages. WIP (work-in-progress) limits prevent overloading any single stage.
            </p>
          </section>

          <section id="data-models" className="mb-16">
            <h2 className="heading-2 mb-4">Data Models</h2>
            <div className="card p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-text-secondary">{`// Content Model
interface Content {
  id: string;
  title: string;
  body: string;
  status: 'idea' | 'draft' | 'scheduled' | 'published';
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishAt?: string;
}

// User Model  
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  avatar?: string;
  timezone: string;
}`}</pre>
            </div>
          </section>

          <section id="authentication" className="mb-16">
            <h2 className="heading-2 mb-4">Authentication</h2>
            <p className="text-text-secondary mb-4">
              The frontend includes complete authentication flows (login, register, password reset) ready for backend connection. 
              The <code className="bg-neutral-100 px-1 rounded">AuthContext</code> manages session state and provides guards for protected routes.
            </p>
          </section>

          <section id="integration" className="mb-16">
            <h2 className="heading-2 mb-4">Backend Integration</h2>
            <p className="text-text-secondary mb-4">
              To connect a backend, implement the service interfaces in <code className="bg-neutral-100 px-1 rounded">src/services/</code>:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li><code className="bg-neutral-100 px-1 rounded">IAuthService</code> - Authentication methods</li>
              <li><code className="bg-neutral-100 px-1 rounded">IContentService</code> - CRUD operations for content</li>
            </ul>
            <p className="text-text-secondary">
              Replace the placeholder implementations with real API calls. The frontend will work without modification.
            </p>
          </section>

          <div className="card p-8 bg-primary-light border-primary/20 text-center">
            <h3 className="heading-3 mb-2">Try the Demo</h3>
            <p className="text-text-secondary mb-4">Explore the full interface with local storage persistence.</p>
            <Link to="/app" className="btn btn-primary btn-md">Open App Demo</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
