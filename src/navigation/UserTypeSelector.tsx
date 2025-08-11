import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Heart, Stethoscope, LogOut } from 'lucide-react-native';

interface UserTypeSelectorProps {
  onSelectUserType: (userType: 'doctor' | 'petowner') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onSelectUserType }) => {
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'petowner' | null>(null);

  const handleSelect = (role: 'doctor' | 'petowner') => {
    setSelectedRole(role);
    onSelectUserType(role);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Heart size={32} color="#2563eb" />
          </View>
          <Text style={styles.title}>PetCare Practice</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        {/* Role Selection Cards */}
        <View style={styles.cardContainer}>

          {/* Doctor Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'doctor' && styles.selectedCard
            ]}
            onPress={() => handleSelect('doctor')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.doctorIconWrapper}>
                <Stethoscope size={24} color="#2563eb" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.roleTitle}>I'm a Doctor</Text>
                <Text style={styles.roleDescription}>
                  Manage your schedule and appointments
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Pet Owner Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'petowner' && styles.selectedCard
            ]}
            onPress={() => handleSelect('petowner')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.ownerIconWrapper}>
                <Heart size={24} color="#2563eb" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.roleTitle}>I'm a Pet Owner</Text>
                <Text style={styles.roleDescription}>
                  Book appointments for your pets
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your choice will customize your experience
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#eff6ff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  cardContainer: {
    gap: 16,
    marginBottom: 32,
  },
  roleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 2px 3.84px rgba(0, 0, 0, 0.1)',
    // Keep individual shadow properties for native platforms
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    borderColor: '#2563eb',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  doctorIconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ownerIconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: '#fef3f2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default UserTypeSelector;
