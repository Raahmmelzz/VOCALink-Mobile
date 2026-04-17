import React, { useState } from "react";
// ✅ Fixed:
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AAC_ICONS } from "../../constants/mockdata";
import {
  Colors as C,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from "../../constants/tokens";
import type { AACCategory, AACIcon } from "../../constants/types";
import { Button, IconPill } from "../ui/shared";

const CATEGORIES: { id: AACCategory; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📋" },
  { id: "needs", label: "Needs", emoji: "💧" },
  { id: "emotions", label: "Emotions", emoji: "😊" },
  { id: "classroom", label: "Classroom", emoji: "📖" },
  { id: "actions", label: "Actions", emoji: "✅" },
];

interface AACBoardProps {
  onSendToTeacher?: (message: string) => void;
}

const AACBoard: React.FC<AACBoardProps> = ({ onSendToTeacher }) => {
  const [category, setCategory] = useState<AACCategory>("all");
  const [selected, setSelected] = useState<AACIcon[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [sent, setSent] = useState(false);

  const filtered =
    category === "all"
      ? AAC_ICONS
      : AAC_ICONS.filter((i) => i.category === category);

  const messageText = selected.map((i) => i.label).join(" ");

  const handleSpeak = () => {
    if (!selected.length) return;
    setSpeaking(true);
    setTimeout(() => setSpeaking(false), 2000);
  };

  const handleSend = () => {
    if (!selected.length) return;
    onSendToTeacher?.(messageText);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelected([]);
    }, 2000);
  };

  const handleIconPress = (icon: AACIcon) => {
    setSelected((prev) => [...prev, icon]);
  };

  const removeIcon = (index: number) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AAC Board</Text>
        {selected.length > 0 && (
          <TouchableOpacity onPress={() => setSelected([])}>
            <Text style={styles.clearBtn}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Message builder bar */}
      <View style={styles.builderWrap}>
        {selected.length === 0 ? (
          <Text style={styles.builderPlaceholder}>
            Tap icons below to build your message...
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.builderScroll}
          >
            {selected.map((icon, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => removeIcon(i)}
                style={styles.builderChip}
              >
                <Text style={styles.builderEmoji}>{icon.emoji}</Text>
                <Text style={styles.builderLabel}>{icon.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
        style={styles.catWrap}
      >
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[styles.catTab, isActive && styles.catTabActive]}
            >
              <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
              <Text
                style={[styles.catLabel, isActive && styles.catLabelActive]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Icon grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.gridCell}>
            <IconPill
              emoji={item.emoji}
              label={item.label}
              bg={item.bg}
              size="md"
              onPress={() => handleIconPress(item)}
            />
          </View>
        )}
      />

      {/* Action buttons */}
      <View style={styles.actions}>
        <Button
          variant="outline"
          onPress={handleSpeak}
          disabled={!selected.length}
          style={{ flex: 1 }}
        >
          {speaking ? "🔊 Speaking..." : "🔊 Speak"}
        </Button>
        <Button
          variant="primary"
          onPress={handleSend}
          disabled={!selected.length}
          style={{ flex: 1 }}
        >
          {sent ? "✓ Sent!" : "📤 Send to teacher"}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTitle: { fontSize: FontSize.md, fontWeight: "700", color: C.text },
  clearBtn: { fontSize: FontSize.sm, color: C.redDark, fontWeight: "600" },

  builderWrap: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    minHeight: 60,
    backgroundColor: C.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.gray2,
    padding: Spacing.sm,
    justifyContent: "center",
    ...Shadow.sm,
  },
  builderPlaceholder: {
    fontSize: FontSize.sm,
    color: C.text3,
    textAlign: "center",
  },
  builderScroll: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingVertical: 4,
  },
  builderChip: {
    backgroundColor: C.purpleLight,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    gap: 2,
  },
  builderEmoji: { fontSize: 18 },
  builderLabel: { fontSize: FontSize.xs, color: C.purple, fontWeight: "600" },

  catWrap: { maxHeight: 52, flexGrow: 0 },
  catScroll: { paddingHorizontal: Spacing.lg, gap: 6, alignItems: "center" },
  catTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: C.gray2,
    backgroundColor: C.white,
  },
  catTabActive: { backgroundColor: C.purpleLight, borderColor: C.purple },
  catLabel: { fontSize: FontSize.xs, color: C.text2, fontWeight: "500" },
  catLabelActive: { color: C.purple, fontWeight: "600" },

  grid: { padding: Spacing.md, gap: 10 },
  gridCell: { flex: 1, alignItems: "center", paddingVertical: 4 },

  actions: {
    flexDirection: "row",
    gap: 10,
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: C.gray2,
    backgroundColor: C.white,
  },
});

export default AACBoard;
