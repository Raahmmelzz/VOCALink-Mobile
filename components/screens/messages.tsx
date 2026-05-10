import React, { useEffect, useRef, useState } from "react";
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
import { API_BASE_URL } from "../../constants/api"; // Using your custom API URL
import { Colors as C, FontSize, Radius, Spacing } from "../../constants/tokens";
import { storage } from "../../utils/storage"; // Using your custom storage utility

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({ name: "Teacher", id: null });
  const scrollRef = useRef<ScrollView>(null);

  const fetchChatData = async () => {
    try {
      // MATCHES YOUR AUTH CONTEXT KEY
      const token = await storage.getItem("auth_token");
      
      // Stop execution and polling if token is missing
      if (!token) {
        console.warn("No token found. User is likely logged out.");
        setLoading(false);
        return false;
      }

      // Sync Profile (Retrieves the display_name from backend)
      const profileRes = await fetch(`${API_BASE_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (profileRes.status === 401) return false;
      
      const profileData = await profileRes.json();
      setTeacherInfo({ 
        name: profileData.teacher_name || "Teacher", 
        id: profileData.teacher_id 
      });

      // Sync Message History
      const msgRes = await fetch(`${API_BASE_URL}/messages/my-teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const msgData = await msgRes.json();
      setMessages(msgData);
      
      return true; // Token valid, continue polling
    } catch (error) {
      console.error("Sync failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
    
    // Set up controlled polling
    const interval = setInterval(async () => {
      const isActive = await fetchChatData();
      if (!isActive) clearInterval(interval); // Kill the loop if token is lost
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || !teacherInfo.id) return;
    try {
      // MATCHES YOUR AUTH CONTEXT KEY
      const token = await storage.getItem("auth_token");
      await fetch(`${API_BASE_URL}/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: teacherInfo.id, text }),
      });
      setInput("");
      fetchChatData(); // Refresh immediately after sending
    } catch (e) {
      console.error(e);
    }
  };

  const QUICK_SENDS = [
    "I need help ✋",
    "I don't understand ❓",
    "I am done 📖",
    "Thank you 🙏",
  ];

  if (loading && messages.length === 0) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={C.purple} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        
        {/* Header - Dynamically displays your Display Name */}
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {teacherInfo.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.headerName}>{teacherInfo.name}</Text>
            <Text style={styles.headerSub}>SNED Teacher · Online</Text>
          </View>
        </View>

        {/* Message List */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.msgList}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((m, i) => {
            const isStudent = m.sender_id !== teacherInfo.id;
            return (
              <View key={m.id || i} style={[styles.msgRow, isStudent ? styles.msgRight : styles.msgLeft]}>
                {!isStudent && (
                  <View style={styles.teacherAvatar}>
                    <Text style={styles.teacherAvatarText}>
                      {teacherInfo.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={[styles.bubble, isStudent ? styles.bubbleStudent : styles.bubbleTeacher]}>
                  {m.is_aac && !isStudent && (
                    <Text style={{ fontSize: 10, fontWeight: '700', marginBottom: 2, opacity: 0.7 }}>
                      TEACHER RESPONSE
                    </Text>
                  )}
                  <Text style={[styles.bubbleText, isStudent && styles.bubbleTextStudent]}>{m.text}</Text>
                  <Text style={[styles.bubbleTime, isStudent && styles.bubbleTimeStudent]}>
                    {m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick Sends */}
        <View style={styles.quickWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {QUICK_SENDS.map((q, i) => (
              <TouchableOpacity key={i} onPress={() => send(q)} style={styles.quickChip}>
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
            onSubmitEditing={() => send(input)}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => send(input)} disabled={!input.trim()} style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}>
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "center", gap: 10, padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: C.gray2, backgroundColor: C.white },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.tealLight, alignItems: "center", justifyContent: "center" },
  headerAvatarText: { fontSize: 12, fontWeight: "700", color: C.teal },
  headerName: { fontSize: FontSize.base, fontWeight: "600", color: C.text },
  headerSub: { fontSize: FontSize.xs, color: C.text3 },
  msgList: { padding: Spacing.lg, gap: 10, paddingBottom: 8 },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  msgLeft: { justifyContent: "flex-start" },
  msgRight: { justifyContent: "flex-end" },
  teacherAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.tealLight, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  teacherAvatarText: { fontSize: 9, fontWeight: "700", color: C.teal },
  bubble: { maxWidth: "78%", borderRadius: Radius.lg, padding: Spacing.md, paddingVertical: 9 },
  bubbleTeacher: { backgroundColor: C.white, borderWidth: 1, borderColor: C.gray2 },
  bubbleStudent: { backgroundColor: C.purple },
  bubbleText: { fontSize: FontSize.base, color: C.text, lineHeight: 21 },
  bubbleTextStudent: { color: C.white },
  bubbleTime: { fontSize: FontSize.xs, color: C.text3, marginTop: 3 },
  bubbleTimeStudent: { color: "rgba(255,255,255,0.6)" },
  quickWrap: { maxHeight: 46, borderTopWidth: 1, borderTopColor: C.gray2, backgroundColor: C.white },
  quickRow: { paddingHorizontal: Spacing.md, gap: 6, alignItems: "center", paddingVertical: 6 },
  quickChip: { backgroundColor: C.purpleLight, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  quickChipText: { fontSize: FontSize.xs, color: C.purple, fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: Spacing.md, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.gray2 },
  input: { flex: 1, height: 42, backgroundColor: C.gray, borderRadius: Radius.md, paddingHorizontal: Spacing.md, fontSize: FontSize.base, color: C.text },
  sendBtn: { width: 42, height: 42, borderRadius: Radius.md, backgroundColor: C.purple, alignItems: "center", justifyContent: "center" },
  sendBtnDisabled: { backgroundColor: C.gray2 },
  sendBtnText: { fontSize: FontSize.lg, color: C.white, fontWeight: "700" }
});

export default Messages;