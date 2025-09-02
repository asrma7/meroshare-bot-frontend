"use client";

import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useShareApi } from "@/api/share";
import Loading from "@/components/ui/loading";
import { Share } from "@/types/share";
import { toast } from "sonner";

interface SharesResponse {
    status: string;
    applied_shares: Share[];
}

export default function SharesPage() {
    const [shares, setShares] = useState<Share[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const { getShares } = useShareApi();

    useEffect(() => {
        setIsMounted(true);

        const fetchShares = async () => {
            try {
                const response: SharesResponse = await getShares();
                setShares(response.applied_shares);
            } catch (error) {
                console.error("Failed to fetch Shares:", error);
                toast.error("Failed to load shares data");
            } finally {
                setLoading(false);
            }
        };

        fetchShares();
    }, [getShares]);

    if (!isMounted) return null;

    if (loading) return
    <Loading />;

    const columns = getColumns();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Applied Shares</h1>
            <DataTable columns={columns} data={shares ?? []} />
        </div>
    );
}