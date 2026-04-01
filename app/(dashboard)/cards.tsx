import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/BottomNav";
import { DashboardCard } from "../../components/DashboardCard";
import { useTheme } from "../../contexts/ThemeContext"; // 1. Bring in the brain!

const C = {
  primary: "#00AEEF",
  white: "#FFFFFF",
};

export default function CardsScreen() {
  const { theme } = useTheme(); // 2. Hook into Dark Mode

  return (
    // 3. Dynamic background color applied
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      {/* 4. The Signature Blue Header! */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerTitle}>Communication Cards</Text>
        <Text style={styles.headerSubtitle}>Select a category to speak</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <DashboardCard 
            title="Greetings" 
            description="Phrases like 'Hello', 'How are you?', and 'Good morning'." 
          />
          <DashboardCard 
            title="Needs & Wants" 
            description="Phrases for eating, drinking, and asking for help." 
          />
        </View>
      </ScrollView>

      <BottomNav activeTab="cards" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#EEF7FF" // Base fallback background
  },
  // Exact matched styling from Settings/Profile
  header: { 
    backgroundColor: C.primary, 
    paddingHorizontal: 20, 
    paddingTop: 8, 
    paddingBottom: 24, 
    position: "relative", 
    overflow: "hidden" 
  },
  headerAccent: { 
    position: "absolute", 
    top: -40, 
    right: -40, 
    width: 160, 
    height: 160, 
    borderRadius: 80, 
    backgroundColor: "rgba(255,255,255,0.12)" 
  },
  headerTitle: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "rgba(255,255,255,0.75)", 
    letterSpacing: 1.5, 
    textTransform: "uppercase", 
    marginBottom: 8 
  },
  headerSubtitle: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: C.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  cardContainer: {
    flexDirection: 'column', 
    gap: 16, 
  }
});