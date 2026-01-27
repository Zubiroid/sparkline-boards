import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
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
  FileText, 
  Search, 
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusOptions = ['all', 'idea', 'draft', 'review', 'scheduled', 'published'];
const platformOptions = ['all', 'blog', 'social', 'email', 'documentation'];

export default function Content() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch content
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('author_id', user.id)
        .order('updated_at', { ascending: false });

      if (contentError) throw contentError;
      setContent(contentData || []);

      // Fetch projects for filter
      const { data: projectData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('owner_id', user.id);

      setProjects(projectData || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      showError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', selectedContent.id);

      if (error) throw error;

      setContent(content.filter(c => c.id !== selectedContent.id));
      setDeleteDialogOpen(false);
      setSelectedContent(null);
      success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      showError('Failed to delete content');
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesProject = projectFilter === 'all' || item.project_id === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content</h1>
          <p className="text-muted-foreground mt-1">
            Manage your content entries across all projects
          </p>
        </div>
        <Button onClick={() => navigate('/app/content/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
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
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content List */}
      {filteredContent.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No content yet"
          description="Create your first content entry to get started"
          action={
            <Button onClick={() => navigate('/app/content/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          }
        />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Platform</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Updated</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link 
                      to={`/app/content/${item.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground capitalize">
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/app/content/${item.id}`)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedContent(item);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Content"
        description={`Are you sure you want to delete "${selectedContent?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
