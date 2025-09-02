"use client";

import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useAccountApi } from "@/api/account";
import Loading from "@/components/ui/loading";
import { Account } from "@/types/account";
import { toast } from "sonner";

interface AccountsResponse {
    status: string;
    accounts: Account[];
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const { getAccounts } = useAccountApi();

    useEffect(() => {
        setIsMounted(true);

        const fetchAccounts = async () => {
            try {
                const response: AccountsResponse = await getAccounts();
                setAccounts(response.accounts);
            } catch (error) {
                console.error("Failed to fetch Accounts:", error);
                toast.error("Failed to load accounts data");
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [getAccounts]);

    if (!isMounted) return null;

    if (loading) return
    <Loading />;

    const columns = getColumns();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Accounts</h1>
            <DataTable columns={columns} data={accounts ?? []} />
        </div>
    );
}