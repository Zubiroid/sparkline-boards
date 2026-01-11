import { useMemo } from 'react';
import { useContent } from '../hooks/useContent';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { ThroughputChart } from '../components/dashboard/ThroughputChart';
import { StatusDistribution } from '../components/dashboard/StatusDistribution';
import { PLATFORM_LABELS, ContentPlatform } from '../types/content';

export default function Insights() {
  const { items, stats, getCompletionTimeStats } = useContent();
  const completionStats = getCompletionTimeStats();

  const platformDistribution = useMemo(() => {
    const counts: Record<ContentPlatform, number> = {
      blog: 0, twitter: 0, linkedin: 0, youtube: 0, instagram: 0, newsletter: 0,
    };
    items.forEach(item => counts[item.platform]++);
    return counts;
  }, [items]);

  return (
    <PageContainer>
      <PageHeader
        title="Insights & Analytics"
        description="Track your content performance and workflow efficiency"
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Throughput */}
        <section className="card p-6">
          <h2 className="heading-4 mb-4">Content Throughput</h2>
          <ThroughputChart items={items} />
        </section>

        {/* Status Distribution */}
        <section className="card p-6">
          <h2 className="heading-4 mb-4">Status Distribution</h2>
          <StatusDistribution stats={stats} />
        </section>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Completion Time */}
        <section className="card p-6">
          <h2 className="heading-4 mb-4">Completion Time</h2>
          {completionStats.avg > 0 ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-background-subtle rounded-lg">
                <p className="text-3xl font-bold text-text-primary">{completionStats.avg}</p>
                <p className="text-sm text-text-muted">Avg. days to publish</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-success">{completionStats.min}</p>
                  <p className="text-xs text-text-muted">Fastest (days)</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-warning">{completionStats.max}</p>
                  <p className="text-xs text-text-muted">Slowest (days)</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted text-center py-8">
              Publish content to see completion metrics
            </p>
          )}
        </section>

        {/* Platform Distribution */}
        <section className="card p-6 lg:col-span-2">
          <h2 className="heading-4 mb-4">Content by Platform</h2>
          <div className="grid grid-cols-3 gap-4">
            {(Object.entries(platformDistribution) as [ContentPlatform, number][]).map(([platform, count]) => (
              <div key={platform} className="text-center p-3 bg-background-subtle rounded-lg">
                <p className="text-2xl font-bold text-text-primary">{count}</p>
                <p className="text-xs text-text-muted">{PLATFORM_LABELS[platform]}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}