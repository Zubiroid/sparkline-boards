import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
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
  CheckSquare, 
  Search, 
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  User
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const statusOptions = ['todo', 'in_progress', 'done'];
const priorityOptions = ['low', 'medium', 'high'];

export default function Tasks() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    project_id: null,
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const { data: taskData, error } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${user.id},assignee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(taskData || []);

      const { data: projectData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('owner_id', user.id);

      setProjects(projectData || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date || null,
          project_id: formData.project_id || null,
          created_by: user.id,
          assignee_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setTasks([data, ...tasks]);
      setCreateDialogOpen(false);
      resetForm();
      success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      showError('Failed to create task');
    }
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date || null,
          project_id: formData.project_id || null,
        })
        .eq('id', selectedTask.id);

      if (error) throw error;

      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...t, ...formData }
          : t
      ));
      setEditDialogOpen(false);
      setSelectedTask(null);
      success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      showError('Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', selectedTask.id);

      if (error) throw error;

      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setDeleteDialogOpen(false);
      setSelectedTask(null);
      success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      showError('Failed to delete task');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;

      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
      showError('Failed to update task');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      due_date: '',
      project_id: null,
    });
  };

  const openEditDialog = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date?.split('T')[0] || '',
      project_id: task.project_id,
    });
    setEditDialogOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group tasks by status
  const groupedTasks = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    done: filteredTasks.filter(t => t.status === 'done'),
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks and track progress
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create your first task to start tracking work"
          action={
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground capitalize">
                  {status.replace('_', ' ')}
                </h3>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {statusTasks.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px] p-3 rounded-lg bg-muted/30 border border-dashed">
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(task)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {status !== 'todo' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'todo')}>
                              Move to To Do
                            </DropdownMenuItem>
                          )}
                          {status !== 'in_progress' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'in_progress')}>
                              Move to In Progress
                            </DropdownMenuItem>
                          )}
                          {status !== 'done' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task, 'done')}>
                              Move to Done
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedTask(task);
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
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <PriorityBadge priority={task.priority} />
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.due_date), 'MMM d')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to track your work
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
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
            <Button onClick={handleCreate} disabled={!formData.title}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due_date">Due Date</Label>
              <Input
                id="edit-due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!formData.title}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
