import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
// If your group is using the ThemeContext, import it here too!
// import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* <ThemeProvider> */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* This tells the app about your two main areas */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      {/* </ThemeProvider> */}
    </AuthProvider>
  );
}