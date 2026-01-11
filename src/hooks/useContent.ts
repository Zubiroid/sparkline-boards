import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ContentItem, ContentStats, ContentStatus, ContentPlatform, ContentPriority } from '../types/content';

const STORAGE_KEY = 'contentops_items';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

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
  const [items, setItems] = useLocalStorage<ContentItem[]>(STORAGE_KEY, []);

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
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, [setItems]);

  const updateItem = useCallback((id: string, updates: Partial<ContentItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    ));
  }, [setItems]);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, [setItems]);

  const moveItem = useCallback((id: string, newStatus: ContentStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const updates: Partial<ContentItem> = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      if (newStatus === 'published' && !item.publishedDate) {
        updates.publishedDate = new Date().toISOString();
        updates.completedAt = new Date().toISOString();
      }

      return { ...item, ...updates };
    }));
  }, [setItems]);

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
  };
}
