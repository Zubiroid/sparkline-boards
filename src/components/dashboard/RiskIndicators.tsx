import { Link } from 'react-router-dom';
import { ContentItem } from '../../types/content';
import { PlatformBadge } from '../common/PlatformBadge';
import { PriorityBadge } from '../common/PriorityBadge';

interface RiskIndicatorsProps {
  overdueItems: ContentItem[];
  atRiskItems: ContentItem[];
}

export function RiskIndicators({ overdueItems, atRiskItems }: RiskIndicatorsProps) {
  const hasRisks = overdueItems.length > 0 || atRiskItems.length > 0;

  if (!hasRisks) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <p className="text-sm font-medium text-text-primary">All caught up!</p>
        <p className="text-xs text-text-muted mt-1">No overdue or at-risk content</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overdue Section */}
      {overdueItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-sm font-semibold text-danger">
              Overdue ({overdueItems.length})
            </span>
          </div>
          <ul className="space-y-2">
            {overdueItems.slice(0, 3).map(item => (
              <li key={item.id}>
                <Link
                  to={`/editor/${item.id}`}
                  className="flex items-center gap-3 p-2 rounded-md bg-danger-light/50 hover:bg-danger-light transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-danger">
                      Due: {item.deadlineDate && new Date(item.deadlineDate).toLocaleDateString()}
                    </p>
                  </div>
                  <PriorityBadge priority={item.priority} showLabel={false} />
                  <PlatformBadge platform={item.platform} showLabel={false} />
                </Link>
              </li>
            ))}
          </ul>
          {overdueItems.length > 3 && (
            <Link to="/board" className="text-xs text-danger hover:underline mt-2 block">
              +{overdueItems.length - 3} more overdue
            </Link>
          )}
        </div>
      )}

      {/* At Risk Section */}
      {atRiskItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-sm font-semibold text-warning">
              At Risk ({atRiskItems.length})
            </span>
          </div>
          <ul className="space-y-2">
            {atRiskItems.slice(0, 3).map(item => (
              <li key={item.id}>
                <Link
                  to={`/editor/${item.id}`}
                  className="flex items-center gap-3 p-2 rounded-md bg-warning-light/50 hover:bg-warning-light transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-warning">
                      Due: {item.deadlineDate && new Date(item.deadlineDate).toLocaleDateString()}
                    </p>
                  </div>
                  <PriorityBadge priority={item.priority} showLabel={false} />
                  <PlatformBadge platform={item.platform} showLabel={false} />
                </Link>
              </li>
            ))}
          </ul>
          {atRiskItems.length > 3 && (
            <Link to="/board" className="text-xs text-warning hover:underline mt-2 block">
              +{atRiskItems.length - 3} more at risk
            </Link>
          )}
        </div>
      )}
    </div>
  );
}