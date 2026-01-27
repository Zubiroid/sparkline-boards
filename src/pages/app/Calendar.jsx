import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ChevronLeft, 
  ChevronRight,
  FileText,
  CheckSquare
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contentItems, setContentItems] = useState([]);
  const [taskItems, setTaskItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchCalendarData();
  }, [user, currentDate]);

  const fetchCalendarData = async () => {
    if (!user) return;

    try {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      // Fetch content with deadlines or scheduled dates
      const { data: content } = await supabase
        .from('content')
        .select('id, title, status, scheduled_date, deadline_date')
        .eq('author_id', user.id)
        .or(`scheduled_date.gte.${monthStart.toISOString()},deadline_date.gte.${monthStart.toISOString()}`)
        .or(`scheduled_date.lte.${monthEnd.toISOString()},deadline_date.lte.${monthEnd.toISOString()}`);

      setContentItems(content || []);

      // Fetch tasks with due dates
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, status, priority, due_date')
        .or(`created_by.eq.${user.id},assignee_id.eq.${user.id}`)
        .gte('due_date', monthStart.toISOString())
        .lte('due_date', monthEnd.toISOString());

      setTaskItems(tasks || []);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getEventsForDate = (date) => {
    const events = [];

    contentItems.forEach(item => {
      if (item.scheduled_date && isSameDay(new Date(item.scheduled_date), date)) {
        events.push({ ...item, type: 'content', eventType: 'scheduled' });
      }
      if (item.deadline_date && isSameDay(new Date(item.deadline_date), date)) {
        events.push({ ...item, type: 'content', eventType: 'deadline' });
      }
    });

    taskItems.forEach(item => {
      if (item.due_date && isSameDay(new Date(item.due_date), date)) {
        events.push({ ...item, type: 'task' });
      }
    });

    return events;
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View content deadlines and task due dates
          </p>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const events = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'min-h-[120px] p-2 border-b border-r cursor-pointer transition-colors',
                  !isCurrentMonth && 'bg-muted/30',
                  isSelected && 'bg-primary/5 ring-2 ring-primary ring-inset',
                  isToday(day) && 'bg-primary/10'
                )}
              >
                <div className={cn(
                  'text-sm font-medium mb-1',
                  !isCurrentMonth && 'text-muted-foreground',
                  isToday(day) && 'text-primary'
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {events.slice(0, 3).map((event, i) => (
                    <div
                      key={`${event.type}-${event.id}-${i}`}
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded truncate flex items-center gap-1',
                        event.type === 'content' && event.eventType === 'deadline' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                        event.type === 'content' && event.eventType === 'scheduled' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                        event.type === 'task' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      )}
                    >
                      {event.type === 'content' ? (
                        <FileText className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <CheckSquare className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-xs text-muted-foreground px-1">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-sm text-muted-foreground">No events scheduled for this day</p>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map((event, i) => (
                <div
                  key={`detail-${event.type}-${event.id}-${i}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {event.type === 'content' ? (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {event.type === 'content' 
                          ? `${event.eventType}` 
                          : 'Task due'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30" />
          <span className="text-muted-foreground">Content Deadline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/30" />
          <span className="text-muted-foreground">Content Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-100 dark:bg-purple-900/30" />
          <span className="text-muted-foreground">Task Due</span>
        </div>
      </div>
    </div>
  );
}
