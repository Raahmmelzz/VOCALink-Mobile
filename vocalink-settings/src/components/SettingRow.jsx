import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toggle from "./Toggle";
import { Colors, Radius } from "../theme";

/**
 * SettingRow (reusable)
 * Universal settings list row — icon, label, badge, toggle, or chevron.
 */
export default function SettingRow({
  icon,
  iconBg,
  iconColor,
  label,
  sub,
  value,
  badge,
  badgeType = "blue",
  hasToggle,
  toggleValue,
  onToggle,
  onPress,
  chevron = true,
  danger,
  last = false,
}) {
  const BADGE_STYLES = {
    blue:   { bg: Colors.brandPale,  text: Colors.brandPrimary },
    green:  { bg: "#D1FAE5",         text: Colors.success },
    yellow: { bg: "#FEF3C7",         text: "#B45309" },
    red:    { bg: "#FEE2E2",         text: Colors.danger },
  };

  const badgeCfg = BADGE_STYLES[badgeType] || BADGE_STYLES.blue;

  return (
    <TouchableOpacity
      style={[styles.row, last && styles.rowLast]}
      onPress={onPress}
      activeOpacity={onPress || hasToggle ? 0.7 : 1}
    >
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: iconBg || Colors.brandPale }]}>
          <Ionicons name={icon} size={18} color={iconColor || Colors.brandPrimary} />
        </View>
      )}

      <View style={styles.body}>
        <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
        {sub && <Text style={styles.sub}>{sub}</Text>}
      </View>

      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeCfg.bg }]}>
            <Text style={[styles.badgeText, { color: badgeCfg.text }]}>{badge}</Text>
          </View>
        )}
        {hasToggle && (
          <Toggle value={toggleValue} onChange={onToggle} />
        )}
        {chevron && !hasToggle && (
          <Ionicons name="chevron-forward" size={16} color={Colors.n300} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.n100,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.n900,
  },
  labelDanger: { color: Colors.danger },
  sub: {
    fontSize: 12,
    color: Colors.n500,
    marginTop: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  value: {
    fontSize: 12,
    color: Colors.n400,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
