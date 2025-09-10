import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  MessageSquare,
  Shield,
  Eye,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function CommunityAlertsScreen() {
  const { theme } = useTheme();
  const [showAI, setShowAI] = useState(false);
  const openAI = () => setShowAI(true);
  const closeAI = () => setShowAI(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const communityAlerts = [
    {
      id: 1,
      type: 'suspicious',
      title: 'Suspicious Activity Reported',
      description: 'Person following women near the metro station entrance. Please be cautious.',
      location: 'Metro Station, Main Street',
      distance: '0.3 km away',
      time: '15 minutes ago',
      reporter: 'Anonymous',
      upvotes: 12,
      severity: 'high',
      verified: true,
    },
    {
      id: 2,
      type: 'unsafe_area',
      title: 'Poorly Lit Area',
      description: 'Street lights are broken. Area is very dark after 8 PM.',
      location: 'Park Avenue, Block C',
      distance: '0.8 km away',
      time: '2 hours ago',
      reporter: 'Sarah K.',
      upvotes: 8,
      severity: 'medium',
      verified: false,
    },
    {
      id: 3,
      type: 'positive',
      title: 'Increased Security Patrol',
      description: 'Security has increased patrols in this area. Feel much safer now!',
      location: 'University Campus',
      distance: '1.2 km away',
      time: '4 hours ago',
      reporter: 'Maya P.',
      upvotes: 25,
      severity: 'low',
      verified: true,
    },
    {
      id: 4,
      type: 'harassment',
      title: 'Harassment Incident',
      description: 'Individual making inappropriate comments to women passing by.',
      location: 'Shopping Mall Parking',
      distance: '0.5 km away',
      time: '1 day ago',
      reporter: 'Anonymous',
      upvotes: 18,
      severity: 'high',
      verified: true,
    }
  ];

  const filters = [
    { id: 'all', label: 'All Alerts', count: communityAlerts.length },
    { id: 'high', label: 'High Priority', count: communityAlerts.filter(a => a.severity === 'high').length },
    { id: 'verified', label: 'Verified', count: communityAlerts.filter(a => a.verified).length },
    { id: 'recent', label: 'Recent', count: communityAlerts.filter(a => a.time.includes('minutes') || a.time.includes('hour')).length },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious': return AlertTriangle;
      case 'unsafe_area': return Eye;
      case 'harassment': return AlertTriangle;
      case 'positive': return Shield;
      default: return AlertTriangle;
    }
  };

  const FilterChip = ({ filter, isSelected, onPress }: { filter: string, isSelected: boolean, onPress: () => void }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isSelected && styles.filterChipSelected
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        isSelected && styles.filterChipTextSelected
      ]}>
        {filter.label} ({filter.count})
      </Text>
    </TouchableOpacity>
  );

  const AlertCard = ({ alert, index }: { alert: any, index: number }) => {
    const IconComponent = getTypeIcon(alert.type);
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 150).duration(600)}
        style={styles.alertCard}
      >
        <View style={styles.alertHeader}>
          <View style={[
            styles.alertIcon,
            { backgroundColor: `${getSeverityColor(alert.severity)}20` }
          ]}>
            <IconComponent size={20} color={getSeverityColor(alert.severity)} />
          </View>
          <View style={styles.alertInfo}>
            <View style={styles.alertTitleRow}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              {alert.verified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color="#10B981" />
                </View>
              )}
            </View>
            <View style={styles.alertMetadata}>
              <View style={styles.metadataItem}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.metadataText}>{alert.time}</Text>
              </View>
              <View style={styles.metadataItem}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.metadataText}>{alert.distance}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.alertDescription}>{alert.description}</Text>
        <Text style={styles.alertLocation}>{alert.location}</Text>

        <View style={styles.alertFooter}>
          <Text style={styles.reporterText}>Reported by {alert.reporter}</Text>
          <View style={styles.alertActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Users size={16} color="#8B5CF6" />
              <Text style={styles.actionText}>{alert.upvotes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageSquare size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <LinearGradient
        colors={theme.colors.gradient}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInLeft.duration(600)}
            style={styles.header}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>Community Alerts</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Stay updated with real-time safety alerts from your community</Text>
      {/* Floating AI Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 32,
          right: 24,
          zIndex: 999,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={openAI}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>🤖</Text>
        </Animated.View>
      </TouchableOpacity>
      {/* AI Assistant Modal/Overlay */}
      {showAI && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{ width: '90%', height: '80%', backgroundColor: theme.colors.card, borderRadius: 24, overflow: 'hidden' }}>
            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold', margin: 16 }}>Saheli AI Assistant</Text>
            <TouchableOpacity style={{ position: 'absolute', top: 12, right: 16, zIndex: 10 }} onPress={closeAI}>
              <Text style={{ color: theme.colors.primary, fontSize: 22 }}>✕</Text>
            </TouchableOpacity>
            {/* ...existing code for AI chat or import component... */}
          </View>
        </View>
      )}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.statsSection}
          >
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>Active Alerts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2.1k</Text>
              <Text style={styles.statLabel}>Community</Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.filtersSection}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {filters.map((filter) => (
                <FilterChip
                  key={filter.id}
                  filter={filter}
                  isSelected={selectedFilter === filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                />
              ))}
            </ScrollView>
          </Animated.View>

          <View style={styles.alertsSection}>
            {communityAlerts.map((alert, index) => (
              <AlertCard key={alert.id} alert={alert} index={index} />
            ))}
          </View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(600)}
            style={styles.reportSection}
          >
            <Text style={styles.reportTitle}>Report an Issue</Text>
            <Text style={styles.reportText}>
              Help keep the community safe by reporting suspicious activities
            </Text>
            <TouchableOpacity style={styles.reportButton}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.reportButtonText}>Create Alert</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  alertsSection: {
    paddingHorizontal: 20,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 4,
    marginLeft: 8,
  },
  alertMetadata: {
    flexDirection: 'row',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  alertLocation: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 16,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reporterText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  alertActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#8B5CF6',
    marginLeft: 4,
    fontWeight: '500',
  },
  reportSection: {
    margin: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  reportText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});