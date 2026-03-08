import { View, Text, StyleSheet } from "react-native";
import { Colors, Radius, Shadows } from "../theme";

/**
 * SectionCard
 * Reusable white card container with optional section label above it.
 */
export default function SectionCard({ label, children, style, delay }) {
  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.n500,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.n200,
    overflow: "hidden",
    ...Shadows.card,
  },
});
