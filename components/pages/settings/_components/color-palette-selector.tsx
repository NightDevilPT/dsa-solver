"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useCallback, useMemo } from "react";
import { ColorScheme } from "@/interface/theme.interface";
import { useThemeContext } from "@/components/context/theme-context";
import { ColorScheme as ColorSchemeEnum } from "@/interface/theme.interface";

// All available color schemes
const ALL_COLOR_SCHEMES: ColorScheme[] = Object.values(ColorSchemeEnum);

// Color palette data structure
type ColorPaletteData = {
	name: string;
	scheme: ColorScheme;
	colors: {
		light: {
			primary: string;
			secondary: string;
			muted: string;
			chart1: string;
			chart2: string;
			chart3: string;
			chart4: string;
			chart5: string;
		};
		dark: {
			primary: string;
			secondary: string;
			muted: string;
			chart1: string;
			chart2: string;
			chart3: string;
			chart4: string;
			chart5: string;
		};
	};
};

// Color palettes with hard-coded values from globals.css
const COLOR_PALETTES: ColorPaletteData[] = [
	{
		name: "Default",
		scheme: ColorSchemeEnum.Default,
		colors: {
			light: {
				primary: "oklch(0.205 0 0)",
				secondary: "oklch(0.97 0 0)",
				muted: "oklch(0.97 0 0)",
				chart1: "oklch(0.646 0.222 41.116)",
				chart2: "oklch(0.6 0.118 184.704)",
				chart3: "oklch(0.398 0.07 227.392)",
				chart4: "oklch(0.828 0.189 84.429)",
				chart5: "oklch(0.769 0.188 70.08)",
			},
			dark: {
				primary: "oklch(0.922 0 0)",
				secondary: "oklch(0.269 0 0)",
				muted: "oklch(0.269 0 0)",
				chart1: "oklch(0.488 0.243 264.376)",
				chart2: "oklch(0.696 0.17 162.48)",
				chart3: "oklch(0.769 0.188 70.08)",
				chart4: "oklch(0.627 0.265 303.9)",
				chart5: "oklch(0.645 0.246 16.439)",
			},
		},
	},
	{
		name: "Blue",
		scheme: ColorSchemeEnum.Blue,
		colors: {
			light: {
				primary: "oklch(0.488 0.243 264.376)",
				secondary: "oklch(0.967 0.001 286.375)",
				muted: "oklch(0.967 0.001 286.375)",
				chart1: "oklch(0.809 0.105 251.813)",
				chart2: "oklch(0.623 0.214 259.815)",
				chart3: "oklch(0.546 0.245 262.881)",
				chart4: "oklch(0.488 0.243 264.376)",
				chart5: "oklch(0.424 0.199 265.638)",
			},
			dark: {
				primary: "oklch(0.488 0.243 264.376)",
				secondary: "oklch(0.274 0.006 286.033)",
				muted: "oklch(0.274 0.006 286.033)",
				chart1: "oklch(0.809 0.105 251.813)",
				chart2: "oklch(0.623 0.214 259.815)",
				chart3: "oklch(0.546 0.245 262.881)",
				chart4: "oklch(0.488 0.243 264.376)",
				chart5: "oklch(0.424 0.199 265.638)",
			},
		},
	},
	{
		name: "Green",
		scheme: ColorSchemeEnum.Green,
		colors: {
			light: {
				primary: "oklch(0.648 0.2 131.684)",
				secondary: "oklch(0.967 0.001 286.375)",
				muted: "oklch(0.967 0.001 286.375)",
				chart1: "oklch(0.871 0.15 154.449)",
				chart2: "oklch(0.723 0.219 149.579)",
				chart3: "oklch(0.627 0.194 149.214)",
				chart4: "oklch(0.527 0.154 150.069)",
				chart5: "oklch(0.448 0.119 151.328)",
			},
			dark: {
				primary: "oklch(0.648 0.2 131.684)",
				secondary: "oklch(0.274 0.006 286.033)",
				muted: "oklch(0.274 0.006 286.033)",
				chart1: "oklch(0.871 0.15 154.449)",
				chart2: "oklch(0.723 0.219 149.579)",
				chart3: "oklch(0.627 0.194 149.214)",
				chart4: "oklch(0.527 0.154 150.069)",
				chart5: "oklch(0.448 0.119 151.328)",
			},
		},
	},
	{
		name: "Orange",
		scheme: ColorSchemeEnum.Orange,
		colors: {
			light: {
				primary: "oklch(0.646 0.222 41.116)",
				secondary: "oklch(0.967 0.001 286.375)",
				muted: "oklch(0.967 0.001 286.375)",
				chart1: "oklch(0.837 0.128 66.29)",
				chart2: "oklch(0.705 0.213 47.604)",
				chart3: "oklch(0.646 0.222 41.116)",
				chart4: "oklch(0.553 0.195 38.402)",
				chart5: "oklch(0.47 0.157 37.304)",
			},
			dark: {
				primary: "oklch(0.705 0.213 47.604)",
				secondary: "oklch(0.274 0.006 286.033)",
				muted: "oklch(0.274 0.006 286.033)",
				chart1: "oklch(0.837 0.128 66.29)",
				chart2: "oklch(0.705 0.213 47.604)",
				chart3: "oklch(0.646 0.222 41.116)",
				chart4: "oklch(0.553 0.195 38.402)",
				chart5: "oklch(0.47 0.157 37.304)",
			},
		},
	},
	{
		name: "Red",
		scheme: ColorSchemeEnum.Red,
		colors: {
			light: {
				primary: "oklch(0.577 0.245 27.325)",
				secondary: "oklch(0.967 0.001 286.375)",
				muted: "oklch(0.967 0.001 286.375)",
				chart1: "oklch(0.808 0.114 19.571)",
				chart2: "oklch(0.637 0.237 25.331)",
				chart3: "oklch(0.577 0.245 27.325)",
				chart4: "oklch(0.505 0.213 27.518)",
				chart5: "oklch(0.444 0.177 26.899)",
			},
			dark: {
				primary: "oklch(0.637 0.237 25.331)",
				secondary: "oklch(0.274 0.006 286.033)",
				muted: "oklch(0.274 0.006 286.033)",
				chart1: "oklch(0.808 0.114 19.571)",
				chart2: "oklch(0.637 0.237 25.331)",
				chart3: "oklch(0.577 0.245 27.325)",
				chart4: "oklch(0.505 0.213 27.518)",
				chart5: "oklch(0.444 0.177 26.899)",
			},
		},
	},
	{
		name: "Rose",
		scheme: ColorSchemeEnum.Rose,
		colors: {
			light: {
				primary: "oklch(0.586 0.253 17.585)",
				secondary: "oklch(0.967 0.001 286.375)",
				muted: "oklch(0.967 0.001 286.375)",
				chart1: "oklch(0.81 0.117 11.638)",
				chart2: "oklch(0.645 0.246 16.439)",
				chart3: "oklch(0.586 0.253 17.585)",
				chart4: "oklch(0.514 0.222 16.935)",
				chart5: "oklch(0.455 0.188 13.697)",
			},
			dark: {
				primary: "oklch(0.645 0.246 16.439)",
				secondary: "oklch(0.274 0.006 286.033)",
				muted: "oklch(0.274 0.006 286.033)",
				chart1: "oklch(0.81 0.117 11.638)",
				chart2: "oklch(0.645 0.246 16.439)",
				chart3: "oklch(0.586 0.253 17.585)",
				chart4: "oklch(0.514 0.222 16.935)",
				chart5: "oklch(0.455 0.188 13.697)",
			},
		},
	},
	{
		name: "Violet",
		scheme: ColorSchemeEnum.Violet,
		colors: {
			light: {
				primary: "oklch(0.541 0.281 293.009)",
				secondary: "oklch(0.967 0.001 286.375)",
				muted: "oklch(0.967 0.001 286.375)",
				chart1: "oklch(0.811 0.111 293.571)",
				chart2: "oklch(0.606 0.25 292.717)",
				chart3: "oklch(0.541 0.281 293.009)",
				chart4: "oklch(0.491 0.27 292.581)",
				chart5: "oklch(0.432 0.232 292.759)",
			},
			dark: {
				primary: "oklch(0.606 0.25 292.717)",
				secondary: "oklch(0.274 0.006 286.033)",
				muted: "oklch(0.274 0.006 286.033)",
				chart1: "oklch(0.811 0.111 293.571)",
				chart2: "oklch(0.606 0.25 292.717)",
				chart3: "oklch(0.541 0.281 293.009)",
				chart4: "oklch(0.491 0.27 292.581)",
				chart5: "oklch(0.432 0.232 292.759)",
			},
		},
	},
	{
		name: "Yellow",
		scheme: ColorSchemeEnum.Yellow,
		colors: {
			light: {
				primary: "oklch(0.852 0.199 91.936)",
				secondary: "oklch(0.967 0.001 286.375)",
				muted: "oklch(0.967 0.001 286.375)",
				chart1: "oklch(0.905 0.182 98.111)",
				chart2: "oklch(0.795 0.184 86.047)",
				chart3: "oklch(0.681 0.162 75.834)",
				chart4: "oklch(0.554 0.135 66.442)",
				chart5: "oklch(0.476 0.114 61.907)",
			},
			dark: {
				primary: "oklch(0.795 0.184 86.047)",
				secondary: "oklch(0.274 0.006 286.033)",
				muted: "oklch(0.274 0.006 286.033)",
				chart1: "oklch(0.905 0.182 98.111)",
				chart2: "oklch(0.795 0.184 86.047)",
				chart3: "oklch(0.681 0.162 75.834)",
				chart4: "oklch(0.554 0.135 66.442)",
				chart5: "oklch(0.476 0.114 61.907)",
			},
		},
	},
];

