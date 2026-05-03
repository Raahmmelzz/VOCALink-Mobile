import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { QUICK_ICONS } from "../../constants/mockdata";
import {
  Colors as C,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from "../../constants/tokens";
import type { TabName } from "../ui/BottomNav";
import { Badge, Card, IconPill } from "../ui/shared"; // ← already correct

const LoginLogo = () => (
  <View style={logoStyles.wrapper}>
    <View style={logoStyles.outer}>
      <View style={logoStyles.middle}>
        <View style={logoStyles.dot} />
      </View>
    </View>
  </View>
);

interface HomeProps {
  setActive: (tab: TabName) => void;
  teacherReply?: string | null;
}

const Home: React.FC<HomeProps> = ({ setActive, teacherReply }) => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const rawUsername = user?.username;
  const usernameIsEmail = rawUsername?.includes("@");
  const displayName = user?.first_name || (!usernameIsEmail ? rawUsername : null) || "there";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <LoginLogo />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {greeting}, {displayName} 👋
          </Text>
          <Text style={styles.headerSub}>
            {user?.department ?? "VocaLink"}
          </Text>
        </View>
        <Badge color="purple">Online</Badge>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Teacher reply notification */}
        {teacherReply && (
          <View style={styles.replyBanner}>
            <Text style={styles.replyLabel}>Teacher replied</Text>
            <Text style={styles.replyText}>{teacherReply}</Text>
          </View>
        )}

        {/* Quick express */}
        <Card style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Quick express</Text>
            <Text style={styles.cardSub} onPress={() => setActive("board")}>
              See all →
            </Text>
          </View>
          <View style={styles.iconGrid}>
            {QUICK_ICONS.map((icon) => (
              <IconPill
                key={icon.id}
                emoji={icon.emoji}
                label={icon.label}
                bg={icon.bg}
                size="md"
                onPress={() => setActive("board")}
              />
            ))}
          </View>
        </Card>

        {/* Open full board CTA */}
        <View style={styles.ctaRow}>
          {[
            { label: "🗣  Full AAC board", tab: "board" as TabName },
            { label: "💬  View messages", tab: "messages" as TabName },
            { label: "📝  Live CC", tab: "livecc" as TabName },
          ].map((cta) => (
            <View key={cta.tab} style={styles.ctaBtn}>
              <Text style={styles.ctaText} onPress={() => setActive(cta.tab)}>
                {cta.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Session info card */}
        <Card>
          <Text style={styles.cardTitle}>{"Today's session"}</Text>
          {[
            { lbl: "Session Type", val: "General Classroom Communication" },
            { lbl: "Username", val: user?.username ?? "—" },
            { lbl: "Department", val: user?.department ?? "—" },
          ].map((r, i) => (
            <View key={i} style={styles.infoRow}>
              <Text style={styles.infoLbl}>{r.lbl}</Text>
              <Text style={styles.infoVal}>{r.val}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: Spacing.lg, gap: 14, paddingBottom: 32 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: C.gray2,
    backgroundColor: C.white,
  },
  headerTitle: { fontSize: FontSize.base, fontWeight: "600", color: C.text },
  headerSub: { fontSize: FontSize.xs, color: C.text3, marginTop: 1 },

  replyBanner: {
    backgroundColor: C.tealLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: C.tealBorder,
  },
  replyLabel: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: C.teal,
    marginBottom: 2,
  },
  replyText: { fontSize: FontSize.sm, color: C.text, fontWeight: "500" },

  card: {},
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cardTitle: { fontSize: FontSize.base, fontWeight: "600", color: C.text },
  cardSub: { fontSize: FontSize.xs, color: C.purple, fontWeight: "600" },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },

  ctaRow: { gap: 8 },
  ctaBtn: {
    backgroundColor: C.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: C.gray2,
    ...Shadow.sm,
  },
  ctaText: { fontSize: FontSize.base, color: C.text, fontWeight: "500" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLbl: { fontSize: FontSize.sm, color: C.text3 },
  infoVal: { fontSize: FontSize.sm, color: C.text, fontWeight: "500" },
});

const logoStyles = StyleSheet.create({
  wrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(26,173,220,0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(26,173,220,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  outer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1AADDC",
    justifyContent: "center",
    alignItems: "center",
  },
  middle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#1AADDC",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1AADDC",
  },
});

export default Home;
