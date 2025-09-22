/**
 * Mock Data Service for ResQ Connect
 * 
 * This module provides mock implementations of all database functionality
 * using local storage and mock data instead of Supabase.
 */

import { 
  authService, 
  disasterService, 
  dangerZoneService, 
  aiService, 
  blockchainService,
  Profile,
  DisasterReport,
  DangerZone
} from '@/src/services/mock-data-service';
import Constants from 'expo-constants';

// Export types
export type { Profile, DisasterReport, DangerZone };

export function getSupabaseClient() {
  const demoFlag = (Constants.expoConfig?.extra as any)?.demoMode;
  const demoEnv = process.env.EXPO_PUBLIC_DEMO_MODE;
  const isDemo = demoFlag === true || demoEnv !== 'false';
  if (isDemo) {
    // Return the mock client in demo mode
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@/src/lib/supabase.mock').supabase as typeof supabase;
  }
  return supabase;
}

// Mock supabase client for compatibility
export const supabase = {
  auth: {
    async signUp(email: string, password: string, options?: any) {
      return authService.signUp(email, password, options?.data?.username || 'user');
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      return authService.signIn(email, password);
    },
    async signOut() {
      return authService.signOut();
    },
    async getSession() {
      const user = await authService.getCurrentUser();
      return {
        data: {
          session: user ? { user } : null,
        },
        error: null,
      };
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      // Simulate auth state change
      setTimeout(async () => {
        const user = await authService.getCurrentUser();
        if (user) {
          callback('SIGNED_IN', { user });
        }
      }, 100);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('Mock auth subscription unsubscribed'),
          },
        },
      };
    },
  },
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'profiles' && column === 'id') {
            const profile = await authService.getCurrentProfile();
            return {
              data: profile,
              error: null,
            };
          }
          return {
            data: null,
            error: { message: 'Not found' },
          };
        },
      }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          if (table === 'profiles') {
            const profile = await authService.updateProfile(data);
            return {
              data: profile,
              error: null,
            };
          }
          return {
            data: { id: 'mock-id', ...data },
            error: null,
          };
        },
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            if (table === 'profiles' && column === 'id') {
              const profile = await authService.updateProfile(data);
              return {
                data: profile,
                error: null,
              };
            }
            return {
              data: { id: value, ...data },
              error: null,
            };
          },
        }),
      }),
    }),
  }),
  rpc: (functionName: string, params: any) => {
    if (functionName === 'get_disasters_by_location') {
      return disasterService.getDisasterReportsByLocation(
        params.lat, 
        params.lng, 
        params.radius_km, 
        params.limit_count
      ).then(data => ({ data, error: null }));
    }
    
    if (functionName === 'check_location_in_danger_zones') {
      return dangerZoneService.checkLocationInDangerZone(params.lat, params.lng)
        .then(data => ({ data, error: null }));
    }
    
    return Promise.resolve({ data: [], error: null });
  },
  functions: {
    invoke: (functionName: string, params?: any) => {
      if (functionName === 'get-hazard-summary') {
        return aiService.getHazardSummary();
      }
      return Promise.resolve({ data: null, error: null });
    },
  },
};

// Authentication helpers
export const auth = {
  async signUp(email: string, password: string, username: string) {
    return authService.signUp(email, password, username);
  },

  async signIn(email: string, password: string) {
    return authService.signIn(email, password);
  },

  async signOut() {
    return authService.signOut();
  },

  async getCurrentUser() {
    return authService.getCurrentUser();
  },

  async getCurrentProfile(): Promise<Profile | null> {
    return authService.getCurrentProfile();
  },

  async updateProfile(updates: Partial<Profile>) {
    return authService.updateProfile(updates);
  },
};

// Disaster management helpers
export const disasters = {
  async reportDisaster(report: Omit<DisasterReport, 'id' | 'created_at' | 'reporter_id'>) {
    return disasterService.reportDisaster(report);
  },

  async getDisasterReports(limit = 50, offset = 0) {
    return disasterService.getDisasterReports(limit, offset);
  },

  async getDisasterReportsByLocation(
    latitude: number,
    longitude: number,
    radiusKm = 10,
    limit = 50
  ) {
    return disasterService.getDisasterReportsByLocation(latitude, longitude, radiusKm, limit);
  },

  async verifyDisasterReport(reportId: string, verified: boolean = true) {
    return disasterService.verifyDisasterReport(reportId, verified);
  },
};

// Danger zones helpers
export const dangerZones = {
  async getDangerZones() {
    return dangerZoneService.getDangerZones();
  },

  async checkLocationInDangerZone(latitude: number, longitude: number) {
    return dangerZoneService.checkLocationInDangerZone(latitude, longitude);
  },
};

// AI helpers
export const ai = {
  async getHazardSummary() {
    return aiService.getHazardSummary();
  },
};

// Blockchain helpers
export const blockchain = {
  async verifyIncident(incidentId: string, data: any) {
    return blockchainService.verifyIncident(incidentId, data);
  },

  async generateHash(incidentId: string, data: any) {
    return blockchainService.generateHash(incidentId, data);
  },
};

export default supabase;
