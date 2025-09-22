/**
 * Disaster Management Context (demo): centralizes location, reports, and zones.
 *
 * Provides state and functions for disaster reports and danger zones backed by
 * mock services. Consumers like the Disaster Map subscribe to this context to
 * render pins and submit demo-only reports.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';
import { disasters, dangerZones, DisasterReport, DangerZone } from '@/src/lib/supabase.mock';
import { useAuth } from './AuthContext';

// Context shape: consumed by UI to show pins and submit/refresh mock data
interface DisasterContextType {
  currentLocation: Location.LocationObject | null;
  disasterReports: DisasterReport[];
  dangerZones: DangerZone[];
  loading: boolean;
  error: string | null;
  reportDisaster: (report: Omit<DisasterReport, 'id' | 'created_at' | 'reporter_id'>) => Promise<void>;
  refreshDisasterReports: () => Promise<void>;
  refreshDangerZones: () => Promise<void>;
  checkLocationSafety: () => Promise<boolean>;
  getNearbyDisasters: (radiusKm?: number) => Promise<DisasterReport[]>;
  isInDangerZone: boolean;
  dangerZoneAlert: DangerZone | null;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

interface DisasterProviderProps {
  children: ReactNode;
}

export function DisasterProvider({ children }: DisasterProviderProps) {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [disasterReports, setDisasterReports] = useState<DisasterReport[]>([]);
  const [dangerZones, setDangerZones] = useState<DangerZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInDangerZone, setIsInDangerZone] = useState(false);
  const [dangerZoneAlert, setDangerZoneAlert] = useState<DangerZone | null>(null);

  // Request location permissions and start monitoring
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Monitor location changes
  useEffect(() => {
    if (currentLocation) {
      checkLocationSafety();
    }
  }, [currentLocation]);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(location);

      // Start watching location
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000, // Check every 30 seconds
          distanceInterval: 100, // Check every 100 meters
        },
        (location) => {
          setCurrentLocation(location);
        }
      );

      // Cleanup subscription on unmount
      return () => subscription.remove();
    } catch (err) {
      setError('Error getting location: ' + (err as Error).message);
    }
  };

  // Check if current location is in a danger zone
  const checkLocationSafety = async () => {
    if (!currentLocation) return false;

    try {
      const { coords } = currentLocation;
      const dangerZoneData = await dangerZones.checkLocationInDangerZone(
        coords.latitude,
        coords.longitude
      );

      if (dangerZoneData && dangerZoneData.length > 0) {
        setIsInDangerZone(true);
        setDangerZoneAlert(dangerZoneData[0]);
        
        // Trigger local notification or alert
        // This would integrate with your notification system
        console.warn('⚠️ You are in a danger zone:', dangerZoneData[0].name);
      } else {
        setIsInDangerZone(false);
        setDangerZoneAlert(null);
      }

      return !isInDangerZone;
    } catch (err) {
      console.error('Error checking location safety:', err);
      return true; // Assume safe if check fails
    }
  };

  // Report a new disaster
  const reportDisaster = async (report: Omit<DisasterReport, 'id' | 'created_at' | 'reporter_id'>) => {
    if (!user) {
      throw new Error('Authentication required to report disasters');
    }

    setLoading(true);
    setError(null);

    try {
      // Forward to mock backend layer; prepend result into local state for UI immediacy
      const newReport = await disasters.reportDisaster(report);
      setDisasterReports(prev => [newReport, ...prev]);
    } catch (err) {
      setError('Failed to report disaster: ' + (err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh disaster reports
  const refreshDisasterReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const reports = await disasters.getDisasterReports();
      setDisasterReports(reports);
    } catch (err) {
      setError('Failed to load disaster reports: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh danger zones
  const refreshDangerZones = async () => {
    setLoading(true);
    setError(null);

    try {
      const zones = await dangerZones.getDangerZones();
      setDangerZones(zones);
    } catch (err) {
      setError('Failed to load danger zones: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Get nearby disasters
  const getNearbyDisasters = async (radiusKm = 10) => {
    if (!currentLocation) return [];

    try {
      const { coords } = currentLocation;
      const nearbyReports = await disasters.getDisasterReportsByLocation(
        coords.latitude,
        coords.longitude,
        radiusKm
      );
      return nearbyReports;
    } catch (err) {
      console.error('Error getting nearby disasters:', err);
      return [];
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      refreshDisasterReports();
      refreshDangerZones();
    }
  }, [user]);

  const value: DisasterContextType = {
    currentLocation,
    disasterReports,
    dangerZones,
    loading,
    error,
    reportDisaster,
    refreshDisasterReports,
    refreshDangerZones,
    checkLocationSafety,
    getNearbyDisasters,
    isInDangerZone,
    dangerZoneAlert,
  };

  return (
    <DisasterContext.Provider value={value}>
      {children}
    </DisasterContext.Provider>
  );
}

// Hook to use disaster context
export function useDisaster() {
  const context = useContext(DisasterContext);
  if (context === undefined) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
}

// Hook to check if location is safe
export function useLocationSafety() {
  const { isInDangerZone, dangerZoneAlert, checkLocationSafety } = useDisaster();
  
  return {
    isInDangerZone,
    dangerZoneAlert,
    checkLocationSafety,
  };
}
