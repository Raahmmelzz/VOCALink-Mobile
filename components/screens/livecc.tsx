/**
 * livecc.tsx — STUDENT SCREEN
 *
 * Shows live teacher captions + AAC icon tray.
 * No text messaging — students respond only via AAC icons (saved to session log).
 * Polls session status every 2 s so the screen updates the moment the teacher
 * ends the class.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { ScreenHeader } from "../ui/ScreenHeader";
import { Colors as C, FontSize, Radius, Spacing } from "../../constants/tokens";

const POLL_MS      = 1500;
const SESSION_MS   = 2000;

const LIVE_ICONS = [
  { id: "help",     emoji: "✋", label: "Help me",       msg: "Help me!",          bg: "#FAEEDA" },
  { id: "yes",      emoji: "✅", label: "Yes",            msg: "Yes",               bg: "#E1F5EE" },
  { id: "no",       emoji: "❌", label: "No",             msg: "No",                bg: "#FCEBEB" },
  { id: "done",     emoji: "📖", label: "Done",           msg: "I'm done",          bg: "#E1F5EE" },
  { id: "question", emoji: "❓", label: "Question",       msg: "I have a question", bg: "#E6F1FB" },
  { id: "repeat",   emoji: "🔁", label: "Repeat",         msg: "Please repeat",     bg: "#EEEDFE" },
  { id: "wait",     emoji: "⏳", label: "Wait",           msg: "Wait please",       bg: "#FAEEDA" },
  { id: "confused", emoji: "😕", label: "Confused",       msg: "I'm confused",      bg: "#E1F5EE" },
];

interface CCLine {
  id:   number;
  text: string;
  time: string;
}

const LiveCC: React.FC = () => {
  const { token, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [lines,          setLines]          = useState<CCLine[]>([]);
  const [connected,      setConnected]      = useState(false);
  const [sessionActive,  setSessionActive]  = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  const teacherName = (user as any)?.teacher_name ?? "Teacher";
  const lastIdRef   = useRef<number>(0);

  // ── Caption polling ───────────────────────────────────────────────────────
  const pollCaptions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/cc/messages/?since=${lastIdRef.current}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const msgs: any[] = res.data;
      if (msgs.length > 0) {
        const formatted: CCLine[] = msgs.map((m) => ({
          id:   m.id,
          text: m.text,
          time: m.sent_at
            ? new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    pollCaptions();
    const iv = setInterval(pollCaptions, POLL_MS);
    return () => clearInterval(iv);
  }, [pollCaptions, token]);

  // ── Session status polling — detects when teacher ends class ─────────────
  useEffect(() => {
    if (!token) return;
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/sessions/student`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSessionActive(res.data.active);
        setSessionChecked(true);
      } catch {}
    };
    checkSession();
    const iv = setInterval(checkSession, SESSION_MS);
    return () => clearInterval(iv);
  }, [token]);

  // ── AAC icon tap → session log (not a chat message) ──────────────────────
  const handleIconTap = async (icon: typeof LIVE_ICONS[0]) => {
    if (!token) return;
    try {
      await axios.post(
        `${API_BASE_URL}/logs/`,
        { icon_id: icon.id, icon_label: icon.label, message: icon.msg },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {}
  };

  // Last 6 captions fade older ones (Google Meet style)
  const visible = lines.slice(-6);

  // ── Session ended overlay ─────────────────────────────────────────────────
  if (sessionChecked && !sessionActive) {
    return (
      <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
        <View style={s.endedScreen}>
          <Text style={s.endedEmoji}>🎓</Text>
          <Text style={s.endedTitle}>Class has ended</Text>
          <Text style={s.endedSub}>
            {teacherName} has ended the session.{"\n"}
            Your participation has been saved.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>

      {/* Header */}
      <ScreenHeader
        title="Live Captions"
        subtitle={
          connected
            ? `● Live from ${teacherName}`
            : "○ Connecting to class…"
        }
      />

      {/* Caption feed */}
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
            visible.map((line, idx) => {
              const isLatest  = idx === visible.length - 1;
              const opacity   = isLatest
                ? 1
                : 0.3 + (idx / Math.max(visible.length - 1, 1)) * 0.5;
              return (
                <View key={line.id} style={[s.ccRow, { opacity }]}>
                  {isLatest && <View style={s.activeBar} />}
                  <Text style={[s.ccText, isLatest && s.ccTextLatest]}>
                    {line.text}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* AAC icon tray */}
      <View style={s.iconTrayWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.iconTrayRow}
        >
          {LIVE_ICONS.map((icon) => (
            <TouchableOpacity
              key={icon.id}
              onPress={() => handleIconTap(icon)}
              style={[s.iconTile, { backgroundColor: icon.bg }]}
              activeOpacity={0.7}
            >
              <Text style={s.iconTileEmoji}>{icon.emoji}</Text>
              <Text style={s.iconTileLabel}>{icon.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: "#202124" },

  // Caption area
  ccContainer:   { flex: 1, justifyContent: "flex-end", paddingBottom: 8 },
  feed:          { padding: Spacing.lg, gap: 14, justifyContent: "flex-end", flexGrow: 1 },
  emptyWrap:     { alignItems: "center", marginTop: 60 },
  emptyText:     { fontSize: FontSize.md, color: "#9AA0A6", fontStyle: "italic", textAlign: "center" },
  ccRow:         { flexDirection: "row", alignItems: "flex-start", paddingLeft: 12 },
  activeBar:     { width: 4, height: "100%", backgroundColor: "#8AB4F8", position: "absolute", left: -2, borderRadius: 2 },
  ccText:        { fontSize: 26, color: "#E8EAED", lineHeight: 34, fontWeight: "500" },
  ccTextLatest:  { color: "#FFF", fontWeight: "700", fontSize: 28, lineHeight: 36 },

  // AAC icon tray
  iconTrayWrap:  { borderTopWidth: 1, borderTopColor: "#3C4043", backgroundColor: "#2D2F31", paddingVertical: 10 },
  iconTrayRow:   { paddingHorizontal: Spacing.md, gap: 10, alignItems: "center" },
  iconTile:      { alignItems: "center", justifyContent: "center", borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10, minWidth: 68, gap: 4 },
  iconTileEmoji: { fontSize: 26 },
  iconTileLabel: { fontSize: 11, fontWeight: "700", color: "#202124", textAlign: "center" },

  // Session ended screen
  endedScreen:   { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.xl, gap: 16 },
  endedEmoji:    { fontSize: 64 },
  endedTitle:    { fontSize: FontSize.xl, fontWeight: "800", color: "#FFF", textAlign: "center" },
  endedSub:      { fontSize: FontSize.base, color: "#9AA0A6", textAlign: "center", lineHeight: 24 },
});

export default LiveCC;
