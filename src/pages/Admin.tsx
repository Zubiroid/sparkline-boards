import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { useToast } from '../contexts/ToastContext';

type Tab = 'users' | 'contacts' | 'settings';

interface UserWithRole {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('users');

  // Fetch users with their roles
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles for each user
      const usersWithRoles: UserWithRole[] = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id);
          
          return {
            ...profile,
            roles: (roles || []).map(r => r.role),
          };
        })
      );

      return usersWithRoles;
    },
    enabled: isAdmin,
  });

  // Fetch contact submissions
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactSubmission[];
    },
    enabled: isAdmin,
  });

  // Fetch website settings
  const { data: settings = [], isLoading: settingsLoading, refetch: refetchSettings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const handleUpdateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('website_settings')
        .update({ value })
        .eq('key', key);

      if (error) throw error;
      toast.success('Setting updated', `${key} has been saved`);
      refetchSettings();
    } catch (error: any) {
      toast.error('Update failed', error.message);
    }
  };

  if (authLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-neutral-200 rounded" />
          <div className="h-64 bg-neutral-200 rounded" />
        </div>
      </PageContainer>
    );
  }

  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
              <circle cx="12" cy="12" r="10" />
              <path d="M4.93 4.93l14.14 14.14" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Access Denied</h2>
          <p className="text-text-secondary">You don't have permission to view this page.</p>
        </div>
      </PageContainer>
    );
  }

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'contacts', label: 'Contact Submissions', count: contacts.length },
    { id: 'settings', label: 'Settings', count: settings.length },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Admin Dashboard"
        description="Manage users, view submissions, and configure settings"
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-background-muted rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 text-xs bg-neutral-200 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-background-subtle">
              <tr>
                <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">User</th>
                <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">Roles</th>
                <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usersLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-10 w-48 bg-neutral-200 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-40 bg-neutral-200 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 bg-neutral-200 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-background-subtle/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <span className="font-medium text-text-primary">{user.name || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              role === 'admin'
                                ? 'bg-danger-light text-danger'
                                : role === 'moderator'
                                ? 'bg-warning-light text-warning'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!usersLoading && users.length === 0 && (
            <div className="text-center py-12 text-text-muted">No users found</div>
          )}
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {contactsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 w-48 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-64 bg-neutral-200 rounded mb-4" />
                <div className="h-16 bg-neutral-200 rounded" />
              </div>
            ))
          ) : contacts.length === 0 ? (
            <div className="card p-12 text-center text-text-muted">
              No contact submissions yet
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-text-primary">{contact.subject}</h3>
                    <p className="text-sm text-text-secondary">
                      From: {contact.name} ({contact.email})
                    </p>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(contact.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-text-primary whitespace-pre-wrap">{contact.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="card p-6">
          {settingsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 w-32 bg-neutral-200 rounded mb-2" />
                  <div className="h-10 bg-neutral-200 rounded" />
                </div>
              ))}
            </div>
          ) : settings.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <p className="mb-4">No settings configured yet.</p>
              <p className="text-sm">Settings can be added via database migrations.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {settings.map((setting) => (
                <div key={setting.id} className="border-b border-border pb-4 last:border-0">
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    {setting.key}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      defaultValue={JSON.stringify(setting.value)}
                      className="input flex-1"
                      onBlur={(e) => {
                        try {
                          const value = JSON.parse(e.target.value);
                          if (JSON.stringify(value) !== JSON.stringify(setting.value)) {
                            handleUpdateSetting(setting.key, value);
                          }
                        } catch {
                          toast.error('Invalid JSON', 'Please enter valid JSON');
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Last updated: {new Date(setting.updated_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
