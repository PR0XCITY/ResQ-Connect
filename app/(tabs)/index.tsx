import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Phone, MapPin, Users } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function EmergencyScreen() {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const pulseAnimation = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Continuous pulse animation
    pulseAnimation.value = withRepeat(
      withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleEmergencyPress = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate([0, 500, 100, 500]);
      // Play buzzer sound
      (async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('@/assets/buzzer.mp3')
          );
          await sound.playAsync();
        } catch (e) {
          // fallback: no sound
        }
      })();
    }
    setIsPressed(true);
    setCountdown(5);
    buttonScale.value = withTiming(0.95, { duration: 100 });

    setTimeout(() => {
      setIsPressed(false);
      buttonScale.value = withTiming(1, { duration: 200 });
      triggerEmergencyAlert();
    }, 5000);
  };

  const cancelEmergency = () => {
    setIsPressed(false);
    setCountdown(0);
    buttonScale.value = withTiming(1, { duration: 200 });
  };

  const triggerEmergencyAlert = () => {
    // Simulate emergency alert
    Alert.alert(
      'Emergency Alert Sent!',
      'Your emergency contacts have been notified with your current location. Stay safe!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      pulseAnimation.value,
      [1, 1.1],
      ['#DC2626', '#EF4444']
    );

    return {
      transform: [
        { scale: pulseAnimation.value * buttonScale.value },
      ],
      backgroundColor,
    };
  });

  const QuickActionCard = ({ icon: Icon, title, subtitle, onPress }: { icon: any, title: string, subtitle: string, onPress: () => void }) => (
    <TouchableOpacity style={[quickActionStyles.card, { backgroundColor: theme.colors.card }]} onPress={onPress}>
      <View style={[quickActionStyles.icon, { backgroundColor: theme.colors.surface }]}> 
        <Icon size={24} color={theme.colors.primary} />
      </View>
      <View style={quickActionStyles.content}>
        <Text style={[quickActionStyles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[quickActionStyles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const quickActionStyles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    icon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    emergencyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    emergencyDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 22,
    },
    quickActionsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    quickActionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
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
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    quickActionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    quickActionSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <LinearGradient
        colors={theme.colors.gradient as [string, string]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={dynamicStyles.title}>ResQ Connect</Text>
          <Text style={dynamicStyles.subtitle}>Your Travel Safety Companion</Text>
        </View>

        <View style={styles.emergencySection}>
          <Text style={dynamicStyles.emergencyTitle}>Emergency Alert</Text>
          <Text style={dynamicStyles.emergencyDescription}>
            Press and hold to send your location to emergency contacts
          </Text>

          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.emergencyButton, animatedButtonStyle]}>
              <TouchableOpacity
                style={styles.emergencyButtonInner}
                onPress={handleEmergencyPress}
                disabled={isPressed}
              >
                <Shield size={48} color="#FFFFFF" />
                <Text style={styles.emergencyButtonText}>
                  {isPressed ? `CANCEL (${countdown})` : 'SOS'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {isPressed && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelEmergency}
            >
              <Text style={styles.cancelButtonText}>Cancel Alert</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={dynamicStyles.quickActionsTitle}>Quick Actions</Text>
          
          <QuickActionCard
            icon={Phone}
            title="Call Emergency"
            subtitle="Direct call to authorities"
            onPress={() => Alert.alert('Feature Coming Soon', 'Direct emergency calling will be available soon.')}
          />
          
          <QuickActionCard
            icon={MapPin}
            title="Share Location"
            subtitle="Send live location to contacts"
            onPress={() => Alert.alert('Location Shared', 'Your current location has been shared with trusted contacts.')}
          />
          
          <QuickActionCard
            icon={Users}
            title="Find Nearby Help"
            subtitle="Locate nearby safe spaces"
            onPress={() => Alert.alert('Feature Coming Soon', 'Nearby safe spaces feature will be available soon.')}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  emergencySection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emergencyButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emergencyButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flex: 1,
  },
  quickActionContent: {
    flex: 1,
  },
});