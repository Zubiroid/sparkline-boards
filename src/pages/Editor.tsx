import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../contexts/ToastContext';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Input, Textarea, Select } from '../components/common/Input';
import { Tag } from '../components/common/Tag';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { AutosaveIndicator } from '../components/editor/AutosaveIndicator';
import { UnsavedChangesWarning } from '../components/editor/UnsavedChangesWarning';
import { ContentStatus, ContentPlatform, ContentPriority, STATUS_LABELS, PLATFORM_LABELS, PRIORITY_LABELS } from '../types/content';

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
const platformOptions = Object.entries(PLATFORM_LABELS).map(([value, label]) => ({ value, label }));
const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }));

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, addItem, updateItem, deleteItem } = useContent();
  const { settings } = useSettings();
  const toast = useToast();

  const existingItem = id ? getItemById(id) : null;
  const isEditing = !!existingItem;

  const [title, setTitle] = useState(existingItem?.title || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [content, setContent] = useState(existingItem?.content || '');
  const [status, setStatus] = useState<ContentStatus>(existingItem?.status || 'idea');
  const [platform, setPlatform] = useState<ContentPlatform>(existingItem?.platform || settings.defaultPlatform);
  const [priority, setPriority] = useState<ContentPriority>(existingItem?.priority || settings.defaultPriority);
  const [scheduledDate, setScheduledDate] = useState(existingItem?.scheduledDate?.split('T')[0] || '');
  const [deadlineDate, setDeadlineDate] = useState(existingItem?.deadlineDate?.split('T')[0] || '');
  const [tags, setTags] = useState<string[]>(existingItem?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | undefined>(existingItem ? new Date(existingItem.updatedAt) : undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDistractedFree, setIsDistractedFree] = useState(false);
  
  const initialValues = useRef({ title, description, content, status, platform, priority, scheduledDate, deadlineDate, tags: tags.join(',') });
  
  const hasUnsavedChanges = 
    title !== initialValues.current.title ||
    description !== initialValues.current.description ||
    content !== initialValues.current.content ||
    status !== initialValues.current.status ||
    platform !== initialValues.current.platform ||
    priority !== initialValues.current.priority ||
    scheduledDate !== initialValues.current.scheduledDate ||
    deadlineDate !== initialValues.current.deadlineDate ||
    tags.join(',') !== initialValues.current.tags;

  useEffect(() => {
    if (hasUnsavedChanges && saveStatus === 'saved') {
      setSaveStatus('unsaved');
    }
  }, [hasUnsavedChanges, saveStatus]);

  // Update form when item changes
  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setDescription(existingItem.description || '');
      setContent(existingItem.content || '');
      setStatus(existingItem.status);
      setPlatform(existingItem.platform);
      setPriority(existingItem.priority);
      setScheduledDate(existingItem.scheduledDate?.split('T')[0] || '');
      setDeadlineDate(existingItem.deadlineDate?.split('T')[0] || '');
      setTags(existingItem.tags);
      initialValues.current = {
        title: existingItem.title,
        description: existingItem.description || '',
        content: existingItem.content || '',
        status: existingItem.status,
        platform: existingItem.platform,
        priority: existingItem.priority,
        scheduledDate: existingItem.scheduledDate?.split('T')[0] || '',
        deadlineDate: existingItem.deadlineDate?.split('T')[0] || '',
        tags: existingItem.tags.join(','),
      };
    }
  }, [existingItem]);

  // Autosave simulation
  const autosaveTimerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (hasUnsavedChanges && isEditing) {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      
      autosaveTimerRef.current = setTimeout(() => {
        handleSave(true);
      }, 3000);
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [title, description, content, status, platform, priority, scheduledDate, deadlineDate, tags]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = useCallback(async (isAutosave = false) => {
    if (!title.trim()) {
      if (!isAutosave) {
        toast.warning('Title required', 'Please enter a title for your content');
      }
      return;
    }

    setSaveStatus('saving');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const itemData = {
      title: title.trim(),
      description: description.trim(),
      content,
      status,
      platform,
      priority,
      tags,
      scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
      deadlineDate: deadlineDate ? new Date(deadlineDate).toISOString() : undefined,
      publishedDate: existingItem?.publishedDate,
      completedAt: existingItem?.completedAt,
    };

    try {
      if (isEditing && id) {
        updateItem(id, itemData);
      } else {
        const newItem = addItem(itemData);
        navigate(`/editor/${newItem.id}`, { replace: true });
      }

      setSaveStatus('saved');
      setLastSaved(new Date());
      initialValues.current = {
        title: title.trim(),
        description: description.trim(),
        content,
        status,
        platform,
        priority,
        scheduledDate,
        deadlineDate,
        tags: tags.join(','),
      };

      if (!isAutosave) {
        toast.success(isEditing ? 'Changes saved' : 'Content created', isEditing ? 'Your changes have been saved' : 'New content item created successfully');
      }
    } catch (error) {
      setSaveStatus('error');
      toast.error('Save failed', 'There was an error saving your content');
    }
  }, [title, description, content, status, platform, priority, tags, scheduledDate, deadlineDate, isEditing, id, existingItem, updateItem, addItem, navigate, toast]);

  const handleDelete = () => {
    if (id) {
      deleteItem(id);
      toast.success('Content deleted', 'The content item has been removed');
      navigate('/board');
    }
    setShowDeleteConfirm(false);
  };

  const handleDiscard = () => {
    if (existingItem) {
      setTitle(existingItem.title);
      setDescription(existingItem.description || '');
      setContent(existingItem.content || '');
      setStatus(existingItem.status);
      setPlatform(existingItem.platform);
      setPriority(existingItem.priority);
      setScheduledDate(existingItem.scheduledDate?.split('T')[0] || '');
      setDeadlineDate(existingItem.deadlineDate?.split('T')[0] || '');
      setTags(existingItem.tags);
      setSaveStatus('saved');
    }
  };

  return (
    <>
      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />
      
      <PageContainer className={isDistractedFree ? 'max-w-4xl mx-auto' : ''}>
        <PageHeader
          title={isEditing ? 'Edit Content' : 'New Content'}
          description={
            <div className="flex items-center gap-4">
              {isEditing && (
                <span className="text-text-muted">
                  Last updated {new Date(existingItem!.updatedAt).toLocaleDateString()}
                </span>
              )}
              <AutosaveIndicator status={saveStatus} lastSaved={lastSaved} />
            </div>
          }
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDistractedFree(!isDistractedFree)}
                className={`btn btn-ghost btn-sm ${isDistractedFree ? 'text-primary' : ''}`}
                title={isDistractedFree ? 'Exit focus mode' : 'Enter focus mode'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isDistractedFree ? (
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
              <Link to="/board">
                <Button variant="ghost">Cancel</Button>
              </Link>
              <Button 
                onClick={() => handleSave(false)} 
                isLoading={saveStatus === 'saving'}
                disabled={!title.trim()}
              >
                {isEditing ? 'Save Changes' : 'Create Content'}
              </Button>
            </div>
          }
        />

        <div className={`grid gap-6 ${isDistractedFree ? '' : 'lg:grid-cols-3'}`}>
          {/* Main Editor */}
          <div className={`space-y-6 ${isDistractedFree ? '' : 'lg:col-span-2'}`}>
            <div className="card p-6 space-y-6">
              <Input
                label="Title"
                placeholder="Enter a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-lg font-semibold"
                error={!title.trim() && saveStatus === 'error' ? 'Title is required' : undefined}
              />

              <Textarea
                label="Description"
                placeholder="Brief description or excerpt..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Content
                </label>
                <textarea
                  className="input min-h-[300px] py-3 resize-y font-mono text-sm"
                  placeholder="Write your content here...

You can include:
- Main points and ideas
- Bullet points
- Links and references
- Call to actions"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-xs text-text-muted">
                  {content.length} characters · ~{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {!isDistractedFree && (
            <div className="space-y-6">
              {/* Status & Platform */}
              <div className="card p-6 space-y-4">
                <h3 className="heading-4">Settings</h3>
                
                <Select
                  label="Status"
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                />

                <Select
                  label="Platform"
                  options={platformOptions}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
                />

                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ContentPriority)}
                />

                <Input
                  label="Deadline"
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  hint="When this content needs to be completed"
                />

                {(status === 'scheduled' || scheduledDate) && (
                  <Input
                    label="Publish Date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    hint="When this content will be published"
                  />
                )}
              </div>

              {/* Tags */}
              <div className="card p-6">
                <h3 className="heading-4 mb-4">Tags</h3>
                
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    variant="secondary" 
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </div>

                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Tag
                        key={tag}
                        label={tag}
                        onRemove={() => handleRemoveTag(tag)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">No tags added yet</p>
                )}
              </div>

              {/* Delete */}
              {isEditing && (
                <div className="card p-6 border-danger/30">
                  <h3 className="heading-4 mb-2 text-danger">Danger Zone</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Once deleted, this content cannot be recovered.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Content
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}