"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserDashboard } from "@/types/user";

interface FailedApplicationsTableProps {
    failedApplications: UserDashboard["failed_applications"];
    onMarkAllRead: () => void;
}

export function FailedApplicationsTable({
    failedApplications,
    onMarkAllRead,
}: FailedApplicationsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Failed Applications</CardTitle>
                <CardDescription>Unseen or recent errors</CardDescription>
                <CardAction>
                    <Button variant="outline" onClick={onMarkAllRead}>
                        Mark All Read
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                {/* Desktop / Tablet Table */}
                <div className="hidden md:block overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Account</TableHead>
                                <TableHead>Share</TableHead>
                                <TableHead>Error</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {failedApplications?.length ? (
                                failedApplications.map((app) => (
                                    <TableRow key={app.share_id}>
                                        <TableCell>
                                            <Link href={`/dashboard/accounts/${app.account_id}`}>
                                                {app.account_name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/dashboard/shares/${app.share_id}`}>
                                                {app.scrip}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-red-600">
                                            {app.error_message}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(app.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                    >
                                        No failed applications 🎉
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card Layout */}
                <div className="space-y-4 md:hidden">
                    {failedApplications?.length ? (
                        failedApplications.map((app) => (
                            <Card key={app.share_id} className="p-4 shadow-sm">
                                <div className="grid gap-2 text-sm">
                                    {/* Account */}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Account</span>
                                        <Link
                                            href={`/dashboard/accounts/${app.account_id}`}
                                            className="font-medium text-primary"
                                        >
                                            {app.account_name}
                                        </Link>
                                    </div>

                                    {/* Share */}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Share</span>
                                        <Link
                                            href={`/dashboard/shares/${app.share_id}`}
                                            className="font-medium"
                                        >
                                            {app.scrip}
                                        </Link>
                                    </div>

                                    {/* Error */}
                                    <div>
                                        <span className="text-muted-foreground">Error</span>
                                        <div>
                                            {app.error_message}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="text-xs text-muted-foreground text-right mt-2">
                                        {new Date(app.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground">
                            No failed applications 🎉
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
