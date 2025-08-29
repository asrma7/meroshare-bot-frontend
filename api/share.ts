import { useCallback } from "react";
import axiosClient from "./axiosClient";
import { useAuth } from "@/contexts/authContext";

export interface Share {
    ID: string;
    FirstName: string;
    LastName: string;
    Email: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export const useShareApi = () => {
    const { token } = useAuth();

    const getAuthHeaders = useCallback(
        () => ({
            Authorization: `Bearer ${token}`,
        }),
        [token]
    );

    const getShares = async () => {
        const response = await axiosClient.get("/shares", {
            headers: getAuthHeaders(),
        });
        return response.data;
    };

    return {
        getShares,
    };
}