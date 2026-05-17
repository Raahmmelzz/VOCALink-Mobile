import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors as C, FontSize, Spacing } from "../../constants/tokens";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, right }) => (
  <LinearGradient
    colors={["#1AADDC", "#0E8DB8"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.header}
  >
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right && <View style={styles.right}>{right}</View>}
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left:     { flex: 1 },
  title:    { fontSize: FontSize.lg, fontWeight: "800", color: C.white, letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.75)", marginTop: 2, fontWeight: "500" },
  right:    { marginLeft: 12 },
});
