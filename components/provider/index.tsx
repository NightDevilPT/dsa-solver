"use client";

import React from "react";

import { ThemeProvider } from "./theme-provider/theme-provider";
import SidebarLayout from "./sidebar-provider/sidebar";
import type {
	ColorScheme,
	SidebarSide,
	SidebarState,
	SidebarVariant,
	ThemeMode,
} from "@/interface/theme.interface";
import type { Locale } from "@/i18n/dictionaries";

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
			<SidebarLayout>{children}</SidebarLayout>
		</ThemeProvider>
	);
};

export default RootProvider;
