"use client";

import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Codesandbox } from "lucide-react";
import { cn } from "@/lib/utils";

export const SidebarHeader = React.memo(function SidebarHeader() {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<div
			className={cn(
				"flex items-center transition-all duration-300 ease-in-out",
				isCollapsed
					? "justify-center px-3 py-2"
					: "justify-start gap-4 px-4 py-2"
			)}
		>
			{/* Logo Container with Background */}
			<div
				className={cn(
					"flex items-center justify-center shrink-0 rounded-lg transition-all duration-300 ease-in-out",
					"bg-sidebar-primary/10 text-sidebar-primary",
					"border border-sidebar-border/50",
					"shadow-sm",
					isCollapsed
						? "w-8 h-8"
						: "w-12 h-12 shadow-md hover:shadow-lg"
				)}
			>
				<Codesandbox
					className={cn(
						"transition-all duration-300 ease-in-out",
						isCollapsed ? "h-5 w-5" : "h-6 w-6"
					)}
					strokeWidth={2}
				/>
			</div>

			{/* Title and Description - Only show when expanded */}
			{!isCollapsed && (
				<div className="flex flex-col gap-1 min-w-0 flex-1 overflow-hidden">
					<Label className="text-base font-bold text-sidebar-foreground truncate leading-tight tracking-tight">
						DSA Solver
					</Label>
					<Label className="text-xs font-medium text-sidebar-foreground/60 truncate leading-relaxed">
						Data Structures & Algorithms
					</Label>
				</div>
			)}
		</div>
	);
});

SidebarHeader.displayName = "SidebarHeader";
