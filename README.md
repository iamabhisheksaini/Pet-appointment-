# React Native Veterinary Appointment Booking App

A comprehensive React Native application for managing veterinary appointments, built with Expo and TypeScript.

## Features

### For Veterinarians
- **Dashboard** with appointment statistics and quick actions
- **Profile Management** - Edit doctor information, specializations, experience
- **Schedule Configuration** - Set available days/times, slot durations, specializations
- **Appointment Management** - View and manage all appointments
- **Time Slot Generation** - Automatically generate available time slots

### For Pet Owners
- **Pet Management** - Add, edit, delete pet records (name, breed, age, type)
- **Doctor Directory** - Search and filter doctors by specialization and availability
- **Appointment Booking** - Multi-step booking process (select pet → select time → add notes)
- **Appointment History** - View upcoming and past appointments
- **Dashboard** - Overview of pets and appointments

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-native-appointment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Option 1: Using the safe-start script (Recommended)
```bash
npm run safe-start
```

### Option 2: Using the bash script
```bash
./start-app.sh
```

### Option 3: Standard start (may cause console parse errors on some systems)
```bash
npm start
```

## Accessing the Application

Once started, you can access the app via:

- **Web**: `http://localhost:8081`
- **Mobile**: Scan the QR code with Expo Go app
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal

## Platform Compatibility

### Web
- ✅ Full functionality with web-compatible time inputs
- ✅ All UI components work properly
- ✅ No DateTimePicker compatibility issues

### Mobile (iOS/Android)
- ✅ Native time picker modals for intuitive time selection
- ✅ Touch-optimized interface
- ✅ Full DateTimePicker functionality

## Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: useReducer + Context API with AsyncStorage persistence
- **Navigation**: @react-navigation/native with stack navigators
- **UI Components**: Custom components with consistent styling
- **Icons**: Lucide React Native
- **Date/Time**: Modal datetime picker with web fallback

## Troubleshooting

### Zsh Parse Errors
If you encounter `zsh: parse error near ')'`, use one of the safe start methods:

1. **Use safe-start script**: `npm run safe-start`
2. **Use bash script**: `./start-app.sh`

These methods prevent zsh from interpreting React Navigation console warnings as shell commands.

### Web Compatibility
- DateTimePicker automatically falls back to TextInput on web
- All shadow styles are handled appropriately for web compatibility
- Console warnings from React Navigation are filtered to prevent parsing issues

### TypeScript
Run type checking with:
```bash
npx tsc --noEmit
```

### Clear Data
If you need to reset the app data:
```javascript
import { clearAllData } from './src/utils/debugUtils';
await clearAllData();
```

## Project Structure

```
src/
├── components/ui/          # Reusable UI components
├── context/               # React Context for state management
├── hooks/                 # Custom hooks (toast, etc.)
├── models/                # TypeScript type definitions
├── navigation/            # Navigation setup and navigators
├── screens/               # Screen components
│   ├── Doctor/           # Doctor-specific screens
│   └── Owner/            # Pet owner-specific screens
├── utils/                # Utility functions and sample data
└── types/                # Type definitions
```

## Key Features Implemented

- [x] User role selection (Doctor/Pet Owner)
- [x] Doctor profile management
- [x] Schedule configuration with time slots
- [x] Pet management for owners
- [x] Doctor directory with search and filtering
- [x] Multi-step appointment booking
- [x] Cross-platform compatibility (Web/iOS/Android)
- [x] Data persistence with AsyncStorage
- [x] TypeScript throughout
- [x] Duplicate key error prevention
- [x] Web compatibility for DateTimePicker
- [x] Console warning filtering

## Development Notes

- The app uses a custom console filter to suppress React Navigation deprecation warnings that can cause zsh parse errors
- Time slot generation includes unique ID creation to prevent React key conflicts
- Platform-specific rendering ensures optimal UX on both web and mobile
- AsyncStorage is used for data persistence with automatic cleanup of duplicates
