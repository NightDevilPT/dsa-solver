"use client";

import { useCallback } from "react";
import { ThemeMode } from "@/interface/theme.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Moon, Sun } from "lucide-react";
import { useThemeContext } from "@/components/context/theme-context";
import { useTranslation } from "@/hooks/useTranslation";

const THEME_OPTIONS: Array<{ label: string; value: ThemeMode; icon: typeof Sun }> = [
	{ label: "Light", value: "light", icon: Sun },
	{ label: "Dark", value: "dark", icon: Moon },
	{ label: "System", value: "system", icon: Monitor },
];

export function ThemeChanger() {
	const { dictionary } = useTranslation();
	const { themeMode, setThemeMode } = useThemeContext();

	const settings = (dictionary as any)?.settings;

	const handleThemeModeChange = useCallback(
		(value: string) => {
			if (value !== themeMode) {
				setThemeMode(value as ThemeMode);
			}
		},
		[themeMode, setThemeMode]
	);

	const safeThemeMode = themeMode || "system";
	const currentOption = THEME_OPTIONS.find((opt) => opt.value === safeThemeMode);
	const CurrentIcon = currentOption?.icon || Monitor;

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-base font-medium">
					{settings?.theme?.title || "Theme Mode"}
				</h3>
				<p className="text-sm text-muted-foreground">
					{settings?.theme?.description ||
						"Choose your preferred theme style. Switch between light and dark theme to customize."}
				</p>
			</div>
			<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
				<div className="w-full h-auto grid grid-cols-1 gap-0 place-content-start place-items-start">
					<h3 className="text-sm font-medium">Theme</h3>
					<span className="text-xs text-muted-foreground">
						{settings?.theme?.description ||
							"Customize how the application looks on your device. Choose between light, dark, or system theme."}
					</span>
				</div>
				<div className="flex w-full justify-center items-center">
					<Select value={safeThemeMode} onValueChange={handleThemeModeChange}>
						<SelectTrigger className="w-[140px]">
							<div className="flex items-center gap-2">
								<SelectValue />
							</div>
						</SelectTrigger>
						<SelectContent>
							{THEME_OPTIONS.map((option) => {
								const Icon = option.icon;
								return (
									<SelectItem key={option.value} value={option.value}>
										<div className="flex items-center gap-2">
											<Icon className="h-4 w-4" />
											<span>{option.label}</span>
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			</Card>
		</div>
	);
}

