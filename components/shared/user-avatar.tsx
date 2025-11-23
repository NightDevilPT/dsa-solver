"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
	name: string | null;
	email: string;
	avatar?: string | null;
	size?: "default" | "sm" | "lg";
}

export const UserAvatar = React.memo(function UserAvatar({
	name,
	email,
	avatar,
	size = "default",
}: UserAvatarProps) {
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

UserAvatar.displayName = "UserAvatar";

