"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShareError } from "@/types/share";

export const getColumns = (): ColumnDef<ShareError>[] => [
    {
        accessorKey: "ID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const errorId: string = row.getValue("ID");
            const displayId = `${errorId.substring(0, 8)}...`;

            return (
                <span>{displayId}</span>
            );
        },
    },
    {
        accessorKey: "AccountID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Account ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const accountId: string = row.getValue("AccountID");
            const displayId = `${accountId.substring(0, 8)}...`;
            return (
                <Link href={`/dashboard/accounts/${accountId}`} className="hover:underline">
                    {displayId}
                </Link>
            );
        },
    },
    {
        accessorKey: "AppliedShareID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Share ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const appliedShareId: string = row.getValue("AppliedShareID");
            const displayId = `${appliedShareId.substring(0, 8)}...`;

            return (
                <Link href={`/dashboard/shares/${appliedShareId}`} className="hover:underline">
                    {displayId}
                </Link>
            );
        },
    },
    {
        accessorKey: "Message",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Message
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const message: string = row.getValue("Message");
            return message;
        },
    },
    {
        accessorKey: "CreatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const createdAt: string = row.getValue("CreatedAt");
            return new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        },
    }
]