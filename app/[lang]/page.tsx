"use client";

import { useMemo, useCallback } from "react";

import {
	ColorScheme,
	SidebarSide,
	SidebarState,
	SidebarVariant,
	ThemeMode,
} from "@/interface/theme.interface";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeContext } from "@/components/context/theme-context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

const THEME_OPTIONS: Array<{ label: string; value: ThemeMode }> = [
	{ label: "System", value: "system" },
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
];

const SIDEBAR_VARIANT_OPTIONS: Array<{ label: string; value: SidebarVariant }> =
	[
		{ label: "Default Sidebar", value: "sidebar" },
		{ label: "Floating", value: "floating" },
		{ label: "Inset", value: "inset" },
	];

const SIDEBAR_STATE_OPTIONS: Array<{ label: string; value: SidebarState }> = [
	{ label: "Collapsed", value: "collapsed" },
	{ label: "Expanded", value: "expanded" },
];

export default function Home() {
	const { dictionary } = useTranslation();
	const {
		themeMode,
		setThemeMode,
		colorScheme,
		setColorScheme,
		availableColorSchemes,
		sidebarVariant,
		setSidebarVariant,
		sidebarState,
		setSidebarState
	} = useThemeContext();

	const colorSchemeOptions = useMemo(
		() =>
			availableColorSchemes.map((scheme) => ({
				label: scheme.charAt(0).toUpperCase() + scheme.slice(1),
				value: scheme,
			})),
		[availableColorSchemes]
	);

	// Memoize change handlers to prevent infinite loops
	const handleThemeModeChange = useCallback(
		(value: string) => {
			if (value !== themeMode) {
				setThemeMode(value as ThemeMode);
			}
		},
		[themeMode, setThemeMode]
	);

	const handleColorSchemeChange = useCallback(
		(value: string) => {
			if (value !== colorScheme) {
				setColorScheme(value as ColorScheme);
			}
		},
		[colorScheme, setColorScheme]
	);

	const handleSidebarVariantChange = useCallback(
		(value: string) => {
			if (value !== sidebarVariant) {
				setSidebarVariant(value as SidebarVariant);
			}
		},
		[sidebarVariant, setSidebarVariant]
	);

	const handleSidebarStateChange = useCallback(
		(value: string) => {
			if (value !== sidebarState) {
				setSidebarState(value as SidebarState);
			}
		},
		[sidebarState, setSidebarState]
	);

	// Ensure values are always valid strings (not undefined)
	const safeThemeMode = themeMode || "system";
	const safeColorScheme = colorScheme || availableColorSchemes[0] || "default";
	const safeSidebarVariant = sidebarVariant || "sidebar";
	const safeSidebarState = sidebarState || "expanded";

	return (
		<div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-8 py-10 px-5">
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold">Interface Playground</h1>
				<p className="text-sm text-muted-foreground">
					Experiment with theme, color scheme, sidebar configuration,
					and language.
				</p>
			</header>

			<Button>Hello</Button>

			<section className="grid gap-6 rounded-xl border bg-card p-6 shadow-sm lg:grid-cols-2">
				<div className="space-y-10">
					<div className="space-y-4">
						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">
								Theme Mode
							</p>
							<Select
								value={safeThemeMode}
								onValueChange={handleThemeModeChange}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select theme mode" />
								</SelectTrigger>
								<SelectContent>
									{THEME_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">
								Color Scheme
							</p>
							<Select
								value={safeColorScheme}
								onValueChange={handleColorSchemeChange}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select color scheme" />
								</SelectTrigger>
								<SelectContent>
									{colorSchemeOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">
								Sidebar Variant
							</p>
							<Select
								value={safeSidebarVariant}
								onValueChange={handleSidebarVariantChange}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select sidebar variant" />
								</SelectTrigger>
								<SelectContent>
									{SIDEBAR_VARIANT_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">
								Sidebar State
							</p>
							<Select
								value={safeSidebarState}
								onValueChange={handleSidebarStateChange}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select sidebar state" />
								</SelectTrigger>
								<SelectContent>
									{SIDEBAR_STATE_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-between space-y-6">
					<div className="space-y-4">
						<p className="text-sm font-medium text-foreground">
							Language
						</p>
						<LanguageSwitcher className="w-full sm:w-auto" />
					</div>

					<div className="space-y-3 rounded-lg border bg-background p-4">
						<p className="text-sm font-medium text-foreground">
							Translated welcome message:
						</p>
						<p className="text-lg font-semibold">
							{dictionary?.welcome ?? "—"}
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
