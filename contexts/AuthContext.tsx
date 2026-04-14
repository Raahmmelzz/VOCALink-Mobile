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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};