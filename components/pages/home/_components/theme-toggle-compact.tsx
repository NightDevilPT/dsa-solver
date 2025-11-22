"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemeMode } from "@/interface/theme.interface";
import { useThemeContext } from "@/components/context/theme-context";

export const ThemeToggleCompact = React.memo(function ThemeToggleCompact() {
	const { themeMode, setThemeMode, resolvedThemeMode } = useThemeContext();
	const { t } = useTranslation();

	const safeThemeMode = themeMode || "system";
	const isDark = resolvedThemeMode === "dark";

	const handleThemeChange = React.useCallback(
		(mode: ThemeMode) => {
			setThemeMode(mode);
		},
		[setThemeMode]
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 rounded-lg border border-border/50 hover:bg-accent hover:border-primary/50 transition-all duration-200"
				>
					<Sun
						className={cn(
							"h-4 w-4 transition-all duration-200",
							isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
						)}
					/>
					<Moon
						className={cn(
							"absolute h-4 w-4 transition-all duration-200",
							isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
						)}
					/>
					<span className="sr-only">{t("home.theme.toggle")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-36">
				<DropdownMenuItem
					onClick={() => handleThemeChange("light")}
					className="cursor-pointer"
				>
					<Sun className="h-4 w-4 mr-2" />
					<span>{t("settings.theme.light")}</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleThemeChange("dark")}
					className="cursor-pointer"
				>
					<Moon className="h-4 w-4 mr-2" />
					<span>{t("settings.theme.dark")}</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleThemeChange("system")}
					className="cursor-pointer"
				>
					<Monitor className="h-4 w-4 mr-2" />
					<span>{t("settings.theme.system")}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
});

ThemeToggleCompact.displayName = "ThemeToggleCompact";

