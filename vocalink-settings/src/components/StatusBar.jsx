import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../theme";

/**
 * StatusBar
 * Custom status bar strip shown at the top of the shell.
 */
export default function StatusBar() {
  const insets = useSafeAreaInsets();
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.icons}>
        {/* Signal dots */}
        <View style={styles.signalWrap}>
          {[0.3, 0.55, 0.8, 1].map((op, i) => (
            <View key={i} style={[styles.signalBar, { height: 6 + i * 3, opacity: op }]} />
          ))}
        </View>
        {/* Battery */}
        <View style={styles.battery}>
          <View style={styles.batteryFill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.brandDeep,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  time: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signalWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  signalBar: {
    width: 3,
    backgroundColor: Colors.white,
    borderRadius: 1,
  },
  battery: {
    width: 22,
    height: 11,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 3,
    overflow: "hidden",
  },
  batteryFill: {
    width: "68%",
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
});
