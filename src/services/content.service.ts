// Content Service Interface
// This service contract defines how the frontend will interact with the backend
// Currently unimplemented - will be connected to a real backend later

import { Content, ContentStatus } from '../types/content';

export interface ContentFilter {
  status?: ContentStatus;
  authorId?: string;
  tags?: string[];
  search?: string;
}

export interface ContentServiceError {
  message: string;
  code: string;
}

// Service interface - to be implemented when backend is available
export interface IContentService {
  getAll(filter?: ContentFilter): Promise<Content[]>;
  getById(id: string): Promise<Content | null>;
  create(content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content>;
  update(id: string, updates: Partial<Content>): Promise<Content>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: ContentStatus): Promise<Content>;
}

// Placeholder implementation that always indicates backend is not connected
class ContentServiceNotImplemented implements IContentService {
  private readonly notImplementedError: ContentServiceError = {
    message: 'Backend service not connected. This feature requires a backend implementation.',
    code: 'SERVICE_NOT_IMPLEMENTED',
  };

  async getAll(_filter?: ContentFilter): Promise<Content[]> {
    // Returns empty array to indicate no data available from backend
    return [];
  }

  async getById(_id: string): Promise<Content | null> {
    return null;
  }

  async create(_content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    throw this.notImplementedError;
  }

  async update(_id: string, _updates: Partial<Content>): Promise<Content> {
    throw this.notImplementedError;
  }

  async delete(_id: string): Promise<void> {
    throw this.notImplementedError;
  }

  async updateStatus(_id: string, _status: ContentStatus): Promise<Content> {
    throw this.notImplementedError;
  }
}

// Export singleton instance
export const contentService: IContentService = new ContentServiceNotImplemented();

// Helper to check if service is implemented
export function isContentServiceImplemented(): boolean {
  return false; // Will be true when backend is connected
}
