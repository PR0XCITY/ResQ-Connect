import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  MapPin, 
  Phone, 
  Moon,
  Sun,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';

const DEMO_MODE_KEY = 'saheli_demo_mode';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [demoMode, setDemoMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  useEffect(() => {
    loadDemoModePreference();
  }, []);

  const loadDemoModePreference = async () => {
    try {
      const value = await AsyncStorage.getItem(DEMO_MODE_KEY);
      if (value !== null) {
        setDemoMode(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error loading demo mode preference:', error);
    }
  };

  const saveDemoModePreference = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(DEMO_MODE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving demo mode preference:', error);
    }
  };

  const handleDemoModeToggle = (value: boolean) => {
    setDemoMode(value);
    saveDemoModePreference(value);
    
    if (!value) {
      Alert.alert(
        'Demo Mode Disabled',
        'Sample content has been hidden. You can re-enable it anytime from this profile settings.',
        [{ text: 'OK', style: 'default' }]
      );
    } else {
      Alert.alert(
        'Demo Mode Enabled',
        'Sample alerts, routes, and community data are now visible for demonstration purposes.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const profileStats = [
    { label: 'Emergency Contacts', value: '5', icon: Phone },
    { label: 'Safe Routes', value: '12', icon: MapPin },
    { label: 'Community Alerts', value: '28', icon: Shield },
  ];

  const settingsOptions = [
    {
      title: 'Emergency Contacts',
      subtitle: 'Manage your emergency contact list',
      icon: Phone,
      onPress: () => Alert.alert('Feature Coming Soon', 'Emergency contact management will be available soon.'),
    },
    {
      title: 'Location Preferences',
      subtitle: 'Configure location sharing settings',
      icon: MapPin,
      onPress: () => Alert.alert('Feature Coming Soon', 'Location preferences will be available soon.'),
    },
    {
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: Shield,
      onPress: () => Alert.alert('Feature Coming Soon', 'Privacy settings will be available soon.'),
    },
    {
      title: 'App Settings',
      subtitle: 'General application settings',
      icon: Settings,
      onPress: () => Alert.alert('Feature Coming Soon', 'App settings will be available soon.'),
    },
  ];

  const SettingItem = ({ title, subtitle, icon: Icon, onPress, rightElement = null }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: theme.colors.surface }]}>
        <Icon size={20} color="#8B5CF6" />
      </View>
      <View style={[styles.settingContent]}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {rightElement || <ChevronRight size={20} color={theme.colors.textSecondary} />}
    </TouchableOpacity>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradient: {
      flex: 1,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
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
    profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
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
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    demoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FBBF24' : '#92400E',
      marginBottom: 4,
    },
    demoDescription: {
      fontSize: 14,
      color: isDark ? '#FCD34D' : '#B45309',
    },
    demoExplanationText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 8,
      flex: 1,
      lineHeight: 16,
    },
    supportTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    supportText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    versionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    versionSubtext: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <LinearGradient
        colors={theme.colors.gradient as [string, string]}
        style={dynamicStyles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInLeft.duration(600)}
            style={styles.header}
          >
            <View style={styles.profileHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.colors.surface }]}>
                <User size={32} color="#8B5CF6" />
              </View>
              <View style={styles.profileInfo}>
                {/* Anonymized: user identity hidden in demo mode */}
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.statsSection}
          >
            <Text style={dynamicStyles.sectionTitle}>Your Activity</Text>
            <View style={styles.statsContainer}>
              {profileStats.map((stat, index) => (
                <View key={index} style={dynamicStyles.statCard}>
                  <stat.icon size={24} color="#8B5CF6" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={dynamicStyles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(350).duration(600)}
            style={styles.themeSection}
          >
            <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
            
            <SettingItem
              title="Dark Mode"
              subtitle={`Currently using ${isDark ? 'dark' : 'light'} theme`}
              icon={isDark ? Moon : Sun}
              onPress={() => {}}
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
                  thumbColor={isDark ? '#8B5CF6' : '#F3F4F6'}
                />
              }
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.demoSection}
          >
            <View style={styles.demoHeader}>
              <View style={styles.demoInfo}>
                <Text style={dynamicStyles.demoTitle}>Demo Mode</Text>
                <Text style={dynamicStyles.demoDescription}>
                  Show sample content for demonstration
                </Text>
              </View>
              <Switch
                value={demoMode}
                onValueChange={handleDemoModeToggle}
                trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
                thumbColor={demoMode ? '#8B5CF6' : '#F3F4F6'}
              />
            </View>
            <View style={styles.demoExplanation}>
              <Info size={16} color={theme.colors.textSecondary} />
              <Text style={dynamicStyles.demoExplanationText}>
                When disabled, all sample alerts, routes, and community data will be hidden from the app.
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            style={styles.togglesSection}
          >
            <Text style={dynamicStyles.sectionTitle}>Quick Settings</Text>
            
            <SettingItem
              title="Push Notifications"
              subtitle="Receive safety alerts and updates"
              icon={Bell}
              onPress={() => {}}
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
                  thumbColor={notifications ? '#8B5CF6' : '#F3F4F6'}
                />
              }
            />

            <SettingItem
              title="Location Sharing"
              subtitle="Allow emergency contacts to see your location"
              icon={MapPin}
              onPress={() => {}}
              rightElement={
                <Switch
                  value={locationSharing}
                  onValueChange={setLocationSharing}
                  trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
                  thumbColor={locationSharing ? '#8B5CF6' : '#F3F4F6'}
                />
              }
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.settingsSection}
          >
            <Text style={dynamicStyles.sectionTitle}>Settings</Text>
            {settingsOptions.map((option, index) => (
              <SettingItem
                key={index}
                title={option.title}
                subtitle={option.subtitle}
                icon={option.icon}
                onPress={option.onPress}
              />
            ))}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(700).duration(600)}
            style={styles.supportSection}
          >
            <Text style={dynamicStyles.supportTitle}>Need Help?</Text>
            <Text style={dynamicStyles.supportText}>
              Our support team is available 24/7 to help you with any safety concerns or app-related questions.
            </Text>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(600)}
            style={styles.versionSection}
          >
            <Text style={dynamicStyles.versionText}>Saheli v1.0.0</Text>
            <Text style={dynamicStyles.versionSubtext}>My Saheli, My Shield</Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginTop: 8,
    marginBottom: 4,
  },
  themeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  demoSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  demoInfo: {
    flex: 1,
  },
  demoExplanation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  togglesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  supportSection: {
    margin: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  supportButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
});