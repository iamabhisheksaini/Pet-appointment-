import React, { useState, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

// TooltipProvider can be a simple wrapper if you want to extend it later
const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Tooltip component wrapper (this just wraps children)
const TooltipRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// TooltipTrigger component, here a TouchableOpacity to toggle tooltip visibility
type TooltipTriggerProps = {
  onPress: () => void;
  children: React.ReactNode;
};

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ onPress, children }) => (
  <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
);

// TooltipContent with forwarded ref, sideOffset replaced by 'placement' and styling
type TooltipContentProps = {
  isVisible: boolean;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  onClose: () => void;
};

const TooltipContent = forwardRef<any, TooltipContentProps>(
  ({ isVisible, content, placement = 'top', onClose }, ref) => (
    <Tooltip
      ref={ref}
      isVisible={isVisible}
      content={<Text style={styles.tooltipText}>{content}</Text>}
      placement={placement}
      onClose={onClose}
      useReactNativeModal={true} // optional for modal rendering
      tooltipStyle={styles.tooltipBox}
    >
      <View /> {/* Required placeholder */}
    </Tooltip>
  )
);
TooltipContent.displayName = 'TooltipContent';

export { TooltipProvider, TooltipRoot as Tooltip, TooltipTrigger, TooltipContent };

const styles = StyleSheet.create({
  tooltipBox: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#333', // similar to bg-popover
    borderColor: '#666', // similar to border
    borderWidth: 1,
  },
  tooltipText: {
    color: 'white', // similar to text-popover-foreground
    fontSize: 14, // similar to text-sm
  },
});
