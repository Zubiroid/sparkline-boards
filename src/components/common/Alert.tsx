import { ReactNode } from 'react';

// Alert component - no third-party dependencies
interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  icon?: ReactNode;
  className?: string;
}

export function Alert({ children, variant = 'info', title, icon, className = '' }: AlertProps) {
  const variants = {
    info: 'bg-info-light border-info/30 text-info',
    success: 'bg-success-light border-success/30 text-success',
    warning: 'bg-warning-light border-warning/30 text-warning',
    danger: 'bg-danger-light border-danger/30 text-danger',
  };

  const defaultIcons = {
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    danger: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  };

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg border ${variants[variant]} ${className}`}
      role="alert"
    >
      <span className="shrink-0" aria-hidden="true">
        {icon || defaultIcons[variant]}
      </span>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
