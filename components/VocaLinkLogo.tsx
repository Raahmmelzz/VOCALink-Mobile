import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  dark?: boolean;
}

export default function VocaLinkLogo({ size = 'medium', dark = false }: LogoProps) {
  const scale = size === 'small' ? 0.75 : size === 'large' ? 1.4 : 1;
  const textColor = dark ? '#1A1A2E' : '#FFFFFF';

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]}>
        <Ionicons name="radio-button-on" size={22 * scale} color="#FFFFFF" />
      </View>
      <Text style={[styles.name, { fontSize: 28 * scale, color: textColor }]}>VocaLink</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  name: { fontWeight: '800', letterSpacing: -0.5 },
});