import { useRef, useEffect } from "react";
import { TouchableOpacity, Animated, StyleSheet, View, Text } from "react-native";
import { Colors } from "../theme";

/**
 * Toggle (reusable)
 * Animated on/off switch with optional label and sub text.
 * Props: value, onChange, label?, sub?, disabled?
 */
export default function Toggle({ value, onChange, label, sub, disabled }) {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;
  const bgAnim     = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? 20 : 0,
        useNativeDriver: true,
        bounciness: 4,
      }),
      Animated.timing(bgAnim, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const bg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.n300, Colors.brandPrimary],
  });

  const hasText = label || sub;

  return (
    <View style={hasText ? styles.row : null}>
      {hasText && (
        <View style={styles.textBlock}>
          {label && <Text style={styles.label}>{label}</Text>}
          {sub   && <Text style={styles.sub}>{sub}</Text>}
        </View>
      )}
      <TouchableOpacity
        onPress={() => !disabled && onChange(!value)}
        activeOpacity={0.85}
        disabled={disabled}
        style={disabled ? styles.disabled : null}
      >
        <Animated.View style={[styles.track, { backgroundColor: bg }]}>
          <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textBlock: { flex: 1 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.n900,
  },
  sub: {
    fontSize: 12,
    color: Colors.n500,
    marginTop: 1,
  },
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  disabled: { opacity: 0.45 },
});
