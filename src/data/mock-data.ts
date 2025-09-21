/**
 * Mock Data for ResQ Connect Demo
 * 
 * Contains static data for the frontend prototype demonstration
 * without requiring any backend services or API keys.
 */

import { Profile, DisasterReport, DangerZone } from '@/src/lib/supabase';

// Demo user profile
export const DEMO_USER: Profile = {
  id: 'demo-user-123',
  username: 'DemoUser',
  created_at: '2025-01-21T10:00:00Z',
  updated_at: '2025-01-21T10:00:00Z',
  avatar_url: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=DU',
  full_name: 'Demo User',
  bio: 'ResQ Connect Demo User',
  location: 'Guwahati, Assam',
  emergency_contacts: ['+91-98765-43210', '+91-98765-43211'],
  preferences: {
    notifications: true,
    location_sharing: true,
    disaster_alerts: true,
    blockchain_verification: false,
  },
};

// Mock disaster reports
export const MOCK_DISASTER_REPORTS: DisasterReport[] = [
  {
    id: 'disaster-1',
    reporter_id: 'demo-user-123',
    disaster_type: 'flood',
    description: 'Heavy rainfall causing waterlogging in low-lying areas. Roads are partially submerged.',
    latitude: 26.1445,
    longitude: 91.7362,
    photo_url: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Flood+Area',
    status: 'verified',
    severity: 'high',
    created_at: '2025-01-21T08:30:00Z',
    updated_at: '2025-01-21T08:30:00Z',
    verified_at: '2025-01-21T08:45:00Z',
    verified_by: 'admin-user',
    blockchain_hash: 'demo-hash-1',
    profile: DEMO_USER,
  },
  {
    id: 'disaster-2',
    reporter_id: 'demo-user-123',
    disaster_type: 'landslide',
    description: 'Rock slide on NH-37 near Shillong. Traffic diverted through alternative route.',
    latitude: 25.5788,
    longitude: 91.8933,
    photo_url: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Landslide',
    status: 'open',
    severity: 'critical',
    created_at: '2025-01-21T07:15:00Z',
    updated_at: '2025-01-21T07:15:00Z',
    blockchain_hash: 'demo-hash-2',
    profile: DEMO_USER,
  },
  {
    id: 'disaster-3',
    reporter_id: 'demo-user-123',
    disaster_type: 'storm',
    description: 'Strong winds and heavy rain expected in the next 2 hours. Avoid outdoor activities.',
    latitude: 26.1584,
    longitude: 91.7962,
    photo_url: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Storm',
    status: 'verified',
    severity: 'medium',
    created_at: '2025-01-21T06:00:00Z',
    updated_at: '2025-01-21T06:00:00Z',
    verified_at: '2025-01-21T06:15:00Z',
    verified_by: 'admin-user',
    blockchain_hash: 'demo-hash-3',
    profile: DEMO_USER,
  },
  {
    id: 'disaster-4',
    reporter_id: 'demo-user-123',
    disaster_type: 'accident',
    description: 'Vehicle collision on the highway. Emergency services on the way.',
    latitude: 26.2000,
    longitude: 91.8000,
    photo_url: 'https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Accident',
    status: 'resolved',
    severity: 'medium',
    created_at: '2025-01-20T18:30:00Z',
    updated_at: '2025-01-20T19:00:00Z',
    verified_at: '2025-01-20T18:45:00Z',
    verified_by: 'admin-user',
    blockchain_hash: 'demo-hash-4',
    profile: DEMO_USER,
  },
  {
    id: 'disaster-5',
    reporter_id: 'demo-user-123',
    disaster_type: 'fire',
    description: 'Forest fire reported in the hills. Fire department responding.',
    latitude: 25.5000,
    longitude: 91.5000,
    photo_url: 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Fire',
    status: 'open',
    severity: 'high',
    created_at: '2025-01-20T16:45:00Z',
    updated_at: '2025-01-20T16:45:00Z',
    blockchain_hash: 'demo-hash-5',
    profile: DEMO_USER,
  },
];

// Mock danger zones
export const MOCK_DANGER_ZONES: DangerZone[] = [
  {
    id: 'zone-1',
    name: 'Guwahati Flood Zone',
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
    description: 'High-risk flood area during monsoon season',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
    is_active: true,
  },
  {
    id: 'zone-2',
    name: 'Shillong Landslide Zone',
    polygon: JSON.stringify({
      type: 'Polygon',
      coordinates: [[
        [91.8, 25.5],
        [91.9, 25.5],
        [91.9, 25.6],
        [91.8, 25.6],
        [91.8, 25.5]
      ]]
    }),
    zone_type: 'disaster',
    severity: 'critical',
    description: 'Unstable hillside prone to landslides',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
    is_active: true,
  },
  {
    id: 'zone-3',
    name: 'Construction Zone',
    polygon: JSON.stringify({
      type: 'Polygon',
      coordinates: [[
        [91.75, 26.15],
        [91.77, 26.15],
        [91.77, 26.17],
        [91.75, 26.17],
        [91.75, 26.15]
      ]]
    }),
    zone_type: 'construction',
    severity: 'medium',
    description: 'Active construction site - heavy machinery in use',
    created_at: '2025-01-19T10:00:00Z',
    updated_at: '2025-01-19T10:00:00Z',
    is_active: true,
  },
];

