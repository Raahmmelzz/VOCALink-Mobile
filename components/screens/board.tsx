import React, { useState } from "react";
import {
  Dimensions, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import axios from "axios";

import { AAC_ICONS } from "../../constants/mockdata";
import { API_BASE_URL } from "../../constants/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors as C, FontSize, Radius, Shadow, Spacing } from "../../constants/tokens";
import type { AACCategory, AACIcon } from "../../constants/types";

// ── Grid math ─────────────────────────────────────────────────────────────────
const { width: SW } = Dimensions.get("window");
const PAD      = 16;
const GAP      = 10;
const COLS     = 3;
const CELL     = Math.floor((SW - PAD * 2 - GAP * (COLS - 1)) / COLS);
const EMOJI_SZ = Math.floor(CELL * 0.40);

// Chunk array into rows of N
function chunk<T>(arr: T[], n: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += n) rows.push(arr.slice(i, i + n));
  return rows;
}

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORIES: { id: AACCategory; label: string; emoji: string; color: string }[] = [
  { id: "all",       label: "All",      emoji: "📋", color: "#475569" },
  { id: "needs",     label: "Needs",    emoji: "💧", color: "#0EA5E9" },
  { id: "emotions",  label: "Feelings", emoji: "😊", color: "#EC4899" },
  { id: "classroom", label: "Class",    emoji: "📖", color: "#8B5CF6" },
  { id: "actions",   label: "Actions",  emoji: "✅", color: "#22C55E" },
];

interface AACBoardProps {
  onSendToTeacher?: (message: string) => void;
}

