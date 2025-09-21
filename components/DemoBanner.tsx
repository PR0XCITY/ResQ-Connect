/**
 * Demo Banner Component for ResQ Connect
 * 
 * Shows a banner indicating the app is running in demo mode
 * with mock data and no real API connections.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface DemoBannerProps {
  visible?: boolean;
}

export default function DemoBanner({ visible = true }: DemoBannerProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: '#F59E0B',
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#D97706',
    },
    text: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <AlertTriangle size={16} color="#FFFFFF" />
      <Text style={dynamicStyles.text}>
        DEMO MODE - Mock data, no real API connections
      </Text>
    </View>
  );
}
