import { useCallback } from "react";
import axiosClient from "./axiosClient";
import { useAuth } from "@/contexts/authContext";

const API_VERSION = "api/v1";

export const useShareApi = () => {
    const { token } = useAuth();

    const getAuthHeaders = useCallback(
        () => ({
            Authorization: `Bearer ${token}`,
        }),
        [token]
    );

    const getShares = useCallback(
        async () => {
            const response = await axiosClient.get(`/${API_VERSION}/shares/applied`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    const getShareErrors = useCallback(
        async () => {
            const response = await axiosClient.get(`/${API_VERSION}/shares/errors`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    const getShareById = useCallback(
        async (id: string) => {
            const response = await axiosClient.get(`/${API_VERSION}/shares/${id}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    const markAllRead = useCallback(async () => {
        const response = await axiosClient.post(`/${API_VERSION}/shares/errors/mark-seen`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }, [getAuthHeaders]);

    return {
        getShares,
        getShareErrors,
        getShareById,
        markAllRead,
    };
}