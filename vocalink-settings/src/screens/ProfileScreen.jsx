import {
  ScrollView, View, Text, TextInput,
  TouchableOpacity, StyleSheet,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import HeroBar from "../components/HeroBar";
import SectionCard from "../components/SectionCard";
import { Colors, Radius } from "../theme";

const LANGUAGES = ["English", "Filipino", "Spanish", "French", "Mandarin", "Japanese"];
const TIMEZONES = ["Asia/Manila", "Asia/Tokyo", "Asia/Singapore", "America/New_York", "Europe/London", "Australia/Sydney"];

export default function ProfileScreen({ settings, update, goBack, toast }) {
  const [form, setForm] = useState({
    name:     settings.name,
    email:    settings.email,
    role:     settings.role,
    language: settings.language,
    timezone: settings.timezone,
  });
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showTzPicker,   setShowTzPicker]   = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    Object.entries(form).forEach(([k, v]) => update(k, v));
    toast.show("Profile updated!", "success");
    goBack();
  };

  return (
    <View style={styles.screen}>
      <HeroBar title="Edit Profile" sub="Update your personal info" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarLetter}>{form.name.charAt(0).toUpperCase()}</Text>
            <TouchableOpacity
              style={styles.avatarEditBtn}
              onPress={() => toast.show("Photo upload coming soon", "info")}
            >
              <Ionicons name="camera" size={13} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarChangeText}>Change Photo</Text>
        </View>

        {/* Basic Info */}
        <SectionCard label="Basic Info">
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v) => setField("name", v)}
                placeholder="Your name"
                placeholderTextColor={Colors.n300}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => setField("email", v)}
                placeholder="your@email.com"
                placeholderTextColor={Colors.n300}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Role</Text>
              <TextInput
                style={styles.input}
                value={form.role}
                onChangeText={(v) => setField("role", v)}
                placeholder="Your role"
                placeholderTextColor={Colors.n300}
              />
            </View>
          </View>
        </SectionCard>

        {/* Localization */}
        <SectionCard label="Localization">
          <View style={styles.fields}>
            {/* Language picker */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Language</Text>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => { setShowLangPicker(!showLangPicker); setShowTzPicker(false); }}
                activeOpacity={0.8}
              >
                <Text style={styles.pickerBtnText}>{form.language}</Text>
                <Ionicons name={showLangPicker ? "chevron-up" : "chevron-down"} size={16} color={Colors.n400} />
              </TouchableOpacity>
              {showLangPicker && (
                <View style={styles.dropdown}>
                  {LANGUAGES.map((l) => (
                    <TouchableOpacity
                      key={l}
                      style={[styles.dropdownItem, form.language === l && styles.dropdownItemActive]}
                      onPress={() => { setField("language", l); setShowLangPicker(false); }}
                    >
                      <Text style={[styles.dropdownText, form.language === l && styles.dropdownTextActive]}>{l}</Text>
                      {form.language === l && <Ionicons name="checkmark" size={16} color={Colors.brandPrimary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Timezone picker */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Timezone</Text>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => { setShowTzPicker(!showTzPicker); setShowLangPicker(false); }}
                activeOpacity={0.8}
              >
                <Text style={styles.pickerBtnText}>{form.timezone}</Text>
                <Ionicons name={showTzPicker ? "chevron-up" : "chevron-down"} size={16} color={Colors.n400} />
              </TouchableOpacity>
              {showTzPicker && (
                <View style={styles.dropdown}>
                  {TIMEZONES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.dropdownItem, form.timezone === t && styles.dropdownItemActive]}
                      onPress={() => { setField("timezone", t); setShowTzPicker(false); }}
                    >
                      <Text style={[styles.dropdownText, form.timezone === t && styles.dropdownTextActive]}>{t}</Text>
                      {form.timezone === t && <Ionicons name="checkmark" size={16} color={Colors.brandPrimary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </SectionCard>

        {/* Buttons */}
        <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={goBack} activeOpacity={0.75}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.n50 },
  body:   { padding: 16, gap: 20, paddingBottom: 32 },

  avatarSection: { alignItems: "center", paddingTop: 8, gap: 10 },
  avatarBig: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: Colors.brandPrimary,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: Colors.brandPale,
    position: "relative",
  },
  avatarLetter:  { color: Colors.white, fontSize: 32, fontWeight: "800" },
  avatarEditBtn: {
    position: "absolute", bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.brandDeep, borderWidth: 2, borderColor: Colors.white,
    alignItems: "center", justifyContent: "center",
  },
  avatarChangeText: { fontSize: 12, fontWeight: "600", color: Colors.brandPrimary },

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

  pickerBtn: {
    borderWidth: 1.5, borderColor: Colors.n200, borderRadius: Radius.sm,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: Colors.white,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  pickerBtnText: { fontSize: 14, color: Colors.n900 },
  dropdown: {
    borderWidth: 1.5, borderColor: Colors.n200, borderRadius: Radius.sm,
    backgroundColor: Colors.white, marginTop: 4, overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14, paddingVertical: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomWidth: 1, borderBottomColor: Colors.n100,
  },
  dropdownItemActive: { backgroundColor: Colors.brandUltra },
  dropdownText:       { fontSize: 14, color: Colors.n700 },
  dropdownTextActive: { color: Colors.brandPrimary, fontWeight: "600" },

  saveBtn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radius.md, paddingVertical: 14, alignItems: "center",
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText:   { color: Colors.white, fontSize: 14, fontWeight: "700", letterSpacing: 0.2 },
  cancelBtn: {
    backgroundColor: Colors.n100,
    borderRadius: Radius.md, paddingVertical: 14, alignItems: "center",
  },
  cancelBtnText: { color: Colors.n700, fontSize: 14, fontWeight: "700" },
});
