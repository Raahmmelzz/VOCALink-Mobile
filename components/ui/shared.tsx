import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors as C, FontSize, Radius, Shadow, Spacing } from "../../constants/tokens";

// ─── STATUS DOT ───────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  online:  "#22C55E",
  idle:    C.gray3,
  request: C.amber,
  urgent:  C.redDark,
};

export const StatusDot: React.FC<{ status: string; size?: number }> = ({ status, size = 10 }) => (
  <View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: STATUS_COLORS[status] ?? C.gray3,
  }} />
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
const BADGE_MAP: Record<string, { bg: string; text: string }> = {
  teal:   { bg: C.tealLight,   text: C.tealMid  },
  amber:  { bg: C.amberLight,  text: C.amber    },
  red:    { bg: C.redLight,    text: C.redDark  },
  purple: { bg: C.purpleLight, text: C.purple   },
  blue:   { bg: C.blueLight,   text: C.blue     },
  gray:   { bg: C.gray,        text: C.text3    },
  green:  { bg: C.greenLight,  text: C.green    },
};

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "gray", style }) => {
  const m = BADGE_MAP[color] ?? BADGE_MAP.gray;
  return (
    <View style={[{
      backgroundColor: m.bg, paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: Radius.full, alignSelf: "flex-start",
    }, style]}>
      <Text style={{ fontSize: FontSize.xs, fontWeight: "700", color: m.text, letterSpacing: 0.3 }}>
        {children}
      </Text>
    </View>
  );
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export const Avatar: React.FC<{ name: string; bg?: string; color?: string; size?: number }> = ({
  name, bg = C.tealLight, color = C.teal, size = 44,
}) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg, alignItems: "center", justifyContent: "center",
    }}>
      <Text style={{ fontSize: Math.round(size * 0.38), fontWeight: "700", color }}>
        {initials}
      </Text>
    </View>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={[{
    backgroundColor: C.white, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: C.gray2, ...Shadow.sm,
  }, style]}>
    {children}
  </View>
);

// ─── CARD TITLE ───────────────────────────────────────────────────────────────
export const CardTitle: React.FC<{ children: React.ReactNode; style?: TextStyle }> = ({ children, style }) => (
  <Text style={[{ fontSize: FontSize.md, fontWeight: "700", color: C.text, marginBottom: Spacing.md }, style]}>
    {children}
  </Text>
);

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ height: 1, backgroundColor: C.gray2, marginVertical: Spacing.md }, style]} />
);

// ─── BUTTON ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "primary" | "outline" | "ghost" | "speak" | "send";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children, onPress,
  variant = "outline", size = "md",
  loading = false, disabled = false,
  style, textStyle, fullWidth = false,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const variants = {
    primary: { bg: C.purple,   border: C.purple,     text: C.white,   fs: FontSize.base },
    outline: { bg: C.white,    border: C.gray2,      text: C.text,    fs: FontSize.base },
    ghost:   { bg: "transparent", border: "transparent", text: C.text2, fs: FontSize.base },
    speak: {
      bg: "#0F172A", border: "#0F172A", text: C.white, fs: FontSize.md,
    },
    send: {
      bg: C.teal, border: C.teal, text: C.white, fs: FontSize.md,
    },
  };

  const sizes = {
    sm: { py: 8,  px: 14, fs: FontSize.sm   },
    md: { py: 14, px: 20, fs: FontSize.base  },
    lg: { py: 18, px: 28, fs: FontSize.md    },
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.80}
      style={[{
        backgroundColor: v.bg,
        borderWidth: 1.5, borderColor: v.border,
        borderRadius: Radius.md,
        paddingVertical: s.py, paddingHorizontal: s.px,
        alignItems: "center", justifyContent: "center",
        flexDirection: "row", gap: 8,
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? "100%" : undefined,
        minHeight: 52,
      }, style]}
    >
      {loading
        ? <ActivityIndicator size="small" color={v.text} />
        : <Text style={[{ fontSize: v.fs, fontWeight: "700", color: v.text, letterSpacing: -0.2 }, textStyle]}>
            {children}
          </Text>
      }
    </TouchableOpacity>
  );
};

// ─── ICON PILL (AAC icon cell) ─────────────────────────────────────────────────
// Accessibility-first: large touch targets, clear labels, haptic feedback
interface IconPillProps {
  emoji: string;
  label: string;
  bg: string;
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  selected?: boolean;
}

const PILL_SIZES = {
  sm: { cell: 72,  emoji: 26, label: FontSize.xs   },
  md: { cell: 88,  emoji: 36, label: FontSize.sm   },
  lg: { cell: 104, emoji: 44, label: FontSize.base },
};

export const IconPill: React.FC<IconPillProps> = ({
  emoji, label, bg,
  size = "md", onPress, selected = false,
}) => {
  const s = PILL_SIZES[size];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      style={{ alignItems: "center", gap: 6 }}
    >
      <View style={{
        width: s.cell, height: s.cell,
        borderRadius: Radius.md,
        backgroundColor: selected ? bg : bg,
        alignItems: "center", justifyContent: "center",
        borderWidth: selected ? 3 : 1.5,
        borderColor: selected ? C.purple : C.gray2,
        ...Shadow.md,
        transform: [{ scale: selected ? 1.05 : 1 }],
      }}>
        <Text style={{ fontSize: s.emoji }}>{emoji}</Text>
      </View>
      <Text numberOfLines={1} style={{
        fontSize: s.label, color: C.text, fontWeight: "600",
        textAlign: "center", width: s.cell + 4,
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
