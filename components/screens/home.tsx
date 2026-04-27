import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CURRENT_STUDENT, QUICK_ICONS } from "../../constants/mockdata";
import {
  Colors as C,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from "../../constants/tokens";
import type { TabName } from "../ui/BottomNav";
import { Badge, Card, IconPill } from "../ui/shared";

interface HomeProps {
  setActive: (tab: TabName) => void;
  teacherReply?: string | null;
}

const Home: React.FC<HomeProps> = ({ setActive, teacherReply }) => {
  const router = useRouter();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const initials = CURRENT_STUDENT.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Topbar ─────────────────────────────────────────────── */}
        <View style={styles.topbar}>

          {/* Tappable avatar → /profile */}
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            activeOpacity={0.75}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {greeting}, {CURRENT_STUDENT.name.split(" ")[0]} 👋
            </Text>
            <Text style={styles.section}>
              {CURRENT_STUDENT.section} · {CURRENT_STUDENT.teacher}
            </Text>
          </View>

          <Badge color="purple">Online</Badge>
        </View>

        {/* ── Teacher reply banner ────────────────────────────────── */}
        {teacherReply && (
          <View style={styles.replyBanner}>
            <Text style={styles.replyLabel}>Teacher replied</Text>
            <Text style={styles.replyText}>{teacherReply}</Text>
          </View>
        )}

        {/* ── Quick express ───────────────────────────────────────── */}
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

        {/* ── CTA — stacked full-width cards ─────────────────────── */}
        <View style={styles.ctaRow}>
          {[
            { label: "🗣  Full AAC board", tab: "board"    as TabName },
            { label: "💬  View messages",  tab: "messages" as TabName },
            { label: "📝  Live CC",        tab: "livecc"   as TabName },
          ].map((cta) => (
            <TouchableOpacity
              key={cta.tab}
              style={styles.ctaBtn}
              activeOpacity={0.75}
              onPress={() => setActive(cta.tab)}
            >
              <Text style={styles.ctaText}>{cta.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Today's session ─────────────────────────────────────── */}
        <Card>
          <Text style={styles.cardTitle}>{"Today's session"}</Text>
          {[
            { lbl: "Subject", val: "Science"               },
            { lbl: "Teacher", val: CURRENT_STUDENT.teacher },
            { lbl: "Section", val: CURRENT_STUDENT.section },
          ].map((r) => (
            <View key={r.lbl} style={styles.infoRow}>
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
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { padding: Spacing.lg, gap: 14, paddingBottom: 32 },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },

  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.purple ?? "#7C5CBF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  greeting: { fontSize: FontSize.base, fontWeight: "600", color: C.text },
  section:  { fontSize: FontSize.xs, color: C.text3, marginTop: 1 },

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
  cardSub:   { fontSize: FontSize.xs, color: C.purple, fontWeight: "600" },

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

export default Home;
