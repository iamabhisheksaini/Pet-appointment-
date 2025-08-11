import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Calendar, Clock, User, Heart } from 'lucide-react-native';
import { useApp } from '../../context/AppContext'; // adjust import path
import { Badge } from '../../components/ui/badge'; // assumed you have a Badge component adapted to native
import { Button } from '../../components/ui/button'; // assumed native Button component

export function PetOwnerAppointments() {
  const { state } = useApp();

  const myAppointments = state.appointments
    .filter(apt => apt.petOwnerId === state.currentUserId)
    .map(apt => {
      const slot = state.timeSlots.find(s => s.id === apt.slotId);
      const doctor = state.doctors.find(d => d.id === apt.doctorId);
      const petOwner = state.petOwners.find(p => p.id === apt.petOwnerId);
      const pet = petOwner?.pets.find(p => p.id === apt.petId);
      return {
        ...apt,
        slot,
        doctor,
        pet,
      };
    })
    .filter(apt => apt.slot && apt.doctor && apt.pet)
    .sort((a, b) => {
      if (!a.slot || !b.slot) return 0;
      return (
        new Date(b.slot.date + ' ' + b.slot.startTime).getTime() -
        new Date(a.slot.date + ' ' + a.slot.startTime).getTime()
      );
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return styles.statusScheduled;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Group appointments by pet
  const appointmentsByPet = myAppointments.reduce((acc, apt) => {
    const petId = apt.petId;
    if (!acc[petId]) {
      acc[petId] = [];
    }
    acc[petId].push(apt);
    return acc;
  }, {} as Record<string, typeof myAppointments>);

  if (myAppointments.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Calendar size={48} color="#999" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>No appointments scheduled yet.</Text>
        <Text style={styles.emptySubText}>Book your first appointment to get started.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(appointmentsByPet).map(([petId, appointments]) => {
        const pet = appointments[0]?.pet;
        if (!pet) return null;

        return (
          <View key={petId} style={styles.petCard}>
            <View style={styles.petHeader}>
              <View style={styles.petHeaderLeft}>
                <Heart size={20} color="#2563eb" />
                <Text style={styles.petHeaderTitle}>{pet.name}'s Appointments</Text>
              </View>
              <View style={styles.petBadge}>
                <Badge variant="outline">{`${pet.type} • ${pet.breed}`}</Badge>
              </View>
            </View>

            {appointments.map(appointment => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentContent}>
                  <View style={styles.appointmentInfo}>
                    <View style={[styles.badgeRow, getStatusColor(appointment.status)]}>
                      <Badge>{appointment.status}</Badge>
                      {appointment.slot?.specialization ? (
                        <Badge variant="outline">{appointment.slot.specialization}</Badge>
                      ) : null}
                    </View>

                    <View style={styles.appointmentDetailsGrid}>
                      <View style={styles.appointmentLeft}>
                        <View style={styles.doctorRow}>
                          <User size={14} color="#6b7280" />
                          <Text style={styles.doctorName}>Dr. {appointment.doctor?.name}</Text>
                        </View>
                        <Text style={styles.appointmentReason}>Reason: {appointment.reason}</Text>
                        {appointment.notes ? (
                          <Text style={styles.appointmentNotes}>Notes: {appointment.notes}</Text>
                        ) : null}
                      </View>

                      <View style={styles.appointmentRight}>
                        <View style={styles.dateRow}>
                          <Calendar size={14} color="#6b7280" />
                          <Text style={styles.dateText}>{formatDate(appointment.slot!.date)}</Text>
                        </View>
                        <View style={styles.dateRow}>
                          <Clock size={14} color="#6b7280" />
                          <Text style={styles.dateText}>
                            {appointment.slot!.startTime} - {appointment.slot!.endTime}
                          </Text>
                        </View>
                        <Text style={styles.locationText}>Location: {appointment.doctor?.location}</Text>
                      </View>
                    </View>
                  </View>

                 <View style={styles.buttonsColumn}>
  {appointment.status === 'scheduled' && (
    <View style={styles.buttonsRow}>
      <Button
        size="sm"
        variant="outline"
        onPress={() => {/* TODO: reschedule action */}}
        style={styles.buttonSpacing}
      >
        Reschedule
      </Button>
      <Button
        size="sm"
        variant="outline"
        onPress={() => {/* TODO: cancel action */}}
      >
        Cancel
      </Button>
    </View>
  )}
  {appointment.status === 'completed' && (
    <Button
      size="sm"
      variant="outline"
      onPress={() => {/* TODO: book again action */}}
    >
      Book Again
    </Button>
  )}
</View>
                </View>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    elevation: 3,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    padding: 12,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  petHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 6,
  },
  petBadge: {
    // You can customize badge container if needed
  },
  appointmentCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  appointmentContent: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  appointmentInfo: {
    flex: 1,
    minWidth: 220,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 8,
  },

buttonsRow: {
  flexDirection: 'row',
  // optional spacing between buttons
  // you can tweak justifyContent or alignItems if needed
},

buttonSpacing: {
  marginRight: 8,
},
  statusScheduled: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)', // bg-primary/10
    color: '#2563eb',
  },
  statusCompleted: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)', // bg-success/10
    color: '#16a34a',
  },
  statusCancelled: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)', // bg-destructive/10
    color: '#dc2626',
  },
  statusDefault: {
    backgroundColor: '#f0f0f0',
    color: '#a0a0a0',
  },
  appointmentDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  appointmentLeft: {
    flex: 1,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
  },
  appointmentReason: {
    fontSize: 13,
    color: '#6b7280',
  },
  appointmentNotes: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  appointmentRight: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 16,
    minWidth: 140,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  locationText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  buttonsColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
    minWidth: 80,
  },
});
export default PetOwnerAppointments;