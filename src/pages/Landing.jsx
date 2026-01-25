import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
                Headless CMS meets 
                <span className="text-primary"> workflow management</span>
              </h1>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                Workbench is the content infrastructure for custom-coded applications. 
                Define structured content models, manage entries through a lifecycle, 
                and coordinate your team with integrated task management.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth/register" className="btn btn-primary btn-lg">
                  Start Building
                </Link>
                <Link to="/docs" className="btn btn-md bg-surface hover:bg-surface-hover text-text-primary border border-border">
                  Read the Docs
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Product Preview */}
              <div className="bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="bg-background-subtle px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-danger"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                  <span className="text-xs text-text-muted ml-2">Workbench Dashboard</span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {['Draft', 'Review', 'Scheduled', 'Published'].map((status, i) => (
                      <div key={status} className="text-center p-3 bg-background-subtle rounded-lg">
                        <p className="text-2xl font-bold text-text-primary">{[4, 2, 3, 12][i]}</p>
                        <p className="text-xs text-text-muted">{status}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'Homepage Hero Update', status: 'Review', color: 'warning' },
                      { title: 'API Documentation v2.1', status: 'Draft', color: 'info' },
                      { title: 'Product Launch Blog', status: 'Scheduled', color: 'primary' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-background-subtle rounded-lg">
                        <span className="text-sm text-text-primary">{item.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-${item.color}-light text-${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Workbench */}
      <section className="py-20 bg-background-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Built for developers who build for others
            </h2>
            <p className="text-text-secondary text-lg">
              Workbench is not a page builder. It's the structured content layer 
              that powers your custom-coded React, Node, or Python applications.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                ),
                title: 'Content Models',
                description: 'Define structured content types with typed fields. Text, rich text, dates, relations, and more.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: 'Content Lifecycle',
                description: 'Move content through Draft → Review → Scheduled → Published. Track status and deadlines.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                ),
                title: 'Task Management',
                description: 'Assign tasks to team members, set deadlines, link tasks to content entries, track progress.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Demo */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              A complete content workflow
            </h2>
            <p className="text-text-secondary text-lg">
              From defining your content structure to publishing, Workbench handles the entire lifecycle.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { step: '1', title: 'Define a Model', desc: 'Create a BlogPost model with title, body, author, and publish date fields.' },
                { step: '2', title: 'Create Content', desc: 'Write your content in a rich text editor with live preview and validation.' },
                { step: '3', title: 'Assign Tasks', desc: 'Need review? Create a task and assign it to a team member with a deadline.' },
                { step: '4', title: 'Publish', desc: 'Move content to Published. Fetch it via API in your React or Node app.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-text-secondary">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-background-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Who uses Workbench?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Development Teams',
                desc: 'Building custom web apps that need structured, API-driven content without a monolithic CMS.'
              },
              {
                title: 'Agencies',
                desc: 'Managing content for multiple client projects with clear workflows and role-based access.'
              },
              {
                title: 'Product Teams',
                desc: 'Coordinating content creation with product launches, feature documentation, and changelog updates.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Ready to build?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Start with a free account. No credit card required.
            </p>
            <Link to="/auth/register" className="btn btn-primary btn-lg">
              Create Your Workspace
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
