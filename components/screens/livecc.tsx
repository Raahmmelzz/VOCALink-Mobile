import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CC_LINES } from "../../constants/mockdata";
import {
  Colors as C,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from "../../constants/tokens";
import { Badge } from "../ui/shared";

const LiveCC: React.FC = () => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Live Closed Captions</Text>
          <Text style={styles.headerSub}>
            {"Teacher's"} speech appears here in real time
          </Text>
        </View>
        <Badge color="teal">Live</Badge>
      </View>

      {/* CC feed */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
      >
        {CC_LINES.map((line, i) => {
          const isTeacher = line.speaker === "teacher";
          const isLatest = i === CC_LINES.length - 1;
          return (
            <View
              key={i}
              style={[
                styles.ccCard,
                isTeacher ? styles.ccCardTeacher : styles.ccCardReply,
                isLatest && styles.ccCardLatest,
              ]}
            >
              <View style={styles.ccTop}>
                <Text
                  style={[
                    styles.ccSpeaker,
                    isTeacher ? styles.ccSpeakerTeacher : styles.ccSpeakerReply,
                  ]}
                >
                  {isTeacher ? "👩‍🏫 Teacher" : "✉️ Teacher replied"}
                </Text>
                <Text style={styles.ccTime}>{line.time}</Text>
              </View>
              <Text style={[styles.ccText, isLatest && styles.ccTextLatest]}>
                {line.text}
              </Text>
            </View>
          );
        })}

        {/* Live indicator */}
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Waiting for teacher to speak...</Text>
        </View>
      </ScrollView>

      {/* Info footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📱 Captions auto-scroll as your teacher speaks. Tap any card to
          replay.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.gray2,
    backgroundColor: C.white,
  },
  headerTitle: { fontSize: FontSize.md, fontWeight: "700", color: C.text },
  headerSub: { fontSize: FontSize.xs, color: C.text3, marginTop: 2 },

  feed: { padding: Spacing.lg, gap: 10, paddingBottom: 16 },

  ccCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    ...Shadow.sm,
  },
  ccCardTeacher: { backgroundColor: C.tealLight, borderColor: C.tealBorder },
  ccCardReply: { backgroundColor: C.gray, borderColor: C.gray2 },
  ccCardLatest: { borderWidth: 2, borderColor: C.teal, ...Shadow.md },

  ccTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  ccSpeaker: { fontSize: FontSize.xs, fontWeight: "600" },
  ccSpeakerTeacher: { color: C.teal },
  ccSpeakerReply: { color: C.text3 },
  ccTime: { fontSize: FontSize.xs, color: C.text3 },

  ccText: { fontSize: FontSize.base, color: C.text2, lineHeight: 22 },
  ccTextLatest: { color: C.text, fontWeight: "500", fontSize: FontSize.md },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: Spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.tealMid,
  },
  liveText: { fontSize: FontSize.xs, color: C.text3 },

  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
    backgroundColor: C.white,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: C.text3,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default LiveCC;
