import { Link } from 'react-router-dom';

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <span className="font-semibold text-lg text-text-primary">Workbench</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">About</Link>
            <Link to="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            <Link to="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Docs</Link>
            <Link to="/contact" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Log in
            </Link>
            <Link to="/auth/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background-subtle">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <span className="font-semibold text-text-primary">Workbench</span>
              </div>
              <p className="text-sm text-text-secondary">
                Headless CMS and content workflow management for developers and agencies.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/pricing" className="hover:text-text-primary">Pricing</Link></li>
                <li><Link to="/docs" className="hover:text-text-primary">Documentation</Link></li>
                <li><Link to="/about" className="hover:text-text-primary">About</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/docs" className="hover:text-text-primary">Getting Started</Link></li>
                <li><Link to="/docs" className="hover:text-text-primary">API Reference</Link></li>
                <li><Link to="/contact" className="hover:text-text-primary">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/about" className="hover:text-text-primary">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-text-primary">Contact</Link></li>
                <li><a href="#" className="hover:text-text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-muted">
            <p>&copy; {new Date().getFullYear()} Workbench. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
