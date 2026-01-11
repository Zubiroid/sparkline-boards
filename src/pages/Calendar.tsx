import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useSettings } from '../hooks/useSettings';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { ContentItem } from '../types/content';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add padding days from previous month
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add padding days for next month
  const endPadding = 6 - lastDay.getDay();
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  items: ContentItem[];
}

function CalendarDay({ date, isCurrentMonth, items }: CalendarDayProps) {
  const today = isToday(date);
  
  return (
    <div
      className={`min-h-[120px] p-2 border-b border-r border-border ${
        isCurrentMonth ? 'bg-surface' : 'bg-background-muted'
      }`}
    >
      <div className={`text-sm font-medium mb-1 ${
        today 
          ? 'w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center' 
          : isCurrentMonth 
            ? 'text-text-primary' 
            : 'text-text-muted'
      }`}>
        {date.getDate()}
      </div>
      <div className="space-y-1">
        {items.slice(0, 3).map(item => (
          <Link
            key={item.id}
            to={`/editor/${item.id}`}
            className="block p-1.5 rounded bg-primary-light hover:bg-primary/20 transition-colors"
          >
            <p className="text-xs font-medium text-text-primary truncate">{item.title || 'Untitled'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <PlatformBadge platform={item.platform} showLabel={false} />
              <StatusBadge status={item.status} size="sm" />
            </div>
          </Link>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-text-muted px-1">+{items.length - 3} more</p>
        )}
      </div>
    </div>
  );
}

export default function Calendar() {
  const { items } = useContent();
  const { settings } = useSettings();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getDaysInMonth(year, month);

  const itemsByDate = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    items.forEach(item => {
      const dateStr = item.scheduledDate || item.publishedDate;
      if (dateStr) {
        const date = new Date(dateStr);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const existing = map.get(key) || [];
        map.set(key, [...existing, item]);
      }
    });
    return map;
  }, [items]);

  const getItemsForDate = (date: Date): ContentItem[] => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return itemsByDate.get(key) || [];
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <PageContainer className="max-w-full">
      <PageHeader
        title="Content Calendar"
        description="Plan and visualize your content schedule"
        actions={
          <Link to="/editor">
            <Button
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              New Content
            </Button>
          </Link>
        }
      />

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="btn btn-ghost btn-sm"
            aria-label="Previous month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="heading-3 min-w-[200px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className="btn btn-ghost btn-sm"
            aria-label="Next month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map(day => (
            <div
              key={day}
              className="py-3 px-2 text-center text-sm font-semibold text-text-secondary bg-background-subtle border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => (
            <CalendarDay
              key={index}
              date={date}
              isCurrentMonth={date.getMonth() === month}
              items={getItemsForDate(date)}
            />
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
            title="No scheduled content"
            description="Create and schedule content to see it appear on your calendar."
            action={
              <Link to="/editor">
                <Button>Create Content</Button>
              </Link>
            }
          />
        </div>
      )}
    </PageContainer>
  );
}
