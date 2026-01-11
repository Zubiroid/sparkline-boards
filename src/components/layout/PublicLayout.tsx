import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="ContentOps Home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                <path d="M12 3v18M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary">ContentOps</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              About
            </Link>
            <Link to="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Blog
            </Link>
            <Link to="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Documentation
            </Link>
            <Link to="/contact" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1" id="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background-subtle border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                    <path d="M12 3v18M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-semibold text-text-primary">ContentOps</span>
              </div>
              <p className="text-sm text-text-secondary">
                Content operations for creators and small teams. Plan, create, and publish with clarity.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-medium text-text-primary mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/docs#workflow" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Content Workflow
                  </Link>
                </li>
                <li>
                  <Link to="/docs#integration" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Backend Integration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-medium text-text-primary mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-medium text-text-primary mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-text-muted">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-sm text-text-muted">Terms of Service</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} ContentOps. All rights reserved.
            </p>
            <p className="text-sm text-text-muted">
              Built as a production-ready frontend demo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
