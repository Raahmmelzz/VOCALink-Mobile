// app/index.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/BottomNav"; // <-- 1. Import it here

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <View style={styles.center}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Under construction hehehee
        </Text>
      </View>

      {/* 2. Call it at the bottom of your screen! */}
      <BottomNav activeTab="home" /> 

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F9FF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "800", color: "#1A1A2E" },
  subtitle: {
    fontSize: 14,
    color: "#666", // Changed to grey to fix the red text issue from earlier!
    textAlign: "center",
    paddingHorizontal: 32,
  },
});