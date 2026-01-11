import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Input';
import { ContentPlatform, PLATFORM_LABELS } from '../types/content';

const platformOptions = Object.entries(PLATFORM_LABELS).map(([value, label]) => ({ value, label }));
const calendarViewOptions = [
  { value: 'month', label: 'Monthly View' },
  { value: 'week', label: 'Weekly View' },
];

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { items } = useContent();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);

  const handleClearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Customize your ContentOps experience"
      />

      <div className="max-w-2xl space-y-6">
        {/* Preferences */}
        <section className="card p-6">
          <h2 className="heading-3 mb-6">Preferences</h2>
          
          <div className="space-y-6">
            <Select
              label="Default Platform"
              options={platformOptions}
              value={settings.defaultPlatform}
              onChange={(e) => updateSettings({ defaultPlatform: e.target.value as ContentPlatform })}
            />

            <Select
              label="Calendar View"
              options={calendarViewOptions}
              value={settings.calendarView}
              onChange={(e) => updateSettings({ calendarView: e.target.value as 'month' | 'week' })}
            />

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-primary">Show Completed Items</p>
                <p className="text-sm text-text-secondary">Display published content in lists</p>
              </div>
              <button
                role="switch"
                aria-checked={settings.showCompletedItems}
                onClick={() => updateSettings({ showCompletedItems: !settings.showCompletedItems })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showCompletedItems ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showCompletedItems ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-primary">Compact Sidebar</p>
                <p className="text-sm text-text-secondary">Collapse sidebar to icon-only view</p>
              </div>
              <button
                role="switch"
                aria-checked={settings.sidebarCollapsed}
                onClick={() => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sidebarCollapsed ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sidebarCollapsed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="card p-6">
          <h2 className="heading-3 mb-6">Statistics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background-subtle rounded-lg">
              <p className="text-2xl font-bold text-text-primary">{items.length}</p>
              <p className="text-sm text-text-secondary">Total Content Items</p>
            </div>
            <div className="p-4 bg-background-subtle rounded-lg">
              <p className="text-2xl font-bold text-text-primary">
                {items.filter(i => i.status === 'published').length}
              </p>
              <p className="text-sm text-text-secondary">Published</p>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="card p-6 border-danger/30">
          <h2 className="heading-3 mb-2 text-danger">Data Management</h2>
          <p className="text-sm text-text-secondary mb-6">
            These actions cannot be undone. Please proceed with caution.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="text-sm font-medium text-text-primary">Reset Settings</p>
                <p className="text-sm text-text-secondary">Reset all settings to default values</p>
              </div>
              {showResetConfirm ? (
                <div className="flex gap-2">
                  <Button variant="danger" size="sm" onClick={() => { resetSettings(); setShowResetConfirm(false); }}>
                    Confirm
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(true)}>
                  Reset
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-primary">Clear All Data</p>
                <p className="text-sm text-text-secondary">Delete all content and settings permanently</p>
              </div>
              {showClearDataConfirm ? (
                <div className="flex gap-2">
                  <Button variant="danger" size="sm" onClick={handleClearAllData}>
                    Delete All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowClearDataConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowClearDataConfirm(true)}>
                  Clear Data
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="card p-6">
          <h2 className="heading-3 mb-4">About ContentOps</h2>
          <p className="text-sm text-text-secondary mb-4">
            A content planning dashboard for creators and small teams. Organize your ideas, drafts, and publishing schedule in one visual workspace.
          </p>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Frontend Demo</span>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
