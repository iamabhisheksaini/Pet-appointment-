import React, { forwardRef } from "react";
import { Text, StyleSheet, TextStyle, ViewStyle } from "react-native";

interface LabelProps {
  children: React.ReactNode;
  style?: ViewStyle | TextStyle;
  // In web, Label can be "disabled" via peer-disabled styling
  disabled?: boolean;
}

const Label = forwardRef<Text, LabelProps>(
  ({ style, disabled, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[
          styles.label,
          disabled && styles.disabled,
          style
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

Label.displayName = "Label";

export { Label };

const styles = StyleSheet.create({
  label: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
    lineHeight: 20, // leading-none ~20px considering RN default
    color: "#000000", // default foreground text
  },
  disabled: {
    opacity: 0.7, // opacity-70
    // no "cursor-not-allowed" equivalent in RN, just visual state
  },
});
