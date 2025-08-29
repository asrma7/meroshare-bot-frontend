import { CircleDollarSign, Home, User, Plus, Eye, ChevronRight, DollarSign } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/ui/nav-user";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";



// Sidebar items config
const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Accounts",
        icon: User,
        collapsible: true,
        subItems: [
            {
                title: "Add Account",
                url: "/dashboard/accounts/create",
                icon: Plus,
            },
            {
                title: "View Accounts",
                url: "/dashboard/accounts",
                icon: Eye,
            },
        ],
    },
    {
        title: "Shares",
        icon: CircleDollarSign,
        url: "/dashboard/shares",
    },
];

interface AppSidebarProps {
    name: string;
}

export function AppSidebar({ name }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <a href="/dashboard">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <DollarSign />
                                </div>
                                <div className="text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Meroshare Bot</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                if (item.collapsible && item.subItems) {
                                    // Collapsible menu
                                    const isOpen = item.subItems.some(sub => sub.url === window.location.pathname);
                                    return (
                                        <Collapsible key={item.title} defaultOpen={isOpen} className="group/collapsible">
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton asChild isActive={isOpen}>
                                                        <div className="flex items-center w-full cursor-pointer">
                                                            <item.icon />
                                                            <span>{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </div>
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenu>
                                                        {item.subItems.map((sub) => (
                                                            <SidebarMenuItem key={sub.title}>
                                                                <SidebarMenuButton asChild isActive={window.location.pathname === sub.url} size="sm">
                                                                    <a href={sub.url}>
                                                                        <sub.icon className="w-4 h-4" />
                                                                        <span>{sub.title}</span>
                                                                    </a>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        ))}
                                                    </SidebarMenu>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                } else {
                                    // Normal menu
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={item.url === window.location.pathname}>
                                                <a href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                }
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{ name, avatar: "" }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}