"use client";

import type {
	ColorScheme,
	SidebarSide,
	SidebarState,
	SidebarVariant,
	ThemeMode,
} from "@/interface/theme.interface";
import React from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/dictionaries";
import { navItems } from "./sidebar-provider/route";
import SidebarLayout from "./sidebar-provider/sidebar";
import { ThemeProvider } from "./theme-provider/theme-provider";
import { ScrollArea } from "../ui/scroll-area";
import { UserSessionProvider } from "./user-session-provider/user-session-provider";

type RootProviderProps = {
	children: React.ReactNode;
	defaultThemeMode?: ThemeMode;
	defaultColorScheme?: ColorScheme;
	defaultLocale: Locale;
	defaultSidebarState?: SidebarState;
	defaultSidebarVariant?: SidebarVariant;
	defaultSidebarSide?: SidebarSide;
};

const RootProvider = ({
	children,
	defaultThemeMode,
	defaultColorScheme,
	defaultLocale,
	defaultSidebarState,
	defaultSidebarVariant,
	defaultSidebarSide,
}: RootProviderProps) => {
	const pathname = usePathname();
	
	// Check if current route is home page (e.g., /en or /en/)
	const isHomePage = React.useMemo(() => {
		if (!pathname) return false;
		const pathSegments = pathname.split("/").filter(Boolean);
		// Home page is just the locale (e.g., /en) - only one segment after splitting
		return pathSegments.length === 1;
	}, [pathname]);

	return (
		<ThemeProvider
			defaultThemeMode={defaultThemeMode}
			defaultColorScheme={defaultColorScheme}
			defaultLocale={defaultLocale}
			defaultSidebarState={defaultSidebarState}
			defaultSidebarVariant={defaultSidebarVariant}
			defaultSidebarSide={defaultSidebarSide}
		>
			<UserSessionProvider>
				{isHomePage ? (
					<ScrollArea className="w-full h-full overflow-auto">{children}</ScrollArea>
				) : (
					<SidebarLayout navItems={navItems}>{children}</SidebarLayout>
				)}
			</UserSessionProvider>
		</ThemeProvider>
	);
};

export default RootProvider;
