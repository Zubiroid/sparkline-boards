import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusDistribution } from '../../components/dashboard/StatusDistribution';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { UpcomingDeadlines } from '../../components/dashboard/UpcomingDeadlines';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CheckSquare, 
  FolderKanban, 
  Bell,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function Overview() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContent: 0,
    totalTasks: 0,
    totalProjects: 0,
    unreadNotifications: 0,
  });
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch content count
      const { count: contentCount } = await supabase
        .from('content')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);

      // Fetch tasks count
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .or(`created_by.eq.${user.id},assignee_id.eq.${user.id}`);

      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      // Fetch unread notifications
      const { count: notifCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      setStats({
        totalContent: contentCount || 0,
        totalTasks: tasksCount || 0,
        totalProjects: projectsCount || 0,
        unreadNotifications: notifCount || 0,
      });

      // Fetch content status distribution
      const { data: contentData } = await supabase
        .from('content')
        .select('status')
        .eq('author_id', user.id);

      if (contentData) {
        const statusCounts = contentData.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        
        setStatusDistribution(
          Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
          }))
        );
      }

      // Fetch upcoming deadlines (content and tasks)
      const { data: upcomingContent } = await supabase
        .from('content')
        .select('id, title, status, deadline_date')
        .eq('author_id', user.id)
        .not('deadline_date', 'is', null)
        .gte('deadline_date', new Date().toISOString())
        .order('deadline_date', { ascending: true })
        .limit(3);

      const { data: upcomingTasks } = await supabase
        .from('tasks')
        .select('id, title, status, priority, due_date')
        .or(`created_by.eq.${user.id},assignee_id.eq.${user.id}`)
        .not('due_date', 'is', null)
        .gte('due_date', new Date().toISOString())
        .order('due_date', { ascending: true })
        .limit(3);

      const deadlines = [
        ...(upcomingContent || []).map(c => ({
          id: c.id,
          title: c.title,
          status: c.status,
          deadline: c.deadline_date,
          type: 'content',
        })),
        ...(upcomingTasks || []).map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          deadline: t.due_date,
          type: 'task',
        })),
      ].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5);

      setUpcomingDeadlines(deadlines);

      // Fetch recent notifications as activity
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(
        (notifications || []).map(n => ({
          id: n.id,
          message: n.message || n.title,
          type: n.type,
          created_at: n.created_at,
        }))
      );

      // Generate mock activity data for chart (last 7 days)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      setActivityData(
        days.map(day => ({
          date: day,
          content: Math.floor(Math.random() * 10),
          tasks: Math.floor(Math.random() * 15),
        }))
      );

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {profile?.name || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your projects
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button asChild>
          <Link to="/app/content/new">
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/app/tasks">
            <CheckSquare className="h-4 w-4 mr-2" />
            View Tasks
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/app/projects">
            <FolderKanban className="h-4 w-4 mr-2" />
            Projects
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Content"
          value={stats.totalContent}
          icon={FileText}
        />
        <StatCard
          title="Active Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
        />
        <StatCard
          title="Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
        />
        <StatCard
          title="Notifications"
          value={stats.unreadNotifications}
          icon={Bell}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StatusDistribution data={statusDistribution} />
        <ActivityChart data={activityData} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingDeadlines items={upcomingDeadlines} />
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  );
}
