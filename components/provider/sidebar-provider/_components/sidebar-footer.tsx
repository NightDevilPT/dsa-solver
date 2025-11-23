"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Settings, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/shared/user-avatar";
import { UserMenu, getDisplayName } from "@/components/shared/user-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/components/context/theme-context";
import { useUserSession } from "@/components/context/user-session-context";

export const SidebarFooter = React.memo(function SidebarFooter() {
	const { state } = useSidebar();
	const { locale } = useThemeContext();
	const { user, isLoading } = useUserSession();
	const router = useRouter();
	const isCollapsed = state === "collapsed";

	// Generate display name using the shared helper function
	const displayName = React.useMemo(() => {
		if (!user) return null;
		return getDisplayName(user, "username-first");
	}, [user]);

	const buildPath = React.useCallback(
		(path: string) => {
			return `/${locale}${path}`;
		},
		[locale]
	);

	const handleNavigation = React.useCallback(
		(path: string) => {
			router.push(buildPath(path));
		},
		[router, buildPath]
	);

	// Show loading state or empty state if no user
	// IMPORTANT: All hooks must be called before any conditional returns
	if (isLoading || !user) {
		return (
			<div
				className={cn(
					"flex items-center w-full transition-all duration-300 ease-in-out rounded-lg",
					isCollapsed
						? "justify-center px-2 py-2"
						: "justify-start gap-3 px-3 py-2"
				)}
			>
				<div
					className={cn(
						"flex items-center justify-center rounded-full bg-muted animate-pulse",
						isCollapsed ? "h-8 w-8" : "h-10 w-10"
					)}
				/>
				{!isCollapsed && (
					<div className="flex flex-col gap-1 flex-1">
						<div className="h-4 w-24 bg-muted rounded animate-pulse" />
						<div className="h-3 w-32 bg-muted rounded animate-pulse" />
					</div>
				)}
			</div>
		);
	}

	// Custom trigger for sidebar
	const sidebarTrigger = (
		<button
			type="button"
			className={cn(
				"flex items-center w-full transition-all duration-300 ease-in-out rounded-lg hover:bg-sidebar-accent focus:bg-sidebar-accent focus:outline-none",
				isCollapsed
					? "justify-center px-2 py-2"
					: "justify-start gap-3 px-3 py-2"
			)}
		>
			<UserAvatar
				name={displayName}
				email={user.email}
				avatar={user.avatar}
				size={isCollapsed ? "sm" : "default"}
			/>

			{!isCollapsed && (
				<div className="flex w-full overflow-hidden items-center justify-between min-w-0 flex-1">
					<div className="flex flex-col items-start justify-start gap-0.5 min-w-0 flex-1 overflow-hidden text-left">
						<Label className="w-full text-sm font-semibold text-sidebar-foreground truncate">
							{displayName}
						</Label>
						<Label className="w-full text-xs text-sidebar-foreground/70 truncate">
							{user.email}
						</Label>
					</div>
				</div>
			)}
		</button>
	);

	// Custom menu items for sidebar (Profile instead of Dashboard)
	const customMenuItems = (
		<>
			<DropdownMenuItem
				onClick={() => handleNavigation("/profile")}
				className="cursor-pointer"
			>
				<User className="h-4 w-4" />
				<Label>Profile</Label>
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => handleNavigation("/setting")}
				className="cursor-pointer"
			>
				<Settings className="h-4 w-4" />
				<Label>Settings</Label>
			</DropdownMenuItem>
		</>
	);

	return (
		<UserMenu
			trigger={sidebarTrigger}
			displayNameStrategy="username-first"
			showLogout={false}
			customMenuItems={customMenuItems}
			align="end"
			side="right"
			sideOffset={8}
			className="w-64"
		/>
	);
});

SidebarFooter.displayName = "SidebarFooter";
