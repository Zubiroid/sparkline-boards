import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { ContentCard } from '../components/content/ContentCard';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Tag } from '../components/common/Tag';
import { ContentStatus, STATUS_LABELS } from '../types/content';

const COLUMNS: ContentStatus[] = ['idea', 'draft', 'scheduled', 'published'];

export default function KanbanBoard() {
  const { items, moveItem, getAllTags, getItemsByTag } = useContent();
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ContentStatus | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = getAllTags();

  const filteredItems = useMemo(() => {
    if (!selectedTag) return items;
    return getItemsByTag(selectedTag);
  }, [items, selectedTag, getItemsByTag]);

  const columnItems = useMemo(() => {
    return COLUMNS.reduce((acc, status) => {
      acc[status] = filteredItems.filter(item => item.status === status);
      return acc;
    }, {} as Record<ContentStatus, typeof items>);
  }, [filteredItems]);

  const handleDragStart = (itemId: string) => {
    setDraggedItemId(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (status: ContentStatus) => {
    if (draggedItemId) {
      moveItem(draggedItemId, status);
    }
    setDraggedItemId(null);
    setDragOverColumn(null);
  };

  const columnColors: Record<ContentStatus, string> = {
    idea: 'border-t-info',
    draft: 'border-t-warning',
    scheduled: 'border-t-primary',
    published: 'border-t-success',
  };

  return (
    <PageContainer className="max-w-full">
      <PageHeader
        title="Kanban Board"
        description="Visualize and manage your content workflow"
        actions={
          <Link to="/editor">
            <Button
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              New Content
            </Button>
          </Link>
        }
      />

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-text-secondary">Filter:</span>
          <Tag
            label="All"
            interactive
            selected={!selectedTag}
            onClick={() => setSelectedTag(null)}
          />
          {allTags.map(tag => (
            <Tag
              key={tag}
              label={tag}
              interactive
              selected={selectedTag === tag}
              onClick={() => setSelectedTag(tag)}
            />
          ))}
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[600px]">
        {COLUMNS.map(status => (
          <div
            key={status}
            className={`flex flex-col rounded-lg bg-background-subtle border-t-4 ${columnColors[status]} ${
              dragOverColumn === status ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={() => handleDrop(status)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary">{STATUS_LABELS[status]}</h3>
                <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">
                  {columnItems[status].length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {columnItems[status].length === 0 ? (
                <div className="h-full flex items-center justify-center p-4 border-2 border-dashed border-neutral-200 rounded-lg">
                  <p className="text-sm text-text-muted text-center">
                    {status === 'idea' ? 'Capture your ideas here' : `Drop items to ${STATUS_LABELS[status].toLowerCase()}`}
                  </p>
                </div>
              ) : (
                columnItems[status].map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    compact
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="5" height="18" rx="1" />
                <rect x="10" y="3" width="5" height="12" rx="1" />
                <rect x="17" y="3" width="5" height="7" rx="1" />
              </svg>
            }
            title="Your board is empty"
            description="Create your first content item to start organizing your workflow with our visual kanban board."
            action={
              <Link to="/editor">
                <Button>Create First Content</Button>
              </Link>
            }
          />
        </div>
      )}
    </PageContainer>
  );
}
