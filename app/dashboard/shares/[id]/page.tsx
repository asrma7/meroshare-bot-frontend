"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useShareApi } from "@/api/share";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Share, ShareError } from "@/types/share";
import Link from "next/link";


export default function ShareDetailPage() {
    const { getShareById } = useShareApi();
    const { id } = useParams();
    const [share, setShare] = React.useState<Share | null>(null);
    const [shareError, setShareError] = React.useState<ShareError | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();
    React.useEffect(() => {
        const fetchShare = async () => {
            try {
                const response = await getShareById(id!.toString());
                if (response.status !== "success") {
                    setError("Failed to load share.");
                } else {
                    setShare(response.applied_share);
                    setShareError(response.applied_share_error);
                }
            } catch (error) {
                setError("Failed to load share.");
            }
        };
        fetchShare();
    }, [id, getShareById]);

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!share) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl min-w-lg mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-2xl">{share.CompanyName}</CardTitle>
                        <div className="text-muted-foreground text-sm">{share.Scrip}</div>
                    </div>
                </CardHeader>
                <Separator className="my-2" />
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <Detail label="Share ID" value={share.CompanyShareID} />
                        <Link href={`/dashboard/accounts/${share.AccountID}`}>
                            <Detail label="Account ID" value={share.AccountID.substring(0, 8) + "..."} />
                        </Link>
                        <Detail label="Applied Kitta" value={share.AppliedKitta} />
                        <Detail label="Share Group Name" value={share.ShareGroupName} />
                        <Detail label="Share Type Name" value={share.ShareTypeName} />
                        <Detail label="Sub Group" value={share.SubGroup} />
                        <Detail label="Status" value={share.Status} />
                        <Detail label="Applied On" value={formatDate(share.CreatedAt)} />
                    </div>
                </CardContent>
                {shareError && (
                    <CardFooter>
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{shareError.Message}</AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
            </Card>
        </div >
    );
}

function Detail({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">{label}</Label>
            <span className="font-medium text-base break-all">{value ?? <span className="text-muted-foreground">-</span>}</span>
        </div>
    );
}
