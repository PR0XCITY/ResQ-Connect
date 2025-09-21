/**
 * Disaster Map Screen for ResQ Connect
 * 
 * Interactive map showing disaster reports, danger zones, and safety information
 * for the disaster management module.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { 
  MapPin, 
  Plus, 
  Filter, 
  AlertTriangle, 
  Shield, 
  Camera,
  X,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useDisaster } from '@/contexts/DisasterContext';
import { useAuth } from '@/contexts/AuthContext';
import { DisasterReport } from '@/src/lib/supabase';

const { width, height } = Dimensions.get('window');

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

export default function DisasterMapScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { 
    currentLocation, 
    disasterReports, 
    dangerZones, 
    loading, 
    reportDisaster,
    refreshDisasterReports 
  } = useDisaster();

  const [selectedDisaster, setSelectedDisaster] = useState<DisasterReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    disasterTypes: DISASTER_TYPES.map(t => t.id),
    severityLevels: SEVERITY_LEVELS.map(s => s.id),
    timeRange: 'all', // all, 24h, 7d, 30d
  });
  const [reportForm, setReportForm] = useState({
    disasterType: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    photo: null as string | null,
  });

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    refreshDisasterReports();
  }, []);

  const handleReportDisaster = async () => {
    if (!user || !currentLocation) {
      Alert.alert('Error', 'Please sign in and enable location services to report disasters.');
      return;
    }

    if (!reportForm.disasterType || !reportForm.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      await reportDisaster({
        disaster_type: reportForm.disasterType,
        description: reportForm.description.trim(),
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        photo_url: reportForm.photo,
        status: 'open',
        severity: reportForm.severity,
      });

      setShowReportModal(false);
      setReportForm({
        disasterType: '',
        description: '',
        severity: 'medium',
        photo: null,
      });
      
      Alert.alert('Success', 'Disaster report submitted successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit disaster report.');
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setReportForm(prev => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

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

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    map: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      zIndex: 1000,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    controls: {
      flexDirection: 'row',
      gap: 12,
    },
    controlButton: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    floatingButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: height * 0.8,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    disasterTypeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    disasterTypeButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    disasterTypeButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    disasterTypeText: {
      fontSize: 14,
      fontWeight: '500',
    },
    disasterTypeTextSelected: {
      color: '#FFFFFF',
    },
    severityGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    severityButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    severityButtonSelected: {
      borderColor: getSeverityColor(reportForm.severity),
    },
    severityText: {
      fontSize: 14,
      fontWeight: '500',
    },
    photoButton: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    photoButtonText: {
      marginLeft: 8,
      fontSize: 16,
      color: theme.colors.text,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    disasterCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    disasterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    disasterType: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    disasterTime: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    disasterDescription: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 8,
    },
    disasterFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    disasterSeverity: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: getSeverityColor(selectedDisaster?.severity || 'medium'),
    },
    disasterSeverityText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    disasterLocation: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <MapView
        ref={mapRef}
        style={dynamicStyles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentLocation?.coords.latitude || 26.1445,
          longitude: currentLocation?.coords.longitude || 91.7362,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Disaster Report Markers */}
        {disasterReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            onPress={() => setSelectedDisaster(report)}
          >
            <View style={{
              backgroundColor: getDisasterColor(report.disaster_type),
              borderRadius: 20,
              padding: 8,
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
                {DISASTER_TYPES.find(t => t.id === report.disaster_type)?.icon || '⚠️'}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Danger Zone Circles */}
        {dangerZones.map((zone) => (
          <Circle
            key={zone.id}
            center={{
              latitude: JSON.parse(zone.polygon).coordinates[0][0][1],
              longitude: JSON.parse(zone.polygon).coordinates[0][0][0],
            }}
            radius={1000} // 1km radius
            fillColor="rgba(239, 68, 68, 0.2)"
            strokeColor="rgba(239, 68, 68, 0.8)"
            strokeWidth={2}
          />
        ))}
      </MapView>

      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerContent}>
          <Text style={dynamicStyles.title}>Disaster Map</Text>
          <View style={dynamicStyles.controls}>
            <TouchableOpacity
              style={dynamicStyles.controlButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Filter size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={dynamicStyles.floatingButton}
        onPress={() => setShowReportModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Report Disaster Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Report Disaster</Text>
              <TouchableOpacity
                style={dynamicStyles.closeButton}
                onPress={() => setShowReportModal(false)}
              >
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Disaster Type *</Text>
                <View style={dynamicStyles.disasterTypeGrid}>
                  {DISASTER_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        dynamicStyles.disasterTypeButton,
                        reportForm.disasterType === type.id && dynamicStyles.disasterTypeButtonSelected,
                      ]}
                      onPress={() => setReportForm(prev => ({ ...prev, disasterType: type.id }))}
                    >
                      <Text style={[
                        dynamicStyles.disasterTypeText,
                        reportForm.disasterType === type.id && dynamicStyles.disasterTypeTextSelected,
                      ]}>
                        {type.icon} {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Severity Level *</Text>
                <View style={dynamicStyles.severityGrid}>
                  {SEVERITY_LEVELS.map((severity) => (
                    <TouchableOpacity
                      key={severity.id}
                      style={[
                        dynamicStyles.severityButton,
                        reportForm.severity === severity.id && dynamicStyles.severityButtonSelected,
                        { borderColor: reportForm.severity === severity.id ? severity.color : theme.colors.border },
                      ]}
                      onPress={() => setReportForm(prev => ({ ...prev, severity: severity.id as any }))}
                    >
                      <Text style={[
                        dynamicStyles.severityText,
                        { color: reportForm.severity === severity.id ? severity.color : theme.colors.text },
                      ]}>
                        {severity.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Description *</Text>
                <TextInput
                  style={[dynamicStyles.input, dynamicStyles.textArea]}
                  placeholder="Describe the disaster situation..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={reportForm.description}
                  onChangeText={(text) => setReportForm(prev => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Photo (Optional)</Text>
                <TouchableOpacity
                  style={dynamicStyles.photoButton}
                  onPress={handleTakePhoto}
                >
                  <Camera size={20} color={theme.colors.primary} />
                  <Text style={dynamicStyles.photoButtonText}>
                    {reportForm.photo ? 'Photo Selected' : 'Take Photo'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={dynamicStyles.submitButton}
                onPress={handleReportDisaster}
                disabled={loading}
              >
                <Text style={dynamicStyles.submitButtonText}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Selected Disaster Card */}
      {selectedDisaster && (
        <View style={[dynamicStyles.disasterCard, { position: 'absolute', bottom: 100, left: 20, right: 20 }]}>
          <View style={dynamicStyles.disasterHeader}>
            <Text style={dynamicStyles.disasterType}>
              {DISASTER_TYPES.find(t => t.id === selectedDisaster.disaster_type)?.icon} {selectedDisaster.disaster_type}
            </Text>
            <Text style={dynamicStyles.disasterTime}>
              {formatTimeAgo(selectedDisaster.created_at)}
            </Text>
          </View>
          <Text style={dynamicStyles.disasterDescription}>
            {selectedDisaster.description}
          </Text>
          <View style={dynamicStyles.disasterFooter}>
            <View style={dynamicStyles.disasterSeverity}>
              <Text style={dynamicStyles.disasterSeverityText}>
                {selectedDisaster.severity.toUpperCase()}
              </Text>
            </View>
            <Text style={dynamicStyles.disasterLocation}>
              {selectedDisaster.latitude.toFixed(4)}, {selectedDisaster.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
