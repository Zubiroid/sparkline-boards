import { PublicLayout } from '../components/layout/PublicLayout';

export default function About() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <h1 className="heading-1 mb-6">About ContentOps</h1>
          <p className="text-lg text-text-secondary mb-12">
            ContentOps is a content operations platform designed for independent creators 
            and small marketing teams who need clarity in their content production workflow.
          </p>

          {/* Mission */}
          <section className="mb-12">
            <h2 className="heading-2 mb-4">Our Mission</h2>
            <p className="text-text-secondary mb-4">
              We believe content creation should be organized, not overwhelming. Too many creators 
              juggle ideas across notes apps, spreadsheets, and mental checklists. ContentOps brings 
              everything into one focused workspace.
            </p>
            <p className="text-text-secondary">
              Our goal is to provide operational clarity: what to write, what's blocked, and what's 
              going live next. Simple questions that deserve simple answers.
            </p>
          </section>

          {/* What We Built */}
          <section className="mb-12">
            <h2 className="heading-2 mb-4">What We Built</h2>
            <p className="text-text-secondary mb-4">
              This is a production-ready frontend for a content management system. It demonstrates:
            </p>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong className="text-text-primary">Real UI patterns:</strong> Not mockups or wireframes, but working interfaces with proper states, validation, and accessibility.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong className="text-text-primary">Backend-ready architecture:</strong> Service contracts, authentication guards, and role-based access control prepared for integration.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong className="text-text-primary">Honest empty states:</strong> When data depends on a backend, the UI clearly communicates that dependency.</span>
              </li>
            </ul>
          </section>

          {/* Technology */}
          <section className="mb-12">
            <h2 className="heading-2 mb-4">Technology</h2>
            <p className="text-text-secondary mb-4">
              Built with modern, maintainable technologies:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <p className="font-medium text-text-primary">React</p>
                <p className="text-sm text-text-muted">UI Library</p>
              </div>
              <div className="card p-4 text-center">
                <p className="font-medium text-text-primary">TypeScript</p>
                <p className="text-sm text-text-muted">Type Safety</p>
              </div>
              <div className="card p-4 text-center">
                <p className="font-medium text-text-primary">Tailwind CSS</p>
                <p className="text-sm text-text-muted">Styling</p>
              </div>
              <div className="card p-4 text-center">
                <p className="font-medium text-text-primary">Vite</p>
                <p className="text-sm text-text-muted">Build Tool</p>
              </div>
            </div>
          </section>

          {/* Open for Integration */}
          <section className="card p-8 bg-background-subtle">
            <h2 className="heading-3 mb-4">Open for Integration</h2>
            <p className="text-text-secondary mb-4">
              This frontend is designed to connect to any backend that implements the expected 
              API contracts. Authentication, data persistence, and real-time updates can all be 
              added without restructuring the frontend.
            </p>
            <a href="/docs#integration" className="text-primary hover:underline font-medium">
              Read the Integration Guide →
            </a>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
