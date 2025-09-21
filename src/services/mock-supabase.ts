/**
 * Mock Supabase Service for ResQ Connect Demo
 * 
 * Provides mock implementations of all Supabase functionality
 * for the frontend prototype demonstration.
 */

import { Profile, DisasterReport, DangerZone } from '@/src/lib/supabase';
import { 
  DEMO_USER, 
  MOCK_DISASTER_REPORTS, 
  MOCK_DANGER_ZONES,
  MOCK_AI_RESPONSES,
  MOCK_BLOCKCHAIN_VERIFICATIONS 
} from '@/src/data/mock-data';

// Mock session data
let mockSession = {
  user: {
    id: DEMO_USER.id,
    email: 'demo@resqconnect.com',
    created_at: DEMO_USER.created_at,
  },
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
};

// Mock authentication state
let isAuthenticated = false;
let currentProfile: Profile | null = null;

export const mockSupabase = {
  auth: {
    // Mock sign up
    async signUp(email: string, password: string, options?: any) {
      console.log('Mock sign up:', { email, options });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      isAuthenticated = true;
      currentProfile = { ...DEMO_USER };
      
      return {
        data: {
          user: mockSession.user,
          session: mockSession,
        },
        error: null,
      };
    },

    // Mock sign in
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      console.log('Mock sign in:', { email });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      isAuthenticated = true;
      currentProfile = { ...DEMO_USER };
      
      return {
        data: {
          user: mockSession.user,
          session: mockSession,
        },
        error: null,
      };
    },

    // Mock sign out
    async signOut() {
      console.log('Mock sign out');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      isAuthenticated = false;
      currentProfile = null;
      
      return { error: null };
    },

    // Mock get session
    async getSession() {
      return {
        data: {
          session: isAuthenticated ? mockSession : null,
        },
        error: null,
      };
    },

    // Mock on auth state change
    onAuthStateChange(callback: (event: string, session: any) => void) {
      // Simulate auth state change
      setTimeout(() => {
        callback('SIGNED_IN', mockSession);
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

  // Mock profiles table
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          console.log(`Mock select from ${table}:`, { column, value });
          
          if (table === 'profiles' && column === 'id' && value === DEMO_USER.id) {
            return {
              data: currentProfile,
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
          console.log(`Mock insert into ${table}:`, data);
          
          if (table === 'profiles') {
            currentProfile = { ...DEMO_USER, ...data };
            return {
              data: currentProfile,
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
            console.log(`Mock update ${table}:`, { column, value, data });
            
            if (table === 'profiles' && column === 'id' && value === DEMO_USER.id) {
              currentProfile = { ...currentProfile, ...data };
              return {
                data: currentProfile,
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

  // Mock RPC functions
  rpc: (functionName: string, params: any) => {
    console.log(`Mock RPC ${functionName}:`, params);
    
    if (functionName === 'get_disasters_by_location') {
      const { lat, lng, radius_km = 10, limit_count = 50 } = params;
      
      // Filter disasters within radius
      const nearbyDisasters = MOCK_DISASTER_REPORTS.filter(report => {
        const distance = calculateDistance(lat, lng, report.latitude, report.longitude);
        return distance <= radius_km;
      }).slice(0, limit_count);
      
      return Promise.resolve({
        data: nearbyDisasters,
        error: null,
      });
    }
    
    if (functionName === 'check_location_in_danger_zones') {
      const { lat, lng } = params;
      
      // Check if location is in any danger zone (simplified)
      const inDangerZone = MOCK_DANGER_ZONES.some(zone => {
        // Simplified check - in real implementation, would use proper polygon intersection
        const zoneCenter = getPolygonCenter(zone.polygon);
        const distance = calculateDistance(lat, lng, zoneCenter.lat, zoneCenter.lng);
        return distance < 5; // 5km radius for demo
      });
      
      return Promise.resolve({
        data: inDangerZone ? MOCK_DANGER_ZONES.slice(0, 1) : [],
        error: null,
      });
    }
    
    return Promise.resolve({
      data: [],
      error: null,
    });
  },

  // Mock functions
  functions: {
    invoke: (functionName: string, params?: any) => {
      console.log(`Mock function ${functionName}:`, params);
      
      if (functionName === 'get-hazard-summary') {
        return Promise.resolve({
          data: MOCK_AI_RESPONSES.hazardSummary,
          error: null,
        });
      }
      
      return Promise.resolve({
        data: null,
        error: null,
      });
    },
  },
};

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getPolygonCenter(polygon: string): { lat: number; lng: number } {
  try {
    const coords = JSON.parse(polygon).coordinates[0];
    const centerLat = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coords.length;
    const centerLng = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coords.length;
    return { lat: centerLat, lng: centerLng };
  } catch {
    return { lat: 26.1445, lng: 91.7362 }; // Default to Guwahati
  }
}

// Export mock auth helpers
export const mockAuth = {
  async signUp(email: string, password: string, username: string) {
    return mockSupabase.auth.signUp(email, password, { data: { username } });
  },

  async signIn(email: string, password: string) {
    return mockSupabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return mockSupabase.auth.signOut();
  },

  async getCurrentUser() {
    const { data } = await mockSupabase.auth.getSession();
    return data.session?.user || null;
  },

  async getCurrentProfile(): Promise<Profile | null> {
    return currentProfile;
  },

  async updateProfile(updates: Partial<Profile>) {
    if (!currentProfile) return null;
    
    const { data } = await mockSupabase
      .from('profiles')
      .update(updates)
      .eq('id', currentProfile.id)
      .select()
      .single();
    
    currentProfile = data;
    return data;
  },
};

// Export mock disaster helpers
export const mockDisasters = {
  async reportDisaster(report: Omit<DisasterReport, 'id' | 'created_at' | 'reporter_id'>) {
    console.log('Mock disaster report:', report);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReport: DisasterReport = {
      id: `disaster-${Date.now()}`,
      reporter_id: DEMO_USER.id,
      created_at: new Date().toISOString(),
      ...report,
      profile: DEMO_USER,
    };
    
    MOCK_DISASTER_REPORTS.unshift(newReport);
    
    return newReport;
  },

  async getDisasterReports(limit = 50, offset = 0) {
    console.log('Mock get disaster reports:', { limit, offset });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_DISASTER_REPORTS.slice(offset, offset + limit);
  },

  async getDisasterReportsByLocation(lat: number, lng: number, radiusKm = 10, limit = 50) {
    console.log('Mock get disasters by location:', { lat, lng, radiusKm, limit });
    
    const { data } = await mockSupabase.rpc('get_disasters_by_location', {
      lat,
      lng,
      radius_km: radiusKm,
      limit_count: limit,
    });
    
    return data;
  },

  async verifyDisasterReport(reportId: string, verified = true) {
    console.log('Mock verify disaster report:', { reportId, verified });
    
    const report = MOCK_DISASTER_REPORTS.find(r => r.id === reportId);
    if (report) {
      report.status = verified ? 'verified' : 'false_alarm';
      report.verified_at = new Date().toISOString();
      report.verified_by = DEMO_USER.id;
    }
    
    return report;
  },
};

// Export mock danger zones helpers
export const mockDangerZones = {
  async getDangerZones() {
    console.log('Mock get danger zones');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_DANGER_ZONES;
  },

  async checkLocationInDangerZone(lat: number, lng: number) {
    console.log('Mock check location in danger zone:', { lat, lng });
    
    const { data } = await mockSupabase.rpc('check_location_in_danger_zones', { lat, lng });
    return data;
  },
};

// Export mock AI helpers
export const mockAI = {
  async getHazardSummary() {
    console.log('Mock get hazard summary');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      data: MOCK_AI_RESPONSES.hazardSummary,
      error: null,
    };
  },
};

// Export mock blockchain helpers
export const mockBlockchain = {
  async verifyIncident(incidentId: string, data: any) {
    console.log('Mock blockchain verification:', { incidentId, data });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const verification = MOCK_BLOCKCHAIN_VERIFICATIONS[incidentId as keyof typeof MOCK_BLOCKCHAIN_VERIFICATIONS] || {
      hash: `demo-hash-${Date.now()}`,
      transactionId: `0x${Math.random().toString(16).substr(2, 16)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      timestamp: new Date().toISOString(),
      verified: true,
      network: 'ethereum-testnet',
    };
    
    return {
      success: true,
      verification,
    };
  },
};

export default mockSupabase;
