/**
 * Mock Data Service (demo-only): replaces backend with localStorage-powered data.
 *
 * Provides demo implementations for auth, disaster reports, danger zones, and
 * helper utilities. Disaster Map consumes these via context; reporting writes to
 * localStorage and reading pulls from there to render pins.
 */

// Types
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

// Mock data
const DEMO_USER: Profile = {
  id: 'demo-user-123',
  username: 'demo_user',
  created_at: new Date().toISOString(),
  full_name: 'Demo User',
  bio: 'Demo user for ResQ Connect',
  location: 'Guwahati, Assam',
  emergency_contacts: ['+91-9876543210', '+91-9876543211'],
  preferences: {
    notifications: true,
    location_sharing: true,
    disaster_alerts: true,
    blockchain_verification: false,
  },
};

const MOCK_DISASTER_REPORTS: DisasterReport[] = [
  {
    id: 'disaster-1',
    reporter_id: DEMO_USER.id,
    disaster_type: 'flood',
    description: 'Heavy flooding in the main road area. Water level rising rapidly.',
    latitude: 26.1445,
    longitude: 91.7362,
    status: 'open',
    severity: 'high',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    profile: DEMO_USER,
  },
  {
    id: 'disaster-2',
    reporter_id: DEMO_USER.id,
    disaster_type: 'landslide',
    description: 'Landslide blocking the highway. Avoid this route.',
    latitude: 26.2000,
    longitude: 91.8000,
    status: 'verified',
    severity: 'critical',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    verified_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    verified_by: DEMO_USER.id,
    profile: DEMO_USER,
  },
  {
    id: 'disaster-3',
    reporter_id: DEMO_USER.id,
    disaster_type: 'storm',
    description: 'Severe thunderstorm with heavy winds. Power lines down.',
    latitude: 26.1000,
    longitude: 91.7000,
    status: 'open',
    severity: 'medium',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    profile: DEMO_USER,
  },
];

const MOCK_DANGER_ZONES: DangerZone[] = [
  {
    id: 'zone-1',
    name: 'Flood Prone Area',
    polygon: JSON.stringify({
      type: 'Polygon',
      coordinates: [[
        [91.7, 26.1],
        [91.8, 26.1],
        [91.8, 26.2],
        [91.7, 26.2],
        [91.7, 26.1]
      ]]
    }),
    zone_type: 'disaster',
    severity: 'high',
    description: 'Area prone to flooding during monsoon season',
    created_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'zone-2',
    name: 'Construction Zone',
    polygon: JSON.stringify({
      type: 'Polygon',
      coordinates: [[
        [91.75, 26.15],
        [91.85, 26.15],
        [91.85, 26.25],
        [91.75, 26.25],
        [91.75, 26.15]
      ]]
    }),
    zone_type: 'construction',
    severity: 'medium',
    description: 'Active construction site with heavy machinery',
    created_at: new Date().toISOString(),
    is_active: true,
  },
];

// Local storage keys
const STORAGE_KEYS = {
  USER: 'resq_user',
  SESSION: 'resq_session',
  DISASTERS: 'resq_disasters',
  DANGER_ZONES: 'resq_danger_zones',
};

// Helper functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

// Initialize storage with mock data: one-time seeding on module load
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    setToStorage(STORAGE_KEYS.USER, DEMO_USER);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISASTERS)) {
    setToStorage(STORAGE_KEYS.DISASTERS, MOCK_DISASTER_REPORTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DANGER_ZONES)) {
    setToStorage(STORAGE_KEYS.DANGER_ZONES, MOCK_DANGER_ZONES);
  }
}

// Initialize on module load
initializeStorage();

