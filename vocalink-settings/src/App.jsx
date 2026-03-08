import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAppNavigation } from "./hooks/useAppNavigation";
import { useSettings }      from "./hooks/useSettings";
import { useToast }         from "./hooks/useToast";

import AppStatusBar   from "./components/StatusBar";
import BottomNav      from "./components/BottomNav";
import Toast          from "./components/Toast";

import SettingsScreen      from "./screens/SettingsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import AppearanceScreen    from "./screens/AppearanceScreen";
import PrivacyScreen       from "./screens/PrivacyScreen";
import ProfileScreen       from "./screens/ProfileScreen";

import { Colors } from "./theme";

const SETTINGS_SCREENS = ["settings", "notifications", "appearance", "privacy", "profile"];

export default function App() {
  const { screen, navigate, goBack } = useAppNavigation("settings");
  const { settings, update }         = useSettings();
  const toast                        = useToast();

  const isKnownScreen = SETTINGS_SCREENS.includes(screen);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.shell}>
        <AppStatusBar />

        <View style={styles.screenWrap}>
          {screen === "settings"      && <SettingsScreen      settings={settings} update={update} navigate={navigate} toast={toast} />}
          {screen === "notifications" && <NotificationsScreen settings={settings} update={update} goBack={goBack}    toast={toast} />}
          {screen === "appearance"    && <AppearanceScreen    settings={settings} update={update} goBack={goBack}    toast={toast} />}
          {screen === "privacy"       && <PrivacyScreen       goBack={goBack} toast={toast} />}
          {screen === "profile"       && <ProfileScreen       settings={settings} update={update} goBack={goBack}    toast={toast} />}

          {!isKnownScreen && (
            <View style={styles.placeholder}>
              <View style={styles.placeholderIcon}>
                <Ionicons name="information-circle-outline" size={28} color={Colors.brandPrimary} />
              </View>
              <Text style={styles.placeholderTitle}>
                {screen.charAt(0).toUpperCase() + screen.slice(1)}
              </Text>
              <Text style={styles.placeholderSub}>This section is coming soon</Text>
              <TouchableOpacity
                style={styles.placeholderBtn}
                onPress={() => navigate("settings")}
                activeOpacity={0.85}
              >
                <Text style={styles.placeholderBtnText}>Go to Settings</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Toast toast={toast.toast} />
        <BottomNav active={screen} onNav={navigate} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: Colors.n50,
  },
  screenWrap: {
    flex: 1,
    overflow: "hidden",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 40,
  },
  placeholderIcon: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: Colors.brandPale,
    alignItems: "center", justifyContent: "center",
  },
  placeholderTitle: {
    fontSize: 18, fontWeight: "700", color: Colors.n900,
  },
  placeholderSub: {
    fontSize: 13, color: Colors.n500,
  },
  placeholderBtn: {
    marginTop: 4,
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 20,
  },
  placeholderBtnText: {
    color: Colors.white, fontSize: 13, fontWeight: "700",
  },
});
