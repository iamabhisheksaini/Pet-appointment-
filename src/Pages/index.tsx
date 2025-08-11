import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import UserTypeSelector from '../navigation/UserTypeSelector';
import DoctorDashboard from '../screens/Doctor/DoctorDashboard';
import { sampleDoctors, samplePetOwner, generateSampleTimeSlots } from '../utils/sampleData';
import { View } from 'react-native';

function AppContent() {
  const { state, dispatch } = useApp();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && state.doctors.length === 0) {
      sampleDoctors.forEach(doctor => {
        dispatch({ type: 'ADD_DOCTOR', payload: doctor });
      });

      dispatch({ type: 'ADD_PET_OWNER', payload: samplePetOwner });

      const timeSlots = generateSampleTimeSlots();
      dispatch({ type: 'ADD_TIME_SLOTS', payload: timeSlots });

      setIsInitialized(true);
    }
  }, [dispatch, state.doctors.length, isInitialized]);

  const handleSelectUserType = (userType: 'doctor' | 'petowner') => {
    if (userType === 'doctor') {
      dispatch({ type: 'SET_USER', payload: { userType, userId: sampleDoctors[0].id } });
    } else {
      dispatch({ type: 'SET_USER', payload: { userType: 'petowner', userId: samplePetOwner.id } });
    }
  };

  if (!state.currentUserType) {
    return (
      <View style={{ flex: 1 }}>
        <UserTypeSelector onSelectUserType={handleSelectUserType} />
      </View>
    );
  }

  if (state.currentUserType === 'doctor') {
    return <DoctorDashboard />;
  }

  // return <PetOwnerDashboard />;
}

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
