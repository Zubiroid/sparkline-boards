import { cn } from '@/lib/utils';

export function LoadingSpinner({ size = 'md', className }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={cn(
      'border-primary border-t-transparent rounded-full animate-spin',
      sizeClasses[size],
      className
    )} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
