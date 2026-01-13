import { ContentItem } from '../types/content';

// Sample data for demonstration purposes
// In production, this data would come from the backend API

export const sampleContentItems: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "10 Tips for Better Content Strategy",
    description: "A comprehensive guide to improving your content marketing approach with actionable insights.",
    content: "Content strategy is the backbone of successful digital marketing...",
    body: "Content strategy is the backbone of successful digital marketing...",
    status: 'published',
    platform: 'blog',
    priority: 'high',
    tags: ['content-strategy', 'marketing', 'tips'],
    authorId: 'demo-user',
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Behind the Scenes: Our Creative Process",
    description: "Take a look at how our team brainstorms, creates, and publishes content.",
    content: "Every great piece of content starts with an idea...",
    body: "Every great piece of content starts with an idea...",
    status: 'published',
    platform: 'youtube',
    priority: 'medium',
    tags: ['behind-the-scenes', 'process', 'creative'],
    authorId: 'demo-user',
    publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Weekly Newsletter: January Trends",
    description: "Curated insights on content trends for the new year.",
    content: "Happy New Year! Here's what we're seeing in content marketing...",
    body: "Happy New Year! Here's what we're seeing in content marketing...",
    status: 'scheduled',
    platform: 'newsletter',
    priority: 'high',
    tags: ['newsletter', 'trends', '2026'],
    authorId: 'demo-user',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "LinkedIn Thought Leadership Post",
    description: "Sharing expertise on industry developments and professional insights.",
    content: "The future of work is changing rapidly...",
    body: "The future of work is changing rapidly...",
    status: 'scheduled',
    platform: 'linkedin',
    priority: 'medium',
    tags: ['thought-leadership', 'linkedin'],
    authorId: 'demo-user',
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Product Launch Announcement",
    description: "Exciting announcement about our new feature release.",
    content: "We're thrilled to announce...",
    body: "We're thrilled to announce...",
    status: 'draft',
    platform: 'twitter',
    priority: 'high',
    tags: ['announcement', 'product'],
    authorId: 'demo-user',
    deadlineDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
  },
  {
    title: "Case Study: Client Success Story",
    description: "How we helped a client achieve 300% growth in engagement.",
    content: "When Company X approached us last year...",
    body: "When Company X approached us last year...",
    status: 'draft',
    platform: 'blog',
    priority: 'medium',
    tags: ['case-study', 'success-story'],
    authorId: 'demo-user',
    deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // At risk
  },
  {
    title: "Instagram Carousel: Quick Tips",
    description: "5-slide carousel with bite-sized content tips.",
    content: "",
    body: "",
    status: 'idea',
    platform: 'instagram',
    priority: 'low',
    tags: ['carousel', 'tips', 'visual'],
    authorId: 'demo-user',
  },
  {
    title: "Podcast Episode Ideas",
    description: "Brainstorming topics for upcoming podcast appearances.",
    content: "",
    body: "",
    status: 'idea',
    platform: 'youtube',
    priority: 'low',
    tags: ['podcast', 'ideas'],
    authorId: 'demo-user',
  },
  {
    title: "Community Q&A Session",
    description: "Live session answering audience questions.",
    content: "",
    body: "",
    status: 'idea',
    platform: 'twitter',
    priority: 'medium',
    tags: ['community', 'engagement', 'live'],
    authorId: 'demo-user',
  },
];

export async function loadSampleData(addItem: (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContentItem>): Promise<void> {
  for (const item of sampleContentItems) {
    await addItem(item);
  }
}
