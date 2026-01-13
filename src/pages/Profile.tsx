import { useState, useRef } from 'react';
import { useAuth, Profile as ProfileType } from '../contexts/AuthContext';
import { PageContainer, PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Input, Textarea, Select } from '../components/common/Input';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '@/integrations/supabase/client';

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

export default function Profile() {
  const { user, profile, updateProfile, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [timezone, setTimezone] = useState(profile?.timezone || 'UTC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.warning('Name required', 'Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim(), timezone });
      toast.success('Profile updated', 'Your profile has been saved');
    } catch (error: any) {
      toast.error('Update failed', error.message || 'Could not update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large', 'Please upload an image under 2MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      await updateProfile({ avatar_url: publicUrl });
      toast.success('Avatar updated', 'Your profile photo has been changed');
    } catch (error: any) {
      toast.error('Upload failed', error.message || 'Could not upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (authLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-neutral-200 rounded" />
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-neutral-200 rounded" />
                <div className="h-4 w-48 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-neutral-200 rounded" />
              <div className="h-24 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Profile"
        description="Manage your personal information and preferences"
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Avatar Section */}
        <div className="card p-6">
          <h3 className="heading-4 mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="relative group"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div>
              <p className="text-sm text-text-primary font-medium mb-1">
                Click to upload new photo
              </p>
              <p className="text-xs text-text-muted">
                JPG, PNG, or GIF. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h3 className="heading-4 mb-4">Basic Information</h3>
          
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />

          <Input
            label="Email"
            value={user?.email || ''}
            disabled
            hint="Email cannot be changed"
          />

          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
            rows={4}
            hint={`${bio.length}/500 characters`}
          />

          <Select
            label="Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={timezones}
          />
        </div>

        {/* Account Info */}
        <div className="card p-6">
          <h3 className="heading-4 mb-4">Account Information</h3>
          <div className="grid gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">User ID</span>
              <span className="text-text-primary font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Member Since</span>
              <span className="text-text-primary">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-text-secondary">Last Updated</span>
              <span className="text-text-primary">
                {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
