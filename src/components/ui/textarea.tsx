import React, { forwardRef } from "react";
import { TextInput, StyleSheet } from "react-native";

export interface TextareaProps extends React.ComponentProps<typeof TextInput> {}

const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.textarea, style]}
        multiline
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    width: "100%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    textAlignVertical: "top", // Ensures text starts from top
  },
});

export { Textarea };
