// components/ProfileForm.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "./Button";
import InputField from "./InputField";

interface ProfileFormProps {
  fields: { displayName: string; email: string };
  errors: { displayName: string; email: string };
  loading: boolean;
  onFieldChange: (key: "displayName" | "email", value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ProfileForm({
  fields,
  errors,
  loading,
  onFieldChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  return (
    <View style={styles.container}>
      <InputField
        label="Display Name"
        value={fields.displayName}
        onChangeText={(v) => onFieldChange("displayName", v)}
        placeholder="Enter your name"
        error={errors.displayName}
      />
      
      <InputField
        label="Email Address"
        value={fields.email}
        onChangeText={(v) => onFieldChange("email", v)}
        placeholder="you@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <View style={styles.buttonRow}>
        <Button 
          title="Cancel" 
          onPress={onCancel} 
          style={styles.cancelBtn} 
          textStyle={styles.cancelBtnText} 
        />
        <Button 
          title="Save Changes" 
          onPress={onSubmit} 
          loading={loading} 
          style={styles.saveBtn} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginTop: 10 },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  cancelBtn: { flex: 1, backgroundColor: "#F3F9FF", borderWidth: 1, borderColor: "#D6EAF8" },
  cancelBtnText: { color: "#6B7280" },
  saveBtn: { flex: 2, backgroundColor: "#00AEEF" },
});