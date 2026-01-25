import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

export default function About() {
  return (
    <PublicLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-6">
              Why Workbench exists
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Modern applications need structured content, not page builders. 
              Workbench provides the content infrastructure for developers who 
              build custom-coded applications.
            </p>
          </div>

          {/* Problem/Solution */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">The Problem</h2>
                <ul className="space-y-4 text-text-secondary">
                  <li className="flex gap-3">
                    <span className="text-danger shrink-0">✕</span>
                    <span>Traditional CMS platforms couple content with presentation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-danger shrink-0">✕</span>
                    <span>Spreadsheets and docs don't scale for content operations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-danger shrink-0">✕</span>
                    <span>Task management and content creation are siloed</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-danger shrink-0">✕</span>
                    <span>No clear workflow from idea to published content</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">The Solution</h2>
                <ul className="space-y-4 text-text-secondary">
                  <li className="flex gap-3">
                    <span className="text-success shrink-0">✓</span>
                    <span>Headless architecture: content separate from presentation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-success shrink-0">✓</span>
                    <span>Structured content models with typed fields and validation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-success shrink-0">✓</span>
                    <span>Integrated task management linked to content entries</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-success shrink-0">✓</span>
                    <span>Clear lifecycle: Draft → Review → Scheduled → Published</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Our Philosophy</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Structure over pages',
                  desc: 'Content should be structured data, not locked in page layouts. Define models, create entries, use anywhere.'
                },
                {
                  title: 'Workflows over chaos',
                  desc: 'Every piece of content has a lifecycle. Track where it is, who\'s responsible, and when it\'s due.'
                },
                {
                  title: 'Systems over tools',
                  desc: 'Workbench is infrastructure, not just a tool. It integrates with your codebase and team processes.'
                }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who It's For */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Built for</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Developers',
                  desc: 'Who need structured content APIs for React, Node, Python, or any stack.'
                },
                {
                  title: 'Agencies',
                  desc: 'Who manage content operations across multiple client projects.'
                },
                {
                  title: 'Product Teams',
                  desc: 'Who coordinate content with releases, docs, and marketing.'
                }
              ].map((item, i) => (
                <div key={i} className="card p-6 text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/auth/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
