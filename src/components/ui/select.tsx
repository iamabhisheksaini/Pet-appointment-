import React, { createContext, useContext, useState, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, LayoutRectangle } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

type SelectContextType = {
  selectedValue: string | null;
  setSelectedValue: (value: string) => void;
  selectedLabel: string | null;
  setSelectedLabel: (label: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLayout: LayoutRectangle | null;
  setTriggerLayout: (layout: LayoutRectangle) => void;
};

const SelectContext = createContext<SelectContextType | null>(null);

export const Select = ({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (value: string) => void }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);

  return (
    <SelectContext.Provider
      value={{
        selectedValue: value,
        setSelectedValue: onValueChange,
        selectedLabel,
        setSelectedLabel,
        open,
        setOpen,
        triggerLayout,
        setTriggerLayout
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen, setTriggerLayout } = useContext(SelectContext)!;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.trigger}
      onPress={() => setOpen(true)}
      onLayout={(e) => setTriggerLayout(e.nativeEvent.layout)}
    >
      {children}
      <ChevronDown size={18} color="#555" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
};

export const SelectValue = ({ placeholder }: { placeholder: string }) => {
  const { selectedLabel, selectedValue } = useContext(SelectContext)!;
  const displayText = selectedLabel || selectedValue || placeholder;
  const isPlaceholder = !selectedLabel && !selectedValue;
  
  return (
    <Text style={[styles.selectValueText, isPlaceholder && styles.placeholderText]}>
      {displayText}
    </Text>
  );
};

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
  const { open, setOpen, triggerLayout } = useContext(SelectContext)!;
  const listRef = useRef<FlatList>(null);

  if (!open) return null;

  return (
    <Modal visible={open} transparent animationType="fade">
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => setOpen(false)}
      >
        {/* Center the dropdown in the modal */}
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.dropdown,
              triggerLayout && triggerLayout.width > 0 
                ? { width: Math.max(triggerLayout.width, 200) }
                : { width: 200 }
            ]}
            // Prevent closing when touching inside the dropdown
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select an option</Text>
              <TouchableOpacity 
                onPress={() => setOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <FlatList
              ref={listRef}
              data={React.Children.toArray(children)}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => item as React.ReactElement}
              style={styles.optionsList}
              showsVerticalScrollIndicator={true}
              bounces={false}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export const SelectItem = ({
  label,
  value
}: {
  label: string;
  value: string;
}) => {
  const { setSelectedValue, setSelectedLabel, setOpen, selectedValue } =
    useContext(SelectContext)!;

  const handlePress = () => {
    setSelectedValue(value);
    setSelectedLabel(label);
    setOpen(false);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.item,
        selectedValue === value && styles.itemSelected
      ]}
    >
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    minHeight: 44,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxWidth: "90%",
    maxHeight: 400,
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    // Keep individual shadow properties for native platforms
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
  },
  closeText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },
  optionsList: {
    maxHeight: 300,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  itemSelected: {
    backgroundColor: "#f0f8ff",
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  selectValueText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
    fontStyle: "italic",
  },
  scrollButton: {
    alignItems: "center",
    paddingVertical: 6,
  },
});
