import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Debug utility to clear all stored data
 * Useful for testing or when encountering data conflicts
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('petPracticeData');
    console.log('All stored data cleared successfully');
  } catch (error) {
    console.error('Error clearing stored data:', error);
  }
};

/**
 * Debug utility to log current stored data
 */
export const logStoredData = async (): Promise<void> => {
  try {
    const saved = await AsyncStorage.getItem('petPracticeData');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('Stored data:', {
        doctors: parsed.doctors?.length || 0,
        petOwners: parsed.petOwners?.length || 0,
        appointments: parsed.appointments?.length || 0,
        timeSlots: parsed.timeSlots?.length || 0,
        schedules: parsed.schedules?.length || 0,
      });
    } else {
      console.log('No stored data found');
    }
  } catch (error) {
    console.error('Error reading stored data:', error);
  }
};
