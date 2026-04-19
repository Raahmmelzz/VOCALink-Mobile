import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AACBoard from "../../components/screens/board";
import Home from "../../components/screens/home";
import LiveCC from "../../components/screens/livecc";
import Login from "../../components/screens/login";
import Messages from "../../components/screens/messages";
import Signup, { UserStatus } from "../../components/screens/signup";
import BottomNav, { TabName } from "../../components/ui/BottomNav";
import { Colors as C } from "../../constants/tokens";

type AuthScreen = "login" | "signup";

export interface CurrentUser {
  name: string;
  email: string;
  status: UserStatus;
}

const TabsLayout: React.FC = () => {
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [active, setActive] = useState<TabName>("home");
  const [teacherReply] = useState<string | null>("OK — I'll get some.");
  const [unread, setUnread] = useState(1);

  const handleLogin = () => {
    const name = loginEmail ? loginEmail.split("@")[0] : "User";
    setCurrentUser({ name, email: loginEmail, status: "student" });
  };

  const handleSignup = (name: string, status: UserStatus, email: string) => {
    setCurrentUser({ name, email, status });
  };

  const handleSendToTeacher = (msg: string) => {
    console.log("Student sent:", msg);
  };

  if (!currentUser) {
    if (authScreen === "signup") {
      return (
        <Signup
          onSignup={handleSignup}
          onGoLogin={() => setAuthScreen("login")}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onGoSignup={() => setAuthScreen("signup")}
        onEmailChange={setLoginEmail}
      />
    );
  }

  const renderScreen = () => {
    switch (active) {
      case "home":
        return (
          <Home
            setActive={setActive}
            teacherReply={teacherReply}
            currentUser={currentUser}
          />
        );
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
