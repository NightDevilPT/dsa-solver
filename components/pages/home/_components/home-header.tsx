"use client";

import React from "react";
import Link from "next/link";
import { Codesandbox } from "lucide-react";
import { Label } from "@/components/ui/label";
import { UserDropdown } from "./user-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemeToggleCompact } from "./theme-toggle-compact";
import { useThemeContext } from "@/components/context/theme-context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useUserSession } from "@/components/context/user-session-context";

export const HomeHeader = React.memo(function HomeHeader() {
	const { locale } = useThemeContext();
	const { t } = useTranslation();
	const { isAuthenticated, setShowLoginModal } = useUserSession();

	const buildPath = React.useCallback(
		(path: string) => {
			return `/${locale}${path}`;
		},
		[locale]
	);

	const handleLoginClick = React.useCallback(() => {
		setShowLoginModal(true);
	}, [setShowLoginModal]);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo Section */}
					<Link
						href={buildPath("/")}
						className="flex items-center gap-3 hover:opacity-80 transition-opacity"
					>
						<div className="flex items-center justify-center shrink-0 rounded-lg bg-primary/10 text-primary border border-border/50 shadow-sm w-10 h-10">
							<Codesandbox className="h-5 w-5" strokeWidth={2} />
						</div>
						<div className="flex flex-col gap-0.5">
							<Label className="text-base font-bold text-foreground leading-tight tracking-tight">
								{t("home.brand.name")}
							</Label>
							<Label className="text-xs font-medium text-muted-foreground leading-relaxed hidden sm:block">
								{t("home.brand.tagline")}
							</Label>
						</div>
					</Link>

					{/* Actions Section */}
					<div className="flex items-center gap-2">
						{isAuthenticated ? (
							<>
								{/* User Dropdown */}
								<UserDropdown />
								<Separator
									orientation="vertical"
									className="w-1"
								/>
								{/* Theme Toggle */}
								<ThemeToggleCompact />
								{/* Language Switcher */}
								<LanguageSwitcher
									variant="outline"
									showFlag={true}
									showText={false}
								/>
							</>
						) : (
							<>
								{/* Login Button - Opens Modal */}
								<Button
									variant="ghost"
									size="default"
									onClick={handleLoginClick}
									className="hidden sm:flex"
								>
									{t("home.header.login")}
								</Button>
								<Button
									size="default"
									onClick={handleLoginClick}
								>
									{t("home.header.signup")}
								</Button>
								<Separator
									orientation="vertical"
									className="w-1"
								/>
								{/* Theme Toggle */}
								<ThemeToggleCompact />
								{/* Language Switcher */}
								<LanguageSwitcher
									variant="outline"
									showFlag={true}
									showText={false}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
});

HomeHeader.displayName = "HomeHeader";
