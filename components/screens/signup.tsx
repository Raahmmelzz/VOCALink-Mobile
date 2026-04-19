import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VocaLinkLogo from "../ui/VocaLinkLogo";
import { Button } from "../ui/shared";
import InputField from "../ui/InputField";
import { signupStyles as S } from "../../styles/signupStyles";
import { Colors as C, Radius, Spacing } from "../../constants/tokens";

export type UserStatus = "student" | "teacher";

interface SignupProps {
  onSignup: (name: string, status: UserStatus, email: string) => void;
  onGoLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onGoLogin }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<UserStatus>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Full name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address.";
    if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (password !== confirm || !confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = () => {
    if (validate()) onSignup(name.trim(), status, email.trim());
  };

  return (
    <SafeAreaView style={S.safeArea}>
      <KeyboardAvoidingView
        style={S.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={S.flex}
          contentContainerStyle={S.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Blue top bar */}
          <View style={S.topBar}>
            <VocaLinkLogo size={40} showLabel color="#FFFFFF" />
            <Text style={S.topBarTagline}>Create your account to get started</Text>
          </View>

          {/* White form panel */}
          <View style={S.formPanel}>
            <Text style={S.title}>Create account</Text>
            <Text style={S.subtitle}>Join the VocaLink community</Text>

            <InputField
              label="Full name"
              placeholder="Your full name"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              autoCapitalize="words"
              error={errors.name}
            />

            {/* Status selector */}
            <View style={styles.statusGroup}>
              <Text style={styles.statusLabel}>I am a...</Text>
              <View style={styles.statusRow}>
                {(["student", "teacher"] as UserStatus[]).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.statusOpt,
                      status === opt && styles.statusOptActive,
                    ]}
                    onPress={() => setStatus(opt)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.statusOptText,
                        status === opt && styles.statusOptTextActive,
                      ]}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <InputField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password)
                  setErrors((p) => ({ ...p, password: undefined }));
              }}
              secureTextEntry
              error={errors.password}
              style={{ marginTop: 12 }}
            />

            <InputField
              label="Confirm password"
              placeholder="••••••••"
              value={confirm}
              onChangeText={(t) => {
                setConfirm(t);
                if (errors.confirm)
                  setErrors((p) => ({ ...p, confirm: undefined }));
              }}
              secureTextEntry
              error={errors.confirm}
              style={{ marginTop: 12 }}
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSignup}
              style={[S.btn, styles.signupBtn]}
              textStyle={styles.signupBtnText}
            >
              Sign Up
            </Button>

            <View style={S.loginRow}>
              <Text style={S.loginText}>{"Already have an account? "}</Text>
              <Text style={S.loginLink} onPress={onGoLogin}>
                Log in
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusGroup: {
    marginTop: 12,
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text2,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusOpt: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: C.gray2,
    alignItems: "center",
    backgroundColor: C.white,
  },
  statusOptActive: {
    borderColor: C.purple,
    backgroundColor: C.purpleLight,
  },
  statusOptText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text2,
  },
  statusOptTextActive: {
    color: C.purple,
  },
  signupBtn: {
    backgroundColor: "#00AEEF",
    borderColor: "#00AEEF",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: Spacing.lg,
  },
  signupBtnText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default Signup;
