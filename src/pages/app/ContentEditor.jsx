import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { useToast } from '../../contexts/ToastContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Eye, Calendar } from 'lucide-react';

const statusOptions = ['idea', 'draft', 'review', 'scheduled', 'published'];
const priorityOptions = ['low', 'medium', 'high'];
const platformOptions = ['blog', 'social', 'email', 'documentation'];

export default function ContentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: null,
    status: 'draft',
    priority: 'medium',
    platform: 'blog',
    project_id: null,
    scheduled_date: '',
    deadline_date: '',
    tags: [],
  });

  const isNew = !id || id === 'new';

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch projects
      const { data: projectData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('owner_id', user.id);

      setProjects(projectData || []);

      // Fetch existing content if editing
      if (!isNew) {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title,
            description: data.description || '',
            body: data.body ? JSON.parse(data.body) : null,
            status: data.status,
            priority: data.priority,
            platform: data.platform,
            project_id: data.project_id,
            scheduled_date: data.scheduled_date?.split('T')[0] || '',
            deadline_date: data.deadline_date?.split('T')[0] || '',
            tags: data.tags || [],
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showError('Title is required');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        body: formData.body ? JSON.stringify(formData.body) : null,
        status: formData.status,
        priority: formData.priority,
        platform: formData.platform,
        project_id: formData.project_id || null,
        scheduled_date: formData.scheduled_date || null,
        deadline_date: formData.deadline_date || null,
        tags: formData.tags,
        author_id: user.id,
      };

      if (isNew) {
        const { data, error } = await supabase
          .from('content')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        success('Content created successfully');
        navigate(`/app/content/${data.id}`);
      } else {
        const { error } = await supabase
          .from('content')
          .update(payload)
          .eq('id', id);

        if (error) throw error;

        success('Content saved successfully');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showError('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleBodyChange = (value) => {
    setFormData({ ...formData, body: value });
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/app/content')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              {isNew ? 'New Content' : 'Edit Content'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter content title..."
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary or excerpt..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Content Body</Label>
              <RichTextEditor
                value={formData.body}
                onChange={handleBodyChange}
                placeholder="Start writing your content..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Settings</h3>
              
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
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Scheduling</h3>
              
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Scheduled Date</Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline_date">Deadline</Label>
                <Input
                  id="deadline_date"
                  type="date"
                  value={formData.deadline_date}
                  onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Tags</h3>
              <Input
                placeholder="Add tags (comma separated)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
