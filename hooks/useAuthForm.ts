import { useState } from "react";

// ─── Login Hook ───────────────────────────────────────────────
interface LoginFields {
  username: string;
  password: string;
}

interface LoginErrors {
  username: string;
  password: string;
}

export function useLoginForm() {
  const [fields, setFields] = useState<LoginFields>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof LoginFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const e: LoginErrors = { username: "", password: "" };
    if (!fields.username.trim()) e.username = "Username or email is required";
    if (!fields.password.trim()) e.password = "Password is required";
    else if (fields.password.length < 6)
      e.password = "Must be at least 6 characters";
    setErrors(e);
    return !e.username && !e.password;
  };

  const submitLogin = (onSuccess: () => void) => {
    if (!validate()) return;
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return {
    fields,
    errors,
    rememberMe,
    loading,
    setField,
    setRememberMe,
    submitLogin,
  };
}

// ─── Signup Hook ──────────────────────────────────────────────
interface SignupFields {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface SignupErrors {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export function useSignupForm() {
  const [fields, setFields] = useState<SignupFields>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignupErrors>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof SignupFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const e: SignupErrors = {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };
    if (!fields.fullName.trim()) e.fullName = "Full name is required";
    if (!fields.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      e.email = "Enter a valid email";
    if (!fields.username.trim()) e.username = "Username is required";
    if (!fields.password.trim()) e.password = "Password is required";
    else if (fields.password.length < 6) e.password = "Minimum 6 characters";
    if (fields.confirmPassword !== fields.password)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const submitSignup = (onSuccess: () => void) => {
    if (!validate()) return;
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return { fields, errors, loading, setField, submitSignup };
}

// ─── Forgot Password Hook ─────────────────────────────────────
export function useForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const submitReset = () => {
    if (!validate()) return;
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return { email, setEmail, error, loading, sent, submitReset };
}
