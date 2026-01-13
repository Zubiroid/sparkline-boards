import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ContentItem, ContentStats, ContentStatus, ContentPlatform, ContentPriority } from '../types/content';

// Map database row to ContentItem
function mapDbToContentItem(row: {
  id: string;
  title: string;
  description: string | null;
  body: string | null;
  status: string;
  platform: string;
  priority: string;
  tags: string[] | null;
  author_id: string;
  scheduled_date: string | null;
  deadline_date: string | null;
  published_date: string | null;
  created_at: string;
  updated_at: string;
}): ContentItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    content: row.body || undefined,
    body: row.body || '',
    status: row.status as ContentStatus,
    platform: row.platform as ContentPlatform,
    priority: row.priority as ContentPriority,
    tags: row.tags || [],
    authorId: row.author_id,
    scheduledDate: row.scheduled_date || undefined,
    deadlineDate: row.deadline_date || undefined,
    publishedDate: row.published_date || undefined,
    completedAt: row.published_date || undefined, // Use published_date as completedAt
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper to check if an item is overdue
const isOverdue = (item: ContentItem): boolean => {
  if (!item.deadlineDate || item.status === 'published') return false;
  return new Date(item.deadlineDate) < new Date();
};

// Helper to check if an item is at risk (deadline within 3 days)
const isAtRisk = (item: ContentItem): boolean => {
  if (!item.deadlineDate || item.status === 'published' || isOverdue(item)) return false;
  const deadline = new Date(item.deadlineDate);
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  return deadline <= threeDaysFromNow;
};

export function useContent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all content for the current user
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['content', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(mapDbToContentItem);
    },
    enabled: !!user?.id,
  });

  // Add content mutation
  const addMutation = useMutation({
    mutationFn: async (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.id) throw new Error('Must be logged in to create content');
      
      const { data: newItem, error } = await supabase
        .from('content')
        .insert({
          title: data.title,
          description: data.description || null,
          body: data.body || data.content || '',
          status: data.status,
          platform: data.platform,
          priority: data.priority,
          tags: data.tags,
          author_id: user.id,
          scheduled_date: data.scheduledDate || null,
          deadline_date: data.deadlineDate || null,
          published_date: data.publishedDate || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbToContentItem(newItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });

  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContentItem> }) => {
      const updateData: Record<string, unknown> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description || null;
      if (updates.body !== undefined) updateData.body = updates.body;
      if (updates.content !== undefined) updateData.body = updates.content;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.platform !== undefined) updateData.platform = updates.platform;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.scheduledDate !== undefined) updateData.scheduled_date = updates.scheduledDate || null;
      if (updates.deadlineDate !== undefined) updateData.deadline_date = updates.deadlineDate || null;
      if (updates.publishedDate !== undefined) updateData.published_date = updates.publishedDate || null;
      
      const { data, error } = await supabase
        .from('content')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbToContentItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });

  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });

  // Calculate stats
  const stats: ContentStats = useMemo(() => ({
    ideas: items.filter(i => i.status === 'idea').length,
    drafts: items.filter(i => i.status === 'draft').length,
    scheduled: items.filter(i => i.status === 'scheduled').length,
    published: items.filter(i => i.status === 'published').length,
    total: items.length,
    overdue: items.filter(isOverdue).length,
    atRisk: items.filter(isAtRisk).length,
  }), [items]);

  const overdueItems = useMemo(() => items.filter(isOverdue), [items]);
  const atRiskItems = useMemo(() => items.filter(isAtRisk), [items]);

  const addItem = useCallback((data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addMutation.mutateAsync(data);
  }, [addMutation]);

  const updateItem = useCallback((id: string, updates: Partial<ContentItem>) => {
    return updateMutation.mutateAsync({ id, updates });
  }, [updateMutation]);

  const deleteItem = useCallback((id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const moveItem = useCallback((id: string, newStatus: ContentStatus) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const updates: Partial<ContentItem> = {
      status: newStatus,
    };

    if (newStatus === 'published' && !item.publishedDate) {
      updates.publishedDate = new Date().toISOString();
    }

    return updateMutation.mutateAsync({ id, updates });
  }, [items, updateMutation]);

  const getItemsByStatus = useCallback((status: ContentStatus) => {
    return items.filter(item => item.status === status);
  }, [items]);

  const getItemsByPlatform = useCallback((platform: ContentPlatform) => {
    return items.filter(item => item.platform === platform);
  }, [items]);

  const getItemsByPriority = useCallback((priority: ContentPriority) => {
    return items.filter(item => item.priority === priority);
  }, [items]);

  const getItemsByTag = useCallback((tag: string) => {
    return items.filter(item => item.tags.includes(tag));
  }, [items]);

  const getScheduledItems = useCallback(() => {
    return items
      .filter(item => item.status === 'scheduled' && item.scheduledDate)
      .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
  }, [items]);

  const getItemById = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    items.forEach(item => item.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [items]);

  // Validation for status transitions with WIP limits
  const canMoveToStatus = useCallback((itemId: string, newStatus: ContentStatus, wipLimit: number) => {
    if (wipLimit === 0) return true; // No limit
    const currentCount = items.filter(i => i.status === newStatus && i.id !== itemId).length;
    return currentCount < wipLimit;
  }, [items]);

  const getCompletionTimeStats = useCallback(() => {
    const completedItems = items.filter(i => i.status === 'published' && i.completedAt && i.createdAt);
    if (completedItems.length === 0) return { avg: 0, min: 0, max: 0 };

    const times = completedItems.map(item => {
      const created = new Date(item.createdAt).getTime();
      const completed = new Date(item.completedAt!).getTime();
      return (completed - created) / (1000 * 60 * 60 * 24); // Days
    });

    return {
      avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length * 10) / 10,
      min: Math.round(Math.min(...times) * 10) / 10,
      max: Math.round(Math.max(...times) * 10) / 10,
    };
  }, [items]);

  return {
    items,
    stats,
    overdueItems,
    atRiskItems,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
    getItemsByStatus,
    getItemsByPlatform,
    getItemsByPriority,
    getItemsByTag,
    getScheduledItems,
    getItemById,
    getAllTags,
    canMoveToStatus,
    getCompletionTimeStats,
    isLoading,
    error,
    isAddingItem: addMutation.isPending,
    isUpdatingItem: updateMutation.isPending,
    isDeletingItem: deleteMutation.isPending,
  };
}
