// Replace all imports at the top with these corrected paths:
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
import VocaLinkLogo from "../ui/VocaLinkLogo"; // ← was ../../components/ui/
import { Badge, Card, IconPill } from "../ui/shared"; // ← already correct

interface HomeProps {
  setActive: (tab: TabName) => void;
  teacherReply?: string | null;
  currentUser?: { name: string; status: string } | null;
}

const Home: React.FC<HomeProps> = ({ setActive, teacherReply, currentUser }) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = currentUser?.name ?? CURRENT_STUDENT.name.split(" ")[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Topbar */}
        <View style={styles.topbar}>
          <VocaLinkLogo size={28} showLabel={false} />
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {greeting}, {displayName} 👋
            </Text>
            <Text style={styles.section}>
              {CURRENT_STUDENT.section} · {CURRENT_STUDENT.teacher}
            </Text>
          </View>
          <Badge color="purple">Online</Badge>
        </View>

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
            { lbl: "Subject", val: "Science" },
            { lbl: "Teacher", val: CURRENT_STUDENT.teacher },
            { lbl: "Section", val: CURRENT_STUDENT.section },
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

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  greeting: { fontSize: FontSize.base, fontWeight: "600", color: C.text },
  section: { fontSize: FontSize.xs, color: C.text3, marginTop: 1 },

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

export default Home;
