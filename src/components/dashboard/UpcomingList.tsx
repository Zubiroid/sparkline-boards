import { Link } from 'react-router-dom';
import { ContentItem } from '../../types/content';
import { StatusDot } from '../common/StatusBadge';
import { PlatformBadge } from '../common/PlatformBadge';
import { STATUS_LABELS } from '../../types/content';

interface UpcomingListProps {
  items: ContentItem[];
  emptyMessage?: string;
}

export function UpcomingList({ items, emptyMessage = "No upcoming content" }: UpcomingListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border" role="list">
      {items.map(item => (
        <li key={item.id}>
          <Link
            to={`/editor/${item.id}`}
            className="flex items-center gap-4 py-3 px-1 hover:bg-surface-hover rounded-md transition-colors -mx-1"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <StatusDot status={item.status} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.title || 'Untitled'}
                </p>
                <p className="text-xs text-text-muted">
                  {item.scheduledDate 
                    ? new Date(item.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : STATUS_LABELS[item.status]
                  }
                </p>
              </div>
            </div>
            <PlatformBadge platform={item.platform} showLabel={false} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
