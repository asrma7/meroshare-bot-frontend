import { useAuth } from "@/contexts/authContext";
import axiosClient from "./axiosClient";
import { useCallback } from "react";

const API_VERSION = "api/v1";

export const login = async (identifier: string, password: string) => {
  const response = await axiosClient.post(`/${API_VERSION}/login`, {
    identifier,
    password,
  });
  return response.data;
};

export const register = async (
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  password: string
) => {
  const response = await axiosClient.post(`/${API_VERSION}/register`, {
    first_name,
    last_name,
    username,
    email,
    password,
  });
  return response.data;
};

export const useUserApi = () => {
  const { token } = useAuth();
  const getAuthHeaders = useCallback(() => {
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const getProfile = async () => {
    const response = await axiosClient.get(`/${API_VERSION}/profile`, {
      headers: getAuthHeaders(),
    });
    if (response.data.status === "success") {
      return response.data.profile;
    }
    throw new Error(response.data.message || "Failed to fetch profile");
  };

  const getDashboard = useCallback(async () => {
    const response = await axiosClient.get(`/${API_VERSION}/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }, [getAuthHeaders]);

  return {
    getProfile,
    getDashboard,
  };
};
