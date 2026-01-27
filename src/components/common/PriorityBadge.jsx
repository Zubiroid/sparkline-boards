import { cn } from '@/lib/utils';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

const priorityStyles = {
  high: 'text-red-600 dark:text-red-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-green-600 dark:text-green-400',
};

const priorityIcons = {
  high: ArrowUp,
  medium: ArrowRight,
  low: ArrowDown,
};

export function PriorityBadge({ priority, showLabel = true, className }) {
  const Icon = priorityIcons[priority] || priorityIcons.medium;
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium capitalize',
      priorityStyles[priority] || priorityStyles.medium,
      className
    )}>
      <Icon className="h-3 w-3" />
      {showLabel && priority}
    </span>
  );
}
