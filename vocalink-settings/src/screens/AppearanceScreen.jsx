import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import HeroBar from "../components/HeroBar";
import SettingRow from "../components/SettingRow";
import SectionCard from "../components/SectionCard";
import { Colors, Radius } from "../theme";

const THEMES      = ["light", "dark", "auto"];
const THEME_ICON  = { light: "☀️", dark: "🌙", auto: "🔄" };
const FONT_SIZES  = ["small", "medium", "large"];
const ACCENT_COLORS = [
  { hex: "#0EA5E9", name: "Ocean" },
  { hex: "#6366F1", name: "Indigo" },
  { hex: "#10B981", name: "Emerald" },
  { hex: "#F59E0B", name: "Amber" },
  { hex: "#EF4444", name: "Rose" },
  { hex: "#8B5CF6", name: "Violet" },
];

export default function AppearanceScreen({ settings, update, goBack, toast }) {
  const fontIdx = FONT_SIZES.indexOf(settings.fontSize);

  return (
    <View style={styles.screen}>
      <HeroBar title="Appearance" sub="Personalize your interface" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* Theme */}
        <SectionCard label="Theme">
          <View style={styles.themeRow}>
            {THEMES.map((t) => {
              const active = settings.theme === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.themeCard, active && styles.themeCardActive]}
                  onPress={() => { update("theme", t); toast.show(`${t.charAt(0).toUpperCase() + t.slice(1)} theme applied`, "success"); }}
                  activeOpacity={0.75}
                >
                  <Text style={styles.themeEmoji}>{THEME_ICON[t]}</Text>
                  <Text style={[styles.themeLabel, active && styles.themeLabelActive]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        {/* Font Size */}
        <SectionCard label="Font Size">
          <View style={styles.fontWrap}>
            <View style={styles.fontLabelRow}>
              <Text style={styles.fontLabel}>Text Size</Text>
              <Text style={styles.fontVal}>{settings.fontSize.charAt(0).toUpperCase() + settings.fontSize.slice(1)}</Text>
            </View>
            {/* Manual step buttons since RN Slider needs extra package */}
            <View style={styles.fontSteps}>
              {FONT_SIZES.map((f, i) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.fontStep, settings.fontSize === f && styles.fontStepActive]}
                  onPress={() => update("fontSize", f)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.fontStepText, settings.fontSize === f && styles.fontStepTextActive]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Live preview */}
            <View style={styles.preview}>
              <Text style={[styles.previewTitle, { fontSize: fontIdx === 0 ? 12 : fontIdx === 2 ? 18 : 14 }]}>
                Preview Text
              </Text>
              <Text style={[styles.previewBody, { fontSize: fontIdx === 0 ? 11 : fontIdx === 2 ? 15 : 13 }]}>
                This is how your content will appear in the app.
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Accent Color */}
        <SectionCard label="Accent Color">
          <View style={styles.swatchWrap}>
            <View style={styles.swatches}>
              {ACCENT_COLORS.map(({ hex, name }) => {
                const active = settings.accentColor === hex;
                return (
                  <TouchableOpacity
                    key={hex}
                    style={[styles.swatch, { backgroundColor: hex }, active && styles.swatchActive]}
                    onPress={() => { update("accentColor", hex); toast.show(`${name} accent applied`, "success"); }}
                    activeOpacity={0.8}
                  >
                    {active && <Text style={styles.swatchCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.swatchSelected}>
              Selected:{" "}
              <Text style={{ color: settings.accentColor, fontWeight: "700" }}>
                {ACCENT_COLORS.find((c) => c.hex === settings.accentColor)?.name || "Custom"}
              </Text>
            </Text>
          </View>
        </SectionCard>

        {/* Layout */}
        <SectionCard label="Layout">
          <SettingRow
            icon="grid-outline" iconBg={Colors.brandPale} iconColor={Colors.brandPrimary}
            label="Compact Mode" sub="Reduce spacing between items"
            hasToggle toggleValue={settings.compactMode}
            onToggle={(v) => { update("compactMode", v); toast.show(v ? "Compact mode on" : "Compact mode off", "info"); }}
            chevron={false}
          />
          <SettingRow
            icon="sparkles-outline" iconBg="#D1FAE5" iconColor={Colors.success}
            label="Animations" sub="Motion effects & transitions"
            hasToggle toggleValue={true}
            onToggle={() => {}}
            chevron={false}
            last
          />
        </SectionCard>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => toast.show("Appearance saved!", "success")}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Apply Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.n50 },
  body:   { padding: 16, gap: 20, paddingBottom: 24 },

  themeRow: { flexDirection: "row", gap: 10, padding: 14 },
  themeCard: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.n200,
    backgroundColor: Colors.white,
    alignItems: "center", gap: 5,
  },
  themeCardActive: { borderColor: Colors.brandPrimary, backgroundColor: Colors.brandPale },
  themeEmoji: { fontSize: 22 },
  themeLabel: { fontSize: 11, fontWeight: "700", color: Colors.n600, textTransform: "capitalize" },
  themeLabelActive: { color: Colors.brandPrimary },

  fontWrap: { padding: 16, gap: 12 },
  fontLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fontLabel: { fontSize: 13, fontWeight: "600", color: Colors.n700 },
  fontVal:   { fontSize: 13, fontWeight: "700", color: Colors.brandPrimary },
  fontSteps: { flexDirection: "row", gap: 8 },
  fontStep: {
    flex: 1, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.n200,
    backgroundColor: Colors.white, alignItems: "center",
  },
  fontStepActive: { backgroundColor: Colors.brandPrimary, borderColor: Colors.brandPrimary },
  fontStepText: { fontSize: 12, fontWeight: "600", color: Colors.n600 },
  fontStepTextActive: { color: Colors.white },
  preview: {
    backgroundColor: Colors.n50, borderRadius: 10,
    padding: 12, borderWidth: 1, borderColor: Colors.n200,
  },
  previewTitle: { fontWeight: "600", color: Colors.n900 },
  previewBody:  { color: Colors.n500, marginTop: 3 },

  swatchWrap: { padding: 16, gap: 12 },
  swatches: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  swatch: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 2.5, borderColor: "transparent",
    alignItems: "center", justifyContent: "center",
  },
  swatchActive: { borderColor: Colors.n700, transform: [{ scale: 1.15 }] },
  swatchCheck:  { color: Colors.white, fontSize: 14, fontWeight: "700" },
  swatchSelected: { fontSize: 12, color: Colors.n500 },

  saveBtn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radius.md, paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700", letterSpacing: 0.2 },
});
