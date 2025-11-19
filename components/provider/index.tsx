"use client";

import type {
	ColorScheme,
	SidebarSide,
	SidebarState,
	SidebarVariant,
	ThemeMode,
} from "@/interface/theme.interface";
import React from "react";
import type { Locale } from "@/i18n/dictionaries";
import { navItems } from "./sidebar-provider/route";
import SidebarLayout from "./sidebar-provider/sidebar";
import { ThemeProvider } from "./theme-provider/theme-provider";

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
	return (
		<ThemeProvider
			defaultThemeMode={defaultThemeMode}
			defaultColorScheme={defaultColorScheme}
			defaultLocale={defaultLocale}
			defaultSidebarState={defaultSidebarState}
			defaultSidebarVariant={defaultSidebarVariant}
			defaultSidebarSide={defaultSidebarSide}
		>
			<SidebarLayout navItems={navItems}>{children}</SidebarLayout>
		</ThemeProvider>
	);
};

export default RootProvider;
