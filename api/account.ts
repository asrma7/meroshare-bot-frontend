import { useCallback } from "react";
import axiosClient from "./axiosClient";
import { useAuth } from "@/contexts/authContext";
import { AccountFormValues } from "@/types/account";

const API_VERSION = "api/v1";

export const useAccountApi = () => {
    const { token } = useAuth();

    const getAuthHeaders = useCallback(
        () => ({
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        [token]
    );

    const getAccountById = useCallback(
        async (id: string) => {
            const response = await axiosClient.get(`/${API_VERSION}/accounts/${id}`, {
                ...getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    const getAccounts = useCallback(
        async () => {
            const response = await axiosClient.get(`/${API_VERSION}/accounts`, {
                ...getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    const createAccount = useCallback(

        async (data: AccountFormValues) => {
            const payload = {
                ...data,
                bank_id: data.bank_id ? String(data.bank_id) : null,
            };
            const response = await axiosClient.post(`/${API_VERSION}/accounts`, payload, {
                ...getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    const updateAccount = useCallback(
        async (id: string, data: AccountFormValues) => {
            const payload = {
                ...data,
                bank_id: data.bank_id ? String(data.bank_id) : null,
            };
            const response = await axiosClient.put(`/${API_VERSION}/accounts/${id}`, payload, {
                ...getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    const deleteAccount = useCallback(
        async (id: string) => {
            const response = await axiosClient.delete(`/${API_VERSION}/accounts/${id}`, {
                ...getAuthHeaders(),
            });
            return response.data;
        },
        [getAuthHeaders]
    );

    return {
        getAccountById,
        getAccounts,
        createAccount,
        updateAccount,
        deleteAccount
    };
}