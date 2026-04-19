<<<<<<< HEAD
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
=======
import React, { createContext, useContext, useState } from 'react';

export type User = {
  displayName: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null; // <-- ADD THIS
  login: (userData: User, token: string) => void; // <-- UPDATE THIS
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // <-- ADD THIS

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    // Pro-Tip: Later, you will want to save this token using 'expo-secure-store' 
    // so the user stays logged in even if they close the app!
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
>>>>>>> 612435e76d1422de87727ebe5bc5fdfad541e5fb
      {children}
    </AuthContext.Provider>
  );
};

<<<<<<< HEAD
export const useAuth = () => useContext(AuthContext);
=======
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
>>>>>>> 612435e76d1422de87727ebe5bc5fdfad541e5fb
