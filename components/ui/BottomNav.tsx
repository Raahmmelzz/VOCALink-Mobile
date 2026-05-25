import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { Colors as C, FontSize, Shadow } from "../../constants/tokens";

export type TabName = "home" | "board" | "livecc" | "profile";

interface TabItem {
  id: TabName;
  label: string;
  emoji: string;
}

const ALL_TABS: TabItem[] = [
  { id: "home",    label: "Home",      emoji: "🏠"  },
  { id: "board",   label: "AAC Board", emoji: "🗣️" },
  { id: "livecc",  label: "Live CC",   emoji: "📝"  },
  { id: "profile", label: "Profile",   emoji: "👤"  },
];

interface BottomNavProps {
  active: TabName;
  setActive: (tab: TabName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ active, setActive }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isTeacher = user?.status === "TEACHER";

  const visibleTabs = ALL_TABS.filter(tab => {
    if (isTeacher && (tab.id === "board" || tab.id === "livecc")) return false;
    return true;
  });

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {visibleTabs.map(tab => {
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
  tab:        { flex: 1, alignItems: "center", gap: 3 },
  iconWrap:   { width: 44, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  iconActive: { backgroundColor: C.purpleLight },
  label:      { fontSize: FontSize.xs, color: C.text3, fontWeight: "500" },
  labelActive:{ color: C.purple, fontWeight: "600" },
});

export default BottomNav;
