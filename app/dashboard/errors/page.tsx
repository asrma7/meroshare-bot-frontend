"use client";

import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useShareApi } from "@/api/share";
import Loading from "@/components/ui/loading";
import { ShareError } from "@/types/share";

interface SharesResponse {
    status: string;
    applied_share_errors: ShareError[];
}

export default function ShareErrorsPage() {
    const [errors, setErrors] = useState<ShareError[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const { getShareErrors } = useShareApi();

    useEffect(() => {
        setIsMounted(true);

        const fetchShareErrors = async () => {
            try {
                const response: SharesResponse = await getShareErrors();
                setErrors(response.applied_share_errors);
            } catch (error) {
                console.error("Failed to fetch Shares:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShareErrors();
    }, [getShareErrors]);

    if (!isMounted) return null;

    if (loading) return <Loading />;

    const columns = getColumns();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Share Apply Errors</h1>
            <DataTable columns={columns} data={errors ?? []} />
        </div>
    );
}