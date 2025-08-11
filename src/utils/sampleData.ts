import { Doctor, PetOwner, TimeSlot } from '../models/types';

export const sampleDoctors: Doctor[] = [
  {
    id: 'dr1',
    name: 'Sarah Johnson',
    specializations: ['General Checkup', 'Vaccination', 'Dental Care'],
    experience: 8,
    rating: 4.8,
    location: 'Downtown Veterinary Clinic',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@vetclinic.com',
    bio: 'Dr. Johnson is a compassionate veterinarian with 8 years of experience in general practice and preventive care. She specializes in routine checkups and dental health.'
  },
  {
    id: 'dr2',
    name: 'Michael Chen',
    specializations: ['Surgery', 'Emergency Care', 'Orthopedics'],
    experience: 12,
    rating: 4.9,
    location: 'City Animal Hospital',
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@cityvet.com',
    bio: 'Dr. Chen is a skilled surgeon with extensive experience in emergency veterinary medicine and orthopedic procedures. Available for complex cases.'
  },
  {
    id: 'dr3',
    name: 'Emily Rodriguez',
    specializations: ['Skin Conditions', 'Behavioral Issues', 'General Checkup'],
    experience: 6,
    rating: 4.7,
    location: 'Pet Wellness Center',
    phone: '+1 (555) 345-6789',
    email: 'emily.rodriguez@petwellness.com',
    bio: 'Dr. Rodriguez focuses on dermatology and animal behavior. She takes a holistic approach to pet wellness and specializes in skin conditions.'
  },
  {
    id: 'dr4',
    name: 'Robert Kim',
    specializations: ['Grooming', 'Dental Care', 'General Checkup'],
    experience: 5,
    rating: 4.6,
    location: 'Neighborhood Pet Care',
    phone: '+1 (555) 456-7890',
    email: 'robert.kim@petcare.com',
    bio: 'Dr. Kim provides comprehensive pet care services including grooming and dental care in a comfortable, friendly environment.'
  },
];

export const samplePetOwner: PetOwner = {
  id: 'owner1',
  name: 'John Smith',
  phone: '+1 (555) 987-6543',
  email: 'john.smith@email.com',
  address: '123 Main Street, Anytown, State 12345',
  pets: [
    {
      id: 'pet1',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      ownerId: 'owner1'
    },
    {
      id: 'pet2',
      name: 'Whiskers',
      type: 'Cat',
      breed: 'Persian',
      age: 2,
      ownerId: 'owner1'
    }
  ]
};

export function generateSampleTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();

  sampleDoctors.forEach((doctor, doctorIndex) => {
    for (let day = 1; day <= 14; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);

      if (doctorIndex % 2 === 0 && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }

      const dateStr = date.toISOString().split('T')[0];

      const morningSlots = [
        { start: '09:00', end: '09:30' },
        { start: '09:30', end: '10:00' },
        { start: '10:00', end: '10:30' },
        { start: '10:30', end: '11:00' },
        { start: '11:00', end: '11:30' },
        { start: '11:30', end: '12:00' },
      ];

      const afternoonSlots = [
        { start: '14:00', end: '14:30' },
        { start: '14:30', end: '15:00' },
        { start: '15:00', end: '15:30' },
        { start: '15:30', end: '16:00' },
        { start: '16:00', end: '16:30' },
        { start: '16:30', end: '17:00' },
        { start: '17:00', end: '17:30' },
        { start: '17:30', end: '18:00' },
      ];

      const allSlots = [...morningSlots, ...afternoonSlots];

      allSlots.forEach((timeSlot, index) => {
        const specializationIndex = index % doctor.specializations.length;
        const specialization = doctor.specializations[specializationIndex];
        
        // Generate unique ID that includes all relevant information
        const uniqueId = `slot-${doctor.id}-${dateStr}-${timeSlot.start}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        slots.push({
          id: uniqueId,
          doctorId: doctor.id,
          date: dateStr,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          isAvailable: Math.random() > 0.3,
          specialization: Math.random() > 0.5 ? specialization : undefined,
        });
      });
    }
  });

  return slots;
}