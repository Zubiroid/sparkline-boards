import { useState, FormEvent } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Alert } from '../components/common/Alert';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formState.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formState.email.trim().length > 255) {
      newErrors.email = 'Email must be less than 255 characters';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formState.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <h1 className="heading-1 mb-4">Contact Us</h1>
          <p className="text-lg text-text-secondary mb-8">
            Have questions about ContentOps? We'd love to hear from you.
          </p>

          {submitted ? (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              </div>
              <h2 className="heading-3 mb-2">Message Received</h2>
              <p className="text-text-secondary mb-6">
                Thank you for reaching out. This is a demo form — in production, 
                your message would be sent to our team.
              </p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setFormState({ name: '', email: '', message: '' });
                }}
                className="btn btn-secondary btn-md"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <Alert variant="info" className="mb-8">
                This contact form is a demonstration. Submissions are not sent anywhere — 
                backend integration is required for email delivery.
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`input ${errors.name ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    maxLength={100}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-danger" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`input ${errors.email ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    maxLength={255}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-danger" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className={`input resize-none ${errors.message ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    maxLength={1000}
                  />
                  <div className="flex justify-between">
                    {errors.message ? (
                      <p id="message-error" className="text-sm text-danger" role="alert">
                        {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-text-muted">
                      {formState.message.length}/1000
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-md w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
