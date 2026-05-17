/**
 * livecc.tsx  — STUDENT SCREEN, POLLING VERSION
 *
 * Polls GET /api/cc/messages/?since=<id> every 1.5 s.
 * The backend scopes results to the student's assigned teacher
 * and only returns messages while the session is active.
 *
 * Students can also send quick replies / typed messages back
 * via POST /api/messages/ (the direct-messages endpoint).
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { ScreenHeader } from "../ui/ScreenHeader";
import { Colors as C, FontSize, Radius, Spacing } from "../../constants/tokens";

const POLL_MS = 1500;

const QUICK_REPLIES = [
  "I need help ✋",
  "I don't understand ❓",
  "I am done 📖",
  "Thank you 🙏",
];

// AAC icon tray — shown in the live session so students can tap without leaving
const LIVE_ICONS = [
  { id: "help",     emoji: "✋", label: "Help me",  msg: "Help me!",        bg: "#FAEEDA" },
  { id: "yes",      emoji: "✅", label: "Yes",       msg: "Yes",             bg: "#E1F5EE" },
  { id: "no",       emoji: "❌", label: "No",        msg: "No",              bg: "#FCEBEB" },
  { id: "done",     emoji: "📖", label: "Done",      msg: "I'm done",        bg: "#E1F5EE" },
  { id: "question", emoji: "❓", label: "Question",  msg: "I have a question", bg: "#E6F1FB" },
  { id: "repeat",   emoji: "🔁", label: "Repeat",    msg: "Please repeat",   bg: "#EEEDFE" },
  { id: "wait",     emoji: "⏳", label: "Wait",      msg: "Wait please",     bg: "#FAEEDA" },
  { id: "confused", emoji: "😕", label: "Confused",  msg: "I'm confused",    bg: "#E1F5EE" },
];

interface CCLine {
  id:      number;
  text:    string;
  speaker: "teacher" | "student";
  time:    string;
  isOwn?:  boolean;
}

const LiveCC: React.FC = () => {
  const { token, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [lines, setLines]         = useState<CCLine[]>([]);
  const [input, setInput]         = useState("");
  const [isSending, setIsSending] = useState(false);
  const [connected, setConnected] = useState(false); // true = we got at least one successful poll
  const [teacherId, setTeacherId] = useState<number | null>(null);

  const teacherName = (user as any)?.teacher_name ?? "Teacher";
  const lastIdRef   = useRef<number>(0);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch teacher_id once so we can send replies ──────────────────────────
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE_URL}/profile/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (res.data.teacher_id) setTeacherId(res.data.teacher_id); })
      .catch(() => {});
  }, [token]);

  // ── Polling ───────────────────────────────────────────────────────────────
  const poll = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/cc/messages/?since=${lastIdRef.current}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const msgs: any[] = res.data;
      if (msgs.length > 0) {
        const formatted: CCLine[] = msgs.map((m) => ({
          id:      m.id,
          text:    m.text,
          speaker: (m.speaker ?? "teacher") as "teacher" | "student",
          time:    m.sent_at
            ? new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: false,
        }));
        setLines((prev) => [...prev, ...formatted]);
        lastIdRef.current = msgs[msgs.length - 1].id;
      }
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    poll();
    pollRef.current = setInterval(poll, POLL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [poll, token]);

  // ── Send a reply to the teacher ───────────────────────────────────────────
  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !teacherId || !token) return;

    setIsSending(true);
    setInput("");

    // Optimistic local update
    setLines((prev) => [
      ...prev,
      {
        id:      Date.now(),
        text:    trimmed,
        speaker: "student",
        time:    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn:   true,
      },
    ]);

    try {
      await axios.post(
        `${API_BASE_URL}/messages/`,
        { receiver_id: teacherId, text: trimmed, is_aac: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.error("Reply failed:", e);
    } finally {
      setIsSending(false);
    }
  };

  // G-Meet style: last 6 teacher captions fade older ones, student replies pinned below
  const teacherLines  = lines.filter((l) => l.speaker === "teacher");
  const studentLines  = lines.filter((l) => l.speaker !== "teacher");
  const visibleTeacher = teacherLines.slice(-6);
  const visible = [...visibleTeacher, ...studentLines].sort((a, b) => a.id - b.id);

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

        {/* Header */}
        <ScreenHeader
          title="Live Captions"
          subtitle={connected ? `● Live from ${teacherName || "Teacher"}` : "○ Reconnecting to class..."}
        />

        {/* Caption + reply area */}
        <View style={s.ccContainer}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={s.feed}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {visible.length === 0 ? (
              <View style={s.emptyWrap}>
                <Text style={s.emptyText}>Waiting for {teacherName} to speak…</Text>
              </View>
            ) : (
              visible.map((line, i) => {
                const isTeacher  = line.speaker === "teacher";
                const tIdx       = visibleTeacher.findIndex((l) => l.id === line.id);
                const isLatest   = isTeacher && tIdx === visibleTeacher.length - 1;
                const opacity    = isTeacher
                  ? (isLatest ? 1 : 0.35 + (tIdx / Math.max(visibleTeacher.length, 1)) * 0.45)
                  : 1;

                if (isTeacher) {
                  return (
                    <View key={line.id} style={[s.ccRow, { opacity }]}>
                      {isLatest && <View style={s.activeBar} />}
                      <Text style={[s.ccText, isLatest && s.ccTextLatest]}>
                        {line.text}
                      </Text>
                    </View>
                  );
                }

                // Student reply bubble
                return (
                  <View key={line.id} style={[s.replyRow, line.isOwn && s.replyRowOwn]}>
                    <View style={[s.replyBubble, line.isOwn && s.replyBubbleOwn]}>
                      {!line.isOwn && <Text style={s.replySender}>🎓 Student</Text>}
                      <Text style={[s.replyText, line.isOwn && s.replyTextOwn]}>{line.text}</Text>
                      <Text style={[s.replyTime, line.isOwn && s.replyTimeOwn]}>{line.time}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* AAC icon tray */}
        <View style={s.iconTrayWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.iconTrayRow}>
            {LIVE_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon.id}
                onPress={() => handleSend(icon.msg)}
                style={[s.iconTile, { backgroundColor: icon.bg }]}
                activeOpacity={0.75}
              >
                <Text style={s.iconTileEmoji}>{icon.emoji}</Text>
                <Text style={s.iconTileLabel}>{icon.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick reply chips */}
        <View style={s.quickWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.quickRow}>
            {QUICK_REPLIES.map((q, i) => (
              <TouchableOpacity key={i} onPress={() => handleSend(q)} style={s.quickChip}>
                <Text style={s.quickChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reply input */}
        <View style={s.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Reply to teacher…"
            placeholderTextColor="#9AA0A6"
            onSubmitEditing={() => handleSend(input)}
            style={s.input}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={() => handleSend(input)}
            disabled={!input.trim() || isSending || !teacherId}
            style={[s.sendBtn, (!input.trim() || isSending || !teacherId) && s.sendBtnDisabled]}
          >
            <Text style={s.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: "#202124" },
  header:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: "#3C4043", backgroundColor: "#202124" },
  headerTitle:     { fontSize: FontSize.lg, fontWeight: "700", color: "#FFF" },
  headerSub:       { fontSize: FontSize.sm, color: "#9AA0A6", marginTop: 4, fontWeight: "600" },
  ccContainer:     { flex: 1, justifyContent: "flex-end", paddingBottom: 8 },
  feed:            { padding: Spacing.lg, gap: 12, justifyContent: "flex-end", flexGrow: 1 },
  emptyWrap:       { alignItems: "center", marginTop: 60 },
  emptyText:       { fontSize: FontSize.md, color: "#9AA0A6", fontStyle: "italic", textAlign: "center" },
  // Teacher captions (G-Meet style)
  ccRow:           { flexDirection: "row", alignItems: "flex-start", paddingLeft: 10 },
  activeBar:       { width: 4, height: "100%", backgroundColor: "#8AB4F8", position: "absolute", left: -2, borderRadius: 2 },
  ccText:          { fontSize: 24, color: "#E8EAED", lineHeight: 32, fontWeight: "500" },
  ccTextLatest:    { color: "#FFF", fontWeight: "700" },
  // Student replies
  replyRow:        { flexDirection: "row", justifyContent: "flex-start", marginTop: 4 },
  replyRowOwn:     { justifyContent: "flex-end" },
  replyBubble:     { maxWidth: "75%", backgroundColor: "#2D2F31", borderRadius: Radius.lg, padding: 10, borderWidth: 1, borderColor: "#3C4043" },
  replyBubbleOwn:  { backgroundColor: "#1A73E8", borderColor: "#1A73E8" },
  replySender:     { fontSize: FontSize.xs, color: "#9AA0A6", marginBottom: 3, fontWeight: "600" },
  replyText:       { fontSize: FontSize.base, color: "#E8EAED", lineHeight: 20 },
  replyTextOwn:    { color: "#FFF" },
  replyTime:       { fontSize: 10, color: "#9AA0A6", marginTop: 4 },
  replyTimeOwn:    { color: "rgba(255,255,255,0.6)" },
  // AAC icon tray
  iconTrayWrap:    { maxHeight: 88, borderTopWidth: 1, borderTopColor: "#3C4043", backgroundColor: "#2D2F31" },
  iconTrayRow:     { paddingHorizontal: Spacing.md, gap: 8, alignItems: "center", paddingVertical: 8 },
  iconTile:        { alignItems: "center", justifyContent: "center", borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 6, minWidth: 60, gap: 3 },
  iconTileEmoji:   { fontSize: 22 },
  iconTileLabel:   { fontSize: 10, fontWeight: "700", color: "#202124", textAlign: "center" },
  // Quick replies
  quickWrap:       { maxHeight: 46, borderTopWidth: 1, borderTopColor: "#3C4043", backgroundColor: "#2D2F31" },
  quickRow:        { paddingHorizontal: Spacing.md, gap: 6, alignItems: "center", paddingVertical: 6 },
  quickChip:       { backgroundColor: "#3C4043", borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  quickChipText:   { fontSize: FontSize.xs, color: "#E8EAED", fontWeight: "600" },
  // Input bar
  inputRow:        { flexDirection: "row", alignItems: "center", gap: 8, padding: Spacing.md, backgroundColor: "#2D2F31", borderTopWidth: 1, borderTopColor: "#3C4043" },
  input:           { flex: 1, height: 42, backgroundColor: "#3C4043", borderRadius: Radius.md, paddingHorizontal: Spacing.md, fontSize: FontSize.base, color: "#E8EAED" },
  sendBtn:         { width: 42, height: 42, borderRadius: Radius.md, backgroundColor: "#1A73E8", alignItems: "center", justifyContent: "center" },
  sendBtnDisabled: { backgroundColor: "#3C4043" },
  sendBtnText:     { fontSize: FontSize.lg, color: "#FFF", fontWeight: "700" },
});

export default LiveCC;