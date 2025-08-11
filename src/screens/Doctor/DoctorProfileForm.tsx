import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Doctor } from '../../models/types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

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

const DoctorProfileForm = ({ doctorId, mode = 'create' }: { doctorId?: string; mode?: 'create' | 'edit' }) => {
  const { state, dispatch } = useApp();

  const existing = useMemo(
    () => doctorId ? state.doctors.find(d => d.id === doctorId) : null,
    [state.doctors, doctorId]
  );

  const [form, setForm] = useState<Partial<Doctor>>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    specializations: [],
    experience: 0,
    rating: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        email: existing.email,
        phone: existing.phone,
        location: existing.location,
        bio: existing.bio,
        specializations: existing.specializations,
        experience: existing.experience,
        rating: existing.rating,
      });
    }
  }, [existing]);

  const toggleSpec = (spec: string) => {
    setForm(prev => ({
      ...prev,
      specializations: (prev.specializations || []).includes(spec)
        ? (prev.specializations || []).filter(s => s !== spec)
        : [...(prev.specializations || []), spec],
    }));
  };

  const generateUniqueId = () => {
    return `doctor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const { toast } = useToast();

  const save = () => {
    if (!form.name?.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a doctor name',
      });
      return;
    }

    setLoading(true);
    try {
      if (existing) {
        dispatch({ type: 'UPDATE_DOCTOR', payload: { id: existing.id, updates: form } });
        toast({
          title: 'Profile Updated',
          description: 'Doctor profile updated successfully',
        });
      } else {
        const newDoctor: Doctor = {
          id: generateUniqueId(),
          name: form.name || 'Unnamed Doctor',
          email: form.email || '',
          phone: form.phone || '',
          location: form.location || '',
          bio: form.bio || '',
          specializations: form.specializations as string[] || [],
          experience: form.experience || 0,
          rating: form.rating || 0,
          avatar: undefined,
        };
        dispatch({ type: 'ADD_DOCTOR', payload: newDoctor });
        toast({
          title: 'Profile Created',
          description: 'New doctor profile created successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save doctor profile',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={form.name || ''}
          onChangeText={text => setForm({ ...form, name: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={form.email || ''}
          onChangeText={text => setForm({ ...form, email: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={form.phone || ''}
          onChangeText={text => setForm({ ...form, phone: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={form.location || ''}
          onChangeText={text => setForm({ ...form, location: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={form.bio || ''}
          onChangeText={text => setForm({ ...form, bio: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Specializations</Text>
        <View style={styles.badgeContainer}>
          {SPECIALIZATIONS.map(spec => {
            const isSelected = (form.specializations || []).includes(spec);
            return (
              <TouchableOpacity
                key={spec}
                onPress={() => toggleSpec(spec)}
              >
                <Badge variant={isSelected ? 'selected' : 'outline'}>
                  {spec}
                </Badge>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Show selected specializations count */}
        {(form.specializations || []).length > 0 && (
          <Text style={styles.selectedCount}>
            {(form.specializations || []).length} specialization(s) selected
          </Text>
        )}
      </View>

      <Button
        onPress={save}
        disabled={loading}
        loading={loading}
        size="lg"
      >
        Save Profile
      </Button>
    </ScrollView>
  );
};

export default DoctorProfileForm;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
  },
  inputGroup: {
    marginBottom: spacing.lg,
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.base,
    backgroundColor: colors.gray[50],
    color: colors.gray[900],
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  selectedCount: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: fontWeight.medium,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
