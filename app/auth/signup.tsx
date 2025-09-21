/**
 * Sign Up Screen for ResQ Connect
 * 
 * Provides user registration with email, password, and username
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
import { Eye, EyeOff, Shield, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Calculate password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUp(formData.email.trim(), formData.password, formData.username.trim());
      Alert.alert(
        'Account Created',
        'Your account has been created successfully! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert(
        'Sign Up Failed',
        error.message || 'An error occurred during sign up. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#EF4444';
    if (passwordStrength <= 4) return '#F59E0B';
    return '#10B981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
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
      borderColor: errors.email || errors.username || errors.password || errors.confirmPassword ? '#EF4444' : theme.colors.border,
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
    passwordStrength: {
      marginTop: 8,
    },
    passwordStrengthBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginBottom: 4,
    },
    passwordStrengthFill: {
      height: '100%',
      backgroundColor: getPasswordStrengthColor(),
      borderRadius: 2,
      width: `${(passwordStrength / 6) * 100}%`,
    },
    passwordStrengthText: {
      fontSize: 12,
      color: getPasswordStrengthColor(),
      fontWeight: '600',
    },
    errorText: {
      color: '#EF4444',
      fontSize: 14,
      marginTop: 4,
    },
    signUpButton: {
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
    signUpButtonText: {
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
    signInLink: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    termsText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 16,
      lineHeight: 16,
    },
    termsLink: {
      color: theme.colors.primary,
      fontWeight: '600',
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
                <Text style={dynamicStyles.title}>Create Account</Text>
              </View>
              <Text style={dynamicStyles.subtitle}>
                Join ResQ Connect to access disaster management and safety features
              </Text>
            </View>

            <View style={dynamicStyles.form}>
              <View style={dynamicStyles.inputContainer}>
                <Text style={dynamicStyles.label}>Username</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Choose a username"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.username && (
                  <Text style={dynamicStyles.errorText}>{errors.username}</Text>
                )}
              </View>

              <View style={dynamicStyles.inputContainer}>
                <Text style={dynamicStyles.label}>Email Address</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
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
                    placeholder="Create a password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
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
                {formData.password.length > 0 && (
                  <View style={dynamicStyles.passwordStrength}>
                    <View style={dynamicStyles.passwordStrengthBar}>
                      <View style={dynamicStyles.passwordStrengthFill} />
                    </View>
                    <Text style={dynamicStyles.passwordStrengthText}>
                      Password strength: {getPasswordStrengthText()}
                    </Text>
                  </View>
                )}
                {errors.password && (
                  <Text style={dynamicStyles.errorText}>{errors.password}</Text>
                )}
              </View>

              <View style={dynamicStyles.inputContainer}>
                <Text style={dynamicStyles.label}>Confirm Password</Text>
                <View style={dynamicStyles.passwordContainer}>
                  <TextInput
                    style={dynamicStyles.passwordInput}
                    placeholder="Confirm your password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={dynamicStyles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={dynamicStyles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  dynamicStyles.signUpButton,
                  loading && dynamicStyles.loadingButton,
                ]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={dynamicStyles.signUpButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <Text style={dynamicStyles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={dynamicStyles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={dynamicStyles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <View style={dynamicStyles.footer}>
              <Text style={dynamicStyles.footerText}>
                Already have an account?{' '}
                <Link href="/auth/signin" asChild>
                  <TouchableOpacity>
                    <Text style={dynamicStyles.signInLink}>Sign In</Text>
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
