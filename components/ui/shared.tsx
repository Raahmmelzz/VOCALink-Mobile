import React from "react";
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import {
    Colors as C,
    FontSize,
    Radius,
    Shadow,
    Spacing,
} from "../../constants/tokens";

// ─── STATUS DOT ───────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  online: C.tealMid,
  idle: C.gray3,
  request: C.amber,
  urgent: C.redDark,
};

interface StatusDotProps {
  status: string;
  size?: number;
}
export const StatusDot: React.FC<StatusDotProps> = ({ status, size = 8 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: STATUS_COLORS[status] ?? C.gray3,
    }}
  />
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
const BADGE_MAP: Record<string, { bg: string; text: string }> = {
  teal: { bg: C.tealLight, text: C.teal },
  amber: { bg: C.amberLight, text: C.amber },
  red: { bg: C.redLight, text: C.red },
  purple: { bg: C.purpleLight, text: C.purple },
  blue: { bg: C.blueLight, text: C.blue },
  gray: { bg: C.gray, text: C.text3 },
};

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  style?: ViewStyle;
}
export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "gray",
  style,
}) => {
  const m = BADGE_MAP[color] ?? BADGE_MAP.gray;
  return (
    <View
      style={[
        {
          backgroundColor: m.bg,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: Radius.full,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: FontSize.xs,
          fontWeight: "600",
          color: m.text,
          letterSpacing: 0.4,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  bg?: string;
  color?: string;
  size?: number;
}
export const Avatar: React.FC<AvatarProps> = ({
  name,
  bg = C.tealLight,
  color = C.teal,
  size = 36,
}) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{ fontSize: Math.round(size * 0.36), fontWeight: "600", color }}
      >
        {initials}
      </Text>
    </View>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
export const Card: React.FC<CardProps> = ({ children, style }) => (
  <View
    style={[
      {
        backgroundColor: C.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: C.gray2,
        ...Shadow.sm,
      },
      style,
    ]}
  >
    {children}
  </View>
);

// ─── CARD TITLE ───────────────────────────────────────────────────────────────
export const CardTitle: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => (
  <Text
    style={[
      {
        fontSize: FontSize.base,
        fontWeight: "600",
        color: C.text,
        marginBottom: Spacing.md,
      },
      style,
    ]}
  >
    {children}
  </Text>
);

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View
    style={[
      { height: 1, backgroundColor: C.gray2, marginVertical: Spacing.md },
      style,
    ]}
  />
);

// ─── BUTTON ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const BTN_VARIANTS = {
  primary: { bg: C.purple, border: C.purple, text: C.white },
  outline: { bg: C.white, border: C.gray2, text: C.text },
  ghost: { bg: "transparent", border: "transparent", text: C.text2 },
};

const BTN_SIZES = {
  sm: { py: 6, px: 12, fs: FontSize.sm },
  md: { py: 11, px: 18, fs: FontSize.base },
  lg: { py: 15, px: 24, fs: FontSize.md },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "outline",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const v = BTN_VARIANTS[variant];
  const s = BTN_SIZES[size];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: v.bg,
          borderWidth: 1,
          borderColor: v.border,
          borderRadius: Radius.md,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <Text
          style={[
            { fontSize: s.fs, fontWeight: "600", color: v.text },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ─── ICON PILL (AAC icon cell) ────────────────────────────────────────────────
interface IconPillProps {
  emoji: string;
  label: string;
  bg: string;
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  selected?: boolean;
}

const PILL_SIZES = {
  sm: { cell: 64, emoji: 22, label: 9 },
  md: { cell: 76, emoji: 28, label: 10 },
  lg: { cell: 90, emoji: 34, label: 11 },
};

export const IconPill: React.FC<IconPillProps> = ({
  emoji,
  label,
  bg,
  size = "md",
  onPress,
  selected = false,
}) => {
  const s = PILL_SIZES[size];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        width: s.cell,
        alignItems: "center",
        gap: 4,
      }}
    >
      <View
        style={{
          width: s.cell,
          height: s.cell,
          borderRadius: Radius.md,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? C.purple : C.gray2,
          ...Shadow.sm,
        }}
      >
        <Text style={{ fontSize: s.emoji }}>{emoji}</Text>
      </View>
      <Text
        numberOfLines={1}
        style={{
          fontSize: s.label,
          color: C.text2,
          fontWeight: "500",
          textAlign: "center",
          width: s.cell,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
