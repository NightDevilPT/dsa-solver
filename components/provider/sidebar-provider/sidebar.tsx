import {
	Sidebar,
	SidebarContent,
	SidebarFooter as UISidebarFooter,
	SidebarHeader as UISidebarHeader,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarFooter } from "./_components/sidebar-footer";
import { SidebarHeader } from "./_components/sidebar-header";
import { type NavItem } from "@/interface/navigation.interface";
import { SidebarNavigation } from "./_components/sidebar-navigation";

interface SidebarLayoutProps {
	children: React.ReactNode;
	navItems?: NavItem[];
}

const SidebarLayout = ({ children, navItems = [] }: SidebarLayoutProps) => {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<UISidebarHeader>
					<SidebarHeader />
				</UISidebarHeader>
				<Separator />
				<SidebarContent>
					{navItems.length > 0 && (
						<SidebarNavigation items={navItems} />
					)}
				</SidebarContent>
				<Separator />
				<UISidebarFooter>
					<SidebarFooter />
				</UISidebarFooter>
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
