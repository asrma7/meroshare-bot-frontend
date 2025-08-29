import { useCallback } from "react";
import axiosClient from "./axiosClient";
import { useAuth } from "@/contexts/authContext";
import { CreateAccountFormValues } from "@/types/account";

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

        async (data: CreateAccountFormValues) => {
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

    return {
        getAccounts,
        createAccount,
    };
}