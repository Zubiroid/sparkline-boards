import { ContentPriority, PRIORITY_LABELS } from '../../types/content';

interface PriorityBadgeProps {
  priority: ContentPriority;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const priorityStyles: Record<ContentPriority, string> = {
  low: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  medium: 'bg-warning-light text-warning border-warning/30',
  high: 'bg-danger-light text-danger border-danger/30',
};

const priorityIcons: Record<ContentPriority, React.ReactNode> = {
  low: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  ),
  medium: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="M12 5l7 7M12 5l-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  high: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export function PriorityBadge({ priority, size = 'sm', showLabel = true }: PriorityBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5 gap-1' : 'text-sm px-2 py-1 gap-1.5';

  return (
    <span 
      className={`inline-flex items-center font-medium rounded border ${priorityStyles[priority]} ${sizeClasses}`}
      title={`Priority: ${PRIORITY_LABELS[priority]}`}
    >
      {priorityIcons[priority]}
      {showLabel && <span>{PRIORITY_LABELS[priority]}</span>}
    </span>
  );
}