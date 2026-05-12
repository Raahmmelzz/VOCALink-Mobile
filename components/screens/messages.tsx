/**
 * messages.tsx  —  Unified Messages screen
 *
 * • STUDENT  → sees a single chat thread with their assigned teacher
 * • TEACHER  → sees an inbox list of students; taps one to open that thread
 *
 * No new backend endpoints needed — uses:
 *   GET  /api/profile/me                  (teacher_id / teacher_name for students)
 *   GET  /api/teacher/students/           (teacher's student roster)
 *   GET  /api/messages/my-teacher         (student thread)
 *   GET  /api/messages/my-students        (all teacher ↔ student messages)
 *   POST /api/messages/                   (send a message)
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import * as Haptics from "expo-haptics";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { Colors as C, FontSize, Radius, Shadow, Spacing } from "../../constants/tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  is_aac: boolean;
  sent_at: string;
}

interface Student {
  id: number;           // user_id
  username: string;
  first_name: string;
  last_name: string;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const QUICK_SENDS = [
  "I need help ✋",
  "I don't understand ❓",
  "I am done 📖",
  "Thank you 🙏",
];

const TEACHER_QUICK_REPLIES = [
  "Great job! 🌟",
  "Please pay attention 👀",
  "Ask me after class 📚",
  "Good question! 💡",
];

function fmtTime(iso: string) {
  try {
    // Backend stores UTC via utcnow().isoformat() which has no trailing "Z".
    // Appending "Z" tells JS it's UTC so it converts to the device's local time correctly.
    const normalized = iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z";
    return new Date(normalized).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function initials(first: string, last?: string) {
  return ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase() || "??";
}

// ─── Chat thread (shared by both roles) ──────────────────────────────────────

interface ChatThreadProps {
  messages: ApiMessage[];
  myId: number;
  otherId: number;
  otherName: string;
  otherInitials: string;
  loading: boolean;
  onSend: (text: string) => void;
  isSending: boolean;
  quickReplies: string[];
  onBack?: () => void;   // teacher uses this to go back to inbox
}

const ChatThread: React.FC<ChatThreadProps> = ({
  messages,
  myId,
  otherId,
  otherName,
  otherInitials,
  loading,
  onSend,
  isSending,
  quickReplies,
  onBack,
}) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed);
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View style={styles.threadHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{otherInitials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>{otherName}</Text>
          <Text style={styles.headerSub}>
            {onBack ? "Student" : "SNED Teacher · Online"}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.msgList}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      >
        {loading && messages.length === 0 ? (
          <ActivityIndicator size="large" color={C.purple} style={{ marginTop: 60 }} />
        ) : messages.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>No messages yet. Say hello! 👋</Text>
          </View>
        ) : (
          messages.map((m, i) => {
            const isOwn = m.sender_id === myId;
            return (
              <View
                key={m.id ?? i}
                style={[styles.msgRow, isOwn ? styles.msgRight : styles.msgLeft]}
              >
                {!isOwn && (
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarSmallText}>{otherInitials}</Text>
                  </View>
                )}
                <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
                  {m.is_aac && !isOwn && (
                    <Text style={styles.aacBadge}>AAC</Text>
                  )}
                  <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>
                    {m.text}
                  </Text>
                  <Text style={[styles.bubbleTime, isOwn && styles.bubbleTimeOwn]}>
                    {fmtTime(m.sent_at)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Quick replies */}
      <View style={styles.quickWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
        >
          {quickReplies.map((q, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => { Haptics.selectionAsync(); onSend(q); }}
              style={styles.quickChip}
            >
              <Text style={styles.quickChipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={C.text3}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!input.trim() || isSending}
          style={[styles.sendBtn, (!input.trim() || isSending) && styles.sendBtnDisabled]}
        >
          <Text style={styles.sendBtnText}>{isSending ? "…" : "→"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ─── Teacher inbox list ───────────────────────────────────────────────────────

interface InboxProps {
  students: Student[];
  allMessages: ApiMessage[];
  myId: number;
  onSelect: (student: Student) => void;
}

const TeacherInbox: React.FC<InboxProps> = ({ students, allMessages, myId, onSelect }) => {
  if (students.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyEmoji}>👥</Text>
        <Text style={styles.emptyText}>No students assigned yet.</Text>
        <Text style={[styles.emptyText, { fontSize: FontSize.sm, marginTop: 4 }]}>
          Add students from the Classroom Tools.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.inboxHeader}>
        <Text style={styles.inboxTitle}>Messages</Text>
        <Text style={styles.inboxSub}>{students.length} student{students.length !== 1 ? "s" : ""}</Text>
      </View>

      {students.map((s) => {
        // Find latest message in this thread
        const thread = allMessages.filter(
          (m) =>
            (m.sender_id === s.id && m.receiver_id === myId) ||
            (m.sender_id === myId && m.receiver_id === s.id)
        );
        const latest = thread[thread.length - 1];
        const unread = thread.filter((m) => m.sender_id === s.id).length; // rough count
        const displayName = [s.first_name, s.last_name].filter(Boolean).join(" ") || s.username;

        return (
          <TouchableOpacity
            key={s.id}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelect(s); }}
            activeOpacity={0.8}
            style={styles.inboxRow}
          >
            <View style={styles.inboxAvatar}>
              <Text style={styles.inboxAvatarText}>
                {initials(s.first_name, s.last_name) || s.username.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.inboxRowTop}>
                <Text style={styles.inboxName} numberOfLines={1}>{displayName}</Text>
                {latest && (
                  <Text style={styles.inboxTime}>{fmtTime(latest.sent_at)}</Text>
                )}
              </View>
              <Text style={styles.inboxPreview} numberOfLines={1}>
                {latest
                  ? (latest.sender_id === myId ? "You: " : "") + latest.text
                  : "No messages yet"}
              </Text>
            </View>
            <Text style={styles.inboxChevron}>›</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const Messages: React.FC = () => {
  const { token, user } = useAuth();
  const isTeacher = user?.status === "TEACHER";

  // ── Shared state ──
  const [loading, setLoading]   = useState(true);
  const [isSending, setIsSending] = useState(false);

  // ── Student state ──
  const [studentMessages, setStudentMessages] = useState<ApiMessage[]>([]);
  const [teacherInfo, setTeacherInfo] = useState<{ name: string; id: number | null }>({ name: "Teacher", id: null });

  // ── Teacher state ──
  const [students, setStudents]       = useState<Student[]>([]);
  const [allMessages, setAllMessages] = useState<ApiMessage[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // ── My user id (needed to distinguish own messages) ──
  const myId: number = (user as any)?.id ?? 0;

  // ── Fetch for STUDENT ──
  const fetchStudentData = useCallback(async () => {
    if (!token) return;
    try {
      const [profileRes, msgRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/profile/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/messages/my-teacher`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setTeacherInfo({ name: profileRes.data.teacher_name || "Teacher", id: profileRes.data.teacher_id ?? null });
      setStudentMessages(msgRes.data ?? []);
    } catch (e) {
      console.error("Student fetch error", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Fetch for TEACHER ──
  const fetchTeacherData = useCallback(async () => {
    if (!token) return;
    try {
      const [studentsRes, msgRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/teacher/students/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/messages/my-students`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStudents(studentsRes.data ?? []);
      setAllMessages(msgRes.data ?? []);
    } catch (e) {
      console.error("Teacher fetch error", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isTeacher) {
      fetchTeacherData();
      const interval = setInterval(fetchTeacherData, 4000);
      return () => clearInterval(interval);
    } else {
      fetchStudentData();
      const interval = setInterval(fetchStudentData, 4000);
      return () => clearInterval(interval);
    }
  }, [isTeacher, fetchStudentData, fetchTeacherData]);

  // ── Send handler ──
  const handleSend = async (text: string, receiverId: number) => {
    if (!text || !receiverId || !token) return;
    setIsSending(true);
    try {
      await axios.post(
        `${API_BASE_URL}/messages/`,
        { receiver_id: receiverId, text, is_aac: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refetch immediately after send
      if (isTeacher) fetchTeacherData();
      else fetchStudentData();
    } catch (e) {
      console.error("Send error", e);
    } finally {
      setIsSending(false);
    }
  };

  // ─── Loading spinner ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={C.purple} />
        </View>
      </SafeAreaView>
    );
  }

  // ─── STUDENT VIEW ─────────────────────────────────────────────────────────

  if (!isTeacher) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {teacherInfo.id === null ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>👩‍🏫</Text>
            <Text style={styles.emptyText}>You're not assigned to a teacher yet.</Text>
            <Text style={[styles.emptyText, { fontSize: FontSize.sm, marginTop: 4 }]}>
              Ask your teacher to add you to their class.
            </Text>
          </View>
        ) : (
          <ChatThread
            messages={studentMessages}
            myId={myId}
            otherId={teacherInfo.id}
            otherName={teacherInfo.name}
            otherInitials={teacherInfo.name.substring(0, 2).toUpperCase()}
            loading={loading}
            onSend={(text) => handleSend(text, teacherInfo.id!)}
            isSending={isSending}
            quickReplies={QUICK_SENDS}
          />
        )}
      </SafeAreaView>
    );
  }

  // ─── TEACHER VIEW ─────────────────────────────────────────────────────────

  // Thread for the active student
  const threadMessages = activeStudent
    ? allMessages.filter(
        (m) =>
          (m.sender_id === activeStudent.id && m.receiver_id === myId) ||
          (m.sender_id === myId && m.receiver_id === activeStudent.id)
      )
    : [];

  const activeDisplayName = activeStudent
    ? [activeStudent.first_name, activeStudent.last_name].filter(Boolean).join(" ") || activeStudent.username
    : "";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {activeStudent ? (
        // ── Open thread ──
        <ChatThread
          messages={threadMessages}
          myId={myId}
          otherId={activeStudent.id}
          otherName={activeDisplayName}
          otherInitials={initials(activeStudent.first_name, activeStudent.last_name) || activeStudent.username.substring(0, 2).toUpperCase()}
          loading={false}
          onSend={(text) => handleSend(text, activeStudent.id)}
          isSending={isSending}
          quickReplies={TEACHER_QUICK_REPLIES}
          onBack={() => setActiveStudent(null)}
        />
      ) : (
        // ── Inbox list ──
        <TeacherInbox
          students={students}
          allMessages={allMessages}
          myId={myId}
          onSelect={setActiveStudent}
        />
      )}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Thread header
  threadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.gray2,
    backgroundColor: C.white,
  },
  backBtn: {
    paddingRight: 6,
    paddingLeft: 2,
  },
  backBtnText: {
    fontSize: 28,
    color: C.teal,
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.tealLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.tealBorder,
  },
  headerAvatarText: { fontSize: 13, fontWeight: "800", color: C.teal },
  headerName: { fontSize: FontSize.base, fontWeight: "700", color: C.text },
  headerSub: { fontSize: FontSize.xs, color: C.text3, marginTop: 1 },

  // Message list
  msgList: { padding: Spacing.lg, gap: 10, paddingBottom: 12 },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  msgLeft: { justifyContent: "flex-start" },
  msgRight: { justifyContent: "flex-end" },

  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.tealLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarSmallText: { fontSize: 9, fontWeight: "700", color: C.teal },

  bubble: {
    maxWidth: "76%",
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bubbleOther: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.gray2,
  },
  bubbleOwn: {
    backgroundColor: C.purple,
  },
  aacBadge: {
    fontSize: 9,
    fontWeight: "800",
    color: C.teal,
    letterSpacing: 1,
    marginBottom: 3,
    opacity: 0.8,
  },
  bubbleText: { fontSize: FontSize.base, color: C.text, lineHeight: 21 },
  bubbleTextOwn: { color: "#FFFFFF" },
  bubbleTime: { fontSize: 10, color: C.text3, marginTop: 4 },
  bubbleTimeOwn: { color: "rgba(255,255,255,0.55)" },

  // Quick replies
  quickWrap: {
    maxHeight: 46,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
  },
  quickRow: {
    paddingHorizontal: Spacing.md,
    gap: 6,
    alignItems: "center",
    paddingVertical: 6,
  },
  quickChip: {
    backgroundColor: C.purpleLight,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.purpleMid ?? C.gray2,
  },
  quickChipText: { fontSize: FontSize.xs, color: C.purple, fontWeight: "600" },

  // Input bar
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: C.gray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.base,
    color: C.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: C.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: C.gray2 },
  sendBtnText: { fontSize: FontSize.lg, color: "#FFFFFF", fontWeight: "700" },

  // Empty state
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    gap: 8,
  },
  emptyEmoji: { fontSize: 44, marginBottom: 4 },
  emptyText: {
    fontSize: FontSize.base,
    color: C.text3,
    fontStyle: "italic",
    textAlign: "center",
  },

  // Teacher inbox
  inboxHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.gray2,
    backgroundColor: C.white,
  },
  inboxTitle: { fontSize: FontSize.xl ?? 22, fontWeight: "800", color: C.text, letterSpacing: -0.5 },
  inboxSub: { fontSize: FontSize.sm, color: C.text3, marginTop: 2, fontWeight: "500" },

  inboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.gray2,
    backgroundColor: C.white,
  },
  inboxAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.purpleLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.purpleMid ?? C.gray2,
    flexShrink: 0,
  },
  inboxAvatarText: { fontSize: 15, fontWeight: "800", color: C.purple },
  inboxRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  inboxName: { fontSize: FontSize.base, fontWeight: "700", color: C.text, flex: 1, marginRight: 8 },
  inboxTime: { fontSize: FontSize.xs, color: C.text3, fontWeight: "500" },
  inboxPreview: { fontSize: FontSize.sm, color: C.text3, fontWeight: "400" },
  inboxChevron: { fontSize: 22, color: C.text3, fontWeight: "300", marginLeft: 4 },
});

export default Messages;