// Auth service
export const authService = {
  async signUp(email: string, password: string, username: string) {
    console.log('Mock sign up:', { email, username });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: `user-${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    };
    
    const profile: Profile = {
      id: user.id,
      username,
      created_at: user.created_at,
      preferences: {
        notifications: true,
        location_sharing: true,
        disaster_alerts: true,
        blockchain_verification: false,
      },
    };
    
    setToStorage(STORAGE_KEYS.USER, profile);
    setToStorage(STORAGE_KEYS.SESSION, { user, session: { user } });
    
    return { data: { user, session: { user } }, error: null };
  },

  async signIn(email: string, password: string) {
    console.log('Mock sign in:', { email });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: 'demo-user-123',
      email,
      created_at: new Date().toISOString(),
    };
    
    setToStorage(STORAGE_KEYS.SESSION, { user, session: { user } });
    
    return { data: { user, session: { user } }, error: null };
  },

  async signOut() {
    console.log('Mock sign out');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    
    return { error: null };
  },

  async getCurrentUser() {
    const session = getFromStorage(STORAGE_KEYS.SESSION, null);
    return session?.user || null;
  },

  async getCurrentProfile(): Promise<Profile | null> {
    return getFromStorage(STORAGE_KEYS.USER, null);
  },

  async updateProfile(updates: Partial<Profile>) {
    const currentProfile = getFromStorage(STORAGE_KEYS.USER, null);
    if (!currentProfile) throw new Error('No authenticated user');
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    setToStorage(STORAGE_KEYS.USER, updatedProfile);
    return updatedProfile;
  },
};

// Disaster service
export const disasterService = {
  async reportDisaster(report: Omit<DisasterReport, 'id' | 'created_at' | 'reporter_id'>) {
    console.log('Mock disaster report:', report);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('Authentication required');
    
    const newReport: DisasterReport = {
      id: `disaster-${Date.now()}`,
      reporter_id: user.id,
      created_at: new Date().toISOString(),
      ...report,
    };
    
    // Persist to localStorage (front-of-list for recency)
    const disasters = getFromStorage(STORAGE_KEYS.DISASTERS, []);
    disasters.unshift(newReport);
    setToStorage(STORAGE_KEYS.DISASTERS, disasters);
    
    return newReport;
  },

  async getDisasterReports(limit = 50, offset = 0) {
    console.log('Mock get disaster reports:', { limit, offset });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Read from localStorage and slice for pagination demo
    const disasters = getFromStorage(STORAGE_KEYS.DISASTERS, []);
    return disasters.slice(offset, offset + limit);
  },

  async getDisasterReportsByLocation(lat: number, lng: number, radiusKm = 10, limit = 50) {
    console.log('Mock get disasters by location:', { lat, lng, radiusKm, limit });
    
    const disasters = getFromStorage(STORAGE_KEYS.DISASTERS, []);
    
    // Filter disasters within radius
    const nearbyDisasters = disasters.filter(report => {
      const distance = calculateDistance(lat, lng, report.latitude, report.longitude);
      return distance <= radiusKm;
    }).slice(0, limit);
    
    return nearbyDisasters;
  },

  async verifyDisasterReport(reportId: string, verified = true) {
    console.log('Mock verify disaster report:', { reportId, verified });
    
    const disasters = getFromStorage(STORAGE_KEYS.DISASTERS, []);
    const report = disasters.find(r => r.id === reportId);
    
    if (report) {
      report.status = verified ? 'verified' : 'false_alarm';
      report.verified_at = new Date().toISOString();
      report.verified_by = 'admin';
      setToStorage(STORAGE_KEYS.DISASTERS, disasters);
    }
    
    return report;
  },
};

// Danger zones service
export const dangerZoneService = {
  async getDangerZones() {
    console.log('Mock get danger zones');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return getFromStorage(STORAGE_KEYS.DANGER_ZONES, []);
  },

  async checkLocationInDangerZone(lat: number, lng: number) {
    console.log('Mock check location in danger zone:', { lat, lng });
    
    const zones = getFromStorage(STORAGE_KEYS.DANGER_ZONES, []);
    
    // Check if location is in any danger zone (simplified)
    const inDangerZone = zones.some(zone => {
      const zoneCenter = getPolygonCenter(zone.polygon);
      const distance = calculateDistance(lat, lng, zoneCenter.lat, zoneCenter.lng);
      return distance < 5; // 5km radius for demo
    });
    
    return inDangerZone ? zones.slice(0, 1) : [];
  },
};

// AI service
export const aiService = {
  async getHazardSummary() {
    console.log('Mock get hazard summary');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      data: {
        summary: "Current hazard assessment for North-Eastern India shows moderate risk due to seasonal weather patterns. Stay alert for potential flooding in low-lying areas and landslides in hilly terrain.",
        risk_level: "moderate",
        recommendations: [
          "Avoid traveling during heavy rainfall",
          "Stay updated with weather alerts",
          "Keep emergency contacts handy"
        ],
        last_updated: new Date().toISOString()
      },
      error: null,
    };
  },
};

// Blockchain service
export const blockchainService = {
  async verifyIncident(incidentId: string, data: any) {
    console.log('Mock blockchain verification:', { incidentId, data });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const hash = await this.generateHash(incidentId, data);
    
    return {
      success: true,
      verification: {
        hash,
        transactionId: `0x${Math.random().toString(16).substr(2, 16)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
        timestamp: new Date().toISOString(),
        verified: true,
        network: 'ethereum-testnet',
      },
    };
  },

  async generateHash(incidentId: string, data: any) {
    const text = `${incidentId}-${JSON.stringify(data)}-${Date.now()}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

