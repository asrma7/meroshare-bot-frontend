"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAccountApi } from "@/api/account";
import { Account } from "@/types/account";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function AccountDetailPage() {
    const { getAccountById } = useAccountApi();
    const { id } = useParams();
    const [account, setAccount] = React.useState<Account | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();
    const [deleting, setDeleting] = React.useState(false);

    React.useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await getAccountById(id!.toString());
                if (response.status !== "success") {
                    setError("Failed to load account.");
                } else {
                    setAccount(response.account);
                }
            } catch (error) {
                setError("Failed to load account.");
            }
        };
        fetchAccount();
    }, [id, getAccountById]);

    const handleUpdate = () => {
        // Navigate to update page (assumes /dashboard/accounts/[id]/edit exists)
        router.push(`/dashboard/accounts/${id}/edit`);
    };

    const handleDelete = async () => {
        setDeleting(true);
        // TODO: Implement delete API call here
        alert("Delete functionality not implemented yet.");
        setDeleting(false);
    };

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

    if (!account) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <h1>Loading Account...</h1>
            </div>
        );
    }

    return (
        <div className="max-w-2xl min-w-lg mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                        <AvatarFallback>{account.Name?.slice(0, 2).toUpperCase() || "AC"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-2xl">{account.Name}</CardTitle>
                        <div className="text-muted-foreground text-sm">{account.Email}</div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleUpdate}>Update</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </CardHeader>
                <Separator className="my-2" />
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <Detail label="Username" value={account.Username} />
                        <Detail label="Contact" value={account.Contact} />
                        <Detail label="Client ID" value={account.ClientID} />
                        <Detail label="Bank ID" value={account.BankID} />
                        <Detail label="CRN Number" value={account.CRNNumber} />
                        <Detail label="Account Type ID" value={account.AccountTypeId} />
                        <Detail label="Preferred Kitta" value={account.PreferredKitta} />
                        <Detail label="Demat" value={account.Demat} />
                        <Detail label="BOID" value={account.BOID} />
                        <Detail label="Account Number" value={account.AccountNumber} />
                        <Detail label="Customer ID" value={account.CustomerId} />
                        <Detail label="Account Branch ID" value={account.AccountBranchId} />
                        <Detail label="DMAT Expiry Date" value={formatDate(account.DMATExpiryDate)} />
                        <Detail label="Expired Date" value={formatDate(account.ExpiredDate)} />
                        <Detail label="Password Expiry Date" value={formatDate(account.PasswordExpiryDate)} />
                        <Detail label="Created At" value={formatDate(account.CreatedAt)} />
                        <Detail label="Updated At" value={formatDate(account.UpdatedAt)} />
                        <Detail label="Status" value={account.Status} />
                    </div>
                </CardContent>
            </Card>
        </div>
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