// Mock AI responses
export const MOCK_AI_RESPONSES = {
  hazardSummary: `**Current Hazard Assessment - North-Eastern India**

🚨 **High Risk Areas Identified:**
- Guwahati flood zone experiencing waterlogging
- Shillong landslide zone with active rock slides
- Forest fire in eastern hills spreading rapidly

⚠️ **Weather Conditions:**
- Heavy rainfall expected to continue for next 24 hours
- Strong winds up to 40 km/h in hilly areas
- Reduced visibility due to fog and rain

📋 **Immediate Recommendations:**
1. Avoid traveling through flood-affected areas
2. Stay away from landslide-prone hillsides
3. Monitor weather updates regularly
4. Keep emergency contacts readily available

🆘 **Emergency Contacts:**
- Police: 100
- Fire: 101
- Ambulance: 102
- Disaster Management: 108

*This is a demo response. In production, this would be generated by AI based on real-time data.*`,

  safetyAdvice: `**Safety Tips for North-Eastern India Travel**

🌧️ **Weather Preparedness:**
- Check weather forecasts before traveling
- Carry rain gear and warm clothing
- Avoid mountain roads during heavy rain

🏔️ **Terrain Awareness:**
- Be cautious on steep slopes and hillsides
- Watch for signs of landslides or rock falls
- Use designated safe routes when available

📱 **Emergency Preparedness:**
- Share your location with trusted contacts
- Keep emergency supplies in your vehicle
- Download offline maps for remote areas

🚗 **Road Safety:**
- Drive slowly on wet or slippery roads
- Maintain safe following distance
- Be prepared for sudden weather changes

*This is a demo response. In production, this would be personalized based on your location and current conditions.*`,

  emergencyResponse: `**Emergency Response Guidelines**

🚨 **Immediate Actions:**
1. Stay calm and assess the situation
2. Move to a safe location if possible
3. Call emergency services immediately
4. Follow local emergency guidelines

📞 **Emergency Numbers:**
- Police: 100
- Fire: 101
- Ambulance: 102
- Disaster Management: 108

📍 **Location Sharing:**
- Share your exact coordinates
- Provide nearby landmarks
- Update your status regularly

🆘 **If Trapped:**
- Stay where you are if safe
- Make noise to attract attention
- Use phone flashlight if needed
- Conserve battery power

*This is a demo response. In production, this would be customized based on the specific emergency type and your location.*`,
};

// Mock blockchain verification data
export const MOCK_BLOCKCHAIN_VERIFICATIONS = {
  'disaster-1': {
    hash: 'demo-hash-1',
    transactionId: '0x1234567890abcdef',
    blockNumber: 12345678,
    timestamp: '2025-01-21T08:45:00Z',
    verified: true,
    network: 'ethereum-testnet',
  },
  'disaster-2': {
    hash: 'demo-hash-2',
    transactionId: '0xabcdef1234567890',
    blockNumber: 12345679,
    timestamp: '2025-01-21T07:20:00Z',
    verified: true,
    network: 'ethereum-testnet',
  },
  'disaster-3': {
    hash: 'demo-hash-3',
    transactionId: '0x567890abcdef1234',
    blockNumber: 12345680,
    timestamp: '2025-01-21T06:15:00Z',
    verified: true,
    network: 'ethereum-testnet',
  },
};

// Mock location data
export const MOCK_LOCATIONS = {
  guwahati: {
    latitude: 26.1445,
    longitude: 91.7362,
    address: 'Guwahati, Assam',
  },
  shillong: {
    latitude: 25.5788,
    longitude: 91.8933,
    address: 'Shillong, Meghalaya',
  },
  aizawl: {
    latitude: 23.7271,
    longitude: 92.7176,
    address: 'Aizawl, Mizoram',
  },
  kohima: {
    latitude: 25.6751,
    longitude: 94.1103,
    address: 'Kohima, Nagaland',
  },
};

// Mock statistics
export const MOCK_STATISTICS = {
  totalReports: 156,
  reportsByType: {
    flood: 45,
    landslide: 32,
    storm: 28,
    fire: 18,
    accident: 21,
    other: 12,
  },
  reportsBySeverity: {
    low: 23,
    medium: 67,
    high: 45,
    critical: 21,
  },
  reportsByStatus: {
    open: 34,
    verified: 89,
    resolved: 28,
    false_alarm: 5,
  },
  recentReports24h: 8,
  highRiskAreas: [
    { latitude: 26.1445, longitude: 91.7362, count: 12 },
    { latitude: 25.5788, longitude: 91.8933, count: 8 },
    { latitude: 26.2000, longitude: 91.8000, count: 5 },
  ],
};
