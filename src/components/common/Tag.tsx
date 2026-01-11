interface TagProps {
  label: string;
  onRemove?: () => void;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function Tag({ label, onRemove, interactive, selected, onClick }: TagProps) {
  const baseClasses = "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md transition-colors";
  
  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${
          selected 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
        aria-pressed={selected}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={`${baseClasses} bg-neutral-100 text-neutral-600`}>
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:text-neutral-900 focus:outline-none"
          aria-label={`Remove ${label} tag`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

interface TagListProps {
  tags: string[];
  onRemove?: (tag: string) => void;
  maxVisible?: number;
}

export function TagList({ tags, onRemove, maxVisible }: TagListProps) {
  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = maxVisible ? Math.max(0, tags.length - maxVisible) : 0;

  return (
    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Tags">
      {visibleTags.map(tag => (
        <Tag 
          key={tag} 
          label={tag} 
          onRemove={onRemove ? () => onRemove(tag) : undefined} 
        />
      ))}
      {hiddenCount > 0 && (
        <span className="text-xs text-text-muted px-1">+{hiddenCount} more</span>
      )}
    </div>
  );
}
