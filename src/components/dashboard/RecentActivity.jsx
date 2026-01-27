import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FileText, CheckSquare, Users, Settings } from 'lucide-react';

const activityIcons = {
  content: FileText,
  task: CheckSquare,
  user: Users,
  settings: Settings,
};

export function RecentActivity({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type] || FileText;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg"
            >
              <div className="rounded-full bg-muted p-2 mt-0.5">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
