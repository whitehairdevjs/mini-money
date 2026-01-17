"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/lib/api";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 토큰과 사용자 정보 불러오기
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", {
        usernameOrEmail,
        password,
      });

      const { token: newToken, username, email } = response.data;
      
      setToken(newToken);
      setUser({ username, email });
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify({ username, email }));
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/register", {
        username,
        email,
        password,
      });

      const { token: newToken, username: newUsername, email: newEmail } = response.data;
      
      setToken(newToken);
      setUser({ username: newUsername, email: newEmail });
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify({ username: newUsername, email: newEmail }));
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete apiClient.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
