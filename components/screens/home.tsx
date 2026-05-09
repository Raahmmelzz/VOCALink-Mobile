import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { QUICK_ICONS } from "../../constants/mockdata";
import { Colors as C, FontSize, Radius, Shadow, Spacing } from "../../constants/tokens";
import type { TabName } from "../ui/BottomNav";
import { Badge, IconPill } from "../ui/shared";

interface HomeProps {
  setActive: (tab: TabName) => void;
  teacherReply?: string | null;
}

const CTAButton: React.FC<{
  emoji: string;
  label: string;
  sub: string;
  color: string;
  onPress: () => void;
}> = ({ emoji, label, sub, color, onPress }) => (
  <TouchableOpacity
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
    activeOpacity={0.85}
    style={[styles.ctaCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
  >
    <Text style={styles.ctaEmoji}>{emoji}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.ctaLabel}>{label}</Text>
      <Text style={styles.ctaSub}>{sub}</Text>
    </View>
    <Text style={[styles.ctaArrow, { color }]}>›</Text>
  </TouchableOpacity>
);

const Home: React.FC<HomeProps> = ({ setActive, teacherReply }) => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const rawUsername = user?.username;
  const usernameIsEmail = rawUsername?.includes("@");
  const displayName = user?.first_name || (!usernameIsEmail ? rawUsername : null) || "there";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero header */}
        <LinearGradient
          colors={["#0F172A", "#1E293B", "#0E8DB8"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Badge color="teal" style={{ marginBottom: 10 }}>Online</Badge>
          <Text style={styles.heroGreeting}>{greeting},</Text>
          <Text style={styles.heroName}>{displayName} 👋</Text>
          <Text style={styles.heroSub}>
            {user?.teacher_name ? `Your teacher: ${user.teacher_name}` : "VocaLink — Your voice matters"}
          </Text>
        </LinearGradient>

        {/* Teacher reply notification */}
        {teacherReply && (
          <View style={styles.replyBanner}>
            <Text style={styles.replyIcon}>👩‍🏫</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.replyLabel}>Teacher says:</Text>
              <Text style={styles.replyText}>{teacherReply}</Text>
            </View>
          </View>
        )}

        {/* Quick express */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Quick Express</Text>
            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); setActive("board"); }}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickGrid}>
            {QUICK_ICONS.map(icon => (
              <IconPill
                key={icon.id}
                emoji={icon.emoji}
                label={icon.label}
                bg={icon.bg}
                size="lg"
                onPress={() => setActive("board")}
              />
            ))}
          </View>
        </View>

        {/* Navigation shortcuts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Go to</Text>
          <View style={styles.ctaList}>
            <CTAButton
              emoji="🗣"
              label="Full AAC Board"
              sub="Tap icons to communicate"
              color={C.purple}
              onPress={() => setActive("board")}
            />
            <CTAButton
              emoji="💬"
              label="Messages"
              sub="View your conversations"
              color={C.teal}
              onPress={() => setActive("messages")}
            />
            <CTAButton
              emoji="📝"
              label="Live Captions"
              sub="See what teacher is saying"
              color="#22C55E"
              onPress={() => setActive("livecc")}
            />
          </View>
        </View>

        {/* Student info card */}
        <View style={[styles.section, styles.infoCard]}>
          <Text style={styles.infoTitle}>My Info</Text>
          {[
            { icon: "👤", lbl: "Name",       val: displayName },
            { icon: "🏷", lbl: "Username",   val: user?.username ?? "—" },
            { icon: "📚", lbl: "Department", val: user?.department ?? "—" },
          ].map((r, i) => (
            <View key={i} style={styles.infoRow}>
              <Text style={styles.infoIcon}>{r.icon}</Text>
              <Text style={styles.infoLbl}>{r.lbl}</Text>
              <Text style={styles.infoVal}>{r.val}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 40 },

  // ── Hero ──
  hero: {
    padding: Spacing.xl, paddingTop: Spacing.xxl, paddingBottom: Spacing.xxl,
  },
  heroGreeting: { fontSize: FontSize.base, color: "rgba(255,255,255,0.6)", fontWeight: "500", marginTop: 4 },
  heroName:     { fontSize: FontSize.xxl, color: "#FFFFFF", fontWeight: "800", letterSpacing: -1, marginTop: 4 },
  heroSub:      { fontSize: FontSize.sm,  color: "rgba(255,255,255,0.5)", marginTop: 8, fontWeight: "500" },

  // ── Teacher reply ──
  replyBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    margin: Spacing.lg, padding: Spacing.lg,
    backgroundColor: C.tealLight, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: C.tealBorder, ...Shadow.sm,
  },
  replyIcon:  { fontSize: 28 },
  replyLabel: { fontSize: FontSize.xs, fontWeight: "700", color: C.tealMid, marginBottom: 4 },
  replyText:  { fontSize: FontSize.md, color: C.text, fontWeight: "600" },

  // ── Sections ──
  section:     { padding: Spacing.lg, gap: 14 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle:{ fontSize: FontSize.lg, fontWeight: "800", color: C.text, letterSpacing: -0.5 },
  seeAllBtn:   { backgroundColor: C.purpleLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  seeAllText:  { fontSize: FontSize.sm, color: C.purple, fontWeight: "700" },

  // ── Quick icon grid ──
  quickGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 14, justifyContent: "space-around",
    backgroundColor: C.white, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: C.gray2, ...Shadow.sm,
  },

  // ── CTA buttons ──
  ctaList: { gap: 10 },
  ctaCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: C.white, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: C.gray2, minHeight: 72, ...Shadow.sm,
  },
  ctaEmoji: { fontSize: 28 },
  ctaLabel: { fontSize: FontSize.md, fontWeight: "700", color: C.text },
  ctaSub:   { fontSize: FontSize.xs, color: C.text3, marginTop: 2, fontWeight: "500" },
  ctaArrow: { fontSize: 28, fontWeight: "300" },

  // ── Info card ──
  infoCard: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    backgroundColor: C.white, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: C.gray2, ...Shadow.sm,
  },
  infoTitle: { fontSize: FontSize.md, fontWeight: "700", color: C.text, marginBottom: 12 },
  infoRow:   { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.gray },
  infoIcon:  { fontSize: 20 },
  infoLbl:   { fontSize: FontSize.sm, color: C.text3, flex: 1, fontWeight: "500" },
  infoVal:   { fontSize: FontSize.sm, color: C.text, fontWeight: "700" },
});

export default Home;
