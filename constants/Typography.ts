import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: "400",
    color: Colors.text.secondary,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  link: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.text.muted,
  },
});
