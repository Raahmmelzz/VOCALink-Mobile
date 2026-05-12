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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { Colors as C, FontSize, Radius, Shadow, Spacing } from "../../constants/tokens";

interface Props {
  setActive: (tab: any) => void;
}

interface CCLine {
  id: number;
  text: string;
  speaker: string;  // "teacher" | "student"
  senderName?: string;
  time: string;
}

export default function TeacherLiveCC({ setActive }: Props) {
  const { token } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [lines, setLines] = useState<CCLine[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    // ✅ FIX: /api/broadcast/ now requires auth, so we pass the token in the WS handshake
    // so the server knows who is connecting for presence tracking.
    const wsUrl = API_BASE_URL.replace(/^http/, "ws").replace(/\/api\/?$/, "/ws/cc");
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => ws.send(token);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "presence") {
          // Subtract 1 so the teacher doesn't count themselves
          setStudentCount(Math.max(0, data.count - 1));
        } else if (data.type === "message") {
          const newLine: CCLine = {
            id: Date.now(),
            text: data.text,
            speaker: data.speaker,
            senderName: data.sender_name,
            time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setLines((prev) => [...prev, newLine]);
        }
      } catch (e) {
        console.log("Error parsing websocket message:", e);
      }
    };

    ws.onerror = () => console.log("WebSocket error");
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [token]);

  // ✅ FIX: Now passes auth header — the backend now requires it to prevent anonymous broadcasts
  const broadcastMessage = async () => {
    if (!input.trim()) return;
    setIsSending(true);
    const textToSend = input;
    setInput("");

    try {
      await axios.post(
        `${API_BASE_URL}/broadcast/`,
        { text: textToSend, speaker: "teacher" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      Alert.alert("Error", "Failed to broadcast. Please check your connection.");
      setInput(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const handleEndSession = () => {
    Alert.alert(
      "End Class",
      "Are you sure you want to end the session and disconnect all students?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.post(`${API_BASE_URL}/sessions/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setActive("home");
            } catch (error) {
              Alert.alert("Error", "Could not end session. Try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Live Class Room</Text>
            <Text style={styles.headerSub}>
              🟢 {studentCount === 1 ? "1 Student" : `${studentCount} Students`} Connected
            </Text>
          </View>
          <TouchableOpacity onPress={handleEndSession} style={styles.endBtn}>
            <Text style={styles.endBtnText}>End Class</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {lines.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>The room is empty. Start speaking!</Text>
            </View>
          ) : (
            lines.map((line) => {
              const isTeacher = line.speaker === "teacher";
              return (
                <View key={line.id} style={[styles.ccCard, isTeacher ? styles.ccCardTeacher : styles.ccCardStudent]}>
                  <View style={styles.ccTop}>
                    <Text style={[styles.ccSpeaker, isTeacher ? styles.ccSpeakerTeacher : styles.ccSpeakerStudent]}>
                      {isTeacher ? "👨‍🏫 You" : `🎓 ${line.senderName || "Student"}`}
                    </Text>
                    <Text style={styles.ccTime}>{line.time}</Text>
                  </View>
                  <Text style={styles.ccText}>{line.text}</Text>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* ✅ NOTE: Student replies sent via /api/messages/ show up in the Messages tab.
            To see them here in real-time, you would extend the WebSocket server to broadcast
            student messages to the teacher's WS connection as well. That's a future enhancement. */}
        <View style={styles.replyNote}>
          <Text style={styles.replyNoteText}>
            💬 Student replies appear in your Messages tab
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Dictate or type your lesson here..."
            placeholderTextColor={C.text3}
            multiline
            style={styles.largeInput}
          />
          <TouchableOpacity
            onPress={broadcastMessage}
            disabled={!input.trim() || isSending}
            style={[styles.sendBtn, (!input.trim() || isSending) && styles.sendBtnDisabled]}
          >
            <Text style={styles.sendBtnText}>{isSending ? "..." : "Send"}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: C.gray2,
    backgroundColor: C.white,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: "800", color: C.text },
  headerSub: { fontSize: FontSize.sm, color: "#047857", marginTop: 2, fontWeight: "600" },
  endBtn: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  endBtnText: { color: C.white, fontWeight: "800", fontSize: FontSize.sm },
  feed: { padding: Spacing.lg, gap: 12, paddingBottom: 20 },
  emptyWrap: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: FontSize.md, color: C.text3, fontStyle: "italic" },
  ccCard: { borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, ...Shadow.sm },
  ccCardTeacher: { backgroundColor: C.tealLight, borderColor: C.tealBorder, marginLeft: 20 },
  ccCardStudent: { backgroundColor: C.white, borderColor: C.gray2, marginRight: 20 },
  ccTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  ccSpeaker: { fontSize: FontSize.xs, fontWeight: "700" },
  ccSpeakerTeacher: { color: C.teal },
  ccSpeakerStudent: { color: C.purple },
  ccTime: { fontSize: FontSize.xs, color: C.text3 },
  ccText: { fontSize: FontSize.base, color: C.text, lineHeight: 22 },
  replyNote: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    backgroundColor: C.purpleLight,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
  },
  replyNoteText: { fontSize: FontSize.xs, color: C.purple, fontWeight: "600", textAlign: "center" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: Spacing.md,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
    gap: 10,
  },
  largeInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: C.gray,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: C.text,
    paddingTop: 14,
  },
  sendBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: Radius.md,
    backgroundColor: C.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: C.gray3 },
  sendBtnText: { fontSize: FontSize.md, color: C.white, fontWeight: "700" },
});