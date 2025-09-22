/**
 * Authentication Context for ResQ Connect
 * 
 * Provides authentication state management and user profile handling
 * for the disaster management and safety features.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, Profile } from '@/src/lib/supabase';

// Mock types for compatibility
interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Session {
  user: User;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    auth.getCurrentUser().then((user) => {
      if (user) {
        setUser(user);
        setSession({ user });
        loadProfile(user.id);
      } else {
        setLoading(false);
      }
    });

    // Simulate auth state change listener
    const checkAuthState = async () => {
      const user = await auth.getCurrentUser();
      if (user) {
        setUser(user);
        setSession({ user });
        await loadProfile(user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    // Check auth state periodically
    const interval = setInterval(checkAuthState, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Load user profile
  const loadProfile = async (userId: string) => {
    try {
      const profileData = await auth.getCurrentProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email, password, and username
  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      await auth.signUp(email, password, username);
      // Profile will be loaded automatically via auth state change
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await auth.signIn(email, password);
      // Profile will be loaded automatically via auth state change
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const updatedProfile = await auth.updateProfile(updates);
      setProfile(updatedProfile);
    } catch (error) {
      throw error;
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user is authenticated
export function useRequireAuth() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return { isAuthenticated: false, loading: true };
  }
  
  return { isAuthenticated: !!user, loading: false };
}
