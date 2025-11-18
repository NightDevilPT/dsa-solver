import {
	Sidebar,
	SidebarContent,
	SidebarFooter as UISidebarFooter,
	SidebarHeader as UISidebarHeader,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
} from "@/components/ui/sidebar";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarFooter } from "./_components/sidebar-footer";
import { SidebarHeader } from "./_components/sidebar-header";
import { type NavItem } from "./_components/sidebar-navitem";
import { Home, BookOpen, Settings, User } from "lucide-react";

// Example navigation items - replace with your actual navigation data
const navItems: NavItem[] = [
	{
		label: "Home",
		href: "/",
		icon: Home,
		description: "Go to home page",
	},
	{
		label: "Problems",
		href: "/problems",
		icon: BookOpen,
		description: "Browse DSA problems",
		children: [
			{
				label: "Arrays",
				href: "/problems/arrays",
				description: "Array problems",
			},
			{
				label: "Strings",
				href: "/problems/strings",
				description: "String problems",
			},
			{
				label: "Linked Lists",
				href: "/problems/linked-lists",
				description: "Linked list problems",
			},
		],
	},
	{
		label: "Settings",
		href: "/setting",
		icon: Settings,
		description: "Application settings",
		group: "account",
	},
	{
		label: "Profile",
		href: "/profile",
		icon: User,
		description: "User profile",
		group: "account",
	},
];

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<UISidebarHeader>
					<SidebarHeader />
				</UISidebarHeader>
				<Separator />
				<SidebarContent className="gap-0 py-3 px-2">
					Content
				</SidebarContent>
				<Separator />
				<UISidebarFooter>
					<SidebarFooter />
				</UISidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset className="w-full h-screen">
				<main className="w-full grid grid-rows-[60px_1fr]">
					<header>Header</header>
					<ScrollArea className="w-full h-[calc(100vh-60px)] overflow-auto">
						{children}
					</ScrollArea>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default SidebarLayout;
