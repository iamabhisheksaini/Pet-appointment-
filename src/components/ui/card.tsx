import React, { forwardRef } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

// Card
const Card = forwardRef<View, {style?: ViewStyle, children?: React.ReactNode}>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.card, style]}
      {...props}
    />
  )
);
Card.displayName = "Card";

// CardHeader
const CardHeader = forwardRef<View, {style?: ViewStyle, children?: React.ReactNode}>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.cardHeader, style]}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// CardTitle
const CardTitle = forwardRef<Text, {style?: TextStyle, children?: React.ReactNode}>(
  ({ style, ...props }, ref) => (
    <Text
      ref={ref}
      style={[styles.cardTitle, style]}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// CardDescription
const CardDescription = forwardRef<Text, {style?: TextStyle, children?: React.ReactNode}>(
  ({ style, ...props }, ref) => (
    <Text
      ref={ref}
      style={[styles.cardDescription, style]}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

// CardContent
const CardContent = forwardRef<View, {style?: ViewStyle, children?: React.ReactNode}>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.cardContent, style]}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

// CardFooter
const CardFooter = forwardRef<View, {style?: ViewStyle, children?: React.ReactNode}>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.cardFooter, style]}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Styles mapped from your Tailwind classes
const styles = StyleSheet.create({
  card: {
    borderRadius: 12, // rounded-lg
    borderWidth: 1,   // border
    borderColor: "#e5e7eb", // bg-card border color - use as needed
    backgroundColor: "#fff", // bg-card
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    // Keep individual shadow properties for native platforms
    shadowColor: "#000",     // shadow-sm
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    padding: 0, // No base padding
  },
  cardHeader: {
    flexDirection: "column", // flex-col
    gap: 6, // space-y-1.5 ~ 6px (not supported directly; use marginBottom in children if needed)
    padding: 24,             // p-6
    paddingBottom: 24,
    paddingTop: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  cardTitle: {
    fontSize: 24, // text-2xl ~ 24px
    fontWeight: "600", // font-semibold
    lineHeight: 32,    // leading-none (~1 for web "none", using 32px for visibility)
    letterSpacing: -0.5, // tracking-tight
    color: "#000", // text color - card-foreground (adjust as needed for theming)
    marginBottom: 0,
  },
  cardDescription: {
    fontSize: 14, // text-sm
    color: "#6b7280", // text-muted-foreground (gray-500)
  },
  cardContent: {
    padding: 24,   // p-6
    paddingTop: 0, // pt-0
  },
  cardFooter: {
    flexDirection: "row", // flex
    alignItems: "center", // items-center
    padding: 24,    // p-6
    paddingTop: 0,  // pt-0
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
