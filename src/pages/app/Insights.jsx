import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusDistribution } from '../../components/dashboard/StatusDistribution';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { 
  FileText, 
  CheckSquare, 
  FolderKanban, 
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { subDays, format } from 'date-fns';

export default function Insights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
    avgTimeToPublish: 0,
  });
  const [contentByStatus, setContentByStatus] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [contentByPlatform, setContentByPlatform] = useState([]);

  useEffect(() => {
    fetchInsightsData();
  }, [user]);

  const fetchInsightsData = async () => {
    if (!user) return;

    try {
      // Fetch content stats
      const { data: content } = await supabase
        .from('content')
        .select('*')
        .eq('author_id', user.id);

      const contentData = content || [];
      const publishedContent = contentData.filter(c => c.status === 'published');

      // Fetch task stats
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${user.id},assignee_id.eq.${user.id}`);

      const taskData = tasks || [];
      const completedTasks = taskData.filter(t => t.status === 'done');

      // Fetch project count
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      setStats({
        totalContent: contentData.length,
        publishedContent: publishedContent.length,
        totalTasks: taskData.length,
        completedTasks: completedTasks.length,
        totalProjects: projectCount || 0,
        avgTimeToPublish: calculateAvgTimeToPublish(contentData),
      });

      // Content by status
      const statusCounts = contentData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      setContentByStatus(
        Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
      );

      // Tasks by status
      const taskStatusCounts = taskData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      setTasksByStatus([
        { name: 'To Do', value: taskStatusCounts.todo || 0, fill: 'hsl(var(--muted-foreground))' },
        { name: 'In Progress', value: taskStatusCounts.in_progress || 0, fill: 'hsl(217, 91%, 60%)' },
        { name: 'Done', value: taskStatusCounts.done || 0, fill: 'hsl(142, 76%, 36%)' },
      ]);

      // Content by platform
      const platformCounts = contentData.reduce((acc, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1;
        return acc;
      }, {});
      setContentByPlatform(
        Object.entries(platformCounts).map(([platform, count]) => ({
          name: platform.charAt(0).toUpperCase() + platform.slice(1),
          value: count,
        }))
      );

      // Generate activity data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayContent = contentData.filter(c => 
          format(new Date(c.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length;
        const dayTasks = taskData.filter(t => 
          format(new Date(t.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length;

        return {
          date: format(date, 'EEE'),
          content: dayContent,
          tasks: dayTasks,
        };
      });
      setActivityData(last7Days);

    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgTimeToPublish = (contentData) => {
    const publishedWithDates = contentData.filter(
      c => c.status === 'published' && c.published_date && c.created_at
    );
    
    if (publishedWithDates.length === 0) return 0;

    const totalDays = publishedWithDates.reduce((sum, c) => {
      const created = new Date(c.created_at);
      const published = new Date(c.published_date);
      return sum + Math.round((published - created) / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / publishedWithDates.length);
  };

  if (loading) {
    return <PageLoader />;
  }

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const publishRate = stats.totalContent > 0 
    ? Math.round((stats.publishedContent / stats.totalContent) * 100) 
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1">
          Analytics and metrics for your content and tasks
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Content"
          value={stats.totalContent}
          icon={FileText}
          change={`${publishRate}% published`}
          trend={publishRate > 50 ? 'up' : 'down'}
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          change={`${completionRate}% complete`}
          trend={completionRate > 50 ? 'up' : 'down'}
        />
        <StatCard
          title="Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
        />
        <StatCard
          title="Avg. Time to Publish"
          value={`${stats.avgTimeToPublish}d`}
          icon={Clock}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StatusDistribution data={contentByStatus} />
        
        {/* Task Completion Chart */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Task Completion</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActivityChart data={activityData} />
        
        {/* Content by Platform */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Content by Platform</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentByPlatform}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-foreground">Task Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.completedTasks} of {stats.totalTasks} tasks completed
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground">Publish Rate</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{publishRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.publishedContent} of {stats.totalContent} content published
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-foreground">Content Velocity</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.avgTimeToPublish}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Average days from creation to publish
          </p>
        </div>
      </div>
    </div>
  );
}
