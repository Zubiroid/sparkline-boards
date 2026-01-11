import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      {icon && (
        <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4 text-neutral-400">
          {icon}
        </div>
      )}
      <h3 className="heading-4 mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
