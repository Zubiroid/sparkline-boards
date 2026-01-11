import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated, isServiceAvailable } = useAuth();

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
          <h2 className="heading-3 mb-2">Role-Based Access</h2>
          <p className="text-text-secondary mb-6">
            This section requires role verification which depends on a backend service that is not yet implemented.
          </p>
          <p className="text-sm text-text-muted mb-6">
            Required roles: {allowedRoles.join(', ')}
          </p>
          <a href="/" className="btn btn-primary btn-md">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="card p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <h2 className="heading-3 mb-2">Authentication Required</h2>
          <p className="text-text-secondary mb-6">
            You must be logged in to access this page.
          </p>
          <a href="/login" className="btn btn-primary btn-md">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="card p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="heading-3 mb-2">Access Denied</h2>
          <p className="text-text-secondary mb-4">
            You do not have permission to access this page.
          </p>
          <p className="text-sm text-text-muted mb-6">
            Your role: <span className="font-medium">{user.role}</span>
            <br />
            Required: <span className="font-medium">{allowedRoles.join(' or ')}</span>
          </p>
          <a href="/app" className="btn btn-primary btn-md">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
