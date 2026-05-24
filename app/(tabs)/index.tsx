import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

import AACBoard      from "../../components/screens/board";
import Home          from "../../components/screens/home";
import TeacherHome   from "../../components/screens/teacher-home";
import TeacherLiveCC from "../../components/screens/teacher-livecc";
import LiveCC        from "../../components/screens/livecc";
import ProfileUI     from "../../components/screens/profile";
// Messages removed — students communicate via AAC Board → Session → Live CC
import BottomNav, { TabName } from "../../components/ui/BottomNav";
import { Colors as C }       from "../../constants/tokens";
import { API_BASE_URL }       from "../../constants/api";

export type ExtendedTabName = TabName | "teacher-livecc" | "sessioning";

export default function TabsLayout() {
  const { user, token } = useAuth();
  const isTeacher = user?.status === "TEACHER";

  const [active, setActive]           = useState<ExtendedTabName>("home");
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  // ── Presence heartbeat every 30s (student only) ──────────────────────────
  useEffect(() => {
    if (!token || isTeacher) return;
    const ping = () => axios.post(`${API_BASE_URL}/presence/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
    ping(); // ping immediately on login
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, [token, isTeacher]);

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

  const renderScreen = () => {
    // ── Teacher screens ──────────────────────────────────────────────
    if (isTeacher) {
      switch (active) {
        case "home":         return <TeacherHome setActive={setActive} />;
        case "teacher-livecc": return <TeacherLiveCC setActive={setActive} />;
        case "profile":      return <ProfileUI />;
        default:             return <TeacherHome setActive={setActive} />;
      }
    }

    // ── Student screens ──────────────────────────────────────────────
    switch (active) {
      case "home":    return <Home setActive={setActive} />;
      case "board":   return <AACBoard onSendToTeacher={handleSendToTeacher} sessionCode={sessionCode} />;
      case "livecc":  return <LiveCC setActive={setActive} />;
      case "profile": return <ProfileUI />;
      default:        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>
      <BottomNav
        active={active as TabName}
        setActive={(tab) => setActive(tab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  screen:    { flex: 1 },
});
