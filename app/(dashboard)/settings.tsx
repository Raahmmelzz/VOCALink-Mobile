// app/settings.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/BottomNav";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <View style={styles.center}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>App Configuration</Text>
      </View>

      <BottomNav activeTab="settings" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F9FF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  title: { fontSize: 22, fontWeight: "800", color: "#1A1A2E" },
  subtitle: { fontSize: 14, color: "#666" },
});