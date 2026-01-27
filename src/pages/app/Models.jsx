import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Database, 
  MoreVertical,
  Pencil,
  Trash2,
  Type,
  AlignLeft,
  ToggleLeft,
  Calendar,
  Link as LinkIcon,
  Lock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fieldTypes = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'rich_text', label: 'Rich Text', icon: AlignLeft },
  { value: 'boolean', label: 'Boolean', icon: ToggleLeft },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'relation', label: 'Relation', icon: LinkIcon },
];

export default function Models() {
  const { user, userRole } = useAuth();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    project_id: null,
  });
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    description: '',
  });

  // Check if user has admin access
  const isAdmin = userRole === 'admin' || userRole === 'moderator';

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, name')
        .eq('owner_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch models
  const { data: models = [], isLoading } = useQuery({
    queryKey: ['content_models', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_models')
        .select('*, projects(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Create model mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from('content_models')
        .insert({
          name: data.name,
          slug: data.slug || generateSlug(data.name),
          description: data.description,
          project_id: data.project_id,
          fields: [],
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['content_models']);
      setCreateDialogOpen(false);
      resetForm();
      success('Content model created successfully');
    },
    onError: (error) => {
      console.error('Error creating model:', error);
      showError('Failed to create content model');
    },
  });

  // Update model mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase
        .from('content_models')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['content_models']);
      setEditDialogOpen(false);
      setSelectedModel(null);
      success('Content model updated successfully');
    },
    onError: (error) => {
      console.error('Error updating model:', error);
      showError('Failed to update content model');
    },
  });

  // Delete model mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('content_models')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['content_models']);
      setDeleteDialogOpen(false);
      setSelectedModel(null);
      success('Content model deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting model:', error);
      showError('Failed to delete content model');
    },
  });

  // Add field mutation
  const addFieldMutation = useMutation({
    mutationFn: async ({ modelId, field }) => {
      const model = models.find(m => m.id === modelId);
      const fields = [...(model.fields || []), { ...field, id: crypto.randomUUID() }];
      const { error } = await supabase
        .from('content_models')
        .update({ fields })
        .eq('id', modelId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['content_models']);
      setFieldDialogOpen(false);
      setNewField({ name: '', type: 'text', required: false, description: '' });
      success('Field added successfully');
    },
    onError: (error) => {
      console.error('Error adding field:', error);
      showError('Failed to add field');
    },
  });

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', project_id: null });
  };

  const openEditDialog = (model) => {
    setSelectedModel(model);
    setFormData({
      name: model.name,
      slug: model.slug,
      description: model.description || '',
      project_id: model.project_id,
    });
    setEditDialogOpen(true);
  };

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <EmptyState
          icon={Lock}
          title="Admin Access Required"
          description="Content models can only be managed by administrators and moderators."
        />
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Models</h1>
          <p className="text-muted-foreground mt-1">
            Define content types and their fields for your headless CMS
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Model
        </Button>
      </div>

      {models.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No content models yet"
          description="Create your first content model to define the structure of your content"
          action={
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Model
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{model.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{model.slug}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedModel(model);
                      setFieldDialogOpen(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(model)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedModel(model);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {model.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {model.description}
                </p>
              )}

              {/* Fields Preview */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Fields ({(model.fields || []).length})
                </p>
                {(model.fields || []).slice(0, 4).map((field) => {
                  const FieldIcon = fieldTypes.find(t => t.value === field.type)?.icon || Type;
                  return (
                    <div key={field.id} className="flex items-center gap-2 text-sm">
                      <FieldIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{field.name}</span>
                      {field.required && (
                        <span className="text-destructive text-xs">*</span>
                      )}
                    </div>
                  );
                })}
                {(model.fields || []).length > 4 && (
                  <p className="text-xs text-muted-foreground">
                    +{(model.fields || []).length - 4} more fields
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                <span>{model.projects?.name || 'No project'}</span>
                <span>
                  Updated {formatDistanceToNow(new Date(model.updated_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Model Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Content Model</DialogTitle>
            <DialogDescription>
              Define a new content type for your headless CMS
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                })}
                placeholder="Blog Post"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">API Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="blog_post"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this content type..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select 
                value={formData.project_id || 'none'} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  project_id: value === 'none' ? null : value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCreateDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => createMutation.mutate(formData)} 
              disabled={!formData.name || !formData.project_id || createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Model'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Model Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Content Model</DialogTitle>
            <DialogDescription>
              Update model details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">API Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => updateMutation.mutate({ id: selectedModel?.id, data: formData })} 
              disabled={!formData.name || updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Field Dialog */}
      <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Field</DialogTitle>
            <DialogDescription>
              Add a new field to {selectedModel?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input
                id="field-name"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                placeholder="title"
              />
            </div>
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select 
                value={newField.type} 
                onValueChange={(value) => setNewField({ ...newField, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-description">Description</Label>
              <Input
                id="field-description"
                value={newField.description}
                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                placeholder="Field description..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="field-required"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                className="rounded border-input"
              />
              <Label htmlFor="field-required" className="text-sm font-normal">
                Required field
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => addFieldMutation.mutate({ modelId: selectedModel?.id, field: newField })} 
              disabled={!newField.name || addFieldMutation.isPending}
            >
              {addFieldMutation.isPending ? 'Adding...' : 'Add Field'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Content Model"
        description={`Are you sure you want to delete "${selectedModel?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={() => deleteMutation.mutate(selectedModel?.id)}
        variant="destructive"
      />
    </div>
  );
}
