import { cn } from '@/lib/utils';

const statusStyles = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  idea: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  done: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const statusLabels = {
  draft: 'Draft',
  review: 'In Review',
  scheduled: 'Scheduled',
  published: 'Published',
  idea: 'Idea',
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export function StatusBadge({ status, className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusStyles[status] || statusStyles.draft,
      className
    )}>
      {statusLabels[status] || status}
    </span>
  );
}
