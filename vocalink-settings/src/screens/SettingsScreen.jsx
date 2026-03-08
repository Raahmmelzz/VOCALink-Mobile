import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import SettingRow from "../components/SettingRow";
import SectionCard from "../components/SectionCard";
import { Colors, Radius, Shadows } from "../theme";

/**
 * SettingsScreen
 * Main settings hub — profile card + grouped navigation rows.
 */
export default function SettingsScreen({ settings, navigate, toast }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Header */}
      <LinearGradient
        colors={[Colors.brandDarker, Colors.brandDeep, Colors.brandPrimary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="radio-button-on" size={18} color={Colors.white} />
          </View>
          <Text style={styles.logoText}>VocaLink</Text>
        </View>
        <Text style={styles.heroTitle}>Settings</Text>
        <Text style={styles.heroSub}>Manage your preferences</Text>
      </LinearGradient>

      <View style={styles.body}>
        {/* Profile Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate("profile")}
        >
          <LinearGradient
            colors={[Colors.brandDeep, Colors.brandPrimary, Colors.brandLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{settings.name.charAt(0)}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.profileBody}>
              <Text style={styles.profileName}>{settings.name}</Text>
              <Text style={styles.profileRole}>{settings.role} · {settings.email}</Text>
              <View style={styles.tagsRow}>
                <View style={styles.tag}><Text style={styles.tagText}>🌐 {settings.language}</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>🕐 {settings.timezone.split("/")[1]}</Text></View>
              </View>
            </View>
            <View style={styles.editBtn}>
              <Ionicons name="pencil" size={15} color={Colors.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Preferences Group */}
        <SectionCard label="Preferences">
          <SettingRow
            icon="notifications-outline" iconBg={Colors.brandPale} iconColor={Colors.brandPrimary}
            label="Notifications" sub="Push, email & alerts"
            badge={settings.pushEnabled ? "ON" : "OFF"}
            badgeType={settings.pushEnabled ? "blue" : "yellow"}
            onPress={() => navigate("notifications")}
          />
          <SettingRow
            icon="sunny-outline" iconBg="#FEF3C7" iconColor="#D97706"
            label="Appearance" sub="Theme, font size & colors"
            value={settings.theme === "light" ? "Light" : "Dark"}
            onPress={() => navigate("appearance")}
          />
          <SettingRow
            icon="lock-closed-outline" iconBg="#EDE9FE" iconColor={Colors.info}
            label="Privacy & Security" sub="Change your password"
            onPress={() => navigate("privacy")}
            last
          />
        </SectionCard>

        {/* App Group */}
        <SectionCard label="App">
          <SettingRow
            icon="globe-outline" iconBg="#D1FAE5" iconColor={Colors.success}
            label="Language" sub="App display language"
            value={settings.language}
          />
          <SettingRow
            icon="time-outline" iconBg={Colors.brandPale} iconColor={Colors.brandPrimary}
            label="Timezone" sub="Session timestamps"
            value={settings.timezone.split("/")[1]}
          />
          <SettingRow
            icon="sync-outline" iconBg="#FEF3C7" iconColor="#D97706"
            label="Sync & Backup"
            badge="Auto" badgeType="green"
            last
          />
        </SectionCard>

        {/* Support Group */}
        <SectionCard label="Support">
          <SettingRow
            icon="help-circle-outline" iconBg={Colors.brandPale} iconColor={Colors.brandPrimary}
            label="Help & FAQ"
          />
          <SettingRow
            icon="chatbubble-outline" iconBg="#D1FAE5" iconColor={Colors.success}
            label="Send Feedback"
            badge="New" badgeType="blue"
          />
          <SettingRow
            icon="log-out-outline" iconBg="#FEE2E2" iconColor={Colors.danger}
            label="Sign Out"
            danger chevron={false}
            onPress={() => toast.show("Signed out successfully", "info")}
            last
          />
        </SectionCard>

        {/* Version */}
        <View style={styles.version}>
          <Text style={styles.versionText}>VocaLink v2.4.1 · Build 241</Text>
          <Text style={styles.versionCopy}>© 2025 VocaLink. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.n50 },
  content: { paddingBottom: 16 },
  hero: { padding: 18, paddingBottom: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  logoIcon: {
    width: 32, height: 32, backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 9, alignItems: "center", justifyContent: "center",
  },
  logoText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
  heroTitle: { color: Colors.white, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  heroSub:   { color: "rgba(255,255,255,0.72)", fontSize: 12, marginTop: 3 },

  body: { padding: 16, gap: 20 },

  profileCard: {
    borderRadius: Radius.md, padding: 18,
    flexDirection: "row", alignItems: "center", gap: 14,
    ...Shadows.md,
  },
  avatarWrap: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 2.5, borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  avatarText: { color: Colors.white, fontSize: 20, fontWeight: "800" },
  onlineDot: {
    position: "absolute", bottom: 1, right: 1,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2, borderColor: Colors.brandDeep,
  },
  profileBody: { flex: 1 },
  profileName: { color: Colors.white, fontSize: 17, fontWeight: "800" },
  profileRole: { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 },
  tagsRow: { flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" },
  tag: { backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  tagText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  editBtn: {
    width: 34, height: 34, backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10, alignItems: "center", justifyContent: "center",
  },

  version: { alignItems: "center", paddingVertical: 8 },
  versionText: { fontSize: 11, color: Colors.n400, fontWeight: "600" },
  versionCopy: { fontSize: 11, color: Colors.n300, marginTop: 2 },
});
