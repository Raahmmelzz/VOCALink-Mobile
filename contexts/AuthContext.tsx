import React, { createContext, useContext, useState } from "react";
import type { UserStatus } from "../components/screens/signup";

interface UserProfile {
  name: string;
  email: string;
  status: UserStatus;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string) => void;
  signup: (name: string, status: UserStatus, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string) => {
    const name = email.split("@")[0];
    setUser({ name, email, status: "student" });
  };

  const signup = (name: string, status: UserStatus, email: string) => {
    setUser({ name, email, status });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
