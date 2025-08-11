import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorDashboard from '../screens/Doctor/DoctorDashboard';
import DoctorAppointments from '../screens/Doctor/DoctorAppointments';

const Stack = createNativeStackNavigator();

const DoctorNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
      <Stack.Screen name="DoctorAppointments" component={DoctorAppointments} />
      
    </Stack.Navigator>
  );
};

export default DoctorNavigator;
