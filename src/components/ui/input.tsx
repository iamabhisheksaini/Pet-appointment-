

// interface InputProps {
//   style?: ViewStyle | TextStyle;
//   type?: string;
//   placeholder?: string;
//   editable?: boolean;
//   value?: string;
//   onChangeText?: (text: string) => void;
// }

import React from "react";
import { TextInput, TextInputProps, KeyboardTypeOptions, StyleSheet } from "react-native";

export interface InputProps extends TextInputProps {
  keyboardType?: KeyboardTypeOptions;
}

export const Input: React.FC<InputProps> = ({ keyboardType, style, ...props }) => {
  return (
    <TextInput
      keyboardType={keyboardType}
      style={[styles.input, style]}
      {...props}
    />
  );
};


Input.displayName = "Input";


const styles = StyleSheet.create({
  input: {
    flex: 1, // flex
    height: 40, // h-10
    width: "100%", // w-full
    borderRadius: 6, // rounded-md
    borderWidth: 1, // border
    borderColor: "#d1d5db", // border-input
    backgroundColor: "#ffffff", // bg-background
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2
    fontSize: 16, // text-base
    color: "#000000", // text color similar to default foreground
    // disabled styles: handled via editable prop (see props above)
    opacity: 1,
  },
});
