import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Modal</Text>

      <Pressable
        onPress={() => router.back()}
        style={{ padding: 12, backgroundColor: "#111827", borderRadius: 10 }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Close</Text>
      </Pressable>
    </View>
  );
}
