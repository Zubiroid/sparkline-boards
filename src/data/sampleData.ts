import { ContentItem } from '../types/content';

export const sampleContentItems: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "10 Tips for Better Content Strategy",
    description: "A comprehensive guide to improving your content marketing approach with actionable insights.",
    content: "Content strategy is the backbone of successful digital marketing...",
    status: 'published',
    platform: 'blog',
    priority: 'high',
    tags: ['content-strategy', 'marketing', 'tips'],
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Behind the Scenes: Our Creative Process",
    description: "Take a look at how our team brainstorms, creates, and publishes content.",
    content: "Every great piece of content starts with an idea...",
    status: 'published',
    platform: 'youtube',
    priority: 'medium',
    tags: ['behind-the-scenes', 'process', 'creative'],
    publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Weekly Newsletter: January Trends",
    description: "Curated insights on content trends for the new year.",
    content: "Happy New Year! Here's what we're seeing in content marketing...",
    status: 'scheduled',
    platform: 'newsletter',
    priority: 'high',
    tags: ['newsletter', 'trends', '2026'],
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "LinkedIn Thought Leadership Post",
    description: "Sharing expertise on industry developments and professional insights.",
    content: "The future of work is changing rapidly...",
    status: 'scheduled',
    platform: 'linkedin',
    priority: 'medium',
    tags: ['thought-leadership', 'linkedin'],
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Product Launch Announcement",
    description: "Exciting announcement about our new feature release.",
    content: "We're thrilled to announce...",
    status: 'draft',
    platform: 'twitter',
    priority: 'high',
    tags: ['announcement', 'product'],
    deadlineDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
  },
  {
    title: "Case Study: Client Success Story",
    description: "How we helped a client achieve 300% growth in engagement.",
    content: "When Company X approached us last year...",
    status: 'draft',
    platform: 'blog',
    priority: 'medium',
    tags: ['case-study', 'success-story'],
    deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // At risk
  },
  {
    title: "Instagram Carousel: Quick Tips",
    description: "5-slide carousel with bite-sized content tips.",
    status: 'idea',
    platform: 'instagram',
    priority: 'low',
    tags: ['carousel', 'tips', 'visual'],
  },
  {
    title: "Podcast Episode Ideas",
    description: "Brainstorming topics for upcoming podcast appearances.",
    status: 'idea',
    platform: 'youtube',
    priority: 'low',
    tags: ['podcast', 'ideas'],
  },
  {
    title: "Community Q&A Session",
    description: "Live session answering audience questions.",
    status: 'idea',
    platform: 'twitter',
    priority: 'medium',
    tags: ['community', 'engagement', 'live'],
  },
];

export function loadSampleData(addItem: (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => ContentItem): void {
  sampleContentItems.forEach(item => addItem(item));
}