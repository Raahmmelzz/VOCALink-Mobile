import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Colors, Radius } from "../theme";

const CONFIGS = {
  success: { bg: "#D1FAE5", color: "#065F46", border: Colors.success,      icon: "✓" },
  error:   { bg: "#FEE2E2", color: "#991B1B", border: Colors.danger,       icon: "✕" },
  info:    { bg: Colors.brandPale, color: Colors.brandDarker, border: Colors.brandPrimary, icon: "i" },
};

/**
 * Toast
 * Animated floating feedback notification.
 */
export default function Toast({ toast }) {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, bounciness: 6, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [toast]);

  if (!toast) return null;

  const cfg = CONFIGS[toast.type] || CONFIGS.info;

  return (
    <Animated.View
      style={[styles.wrap, { opacity, transform: [{ translateY }], backgroundColor: cfg.bg, borderColor: cfg.border }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: cfg.border }]}>
        <Text style={styles.iconText}>{cfg.icon}</Text>
      </View>
      <Text style={[styles.msg, { color: cfg.color }]}>{toast.msg}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  msg: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});
