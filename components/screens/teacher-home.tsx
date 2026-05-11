import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { Colors as C, FontSize, Radius, Shadow, Spacing } from "../../constants/tokens";
import { Badge } from "../ui/shared";

interface Props {
  setActive: (tab: any) => void;
}

const TeacherHome: React.FC<Props> = ({ setActive }) => {
  const { user, token } = useAuth();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const displayName = user?.first_name || user?.username || "Teacher";

  const executeToggle = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/sessions/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsSessionActive(res.data.active);
      setSessionCode(res.data.session_code);

      // 💥 THE MAGIC FIX: If the session just turned ON, teleport them to the chat room!
      if (res.data.active) {
          setActive("teacher-livecc");
      }

    } catch (error) {
      Alert.alert("Error", "Could not toggle the session. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (isSessionActive) {
      // If it's active, they can either end it here or jump back into the room
      Alert.alert("Session in Progress", "What would you like to do?", [
        { text: "Cancel", style: "cancel" },
        { text: "End Class", style: "destructive", onPress: executeToggle },
        { text: "Go to Chat Room", onPress: () => setActive("teacher-livecc") }
      ]);
    } else {
      executeToggle();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <LinearGradient
          colors={isSessionActive ? ["#065F46", "#047857", "#10B981"] : ["#312E81", "#4338CA", "#6366F1"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Badge color={isSessionActive ? "teal" : "gray"} style={{ marginBottom: 10 }}>
            {isSessionActive ? "Class in Session" : "Offline"}
          </Badge>
          <Text style={styles.heroGreeting}>Welcome back,</Text>
          <Text style={styles.heroName}>Teacher {displayName} 🍎</Text>
          <Text style={styles.heroSub}>
            {isSessionActive 
              ? `Session Code: ${sessionCode}` 
              : "Start a session to connect with your students."}
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.startBtn, isSessionActive ? styles.startBtnActive : null]}
            onPress={handleToggle}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
               <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
            ) : (
               <Text style={styles.startBtnEmoji}>{isSessionActive ? "🟢" : "🎙️"}</Text>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.startBtnLabel}>
                {isSessionActive ? "Return to Live Room" : "Start Class Session"}
              </Text>
              <Text style={styles.startBtnSub}>
                {isSessionActive ? "Your class is currently running" : "Open room for live captions & messaging"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classroom Tools</Text>
          <View style={styles.actionGrid}>
            
            <TouchableOpacity 
              style={styles.toolCard} 
              disabled={!isSessionActive}
              onPress={() => setActive("teacher-livecc")} 
            >
              <View style={[styles.toolIconWrap, { backgroundColor: C.tealLight }]}><Text style={styles.toolIcon}>📝</Text></View>
              <Text style={styles.toolLabel}>Live CC</Text>
              <Text style={styles.toolSub}>Broadcast speech</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIconWrap, { backgroundColor: C.purpleLight }]}><Text style={styles.toolIcon}>👥</Text></View>
              <Text style={styles.toolLabel}>Students</Text>
              <Text style={styles.toolSub}>Manage roster</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIconWrap, { backgroundColor: "#FEF08A" }]}><Text style={styles.toolIcon}>💬</Text></View>
              <Text style={styles.toolLabel}>Inbox</Text>
              <Text style={styles.toolSub}>Direct messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIconWrap, { backgroundColor: "#FECACA" }]}><Text style={styles.toolIcon}>📊</Text></View>
              <Text style={styles.toolLabel}>Analytics</Text>
              <Text style={styles.toolSub}>AAC logs</Text>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 40 },
  hero: { padding: Spacing.xl, paddingTop: Spacing.xxl, paddingBottom: Spacing.xxl },
  heroGreeting: { fontSize: FontSize.base, color: "rgba(255,255,255,0.8)", fontWeight: "500", marginTop: 4 },
  heroName: { fontSize: FontSize.xxl, color: "#FFFFFF", fontWeight: "800", letterSpacing: -1, marginTop: 4 },
  heroSub: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.9)", marginTop: 8, fontWeight: "600" },
  section: { padding: Spacing.lg, gap: 14 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: "800", color: C.text, letterSpacing: -0.5 },
  startBtn: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: C.teal, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.md },
  startBtnActive: { backgroundColor: "#047857" },
  startBtnEmoji: { fontSize: 32 },
  startBtnLabel: { fontSize: FontSize.lg, fontWeight: "800", color: C.white },
  startBtnSub: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.8)", marginTop: 4, fontWeight: "500" },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  toolCard: { width: "48%", backgroundColor: C.white, borderRadius: Radius.lg, padding: Spacing.md, alignItems: "flex-start", borderWidth: 1, borderColor: C.gray2, ...Shadow.sm },
  toolIconWrap: { width: 40, height: 40, borderRadius: Radius.md, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  toolIcon: { fontSize: 20 },
  toolLabel: { fontSize: FontSize.md, fontWeight: "700", color: C.text },
  toolSub: { fontSize: FontSize.xs, color: C.text3, marginTop: 4 },
});

export default TeacherHome;