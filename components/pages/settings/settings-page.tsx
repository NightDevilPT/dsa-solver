"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeChanger } from "./_components/theme-changer";
import { SidebarChanger } from "./_components/sidebar-changer";
import { ColorPaletteSelector } from "./_components/color-palette-selector";
import { LanguageSelector } from "./_components/language-selector";
import { SettingsSkeleton } from "./_components/settings-skeleton";

export function SettingsPage() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <SettingsSkeleton />;
	}

	return (
		<div className="container h-full overflow-y-auto mx-auto py-4">
			<Card className="w-full bg-transparent mx-auto pt-4 border-0 shadow-none">
				<CardContent className="space-y-4">
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
		</div>
	);
}
