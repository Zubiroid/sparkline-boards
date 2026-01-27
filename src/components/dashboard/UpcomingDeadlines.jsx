import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { FileText, CheckSquare, Calendar } from 'lucide-react';

export function UpcomingDeadlines({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No upcoming deadlines
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.type === 'content' ? `/app/content/${item.id}` : `/app/tasks`}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="rounded-lg bg-muted p-2">
              {item.type === 'content' ? (
                <FileText className="h-4 w-4 text-muted-foreground" />
              ) : (
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.deadline), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={item.status} />
              {item.priority && <PriorityBadge priority={item.priority} showLabel={false} />}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
