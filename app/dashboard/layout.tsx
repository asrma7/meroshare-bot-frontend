'use client';
import Loading from "@/components/ui/loading";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useAuth } from "@/contexts/authContext";
import { usePathname, useRouter } from "next/navigation";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useUserApi } from "@/api/auth";

const routeMap: Record<string, string> = {
    dashboard: "Dashboard",
    users: "Accounts",
    shares: "Shares"
};

interface BreadcrumbItem {
    href: string | undefined;
    label: string;
    isLast: boolean;
}

interface LayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: FunctionComponent<LayoutProps> = ({ children }) => {
    const { token } = useAuth();
    const { getProfile } = useUserApi();
    const [mounted, setMounted] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname();

    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const segments = pathname?.replace(/^\//, "").split("/") || [];
        const breadcrumbs: BreadcrumbItem[] = [];

        let currentPath = "";

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;
            const label =
                routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            breadcrumbs.push({
                href: isLast ? undefined : currentPath,
                label,
                isLast,
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
                setUserName(name);
            } catch (e) {
                // fallback or logout if needed
                setUserName("");
            }
        };
        if (!token) {
            router.push("/");
            return;
        }
        fetchProfile().then(() => setMounted(true));
    }, [token, router, getProfile]);


    if (!mounted) {
        return <Loading />;
    }

    return (
        <SidebarProvider>
            <AppSidebar name={userName} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <BreadcrumbSeparator />}
                                        <BreadcrumbItem>
                                            {crumb.isLast ? (
                                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={crumb.href || "#"}>
                                                    {crumb.label}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

export default DashboardLayout;