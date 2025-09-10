import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Navigation, Clock, Shield, AlertTriangle } from 'lucide-react-native';

export default function SafeRoutesScreen() {
  const { theme } = useTheme();
  const [showAI, setShowAI] = useState(false);
  const openAI = () => setShowAI(true);
  const closeAI = () => setShowAI(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const safeRoutes = [
    {
      id: 1,
      from: 'Metro Station',
      to: 'City Mall',
      duration: '15 min',
      safetyRating: 4.8,
      reports: 12,
      lastUpdated: '2 hours ago',
      highlights: ['Well-lit path', 'CCTV coverage', 'High foot traffic']
    },
    {
      id: 2,
      from: 'University',
      to: 'Bus Stop',
      duration: '8 min',
      safetyRating: 4.6,
      reports: 8,
      lastUpdated: '1 hour ago',
      highlights: ['Security patrol', 'Emergency call boxes']
    },
    {
      id: 3,
      from: 'Office Complex',
      to: 'Residential Area',
      duration: '22 min',
      safetyRating: 4.2,
      reports: 15,
      lastUpdated: '30 min ago',
      highlights: ['Main road', 'Police station nearby']
    }
  ];

  const SafeRouteCard = ({ route, index }: { route: any, index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={styles.routeCard}
    >
      <View style={styles.routeHeader}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeTitle}>{route.from} → {route.to}</Text>
          <View style={styles.routeMetrics}>
            <View style={styles.metric}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.metricText}>{route.duration}</Text>
            </View>
            <View style={styles.metric}>
              <Shield size={14} color="#10B981" />
              <Text style={styles.metricText}>{route.safetyRating}/5</Text>
            </View>
            <View style={styles.metric}>
              <AlertTriangle size={14} color="#F59E0B" />
              <Text style={styles.metricText}>{route.reports} reports</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.navigateButton}>
          <Navigation size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <View style={styles.routeHighlights}>
        {route.highlights.map((highlight: string, idx: number) => (
          <View key={idx} style={styles.highlight}>
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.lastUpdated}>
        Last updated: {route.lastUpdated}
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <LinearGradient
        colors={theme.colors.gradient as [string, string]}
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
            <Text style={[styles.title, { color: theme.colors.text }]}>Safe Routes</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Community-verified safe paths for your journey</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.searchSection}
          >
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}> 
              <MapPin size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="From location"
                value={fromLocation}
                onChangeText={setFromLocation}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}> 
              <MapPin size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="To location"
                value={toLocation}
                onChangeText={setToLocation}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Find Safe Route</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.statsContainer}
          >
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Safe Routes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.7</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2.1k</Text>
              <Text style={styles.statLabel}>Community Reports</Text>
            </View>
          </Animated.View>

          <View style={styles.routesSection}>
            <Text style={styles.sectionTitle}>Recommended Routes</Text>
            {safeRoutes.map((route, index) => (
              <SafeRouteCard key={route.id} route={route} index={index} />
            ))}
          </View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(600)}
            style={styles.contributionSection}
          >
            <Text style={styles.contributionTitle}>Help the Community</Text>
            <Text style={styles.contributionText}>
              Share your route experience to help keep everyone safe
            </Text>
            <TouchableOpacity style={styles.contributeButton}>
              <Text style={styles.contributeButtonText}>Report Route Safety</Text>
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
  searchSection: {
    padding: 20,
    paddingTop: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
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
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  routesSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  routeCard: {
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
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  routeMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metricText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  navigateButton: {
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    padding: 8,
  },
  routeHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  highlight: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  contributionSection: {
    margin: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  contributionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contributionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  contributeButton: {
    backgroundColor: '#14B8A6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contributeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});