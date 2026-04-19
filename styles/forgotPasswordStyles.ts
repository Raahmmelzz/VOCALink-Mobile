import { StyleSheet } from "react-native";

export const forgotPasswordStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00AEEF",
  },

  /* ── Top Bar ────────────────────────────── */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#00AEEF",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  topBarSpacer: {
    width: 36,
  },

  /* ── White Form Panel ───────────────────── */
  formPanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
    lineHeight: 20,
  },
  btn: {
    marginTop: 8,
    marginBottom: 8,
  },

  /* ── Success State ──────────────────────── */
  successContainer: {
    alignItems: "center",
    paddingTop: 40,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 10,
  },
  successText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
});
