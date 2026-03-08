import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/BottomNav";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const C = {
  primary: "#00AEEF",
  primaryDark: "#0090C8",
  primaryDeep: "#006FA6",
  primaryLight: "#E0F6FE",
  primaryMid: "#B3E8FA",
  white: "#FFFFFF",
  black: "#1A1A2E",
  gray: "#6B7280",
  grayLight: "#F3F9FF",
  grayBorder: "#E0EFF9",
  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, theme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [speechModalVisible, setSpeechModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [speechRate, setSpeechRate] = useState("Normal");
  const [speechPitch, setSpeechPitch] = useState("Medium");

  const getToggleState = (id: string): boolean => {
    if (id === "darkMode") return isDarkMode;
    
    const map: Record<string, boolean> = {
      notifications, soundEnabled, vibration,
      largeText, autoSave, hapticFeedback, highContrast,
    };
    return map[id] ?? false;
  };

  const handleToggle = (id: string, value: boolean) => {
    if (id === "darkMode") {
      toggleDarkMode(value);
      return;
    }

    const setters: Record<string, (v: boolean) => void> = {
      notifications: setNotifications,
      soundEnabled: setSoundEnabled,
      vibration: setVibration,
      largeText: setLargeText,
      autoSave: setAutoSave,
      hapticFeedback: setHapticFeedback,
      highContrast: setHighContrast,
    };
    setters[id]?.(value);
  };

  const handleNavPress = (id: string) => {
    switch (id) {
      case "editProfile":
        router.push("/(dashboard)/profile");
        break;
      case "language":
        setLanguageModalVisible(true);
        break;
      case "speechSettings":
        setSpeechModalVisible(true);
        break;
      case "changePassword":
        setPasswordModalVisible(true);
        break;
      case "logout":
        if (Platform.OS === "web") {
          if (window.confirm("Are you sure you want to sign out?")) {
            logout();
            router.replace("/(auth)/login");
          }
        } else {
          Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Sign Out", 
              style: "destructive", 
              onPress: () => {
                logout();
                router.replace("/(auth)/login");
              } 
            },
          ]);
        }
        break;
      default:
        Alert.alert("Feature", "This feature will be available soon.");
        break;
    }
  };

  const initials = (user?.displayName || "Guest")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  type SectionItem =
    | { type: "toggle"; id: string; label: string; sublabel?: string; icon: string; iconColor?: string }
    | { type: "nav"; id: string; label: string; sublabel?: string; icon: string; iconColor?: string; danger?: boolean }
    | { type: "info"; id: string; label: string; value: string; icon: string; iconColor?: string };

  const sections: { title: string; items: SectionItem[] }[] = [
    {
      title: "Account",
      items: [
        { type: "nav", id: "editProfile", label: "Edit Profile", sublabel: user?.displayName || "Guest", icon: "person-circle-outline", iconColor: C.primary },
        { type: "nav", id: "changePassword", label: "Change Password", sublabel: "Update your password", icon: "lock-closed-outline", iconColor: C.primaryDark },
        { type: "nav", id: "language", label: "Language", sublabel: selectedLanguage, icon: "globe-outline", iconColor: C.primaryDeep },
      ],
    },
    {
      title: "Communication",
      items: [
        { type: "nav", id: "speechSettings", label: "Speech Settings", sublabel: `Rate: ${speechRate} · Pitch: ${speechPitch}`, icon: "mic-outline", iconColor: C.primary },
        { type: "toggle", id: "soundEnabled", label: "Sound Effects", sublabel: "Play audio cues", icon: "volume-high-outline", iconColor: C.primaryDark },
        { type: "toggle", id: "vibration", label: "Vibration", sublabel: "Haptic on card tap", icon: "phone-portrait-outline", iconColor: C.primaryDeep },
        { type: "toggle", id: "hapticFeedback", label: "Haptic Feedback", sublabel: "Tactile response on actions", icon: "hand-left-outline", iconColor: C.primary },
        { type: "toggle", id: "autoSave", label: "Auto-Save Cards", sublabel: "Save new phrases automatically", icon: "save-outline", iconColor: C.primaryDark },
      ],
    },
    {
      title: "Appearance",
      items: [
        { type: "toggle", id: "darkMode", label: "Dark Mode", sublabel: "Switch to dark theme", icon: "moon-outline", iconColor: "#6366F1" },
        { type: "toggle", id: "largeText", label: "Large Text", sublabel: "Increase font size", icon: "text-outline", iconColor: "#8B5CF6" },
        { type: "toggle", id: "highContrast", label: "High Contrast", sublabel: "Enhanced visibility", icon: "contrast-outline", iconColor: "#EC4899" },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        { type: "nav", id: "logout", label: "Sign Out", icon: "log-out-outline", iconColor: C.danger },
      ],
    },
  ];

  const renderItem = (item: SectionItem, idx: number, total: number) => {
    const isLast = idx === total - 1;
    
    if (item.type === "toggle") {
      return (
        <View key={item.id} style={[styles.row, !isLast && styles.rowBorder, { borderBottomColor: theme.border }]}>
          <View style={[styles.iconBox, { backgroundColor: (item.iconColor ?? C.primary) + "18" }]}>
            <Ionicons name={item.icon as any} size={20} color={item.iconColor ?? C.primary} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>{item.label}</Text>
            {item.sublabel ? <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>{item.sublabel}</Text> : null}
          </View>
          <Switch
            value={getToggleState(item.id)}
            onValueChange={(v) => handleToggle(item.id, v)}
            trackColor={{ false: "#D1D5DB", true: C.primaryMid }}
            thumbColor={getToggleState(item.id) ? C.primary : "#F9FAFB"}
            ios_backgroundColor="#D1D5DB"
          />
        </View>
      );
    }

    if (item.type === "info") {
      return (
        <View key={item.id} style={[styles.row, !isLast && styles.rowBorder, { borderBottomColor: theme.border }]}>
          <View style={[styles.iconBox, { backgroundColor: (item.iconColor ?? C.gray) + "18" }]}>
            <Ionicons name={item.icon as any} size={20} color={item.iconColor ?? C.gray} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>{item.label}</Text>
          </View>
          <Text style={[styles.infoValue, { color: theme.textMuted }]}>{item.value}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.row, !isLast && styles.rowBorder, { borderBottomColor: theme.border }]}
        onPress={() => handleNavPress(item.id)}
        activeOpacity={0.65}
      >
        <View style={[styles.iconBox, { backgroundColor: (item.iconColor ?? C.primary) + "18" }]}>
          <Ionicons name={item.icon as any} size={20} color={item.iconColor ?? C.primary} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, item.danger ? { color: C.danger } : { color: theme.text }]}>{item.label}</Text>
          {item.sublabel ? <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>{item.sublabel}</Text> : null}
        </View>
        {!item.danger && <Ionicons name="chevron-forward" size={17} color={theme.textMuted} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.avatarName}>{user?.displayName || "Guest"}</Text>
            <Text style={styles.avatarEmail}>{user?.email || "guest@email.com"}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{section.title.toUpperCase()}</Text>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              {section.items.map((item, idx) => renderItem(item, idx, section.items.length))}
            </View>
          </View>
        ))}
        <Text style={[styles.footerNote, { color: theme.textMuted }]}>VocaLink © 2026 · Empowering communication</Text>
      </ScrollView>

      <BottomNav activeTab="settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F9FF" },
  header: { backgroundColor: C.primary, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, overflow: "hidden" },
  headerAccent: { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.12)" },
  headerTitle: { fontSize: 13, fontWeight: "700", color: "rgba(255,255,255,0.75)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 },
  avatarWrap: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.55)" },
  avatarText: { fontSize: 20, fontWeight: "800", color: C.white },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 17, fontWeight: "700", color: C.white },
  avatarEmail: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 120 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontWeight: "700", color: C.gray, letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: C.white, borderRadius: 16, overflow: "hidden", elevation: 3 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#EEF7FF" },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: "600", color: C.black },
  rowSublabel: { fontSize: 12, color: C.gray, marginTop: 2 },
  infoValue: { fontSize: 14, color: C.gray, fontWeight: "500" },
  footerNote: { textAlign: "center", fontSize: 12, color: "#B0C8DC", marginTop: 8 },
});