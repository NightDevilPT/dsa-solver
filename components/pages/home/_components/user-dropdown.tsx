"use client";

import React from "react";
import { UserMenu } from "@/components/shared/user-menu";
import { useUserSession } from "@/components/context/user-session-context";

export const UserDropdown = React.memo(function UserDropdown() {
	const { user, isLoading } = useUserSession();

	// Show loading state
	if (isLoading || !user) {
		return (
			<div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
		);
	}

	return <UserMenu showLogout={true} displayNameStrategy="username-first" />;
});

UserDropdown.displayName = "UserDropdown";
