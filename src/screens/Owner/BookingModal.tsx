import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Calendar, Clock, CheckCircle } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { Doctor } from "../../models/types";
import { useToast } from "../../hooks/use-toast";
import { Text } from "react-native";

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ doctor, isOpen, onClose }: BookingModalProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();

  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<"select-pet" | "select-slot" | "details" | "success">("select-pet");

  const currentPetOwner = state.petOwners.find(p => p.id === state.currentUserId);
  const availableSlots = state.timeSlots
    .filter(slot =>
      slot.doctorId === doctor.id &&
      slot.isAvailable &&
      new Date(slot.date) >= new Date()
    )
    .sort((a, b) => new Date(a.date + " " + a.startTime).getTime() - new Date(b.date + " " + b.startTime).getTime());

  const handleBookAppointment = () => {
    if (!selectedPetId || !selectedSlotId || !reason.trim()) return;

    const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newAppointment = {
      id: appointmentId,
      doctorId: doctor.id,
      petOwnerId: state.currentUserId!,
      petId: selectedPetId,
      slotId: selectedSlotId,
      reason: reason.trim(),
      status: "scheduled" as const,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_APPOINTMENT", payload: newAppointment });
    dispatch({
      type: "UPDATE_TIME_SLOT",
      payload: { id: selectedSlotId, updates: { isAvailable: false } }
    });

    setStep("success");
    toast({
      title: "Appointment Booked!",
      description: `Successfully booked with Dr. ${doctor.name}`,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleClose = () => {
    setStep("select-pet");
    setSelectedPetId("");
    setSelectedSlotId("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Book Appointment with Dr. {doctor.name}</DialogTitle>
        </DialogHeader>

        {step === "select-pet" && (
          <View style={styles.section}>
            <Label>Select Pet</Label>
            <View style={{ marginTop: 8 }}>
              {currentPetOwner?.pets.map(pet => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.card,
                    selectedPetId === pet.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petDetails}>
                    {pet.type} • {pet.breed} • {pet.age} years old
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.rowEnd}>
              <Button variant="outline" onPress={handleClose}>Cancel</Button>
              <Button onPress={() => setStep("select-slot")} disabled={!selectedPetId}>Next</Button>
            </View>
          </View>
        )}

        {step === "select-slot" && (
          <View style={styles.section}>
            <Label>Select Time Slot</Label>
            <ScrollView style={{ maxHeight: 240 }}>
              {availableSlots.map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.card,
                    selectedSlotId === slot.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedSlotId(slot.id)}
                >
                  <View style={styles.rowBetween}>
                    <View>
                      <View style={styles.row}>
                        <Calendar size={16} />
                        <Text>{formatDate(slot.date)}</Text>
                      </View>
                      <View style={styles.row}>
                        <Clock size={16} />
                        <Text>{slot.startTime} - {slot.endTime}</Text>
                      </View>
                    </View>
                    {slot.specialization && (
                      <Badge variant="outline">{slot.specialization}</Badge>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.rowEnd}>
              <Button variant="outline" onPress={() => setStep("select-pet")}>Back</Button>
              <Button onPress={() => setStep("details")} disabled={!selectedSlotId}>Next</Button>
            </View>
          </View>
        )}

        {step === "details" && (
          <View style={styles.section}>
            <Label>Reason for Visit</Label>
            <Textarea
              placeholder="Describe the reason for this appointment..."
              value={reason}
              onChangeText={setReason}
              style={{ marginTop: 8 }}
            />
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
              <Text>Pet: {currentPetOwner?.pets.find(p => p.id === selectedPetId)?.name}</Text>
              <Text>Doctor: Dr. {doctor.name}</Text>
              <Text>Date: {availableSlots.find(s => s.id === selectedSlotId) && formatDate(availableSlots.find(s => s.id === selectedSlotId)!.date)}</Text>
              <Text>Time: {availableSlots.find(s => s.id === selectedSlotId)?.startTime} - {availableSlots.find(s => s.id === selectedSlotId)?.endTime}</Text>
            </View>
            <View style={styles.rowEnd}>
              <Button variant="outline" onPress={() => setStep("select-slot")}>Back</Button>
              <Button onPress={handleBookAppointment} disabled={!reason.trim()}>Book Appointment</Button>
            </View>
          </View>
        )}

        {step === "success" && (
          <View style={{ alignItems: "center", gap: 16 }}>
            <CheckCircle size={64} color="green" />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Appointment Booked!</Text>
            <Text>Your appointment has been successfully scheduled.</Text>
            <Button onPress={handleClose} style={{ width: "100%" }}>Done</Button>
          </View>
        )}
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12
  },
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8
  },
  selectedCard: {
    borderColor: "#007bff",
    backgroundColor: "#e6f0ff"
  },
  petName: {
    fontWeight: "600"
  },
  petDetails: {
    fontSize: 12,
    color: "#555"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rowEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8
  },
  summary: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8
  },
  summaryTitle: {
    fontWeight: "600",
    marginBottom: 4
  }
});
