import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

import AACBoard      from "../../components/screens/board";
import Home          from "../../components/screens/home";
import TeacherHome   from "../../components/screens/teacher-home";
import TeacherLiveCC from "../../components/screens/teacher-livecc";
import LiveCC        from "../../components/screens/livecc";
import Messages      from "../../components/screens/messages";
import ProfileUI     from "../../components/screens/profile";
import BottomNav, { TabName } from "../../components/ui/BottomNav";
import { Colors as C, FontSize, Radius, Shadow } from "../../constants/tokens";
import { API_BASE_URL } from "../../constants/api";

// ExtendedTabName covers every screen including teacher-livecc which lives
// outside BottomNav but is a valid active state.
export type ExtendedTabName = TabName | "teacher-livecc";

export default function TabsLayout() {
  const { user, token } = useAuth();
  const isTeacher = user?.status === "TEACHER";

  const [active, setActive]   = useState<ExtendedTabName>("home");
  const [unread, setUnread]   = useState(1);

  // Track whether a teacher session is live so we can show the return button
  const [sessionActive, setSessionActive] = useState(false);

  // Poll session status every 5 s so the return button appears/disappears correctly
  useEffect(() => {
    if (!isTeacher || !token) return;

    const check = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/sessions/teacher`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessionActive(res.data.active);
      } catch {
        // silent — just don't show the button if we can't confirm
      }
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [isTeacher, token]);

  const handleSendToTeacher = (msg: string) => {
    console.log("Student sent:", msg);
  };

  // ── Screen renderer ──────────────────────────────────────────────────────
  const renderScreen = () => {
    if (isTeacher) {
      switch (active) {
        case "home":
          return <TeacherHome setActive={setActive} />;
        case "teacher-livecc":
          return <TeacherLiveCC setActive={setActive} />;
        case "messages":
          return <Messages />;
        case "profile":
          return <ProfileUI />;
        default:
          return <TeacherHome setActive={setActive} />;
      }
    }

    switch (active) {
      case "home":
        return <Home setActive={setActive} teacherReply={null} />;
      case "board":
        return <AACBoard onSendToTeacher={handleSendToTeacher} />;
      case "messages":
        return <Messages />;
      case "livecc":
        return <LiveCC />;
      case "profile":
        return <ProfileUI />;
      default:
        return null;
    }
  };

  // Show the floating "Return to Room" pill whenever:
  //  - user is a teacher
  //  - a session is currently active in the DB
  //  - they are NOT already on the teacher-livecc screen
  const showReturnPill = isTeacher && sessionActive && active !== "teacher-livecc";

  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>

      {/* ── Floating "Return to Room" pill ───────────────────────────────── */}
      {showReturnPill && (
        <TouchableOpacity
          style={styles.returnPill}
          onPress={() => setActive("teacher-livecc")}
          activeOpacity={0.88}
        >
          <Text style={styles.returnPillDot}>🟢</Text>
          <Text style={styles.returnPillText}>Return to Live Room</Text>
          <Text style={styles.returnPillArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* ── Bottom nav ───────────────────────────────────────────────────── */}
      {/* Pass active tab — if teacher is in teacher-livecc, highlight "home"
          so the nav doesn't show a blank selection. */}
      <BottomNav
        active={(active === "teacher-livecc" ? "home" : active) as TabName}
        setActive={(tab) => {
          setActive(tab);
          if (tab === "messages") setUnread(0);
        }}
        unread={unread}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  screen:    { flex: 1 },

  // Floating pill — sits just above the bottom nav
  returnPill: {
    position:        "absolute",
    bottom:          72,           // just above the BottomNav (~56 px tall + 16 margin)
    alignSelf:       "center",
    flexDirection:   "row",
    alignItems:      "center",
    gap:             8,
    backgroundColor: "#047857",
    paddingHorizontal: 20,
    paddingVertical:   12,
    borderRadius:    Radius.full,
    ...Shadow.md,
    // subtle border so it pops on light backgrounds too
    borderWidth:  1,
    borderColor:  "rgba(255,255,255,0.15)",
  },
  returnPillDot:   { fontSize: 14 },
  returnPillText:  { fontSize: FontSize.sm, color: "#FFFFFF", fontWeight: "700" },
  returnPillArrow: { fontSize: 18, color: "#FFFFFF", fontWeight: "300" },
});