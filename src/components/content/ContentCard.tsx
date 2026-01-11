import { Link } from 'react-router-dom';
import { ContentItem } from '../../types/content';
import { StatusBadge } from '../common/StatusBadge';
import { PlatformBadge } from '../common/PlatformBadge';
import { TagList } from '../common/Tag';

interface ContentCardProps {
  item: ContentItem;
  onClick?: () => void;
  compact?: boolean;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function ContentCard({ 
  item, 
  onClick, 
  compact = false,
  draggable = false,
  onDragStart,
  onDragEnd
}: ContentCardProps) {
  const formattedDate = item.scheduledDate 
    ? new Date(item.scheduledDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-medium text-text-primary line-clamp-2 ${compact ? 'text-sm' : ''}`}>
          {item.title || 'Untitled'}
        </h3>
        {!compact && <StatusBadge status={item.status} size="sm" />}
      </div>
      
      {!compact && item.description && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
          {item.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <PlatformBadge platform={item.platform} showLabel={!compact} />
          {compact && <StatusBadge status={item.status} size="sm" />}
        </div>
        {formattedDate && (
          <span className="text-xs text-text-muted">{formattedDate}</span>
        )}
      </div>

      {!compact && item.tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <TagList tags={item.tags} maxVisible={3} />
        </div>
      )}
    </>
  );

  const baseClasses = `card card-hover p-4 flex flex-col cursor-pointer animate-fade-up ${
    draggable ? 'cursor-grab active:cursor-grabbing' : ''
  }`;

  if (onClick) {
    return (
      <button
        type="button"
        className={`${baseClasses} text-left w-full`}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        aria-label={`Edit ${item.title || 'Untitled'}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      to={`/editor/${item.id}`}
      className={baseClasses}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {cardContent}
    </Link>
  );
}
