import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors as C, FontSize, Shadow } from "../../constants/tokens";

export type TabName = "home" | "board" | "messages" | "livecc" | "profile";

interface TabItem {
  id: TabName;
  label: string;
  emoji: string;
}

const TABS: TabItem[] = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "board", label: "AAC Board", emoji: "🗣" },
  { id: "messages", label: "Messages", emoji: "💬" },
  { id: "livecc", label: "Live CC", emoji: "📝" },
  { id: "profile", label: "Profile", emoji: "👤" },
];

interface BottomNavProps {
  active: TabName;
  setActive: (tab: TabName) => void;
  unread?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({
  active,
  setActive,
  unread = 0,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActive(tab.id)}
            activeOpacity={0.75}
            style={styles.tab}
          >
            <View style={[styles.iconWrap, isActive && styles.iconActive]}>
              <Text style={{ fontSize: 20 }}>{tab.emoji}</Text>
              {tab.id === "messages" && unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
    paddingTop: 10,
    paddingHorizontal: 8,
    ...Shadow.md,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  iconWrap: {
    width: 44,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconActive: {
    backgroundColor: C.purpleLight,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.redDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.white,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: C.white,
  },
  label: {
    fontSize: FontSize.xs,
    color: C.text3,
    fontWeight: "500",
  },
  labelActive: {
    color: C.purple,
    fontWeight: "600",
  },
});

export default BottomNav;