const AACBoard: React.FC<AACBoardProps> = ({ onSendToTeacher }) => {
  const { token } = useAuth();
  const [category, setCategory] = useState<AACCategory>("all");
  const [selected, setSelected]  = useState<AACIcon[]>([]);
  const [speaking, setSpeaking]  = useState(false);
  const [sent, setSent]          = useState(false);

  const filtered = category === "all"
    ? AAC_ICONS
    : AAC_ICONS.filter(i => i.category === category);

  const rows = chunk(filtered, COLS);
  const messageText = selected.map(i => i.label).join(" ");

  const handleIconPress = (icon: AACIcon) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(prev => [...prev, icon]);
    axios.post(`${API_BASE_URL}/logs/`,
      { icon_id: icon.id, icon_label: icon.label },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(() => {});
  };

  const handleSpeak = () => {
    if (!selected.length) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSpeaking(true);
    Speech.speak(messageText, {
      language: "en", pitch: 1.0, rate: 0.85,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const handleSend = () => {
    if (!selected.length) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSendToTeacher?.(messageText);
    axios.post(`${API_BASE_URL}/logs/`,
      { icon_id: "message", icon_label: messageText, message: messageText },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(() => {});
    setSent(true);
    setTimeout(() => { setSent(false); setSelected([]); }, 2000);
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>AAC Board</Text>
        {selected.length > 0 && (
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); setSelected([]); }}
            style={s.clearBtn}
          >
            <Text style={s.clearBtnText}>✕ Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Message builder ── */}
      <View style={s.builder}>
        {selected.length === 0 ? (
          <View style={s.builderEmpty}>
            <Text style={s.builderEmptyEmoji}>👆</Text>
            <Text style={s.builderEmptyText}>Tap icons to build your message</Text>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
              {selected.map((icon, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelected(prev => prev.filter((_, idx) => idx !== i));
                  }}
                  style={s.chip}
                  activeOpacity={0.7}
                >
                  <Text style={s.chipEmoji}>{icon.emoji}</Text>
                  <Text style={s.chipLabel}>{icon.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.messagePreview} numberOfLines={1}>"{messageText}"</Text>
          </>
        )}
      </View>

      {/* ── Category tabs ── */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.catRow} style={s.catWrap}
      >
        {CATEGORIES.map(cat => {
          const active = category === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => { Haptics.selectionAsync(); setCategory(cat.id); }}
              activeOpacity={0.8}
              style={[s.catTab, active && { backgroundColor: cat.color, borderColor: cat.color }]}
            >
              <Text style={s.catEmoji}>{cat.emoji}</Text>
              <Text style={[s.catLabel, active && s.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Icon grid — manual rows for perfect alignment ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.grid}>
        {rows.map((row, ri) => (
          <View key={ri} style={s.row}>
            {row.map(icon => (
              <TouchableOpacity
                key={icon.id}
                onPress={() => handleIconPress(icon)}
                activeOpacity={0.75}
                style={[s.cell, { backgroundColor: icon.bg }]}
              >
                <Text style={s.cellEmoji}>{icon.emoji}</Text>
                <Text style={s.cellLabel} numberOfLines={1}>{icon.label}</Text>
              </TouchableOpacity>
            ))}
            {/* Fill empty cells in last row */}
            {row.length < COLS && Array.from({ length: COLS - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={s.cellEmpty} />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* ── Action buttons ── */}
      <View style={s.actions}>
        <TouchableOpacity
          onPress={handleSpeak}
          disabled={!selected.length || speaking}
          activeOpacity={0.85}
          style={[s.actionBtn, s.speakBtn, (!selected.length || speaking) && s.btnDisabled]}
        >
          <Text style={s.actionEmoji}>🔊</Text>
          <Text style={s.actionText}>{speaking ? "Speaking..." : "Speak"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSend}
          disabled={!selected.length}
          activeOpacity={0.85}
          style={[s.actionBtn, s.sendBtn, !selected.length && s.btnDisabled]}
        >
          <Text style={s.actionEmoji}>{sent ? "✅" : "📤"}</Text>
          <Text style={s.actionText}>{sent ? "Sent!" : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: PAD, paddingVertical: 12,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.gray2,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: "800", color: C.text },
  clearBtn: {
    backgroundColor: C.redLight, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1, borderColor: "#FCA5A5",
  },
  clearBtnText: { fontSize: FontSize.sm, color: C.redDark, fontWeight: "700" },

  // Builder
  builder: {
    marginHorizontal: PAD, marginVertical: 10,
    minHeight: 88, backgroundColor: C.white,
    borderRadius: Radius.lg, borderWidth: 2, borderColor: C.gray2,
    padding: 12, justifyContent: "center", ...Shadow.sm,
  },
  builderEmpty: { alignItems: "center", gap: 4 },
  builderEmptyEmoji: { fontSize: 26 },
  builderEmptyText: { fontSize: FontSize.sm, color: C.text3, fontWeight: "500" },
  chipRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  chip: {
    backgroundColor: C.purpleLight, borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 8,
    alignItems: "center", gap: 4,
    borderWidth: 1.5, borderColor: C.purpleMid, minWidth: 56,
  },
  chipEmoji: { fontSize: 22 },
  chipLabel: { fontSize: FontSize.xs, color: C.purple, fontWeight: "700" },
  messagePreview: {
    marginTop: 6, fontSize: FontSize.sm,
    color: C.text2, fontWeight: "600", fontStyle: "italic",
  },

  // Category
  catWrap: { maxHeight: 58, flexGrow: 0 },
  catRow: { paddingHorizontal: PAD, gap: 8, alignItems: "center", paddingVertical: 8 },
  catTab: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: Radius.full, borderWidth: 2, borderColor: C.gray2,
    backgroundColor: C.white, minHeight: 44,
  },
  catEmoji: { fontSize: 16 },
  catLabel: { fontSize: FontSize.sm, color: C.text2, fontWeight: "600" },
  catLabelActive: { color: C.white, fontWeight: "700" },

  // Grid
  grid: { padding: PAD, paddingBottom: 20 },
  row: { flexDirection: "row", gap: GAP, marginBottom: GAP },
  cell: {
    width: CELL, height: CELL + 30,
    borderRadius: Radius.lg, alignItems: "center", justifyContent: "center",
    gap: 8, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.06)", ...Shadow.sm,
  },
  cellEmpty: { width: CELL },
  cellEmoji: { fontSize: EMOJI_SZ },
  cellLabel: {
    fontSize: FontSize.sm, fontWeight: "700", color: C.text,
    textAlign: "center", paddingHorizontal: 4, width: CELL - 8,
  },

  // Actions
  actions: {
    flexDirection: "row", gap: 12, padding: PAD,
    borderTopWidth: 1, borderTopColor: C.gray2, backgroundColor: C.white,
  },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 18, borderRadius: Radius.lg,
    minHeight: 62, ...Shadow.md,
  },
  speakBtn:   { backgroundColor: "#0F172A" },
  sendBtn:    { backgroundColor: C.teal    },
  btnDisabled:{ opacity: 0.4               },
  actionEmoji:{ fontSize: 22               },
  actionText: { fontSize: FontSize.md, fontWeight: "800", color: C.white },
});

export default AACBoard;
