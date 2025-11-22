"use client";

import React from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeContext } from "@/components/context/theme-context";
import { Codesandbox, Github, Twitter, Linkedin, Mail } from "lucide-react";

export const HomeFooter = React.memo(function HomeFooter() {
	const { locale } = useThemeContext();
	const { t } = useTranslation();

	const buildPath = React.useCallback(
		(path: string) => {
			return `/${locale}${path}`;
		},
		[locale]
	);

	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{ icon: Github, href: "https://github.com", label: t("home.footer.social.github") },
		{ icon: Twitter, href: "https://twitter.com", label: t("home.footer.social.twitter") },
		{ icon: Linkedin, href: "https://linkedin.com", label: t("home.footer.social.linkedin") },
		{ icon: Mail, href: "mailto:support@dsasolver.com", label: t("home.footer.social.email") },
	];

	return (
		<footer className="w-full border-t bg-muted/30">
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="py-12 md:py-16">
					<div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
						{/* Brand Section */}
						<div className="flex flex-col items-center md:items-start text-center md:text-left">
							<Link
								href={buildPath("/")}
								className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
							>
								<div className="flex items-center justify-center shrink-0 rounded-lg bg-primary/10 text-primary border border-border/50 shadow-sm w-10 h-10">
									<Codesandbox
										className="h-5 w-5"
										strokeWidth={2}
									/>
								</div>
								<div className="flex flex-col gap-0.5">
									<Label className="text-base font-bold text-foreground leading-tight tracking-tight">
										{t("home.brand.name")}
									</Label>
									<Label className="text-xs font-medium text-muted-foreground leading-relaxed">
										{t("home.brand.tagline")}
									</Label>
								</div>
							</Link>
							<p className="text-sm text-muted-foreground mb-6 max-w-md">
								{t("home.footer.description")}
							</p>
						</div>

						{/* Social Links */}
						<div className="flex items-center gap-4">
							{socialLinks.map((social, index) => {
								const Icon = social.icon;
								return (
									<a
										key={index}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="w-10 h-10 rounded-lg border border-border/50 bg-background flex items-center justify-center hover:bg-accent hover:border-primary/50 transition-all duration-200 hover:scale-110"
										aria-label={social.label}
									>
										<Icon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
									</a>
								);
							})}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t py-6">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-sm text-muted-foreground text-center md:text-left">
							{t("home.footer.copyright").replace("{year}", currentYear.toString())}
						</p>
						<div className="flex items-center gap-6 text-sm text-muted-foreground">
							<Link
								href={buildPath("/terms")}
								className="hover:text-foreground transition-colors"
							>
								{t("home.footer.terms")}
							</Link>
							<Link
								href={buildPath("/privacy")}
								className="hover:text-foreground transition-colors"
							>
								{t("home.footer.privacy")}
							</Link>
							<Link
								href={buildPath("/cookies")}
								className="hover:text-foreground transition-colors"
							>
								{t("home.footer.cookies")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
});

HomeFooter.displayName = "HomeFooter";
