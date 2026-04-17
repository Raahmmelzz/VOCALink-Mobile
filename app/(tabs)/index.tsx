import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AACBoard from "../../components/screens/board";
import Home from "../../components/screens/home";
import LiveCC from "../../components/screens/livecc";
import Messages from "../../components/screens/messages";
import BottomNav, { TabName } from "../../components/ui/BottomNav";
import { Colors as C } from "../../constants/tokens";

const TabsLayout: React.FC = () => {
  const [active, setActive] = useState<TabName>("home");
  const [teacherReply] = useState<string | null>("OK — I'll get some.");
  const [unread, setUnread] = useState(1);

  const handleSendToTeacher = (msg: string) => {
    console.log("Student sent:", msg);
  };

  const renderScreen = () => {
    switch (active) {
      case "home":
        return <Home setActive={setActive} teacherReply={teacherReply} />;
      case "board":
        return <AACBoard onSendToTeacher={handleSendToTeacher} />;
      case "messages":
        return <Messages />;
      case "livecc":
        return <LiveCC />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>
      <BottomNav
        active={active}
        setActive={(tab) => {
          setActive(tab);
          if (tab === "messages") setUnread(0);
        }}
        unread={unread}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  screen: { flex: 1 },
});

export default TabsLayout;
