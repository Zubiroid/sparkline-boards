import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/dashboard/StatCard';
import { UpcomingList } from '../components/dashboard/UpcomingList';
import { OnboardingCard } from '../components/dashboard/OnboardingCard';
import { StatusDistribution } from '../components/dashboard/StatusDistribution';
import { RiskIndicators } from '../components/dashboard/RiskIndicators';
import { ThroughputChart } from '../components/dashboard/ThroughputChart';
import { Button } from '../components/common/Button';
import { ContentSkeleton } from '../components/common/LoadingSkeletons';
import { ErrorState } from '../components/common/ErrorState';

export default function Dashboard() {
  const { stats, getScheduledItems, items, overdueItems, atRiskItems, isLoading, error } = useContent();
  const upcomingItems = getScheduledItems().slice(0, 5);

  const isNewUser = stats.total === 0;

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" description="Your content operations overview" />
        <ContentSkeleton variant="dashboard" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" description="Your content operations overview" />
        <ErrorState 
          message="Failed to load content. Please try again." 
          retry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Your content operations overview"
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

      {isNewUser ? (
        <OnboardingCard />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Ideas"
              value={stats.ideas}
              color="default"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                  <path d="M9 21h6M10 17v4M14 17v4" />
                </svg>
              }
            />
            <StatCard
              label="Drafts"
              value={stats.drafts}
              color="warning"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              }
            />
            <StatCard
              label="Scheduled"
              value={stats.scheduled}
              color="primary"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            />
            <StatCard
              label="Published"
              value={stats.published}
              color="success"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              }
            />
          </div>

          {/* Risk Indicators Banner */}
          {(stats.overdue > 0 || stats.atRisk > 0) && (
            <div className="card p-4 mb-6 border-warning/50 bg-warning-light/30">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                  <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <span className="text-sm font-medium text-text-primary">
                  {stats.overdue > 0 && <span className="text-danger">{stats.overdue} overdue</span>}
                  {stats.overdue > 0 && stats.atRisk > 0 && ' · '}
                  {stats.atRisk > 0 && <span className="text-warning">{stats.atRisk} at risk</span>}
                </span>
                <Link to="/board" className="ml-auto text-sm text-primary hover:underline">
                  View Board →
                </Link>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Throughput */}
              <section className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-4">Content Throughput</h2>
                  <Link to="/insights" className="text-sm text-primary hover:underline">
                    View Insights
                  </Link>
                </div>
                <ThroughputChart items={items} />
              </section>

              {/* Upcoming */}
              <section className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-4">Upcoming Content</h2>
                  <Link to="/calendar" className="text-sm text-primary hover:underline">
                    View Calendar
                  </Link>
                </div>
                <UpcomingList 
                  items={upcomingItems} 
                  emptyMessage="No scheduled content. Plan your next publish!" 
                />
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status Distribution */}
              <section className="card p-6">
                <h2 className="heading-4 mb-4">Status Overview</h2>
                <StatusDistribution stats={stats} />
              </section>

              {/* Risk Indicators */}
              <section className="card p-6">
                <h2 className="heading-4 mb-4">Attention Needed</h2>
                <RiskIndicators overdueItems={overdueItems} atRiskItems={atRiskItems} />
              </section>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}