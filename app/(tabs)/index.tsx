import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

// Make sure these paths match your folder structure!
import AACBoard from "../../components/screens/board";
import Home from "../../components/screens/home";
import TeacherHome from "../../components/screens/teacher-home";
import TeacherLiveCC from "../../components/screens/teacher-livecc";
import LiveCC from "../../components/screens/livecc";
import Messages from "../../components/screens/messages";
import ProfileUI from "../../components/screens/profile";
import BottomNav, { TabName } from "../../components/ui/BottomNav";
import { Colors as C } from "../../constants/tokens";

export type ExtendedTabName = TabName | "teacher-livecc";

export default function TabsLayout() {
  const { user } = useAuth();
  const isTeacher = user?.status === "TEACHER";

  const [active, setActive] = useState<ExtendedTabName>("home");
  const [teacherReply] = useState<string | null>("OK — I'll get some.");
  const [unread, setUnread] = useState(1);

  const handleSendToTeacher = (msg: string) => {
    console.log("Student sent:", msg);
  };

  const renderScreen = () => {
    // 👩‍🏫 TEACHER ROUTES
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

    // 🎓 STUDENT ROUTES
    switch (active) {
      case "home":
        return <Home setActive={setActive} teacherReply={teacherReply} />;
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

  return (
    <View style={styles.container}>
      {/* This renders whichever screen is currently active */}
      <View style={styles.screen}>{renderScreen()}</View>
      
      {/* This renders your bottom navigation bar */}
      <BottomNav
        active={active as TabName} 
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
  screen: { flex: 1 },
});