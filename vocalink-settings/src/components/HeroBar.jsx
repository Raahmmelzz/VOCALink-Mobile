import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme";

/**
 * HeroBar
 * Gradient header for detail screens with a back button.
 */
export default function HeroBar({ title, sub, onBack }) {
  return (
    <LinearGradient
      colors={[Colors.brandDarker, Colors.brandDeep, Colors.brandPrimary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bar}
    >
      <TouchableOpacity style={styles.back} onPress={onBack} activeOpacity={0.75}>
        <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.85)" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  backText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  sub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 3,
  },
});
