import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import {
  Colors as C,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from "../../constants/tokens";
import { Badge } from "../ui/shared";

const WS_URL = "wss://vocalink-fastapi.onrender.com/ws/cc";


interface CCLine {
  text: string;
  speaker: string;
  time: string;
}

const LiveCC: React.FC = () => {
  const { token } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [lines, setLines] = useState<CCLine[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        // Send token as first message for authentication
        ws.send(token);
        setConnected(true);
        console.log("✅ WebSocket connected");
      };

      ws.onmessage = (e) => {
        try {
          const msg: CCLine = JSON.parse(e.data);
          setLines((prev) => [...prev, msg]);
          // Auto-scroll to bottom
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        } catch {
          console.log("Failed to parse WS message:", e.data);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        console.log("🔌 WebSocket disconnected — retrying in 3s");
        // Auto-reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      ws.onerror = (e) => {
        console.log("WebSocket error:", e);
        ws.close();
      };
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [token]);

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
        <Badge color={connected ? "teal" : "gray"}>
          {connected ? "Live" : "Connecting..."}
        </Badge>
      </View>

      {/* CC feed */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
      >
        {lines.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              Waiting for teacher to speak...
            </Text>
          </View>
        ) : (
          lines.map((line, i) => {
            const isTeacher = line.speaker === "teacher";
            const isLatest = i === lines.length - 1;
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
                      isTeacher
                        ? styles.ccSpeakerTeacher
                        : styles.ccSpeakerReply,
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
          })
        )}

        {/* Live indicator */}
        <View style={styles.liveRow}>
          <View style={[styles.liveDot, connected && styles.liveDotActive]} />
          <Text style={styles.liveText}>
            {connected
              ? "Connected — captions will appear here"
              : "Reconnecting..."}
          </Text>
        </View>
      </ScrollView>

      {/* Info footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📱 Captions auto-scroll as your teacher speaks.
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

  emptyWrap: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: FontSize.sm, color: C.text3 },

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
    backgroundColor: C.gray2,
  },
  liveDotActive: {
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
