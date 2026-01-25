import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PublicLayout } from '../../components/layout/PublicLayout';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      // Error handled by context
    }
  };

  if (success) {
    return (
      <PublicLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
          <div className="card p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Check your email</h2>
            <p className="text-text-secondary mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/auth/login" className="btn btn-primary btn-md">
              Back to login
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Reset your password</h1>
            <p className="text-text-secondary">Enter your email and we'll send you a reset link</p>
          </div>

          <div className="card p-8">
            {error && (
              <div className="mb-6 p-3 bg-danger-light text-danger rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input ${errors.email ? 'border-danger' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-md w-full"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Remember your password?{' '}
              <Link to="/auth/login" className="text-primary hover:text-primary-hover font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
