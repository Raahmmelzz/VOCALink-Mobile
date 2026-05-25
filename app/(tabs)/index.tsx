import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

import AACBoard      from "../../components/screens/board";
import Home          from "../../components/screens/home";
import TeacherHome   from "../../components/screens/teacher-home";
import TeacherLiveCC from "../../components/screens/teacher-livecc";
import LiveCC        from "../../components/screens/livecc";
import ProfileUI     from "../../components/screens/profile";
// Messages removed — students communicate via AAC Board → Session → Live CC
import BottomNav, { TabName } from "../../components/ui/BottomNav";
import { Colors as C, FontSize, Radius, Shadow } from "../../constants/tokens";
import { API_BASE_URL } from "../../constants/api";

export type ExtendedTabName = TabName | "teacher-livecc" | "sessioning";

export default function TabsLayout() {
  const { user, token } = useAuth();
  const isTeacher = user?.status === "TEACHER";

  const [active, setActive]               = useState<ExtendedTabName>("home");
  const [unread, setUnread]               = useState(1);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode, setSessionCode]     = useState<string | null>(null);

  // ── Presence heartbeat every 30s (student only) ──────────────────────────
  useEffect(() => {
    if (!token || isTeacher) return;
    const ping = () => axios.post(`${API_BASE_URL}/presence/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, [token, isTeacher]);

  // ── Poll teacher session status every 5s (return pill visibility) ─────────
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

  // ── Poll session status every 5s (student only) ──────────────────────────
  useEffect(() => {
    if (!token || isTeacher) return;

    const check = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/sessions/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.active) {
          setSessionCode(res.data.session_code);
        } else {
          setSessionCode(null);
        }
      } catch {
        setSessionCode(null);
      }
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [token, isTeacher]);

  const handleSendToTeacher = (msg: string) => {
    console.log("Student sent:", msg);
  };

  // ── Screen renderer ──────────────────────────────────────────────────────
  const renderScreen = () => {
    // ── Teacher screens ──────────────────────────────────────────────
    if (isTeacher) {
      switch (active) {
        case "home":           return <TeacherHome setActive={setActive} />;
        case "teacher-livecc": return <TeacherLiveCC setActive={setActive} />;
        case "profile":        return <ProfileUI />;
        default:               return <TeacherHome setActive={setActive} />;
      }
    }

    // ── Student screens ──────────────────────────────────────────────
    switch (active) {
      case "home":    return <Home setActive={setActive} />;
      case "board":   return <AACBoard onSendToTeacher={handleSendToTeacher} sessionCode={sessionCode} />;
      case "livecc":  return <LiveCC />;
      case "profile": return <ProfileUI />;
      default:        return null;
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
      {/* If teacher is in teacher-livecc, highlight "home" so nav has a selection. */}
      <BottomNav
        active={(active === "teacher-livecc" ? "home" : active) as TabName}
        setActive={(tab) => {
          setActive(tab);
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
    position:          "absolute",
    bottom:            72,
    alignSelf:         "center",
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    backgroundColor:   "#047857",
    paddingHorizontal: 20,
    paddingVertical:   12,
    borderRadius:      Radius.full,
    ...Shadow.md,
    borderWidth:       1,
    borderColor:       "rgba(255,255,255,0.15)",
  },
  returnPillDot:   { fontSize: 14 },
  returnPillText:  { fontSize: FontSize.sm, color: "#FFFFFF", fontWeight: "700" },
  returnPillArrow: { fontSize: 18, color: "#FFFFFF", fontWeight: "300" },
});
