import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();

  const isTeacher = user?.status === "TEACHER";

  // Shared Fields
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  
  // Student-only Fields
  const [gradeLevel, setGradeLevel] = useState(user?.grade_level ?? "");
  const [disabilityType, setDisabilityType] = useState(user?.disability_type ?? "");
  
  // Teacher-only Fields
  const [department, setDepartment] = useState(user?.department ?? "");
  const [gradeHandled, setGradeHandled] = useState(user?.grade_handled ?? "");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
      };

      if (isTeacher) {
        payload.department = department.trim() || undefined;
        payload.grade_handled = gradeHandled.trim() || undefined;
      } else {
        payload.grade_level = gradeLevel.trim() || undefined;
        payload.disability_type = disabilityType.trim() || undefined;
      }

      await updateProfile(payload);
      Alert.alert("Saved", "Your profile has been updated.");
      router.back();
    } catch {
      Alert.alert("Error", "Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionLabel}>Personal Info</Text>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            autoCapitalize="words"
          />

          <Text style={styles.sectionLabel}>
            {isTeacher ? "Professional Details" : "Student Details"}
          </Text>

          {!isTeacher ? (
            <>
              <Text style={styles.label}>Grade Level & Section</Text>
              <TextInput
                style={styles.input}
                value={gradeLevel}
                onChangeText={setGradeLevel}
                placeholder="e.g. Grade 10 - Section A"
                autoCapitalize="words"
              />
              
              <Text style={styles.label}>Disability Type</Text>
              <TextInput
                style={styles.input}
                value={disabilityType}
                onChangeText={setDisabilityType}
                placeholder="e.g. Deaf, Mute"
                autoCapitalize="sentences"
              />
            </>
          ) : (
             <>
              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                value={department}
                onChangeText={setDepartment}
                placeholder="e.g. Special Education"
                autoCapitalize="words"
              />
              
              <Text style={styles.label}>Grades Handled</Text>
              <TextInput
                style={styles.input}
                value={gradeHandled}
                onChangeText={setGradeHandled}
                placeholder="e.g. Grades 7 to 10"
                autoCapitalize="words"
              />
            </>
          )}

          <Text style={styles.readOnlyNote}>
            Username and email cannot be changed here.
          </Text>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  container: { padding: 20, paddingBottom: 48 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  backBtn: { padding: 8 },
  backText: { fontSize: 15, color: "#1AADDC", fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "800", color: "#111827" },
  form: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#1AADDC", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14, marginTop: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 14, fontSize: 15, color: "#111827", marginBottom: 18 },
  readOnlyNote: { fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 4, marginBottom: 24 },
  saveBtn: { backgroundColor: "#1AADDC", padding: 16, borderRadius: 12, alignItems: "center" },
  saveBtnDisabled: { backgroundColor: "#9CA3AF" },
  saveBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});