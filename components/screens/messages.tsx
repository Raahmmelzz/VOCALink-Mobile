import React, { useRef, useState } from "react";
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
import { CURRENT_STUDENT, STUDENT_MESSAGES } from "../../constants/mockdata";
import {
  Colors as C,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from "../../constants/tokens";
import type { Message } from "../../constants/types";

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(STUDENT_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [...prev, { from: "student", text, time: now }]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const QUICK_SENDS = [
    "I need help ✋",
    "I don't understand ❓",
    "I am done 📖",
    "Thank you 🙏",
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>MR</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{CURRENT_STUDENT.teacher}</Text>
            <Text style={styles.headerSub}>SNED Teacher · Online</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((m, i) => {
            const isStudent = m.from === "student";
            return (
              <View
                key={i}
                style={[
                  styles.msgRow,
                  isStudent ? styles.msgRight : styles.msgLeft,
                ]}
              >
                {!isStudent && (
                  <View style={styles.teacherAvatar}>
                    <Text style={styles.teacherAvatarText}>MR</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isStudent ? styles.bubbleStudent : styles.bubbleTeacher,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isStudent && styles.bubbleTextStudent,
                    ]}
                  >
                    {m.text}
                  </Text>
                  <Text
                    style={[
                      styles.bubbleTime,
                      isStudent && styles.bubbleTimeStudent,
                    ]}
                  >
                    {m.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick sends */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
          style={styles.quickWrap}
        >
          {QUICK_SENDS.map((q, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => send(q)}
              style={styles.quickChip}
            >
              <Text style={styles.quickChipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={C.text3}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          >
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: C.gray2,
    backgroundColor: C.white,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.tealLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: { fontSize: 12, fontWeight: "700", color: C.teal },
  headerName: { fontSize: FontSize.base, fontWeight: "600", color: C.text },
  headerSub: { fontSize: FontSize.xs, color: C.text3 },

  msgList: { padding: Spacing.lg, gap: 10, paddingBottom: 8 },

  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  msgLeft: { justifyContent: "flex-start" },
  msgRight: { justifyContent: "flex-end" },

  teacherAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.tealLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  teacherAvatarText: { fontSize: 9, fontWeight: "700", color: C.teal },

  bubble: {
    maxWidth: "78%",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    paddingVertical: 9,
    ...Shadow.sm,
  },
  bubbleTeacher: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.gray2,
  },
  bubbleStudent: { backgroundColor: C.purple },
  bubbleText: { fontSize: FontSize.base, color: C.text, lineHeight: 21 },
  bubbleTextStudent: { color: C.white },
  bubbleTime: { fontSize: FontSize.xs, color: C.text3, marginTop: 3 },
  bubbleTimeStudent: { color: "rgba(255,255,255,0.6)" },

  quickWrap: {
    maxHeight: 46,
    flexGrow: 0,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
    backgroundColor: C.white,
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
  },
  quickChipText: { fontSize: FontSize.xs, color: C.purple, fontWeight: "600" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: Spacing.md,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: C.gray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.base,
    color: C.text,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: C.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: C.gray2 },
  sendBtnText: { fontSize: FontSize.lg, color: C.white, fontWeight: "700" },
});

export default Messages;
