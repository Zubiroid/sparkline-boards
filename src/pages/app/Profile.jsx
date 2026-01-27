import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '../../contexts/ToastContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Camera,
  Mail,
  Clock,
  Shield
} from 'lucide-react';

export default function Profile() {
  const { user, profile, refreshProfile, userRole } = useAuth();
  const { success, error: showError } = useToast();
  const fileInputRef = useRef(null);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    timezone: profile?.timezone || 'UTC',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          timezone: formData.timezone,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showError('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showError('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const initials = profile?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Avatar Section */}
      <div className="rounded-lg border bg-card p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Upload a new profile picture. JPG, PNG or GIF. Max 2MB.
            </p>
            {uploading && (
              <p className="text-sm text-primary mt-2">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-lg border bg-card p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Role</p>
              <p className="text-sm text-muted-foreground capitalize">{userRole || 'User'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="rounded-lg border bg-card p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Personal Details</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (US)</option>
              <option value="America/Chicago">Central Time (US)</option>
              <option value="America/Denver">Mountain Time (US)</option>
              <option value="America/Los_Angeles">Pacific Time (US)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Europe/Berlin">Berlin</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Shanghai">Shanghai</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
