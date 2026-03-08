import { StyleSheet } from "react-native";

export const signupStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00AEEF",
  },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  /* ── Top Blue Bar ───────────────────────── */
  topBar: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    gap: 10,
  },
  topBarTagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 18,
  },

  /* ── White Form Panel ───────────────────── */
  formPanel: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 48,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  btn: { marginTop: 8 },

  /* ── Bottom Login Row ───────────────────── */
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00AEEF",
  },
});
