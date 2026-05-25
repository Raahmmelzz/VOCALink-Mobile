/**
 * teacher-livecc.tsx  — POLLING VERSION (no WebSocket)
 *
 * Teacher types or holds 🎙️ to speak → transcribed via STT → auto-broadcast.
 * Polls own broadcast feed + student replies every 1.5 s so both streams
 * appear together in the live room feed.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Audio } from "expo-av";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { Colors as C, FontSize, Radius, Shadow, Spacing } from "../../constants/tokens";

const POLL_MS = 1500;

interface Props { setActive: (tab: any) => void; }

interface CCLine {
  id:           number | string;
  text:         string;
  speaker:      "teacher" | "student";
  time:         string;
  studentName?: string;
}

export default function TeacherLiveCC({ setActive }: Props) {
  const { token } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [lines, setLines]               = useState<CCLine[]>([]);
  const [input, setInput]               = useState("");
  const [isSending, setIsSending]       = useState(false);
  const [isVoiceRec, setIsVoiceRec]     = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const lastCCIdRef    = useRef<number>(0);
  const lastReplyIdRef = useRef<number>(0);
  const lastAacIdRef   = useRef<number>(0);
  const pollRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef   = useRef<Audio.Recording | null>(null);

  // ── Poll captions + student replies + AAC icon taps ───────────────────────
  const poll = useCallback(async () => {
    if (!token) return;
    try {
      // 1. Teacher's own broadcast captions
      const ccRes = await axios.get(
        `${API_BASE_URL}/cc/messages/?since=${lastCCIdRef.current}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const ccMsgs: any[] = ccRes.data;
      if (ccMsgs.length > 0) {
        const formatted: CCLine[] = ccMsgs.map((m) => ({
          id:      m.id,
          text:    m.text,
          speaker: "teacher" as const,
          time:    m.sent_at
            ? new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
        setLines((prev) => [...prev, ...formatted]);
        lastCCIdRef.current = ccMsgs[ccMsgs.length - 1].id;
      }

      // 2. Student typed replies
      const replyRes = await axios.get(
        `${API_BASE_URL}/messages/my-students?since=${lastReplyIdRef.current}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const replies: any[] = replyRes.data;
      if (replies.length > 0) {
        const formatted: CCLine[] = replies.map((m) => ({
          id:          `reply-${m.id}`,
          text:        m.text,
          speaker:     "student" as const,
          time:        m.sent_at
            ? new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          studentName: m.student_name || "Student",
        }));
        setLines((prev) => [...prev, ...formatted]);
        lastReplyIdRef.current = replies[replies.length - 1].id;
      }

      // 3. AAC icon taps from the session log
      const aacRes = await axios.get(
        `${API_BASE_URL}/sessions/logs/?since=${lastAacIdRef.current}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const aacLogs: any[] = aacRes.data;
      if (aacLogs.length > 0) {
        const formatted: CCLine[] = aacLogs.map((l) => ({
          id:          `aac-${l.id}`,
          text:        l.message || l.icon_label,
          speaker:     "student" as const,
          time:        l.tapped_at
            ? new Date(l.tapped_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          studentName: l.student_name || "Student",
        }));
        setLines((prev) => [...prev, ...formatted]);
        lastAacIdRef.current = aacLogs[aacLogs.length - 1].id;
      }
    } catch { /* silent — just keep polling */ }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    poll();
    pollRef.current = setInterval(poll, POLL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [poll, token]);

  // ── Broadcast caption to students ─────────────────────────────────────────
  const broadcastMessage = async (textOverride?: string) => {
    const textToSend = (textOverride ?? input).trim();
    if (!textToSend || !token) return;
    setIsSending(true);
    if (!textOverride) setInput("");
    try {
      await axios.post(
        `${API_BASE_URL}/broadcast/`,
        { text: textToSend, speaker: "teacher" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await poll();
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? "Failed to broadcast.";
      Alert.alert("Error", detail);
      if (!textOverride) setInput(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  // ── Voice recording → STT → auto-broadcast ────────────────────────────────
  const startVoiceRecord = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission needed", "Please allow microphone access in your device settings.");
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: ".m4a",
          outputFormat: 2,   // MPEG_4
          audioEncoder: 3,   // AAC
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 64000,
        },
        ios: {
          extension: ".wav",
          outputFormat: "lpcm" as any,
          audioQuality: 127,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      });
      recordingRef.current = recording;
      setIsVoiceRec(true);
    } catch {
      Alert.alert("Error", "Could not start recording. Check microphone permissions.");
    }
  };

  const stopVoiceRecord = async () => {
    if (!recordingRef.current) return;
    setIsVoiceRec(false);
    setTranscribing(true);
    try {
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      if (!uri || !token) return;

      const form = new FormData();
      form.append("audio", { uri, name: "audio.m4a", type: "audio/m4a" } as any);
      const res = await axios.post(`${API_BASE_URL}/stt/`, form, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      const transcribed = res.data?.text?.trim();
      if (transcribed) {
        // Auto-broadcast immediately instead of populating the input
        await broadcastMessage(transcribed);
      } else {
        Alert.alert("No speech detected", "Try speaking more clearly and try again.");
      }
    } catch {
      Alert.alert("Transcription failed", "Type manually instead, or try again.");
    } finally {
      setTranscribing(false);
    }
  };

  // ── End session ───────────────────────────────────────────────────────────
  const handleEndSession = () => {
    Alert.alert(
      "End Class",
      "Are you sure? This disconnects all students.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.post(
                `${API_BASE_URL}/sessions/toggle`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setActive("home");
            } catch {
              Alert.alert("Error", "Could not end session. Try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

        {/* Header */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Live Class Room</Text>
            <Text style={s.headerSub}>🟢 Session active — auto-broadcasting your speech</Text>
          </View>
          <TouchableOpacity onPress={handleEndSession} style={s.endBtn}>
            <Text style={s.endBtnText}>End Class</Text>
          </TouchableOpacity>
        </View>

        {/* Caption + student replies feed */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={s.feed}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {lines.length === 0 ? (
            <View style={s.emptyWrap}>
              <Text style={s.emptyText}>Nothing yet. Hold 🎙️ to speak or type below ↓</Text>
            </View>
          ) : (
            lines.map((line) => {
              if (line.speaker === "teacher") {
                return (
                  <View key={line.id} style={s.ccCard}>
                    <View style={s.ccTop}>
                      <Text style={s.ccSpeaker}>👨‍🏫 You</Text>
                      <Text style={s.ccTime}>{line.time}</Text>
                    </View>
                    <Text style={s.ccText}>{line.text}</Text>
                  </View>
                );
              }
              // Student reply bubble
              return (
                <View key={line.id} style={s.replyCard}>
                  <View style={s.ccTop}>
                    <Text style={s.replySpeaker}>🎓 {line.studentName || "Student"}</Text>
                    <Text style={s.ccTime}>{line.time}</Text>
                  </View>
                  <Text style={s.replyText}>{line.text}</Text>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Transcribing indicator */}
        {transcribing && (
          <View style={s.transcribingBar}>
            <Text style={s.transcribingText}>⏳ Transcribing & broadcasting…</Text>
          </View>
        )}

        {/* Input */}
        <View style={s.inputContainer}>
          {/* Mic button — hold to record, release to transcribe + auto-broadcast */}
          <TouchableOpacity
            onPressIn={startVoiceRecord}
            onPressOut={stopVoiceRecord}
            disabled={transcribing}
            style={[s.micBtn, isVoiceRec && s.micBtnActive, transcribing && s.micBtnDisabled]}
          >
            <Text style={s.micBtnText}>{isVoiceRec ? "🔴" : "🎙️"}</Text>
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type or hold 🎙️ to speak…"
            placeholderTextColor={C.text3}
            multiline
            style={s.largeInput}
          />
          <TouchableOpacity
            onPress={() => broadcastMessage()}
            disabled={!input.trim() || isSending}
            style={[s.sendBtn, (!input.trim() || isSending) && s.sendBtnDisabled]}
          >
            <Text style={s.sendBtnText}>{isSending ? "…" : "Send"}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: C.bg },
  header:         { flexDirection: "row", alignItems: "center", padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: C.gray2, backgroundColor: C.white },
  headerTitle:    { fontSize: FontSize.lg, fontWeight: "800", color: C.text },
  headerSub:      { fontSize: FontSize.sm, color: "#047857", marginTop: 2, fontWeight: "600" },
  endBtn:         { backgroundColor: "#DC2626", paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.md, ...Shadow.sm },
  endBtnText:     { color: C.white, fontWeight: "800", fontSize: FontSize.sm },
  feed:           { padding: Spacing.lg, gap: 10, paddingBottom: 20 },
  emptyWrap:      { alignItems: "center", marginTop: 60 },
  emptyText:      { fontSize: FontSize.md, color: C.text3, fontStyle: "italic", textAlign: "center" },
  // Teacher caption cards
  ccCard:         { backgroundColor: C.tealLight, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: C.tealBorder, ...Shadow.sm },
  ccTop:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  ccSpeaker:      { fontSize: FontSize.xs, fontWeight: "700", color: C.teal },
  ccTime:         { fontSize: FontSize.xs, color: C.text3 },
  ccText:         { fontSize: FontSize.base, color: C.text, lineHeight: 22 },
  // Student reply cards
  replyCard:      { backgroundColor: C.purpleLight, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: C.gray2, ...Shadow.sm },
  replySpeaker:   { fontSize: FontSize.sm, fontWeight: "700", color: C.purple },
  replyText:      { fontSize: 20, color: C.text, lineHeight: 28 },
  // Transcribing bar
  transcribingBar:  { paddingHorizontal: Spacing.lg, paddingVertical: 6, backgroundColor: "#FEF9C3", borderTopWidth: 1, borderTopColor: "#FDE68A" },
  transcribingText: { fontSize: FontSize.xs, color: "#92400E", fontWeight: "600", textAlign: "center" },
  // Input area
  inputContainer:   { flexDirection: "row", alignItems: "flex-end", padding: Spacing.md, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.gray2, gap: 8 },
  micBtn:           { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: C.gray, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.gray2 },
  micBtnActive:     { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" },
  micBtnDisabled:   { opacity: 0.45 },
  micBtnText:       { fontSize: 22 },
  largeInput:       { flex: 1, minHeight: 48, maxHeight: 120, backgroundColor: C.gray, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.base, color: C.text, paddingTop: 14 },
  sendBtn:          { height: 48, paddingHorizontal: 20, borderRadius: Radius.md, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" },
  sendBtnDisabled:  { backgroundColor: C.gray3 },
  sendBtnText:      { fontSize: FontSize.md, color: C.white, fontWeight: "700" },
});
