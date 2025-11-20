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

// Mock user data - replace with actual user context/auth
const MOCK_USER = {
	name: "John Doe",
	email: "john.doe@example.com",
	avatar: null, // You can add avatar URL here
};

// Avatar component
const Avatar = React.memo(function Avatar({
	name,
	email,
	size = "default",
}: {
	name: string;
	email: string;
	size?: "default" | "sm" | "lg";
}) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

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
	const router = useRouter();
	const isCollapsed = state === "collapsed";

	const user = MOCK_USER;

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
						name={user.name}
						email={user.email}
						size={isCollapsed ? "sm" : "default"}
					/>

					{!isCollapsed && (
						<div className="flex items-center justify-between min-w-0 flex-1">
							<div className="flex flex-col items-start gap-0.5 min-w-0 flex-1 overflow-hidden">
								<span className="text-sm font-semibold text-sidebar-foreground truncate">
									{user.name}
								</span>
								<span className="text-xs text-sidebar-foreground/70 truncate">
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
						<Avatar name={user.name} email={user.email} size="lg" />
						<div className="flex flex-col gap-0.5 min-w-0 flex-1">
							<span className="text-sm font-semibold text-foreground truncate">
								{user.name}
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
