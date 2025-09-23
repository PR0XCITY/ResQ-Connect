/**
 * Web-compatible Map Component using React Leaflet (demo): renders mock disaster pins and zones.
 *
 * Displays a Leaflet map on web and renders markers for disaster reports
 * and simple circular overlays for danger zones. Falls back to a placeholder
 * on non-web platforms. All data is mock/in-memory; no network calls here.
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Only import leaflet components on web platform
let MapContainer: any, TileLayer: any, Marker: any, Popup: any, Circle: any, L: any;

if (Platform.OS === 'web') {
  try {
    const leaflet = require('leaflet');
    const reactLeaflet = require('react-leaflet');
    
    L = leaflet.default || leaflet;
    MapContainer = reactLeaflet.MapContainer;
    TileLayer = reactLeaflet.TileLayer;
    Marker = reactLeaflet.Marker;
    Popup = reactLeaflet.Popup;
    Circle = reactLeaflet.Circle;
    
    // Load CSS dynamically for web
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link);
      }
    }
  } catch (error) {
    console.warn('Leaflet not available on this platform:', error);
  }
}

// Fix for default markers in react-leaflet (only on web)
if (Platform.OS === 'web' && L) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface DisasterReport {
  id: string;
  disaster_type: string;
  latitude: number;
  longitude: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  photo_url?: string;
}

interface DangerZone {
  id: string;
  polygon: string;
  type: string;
  severity: string;
}

// Props: minimal surface for demo usage
interface WebMapProps {
  currentLocation?: {
    coords: {
      latitude: number;
      longitude: number;
    };
  };
  disasterReports: DisasterReport[];
  dangerZones: DangerZone[];
  onMarkerClick?: (report: DisasterReport) => void;
  selectedDisaster?: DisasterReport | null;
  style?: any;
}

const DISASTER_TYPES = [
  { id: 'flood', label: 'Flood', color: '#3B82F6', icon: '🌊' },
  { id: 'earthquake', label: 'Earthquake', color: '#EF4444', icon: '🌍' },
  { id: 'landslide', label: 'Landslide', color: '#F59E0B', icon: '⛰️' },
  { id: 'storm', label: 'Storm', color: '#8B5CF6', icon: '⛈️' },
  { id: 'fire', label: 'Fire', color: '#DC2626', icon: '🔥' },
  { id: 'accident', label: 'Accident', color: '#6B7280', icon: '🚗' },
  { id: 'other', label: 'Other', color: '#10B981', icon: '⚠️' },
];

const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low', color: '#10B981' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'critical', label: 'Critical', color: '#DC2626' },
];

const getDisasterColor = (type: string) => {
  const disasterType = DISASTER_TYPES.find(t => t.id === type);
  return disasterType?.color || '#6B7280';
};

const getSeverityColor = (severity: string) => {
  const severityLevel = SEVERITY_LEVELS.find(s => s.id === severity);
  return severityLevel?.color || '#6B7280';
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// Custom marker component: renders an emoji marker with a popup showing description and severity
const DisasterMarker = ({ report, onClick }: { report: DisasterReport; onClick: () => void }) => {
  const disasterType = DISASTER_TYPES.find(t => t.id === report.disaster_type);
  const severityColor = getSeverityColor(report.severity);
  
  if (!L) {
    return null;
  }
  
  const customIcon = L.divIcon({
    className: 'custom-disaster-marker',
    html: `
      <div style="
        background-color: ${getDisasterColor(report.disaster_type)};
        border: 2px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${disasterType?.icon || '⚠️'}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <Marker
      position={[report.latitude, report.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div style={{ minWidth: '200px', padding: '8px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>{disasterType?.icon}</span>
            <span style={{ 
              fontWeight: 'bold', 
              textTransform: 'capitalize',
              color: '#333'
            }}>
              {report.disaster_type}
            </span>
          </div>
          <div style={{ 
            marginBottom: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            {report.description}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              backgroundColor: severityColor,
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {report.severity.toUpperCase()}
            </span>
            <span style={{ 
              fontSize: '12px',
              color: '#999'
            }}>
              {formatTimeAgo(report.created_at)}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// WebMap: focuses viewport on current location; recenters on selectedDisaster
const WebMap: React.FC<WebMapProps> = ({
  currentLocation,
  disasterReports,
  dangerZones,
  onMarkerClick,
  selectedDisaster,
  style
}) => {
  const mapRef = useRef<any>(null);

  const center = currentLocation 
    ? [currentLocation.coords.latitude, currentLocation.coords.longitude]
    : [26.1445, 91.7362]; // Default to Guwahati, India

  useEffect(() => {
    if (mapRef.current && selectedDisaster && L) {
      mapRef.current.setView(
        [selectedDisaster.latitude, selectedDisaster.longitude],
        15
      );
    }
  }, [selectedDisaster]);

  // If not on web platform or leaflet is not available, show fallback
  if (Platform.OS !== 'web' || !MapContainer || !L) {
    return (
      <View style={[style, { 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        minHeight: 400
      }]}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
          Map not available on this platform
        </Text>
        <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
          Please use a web browser to view the interactive map
        </Text>
      </View>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      minHeight: '400px',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '400px'
        }}
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Disaster Report Markers */}
        {disasterReports.map((report) => (
          <DisasterMarker
            key={report.id}
            report={report}
            onClick={() => onMarkerClick?.(report)}
          />
        ))}

        {/* Danger Zone Circles */}
        {dangerZones.map((zone) => {
          try {
            const polygon = JSON.parse(zone.polygon);
            const coordinates = polygon.coordinates[0][0];
            const centerLat = coordinates[1];
            const centerLng = coordinates[0];
            
            return (
              <Circle
                key={zone.id}
                center={[centerLat, centerLng]}
                radius={1000} // 1km radius
                pathOptions={{
                  fillColor: 'rgba(239, 68, 68, 0.2)',
                  color: 'rgba(239, 68, 68, 0.8)',
                  weight: 2,
                }}
              />
            );
          } catch (error) {
            console.warn('Invalid polygon data for zone:', zone.id);
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default WebMap;
