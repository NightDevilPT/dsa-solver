"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { navItems } from "./sidebar-provider/route";
import SidebarLayout from "./sidebar-provider/sidebar";
import { ScrollArea } from "../ui/scroll-area";
import { useUserSession } from "@/components/context/user-session-context";
import { AppLoader } from "@/components/shared/app-loader";

interface AppContentProps {
	children: React.ReactNode;
}

export const AppContent = React.memo(function AppContent({
	children,
}: AppContentProps) {
	const pathname = usePathname();
	const { isLoading: isSessionLoading } = useUserSession();
	const { resolvedTheme } = useTheme();
	const [isMounted, setIsMounted] = React.useState(false);

	// Wait for client-side mount to avoid hydration issues
	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	// Check if current route is home page (e.g., /en or /en/)
	const isHomePage = React.useMemo(() => {
		if (!pathname) return false;
		const pathSegments = pathname.split("/").filter(Boolean);
		// Home page is just the locale (e.g., /en) - only one segment after splitting
		return pathSegments.length === 1;
	}, [pathname]);

	// Check if current route is auth page
	const isAuthPage = React.useMemo(() => {
		if (!pathname) return false;
		return pathname.includes("/auth/");
	}, [pathname]);

	// Pages that should not use SidebarLayout
	const shouldUseSidebar = !isHomePage && !isAuthPage;

	// Check if theme is ready (resolvedTheme is undefined until theme is mounted)
	const isThemeReady = isMounted && resolvedTheme !== undefined;

	// Show loading until:
	// 1. Component is mounted (client-side)
	// 2. Theme is ready (resolvedTheme is available)
	// 3. Session is loaded (for protected pages - skip on auth pages and home page)
	const shouldShowLoading =
		!isMounted ||
		!isThemeReady ||
		(!isAuthPage && !isHomePage && isSessionLoading);

	if (shouldShowLoading) {
		return <AppLoader />;
	}

	return shouldUseSidebar ? (
		<SidebarLayout navItems={navItems}>{children}</SidebarLayout>
	) : (
		<ScrollArea className="w-full h-full overflow-auto">{children}</ScrollArea>
	);
});

AppContent.displayName = "AppContent";