// Color Palette Card Component
type ColorPaletteCardProps = {
	palette: ColorPaletteData;
	isSelected: boolean;
	onSelect: () => void;
};

type ColorPaletteCardPropsWithColors = ColorPaletteCardProps & {
	resolvedTheme: string | undefined;
};

function ColorPaletteCard({
	palette,
	isSelected,
	onSelect,
	resolvedTheme,
}: ColorPaletteCardPropsWithColors) {
	// Get colors based on theme (light or dark)
	const themeColors =
		resolvedTheme === "dark" ? palette.colors.dark : palette.colors.light;

	// Create conic gradient for donut chart (8 sections, 45 degrees each)
	// Start from top (0deg) and go clockwise
	// Add small gray borders between sections (0.5deg each)
	// Order: primary, secondary, muted, chart1, chart2, chart3, chart4, chart5
	const pieGradient = `conic-gradient(
		${themeColors.primary} 0deg 44.5deg,
		#9ca3af 44.5deg 45.5deg,
		${themeColors.secondary} 45.5deg 89.5deg,
		#9ca3af 89.5deg 90.5deg,
		${themeColors.muted} 90.5deg 134.5deg,
		#9ca3af 134.5deg 135.5deg,
		${themeColors.chart1} 135.5deg 179.5deg,
		#9ca3af 179.5deg 180.5deg,
		${themeColors.chart2} 180.5deg 224.5deg,
		#9ca3af 224.5deg 225.5deg,
		${themeColors.chart3} 225.5deg 269.5deg,
		#9ca3af 269.5deg 270.5deg,
		${themeColors.chart4} 270.5deg 314.5deg,
		#9ca3af 314.5deg 315.5deg,
		${themeColors.chart5} 315.5deg 359.5deg,
		#9ca3af 359.5deg 360deg
	)`;

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"group relative flex flex-col items-center gap-3 p-4 rounded-lg border transition-all duration-200 ease-out",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				isSelected
					? "border-primary bg-primary/5 shadow-md"
					: "border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card hover:shadow-sm"
			)}
			aria-pressed={isSelected}
			aria-label={`Select ${palette.name} color scheme`}
		>
			{/* Donut Chart Circle */}
			<div className="relative">
				<div
					className={cn(
						"w-20 h-20 rounded-full transition-all duration-200 relative overflow-hidden",
						"group-hover:scale-110",
						isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
					)}
					style={{
						background: pieGradient,
						maskImage: `radial-gradient(circle, transparent 40%, black 40%)`,
						WebkitMaskImage: `radial-gradient(circle, transparent 40%, black 40%)`,
					}}
				/>

				{/* Double Checkmark Overlay - centered in donut hole */}
				{isSelected && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
							<CheckCheck
								className="h-3.5 w-3.5"
								strokeWidth={3}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Palette Name */}
			<span
				className={cn(
					"text-sm font-semibold tracking-tight transition-colors duration-200",
					isSelected
						? "text-primary"
						: "text-foreground group-hover:text-foreground/90"
				)}
			>
				{palette.name}
			</span>
		</button>
	);
}

