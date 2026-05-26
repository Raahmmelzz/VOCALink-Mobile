import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../constants/api";
import { forgotPasswordStyles as styles } from "../../styles/forgotPasswordStyles";

export default function ForgotPasswordScreen() {
  const [step, setStep]             = useState<"email" | "reset">("email");
  const [email, setEmail]           = useState("");
  const [code, setCode]             = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const handleSendCode = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send code.");
      if (!data.email_sent) {
        Alert.alert(
          "Email Failed",
          `Code generated but email couldn't be sent.\nError: ${data.email_error ?? "unknown"}\n\nContact support or check Render logs.`
        );
      } else {
        setStep("reset");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (code.length < 6) { setError("Enter the 6-digit code from your email."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Reset failed.");
      Alert.alert("Password Reset", "Your password has been updated. You can now sign in.", [
        { text: "Sign In", onPress: () => router.replace("/(auth)/login" as any) },
      ]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => (step === "reset" ? setStep("email") : router.back())} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Reset Password</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formPanel}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {step === "email" ? (
            <View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a 6-digit reset code.
              </Text>

              <Text style={s.label}>Email Address</Text>
              <TextInput
                style={[s.input, error ? { borderColor: "red" } : null]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {error ? <Text style={s.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.btn, loading && s.btnDisabled]}
                onPress={handleSendCode}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Send Reset Code</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={s.linkBtn} onPress={() => router.push("/(auth)/login" as any)}>
                <Text style={s.linkText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>Enter Reset Code</Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit code to {email}. Enter it below with your new password.
              </Text>

              <Text style={s.label}>6-Digit Code</Text>
              <TextInput
                style={[s.input, s.codeInput, error ? { borderColor: "red" } : null]}
                value={code}
                onChangeText={t => setCode(t.replace(/\D/g, "").slice(0, 6))}
                placeholder="0 0 0 0 0 0"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />

              <Text style={s.label}>New Password</Text>
              <View style={s.passwordRow}>
                <TextInput
                  style={s.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={s.eyeBtn}>
                  <Text style={s.eyeText}>{showPass ? "🙈" : "👁"}</Text>
                </TouchableOpacity>
              </View>

              {error ? <Text style={s.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.btn, loading && s.btnDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Reset Password</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={s.linkBtn}
                onPress={handleSendCode}
                disabled={loading}
              >
                <Text style={s.linkText}>↻ Resend Code</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  label:       { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8, marginTop: 16 },
  input:       { backgroundColor: "#F3F4F6", borderWidth: 1.5, borderColor: "#1AADDC", borderRadius: 12, padding: 16, fontSize: 16, color: "#111827", marginBottom: 4 },
  codeInput:   { fontSize: 24, fontWeight: "800", textAlign: "center", letterSpacing: 10 },
  passwordRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderWidth: 1.5, borderColor: "#1AADDC", borderRadius: 12, marginBottom: 4 },
  passwordInput:{ flex: 1, padding: 16, fontSize: 16, color: "#111827" },
  eyeBtn:      { paddingHorizontal: 14 },
  eyeText:     { fontSize: 20 },
  error:       { color: "#EF4444", fontSize: 13, marginBottom: 8, marginTop: 2 },
  btn:         { backgroundColor: "#1AADDC", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  btnDisabled: { backgroundColor: "#9CA3AF" },
  btnText:     { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  linkBtn:     { alignItems: "center", marginTop: 14 },
  linkText:    { color: "#1AADDC", fontSize: 14, fontWeight: "600" },
});
