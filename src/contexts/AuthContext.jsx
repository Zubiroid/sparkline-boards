import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async (userId) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) throw rolesError;
      setRoles(rolesData?.map(r => r.role) || ['user']);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setRoles(['user']);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserData(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setRoles([]);
        }

        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signIn = async (email, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    setError(null);
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: name }
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/app/overview` }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGitHub = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${window.location.origin}/app/overview` }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    setProfile(data);
    return data;
  };

  const hasRole = useCallback((role) => {
    return roles.includes(role);
  }, [roles]);

  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator');
  const userRole = roles[0] || 'user';

  const clearError = () => setError(null);

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const value = {
    user,
    session,
    profile,
    roles,
    userRole,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    hasRole,
    isAdmin,
    isModerator,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
