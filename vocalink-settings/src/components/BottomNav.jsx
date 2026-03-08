import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme";

const SETTINGS_SCREENS = ["settings", "notifications", "appearance", "privacy", "profile"];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid-outline",      iconOn: "grid" },
  { id: "activity",  label: "Activity",  icon: "pulse-outline",     iconOn: "pulse" },
  { id: "users",     label: "Users",     icon: "people-outline",    iconOn: "people" },
  { id: "settings",  label: "Settings",  icon: "settings-outline",  iconOn: "settings" },
];

/**
 * BottomNav
 * Mobile bottom navigation bar with active state highlighting.
 */
export default function BottomNav({ active, onNav }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom + 8 }]}>
      {NAV_ITEMS.map(({ id, label, icon, iconOn }) => {
        const isOn = id === "settings"
          ? SETTINGS_SCREENS.includes(active)
          : active === id;

        return (
          <TouchableOpacity
            key={id}
            style={styles.item}
            onPress={() => onNav(id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, isOn && styles.iconWrapOn]}>
              <Ionicons
                name={isOn ? iconOn : icon}
                size={22}
                color={isOn ? Colors.brandPrimary : Colors.n400}
              />
            </View>
            <Text style={[styles.label, isOn ? styles.labelOn : styles.labelOff]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.n200,
    paddingTop: 8,
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  item: {
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapOn: {
    backgroundColor: Colors.brandPale,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  labelOn:  { color: Colors.brandPrimary },
  labelOff: { color: Colors.n400 },
});
