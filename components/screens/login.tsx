import React, { useState } from "react";
import {
  Dimensions,
  Image,
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
import { loginStyles as S } from "../../styles/loginStyles";

const HEROES = [
  require("../../assets/images/hero-1.jpg"),
  require("../../assets/images/hero-2.jpg"),
  require("../../assets/images/hero-3.jpg"),
  require("../../assets/images/hero-4.jpg"),
];

interface LoginProps {
  onLogin: () => void;
  onGoSignup: () => void;
  onEmailChange?: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoSignup, onEmailChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!password) {
      e.password = "Password is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (validate()) onLogin();
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
          {/* Blue top panel with hero photos */}
          <View style={S.bluePanel}>
            <View style={S.photosContainer}>
              <Image source={HEROES[0]} style={S.photoTopLeft} />
              <Image source={HEROES[1]} style={S.photoTopRight} />
              <Image source={HEROES[2]} style={S.photoBottomLeft} />
              <Image source={HEROES[3]} style={S.photoBottomRight} />
            </View>
            <View style={S.centerBrand}>
              <VocaLinkLogo size={48} showLabel={false} color="#FFFFFF" />
              <Text style={S.brandName}>VocaLink</Text>
              <Text style={S.brandTagline}>
                Empowering every voice, every day
              </Text>
            </View>
          </View>

          {/* White form panel */}
          <View style={S.formPanel}>
            <Text style={S.welcomeTitle}>Welcome back</Text>
            <Text style={S.welcomeSubtitle}>Sign in to your account</Text>

            <InputField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                onEmailChange?.(t);
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

            <View style={S.optionsRow}>
              <TouchableOpacity
                style={S.rememberRow}
                onPress={() => setRemember((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={[S.checkbox, remember && S.checkboxOn]}>
                  {remember && <Text style={S.checkmark}>✓</Text>}
                </View>
                <Text style={S.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <Text style={S.forgotText}>Forgot password?</Text>
            </View>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleLogin}
              style={styles.loginBtn}
              textStyle={styles.loginBtnText}
            >
              Log In
            </Button>

            <View style={S.signupRow}>
              <Text style={S.signupText}>{"Don't have an account? "}</Text>
              <Text style={S.signupLink} onPress={onGoSignup}>
                Sign up
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: "#00AEEF",
    borderColor: "#00AEEF",
    borderRadius: 12,
    paddingVertical: 14,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default Login;
