import { ContentStats, STATUS_LABELS, ContentStatus } from '../../types/content';

interface StatusDistributionProps {
  stats: ContentStats;
}

const statusColors: Record<ContentStatus, string> = {
  idea: 'bg-info',
  draft: 'bg-warning',
  scheduled: 'bg-primary',
  published: 'bg-success',
};

export function StatusDistribution({ stats }: StatusDistributionProps) {
  const total = stats.total || 1;
  const statuses: ContentStatus[] = ['idea', 'draft', 'scheduled', 'published'];
  
  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="h-3 rounded-full bg-neutral-100 overflow-hidden flex">
        {statuses.map(status => {
          const count = stats[status === 'idea' ? 'ideas' : status === 'draft' ? 'drafts' : status];
          const percentage = (count / total) * 100;
          if (percentage === 0) return null;
          
          return (
            <div
              key={status}
              className={`${statusColors[status]} transition-all duration-300`}
              style={{ width: `${percentage}%` }}
              title={`${STATUS_LABELS[status]}: ${count}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {statuses.map(status => {
          const count = stats[status === 'idea' ? 'ideas' : status === 'draft' ? 'drafts' : status];
          const percentage = Math.round((count / total) * 100);
          
          return (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
              <span className="text-sm text-text-secondary flex-1">{STATUS_LABELS[status]}</span>
              <span className="text-sm font-medium text-text-primary">{count}</span>
              <span className="text-xs text-text-muted">({percentage}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}