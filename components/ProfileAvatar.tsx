// components/ProfileAvatar.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileAvatarProps {
  name: string;
  onEditPress?: () => void;
}

export default function ProfileAvatar({ name, onEditPress }: ProfileAvatarProps) {
  // Extract up to 2 initials from the name
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials || "?"}</Text>
      </View>
      {onEditPress && (
        <TouchableOpacity style={styles.editBadge} onPress={onEditPress}>
          <Ionicons name="camera" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: "center", position: "relative", marginBottom: 20 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#00AEEF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "#E0F6FE",
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  editBadge: {
    position: "absolute", bottom: 0, right: 0,
    backgroundColor: "#1A1A2E", width: 28, height: 28,
    borderRadius: 14, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#FFFFFF",
  },
});