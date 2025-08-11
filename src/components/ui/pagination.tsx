import React, { forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";

// Base Pagination container
const Pagination = ({ style, ...props }: { style?: ViewStyle; children?: React.ReactNode }) => (
  <View
    // accessibilityRole="navigation"
    accessibilityLabel="pagination"
    style={[styles.pagination, style]}
    {...props}
  />
);
Pagination.displayName = "Pagination";

// Content (replaces <ul>)
const PaginationContent = forwardRef<View, { style?: ViewStyle; children?: React.ReactNode }>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.paginationContent, style]}
      {...props}
    />
  )
);
PaginationContent.displayName = "PaginationContent";

// Item (replaces <li>)
const PaginationItem = forwardRef<View, { style?: ViewStyle; children?: React.ReactNode }>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={style} {...props} />
  )
);
PaginationItem.displayName = "PaginationItem";

// Link (replaces <a>)
import type { StyleProp } from "react-native";

type PaginationLinkProps = {
  isActive?: boolean;
  label?: string;
  size?: "icon" | "default";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const PaginationLink = ({
  isActive,
  size = "icon",
  style,
  children,
  ...props
}: PaginationLinkProps) => (
  <TouchableOpacity
    accessibilityRole="link"
    accessibilityState={{ selected: !!isActive }}
    style={[
      styles.buttonBase,
      size === "icon" ? styles.buttonIcon : styles.buttonDefault,
      isActive ? styles.buttonOutline : styles.buttonGhost,
      style
    ]}
    {...props}
  >
    {children}
  </TouchableOpacity>
);
PaginationLink.displayName = "PaginationLink";

// Previous Button
const PaginationPrevious = ({ style, ...props }: PaginationLinkProps) => (
  <PaginationLink
    size="default"
    style={[styles.buttonGap, { paddingLeft: 10 }, style]}
    {...props}
  >
    <ChevronLeft size={16} color="#000" />
    <Text>Previous</Text>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

// Next Button
const PaginationNext = ({ style, ...props }: PaginationLinkProps) => (
  <PaginationLink
    size="default"
    style={[styles.buttonGap, { paddingRight: 10 }, style]}
    {...props}
  >
    <Text>Next</Text>
    <ChevronRight size={16} color="#000" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

// Ellipsis
const PaginationEllipsis = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.ellipsis, style]}>
    <MoreHorizontal size={16} color="#000" />
    {/* Screen reader accessibility */}
    <Text style={{ position: "absolute", opacity: 0 }}>More pages</Text>
  </View>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};

// Styles
const styles = StyleSheet.create({
  pagination: {
    marginHorizontal: "auto", // mx-auto not exact in RN (center via parent)
    flexDirection: "row",
    width: "100%",
    justifyContent: "center"
  },
  paginationContent: {
    flexDirection: "row", // flex-row
    alignItems: "center",
    columnGap: 4 // gap-1 ~ 4px (RN >= 0.71 supports gap)
  },
  // Button base from buttonVariants
  buttonBase: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    flexDirection: "row"
  },
  buttonIcon: {
    height: 36, // h-9
    width: 36 // w-9
  },
  buttonDefault: {
    paddingHorizontal: 12,
    height: 36
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#d1d5db", // outline border
    backgroundColor: "#fff"
  },
  buttonGhost: {
    backgroundColor: "transparent"
  },
  buttonGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  ellipsis: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center"
  }
});
