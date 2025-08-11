import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Calendar, Clock, Users, Settings, ArrowLeft } from 'lucide-react-native';
import { useApp } from '../../context/AppContext'
import DoctorProfileForm from './DoctorProfileForm';
import { ScheduleConfig } from './ScheduleConfig';
import DoctorAppointments from './DoctorAppointments';
import {PetManagement} from '../Owner/PetManagement';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const DoctorDashboard: React.FC = () => {
  const { state, dispatch } = useApp(); // Obtain state and dispatch from context
  const [activeTab, setActiveTab] = useState('overview');

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = state.appointments.filter((apt: any) => {
    const slot = state.timeSlots.find((s: any) => s.id === apt.slotId);
    return slot?.date === today && apt.doctorId === state.currentUserId;
  });

  const upcomingAppointments = state.appointments.filter((apt: any) => {
    const slot = state.timeSlots.find((s: any) => s.id === apt.slotId);
    return slot && new Date(slot.date) > new Date() && apt.doctorId === state.currentUserId;
  });

  const totalPatients = new Set(
    state.appointments
      .filter((apt: any) => apt.doctorId === state.currentUserId)
      .map((apt: any) => apt.petOwnerId)
  ).size;

  const renderCard = (
    title: string,
    value: number,
    Icon: React.FC<{ size: number; color: string }>,
    description: string
  ) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Icon size={18} color="#6b7280" />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => dispatch({ type: 'LOGOUT' })}
          >
            <ArrowLeft size={16} color="#000" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Doctor Dashboard</Text>
          <Text style={styles.subtitle}>Manage your practice efficiently</Text>
        </View>

        <View style={styles.cardGrid}>
          {renderCard("Today's Appointments", todayAppointments.length, Calendar, 'Scheduled for today')}
          {renderCard("Upcoming", upcomingAppointments.length, Clock, 'Future appointments')}
          {renderCard("Total Patients", totalPatients, Users, 'Unique pet owners')}
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabList}>
            {['overview', 'profile', 'schedule', 'appointments'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'overview' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setActiveTab('schedule')}
                >
                  <Settings size={24} color="#000" />
                  <Text>Configure Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.outlined]}
                  onPress={() => setActiveTab('appointments')}
                >
                  <Calendar size={24} color="#000" />
                  <Text>View Appointments</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'profile' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Doctor Profile</Text>
              <DoctorProfileForm/>
            </View>
          )}

          {activeTab === 'schedule' && (
            <View>
              <ScheduleConfig/>
            </View>
          )}

          {activeTab === 'appointments' && (
            <View>
              <DoctorAppointments/>
            </View>
          )}
           {activeTab === 'pets' && (
            <View>
              <PetManagement/>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  cardGrid: {
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
  cardDescription: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
  tabsContainer: {
    marginTop: spacing.lg,
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary[500],
  },
  tabText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    textTransform: 'capitalize',
    fontWeight: fontWeight.medium,
  },
  activeTabText: {
    color: colors.gray[50],
    fontWeight: fontWeight.semibold,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  outlined: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
  },
});

export default DoctorDashboard;
