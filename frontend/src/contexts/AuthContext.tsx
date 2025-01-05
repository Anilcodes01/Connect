import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from "../types/auth";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post<AuthResponse>(
        "http://localhost:6001/api/auth/login",
        credentials
      );

      localStorage.setItem("token", response.data.token!);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during login"
      );
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const response = await axios.post<AuthResponse>(
        "http://localhost:6001/api/auth/signup",
        credentials
      );
      console.log(response);

      navigate("/login");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during signup"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, signup, logout, error }}
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
