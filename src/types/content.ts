export type ContentStatus = 'idea' | 'draft' | 'scheduled' | 'published';

export type ContentPlatform = 'blog' | 'twitter' | 'linkedin' | 'youtube' | 'instagram' | 'newsletter';

export type ContentPriority = 'low' | 'medium' | 'high';

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  status: ContentStatus;
  platform: ContentPlatform;
  priority: ContentPriority;
  tags: string[];
  scheduledDate?: string;
  deadlineDate?: string;
  publishedDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentStats {
  ideas: number;
  drafts: number;
  scheduled: number;
  published: number;
  total: number;
  overdue: number;
  atRisk: number;
}

export type UIDensity = 'compact' | 'comfortable';

export interface WorkflowStage {
  id: ContentStatus;
  label: string;
  wipLimit: number;
  color: string;
}

export interface UserSettings {
  sidebarCollapsed: boolean;
  defaultPlatform: ContentPlatform;
  defaultPriority: ContentPriority;
  defaultTags: string[];
  showCompletedItems: boolean;
  calendarView: 'month' | 'week';
  uiDensity: UIDensity;
  workflowStages: WorkflowStage[];
  customTags: string[];
}

export const STATUS_LABELS: Record<ContentStatus, string> = {
  idea: 'Idea',
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
};

export const PLATFORM_LABELS: Record<ContentPlatform, string> = {
  blog: 'Blog',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  instagram: 'Instagram',
  newsletter: 'Newsletter',
};

export const PLATFORM_ICONS: Record<ContentPlatform, string> = {
  blog: '📝',
  twitter: '𝕏',
  linkedin: '💼',
  youtube: '▶️',
  instagram: '📷',
  newsletter: '📧',
};

export const PRIORITY_LABELS: Record<ContentPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const DEFAULT_WORKFLOW_STAGES: WorkflowStage[] = [
  { id: 'idea', label: 'Idea', wipLimit: 10, color: 'info' },
  { id: 'draft', label: 'Draft', wipLimit: 5, color: 'warning' },
  { id: 'scheduled', label: 'Scheduled', wipLimit: 8, color: 'primary' },
  { id: 'published', label: 'Published', wipLimit: 0, color: 'success' },
];
