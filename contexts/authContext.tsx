"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";

import * as authApi from "@/api/auth";
import { useAxiosAuthInterceptor } from "@/api/authInterceptor";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthTokens: (accessToken: string, refreshToken: string) => void;
  register: (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null
  );

  const latestAccessTokenRef = useRef<string | null>(token);
  useEffect(() => {
    latestAccessTokenRef.current = token;
  }, [token]);

  const handleLogin = async (identifier: string, password: string) => {
    const data = await authApi.login(identifier, password);
    if (data.status === "success") {
      setAuthTokens(data.access_token, data.refresh_token);
    } else {
      throw Error(data.error || "Login failed");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
  };

  const setAuthTokens = (access: string, refresh: string) => {
    setToken(access);
    setRefreshToken(refresh);
    latestAccessTokenRef.current = access;
    localStorage.setItem("token", access);
    localStorage.setItem("refresh_token", refresh);
  };

  const handleRegister = async (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
  ) => {
    const data = await authApi.register(
      first_name,
      last_name,
      username,
      email,
      password
    );
    if (data.status === "success") {
      setAuthTokens(data.access_token, data.refresh_token);
    } else {
      throw Error(data.error || "Registration failed");
    }
  };

  useAxiosAuthInterceptor({
    token,
    refreshToken,
    setAuthTokens,
    latestAccessTokenRef,
    logout: handleLogout,
  });

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        login: handleLogin,
        logout: handleLogout,
        setAuthTokens,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
