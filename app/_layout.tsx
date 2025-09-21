import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Constants from 'expo-constants';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DisasterProvider } from '@/contexts/DisasterContext';
import DemoBanner from '@/components/DemoBanner';

export default function RootLayout() {
  useFrameworkReady();

  // Check if we're in demo mode
  const isDemoMode = Constants.expoConfig?.extra?.demoMode || process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

  return (
    <ThemeProvider>
      <AuthProvider>
        <DisasterProvider>
          <View style={{ flex: 1 }}>
            {isDemoMode && <DemoBanner />}
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </View>
        </DisasterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
