import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  buttonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#00AEEF",
    borderRadius: 10,
  },
  buttonDark: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#111827",
    borderRadius: 10,
  },
  buttonLight: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonTextWhite: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
  buttonTextDark: {
    color: "#111827",
    fontWeight: "700",
    textAlign: "center",
  },
});
