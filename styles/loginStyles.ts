import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const PHOTO_SIZE = (width - 48) / 2.2;

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00AEEF",
  },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  /* ── Blue Panel ─────────────────────────── */
  bluePanel: {
    minHeight: height * 0.52,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    overflow: "hidden",
  },
  photosContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /* Individual photo positions — all styles here, no inline CSS */
  photoTopLeft: {
    position: "absolute",
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 0.72,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
    top: 0,
    left: 0,
    transform: [{ rotate: "-6deg" }],
  },
  photoTopRight: {
    position: "absolute",
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 0.72,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
    top: 20,
    right: 0,
    transform: [{ rotate: "5deg" }],
  },
  photoBottomLeft: {
    position: "absolute",
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 0.72,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
    bottom: 0,
    left: 0,
    transform: [{ rotate: "-4deg" }],
  },
  photoBottomRight: {
    position: "absolute",
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 0.72,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
    bottom: 20,
    right: 0,
    transform: [{ rotate: "6deg" }],
  },

  /* Center branding */
  centerBrand: {
    alignItems: "center",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  logoIconWrapper: {
    marginBottom: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  logoOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoMiddle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  brandName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  brandTagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },

  /* ── White Form Panel ───────────────────── */
  formPanel: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 28,
    paddingTop: 32,
    paddingBottom: 48,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxOn: {
    backgroundColor: "#00AEEF",
    borderColor: "#00AEEF",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  rememberText: {
    fontSize: 13,
    color: "#6B7280",
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#00AEEF",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00AEEF",
  },
});
