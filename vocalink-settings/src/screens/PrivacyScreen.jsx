import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import HeroBar from "../components/HeroBar";
import SectionCard from "../components/SectionCard";
import { Colors, Radius } from "../theme";

export default function PrivacyScreen({ goBack, toast }) {
  const [current,  setCurrent]  = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [confirm,  setConfirm]  = useState("");

  const handleUpdate = () => {
    if (!current || !newPass || !confirm) {
      toast.show("Please fill in all fields", "error");
      return;
    }
    if (newPass !== confirm) {
      toast.show("Passwords do not match", "error");
      return;
    }
    toast.show("Password updated!", "success");
    setCurrent(""); setNewPass(""); setConfirm("");
  };

  return (
    <View style={styles.screen}>
      <HeroBar title="Privacy & Security" sub="Change your password" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        <SectionCard label="Password">
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.n300}
                secureTextEntry
                value={current}
                onChangeText={setCurrent}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.n300}
                secureTextEntry
                value={newPass}
                onChangeText={setNewPass}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.n300}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>
          </View>
        </SectionCard>

        <TouchableOpacity style={styles.btn} onPress={handleUpdate} activeOpacity={0.85}>
          <Text style={styles.btnText}>Update Password</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.n50 },
  body:   { padding: 16, gap: 20, paddingBottom: 24 },

  fields: { padding: 16, gap: 14 },
  field:  { gap: 6 },
  fieldLabel: {
    fontSize: 11, fontWeight: "700", color: Colors.n600,
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5, borderColor: Colors.n200, borderRadius: Radius.sm,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: Colors.n900, backgroundColor: Colors.white,
  },

  btn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radius.md, paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnText: { color: Colors.white, fontSize: 14, fontWeight: "700", letterSpacing: 0.2 },
});
