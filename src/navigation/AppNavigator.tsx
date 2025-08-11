// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DoctorNavigator from './DoctorNavigator';
import OwnerNavigator from './OwnerNavigator';
import UserTypeSelector from './UserTypeSelector';
import { useApp } from '../context/AppContext';
import { sampleDoctors, samplePetOwner, generateSampleTimeSlots } from '../utils/sampleData';
import { UserType } from '../models/types';

const AppNavigator = () => {
  const { state, dispatch } = useApp();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sample data when app starts
  useEffect(() => {
    if (!isInitialized && state.doctors.length === 0) {
      // Clear any existing time slots to prevent duplicates
      dispatch({ type: 'CLEAR_TIME_SLOTS' });
      
      // Add sample doctors
      sampleDoctors.forEach(doctor => {
        dispatch({ type: 'ADD_DOCTOR', payload: doctor });
      });

      // Add sample pet owner
      dispatch({ type: 'ADD_PET_OWNER', payload: samplePetOwner });

      // Add sample time slots with a small delay to ensure clear operation completes
      setTimeout(() => {
        const timeSlots = generateSampleTimeSlots();
        dispatch({ type: 'ADD_TIME_SLOTS', payload: timeSlots });
      }, 100);

      setIsInitialized(true);
    }
  }, [dispatch, state.doctors.length, isInitialized]);

  const handleSelectUserType = (role: 'doctor' | 'petowner') => {
    if (role === 'doctor') {
      dispatch({ type: 'SET_USER', payload: { userType: 'doctor', userId: sampleDoctors[0].id } });
    } else {
      dispatch({ type: 'SET_USER', payload: { userType: 'petowner', userId: samplePetOwner.id } });
    }
  };

  // Always show UserTypeSelector first, regardless of saved state
  if (!state.currentUserType || !state.currentUserId) {
    return <UserTypeSelector onSelectUserType={handleSelectUserType} />;
  }

  return (
    <NavigationContainer>
      {state.currentUserType === 'doctor' ? <DoctorNavigator /> : <OwnerNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
