import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'selected';

interface BadgeProps {
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

/**
 * Badge component for React Native
 */
export function Badge({ variant = 'default', style, textStyle, children, ...rest }: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]} {...rest}>
      <Text style={[styles.textBase, variantTextStyles[variant], textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)',
    // Keep individual shadow properties for native platforms
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1, // Android shadow
  },
  textBase: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});

const variantStyles: Record<BadgeVariant, StyleProp<ViewStyle>> = StyleSheet.create({
  default: {
    borderColor: 'transparent',
    backgroundColor: colors.primary[500],
  },
  secondary: {
    borderColor: 'transparent',
    backgroundColor: colors.secondary[500],
  },
  destructive: {
    borderColor: 'transparent',
    backgroundColor: colors.error[500],
  },
  success: {
    borderColor: 'transparent',
    backgroundColor: colors.success[500],
  },
  warning: {
    borderColor: 'transparent',
    backgroundColor: colors.warning[500],
  },
  selected: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[100],
  },
  outline: {
    borderColor: colors.gray[300],
    backgroundColor: 'transparent',
  },
});

const variantTextStyles: Record<BadgeVariant, StyleProp<TextStyle>> = StyleSheet.create({
  default: {
    color: colors.gray[50],
  },
  secondary: {
    color: colors.gray[50],
  },
  destructive: {
    color: colors.gray[50],
  },
  success: {
    color: colors.gray[50],
  },
  warning: {
    color: colors.gray[900],
  },
  selected: {
    color: colors.primary[700],
  },
  outline: {
    color: colors.gray[700],
  },
});
