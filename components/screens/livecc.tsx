import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { ScreenHeader } from "../ui/ScreenHeader";
import { FontSize, Radius, Spacing } from "../../constants/tokens";
import { AAC_ICONS } from "../../constants/mockdata";
import type { AACIcon } from "../../constants/types";

interface CCLine {
  id: number;
  text: string;
  speaker: string;
  time: string;
}

interface Props {
  setActive: (tab: string) => void;
}

const LiveCC: React.FC<Props> = ({ setActive }) => {
  const { token, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [lines, setLines] = useState<CCLine[]>([]);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [predictions, setPredictions] = useState<AACIcon[]>([]);

  const teacherName = (user as any)?.teacher_name || "Teacher";
  const lastIdRef = useRef(0);

  // Load LSTM icon suggestions on mount
  useEffect(() => {
    if (!token) return;
    axios
      .post(
        `${API_BASE_URL}/predict-next/`,
        { sequence: [], top_k: 3 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const ids: string[] = res.data.predictions ?? [];
        const icons = ids
          .map((id) => AAC_ICONS.find((i) => i.id === id))
          .filter(Boolean) as AACIcon[];
        setPredictions(icons);
      })
      .catch(() => {});
  }, [token]);

  // Poll teacher captions every 1.5s
  useEffect(() => {
    if (!token) return;
    let stopped = false;

    const poll = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/cc/messages/?since=${lastIdRef.current}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (stopped) return;
        setConnected(true);
        setIsConnecting(false);
        const msgs: any[] = res.data;
        if (msgs.length > 0) {
          lastIdRef.current = msgs[msgs.length - 1].id;
          setLines((prev) => [
            ...prev,
            ...msgs.map((m) => ({
              id: m.id,
              text: m.text,
              speaker: m.speaker || "teacher",
              time: m.sent_at
                ? m.sent_at.slice(11, 16)
                : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            })),
          ]);
        }
      } catch {
        if (stopped) return;
        setConnected(false);
        setIsConnecting(false);
      }
    };

    poll();
    const interval = setInterval(poll, 1500);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [token]);

  const teacherLines = lines.filter((l) => l.speaker === "teacher").slice(-6);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScreenHeader
        title="Live Captions"
        subtitle={
          isConnecting
            ? "○ Connecting..."
            : connected
            ? `● Live from ${teacherName || "Teacher"}`
            : "○ Reconnecting to class..."
        }
      />

      {/* Captions area */}
      <View style={styles.ccContainer}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {teacherLines.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {isConnecting
                  ? "Connecting..."
                  : connected
                  ? `Waiting for ${teacherName} to speak...`
                  : "Reconnecting to class..."}
              </Text>
            </View>
          ) : (
            teacherLines.map((line, i) => {
              const isLatest = i === teacherLines.length - 1;
              const opacity = isLatest
                ? 1
                : 0.4 + (i / Math.max(teacherLines.length, 1)) * 0.4;
              return (
                <View key={line.id} style={[styles.ccRow, { opacity }]}>
                  {isLatest && <View style={styles.activeIndicator} />}
                  <Text style={[styles.ccText, isLatest && styles.ccTextLatest]}>
                    {line.text}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* LSTM icon suggestions — tap to open AAC Board */}
      {predictions.length > 0 && (
        <View style={styles.suggestWrap}>
          <Text style={styles.suggestLabel}>Suggestions</Text>
          <View style={styles.suggestRow}>
            {predictions.map((icon) => (
              <TouchableOpacity
                key={icon.id}
                style={[styles.iconChip, { backgroundColor: icon.bg }]}
                onPress={() => setActive("board")}
              >
                <Text style={styles.iconEmoji}>{icon.emoji}</Text>
                <Text style={styles.iconLabel}>{icon.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#202124" },

  ccContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  feed: { padding: Spacing.lg, gap: 12, justifyContent: "flex-end", flexGrow: 1 },

  emptyWrap: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: FontSize.md, color: "#9AA0A6", fontStyle: "italic" },

  ccRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  activeIndicator: {
    width: 4,
    height: "100%",
    backgroundColor: "#8AB4F8",
    position: "absolute",
    left: -2,
    borderRadius: 2,
  },
  ccText: {
    fontSize: 24,
    color: "#E8EAED",
    lineHeight: 32,
    fontWeight: "500",
  },
  ccTextLatest: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // LSTM suggestions strip
  suggestWrap: {
    borderTopWidth: 1,
    borderTopColor: "#3C4043",
    backgroundColor: "#2D2F31",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  suggestLabel: {
    fontSize: FontSize.xs,
    color: "#9AA0A6",
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  suggestRow: {
    flexDirection: "row",
    gap: 10,
  },
  iconChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: Radius.md,
    gap: 4,
  },
  iconEmoji: { fontSize: 28 },
  iconLabel: { fontSize: FontSize.xs, color: "#1A1A2E", fontWeight: "700" },
});

export default LiveCC;
