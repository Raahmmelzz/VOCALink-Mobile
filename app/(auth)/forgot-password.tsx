import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { useForgotPasswordForm } from "../../hooks/useAuthForm";
import { forgotPasswordStyles as styles } from "../../styles/forgotPasswordStyles";

export default function ForgotPasswordScreen() {
  const { email, setEmail, error, loading, sent, submitReset } =
    useForgotPasswordForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Reset Password</Text>
        <View style={styles.topBarSpacer} />
      </View>

      {/* White Form Panel */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formPanel}
      >
        {sent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Email Sent!</Text>
            <Text style={styles.successText}>
              Check your inbox for instructions to reset your password.
            </Text>
            <Button
              title="Back to Sign In"
              onPress={() => router.push("/(auth)/login" as any)}
              style={styles.btn}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a reset link.
            </Text>
            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={error}
            />
            <Button
              title="Send Reset Link"
              onPress={submitReset}
              loading={loading}
              style={styles.btn}
            />
            <Button
              title="Back to Sign In"
              onPress={() => router.push("/(auth)/login" as any)}
              variant="ghost"
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
