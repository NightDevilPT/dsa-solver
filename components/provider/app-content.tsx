"use client";

import React from "react";
import { useTheme } from "next-themes";
import { ScrollArea } from "../ui/scroll-area";
import { usePathname } from "next/navigation";
import { navItems } from "./sidebar-provider/route";
import SidebarLayout from "./sidebar-provider/sidebar";
import { AppLoader } from "@/components/shared/app-loader";

interface AppContentProps {
	children: React.ReactNode;
}

export const AppContent = React.memo(function AppContent({
	children,
}: AppContentProps) {
	const pathname = usePathname();
	const { resolvedTheme } = useTheme();
	const [isMounted, setIsMounted] = React.useState(false);
	const hasInitiallyMounted = React.useRef(false);

	// Wait for client-side mount to avoid hydration issues
	React.useEffect(() => {
		setIsMounted(true);
		if (!hasInitiallyMounted.current) {
			hasInitiallyMounted.current = true;
		}
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

	// Show loading only on the very first mount if theme or component is not ready
	// Don't show loading on subsequent navigations
	const shouldShowLoading =
		!hasInitiallyMounted.current && (!isMounted || !isThemeReady);

	if (shouldShowLoading) {
		return <AppLoader />;
	}

	return shouldUseSidebar ? (
		<SidebarLayout navItems={navItems}>{children}</SidebarLayout>
	) : (
		<ScrollArea className="w-full h-full overflow-auto">
			{children}
		</ScrollArea>
	);
});

AppContent.displayName = "AppContent";
