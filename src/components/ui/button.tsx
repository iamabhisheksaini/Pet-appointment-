import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  View,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  children: React.ReactNode;
  icon?: React.ReactNode;
  // any other TouchableOpacity props can be added if needed
}

/**
 * React Native Button with variant and size styles
 */
export function Button({
  variant = 'default',
  size = 'default',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  children,
  icon,
  ...rest
}: ButtonProps) {
  const containerStyles = [
    styles.base,
    variantContainerStyles[variant],
    sizeContainerStyles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.textBase,
    variantTextStyles[variant],
    sizeTextStyles[size],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={containerStyles}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variantTextColors[variant]} />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={textStyles}>{children}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    // Use boxShadow for React Native Web compatibility
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    // Keep individual shadow properties for native platforms
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android shadow
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconContainer: {
    marginRight: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBase: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  disabled: {
    opacity: 0.6,
  },
  textDisabled: {
    color: colors.gray[400],
  },
});

// Button variant styles using design system colors
const variantContainerStyles: Record<ButtonVariant, ViewStyle> = StyleSheet.create({
  default: {
    backgroundColor: colors.primary[500],
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.error[500],
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.gray[300],
  },
  secondary: {
    backgroundColor: colors.gray[500],
    borderColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

const variantTextColors: Record<ButtonVariant, string> = {
  default: colors.gray[50],
  destructive: colors.gray[50],
  outline: colors.gray[700],
  secondary: colors.gray[50],
  ghost: colors.gray[700],
  link: colors.primary[600],
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = StyleSheet.create({
  default: {
    color: variantTextColors['default'],
  },
  destructive: {
    color: variantTextColors['destructive'],
  },
  outline: {
    color: variantTextColors['outline'],
  },
  secondary: {
    color: variantTextColors['secondary'],
  },
  ghost: {
    color: variantTextColors['ghost'],
  },
  link: {
    color: variantTextColors['link'],
    textDecorationLine: 'underline',
  },
});

const sizeContainerStyles: Record<ButtonSize, ViewStyle> = StyleSheet.create({
  default: {
    height: 40,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
  },
  sm: {
    height: 36,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  lg: {
    height: 44,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing['2xl'],
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    paddingHorizontal: 0,
  },
});

const sizeTextStyles: Record<ButtonSize, TextStyle> = StyleSheet.create({
  default: {
    fontSize: fontSize.sm,
  },
  sm: {
    fontSize: fontSize.xs,
  },
  lg: {
    fontSize: fontSize.base,
  },
  icon: {
    fontSize: 0, // icon-only buttons will have no text or very small text
  },
});
