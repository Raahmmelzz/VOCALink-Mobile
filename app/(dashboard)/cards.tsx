// app/cards.tsx
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/BottomNav";
import { DashboardCard } from "../../components/DashboardCard"; // Import your new component

export default function CardsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* We use a ScrollView so the page can scroll if you add many cards */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Communication Cards</Text>
          <Text style={styles.subtitle}>Select a category to speak</Text>
        </View>

        {/* This View acts as your Flexbox container for the cards */}
        <View style={styles.cardContainer}>
          {/* Card 1 */}
          <DashboardCard 
            title="Greetings" 
            description="Phrases like 'Hello', 'How are you?', and 'Good morning'." 
          />
          
          {/* Card 2 */}
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
    backgroundColor: "#F3F9FF" 
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Leaves room so the Bottom Nav doesn't cover the last card
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: "#1A1A2E",
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 14, 
    color: "#666", 
    textAlign: "center" 
  },
  // Flexbox container for the cards
  cardContainer: {
    flexDirection: 'column', // Stacks them vertically
    gap: 20, // Adds 20px of space between the two cards
  }
});