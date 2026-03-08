// components/BottomNav.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavProps {
  activeTab: 'home' | 'cards' | 'settings';
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      {/* Home Tab */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.replace('/')} // Goes to app/index.tsx
      >
        <Ionicons name={activeTab === 'home' ? 'home' : 'home-outline'} size={24} color={activeTab === 'home' ? '#00AEEF' : '#9CB8CC'} />
        <Text style={[styles.tabLabel, { color: activeTab === 'home' ? '#00AEEF' : '#9CB8CC', fontWeight: activeTab === 'home' ? '700' : '400' }]}>Home</Text>
      </TouchableOpacity>

      {/* Cards Tab */}
      {/* Cards Tab (Text-to-Speech Cards) */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.replace('/cards')} 
      >
        <Ionicons 
          name={activeTab === 'cards' ? 'grid' : 'grid-outline'} 
          size={24} 
          color={activeTab === 'cards' ? '#00AEEF' : '#9CB8CC'} 
        />
        <Text style={[styles.tabLabel, { color: activeTab === 'cards' ? '#00AEEF' : '#9CB8CC', fontWeight: activeTab === 'cards' ? '700' : '400' }]}>
          Cards
        </Text>
      </TouchableOpacity>

      {/* Settings Tab */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.replace('/settings')} // Goes to app/settings.tsx
      >
        <Ionicons name={activeTab === 'settings' ? 'settings' : 'settings-outline'} size={24} color={activeTab === 'settings' ? '#00AEEF' : '#9CB8CC'} />
        <Text style={[styles.tabLabel, { color: activeTab === 'settings' ? '#00AEEF' : '#9CB8CC', fontWeight: activeTab === 'settings' ? '700' : '400' }]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: Platform.OS === 'ios' ? 85 : 70, 
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10, 
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});