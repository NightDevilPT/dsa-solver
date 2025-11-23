"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useUserSession,
	UserSession,
} from "@/components/context/user-session-context";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut } from "lucide-react";
import apiService from "@/lib/api-service/api.service";
import { useThemeContext } from "@/components/context/theme-context";

export interface UserMenuProps {
	/** Custom trigger element. If not provided, uses default button with avatar */
	trigger?: React.ReactNode;
	/** Display name generation strategy */
	displayNameStrategy?: "username-first" | "name-first";
	/** Show logout option */
	showLogout?: boolean;
	/** Custom menu items */
	customMenuItems?: React.ReactNode;
	/** Dropdown alignment */
	align?: "start" | "end" | "center";
	/** Dropdown side */
	side?: "top" | "right" | "bottom" | "left";
	/** Side offset */
	sideOffset?: number;
	/** Additional className for dropdown content */
	className?: string;
}

// Helper function to generate display name
export function getDisplayName(
	user: UserSession,
	strategy: "username-first" | "name-first" = "name-first"
): string {
	if (strategy === "username-first") {
		if (user.username) return user.username;
		if (user.firstName && user.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		if (user.firstName) return user.firstName;
		return user.email;
	} else {
		// name-first strategy
		if (user.firstName && user.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		if (user.firstName) return user.firstName;
		if (user.username) return user.username;
		return user.email;
	}
}

export const UserMenu = React.memo(function UserMenu({
	trigger,
	displayNameStrategy = "name-first",
	showLogout = false,
	customMenuItems,
	align = "end",
	side = "bottom",
	sideOffset = 8,
	className = "w-64",
}: UserMenuProps) {
	const { locale } = useThemeContext();
	const { user, isLoading, logout } = useUserSession();
	const router = useRouter();

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

	const handleLogout = React.useCallback(async () => {
		try {
			const result = await apiService.post("/api/protected/auth/logout");

			if (!result.success) {
				toast.error(result.message || "Failed to logout");
				return;
			}

			// Clear user state in context
			logout();

			toast.success("Logged out successfully");
			router.refresh();
			// Navigate to home page
			handleNavigation("/");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Failed to logout");
		}
	}, [router, handleNavigation, logout]);

	if (isLoading || !user) {
		return null;
	}

	const displayName = getDisplayName(user, displayNameStrategy);

	// Default trigger if not provided
	const defaultTrigger = trigger || (
		<Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
			<UserAvatar
				name={displayName}
				email={user.email}
				avatar={user.avatar}
				size="default"
			/>
			<Label className="sr-only">User menu</Label>
		</Button>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{defaultTrigger}</DropdownMenuTrigger>

			<DropdownMenuContent
				align={align}
				side={side}
				sideOffset={sideOffset}
				className={className}
			>
				{/* User Details Section */}
				<DropdownMenuLabel className="p-0">
					<div className="flex items-center gap-3 px-2 py-3">
						<UserAvatar
							name={displayName}
							email={user.email}
							avatar={user.avatar}
							size="lg"
						/>
						<div className="flex flex-col gap-0.5 min-w-0 flex-1">
							<Label className="text-sm font-semibold text-foreground truncate">
								{displayName}
							</Label>
							<Label className="text-xs text-muted-foreground truncate">
								{user.email}
							</Label>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Navigation Routes */}
				<DropdownMenuGroup>
					{customMenuItems || (
						<>
							<DropdownMenuItem
								onClick={() => handleNavigation("/dashboard")}
								className="cursor-pointer"
							>
								<User className="h-4 w-4" />
								<Label>Dashboard</Label>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleNavigation("/setting")}
								className="cursor-pointer"
							>
								<Settings className="h-4 w-4" />
								<Label>Settings</Label>
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuGroup>

				{showLogout && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							className="cursor-pointer text-destructive focus:text-destructive"
						>
							<LogOut className="h-4 w-4" />
							<Label>Logout</Label>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
});

UserMenu.displayName = "UserMenu";
