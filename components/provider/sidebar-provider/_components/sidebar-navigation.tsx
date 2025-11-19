"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/components/ui/sidebar";
import React from "react";
import { SidebarNavItem } from "./sidebar-navitem";
import { type NavItem } from "@/interface/navigation.interface";

interface SidebarNavigationProps {
	items: NavItem[];
}

export const SidebarNavigation = React.memo(function SidebarNavigation({
	items,
}: SidebarNavigationProps) {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu className="gap-1">
					{items.map((item, index) => (
						<SidebarNavItem key={index} item={item} />
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
});

SidebarNavigation.displayName = "SidebarNavigation";
