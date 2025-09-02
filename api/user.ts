import { useCallback } from "react";
import axiosClient from "./axiosClient";
import { useAuth } from "@/contexts/authContext";

const API_VERSION = "api/v1";

export const useUserApi = () => {
    const { token } = useAuth();

    const getAuthHeaders = useCallback(
        () => ({
            Authorization: `Bearer ${token}`,
        }),
        [token]
    );
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

    const resetLogs = useCallback(async () => {
        const response = await axiosClient.post(`/${API_VERSION}/reset-logs`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }, [getAuthHeaders]);

    return {
        getProfile,
        getDashboard,
        resetLogs,
    };
}