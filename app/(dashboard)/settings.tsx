<<<<<<< HEAD
// app/(dashboard)/settings.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/BottomNav";

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

  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [speechModalVisible, setSpeechModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [displayName, setDisplayName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@email.com");
  const [editName, setEditName] = useState(displayName);
  const [editEmail, setEditEmail] = useState(email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [speechRate, setSpeechRate] = useState("Normal");
  const [speechPitch, setSpeechPitch] = useState("Medium");

  const languages = ["English", "Filipino", "Spanish", "French", "Japanese", "Korean", "Mandarin"];
  const speechRates = ["Slow", "Normal", "Fast"];
  const pitchOptions = ["Low", "Medium", "High"];

  const getToggleState = (id: string): boolean => {
    const map: Record<string, boolean> = {
      notifications, soundEnabled, vibration, darkMode,
      largeText, autoSave, hapticFeedback, highContrast,
    };
    return map[id] ?? false;
  };

  const handleToggle = (id: string, value: boolean) => {
    const setters: Record<string, (v: boolean) => void> = {
      notifications: setNotifications,
      soundEnabled: setSoundEnabled,
      vibration: setVibration,
      darkMode: setDarkMode,
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
        setEditName(displayName);
        setEditEmail(email);
        setProfileModalVisible(true);
        break;
      case "language":
        setLanguageModalVisible(true);
        break;
      case "speechSettings":
        setSpeechModalVisible(true);
        break;
      case "changePassword":
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setPasswordModalVisible(true);
        break;
      case "privacyPolicy":
        Alert.alert("Privacy Policy", "Opening privacy policy…");
        break;
      case "termsOfService":
        Alert.alert("Terms of Service", "Opening terms of service…");
        break;
      case "helpSupport":
        Alert.alert("Help & Support", "Opening support centre…");
        break;
      case "sendFeedback":
        Alert.alert("Feedback", "Thank you! A feedback form will open shortly.");
        break;
      case "logout":
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: () => router.replace("/(auth)/login") },
        ]);
        break;
      case "deleteAccount":
        Alert.alert(
          "Delete Account",
          "This will permanently delete your account and all data. This action cannot be undone.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => Alert.alert("Account deletion requested.") },
          ]
        );
        break;
    }
  };

  const saveProfile = () => {
    if (!editName.trim()) { Alert.alert("Name cannot be empty."); return; }
    if (!editEmail.includes("@")) { Alert.alert("Enter a valid email."); return; }
    setDisplayName(editName.trim());
    setEmail(editEmail.trim());
    setProfileModalVisible(false);
    Alert.alert("Profile updated!");
  };

  const savePassword = () => {
    if (!currentPassword) { Alert.alert("Enter your current password."); return; }
    if (newPassword.length < 6) { Alert.alert("New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { Alert.alert("Passwords do not match."); return; }
    setPasswordModalVisible(false);
    Alert.alert("Password changed successfully!");
  };

  type SectionItem =
    | { type: "toggle"; id: string; label: string; sublabel?: string; icon: string; iconColor?: string }
    | { type: "nav"; id: string; label: string; sublabel?: string; icon: string; iconColor?: string; danger?: boolean }
    | { type: "info"; id: string; label: string; value: string; icon: string; iconColor?: string };

  type Section = { title: string; items: SectionItem[] };

  const sections: Section[] = [
    {
      title: "Account",
      items: [
        { type: "nav", id: "editProfile", label: "Edit Profile", sublabel: displayName, icon: "person-circle-outline", iconColor: C.primary },
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
      title: "Notifications",
      items: [
        { type: "toggle", id: "notifications", label: "Push Notifications", sublabel: "Receive app notifications", icon: "notifications-outline", iconColor: C.warning },
      ],
    },
    {
      title: "About",
      items: [
        { type: "info", id: "version", label: "App Version", value: "1.0.0", icon: "information-circle-outline", iconColor: C.gray },
        { type: "nav", id: "helpSupport", label: "Help & Support", icon: "help-circle-outline", iconColor: C.gray },
        { type: "nav", id: "privacyPolicy", label: "Privacy Policy", icon: "shield-outline", iconColor: C.gray },
        { type: "nav", id: "termsOfService", label: "Terms of Service", icon: "document-text-outline", iconColor: C.gray },
        { type: "nav", id: "sendFeedback", label: "Send Feedback", icon: "chatbubble-outline", iconColor: C.gray },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        { type: "nav", id: "logout", label: "Sign Out", icon: "log-out-outline", iconColor: C.danger },
        { type: "nav", id: "deleteAccount", label: "Delete Account", sublabel: "Permanently remove your data", icon: "trash-outline", iconColor: C.danger, danger: true },
      ],
    },
  ];

  const renderItem = (item: SectionItem, idx: number, total: number) => {
    const isLast = idx === total - 1;
    if (item.type === "toggle") {
      return (
        <View key={item.id} style={[styles.row, !isLast && styles.rowBorder]}>
          <View style={[styles.iconBox, { backgroundColor: (item.iconColor ?? C.primary) + "18" }]}>
            <Ionicons name={item.icon as any} size={20} color={item.iconColor ?? C.primary} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            {item.sublabel ? <Text style={styles.rowSublabel}>{item.sublabel}</Text> : null}
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
        <View key={item.id} style={[styles.row, !isLast && styles.rowBorder]}>
          <View style={[styles.iconBox, { backgroundColor: (item.iconColor ?? C.gray) + "18" }]}>
            <Ionicons name={item.icon as any} size={20} color={item.iconColor ?? C.gray} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{item.label}</Text>
          </View>
          <Text style={styles.infoValue}>{item.value}</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.row, !isLast && styles.rowBorder]}
        onPress={() => handleNavPress(item.id)}
        activeOpacity={0.65}
      >
        <View style={[styles.iconBox, { backgroundColor: (item.iconColor ?? C.primary) + "18" }]}>
          <Ionicons name={item.icon as any} size={20} color={item.iconColor ?? C.primary} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, item.danger && { color: C.danger }]}>{item.label}</Text>
          {item.sublabel ? <Text style={styles.rowSublabel}>{item.sublabel}</Text> : null}
        </View>
        {!item.danger && <Ionicons name="chevron-forward" size={17} color="#CBD5E1" />}
      </TouchableOpacity>
    );
  };

  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.avatarName}>{displayName}</Text>
            <Text style={styles.avatarEmail}>{email}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <View style={styles.card}>
              {section.items.map((item, idx) => renderItem(item, idx, section.items.length))}
            </View>
          </View>
        ))}
        <Text style={styles.footerNote}>VocaLink © 2024 · Empowering communication</Text>
      </ScrollView>

      <BottomNav activeTab="settings" />

      {/* PROFILE MODAL */}
      <Modal visible={profileModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.inputLabel}>Display Name</Text>
            <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholder="Your name" placeholderTextColor="#9CA3AF" />
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} value={editEmail} onChangeText={setEditEmail} placeholder="you@email.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" />
            <TouchableOpacity style={styles.modalBtn} onPress={saveProfile}>
              <Text style={styles.modalBtnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setProfileModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PASSWORD MODAL */}
      <Modal visible={passwordModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.inputRow}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} value={currentPassword} onChangeText={setCurrentPassword} placeholder="••••••••" placeholderTextColor="#9CA3AF" secureTextEntry={!showPwd} />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd(!showPwd)}>
                <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={20} color={C.gray} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>New Password</Text>
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Min. 6 characters" placeholderTextColor="#9CA3AF" secureTextEntry={!showPwd} />
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter new password" placeholderTextColor="#9CA3AF" secureTextEntry={!showPwd} />
            <TouchableOpacity style={styles.modalBtn} onPress={savePassword}>
              <Text style={styles.modalBtnText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setPasswordModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LANGUAGE MODAL */}
      <Modal visible={languageModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Language</Text>
            {languages.map((lang) => (
              <TouchableOpacity key={lang} style={[styles.choiceRow, lang === selectedLanguage && styles.choiceRowActive]} onPress={() => { setSelectedLanguage(lang); setLanguageModalVisible(false); }}>
                <Text style={[styles.choiceText, lang === selectedLanguage && styles.choiceTextActive]}>{lang}</Text>
                {lang === selectedLanguage && <Ionicons name="checkmark-circle" size={20} color={C.primary} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SPEECH MODAL */}
      <Modal visible={speechModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Speech Settings</Text>
            <Text style={styles.inputLabel}>Speech Rate</Text>
            <View style={styles.chipRow}>
              {speechRates.map((r) => (
                <TouchableOpacity key={r} style={[styles.chip, r === speechRate && styles.chipActive]} onPress={() => setSpeechRate(r)}>
                  <Text style={[styles.chipText, r === speechRate && styles.chipTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Pitch</Text>
            <View style={styles.chipRow}>
              {pitchOptions.map((p) => (
                <TouchableOpacity key={p} style={[styles.chip, p === speechPitch && styles.chipActive]} onPress={() => setSpeechPitch(p)}>
                  <Text style={[styles.chipText, p === speechPitch && styles.chipTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.modalBtn, { marginTop: 24 }]} onPress={() => setSpeechModalVisible(false)}>
              <Text style={styles.modalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
=======
// app/settings.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/BottomNav";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <View style={styles.center}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>App Configuration</Text>
      </View>

      <BottomNav activeTab="settings" />

>>>>>>> 1fa64c315e0df8321605fb83c4b5ff89b58ca833
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: "#EEF7FF" },
  header: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  headerAccent: {
    position: "absolute", top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  headerTitle: {
    fontSize: 13, fontWeight: "700", color: "rgba(255,255,255,0.75)",
    letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16,
  },
  avatarWrap: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.55)",
  },
  avatarText: { fontSize: 20, fontWeight: "800", color: C.white },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 17, fontWeight: "700", color: C.white },
  avatarEmail: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 120 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: "700", color: C.gray,
    letterSpacing: 1.2, marginBottom: 8, marginLeft: 4,
  },
  card: {
    backgroundColor: C.white, borderRadius: 16, overflow: "hidden",
    shadowColor: C.primaryDark, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  row: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#EEF7FF" },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: "600", color: C.black },
  rowSublabel: { fontSize: 12, color: C.gray, marginTop: 2 },
  infoValue: { fontSize: 14, color: C.gray, fontWeight: "500" },
  footerNote: { textAlign: "center", fontSize: 12, color: "#B0C8DC", marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingBottom: Platform.OS === "ios" ? 40 : 28, paddingTop: 12,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB",
    alignSelf: "center", marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: C.black, marginBottom: 20, textAlign: "center" },
  inputLabel: { fontSize: 13, fontWeight: "600", color: C.gray, marginBottom: 6 },
  input: {
    backgroundColor: "#F3F9FF", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 15, color: C.black,
    borderWidth: 1.5, borderColor: "#D6EAF8", marginBottom: 14,
  },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  eyeBtn: { padding: 10, marginLeft: 4 },
  modalBtn: {
    backgroundColor: C.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: "center", marginTop: 4,
    shadowColor: C.primaryDark, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
  },
  modalBtnText: { color: C.white, fontSize: 16, fontWeight: "700" },
  modalCancel: { paddingVertical: 14, alignItems: "center" },
  modalCancelText: { color: C.gray, fontSize: 15, fontWeight: "600" },
  choiceRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 13, paddingHorizontal: 14, borderRadius: 12, marginBottom: 6,
    backgroundColor: "#F3F9FF",
  },
  choiceRowActive: { backgroundColor: C.primaryLight, borderWidth: 1.5, borderColor: C.primary },
  choiceText: { fontSize: 15, color: C.black, fontWeight: "500" },
  choiceTextActive: { fontWeight: "700", color: C.primaryDark },
  chipRow: { flexDirection: "row", gap: 10 },
  chip: {
    flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: "center",
    backgroundColor: "#F3F9FF", borderWidth: 1.5, borderColor: "#D6EAF8",
  },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontSize: 14, fontWeight: "600", color: C.gray },
  chipTextActive: { color: C.white },
});
=======
  container: { flex: 1, backgroundColor: "#F3F9FF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  title: { fontSize: 22, fontWeight: "800", color: "#1A1A2E" },
  subtitle: { fontSize: 14, color: "#666" },
});
>>>>>>> 1fa64c315e0df8321605fb83c4b5ff89b58ca833
