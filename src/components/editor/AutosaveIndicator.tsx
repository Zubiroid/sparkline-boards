interface AutosaveIndicatorProps {
  status: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSaved?: Date;
}

export function AutosaveIndicator({ status, lastSaved }: AutosaveIndicatorProps) {
  const statusConfig = {
    saved: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      text: lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : 'Saved',
      className: 'text-success',
    },
    saving: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      ),
      text: 'Saving...',
      className: 'text-text-muted',
    },
    unsaved: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      ),
      text: 'Unsaved changes',
      className: 'text-warning',
    },
    error: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
        </svg>
      ),
      text: 'Save failed',
      className: 'text-danger',
    },
  };

  const config = statusConfig[status];

  return (
    <div 
      className={`flex items-center gap-1.5 text-xs ${config.className}`}
      role="status"
      aria-live="polite"
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString();
}