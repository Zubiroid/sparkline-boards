import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message, 
  retry,
  variant = 'error'
}: ErrorStateProps) {
  const variants = {
    error: {
      bg: 'bg-danger-light',
      icon: AlertCircle,
      iconColor: 'text-danger',
      border: 'border-danger/30',
    },
    warning: {
      bg: 'bg-warning-light',
      icon: AlertTriangle,
      iconColor: 'text-warning',
      border: 'border-warning/30',
    },
    info: {
      bg: 'bg-info-light',
      icon: Info,
      iconColor: 'text-info',
      border: 'border-info/30',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={`card p-8 ${config.bg} ${config.border} border text-center`}>
      <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${config.bg} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${config.iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-4 max-w-md mx-auto">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="btn btn-primary btn-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

interface SuccessStateProps {
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SuccessState({ title, message, action }: SuccessStateProps) {
  return (
    <div className="card p-8 bg-success-light border border-success/30 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle className="w-6 h-6 text-success" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {message && <p className="text-text-secondary mb-4">{message}</p>}
      {action && (
        <button onClick={action.onClick} className="btn btn-primary btn-sm">
          {action.label}
        </button>
      )}
    </div>
  );
}
