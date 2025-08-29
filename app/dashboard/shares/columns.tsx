"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Share } from "@/api/share";

export const getColumns = (): ColumnDef<Share>[] => [
    {
        accessorKey: "ID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const userId: string = row.getValue("ID");
            const displayId = `${userId.substring(0, 8)}...`;

            return (
                <Link href={`/dashboard/shares/${userId}`} className="hover:underline">
                    {displayId}
                </Link>
            );
        },
    },
    {
        accessorKey: "FirstName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    First Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("FirstName");
        },
    },
    {
        accessorKey: "LastName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("LastName");
        },
    },
    {
        accessorKey: "Username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("Username");
        },
    },
    {
        accessorKey: "Email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("Email");
        },
    },
    {
        accessorKey: "LoggedInDevice",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Logged In Device
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("LoggedInDevice");
        },
    },
    {
        accessorKey: "ActiveTicketID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Active Ticket ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const activeTicketId: string = row.getValue("ActiveTicketID");
            return activeTicketId && activeTicketId !== '00000000-0000-0000-0000-000000000000' ? (
                <Link href={`/dashboard/tickets/${activeTicketId}`} className="hover:underline">
                    {`${activeTicketId.substring(0, 8)}...`}
                </Link>
            ) : (
                "None"
            );
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
    },
    {
        accessorKey: "UpdatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Updated At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const updatedAt: string = row.getValue("UpdatedAt");
            return new Date(updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        },
    },
]