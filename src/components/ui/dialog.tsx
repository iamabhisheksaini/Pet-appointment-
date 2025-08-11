import React, { useState, forwardRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { X } from "lucide-react-native";

// Root
const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode; }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={() => onOpenChange(false)}
    >
      {children}
    </Modal>
  );
};
Dialog.displayName = "Dialog";

// Trigger — in RN, just call onOpenChange(true)
const DialogTrigger = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
  <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
);
DialogTrigger.displayName = "DialogTrigger";

// Overlay
const DialogOverlay = forwardRef<View, { style?: ViewStyle; onPress?: () => void }>(
  ({ style, onPress }, ref) => (
    <TouchableOpacity
      ref={ref}
      activeOpacity={1}
      onPress={onPress}
      style={[styles.overlay, style]}
    />
  )
);
DialogOverlay.displayName = "DialogOverlay";

// Content
const DialogContent = forwardRef<View, { style?: ViewStyle; onClose: () => void; children: React.ReactNode }>(
  ({ style, onClose, children }, ref) => (
    <View style={styles.centeredView}>
      <View ref={ref} style={[styles.content, style]}>
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
        >
          <X size={16} color="#000" />
        </TouchableOpacity>
        {children}
      </View>
    </View>
  )
);
DialogContent.displayName = "DialogContent";

// Header
const DialogHeader = ({ style, children }: { style?: ViewStyle; children: React.ReactNode }) => (
  <View style={[styles.header, style]}>{children}</View>
);
DialogHeader.displayName = "DialogHeader";

// Footer
const DialogFooter = ({ style, children }: { style?: ViewStyle; children: React.ReactNode }) => (
  <View style={[styles.footer, style]}>{children}</View>
);
DialogFooter.displayName = "DialogFooter";

// Title
const DialogTitle = forwardRef<Text, { style?: TextStyle; children?: React.ReactNode }>(
  ({ style, children }, ref) => (
    <Text ref={ref} style={[styles.title, style]}>{children}</Text>
  )
);
DialogTitle.displayName = "DialogTitle";

// Description
const DialogDescription = forwardRef<Text, { style?: TextStyle; children?: React.ReactNode }>(
  ({ style, children }, ref) => (
    <Text ref={ref} style={[styles.description, style]}>{children}</Text>
  )
);
DialogDescription.displayName = "DialogDescription";

// Close
const DialogClose = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
  <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
);
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

// ---- Styles mapped from Tailwind ----
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.8)", // bg-black/80
    zIndex: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
    maxWidth: 400, // max-w-lg
    backgroundColor: "#fff", // bg-background
    borderRadius: 8,
    padding: 24, // p-6
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    // Keep individual shadow properties for native platforms
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#e5e7eb",
    zIndex: 50,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
    borderRadius: 4,
    opacity: 0.7,
  },
  header: {
    flexDirection: "column",
    marginBottom: 12,
    textAlign: "center",
  },
  footer: {
    flexDirection: "column-reverse",
    marginTop: 12,
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: "600",
    lineHeight: 24,
  },
  description: {
    fontSize: 14, // text-sm
    color: "#6b7280",
    marginTop: 4,
  },
});
