import { ContentStatus, STATUS_LABELS } from '../../types/content';

interface StatusBadgeProps {
  status: ContentStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<ContentStatus, string> = {
  idea: 'badge-neutral',
  draft: 'bg-warning-light text-warning',
  scheduled: 'badge-primary',
  published: 'badge-success',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span 
      className={`badge ${statusStyles[status]} ${size === 'sm' ? 'text-[10px] px-1.5' : ''}`}
      role="status"
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface StatusDotProps {
  status: ContentStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span 
      className={`status-dot status-${status}`} 
      aria-label={STATUS_LABELS[status]}
      role="img"
    />
  );
}
