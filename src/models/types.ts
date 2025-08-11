// src/types/types.ts

export type UserType = 'doctor' | 'petowner';
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserType;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  ownerId: string;
}

export interface Doctor {
  id: string;
  name: string;
  specializations: string[];
  experience: number;
  rating: number;
  location: string;
  phone: string;
  email: string;
  avatar?: string;
  bio: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  specialization?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  petOwnerId: string;
  petId: string;
  slotId: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface PetOwner {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  pets: Pet[];
}

export interface Schedule {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  specializations: string[];
  isRecurring: boolean;
}