type ColorPaletteSelectorProps = {
	showPreview?: boolean;
};

export function ColorPaletteSelector({
	showPreview = false,
}: ColorPaletteSelectorProps) {
	const { dictionary } = useTranslation();
	const { colorScheme, setColorScheme, availableColorSchemes } =
		useThemeContext();
	const { resolvedTheme } = useTheme();

	const settings = (dictionary as any)?.settings;

	// Get selected palette colors for preview
	const selectedPalette = useMemo(
		() =>
			COLOR_PALETTES.find((p) => p.scheme === colorScheme) ||
			COLOR_PALETTES[0],
		[colorScheme]
	);

	const previewColors =
		resolvedTheme === "dark"
			? selectedPalette.colors.dark
			: selectedPalette.colors.light;

	// Use all color schemes if availableColorSchemes is not provided or empty
	const colorSchemesToShow = useMemo(
		() =>
			availableColorSchemes.length > 0
				? availableColorSchemes
				: ALL_COLOR_SCHEMES,
		[availableColorSchemes]
	);

	// Filter palettes based on available color schemes
	const colorPalettes = useMemo(
		() =>
			COLOR_PALETTES.filter((palette) =>
				colorSchemesToShow.includes(palette.scheme)
			),
		[colorSchemesToShow]
	);

	const handleColorSchemeChange = useCallback(
		(scheme: ColorScheme) => {
			if (scheme !== colorScheme) {
				setColorScheme(scheme);
			}
		},
		[colorScheme, setColorScheme]
	);

	const safeColorScheme = colorScheme || colorSchemesToShow[0] || "default";

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="space-y-2">
				<h3 className="text-lg font-semibold tracking-tight text-foreground">
					{settings?.colorPalette?.title || "Color Palette"}
				</h3>
				<p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
					{settings?.colorPalette?.description ||
						"Select a color scheme that defines the primary, secondary, and accent colors used throughout the application interface."}
				</p>
			</div>

			{/* Palette Grid */}
			<Card className="border-border/50 bg-card/50 p-6 shadow-sm">
				<div className="grid grid-cols-8 max-2xl:grid-cols-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4">
					{colorPalettes.map((palette) => (
						<ColorPaletteCard
							key={palette.scheme}
							palette={palette}
							isSelected={safeColorScheme === palette.scheme}
							onSelect={() =>
								handleColorSchemeChange(palette.scheme)
							}
							resolvedTheme={resolvedTheme}
						/>
					))}
				</div>
			</Card>
		</div>
	);
}
