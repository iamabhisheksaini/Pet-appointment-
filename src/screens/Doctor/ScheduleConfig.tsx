import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Plus, X, Loader2 } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { TimeSlot, Schedule } from '../../models/types';
import { useToast } from '../../hooks/use-toast';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';


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

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export function ScheduleConfig() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();

  const [selectedDays, setSelectedDays] = useState<number[]>([1]); // Monday default
  const [dayRanges, setDayRanges] = useState<Record<number, { startTime: string; endTime: string }[]>>({
    1: [{ startTime: '09:00', endTime: '17:00' }],
  });
  const [slotDuration, setSlotDuration] = useState(30);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fix: Changed 'start' | 'end' to 'startTime' | 'endTime'
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'startTime' | 'endTime'>('startTime');
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const [activeRangeIndex, setActiveRangeIndex] = useState<number | null>(null);

  // Parse "HH:mm" string to Date (arbitrary date for calculations)
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(2024, 0, 1, hours, minutes, 0);
  };

  // Format Date object to "HH:mm" string
  const formatTime = (date: Date) => {
    const padded = (num: number) => (num < 10 ? '0' + num : num.toString());
    return `${padded(date.getHours())}:${padded(date.getMinutes())}`;
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => {
      const exists = prev.includes(dayIndex);
      const next = exists ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex];
      if (!exists && !dayRanges[dayIndex]) {
        setDayRanges((d) => ({ ...d, [dayIndex]: [{ startTime: '09:00', endTime: '17:00' }] }));
      }
      return next.sort();
    });
  };

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const addRange = (dayIndex: number) => {
    setDayRanges((prev) => ({
      ...prev,
      [dayIndex]: [...(prev[dayIndex] || []), { startTime: '09:00', endTime: '17:00' }],
    }));
  };

  const removeRange = (dayIndex: number, idx: number) => {
    setDayRanges((prev) => ({
      ...prev,
      [dayIndex]: (prev[dayIndex] || []).filter((_, i) => i !== idx),
    }));
  };

  const updateRange = (dayIndex: number, idx: number, field: 'startTime' | 'endTime', value: string) => {
    setDayRanges((prev) => {
      const ranges = [...(prev[dayIndex] || [])];
      ranges[idx] = { ...ranges[idx], [field]: value };
      return { ...prev, [dayIndex]: ranges };
    });
  };

  // Show time picker modal for given day and range
  // Updated parameter type for mode to 'startTime' | 'endTime'
  const showTimePicker = (dayIndex: number, rangeIdx: number, mode: 'startTime' | 'endTime') => {
    setActiveDayIndex(dayIndex);
    setActiveRangeIndex(rangeIdx);
    setTimePickerMode(mode);
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
    setActiveDayIndex(null);
    setActiveRangeIndex(null);
  };

  // Handler when time is picked
  const handleConfirmTime = (date: Date) => {
    if (activeDayIndex === null || activeRangeIndex === null) {
      hideTimePicker();
      return;
    }
    const timeString = formatTime(date);
    updateRange(activeDayIndex, activeRangeIndex, timePickerMode, timeString);
    hideTimePicker();
  };

  const generateTimeSlots = () => {
    if (!state.currentUserId) return;

    setIsGenerating(true);

    try {
      // Clear existing time slots for this doctor to prevent duplicates
      const currentSlots = state.timeSlots.filter(slot => slot.doctorId !== state.currentUserId);
      dispatch({ type: 'CLEAR_TIME_SLOTS' });
      if (currentSlots.length > 0) {
        dispatch({ type: 'ADD_TIME_SLOTS', payload: currentSlots });
      }
      
      const slots: TimeSlot[] = [];
      const schedules: Schedule[] = [];

      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dow = date.getDay();
        if (!selectedDays.includes(dow)) continue;

        const ranges = dayRanges[dow] || [];
        const dateStr = date.toISOString().split('T')[0];

        ranges.forEach((range) => {
          // Save recurring schedule template
          schedules.push({
            doctorId: state.currentUserId!,
            dayOfWeek: dow,
            startTime: range.startTime,
            endTime: range.endTime,
            slotDuration,
            specializations: selectedSpecs,
            isRecurring: true,
          });

          let currentTime = new Date(`2024-01-01T${range.startTime}:00`);
          const end = new Date(`2024-01-01T${range.endTime}:00`);

          while (currentTime < end) {
            const timeStr = formatTime(currentTime);
            const endTimeSlot = new Date(currentTime.getTime() + slotDuration * 60000);
            const endTimeStr = formatTime(endTimeSlot);

            if (selectedSpecs.length > 0) {
              selectedSpecs.forEach((spec, specIndex) => {
                // Generate truly unique ID with timestamp and random component
                const uniqueId = `${state.currentUserId}-${dateStr}-${timeStr}-${spec}-${specIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                slots.push({
                  id: uniqueId,
                  doctorId: state.currentUserId!,
                  date: dateStr,
                  startTime: timeStr,
                  endTime: endTimeStr,
                  isAvailable: true,
                  specialization: spec,
                });
              });
            } else {
              // Generate unique ID even for slots without specialization
              const uniqueId = `${state.currentUserId}-${dateStr}-${timeStr}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              slots.push({
                id: uniqueId,
                doctorId: state.currentUserId!,
                date: dateStr,
                startTime: timeStr,
                endTime: endTimeStr,
                isAvailable: true,
              });
            }

            currentTime = endTimeSlot;
          }
        });
      }

      dispatch({ type: 'ADD_TIME_SLOTS', payload: slots });
      dispatch({ type: 'UPSERT_SCHEDULES', payload: { doctorId: state.currentUserId!, schedules } });
      toast({
        title: 'Schedule Updated',
        description: `Generated ${slots.length} time slots across ${selectedDays.length} day(s).`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configure Your Schedule</Text>

      <Text style={styles.label}>Available Days</Text>
      <View style={styles.daysGrid}>
        {DAYS_OF_WEEK.map((day, index) => (
          <View key={index} style={styles.dayItem}>
            <Text>{day}</Text>
            <Switch
              value={selectedDays.includes(index)}
              onValueChange={() => toggleDay(index)}
            />
          </View>
        ))}
      </View>

      <Text style={styles.label}>Slot Duration (minutes)</Text>
      <View style={styles.slotDurationContainer}>
        {[15, 30, 45, 60].map((min) => (
          <TouchableOpacity
            key={min}
            style={[
              styles.slotDurationButton,
              slotDuration === min && styles.slotDurationButtonActive,
            ]}
            onPress={() => setSlotDuration(min)}
          >
            <Text
              style={[
                styles.slotDurationText,
                slotDuration === min && styles.slotDurationTextActive,
              ]}
            >
              {min} mins
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Time ranges per day</Text>
      {selectedDays.length === 0 ? (
        <Text style={styles.infoText}>Select at least one day to set time ranges.</Text>
      ) : (
        selectedDays.map((dayIndex) => (
          <View key={dayIndex} style={styles.dayRangesContainer}>
            <View style={styles.dayHeaderRow}>
              <Text style={styles.dayName}>{DAYS_OF_WEEK[dayIndex]}</Text>
              <TouchableOpacity
                style={styles.addRangeButton}
                onPress={() => addRange(dayIndex)}
              >
                <Plus size={16} color="#000" />
                <Text style={styles.addRangeButtonText}>Add Range</Text>
              </TouchableOpacity>
            </View>

            {(dayRanges[dayIndex] || []).map((range, idx) => (
              <View key={idx} style={styles.rangeRow}>
                {Platform.OS === 'web' ? (
                  <>
                    <TextInput
                      style={styles.timeInput}
                      value={range.startTime}
                      placeholder="09:00"
                      onChangeText={(text) => updateRange(dayIndex, idx, 'startTime', text)}
                    />
                    <TextInput
                      style={styles.timeInput}
                      value={range.endTime}
                      placeholder="17:00"
                      onChangeText={(text) => updateRange(dayIndex, idx, 'endTime', text)}
                    />
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => showTimePicker(dayIndex, idx, 'startTime')}
                      style={styles.timeInput}
                    >
                      <Text>Start: {range.startTime}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => showTimePicker(dayIndex, idx, 'endTime')}
                      style={styles.timeInput}
                    >
                      <Text>End: {range.endTime}</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity onPress={() => removeRange(dayIndex, idx)} style={styles.removeButton}>
                  <X size={20} color="#900" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))
      )}

      <Text style={styles.label}>Specializations (optional)</Text>
      <View style={styles.specsGrid}>
        {SPECIALIZATIONS.map((spec) => {
          const selected = selectedSpecs.includes(spec);
          return (
            <TouchableOpacity
              key={spec}
              onPress={() => toggleSpecialization(spec)}
            >
              <Badge variant={selected ? 'selected' : 'outline'}>
                {spec}
              </Badge>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedSpecs.length > 0 && (
        <View style={styles.selectedSpecsContainer}>
          <Text style={styles.selectedSpecsLabel}>Selected:</Text>
          {selectedSpecs.map((spec) => (
            <TouchableOpacity key={spec} onPress={() => toggleSpecialization(spec)}>
              <View style={styles.selectedBadgeWrapper}>
                <Badge variant="default">{spec}</Badge>
                <View style={styles.removeIconOverlay}>
                  <X size={12} color={colors.gray[50]} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
        onPress={generateTimeSlots}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Plus size={20} color="#fff" style={{ marginRight: 8 }} />
        )}
        <Text style={styles.generateButtonText}>
          {isGenerating ? 'Generating...' : 'Generate Time Slots'}
        </Text>
      </TouchableOpacity>

      {/* Time Picker Modal - Only render on mobile platforms */}
      {Platform.OS !== 'web' && (
        <DateTimePickerModal
          isVisible={timePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
          is24Hour={true}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
    backgroundColor: colors.gray[50],
    minHeight: '100%',
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  label: {
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.base,
    color: colors.gray[800],
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  dayItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    backgroundColor: 'white',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  slotDurationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  slotDurationButton: {
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    backgroundColor: 'white',
  },
  slotDurationButtonActive: {
    backgroundColor: colors.primary[500],
  },
  slotDurationText: {
    color: colors.primary[600],
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  slotDurationTextActive: {
    color: colors.gray[50],
    fontWeight: fontWeight.semibold,
  },
  dayRangesContainer: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayName: {
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.lg,
    color: colors.gray[800],
  },
  addRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
  },
  addRangeButtonText: {
    marginLeft: spacing.xs / 2,
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.gray[50],
    fontSize: fontSize.sm,
  },
  removeButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedSpecsContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedSpecsLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    width: '100%',
  },
  selectedBadgeWrapper: {
    position: 'relative',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  removeIconOverlay: {
    position: 'absolute',
    top: -spacing.xs / 2,
    right: -spacing.xs / 2,
    backgroundColor: colors.error[500],
    borderRadius: borderRadius.full,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButton: {
    marginTop: spacing['2xl'],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    // Use boxShadow for React Native Web compatibility

    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

    // Keep individual shadow properties for native platforms

    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonDisabled: {
    backgroundColor: colors.primary[300],
    shadowOpacity: 0.05,
    elevation: 1,
  },
  generateButtonText: {
    color: colors.gray[50],
    fontWeight: fontWeight.bold,
    fontSize: fontSize.base,
  },
  infoText: {
    fontStyle: 'italic',
    color: colors.gray[500],
    fontSize: fontSize.sm,
    textAlign: 'center',
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
});
