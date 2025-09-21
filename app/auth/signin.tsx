/**
 * Sign In Screen for ResQ Connect
 * 
 * Provides user authentication with email, password, and username
 * for the disaster management and safety features.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SignInScreen() {
  const { theme } = useTheme();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Sign In Failed',
        error.message || 'An error occurred during sign in. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradient: {
      flex: 1,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      marginLeft: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    form: {
      flex: 1,
      paddingHorizontal: 20,
    },
    inputContainer: {
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
      paddingVertical: 14,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: errors.email || errors.password ? '#EF4444' : theme.colors.border,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordInput: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      paddingRight: 50,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: errors.password ? '#EF4444' : theme.colors.border,
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      top: 14,
      padding: 4,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 14,
      marginTop: 4,
    },
    signInButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    signInButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loadingButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      alignItems: 'center',
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
    signUpLink: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    forgotPassword: {
      color: theme.colors.primary,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <LinearGradient
        colors={theme.colors.gradient as [string, string]}
        style={dynamicStyles.gradient}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={dynamicStyles.header}>
              <TouchableOpacity
                style={dynamicStyles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={20} color={theme.colors.primary} />
                <Text style={dynamicStyles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Shield size={32} color={theme.colors.primary} />
                <Text style={dynamicStyles.title}>Welcome Back</Text>
              </View>
              <Text style={dynamicStyles.subtitle}>
                Sign in to access ResQ Connect's disaster management and safety features
              </Text>
            </View>

            <View style={dynamicStyles.form}>
              <View style={dynamicStyles.inputContainer}>
                <Text style={dynamicStyles.label}>Email Address</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.email && (
                  <Text style={dynamicStyles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={dynamicStyles.inputContainer}>
                <Text style={dynamicStyles.label}>Password</Text>
                <View style={dynamicStyles.passwordContainer}>
                  <TextInput
                    style={dynamicStyles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={dynamicStyles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={dynamicStyles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  dynamicStyles.signInButton,
                  loading && dynamicStyles.loadingButton,
                ]}
                onPress={handleSignIn}
                disabled={loading}
              >
                <Text style={dynamicStyles.signInButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginTop: 16 }}>
                <Text style={dynamicStyles.forgotPassword}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.footer}>
              <Text style={dynamicStyles.footerText}>
                Don't have an account?{' '}
                <Link href="/auth/signup" asChild>
                  <TouchableOpacity>
                    <Text style={dynamicStyles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
