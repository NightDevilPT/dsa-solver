import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
	return (
			<SidebarProvider>
				<Sidebar collapsible="icon">
					<SidebarHeader>Headers</SidebarHeader>
					<Separator />
					<SidebarContent>Content</SidebarContent>
					<Separator />
					<SidebarFooter>Footer</SidebarFooter>
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
