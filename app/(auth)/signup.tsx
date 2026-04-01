import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
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
import VocaLinkLogo from "../../components/VocaLinkLogo";
import { useAuth } from "../../contexts/AuthContext";
import { useSignupForm } from "../../hooks/useAuthForm";
import { signupStyles as styles } from "../../styles/signupStyles";

export default function SignupScreen() {
  const { login } = useAuth();
  const { fields, errors, loading, setField, submitSignup } = useSignupForm();

  const handleSignup = () => {
    submitSignup(() => {
      // 1. Save the new user to global memory FIRST
      login({
        displayName: fields.fullName, 
        email: fields.email,
        username: fields.username,
      });
      
      // 2. Route to dashboard safely
      router.replace("/(dashboard)" as any);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={["#00AEEF", "#0284C7", "#0369A1"]} style={styles.topBar}>
            <VocaLinkLogo size="small" dark={false} />
            <Text style={styles.topBarTagline}>Join thousands empowering communication</Text>
          </LinearGradient>

          <View style={styles.formPanel}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started with VocaLink</Text>

            <InputField label="Full Name" value={fields.fullName} onChangeText={(v) => setField("fullName", v)} placeholder="Enter your full name" autoCapitalize="words" error={errors.fullName} />
            <InputField label="Email Address" value={fields.email} onChangeText={(v) => setField("email", v)} placeholder="Enter your email" keyboardType="email-address" error={errors.email} />
            <InputField label="Username" value={fields.username} onChangeText={(v) => setField("username", v)} placeholder="Choose a username" error={errors.username} />
            <InputField label="Password" value={fields.password} onChangeText={(v) => setField("password", v)} placeholder="Create a password" secureTextEntry error={errors.password} />
            <InputField label="Confirm Password" value={fields.confirmPassword} onChangeText={(v) => setField("confirmPassword", v)} placeholder="Repeat your password" secureTextEntry error={errors.confirmPassword} />

            <Button title="Create Account" onPress={handleSignup} loading={loading} style={styles.btn} />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}