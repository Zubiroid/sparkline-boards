import { cn } from '@/lib/utils';

export function StatCard({ title, value, change, icon: Icon, trend, className }) {
  return (
    <div className={cn(
      'rounded-lg border bg-card p-6 shadow-sm',
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-foreground">{value}</p>
        {change && (
          <span className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-green-600 dark:text-green-400' : 
            trend === 'down' ? 'text-red-600 dark:text-red-400' : 
            'text-muted-foreground'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {change}
          </span>
        )}
      </div>
    </div>
  );
}
