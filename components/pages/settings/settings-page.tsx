"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeChanger } from "./_components/theme-changer";
import { SidebarChanger } from "./_components/sidebar-changer";
import { SettingsSkeleton } from "./_components/settings-skeleton";
import { LanguageSelector } from "./_components/language-selector";
import { ColorPaletteSelector } from "./_components/color-palette-selector";

export function SettingsPage() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <SettingsSkeleton />;
	}

	return (
		<Card className="w-full bg-transparent p-0 border-0 shadow-none">
			<CardContent className="space-y-4 p-0">
				{/* Theme Mode Section */}
				<ThemeChanger />

				<Separator />

				{/* Language Section */}
				<LanguageSelector />

				<Separator />

				{/* Sidebar Configuration Section */}
				<SidebarChanger />

				<Separator />

				{/* Color Palette Section */}
				<ColorPaletteSelector showPreview={true} />
			</CardContent>
		</Card>
	);
}
