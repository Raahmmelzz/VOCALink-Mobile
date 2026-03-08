// theme/index.js
// All design tokens — replaces CSS variables from the web version

export const Colors = {
  brandPrimary: "#0EA5E9",
  brandDeep:    "#0284C7",
  brandDarker:  "#0369A1",
  brandLight:   "#38BDF8",
  brandPale:    "#E0F2FE",
  brandUltra:   "#F0F9FF",

  success: "#10B981",
  warning: "#F59E0B",
  danger:  "#EF4444",
  info:    "#6366F1",

  n900: "#0F172A",
  n800: "#1E293B",
  n700: "#334155",
  n600: "#475569",
  n500: "#64748B",
  n400: "#94A3B8",
  n300: "#CBD5E1",
  n200: "#E2E8F0",
  n100: "#F1F5F9",
  n50:  "#F8FAFC",
  white: "#FFFFFF",
};

export const Fonts = {
  // React Native uses system fonts — closest equivalents to Sora/DM Sans
  display: {
    regular:    { fontWeight: "400" },
    medium:     { fontWeight: "500" },
    semibold:   { fontWeight: "600" },
    bold:       { fontWeight: "700" },
    extrabold:  { fontWeight: "800" },
  },
};

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
};
