import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Plus, Heart, Edit, Trash2, ArrowLeft } from 'lucide-react-native';
import { useToast } from '../../hooks/use-toast';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];

export function PetManagement() {
  const { toast } = useToast();
  const { state, dispatch } = useApp();

  const currentOwnerId = state.currentUserId!;
  const currentOwner = state.petOwners.find(o => o.id === currentOwnerId);
  const pets = currentOwner?.pets || [];
  const navigation = useNavigation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
  });

  const resetForm = () => {
    setFormData({ name: '', type: '', breed: '', age: '' });
    setEditingPet(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.type || !formData.breed.trim() || !formData.age) {
      toast({ title: 'Missing Information', description: 'Please fill in all fields.' });
      return;
    }

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 50) {
      toast({ title: 'Invalid Age', description: 'Please enter a valid age between 0 and 50 years.' });
      return;
    }

    const petData = {
      id: editingPet?.id || `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      type: formData.type,
      breed: formData.breed.trim(),
      age: ageNum,
      ownerId: currentOwnerId,
    };

    if (editingPet) {
      dispatch({
        type: 'UPDATE_PET',
        payload: { ownerId: currentOwnerId, petId: editingPet.id, updates: petData }
      });
      toast({ title: 'Pet Updated', description: `${petData.name} has been updated successfully.` });
    } else {
      dispatch({
        type: 'ADD_PET',
        payload: { ownerId: currentOwnerId, pet: petData }
      });
      toast({ title: 'Pet Added', description: `${petData.name} has been added to your pets.` });
    }

    resetForm();
    setShowAddModal(false);
  };

  const handleEdit = (pet: any) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age.toString(),
    });
    setShowAddModal(true);
  };

  const handleDelete = (petId: string) => {
    const petToDelete = pets.find(p => p.id === petId);
    dispatch({
      type: 'DELETE_PET',
      payload: { ownerId: currentOwnerId, petId }
    });
    toast({
      title: 'Pet Removed',
      description: petToDelete
        ? `${petToDelete.name} has been removed.`
        : 'Pet has been removed.',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <CardHeader style={styles.header}>
          <CardTitle style={styles.title}>
            <Heart size={20} />
            <Text style={styles.titleText}> My Pets ({pets.length})</Text>
          </CardTitle>

          <Button onPress={() => setShowAddModal(true)}>
            <Plus size={16} style={styles.iconMargin} />
            Add Pet
          </Button>

          <Dialog
            open={showAddModal}
            onOpenChange={(isOpen) => {
              setShowAddModal(isOpen);
              if (!isOpen) resetForm();
            }}
          >
            <DialogContent onClose={() => setShowAddModal(false)}>
              <DialogHeader>
                <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
              </DialogHeader>

              <View style={styles.formGroup}>
                <Label>Pet Name</Label>
                <Input
                  placeholder="Enter pet name"
                  value={formData.name}
                  onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.formGroup}>
                <Label>Pet Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData(prev => ({ ...prev, type: String(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PET_TYPES.map(type => (
                      <SelectItem key={type} value={type} label={type} />
                    ))}
                  </SelectContent>
                </Select>
              </View>

              <View style={styles.formGroup}>
                <Label>Breed</Label>
                <Input
                  placeholder="Enter breed"
                  value={formData.breed}
                  onChangeText={text => setFormData(prev => ({ ...prev, breed: text }))}
                />
              </View>

              <View style={styles.formGroup}>
                <Label>Age (years)</Label>
                <Input
                  placeholder="Enter age"
                  value={formData.age}
                  keyboardType="numeric"
                  onChangeText={text => setFormData(prev => ({ ...prev, age: text }))}
                />
              </View>

              <View style={styles.buttonRow}>
                <Button variant="outline" onPress={() => setShowAddModal(false)}>Cancel</Button>
                <Button onPress={handleSubmit}>{editingPet ? 'Update Pet' : 'Add Pet'}</Button>
              </View>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {pets.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={48} color="#999" />
              <Text style={styles.emptyText}>No pets registered yet.</Text>
              <Text style={styles.emptySubText}>Add your first pet to start booking appointments.</Text>
            </View>
          ) : (
            <View style={styles.petList}>
              {pets.map(pet => (
                <View key={pet.id} style={styles.petCardWrapper}>
                  <Card style={styles.petCardContainer}>
                    <CardContent style={styles.petCard}>
                      {/* Pet Header with Name and Actions */}
                      <View style={styles.petHeader}>
                        <View style={styles.petInfo}>
                          <Text style={styles.petName}>{pet.name}</Text>
                          <View style={styles.petMeta}>
                            <Badge variant="default">{pet.type}</Badge>
                            <Text style={styles.petAge}>{pet.age} years old</Text>
                          </View>
                        </View>
                        <View style={styles.actionButtons}>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onPress={() => handleEdit(pet)}
                            style={styles.actionButton}
                          >
                            <Edit size={14} color="#666" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onPress={() => handleDelete(pet.id)}
                            style={styles.actionButton}
                          >
                            <Trash2 size={14} color="#666" />
                          </Button>
                        </View>
                      </View>

                      {/* Pet Details */}
                      <View style={styles.petDetails}>
                        <Text style={styles.petBreed}>
                          <Text style={styles.breedLabel}>Breed: </Text>
                          <Text style={styles.breedValue}>{pet.breed}</Text>
                        </Text>
                      </View>

                      {/* Appointment Button */}
                      <View style={styles.appointmentButtonContainer}>
                        <Button 
                          size="sm" 
                          variant="default"
                          style={styles.appointmentButton}
                        >
                          📅 Book Appointment
                        </Button>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 8,
  },
  titleText: { 
    fontSize: 18, 
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 4,
  },
  iconMargin: { 
    marginRight: 8 
  },
  formGroup: { 
    marginBottom: 16 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 12, 
    marginTop: 20 
  },
  emptyState: { 
    alignItems: 'center', 
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyText: { 
    color: '#6b7280', 
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubText: { 
    fontSize: 14, 
    color: '#9ca3af', 
    marginTop: 8, 
    textAlign: 'center',
    lineHeight: 20,
  },
  // Change petList to column layout for better mobile experience
  petList: { 
    gap: 16,
  },
  petCardWrapper: {
    width: '100%',
  },
  petCardContainer: {
    width: '100%',
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    // Keep individual shadow properties for native platforms
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  petCard: { 
    padding: 20,
  },
  petHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  petInfo: {
    flex: 1,
    marginRight: 12,
  },
  petName: { 
    fontWeight: '700', 
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 6,
  },
  petMeta: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    flexWrap: 'wrap',
  },
  petAge: { 
    fontSize: 14, 
    color: '#6b7280',
    fontWeight: '500',
  },
  petDetails: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 8,
  },
  petBreed: { 
    fontSize: 14, 
    lineHeight: 20,
  },
  breedLabel: {
    fontWeight: '600',
    color: '#374151',
  },
  breedValue: {
    color: '#6b7280',
    fontWeight: '400',
  },
  appointmentButtonContainer: { 
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1, 
    borderTopColor: '#f3f4f6',
  },
  appointmentButton: {
    width: '100%',
  },
  actionButtons: { 
    flexDirection: 'row', 
    gap: 8,
    alignItems: 'flex-start',
  },
  actionButton: {
    minWidth: 40,
    paddingHorizontal: 8,
  },
});
