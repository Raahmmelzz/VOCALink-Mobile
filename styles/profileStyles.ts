<<<<<<< HEAD
// styles/profileStyles.ts
import { StyleSheet } from "react-native";

const C = {
  primary: "#00AEEF",
  white: "#FFFFFF",
  grayLight: "#F3F9FF",
  gray: "#6B7280",
};

export const profileStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EEF7FF" }, 
  flex: { flex: 1 },
  header: { 
    backgroundColor: C.primary, 
    paddingHorizontal: 20, 
    paddingTop: 8,       
    // 1. Shrunk this from 60 down to 30!
    paddingBottom: 30,   
    position: "relative", 
    overflow: "hidden" 
  },
  headerAccent: { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.12)" },
  
  headerTitle: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "rgba(255,255,255,0.75)", 
    letterSpacing: 1.5, 
    textTransform: "uppercase", 
    marginBottom: 16 
  },
  
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  
  card: { 
    backgroundColor: C.white, 
    borderRadius: 20, 
    padding: 24, 
    // 2. Pulled this up to -15 so it still overlaps the newly shrunk header perfectly
    marginTop: -15, 
    shadowColor: "#0090C8", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 5 
  },
  divider: { height: 1, backgroundColor: "#E0EFF9", marginVertical: 24 }, 
=======
import { Platform, StyleSheet } from "react-native";

// ─── Match your existing token colors ───────────────────────────────
const C = {
  teal:        "#2E9E8E",
  tealLight:   "#E8F5F3",
  purple:      "#7C5CBF",
  purpleLight: "#EDE8F7",
  bg:          "#F5F3EF",
  white:       "#FFFFFF",
  text:        "#1A1916",
  text2:       "#5A5855",
  text3:       "#9A9895",
  border:      "#E2E0DC",
  divider:     "#EEECE8",
  green:       "#4CAF50",
  red:         "#A32D2D",
  redBorder:   "#F09595",
  redLight:    "#FEF0F0",
  redBtn:      "#FCEBEB",
};

export const profileStyles = StyleSheet.create({

  // ── Layout ────────────────────────────────────────────────────────
  container:     { flex: 1, backgroundColor: C.bg },
  scrollContent: { padding: 16, paddingBottom: 48 },

  // ── Header bar ───────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 52 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle:  { fontSize: 17, fontWeight: "600", color: C.text },
  backBtn:      { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  backArrow:    { fontSize: 22, color: C.text2 },

  // ── Avatar section ───────────────────────────────────────────────
  avatarSection: {
    alignItems: "center",
    backgroundColor: C.white,
    paddingVertical: 18,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage:    { width: "100%", height: "100%", resizeMode: "cover" },
  avatarInitials: { fontSize: 26, fontWeight: "600" },
  avatarEditBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.white,
  },
  avatarEditIcon: { fontSize: 10, color: C.white },
  avatarName:     { fontSize: 16, fontWeight: "600", color: C.text, marginTop: 4 },
  avatarSub:      { fontSize: 12, color: C.text3 },

  // ── Online pill ──────────────────────────────────────────────────
  onlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  onlineDot:  { width: 7, height: 7, borderRadius: 4 },
  onlineText: { fontSize: 11, fontWeight: "500" },

  // ── Tab bar ──────────────────────────────────────────────────────
  tabBar: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  tabItem:      { flex: 1, alignItems: "center", paddingVertical: 10, position: "relative" },
  tabText:      { fontSize: 13, color: C.text3 },
  tabIndicator: { position: "absolute", bottom: 0, left: "10%", right: "10%", height: 2, borderRadius: 1 },

  // ── Card ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 13, fontWeight: "600", color: C.text, marginBottom: 4 },

  // ── Edit button ──────────────────────────────────────────────────
  editBtn:     { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  editBtnText: { fontSize: 12 },

  // ── Meta rows (read-only key/value) ──────────────────────────────
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  metaLabel: { fontSize: 12, color: C.text3 },
  metaValue: { fontSize: 12, fontWeight: "500", color: C.text },

  // ── Field rows (editable) ────────────────────────────────────────
  fieldRow: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  fieldLabel: {
    fontSize: 10,
    color: C.text3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  fieldValue: { fontSize: 13, fontWeight: "500", color: C.text },
  fieldInput: {
    fontSize: 13,
    color: C.text,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  // ── Password inputs ──────────────────────────────────────────────
  pwInput: {
    fontSize: 13,
    color: C.text,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pwFieldLabel: { fontSize: 11, color: C.text3, marginBottom: 4 },

  // ── Save / Cancel row ────────────────────────────────────────────
  saveRow:       { flexDirection: "row", gap: 8, marginTop: 14 },
  cancelBtn:     { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 9, alignItems: "center" },
  cancelBtnText: { fontSize: 13, color: C.text2 },
  saveBtn:       { flex: 1, borderRadius: 10, paddingVertical: 9, alignItems: "center" },
  saveBtnText:   { fontSize: 13, fontWeight: "600", color: C.white },

  // ── Full-width action button (e.g. "Update password") ───────────
  fullBtn:     { borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 4 },
  fullBtnText: { fontSize: 13, fontWeight: "600", color: C.white },

  // ── Section label (UPPERCASE heading inside a card) ──────────────
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.text3,
    marginTop: 14,
    marginBottom: 4,
  },

  // ── Toggle rows ──────────────────────────────────────────────────
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  toggleLabel: { fontSize: 13, fontWeight: "500", color: C.text },
  toggleSub:   { fontSize: 11, color: C.text3, marginTop: 2 },

  // ── Stat cards ───────────────────────────────────────────────────
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 8, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "700" },
  statLabel: { fontSize: 10, marginTop: 2, textAlign: "center", lineHeight: 13 },

  // ── Active sessions ──────────────────────────────────────────────
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  sessionDot:    { width: 8, height: 8, borderRadius: 4 },
  sessionDevice: { fontSize: 12, color: C.text },
  sessionTime:   { fontSize: 11, color: C.text3 },

  // ── Danger zone ──────────────────────────────────────────────────
  dangerZone: {
    borderWidth: 1,
    borderColor: C.redBorder,
    borderRadius: 14,
    padding: 16,
    backgroundColor: C.redLight,
  },
  dangerTitle: { fontSize: 13, fontWeight: "600", color: C.red, marginBottom: 4 },
  dangerBody:  { fontSize: 12, color: C.text3, marginBottom: 12, lineHeight: 18 },
  dangerOutlineBtn: {
    borderWidth: 1,
    borderColor: C.redBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
    backgroundColor: C.redBtn,
  },
  dangerOutlineBtnText: { fontSize: 12, color: C.red },
>>>>>>> origin/marco-dashboard
});