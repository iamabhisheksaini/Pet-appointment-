import React, { forwardRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  ViewStyle,
  TextStyle
} from "react-native";
import { ChevronDown } from "lucide-react-native";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ======================
// NavigationMenu
// ======================
const NavigationMenu = ({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) => {
  return (
    <View style={[styles.menuRoot, style]}>
      {children}
    </View>
  );
};
NavigationMenu.displayName = "NavigationMenu";

// ======================
// NavigationMenuList
// ======================
const NavigationMenuList = forwardRef<View, { style?: ViewStyle; children?: React.ReactNode }>(
  ({ style, children, ...props }, ref) => (
    <View ref={ref} style={[styles.menuList, style]} {...props}>
      {children}
    </View>
  )
);
NavigationMenuList.displayName = "NavigationMenuList";

// ======================
// NavigationMenuItem
// ======================
const NavigationMenuItem = ({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) => (
  <View style={style}>{children}</View>
);
NavigationMenuItem.displayName = "NavigationMenuItem";

// ======================
// NavigationMenuTrigger
// ======================
const NavigationMenuTrigger = ({
  label,
  children,
  style
}: { label: string; children?: React.ReactNode; style?: ViewStyle }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleMenu}
        style={[styles.triggerButton, open && styles.triggerActive, style]}
      >
        <Text style={styles.triggerText}>{label}</Text>
        <ChevronDown
          size={12}
          color="#000"
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {open && <View style={styles.dropdownContent}>{children}</View>}
    </View>
  );
};
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

// ======================
// NavigationMenuContent
// ======================
const NavigationMenuContent = ({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) => (
  <View style={[styles.content, style]}>{children}</View>
);
NavigationMenuContent.displayName = "NavigationMenuContent";

// ======================
// NavigationMenuLink
// ======================
const NavigationMenuLink = ({
  style,
  label,
  onPress
}: { style?: ViewStyle; label: string; onPress?: () => void }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text>{label}</Text>
  </TouchableOpacity>
);
NavigationMenuLink.displayName = "NavigationMenuLink";

// ======================
// NavigationMenuViewport
// ======================
const NavigationMenuViewport = ({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) => (
  <View style={[styles.viewport, style]}>{children}</View>
);
NavigationMenuViewport.displayName = "NavigationMenuViewport";

// ======================
// NavigationMenuIndicator
// ======================
const NavigationMenuIndicator = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.indicator, style]}>
    <View style={styles.indicatorArrow} />
  </View>
);
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

// ======================
// Styles mapped from your Tailwind CSS
// ======================
const styles = StyleSheet.create({
  menuRoot: {
    position: "relative",
    zIndex: 10,
    flexDirection: "row",
    maxWidth: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  menuList: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    columnGap: 4
  },
  triggerButton: {
    flexDirection: "row",
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  triggerActive: {
    backgroundColor: "#f0f0f0"
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4
  },
  dropdownContent: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 8
  },
  content: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6
  },
  viewport: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  indicator: {
    position: "absolute",
    top: "100%",
    height: 6,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  indicatorArrow: {
    height: 8,
    width: 8,
    backgroundColor: "#e5e7eb",
    transform: [{ rotate: "45deg" }]
  }
});

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport
};
