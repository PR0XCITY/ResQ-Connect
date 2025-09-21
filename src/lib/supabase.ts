/**
 * Supabase Client Configuration for ResQ Connect
 * 
 * This module provides the Supabase client instance and authentication helpers
 * for the disaster management and user authentication features.
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Supabase configuration from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
  full_name?: string;
  bio?: string;
  location?: string;
  emergency_contacts?: string[];
  preferences?: {
    notifications: boolean;
    location_sharing: boolean;
    disaster_alerts: boolean;
    blockchain_verification: boolean;
  };
}

export interface DisasterReport {
  id: string;
  reporter_id: string;
  disaster_type: string;
  description: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
  status: 'open' | 'verified' | 'resolved' | 'false_alarm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at?: string;
  verified_at?: string;
  verified_by?: string;
  blockchain_hash?: string;
  profile?: Profile;
}

export interface DangerZone {
  id: string;
  name: string;
  polygon: string; // GeoJSON polygon
  zone_type: 'disaster' | 'crime' | 'construction' | 'weather' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  created_at: string;
  updated_at?: string;
  is_active: boolean;
}

// Authentication helpers
export const auth = {
  // Sign up with email, password, and username
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) throw error;

    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          preferences: {
            notifications: true,
            location_sharing: true,
            disaster_alerts: true,
            blockchain_verification: false,
          },
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't throw here as the user is already created
      }
    }

    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get current user's profile
  async getCurrentProfile(): Promise<Profile | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile
  async updateProfile(updates: Partial<Profile>) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Disaster management helpers
export const disasters = {
  // Report a new disaster
  async reportDisaster(report: Omit<DisasterReport, 'id' | 'created_at' | 'reporter_id'>) {
    const user = await auth.getCurrentUser();
    if (!user) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('disaster_reports')
      .insert({
        ...report,
        reporter_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get disaster reports (public data only)
  async getDisasterReports(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('disaster_reports')
      .select(`
        id,
        disaster_type,
        description,
        latitude,
        longitude,
        photo_url,
        status,
        severity,
        created_at,
        profile:profiles(username, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  // Get disaster reports by location (within radius)
  async getDisasterReportsByLocation(
    latitude: number,
    longitude: number,
    radiusKm = 10,
    limit = 50
  ) {
    const { data, error } = await supabase
      .rpc('get_disasters_by_location', {
        lat: latitude,
        lng: longitude,
        radius_km: radiusKm,
        limit_count: limit,
      });

    if (error) throw error;
    return data;
  },

  // Verify a disaster report (admin only)
  async verifyDisasterReport(reportId: string, verified: boolean = true) {
    const user = await auth.getCurrentUser();
    if (!user) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('disaster_reports')
      .update({
        status: verified ? 'verified' : 'false_alarm',
        verified_at: new Date().toISOString(),
        verified_by: user.id,
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Danger zones helpers
export const dangerZones = {
  // Get all active danger zones
  async getDangerZones() {
    const { data, error } = await supabase
      .from('danger_zones')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Check if location is in any danger zone
  async checkLocationInDangerZone(latitude: number, longitude: number) {
    const { data, error } = await supabase
      .rpc('check_location_in_danger_zones', {
        lat: latitude,
        lng: longitude,
      });

    if (error) throw error;
    return data;
  },
};

// AI helpers
export const ai = {
  // Get AI-generated hazard summary
  async getHazardSummary() {
    const { data, error } = await supabase.functions.invoke('get-hazard-summary');
    
    if (error) throw error;
    return data;
  },
};

// Blockchain helpers
export const blockchain = {
  // Verify incident on blockchain (stub implementation)
  async verifyIncident(incidentId: string, data: any) {
    // This is a stub implementation
    // In production, this would interact with actual blockchain
    const hash = await this.generateHash(incidentId, data);
    
    return {
      hash,
      transactionId: `0x${Math.random().toString(16).substr(2, 8)}`,
      verified: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Generate hash for verification
  async generateHash(incidentId: string, data: any) {
    const text = `${incidentId}-${JSON.stringify(data)}-${Date.now()}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
};

export default supabase;
