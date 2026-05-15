import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { ScreenHeader } from "../ui/ScreenHeader";
import { Colors as C, FontSize, Radius, Spacing } from "../../constants/tokens";

interface CCLine {
  id: number;
  text: string;
  speaker: string;   // "teacher" | "student"
  time: string;
  isOwn?: boolean;   // true when this student sent it
}

// ✅ Quick-reply chips students can tap instead of typing
const QUICK_REPLIES = [
  "I need help ✋",
  "I don't understand ❓",
  "I am done 📖",
  "Thank you 🙏",
];

const LiveCC: React.FC = () => {
  const { token, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [lines, setLines] = useState<CCLine[]>([]);
  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // ✅ FIX: Get teacher info from the profile endpoint so we can send replies
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const teacherName = (user as any)?.teacher_name || "Teacher";

  // Fetch profile once to get teacher_id for sending replies
  useEffect(() => {
    if (!token) return;
    axios.get(`${API_BASE_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data.teacher_id) setTeacherId(res.data.teacher_id);
      })
      .catch(() => {});
  }, [token]);

  // ✅ FIX: This now connects to the same room_manager the teacher is in.
  // The old code used the orphaned `manager` — students and teacher were in separate rooms.
  useEffect(() => {
    if (!token) return;

    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connectWebSocket = () => {
      const wsUrl = API_BASE_URL.replace(/^http/, "ws").replace(/\/api\/?$/, "/ws/cc");
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        ws.send(token);
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Presence updates (user count) — no visible UI for student, just log
          if (data.type === "presence") return;

          if (data.type === "message") {
            const newLine: CCLine = {
              id: Date.now(),
              text: data.text,
              speaker: data.speaker,
              time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              // Mark as "own" if the student's own user_id sent it
              isOwn: data.sender_id === (user as any)?.id,
            };
            setLines((prev) => [...prev, newLine]);
          }
        } catch (e) {
          console.log("Error parsing websocket message");
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        setConnected(false);
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [token]);

  // ✅ NEW: Student sends a reply to the teacher via the Messages API
  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !teacherId) return;

    setIsSending(true);
    setInput("");

    // Optimistically add to the local feed
    const optimistic: CCLine = {
      id: Date.now(),
      text: trimmed,
      speaker: "student",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setLines((prev) => [...prev, optimistic]);

    try {
      await axios.post(
        `${API_BASE_URL}/messages/`,
        { receiver_id: teacherId, text: trimmed, is_aac: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.error("Failed to send reply:", e);
    } finally {
      setIsSending(false);
    }
  };

  // G-Meet style: show the last 6 teacher lines, plus all student replies below
  const teacherLines = lines.filter((l) => l.speaker === "teacher").slice(-6);
  const studentLines = lines.filter((l) => l.speaker !== "teacher");
  const visibleLines = [...teacherLines, ...studentLines].sort((a, b) => a.id - b.id);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

        {/* Header */}
        <ScreenHeader
          title="Live Captions"
          subtitle={connected ? `● Live from ${teacherName || "Teacher"}` : "○ Reconnecting to class..."}
        />

        {/* Captions area */}
        <View style={styles.ccContainer}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.feed}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {visibleLines.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Waiting for {teacherName} to speak...</Text>
              </View>
            ) : (
              visibleLines.map((line, i) => {
                const isTeacher = line.speaker === "teacher";
                const isLatest = isTeacher && i === teacherLines.length - 1;
                const opacity = isTeacher
                  ? isLatest ? 1 : 0.4 + (i / Math.max(teacherLines.length, 1)) * 0.4
                  : 1;

                if (isTeacher) {
                  // G-Meet style caption row
                  return (
                    <View key={line.id} style={[styles.ccRow, { opacity }]}>
                      {isLatest && <View style={styles.activeIndicator} />}
                      <Text style={[styles.ccText, isLatest && styles.ccTextLatest]}>
                        {line.text}
                      </Text>
                    </View>
                  );
                }

                // ✅ Student reply bubble
                return (
                  <View key={line.id} style={[styles.replyRow, line.isOwn && styles.replyRowOwn]}>
                    <View style={[styles.replyBubble, line.isOwn && styles.replyBubbleOwn]}>
                      {!line.isOwn && (
                        <Text style={styles.replySender}>🎓 Student</Text>
                      )}
                      <Text style={[styles.replyText, line.isOwn && styles.replyTextOwn]}>
                        {line.text}
                      </Text>
                      <Text style={[styles.replyTime, line.isOwn && styles.replyTimeOwn]}>
                        {line.time}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* ✅ NEW: Quick reply chips */}
        <View style={styles.quickWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRow}
          >
            {QUICK_REPLIES.map((q, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSend(q)}
                style={styles.quickChip}
              >
                <Text style={styles.quickChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ✅ NEW: Reply input bar */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Reply to teacher..."
            placeholderTextColor="#9AA0A6"
            onSubmitEditing={() => handleSend(input)}
            style={styles.input}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={() => handleSend(input)}
            disabled={!input.trim() || isSending || !teacherId}
            style={[styles.sendBtn, (!input.trim() || isSending || !teacherId) && styles.sendBtnDisabled]}
          >
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#202124" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#3C4043",
    backgroundColor: "#202124",
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: "700", color: "#FFFFFF" },
  headerSub: { fontSize: FontSize.sm, color: "#9AA0A6", marginTop: 4, fontWeight: "600" },

  ccContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  feed: { padding: Spacing.lg, gap: 12, justifyContent: "flex-end", flexGrow: 1 },

  emptyWrap: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: FontSize.md, color: "#9AA0A6", fontStyle: "italic" },

  // Teacher caption rows (G-Meet style)
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

  // ✅ Student reply bubbles
  replyRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 4,
  },
  replyRowOwn: {
    justifyContent: "flex-end",
  },
  replyBubble: {
    maxWidth: "75%",
    backgroundColor: "#2D2F31",
    borderRadius: Radius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3C4043",
  },
  replyBubbleOwn: {
    backgroundColor: "#1A73E8",
    borderColor: "#1A73E8",
  },
  replySender: {
    fontSize: FontSize.xs,
    color: "#9AA0A6",
    marginBottom: 3,
    fontWeight: "600",
  },
  replyText: {
    fontSize: FontSize.base,
    color: "#E8EAED",
    lineHeight: 20,
  },
  replyTextOwn: { color: "#FFFFFF" },
  replyTime: {
    fontSize: 10,
    color: "#9AA0A6",
    marginTop: 4,
  },
  replyTimeOwn: { color: "rgba(255,255,255,0.6)" },

  // Quick replies
  quickWrap: {
    maxHeight: 46,
    borderTopWidth: 1,
    borderTopColor: "#3C4043",
    backgroundColor: "#2D2F31",
  },
  quickRow: {
    paddingHorizontal: Spacing.md,
    gap: 6,
    alignItems: "center",
    paddingVertical: 6,
  },
  quickChip: {
    backgroundColor: "#3C4043",
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  quickChipText: { fontSize: FontSize.xs, color: "#E8EAED", fontWeight: "600" },

  // Input bar
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: Spacing.md,
    backgroundColor: "#2D2F31",
    borderTopWidth: 1,
    borderTopColor: "#3C4043",
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: "#3C4043",
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.base,
    color: "#E8EAED",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: "#1A73E8",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "#3C4043" },
  sendBtnText: { fontSize: FontSize.lg, color: "#FFFFFF", fontWeight: "700" },
});

export default LiveCC;