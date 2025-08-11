import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Heart, Calendar, Search, Plus, ArrowLeft } from 'lucide-react-native';
import { useApp } from '../../context/AppContext'; // adjust path
import DoctorDirectory from './DoctorDirectory'; // assume React Native versions of these
import PetOwnerAppointments from './PetOwnerAppointments'; // assume React Native versions of these
import { PetManagement } from './PetManagement';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';


export function PetOwnerDashboard() {
  const { state, dispatch } = useApp();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'overview' | 'book' | 'appointments' | 'pets'>('overview');

  const currentPetOwner = state.petOwners.find(p => p.id === state.currentUserId);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  const myAppointments = state.appointments.filter(apt => apt.petOwnerId === state.currentUserId);

  const upcomingAppointments = myAppointments.filter(apt => {
    const slot = state.timeSlots.find(s => s.id === apt.slotId);
    const today = new Date();
    return slot && new Date(slot.date) >= today && apt.status === 'scheduled';
  });

  // Helper to format date string nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Tab button component
  const TabButton = ({ value, label }: { value: typeof activeTab; label: string }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === value && styles.tabButtonActive]}
      onPress={() => setActiveTab(value)}
    >
      <Text style={[styles.tabButtonText, activeTab === value && styles.tabButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => dispatch({ type: 'LOGOUT' })}
          >
            <ArrowLeft size={16} color="#000" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Welcome, {currentPetOwner?.name || 'Pet Owner'}!</Text>
          <Text style={styles.subtitle}>Manage your pets' healthcare</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Pets</Text>
              <Heart size={16} color="#888" />
            </View>
            <Text style={styles.cardValue}>{currentPetOwner?.pets.length || 0}</Text>
            <Text style={styles.cardSubtitle}>Registered pets</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Upcoming Appointments</Text>
              <Calendar size={16} color="#888" />
            </View>
            <Text style={styles.cardValue}>{upcomingAppointments.length}</Text>
            <Text style={styles.cardSubtitle}>Scheduled visits</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Available Doctors</Text>
              <Search size={16} color="#888" />
            </View>
            <Text style={styles.cardValue}>{state.doctors.length}</Text>
            <Text style={styles.cardSubtitle}>In your area</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsList}>
          <TabButton value="overview" label="Overview" />
          <TabButton value="book" label="Book" />
          <TabButton value="appointments" label="Appointments" />
          <TabButton value="pets" label="My Pets" />
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <View>
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity 
                  style={[styles.actionCard, styles.bookAppointmentCard]} 
                  onPress={() => setActiveTab('book')}
                >
                  <Plus size={32} color="#2563eb" />
                  <Text style={styles.actionCardTitle}>Book Appointment</Text>
                  <Text style={styles.actionCardSubtitle}>Find and book with available doctors</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionCard, styles.managePetsCard]} 
                  onPress={() => setActiveTab('pets')}
                >
                  <Heart size={32} color="#2563eb" />
                  <Text style={styles.actionCardTitle}>Manage Pets</Text>
                  <Text style={styles.actionCardSubtitle}>Add or update your pet information</Text>
                </TouchableOpacity>
              </View>

              {upcomingAppointments.length > 0 && (
                <View style={styles.nextAppointmentsCard}>
                  <Text style={styles.nextAppointmentsTitle}>Next Appointment</Text>
                  {upcomingAppointments.slice(0, 2).map(apt => {
                    const slot = state.timeSlots.find(s => s.id === apt.slotId);
                    const doctor = state.doctors.find(d => d.id === apt.doctorId);
                    const pet = currentPetOwner?.pets.find(p => p.id === apt.petId);

                    if (!slot || !doctor || !pet) return null;

                    return (
                      <View key={apt.id} style={styles.nextAppointmentItem}>
                        <View>
                          <Text style={styles.appointmentPetText}>
                            {pet.name} with Dr. {doctor.name}
                          </Text>
                          <Text style={styles.appointmentDateText}>
                            {formatDate(slot.date)} at {slot.startTime}
                          </Text>
                        </View>
                        <Calendar size={20} color="#2563eb" />
                      </View>
                    );
                  })}
                </View>
              )}

            </View>
          )}

          {activeTab === 'book' && (
            <DoctorDirectory />
          )}

          {activeTab === 'appointments' && (
            <PetOwnerAppointments />
          )}

          {activeTab === 'pets' && (
            <PetManagement />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  headerRow: {
    marginBottom: spacing.xl,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  backText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: fontWeight.medium,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.gray[600],
    fontSize: fontSize.base,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: '30%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray[700],
  },
  cardValue: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
  tabsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexWrap: 'wrap',
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: colors.primary[500],
  },
  tabButtonText: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    numberOfLines: 1,
  },
  tabButtonTextActive: {
    color: colors.gray[50],
    fontWeight: fontWeight.semibold,
  },
  tabContent: {
    minHeight: 300,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  bookAppointmentCard: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  managePetsCard: {
    borderWidth: 2,
    borderColor: '#a78bfa',
  },
  actionCardTitle: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
  },
  actionCardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  nextAppointmentsCard: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  nextAppointmentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  nextAppointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  appointmentPetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  appointmentDateText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default PetOwnerDashboard;
