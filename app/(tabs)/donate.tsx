import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Gift, MapPin, Users, IndianRupee, CheckCircle, Clock, Target } from 'lucide-react-native';

export default function DonateScreen() {
  const { theme } = useTheme();
  const [showAI, setShowAI] = useState(false);
  const openAI = () => setShowAI(true);
  const closeAI = () => setShowAI(false);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const donationAmounts = [25, 50, 100, 250, 500, 1000];

  const transparencyReports = [
    {
      id: 1,
      location: 'Mumbai, Maharashtra',
      amount: '₹2,500',
      devices: 25,
      date: 'Jan 15, 2024',
      image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'completed',
    },
    {
      id: 2,
      location: 'Delhi NCR',
      amount: '₹4,200',
      devices: 42,
      date: 'Dec 28, 2023',
      image: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'completed',
    },
    {
      id: 3,
      location: 'Bangalore, Karnataka',
      amount: '₹1,800',
      devices: 18,
      date: 'Dec 10, 2023',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'in_progress',
    },
  ];

  const handleDonateDirectly = () => {
    Alert.alert(
      'Payment Option Coming Soon',
      'Direct donation payment system will be available soon. Thank you for your interest in supporting women\'s safety!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleGiftDevice = () => {
    Alert.alert(
      'Payment Option Coming Soon',
      'Saheli device gifting will be available soon. You\'ll be able to sponsor safety devices for women in need.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const AmountCard = ({ amount, isSelected, onPress }: { amount: number, isSelected: boolean, onPress: () => void }) => (
    <TouchableOpacity
      style={[
        styles.amountCard,
        isSelected && styles.amountCardSelected
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.amountText,
        isSelected && styles.amountTextSelected
      ]}>
        ₹{amount}
      </Text>
    </TouchableOpacity>
  );

  const TransparencyCard = ({ report, index }: { report: any, index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 150).duration(600)}
      style={styles.transparencyCard}
    >
      <View style={styles.transparencyHeader}>
        <View style={styles.locationInfo}>
          <MapPin size={16} color="#8B5CF6" />
          <Text style={styles.locationText}>{report.location}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          report.status === 'completed' ? styles.completedBadge : styles.progressBadge
        ]}>
          {report.status === 'completed' ? (
            <CheckCircle size={12} color="#10B981" />
          ) : (
            <Clock size={12} color="#F59E0B" />
          )}
          <Text style={[
            styles.statusText,
            report.status === 'completed' ? styles.completedText : styles.progressText
          ]}>
            {report.status === 'completed' ? 'Completed' : 'In Progress'}
          </Text>
        </View>
      </View>

      <View style={styles.transparencyStats}>
        <View style={styles.statItem}>
          <IndianRupee size={16} color="#6B7280" />
          <Text style={styles.statValue}>{report.amount}</Text>
          <Text style={styles.statLabel}>Donated</Text>
        </View>
        <View style={styles.statItem}>
          <Gift size={16} color="#6B7280" />
          <Text style={styles.statValue}>{report.devices}</Text>
          <Text style={styles.statLabel}>Devices</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.statValue}>{report.date}</Text>
          <Text style={styles.statLabel}>Date</Text>
        </View>
      </View>

      <Text style={styles.transparencyDescription}>
        Successfully distributed Saheli safety devices to women in {report.location}. 
        Each recipient received training on device usage and emergency protocols.
      </Text>
    </Animated.View>
  );

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
            <Text style={[styles.title, { color: theme.colors.text }]}>Support Saheli</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Help us make the world safer for women everywhere</Text>
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
            style={styles.impactSection}
          >
            <Text style={styles.sectionTitle}>Our Impact</Text>
            <View style={styles.impactStats}>
              <View style={styles.impactCard}>
                <Users size={24} color="#EF4444" />
                <Text style={styles.impactNumber}>12,847</Text>
                <Text style={styles.impactLabel}>Women Protected</Text>
              </View>
              <View style={styles.impactCard}>
                <Gift size={24} color="#EF4444" />
                <Text style={styles.impactNumber}>3,256</Text>
                <Text style={styles.impactLabel}>Devices Distributed</Text>
              </View>
              <View style={styles.impactCard}>
                <Target size={24} color="#EF4444" />
                <Text style={styles.impactNumber}>89%</Text>
                <Text style={styles.impactLabel}>Emergency Response</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.donateSection}
          >
            <Text style={styles.sectionTitle}>Make a Donation</Text>
            
            <View style={styles.donateOptions}>
              <TouchableOpacity
                style={styles.primaryDonateButton}
                onPress={handleDonateDirectly}
              >
                <Heart size={24} color="#FFFFFF" />
                <Text style={styles.primaryDonateText}>Donate Directly</Text>
                <Text style={styles.primaryDonateSubtext}>Support our mission</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryDonateButton}
                onPress={handleGiftDevice}
              >
                <Gift size={24} color="#EF4444" />
                <Text style={styles.secondaryDonateText}>Gift Saheli Device</Text>
                <Text style={styles.secondaryDonateSubtext}>Sponsor a safety device</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.amountsContainer}>
              <Text style={styles.amountTitle}>Quick Amounts</Text>
              <View style={styles.amountsGrid}>
                {donationAmounts.map((amount) => (
                  <AmountCard
                    key={amount}
                    amount={amount}
                    isSelected={selectedAmount === amount}
                    onPress={() => setSelectedAmount(amount)}
                  />
                ))}
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.transparencySection}
          >
            <Text style={styles.sectionTitle}>Donation Transparency</Text>
            <Text style={styles.transparencyDescription}>
              See exactly how your donations are making a difference in communities
            </Text>
            
            {transparencyReports.map((report, index) => (
              <TransparencyCard key={report.id} report={report} index={index} />
            ))}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(600)}
            style={styles.commitmentSection}
          >
            <Text style={styles.commitmentTitle}>Our Commitment</Text>
            <View style={styles.commitmentPoints}>
              <View style={styles.commitmentPoint}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.commitmentText}>100% transparency in fund usage</Text>
              </View>
              <View style={styles.commitmentPoint}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.commitmentText}>Geo-tagged proof of distribution</Text>
              </View>
              <View style={styles.commitmentPoint}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.commitmentText}>Regular impact reports</Text>
              </View>
              <View style={styles.commitmentPoint}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.commitmentText}>Direct community engagement</Text>
              </View>
            </View>
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
  impactSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactCard: {
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
  impactNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 8,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  donateSection: {
    padding: 20,
    paddingTop: 0,
  },
  donateOptions: {
    marginBottom: 20,
  },
  primaryDonateButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryDonateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  primaryDonateSubtext: {
    color: '#FECACA',
    fontSize: 14,
    marginTop: 4,
  },
  secondaryDonateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  secondaryDonateText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  secondaryDonateSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  amountsContainer: {
    marginTop: 20,
  },
  amountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  amountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  amountCardSelected: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  amountTextSelected: {
    color: '#EF4444',
  },
  transparencySection: {
    padding: 20,
    paddingTop: 0,
  },
  transparencyDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  transparencyCard: {
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
  transparencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedBadge: {
    backgroundColor: '#ECFDF5',
  },
  progressBadge: {
    backgroundColor: '#FFFBEB',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  completedText: {
    color: '#10B981',
  },
  progressText: {
    color: '#F59E0B',
  },
  transparencyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  commitmentSection: {
    margin: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
  },
  commitmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  commitmentPoints: {
    marginLeft: 8,
  },
  commitmentPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commitmentText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
  },
});