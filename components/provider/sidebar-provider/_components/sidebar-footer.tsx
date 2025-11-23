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
import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Settings, User } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useThemeContext } from "@/components/context/theme-context";
import { useUserSession } from "@/components/context/user-session-context";

// Avatar component
const Avatar = React.memo(function Avatar({
	name,
	email,
	avatar,
	size = "default",
}: {
	name: string | null;
	email: string;
	avatar?: string | null;
	size?: "default" | "sm" | "lg";
}) {
	// Use avatar image if available
	if (avatar) {
		return (
			<img
				src={avatar}
				alt={name || email}
				className={cn(
					"rounded-full shrink-0 object-cover",
					size === "sm" && "h-8 w-8",
					size === "default" && "h-10 w-10",
					size === "lg" && "h-12 w-12"
				)}
			/>
		);
	}

	// Generate initials from name or email's first letter
	let initials: string;
	if (name) {
		initials = name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	} else {
		// Use email's first letter if no name available
		initials = email.charAt(0).toUpperCase();
	}

	const sizeClasses = {
		sm: "h-8 w-8 text-xs",
		default: "h-10 w-10 text-sm",
		lg: "h-12 w-12 text-base",
	};

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shrink-0",
				sizeClasses[size]
			)}
		>
			{initials}
		</div>
	);
});

Avatar.displayName = "Avatar";

export const SidebarFooter = React.memo(function SidebarFooter() {
	const { state } = useSidebar();
	const { locale } = useThemeContext();
	const { user, isLoading } = useUserSession();
	const router = useRouter();
	const isCollapsed = state === "collapsed";

	// Generate display name from user data
	const displayName = React.useMemo(() => {
		if (!user) return null;
		if (user.firstName && user.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		if (user.firstName) return user.firstName;
		if (user.username) return user.username;
		return user.email;
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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex items-center w-full transition-all duration-300 ease-in-out rounded-lg hover:bg-sidebar-accent focus:bg-sidebar-accent focus:outline-none",
						isCollapsed
							? "justify-center px-2 py-2"
							: "justify-start gap-3 px-3 py-2"
					)}
				>
					<Avatar
						name={displayName}
						email={user.email}
						avatar={user.avatar}
						size={isCollapsed ? "sm" : "default"}
					/>

					{!isCollapsed && (
						<div className="flex w-full overflow-hidden items-center justify-between min-w-0 flex-1">
							<div className="flex flex-col items-start justify-start gap-0.5 min-w-0 flex-1 overflow-hidden text-left">
								<span className="w-full text-sm font-semibold text-sidebar-foreground truncate">
									{displayName}
								</span>
								<span className="w-full text-xs text-sidebar-foreground/70 truncate">
									{user.email}
								</span>
							</div>
						</div>
					)}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				side="right"
				sideOffset={8}
				className="w-64"
			>
				{/* User Details Section */}
				<DropdownMenuLabel className="p-0">
					<div className="flex items-center gap-3 px-2 py-3">
						<Avatar
							name={displayName}
							email={user.email}
							avatar={user.avatar}
							size="lg"
						/>
						<div className="flex flex-col gap-0.5 min-w-0 flex-1">
							<span className="text-sm font-semibold text-foreground truncate">
								{displayName}
							</span>
							<span className="text-xs text-muted-foreground truncate">
								{user.email}
							</span>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Navigation Routes */}
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => handleNavigation("/profile")}
						className="cursor-pointer"
					>
						<User className="h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleNavigation("/setting")}
						className="cursor-pointer"
					>
						<Settings className="h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
});

SidebarFooter.displayName = "SidebarFooter";
