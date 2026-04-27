import React, { createContext, useContext, useState } from 'react';
import axios from 'axios'; 

export type User = {
  email?: string;
  username?: string;
  department?: string;
  status?: string;
  disability_type?: string;
  first_name?: string;
  last_name?: string;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // These variables live INSIDE the AuthProvider
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (identifier: string, password: string) => {
    try {
      console.log(`Sending login to FastAPI for: ${identifier}`);
      const response = await axios.post('https://vocalink-fastapi.onrender.com/api/auth/login/', { 
        identifier: identifier, 
        password: password 
      });
      setToken(response.data.access_token || "secure-vip-token");
      setUser({ username: identifier, email: identifier });
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      console.log(`Sending signup to FastAPI for: ${username}`);
      await axios.post('https://vocalink-fastapi.onrender.com/api/auth/register/', {
        username: username,
        email: email,
        password: password,
        status: "STUDENT" 
      });
      await login(email, password);
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  // 💥 The Update function is safely INSIDE the provider now!
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      console.log("Saving changes to database...");
      await axios.put('https://vocalink-fastapi.onrender.com/api/profile/me', profileData, {
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // Fixed the 'any' type error by explicitly stating (prev: User | null)
      setUser((prev: User | null) => prev ? { ...prev, ...profileData } : null);
      
    } catch (error) {
      console.error("Update Error:", error);
      throw error;
    }
  };

  // 💥 The Delete function is safely INSIDE the provider now!
  const deleteAccount = async () => {
    try {
      await axios.delete('https://vocalink-fastapi.onrender.com/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Delete Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
  };

  return (
    // 💥 Every single function is properly handed over to the app here!
    <AuthContext.Provider value={{ user, token, login, signup, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};