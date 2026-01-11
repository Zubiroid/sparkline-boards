import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-background-subtle">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-text-primary mb-6 tracking-tight text-balance">
            Content Operations<br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto mb-10 text-balance">
            Plan, organize, and track your content workflow. ContentOps helps creators and small teams 
            bring clarity to content production without the complexity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg w-full sm:w-auto">
              Start Free
            </Link>
            <Link to="/docs" className="btn btn-outline btn-lg w-full sm:w-auto">
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">What ContentOps Provides</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              A complete frontend for content management, ready to connect to your backend.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <rect x="3" y="3" width="5" height="18" rx="1" />
                  <rect x="10" y="3" width="5" height="12" rx="1" />
                  <rect x="17" y="3" width="5" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Kanban Workflow</h3>
              <p className="text-text-secondary text-sm">
                Visual board for tracking content from idea to publication. 
                Drag and drop cards between stages, set WIP limits, and maintain flow.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Editorial Calendar</h3>
              <p className="text-text-secondary text-sm">
                See your publishing schedule at a glance. Week and month views 
                help you plan content cadence and avoid overloaded days.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="heading-4 mb-2">Draft Editor</h3>
              <p className="text-text-secondary text-sm">
                Distraction-free writing environment with autosave indicators, 
                unsaved changes warnings, and full metadata management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Ready Section */}
      <section className="py-20 bg-background-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-light text-warning text-sm font-medium mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              Frontend Demo
            </div>
            <h2 className="heading-2 mb-6">Ready for Backend Integration</h2>
            <p className="text-text-secondary mb-8">
              This is a production-ready frontend designed to connect to a real backend. 
              Currently, data is stored in your browser's local storage for demonstration. 
              Authentication, user management, and persistent data require a backend service.
            </p>
            <Link to="/docs#integration" className="btn btn-secondary btn-md">
              View Integration Guide
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="heading-2 text-center mb-12">What's Included Today</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 p-4">
              <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Content Dashboard</h4>
                <p className="text-sm text-text-secondary">Overview of your content pipeline with status distribution and upcoming items.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Workflow Board</h4>
                <p className="text-sm text-text-secondary">Kanban-style board with customizable stages and work-in-progress limits.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Calendar View</h4>
                <p className="text-sm text-text-secondary">Weekly and monthly views showing scheduled content and deadlines.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Settings & Preferences</h4>
                <p className="text-sm text-text-secondary">Configure workflow stages, tags, and UI density preferences.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">User Authentication</h4>
                <p className="text-sm text-text-secondary">Login, registration, and password reset flows ready for backend connection.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Team Collaboration</h4>
                <p className="text-sm text-text-secondary">Role-based access control UI prepared for multi-user environments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore the Demo</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Try the full interface with sample data. No account required for the demo — 
            your data stays in your browser.
          </p>
          <Link to="/app" className="btn btn-lg bg-white text-primary hover:bg-neutral-100">
            Open App Demo
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
