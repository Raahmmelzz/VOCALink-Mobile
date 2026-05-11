import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import React from 'react';

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1AADDC" />
      </View>
    );
  }

  // If they have a token, send them to the tabs
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, send them to login
  return <Redirect href="/(auth)/login" />;
}