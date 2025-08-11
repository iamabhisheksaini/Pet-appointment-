import React, { forwardRef } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';

type AlertVariant = "default" | "destructive" | "success" | "warning" | "info";

interface AlertProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: AlertVariant;
}

const Alert = forwardRef<View, AlertProps>(
  ({ style, variant = "default", ...props }, ref) => {
    const getVariantStyle = () => {
      switch (variant) {
        case "destructive":
          return styles.alertDestructive;
        case "success":
          return styles.alertSuccess;
        case "warning":
          return styles.alertWarning;
        case "info":
          return styles.alertInfo;
        default:
          return styles.alertDefault;
      }
    };

    return (
      <View
        ref={ref}
        style={[
          styles.alertBase,
          getVariantStyle(),
          style
        ]}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

// Title
interface AlertTitleProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

const AlertTitle = forwardRef<Text, AlertTitleProps>(
  ({ style, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[styles.alertTitle, style]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
AlertTitle.displayName = "AlertTitle";

// Description
interface AlertDescriptionProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

const AlertDescription = forwardRef<Text, AlertDescriptionProps>(
  ({ style, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[styles.alertDescription, style]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

const styles = StyleSheet.create({
  // Base Alert Styles - using design system values
  alertBase: {
    position: "relative",
    width: "100%",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    flexDirection: "column", // Stack content vertically for better layout
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    // Keep individual shadow properties for native platforms
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android shadow
  },
  
  // Alert variants using design system colors
  alertDefault: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
  },
  
  alertDestructive: {
    backgroundColor: colors.error[50],
    borderColor: colors.error[200],
  },
  
  alertSuccess: {
    backgroundColor: colors.success[50],
    borderColor: colors.success[200],
  },
  
  alertWarning: {
    backgroundColor: colors.warning[50],
    borderColor: colors.warning[200],
  },
  
  alertInfo: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
  },
  
  // Alert Title - enhanced styling
  alertTitle: {
    marginBottom: spacing.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * 1.2,
    letterSpacing: -0.25,
    fontSize: fontSize.base,
    color: colors.gray[900],
  },
  
  // Alert Description - improved readability
  alertDescription: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
    color: colors.gray[700],
  },
});
