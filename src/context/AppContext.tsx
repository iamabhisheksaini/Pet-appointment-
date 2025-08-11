// AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doctor, PetOwner, Appointment, TimeSlot, Schedule, Pet, UserType } from '../models/types';

interface AppState {
  currentUserType: UserType | null;
  currentUserId: string | null;
  doctors: Doctor[];
  petOwners: PetOwner[];
  appointments: Appointment[];
  timeSlots: TimeSlot[];
  schedules: Schedule[];
}

type AppAction =
  | { type: 'SET_USER'; payload: { userType: UserType; userId: string } }
  | { type: 'ADD_DOCTOR'; payload: Doctor }
  | { type: 'UPDATE_DOCTOR'; payload: { id: string; updates: Partial<Doctor> } }
  | { type: 'DELETE_DOCTOR'; payload: string }
  | { type: 'ADD_PET_OWNER'; payload: PetOwner }
  | { type: 'UPDATE_PET_OWNER'; payload: { id: string; updates: Partial<PetOwner> } }
  | { type: 'ADD_PET'; payload: { ownerId: string; pet: Pet } }
  | { type: 'UPDATE_PET'; payload: { ownerId: string; petId: string; updates: Partial<Pet> } }
  | { type: 'DELETE_PET'; payload: { ownerId: string; petId: string } }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: { id: string; updates: Partial<Appointment> } }
  | { type: 'ADD_TIME_SLOTS'; payload: TimeSlot[] }
  | { type: 'CLEAR_TIME_SLOTS'; payload?: void }
  | { type: 'UPDATE_TIME_SLOT'; payload: { id: string; updates: Partial<TimeSlot> } }
  | { type: 'UPSERT_SCHEDULES'; payload: { doctorId: string; schedules: Schedule[] } }
  | { type: 'LOAD_DATA'; payload: AppState }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  currentUserType: null,
  currentUserId: null,
  doctors: [],
  petOwners: [],
  appointments: [],
  timeSlots: [],
  schedules: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER': {
      // Ensure pet owner exists when logging in as a pet owner
      if (action.payload.userType === 'petowner') {
        const exists = state.petOwners.find(p => p.id === action.payload.userId);
        if (!exists) {
          return {
            ...state,
            currentUserType: action.payload.userType,
            currentUserId: action.payload.userId,
            petOwners: [
              ...state.petOwners,
              { id: action.payload.userId, pets: [], name: '', phone: '', email: '', address: '' }
            ]
          };
        }
      }
      return { ...state, currentUserType: action.payload.userType, currentUserId: action.payload.userId };
    }

    case 'ADD_PET_OWNER':
      return { ...state, petOwners: [...state.petOwners, action.payload] };

    case 'UPDATE_PET_OWNER':
      return {
        ...state,
        petOwners: state.petOwners.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p),
      };

    case 'ADD_PET': {
      const ownerExists = state.petOwners.find(o => o.id === action.payload.ownerId);
      if (!ownerExists) {
        return {
          ...state,
          petOwners: [
            ...state.petOwners,
            { id: action.payload.ownerId, pets: [action.payload.pet], name: '', phone: '', email: '', address: '' }
          ]
        };
      }
      return {
        ...state,
        petOwners: state.petOwners.map(owner =>
          owner.id === action.payload.ownerId
            ? { ...owner, pets: [...owner.pets, action.payload.pet] }
            : owner
        ),
      };
    }

    case 'UPDATE_PET':
      return {
        ...state,
        petOwners: state.petOwners.map(owner =>
          owner.id === action.payload.ownerId
            ? {
                ...owner,
                pets: owner.pets.map(pet =>
                  pet.id === action.payload.petId
                    ? { ...pet, ...action.payload.updates }
                    : pet
                ),
              }
            : owner
        ),
      };

    case 'DELETE_PET':
      return {
        ...state,
        petOwners: state.petOwners.map(owner =>
          owner.id === action.payload.ownerId
            ? { ...owner, pets: owner.pets.filter(pet => pet.id !== action.payload.petId) }
            : owner
        ),
      };

    // Other cases unchanged
    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, action.payload] };

    case 'UPDATE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.map(d => d.id === action.payload.id ? { ...d, ...action.payload.updates } : d),
      };

    case 'DELETE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.filter(d => d.id !== action.payload),
      };

    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };

    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt => apt.id === action.payload.id ? { ...apt, ...action.payload.updates } : apt),
      };

    case 'ADD_TIME_SLOTS':
      // Filter out duplicate slots by ID to prevent duplicate key errors
      const existingSlotIds = new Set(state.timeSlots.map(slot => slot.id));
      const newSlots = action.payload.filter(slot => !existingSlotIds.has(slot.id));
      return { ...state, timeSlots: [...state.timeSlots, ...newSlots] };

    case 'CLEAR_TIME_SLOTS':
      return { ...state, timeSlots: [] };

    case 'UPDATE_TIME_SLOT':
      return {
        ...state,
        timeSlots: state.timeSlots.map(slot => slot.id === action.payload.id ? { ...slot, ...action.payload.updates } : slot),
      };

    case 'UPSERT_SCHEDULES': {
      const { doctorId, schedules } = action.payload;
      const others = state.schedules.filter(s => s.doctorId !== doctorId);
      return { ...state, schedules: [...others, ...schedules] };
    }

    case 'LOAD_DATA':
      return { ...initialState, ...action.payload };

    case 'LOGOUT':
      return { ...state, currentUserType: null, currentUserId: null };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem('petPracticeData');
        if (saved) {
          const parsed = JSON.parse(saved);
          
          // Clean duplicate time slots if they exist
          if (parsed.timeSlots) {
            const uniqueSlots = new Map();
            parsed.timeSlots.forEach((slot: TimeSlot) => {
              // Create a unique key based on doctor, date, time, and specialization
              const key = `${slot.doctorId}-${slot.date}-${slot.startTime}-${slot.specialization || 'none'}`;
              if (!uniqueSlots.has(key)) {
                uniqueSlots.set(key, slot);
              }
            });
            parsed.timeSlots = Array.from(uniqueSlots.values());
          }
          
          dispatch({ type: 'LOAD_DATA', payload: parsed });
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('petPracticeData', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
