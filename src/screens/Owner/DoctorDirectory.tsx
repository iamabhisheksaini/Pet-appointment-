import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Doctor } from '../../models/types';
import { BookingModal } from './BookingModal';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const SPECIALIZATIONS = [
  'General Checkup',
  'Dental Care',
  'Skin Conditions',
  'Behavioral Issues',
  'Surgery',
  'Emergency Care',
  'Vaccination',
  'Grooming',
];

export function DoctorDirectory() {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  /** Filter doctors based on search term and specialization */
  const filteredDoctors = state.doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialization =
      selectedSpecialization === 'all' || doctor.specializations.includes(selectedSpecialization);

    return matchesSearch && matchesSpecialization;
  });

  /** Counts available future slots for doctor */
  const getAvailableSlots = (doctorId: string) => {
    return state.timeSlots.filter(
      slot =>
        slot.doctorId === doctorId &&
        slot.isAvailable &&
        new Date(slot.date) >= new Date()
    ).length;
  };

  /** Open booking modal */
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const renderDoctor = ({ item: doctor }: { item: Doctor }) => {
    const availableSlots = getAvailableSlots(doctor.id);

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dr. {doctor.name}</Text>
        <Text style={styles.rating}>
          ⭐ {doctor.rating} ({doctor.experience} yrs exp.)
        </Text>
        <Text style={styles.bio}>{doctor.bio}</Text>
        <Text style={styles.location}>📍 {doctor.location}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badges}
          keyboardShouldPersistTaps="handled"
        >
          {doctor.specializations.slice(0, 3).map(spec => (
            <View key={spec} style={styles.badge}>
              <Text style={styles.badgeText}>{spec}</Text>
            </View>
          ))}
          {doctor.specializations.length > 3 && (
            <View style={[styles.badge, styles.outlineBadge]}>
              <Text style={[styles.badgeText, styles.outlineBadgeText]}>
                +{doctor.specializations.length - 3} more
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.slotRow}>
          <Text style={styles.slots}>⏰ {availableSlots} slots available</Text>
          <TouchableOpacity
            onPress={() => handleBookAppointment(doctor)}
            disabled={availableSlots === 0}
            style={[styles.button, availableSlots === 0 && styles.disabledButton]}
            activeOpacity={availableSlots === 0 ? 1 : 0.7}
          >
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text style={styles.buttonText}> Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Find a Doctor</Text>
        <TextInput
          style={styles.input}
          placeholder="Search doctors by name or specialty..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Search doctors"
        />
        <View style={styles.pickerWrapper}>
          {Platform.OS === 'ios' ? (
            // For iOS, Picker behaves better in modal sheets; for simplicity, render inline here
            <Picker
              selectedValue={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
              mode="dropdown"
            >
              <Picker.Item label="All specializations" value="all" />
              {SPECIALIZATIONS.map(spec => (
                <Picker.Item key={spec} label={spec} value={spec} />
              ))}
            </Picker>
          ) : (
            <Picker
              selectedValue={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
              mode="dropdown"
              dropdownIconColor="#666"
              style={{ width: '100%' }}
            >
              <Picker.Item label="All specializations" value="all" />
              {SPECIALIZATIONS.map(spec => (
                <Picker.Item key={spec} label={spec} value={spec} />
              ))}
            </Picker>
          )}
        </View>
      </View>

      {filteredDoctors.length === 0 ? (
        <Text style={styles.noResults}>No doctors found matching your criteria.</Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => item.id}
          renderItem={renderDoctor}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={showBooking}
          onClose={() => {
            setShowBooking(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    // Keep individual shadow properties for native platforms
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#111',
  },
  pickerWrapper: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
    fontSize: 16,
  },
  rating: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#e0e7ff', // light indigo-100
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#4338ca', // indigo-700
    fontWeight: '500',
  },
  outlineBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4338ca',
  },
  outlineBadgeText: {
    color: '#4338ca',
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slots: {
    fontSize: 14,
    color: '#10b981', // green-500
  },
  button: {
    backgroundColor: '#4338ca', // indigo-700
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#a5b4fc', // indigo-300 muted
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
});
export default DoctorDirectory;
