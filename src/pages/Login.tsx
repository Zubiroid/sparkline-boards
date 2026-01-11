import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from '../components/common/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading, error, isServiceAvailable, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-subtle p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                <path d="M12 3v18M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
          <h1 className="heading-2 mb-2">Welcome back</h1>
          <p className="text-text-secondary">Sign in to your ContentOps account</p>
        </div>

        <div className="card p-8">
          {!isServiceAvailable && (
            <Alert variant="warning" className="mb-6">
              <strong>Backend not connected.</strong> Authentication requires a backend service. 
              This form demonstrates the UI and validation.
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mb-6">{error}</Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">Email</label>
              <input
                type="email"
                id="email"
                className={`input ${errors.email ? 'border-danger' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-danger">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                id="password"
                className={`input ${errors.password ? 'border-danger' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-sm text-danger">{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-md w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
