import { useMemo } from 'react';
import { ContentItem } from '../../types/content';

interface ThroughputChartProps {
  items: ContentItem[];
}

export function ThroughputChart({ items }: ThroughputChartProps) {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weeks: { label: string; published: number; created: number }[] = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const published = items.filter(item => {
        if (!item.publishedDate) return false;
        const date = new Date(item.publishedDate);
        return date >= weekStart && date <= weekEnd;
      }).length;

      const created = items.filter(item => {
        const date = new Date(item.createdAt);
        return date >= weekStart && date <= weekEnd;
      }).length;

      weeks.push({
        label: `Week ${4 - i}`,
        published,
        created,
      });
    }

    return weeks;
  }, [items]);

  const maxValue = Math.max(...weeklyData.flatMap(w => [w.published, w.created]), 1);

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-32">
        {weeklyData.map((week, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end justify-center gap-1 h-24">
              {/* Created bar */}
              <div
                className="w-4 bg-info/30 rounded-t transition-all duration-300"
                style={{ height: `${(week.created / maxValue) * 100}%`, minHeight: week.created > 0 ? '4px' : '0' }}
                title={`Created: ${week.created}`}
              />
              {/* Published bar */}
              <div
                className="w-4 bg-success rounded-t transition-all duration-300"
                style={{ height: `${(week.published / maxValue) * 100}%`, minHeight: week.published > 0 ? '4px' : '0' }}
                title={`Published: ${week.published}`}
              />
            </div>
            <span className="text-xs text-text-muted">{week.label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-info/30" />
          <span className="text-xs text-text-secondary">Created</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-success" />
          <span className="text-xs text-text-secondary">Published</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">
            {weeklyData.reduce((sum, w) => sum + w.published, 0)}
          </p>
          <p className="text-xs text-text-muted">Published (4 weeks)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">
            {weeklyData.reduce((sum, w) => sum + w.created, 0)}
          </p>
          <p className="text-xs text-text-muted">Created (4 weeks)</p>
        </div>
      </div>
    </div>
  );
}