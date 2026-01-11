import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isServiceAvailable } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If backend is not available, show appropriate message
  if (!isServiceAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="card p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-warning-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2 className="heading-3 mb-2">Backend Not Connected</h2>
          <p className="text-text-secondary mb-6">
            This section requires authentication which depends on a backend service that is not yet implemented.
          </p>
          <p className="text-sm text-text-muted mb-6">
            The ContentOps frontend is ready for backend integration. Once connected, users will be able to log in and access this section.
          </p>
          <a href="/" className="btn btn-primary btn-md">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
