import { ScrollView, View, Text, StyleSheet } from "react-native";
import HeroBar from "../components/HeroBar";
import Toggle from "../components/Toggle";
import SettingRow from "../components/SettingRow";
import SectionCard from "../components/SectionCard";
import { Colors, Radius } from "../theme";

/**
 * NotificationsScreen
 * Detail screen — push toggle, alert types, delivery channels, quiet hours.
 */
export default function NotificationsScreen({ settings, update, goBack, toast }) {
  return (
    <View style={styles.screen}>
      <HeroBar title="Notifications" sub="Control what alerts you receive" onBack={goBack} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* Master Toggle */}
        <View style={styles.masterCard}>
          <View style={styles.masterText}>
            <Text style={styles.masterTitle}>Push Notifications</Text>
            <Text style={styles.masterSub}>Master switch for all alerts</Text>
          </View>
          <Toggle
            value={settings.pushEnabled}
            onChange={(v) => {
              update("pushEnabled", v);
              toast.show(v ? "Notifications enabled" : "Notifications muted", v ? "success" : "info");
            }}
          />
        </View>

        {/* Alert Types */}
        <SectionCard label="Alert Types">
          <SettingRow
            icon="chatbubble-outline" iconBg={Colors.brandPale} iconColor={Colors.brandPrimary}
            label="Session Alerts" sub="New & ended sessions"
            hasToggle toggleValue={settings.sessionAlerts}
            onToggle={(v) => update("sessionAlerts", v)}
            chevron={false}
          />
          <SettingRow
            icon="time-outline" iconBg="#FEF3C7" iconColor="#D97706"
            label="Queue Alerts" sub="Users waiting for interpreter"
            hasToggle toggleValue={settings.queueAlerts}
            onToggle={(v) => update("queueAlerts", v)}
            chevron={false}
          />
          <SettingRow
            icon="people-outline" iconBg="#D1FAE5" iconColor={Colors.success}
            label="Interpreter Updates" sub="Online / offline status"
            hasToggle toggleValue={true}
            onToggle={() => {}}
            chevron={false}
            last
          />
        </SectionCard>

        {/* Delivery Channels */}
        <SectionCard label="Delivery Channels">
          <SettingRow
            icon="mail-outline" iconBg={Colors.brandPale} iconColor={Colors.brandPrimary}
            label="Email Notifications" sub="admin@vocalink.app"
            hasToggle toggleValue={settings.emailEnabled}
            onToggle={(v) => { update("emailEnabled", v); toast.show(v ? "Email alerts enabled" : "Email alerts off", "info"); }}
            chevron={false}
          />
          <SettingRow
            icon="volume-high-outline" iconBg="#EDE9FE" iconColor={Colors.info}
            label="Sound" sub="Play sound for alerts"
            hasToggle toggleValue={settings.soundEnabled}
            onToggle={(v) => update("soundEnabled", v)}
            chevron={false}
          />
          <SettingRow
            icon="phone-portrait-outline" iconBg="#D1FAE5" iconColor={Colors.success}
            label="Vibration" sub="Haptic feedback"
            hasToggle toggleValue={settings.vibrationEnabled}
            onToggle={(v) => update("vibrationEnabled", v)}
            chevron={false}
            last
          />
        </SectionCard>

        {/* Quiet Hours */}
        <SectionCard label="Quiet Hours">
          <View style={styles.quietRow}>
            <View>
              <Text style={styles.quietTitle}>Enable Quiet Hours</Text>
              <Text style={styles.quietSub}>Silence alerts during set times</Text>
            </View>
            <Toggle value={false} onChange={() => toast.show("Quiet hours saved", "success")} />
          </View>
        </SectionCard>

        <View style={styles.btn}>
          <View style={styles.btnInner}>
            <Text
              style={styles.btnText}
              onPress={() => toast.show("Notification settings saved!", "success")}
            >
              Save Changes
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.n50 },
  body: { padding: 16, gap: 20, paddingBottom: 24 },

  masterCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.n200,
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  masterText: { flex: 1 },
  masterTitle: { fontSize: 15, fontWeight: "700", color: Colors.n900 },
  masterSub:   { fontSize: 12, color: Colors.n500, marginTop: 2 },

  quietRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", padding: 16, gap: 12,
  },
  quietTitle: { fontSize: 14, fontWeight: "600", color: Colors.n900 },
  quietSub:   { fontSize: 12, color: Colors.n500, marginTop: 2 },

  btn: { marginTop: 4 },
  btnInner: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { color: Colors.white, fontSize: 14, fontWeight: "700", letterSpacing: 0.2 },
});
