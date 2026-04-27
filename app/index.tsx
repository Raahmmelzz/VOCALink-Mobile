import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

export default function Index() {
  const { token } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Give the app a split second to check the phone's secure storage for the token
  useEffect(() => {
    setTimeout(() => setIsReady(true), 100);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00AEEF" />
      </View>
    );
  }

  // THE TRAFFIC COP:
  if (token) {
    // If they have a token, send them to Marco's tabs!
    return <Redirect href="/(tabs)" />;
  } else {
    // If they don't have a token, force them to log in!
    return <Redirect href="/(auth)/login" />;
  }
}