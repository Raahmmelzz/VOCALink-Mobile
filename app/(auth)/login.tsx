// app/(auth)/login.tsx
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { useAuth } from "../../contexts/AuthContext";
import { useLoginForm } from "../../hooks/useAuthForm";
import { loginStyles as styles } from "../../styles/loginStyles";

const PHOTOS = [
  { source: require("../../assets/images/hero-1.jpg"), style: styles.photoTopLeft },
  { source: require("../../assets/images/hero-2.jpg"), style: styles.photoTopRight },
  { source: require("../../assets/images/hero-3.jpg"), style: styles.photoBottomLeft },
  { source: require("../../assets/images/hero-4.jpg"), style: styles.photoBottomRight },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const { fields, errors, rememberMe, loading, setField, setRememberMe, submitLogin } = useLoginForm();

  const handleLogin = () => {
    submitLogin(() => {
      // Save to global memory
      login({
        displayName: fields.username, 
        email: `${fields.username}@email.com`, 
        username: fields.username,
      });
      // Route to dashboard
      router.replace("/(dashboard)" as any);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={["#00AEEF", "#0284C7", "#0369A1"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bluePanel}>
            <View style={styles.photosContainer}>
              {PHOTOS.map((photo, i) => (
                <Image key={i} source={photo.source} style={photo.style} />
              ))}
            </View>
            <View style={styles.centerBrand}>
              <View style={styles.logoIconWrapper}>
                <View style={styles.logoOuter}>
                  <View style={styles.logoMiddle}>
                    <View style={styles.logoDot} />
                  </View>
                </View>
              </View>
              <Text style={styles.brandName}>VocaLink</Text>
              <Text style={styles.brandTagline}>Empowering people to connect with deaf and mute individuals through seamless communication.</Text>
            </View>
          </LinearGradient>

          <View style={styles.formPanel}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to access your dashboard</Text>

            <InputField label="Username or Email" value={fields.username} onChangeText={(v) => setField("username", v)} placeholder="Enter your username or email" keyboardType="email-address" error={errors.username} />
            <InputField label="Password" value={fields.password} onChangeText={(v) => setField("password", v)} placeholder="••••••••••" secureTextEntry error={errors.password} />

            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)} activeOpacity={0.7}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxOn]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password" as any)}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Button title="Sign In" onPress={handleLogin} loading={loading} />

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup" as any)}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}