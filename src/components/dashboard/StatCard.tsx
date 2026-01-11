import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const colorStyles = {
  default: 'bg-neutral-100 text-neutral-600',
  primary: 'bg-primary-light text-primary',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
};

export function StatCard({ label, value, icon, trend, color = 'default' }: StatCardProps) {
  return (
    <div className="card p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-text-primary">{value}</span>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}
