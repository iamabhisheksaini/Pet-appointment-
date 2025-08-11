import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, Clock, Phone } from 'lucide-react-native';
import { useApp } from '../../context/AppContext'; // Adjust path if needed

const DoctorAppointments: React.FC = () => {
  const { state } = useApp(); // Access app state from context

  const doctorAppointments = state.appointments
    .filter((apt: any) => apt.doctorId === state.currentUserId)
    .map((apt: any) => {
      const slot = state.timeSlots.find((s: any) => s.id === apt.slotId);
      const petOwner = state.petOwners.find((p: any) => p.id === apt.petOwnerId);
      const pet = petOwner?.pets.find((p: any) => p.id === apt.petId);

      return {
        ...apt,
        slot,
        petOwner,
        pet,
      };
    })
    .filter((apt: any) => apt.slot && apt.petOwner && apt.pet)
    .sort((a: any, b: any) => {
      if (!a.slot || !b.slot) return 0;
      return (
        new Date(a.slot.date + ' ' + a.slot.startTime).getTime() -
        new Date(b.slot.date + ' ' + b.slot.startTime).getTime()
      );
    });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStatusBadge = (status: string) => {
    let color = '#9ca3af';
    if (status === 'scheduled') color = '#2563eb';
    if (status === 'completed') color = '#16a34a';
    if (status === 'cancelled') color = '#dc2626';

    return (
      <View style={[styles.badge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.badgeText, { color }]}>{status}</Text>
      </View>
    );
  };

  if (doctorAppointments.length === 0) {
    return (
      <View style={styles.card}>
        <Calendar size={48} color="#9ca3af" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>No appointments scheduled yet.</Text>
        <Text style={styles.emptySubText}>
          Configure your schedule to start accepting appointments.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>
        Your Appointments ({doctorAppointments.length})
      </Text>

      {doctorAppointments.map((appointment: any) => (
        <View key={appointment.id} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.infoSection}>
              <View style={styles.badgeRow}>
                {renderStatusBadge(appointment.status)}
                {appointment.slot?.specialization && (
                  <View style={[styles.badge, styles.outlinedBadge]}>
                    <Text style={styles.outlinedBadgeText}>
                      {appointment.slot.specialization}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.detailsGrid}>
                <View>
                  <Text style={styles.petName}>
                    {appointment.pet?.name} ({appointment.pet?.type})
                  </Text>
                  <Text style={styles.detailText}>
                    Owner: {appointment.petOwner?.name}
                  </Text>
                  <Text style={styles.detailText}>Reason: {appointment.reason}</Text>
                </View>

                <View>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {formatDate(appointment.slot.date)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {appointment.slot.startTime} - {appointment.slot.endTime}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Phone size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {appointment.petOwner?.phone}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {appointment.status === 'scheduled' && (
              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'column',
    gap: 12,
  },
  infoSection: {
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  outlinedBadge: {
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  outlinedBadgeText: {
    fontSize: 12,
    color: '#4b5563',
  },
  petName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  buttonColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6b7280',
  },
  emptySubText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default DoctorAppointments;
