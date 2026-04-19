import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - 64) / 2;

export default StyleSheet.create({
  safe:   { flex: 1, backgroundColor: "#F5F3EF" },
  scroll: { paddingBottom: 32 },

  // ── Topbar ──────────────────────────────────────────────────────
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 10,
  },

  // ── Avatar (replaces mic icon) ───────────────────────────────────
  avatarBtn: {
    // just a touchable wrapper — no extra padding needed
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7C5CBF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // ── Greeting ────────────────────────────────────────────────────
  greetingTexts: { flex: 1, gap: 2 },
  greeting:      { fontSize: 15, fontWeight: "700", color: "#1A1916" },
  section:       { fontSize: 12, color: "#9A9895" },

  // ── Teacher reply banner ─────────────────────────────────────────
  replyBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  replyLabel: { fontSize: 11, fontWeight: "700", color: "#3B82F6", marginBottom: 4 },
  replyText:  { fontSize: 14, color: "#1E3A5F" },

  // ── Card ─────────────────────────────────────────────────────────
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1A1916" },
  cardSub:   { fontSize: 13, color: "#00AEEF", fontWeight: "600" },

  // ── Icon grid ────────────────────────────────────────────────────
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // ── CTA row ──────────────────────────────────────────────────────
  ctaRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  ctaBtn: {
    flex: 1,
    backgroundColor: "#00AEEF",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF", textAlign: "center" },

  // ── Info rows (Today's session) ───────────────────────────────────
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  infoLbl: { fontSize: 13, color: "#9A9895" },
  infoVal: { fontSize: 13, fontWeight: "600", color: "#1A1916" },

  // ── Legacy hero / landing styles (kept for other screens) ────────
  hero: { paddingBottom: 36 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  signInBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  signInBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  imageGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  imageLeft:        { flex: 1, gap: 12 },
  imageRight:       { flex: 1, gap: 12, marginTop: 28 },
  heroImage:        { width: "100%", borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)" },
  imageTopLeft:     { height: IMAGE_SIZE * 0.85 },
  imageBottomLeft:  { height: IMAGE_SIZE * 0.65 },
  imageTopRight:    { height: IMAGE_SIZE * 0.65 },
  imageBottomRight: { height: IMAGE_SIZE * 0.85 },
  heroText:         { paddingHorizontal: 24, marginBottom: 24, alignItems: "center" },
  heroTagline: {
    fontSize: 12, fontWeight: "700", color: "rgba(255,255,255,0.75)",
    letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28, fontWeight: "800", color: "#FFFFFF",
    textAlign: "center", letterSpacing: -0.5, lineHeight: 36, marginBottom: 12,
  },
  heroSubtitle:     { fontSize: 15, color: "rgba(255,255,255,0.85)", textAlign: "center", lineHeight: 22 },
  ctaContainer:     { paddingHorizontal: 24, gap: 12 },
  ctaPrimary: {
    backgroundColor: "#FFFFFF", height: 52, borderRadius: 14,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  ctaPrimaryText:   { fontSize: 15, fontWeight: "700", color: "#00AEEF" },
  ctaSecondary:     { height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)" },
  ctaSecondaryText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  featuresSection:  { padding: 24, paddingTop: 36 },
  sectionTitle:     { fontSize: 24, fontWeight: "800", color: "#1A1A2E", marginBottom: 6 },
  sectionSubtitle:  { fontSize: 14, color: "#6B7280", lineHeight: 20, marginBottom: 24 },
  featureCards:     { gap: 12 },
  featureCard:      { padding: 20, borderRadius: 18, flexDirection: "row", alignItems: "center", gap: 14 },
  featureIcon:      { fontSize: 32 },
  featureTitle:     { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  featureSubtitle:  { fontSize: 13, color: "#6B7280", marginTop: 2 },
  statsSection: {
    paddingVertical: 36, paddingHorizontal: 24, alignItems: "center",
    marginHorizontal: 24, borderRadius: 24, marginBottom: 32,
  },
  statsSectionTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 24 },
  statsRow:          { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  statItem:          { alignItems: "center" },
  statValue:         { fontSize: 26, fontWeight: "800", color: "#FFFFFF" },
  statLabel:         { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2, fontWeight: "500" },
  bottomCta:         { padding: 24, paddingBottom: 48, alignItems: "center", gap: 12 },
  bottomCtaTitle:    { fontSize: 24, fontWeight: "800", color: "#1A1A2E", textAlign: "center" },
  bottomCtaSubtitle: { fontSize: 14, color: "#6B7280", marginBottom: 8, textAlign: "center" },
});