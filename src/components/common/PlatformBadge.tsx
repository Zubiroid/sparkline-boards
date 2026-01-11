import { ContentPlatform, PLATFORM_LABELS, PLATFORM_ICONS } from '../../types/content';

interface PlatformBadgeProps {
  platform: ContentPlatform;
  showLabel?: boolean;
}

export function PlatformBadge({ platform, showLabel = true }: PlatformBadgeProps) {
  return (
    <span 
      className="inline-flex items-center gap-1.5 text-sm text-text-secondary"
      title={PLATFORM_LABELS[platform]}
    >
      <span aria-hidden="true">{PLATFORM_ICONS[platform]}</span>
      {showLabel && <span>{PLATFORM_LABELS[platform]}</span>}
    </span>
  );
}
