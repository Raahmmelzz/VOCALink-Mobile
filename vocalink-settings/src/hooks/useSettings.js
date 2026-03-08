import { useState, useCallback } from "react";

const DEFAULT_SETTINGS = {
  // Notifications
  pushEnabled:      true,
  emailEnabled:     false,
  sessionAlerts:    true,
  queueAlerts:      true,
  soundEnabled:     true,
  vibrationEnabled: true,
  // Appearance
  theme:       "light",
  fontSize:    "medium",
  accentColor: "#0EA5E9",
  compactMode: false,
  // Profile
  name:     "Admin User",
  email:    "admin@vocalink.app",
  role:     "Administrator",
  language: "English",
  timezone: "Asia/Manila",
};

/**
 * useSettings
 * Centralized settings state shared across all screens.
 */
export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const update = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { settings, update };
}
