import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorFilter from '../screens/Owner/DoctorDirectory';
import { BookingModal } from '../screens/Owner/BookingModal';
import PetOwnerDashboard from '../screens/Owner/PetOwnerDashboard';

const Stack = createNativeStackNavigator();

const OwnerNavigator = () => {
  // State to control BookingModal visibility and selected doctor data
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  // Function to open the booking modal with a given doctor
  const openModal = (doctor: any) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  // Function to close the booking modal
  const closeModal = () => {
    setSelectedDoctor(null);
    setModalVisible(false);
  };

  // Wrap DoctorFilter to pass openModal function via props or context as needed
  // Here you may create a wrapper or use React Context to provide `openModal`
  // For simplicity, assuming DoctorFilter can accept openModal as a prop
  const DoctorFilterWrapper = (props: any) => (
    <DoctorFilter {...props} openBookingModal={openModal} />
  );

  return (
   <Stack.Navigator initialRouteName="PetOwnerDashboard">
  <Stack.Screen name="DoctorFilter" component={DoctorFilterWrapper} />
  <Stack.Screen name="BookingModal">
    {(props) =>
      modalVisible ? (
        <BookingModal
          {...props}
          doctor={selectedDoctor}
          isOpen={modalVisible}
          onClose={closeModal}
        />
      ) : null
    }
  </Stack.Screen>
  <Stack.Screen name="PetOwnerDashboard" component={PetOwnerDashboard} options={{ headerShown: false }} />
</Stack.Navigator>

  );
};

export default OwnerNavigator;

