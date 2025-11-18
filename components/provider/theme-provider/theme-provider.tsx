"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "@/interface/theme.interface";
import { ThemeContextProvider } from "@/components/context/theme-context";

export const ThemeProvider = ({
	children,
	defaultThemeMode,
	defaultColorScheme,
	defaultLocale,
	availableColorSchemes,
	defaultSidebarState,
	defaultSidebarVariant,
	defaultSidebarSide,
}: ThemeProviderProps) => (
	<NextThemesProvider
		attribute="class"
		enableSystem
		defaultTheme={defaultThemeMode ?? "system"}
		disableTransitionOnChange
	>
		<ThemeContextProvider
			defaultThemeMode={defaultThemeMode}
			defaultColorScheme={defaultColorScheme}
			defaultLocale={defaultLocale}
			availableColorSchemes={availableColorSchemes}
			defaultSidebarState={defaultSidebarState}
			defaultSidebarVariant={defaultSidebarVariant}
			defaultSidebarSide={defaultSidebarSide}
		>
			{children}
		</ThemeContextProvider>
	</NextThemesProvider>
);
