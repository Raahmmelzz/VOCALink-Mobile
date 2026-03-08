// components/DashboardCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// We define what props the component can accept
interface DashboardCardProps {
  title: string;
  description: string;
}

export function DashboardCard({ title, description }: DashboardCardProps) {
  return (
    <View style={styles.dashboardCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
    </View>
  );
}

// Your CSS translated to React Native styles
const styles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: '#ffffff', // var(--white)
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2c2020',
    // Box shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Box shadow for Android
    elevation: 4, 
    width: '100%',
    gap: 16,
    alignItems: 'flex-start',
  },
  // Text styling inside the card
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  }
});