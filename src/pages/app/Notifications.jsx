import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { EmptyState } from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Trash2,
  FileText,
  CheckSquare,
  Users,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const notificationIcons = {
  content: FileText,
  task: CheckSquare,
  team: Users,
  system: AlertCircle,
};

export default function Notifications() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? payload.new : n)
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      showError('Failed to mark notifications as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      showError('Failed to delete notification');
    }
  };

  const clearAll = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications([]);
      success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      showError('Failed to clear notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell;
            
            return (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                  !notification.read 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-card hover:bg-muted/50'
                )}
              >
                <div className={cn(
                  'rounded-full p-2 mt-0.5',
                  !notification.read 
                    ? 'bg-primary/10' 
                    : 'bg-muted'
                )}>
                  <Icon className={cn(
                    'h-5 w-5',
                    !notification.read 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      'text-sm',
                      !notification.read 
                        ? 'font-semibold text-foreground' 
                        : 'font-medium text-foreground'
                    )}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {notification.message && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
