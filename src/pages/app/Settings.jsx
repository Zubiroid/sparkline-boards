import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { 
  Sun, 
  Moon, 
  Monitor,
  Bell,
  Mail,
  Shield,
  Trash2,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success, error: showError } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminders: true,
    contentUpdates: true,
  });

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      showError('Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    // In a real app, you'd implement account deletion
    showError('Account deletion requires contacting support');
    setDeleteDialogOpen(false);
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your application preferences
        </p>
      </div>

      {/* Theme */}
      <div className="rounded-lg border bg-card p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sun className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how Workbench looks to you
        </p>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                theme === option.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              )}
            >
              <option.icon className={cn(
                'h-6 w-6',
                theme === option.value ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-sm font-medium',
                theme === option.value ? 'text-primary' : 'text-foreground'
              )}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border bg-card p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notif" className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch
              id="email-notif"
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="push-notif" className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive in-app notifications</p>
              </div>
            </div>
            <Switch
              id="push-notif"
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4" />
              <div>
                <Label htmlFor="task-reminders" className="text-sm font-medium">Task Reminders</Label>
                <p className="text-xs text-muted-foreground">Get reminded about upcoming deadlines</p>
              </div>
            </div>
            <Switch
              id="task-reminders"
              checked={notifications.taskReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, taskReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4" />
              <div>
                <Label htmlFor="content-updates" className="text-sm font-medium">Content Updates</Label>
                <p className="text-xs text-muted-foreground">Notifications when content status changes</p>
              </div>
            </div>
            <Switch
              id="content-updates"
              checked={notifications.contentUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, contentUpdates: checked })}
            />
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-lg border bg-card p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium text-foreground">Sign Out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button 
          variant="destructive" 
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        confirmText="Delete Account"
        onConfirm={handleDeleteAccount}
        variant="destructive"
      />
    </div>
  );
}
