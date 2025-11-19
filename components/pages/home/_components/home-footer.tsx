"use client";

import React from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeContext } from "@/components/context/theme-context";
import { Codesandbox, Github, Twitter, Linkedin, Mail } from "lucide-react";

export const HomeFooter = React.memo(function HomeFooter() {
	const { locale } = useThemeContext();
	const { dictionary } = useTranslation();
	const home = (dictionary as any)?.home;

	const buildPath = React.useCallback(
		(path: string) => {
			return `/${locale}${path}`;
		},
		[locale]
	);

	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{ icon: Github, href: "https://github.com", label: "GitHub" },
		{ icon: Twitter, href: "https://twitter.com", label: "Twitter" },
		{ icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
		{ icon: Mail, href: "mailto:support@dsasolver.com", label: "Email" },
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
										DSA Solver
									</Label>
									<Label className="text-xs font-medium text-muted-foreground leading-relaxed">
										Data Structures & Algorithms
									</Label>
								</div>
							</Link>
							<p className="text-sm text-muted-foreground mb-6 max-w-md">
								{typeof home?.footer?.description === "string"
									? home.footer.description
									: "Master Data Structures & Algorithms with AI-powered solutions and automated problem solving."}
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
							© {currentYear} DSA Solver.{" "}
							{typeof home?.footer?.rights === "string"
								? home.footer.rights
								: "All rights reserved."}
						</p>
						<div className="flex items-center gap-6 text-sm text-muted-foreground">
							<Link
								href={buildPath("/terms")}
								className="hover:text-foreground transition-colors"
							>
								{typeof home?.footer?.terms === "string"
									? home.footer.terms
									: "Terms"}
							</Link>
							<Link
								href={buildPath("/privacy")}
								className="hover:text-foreground transition-colors"
							>
								{typeof home?.footer?.privacy === "string"
									? home.footer.privacy
									: "Privacy"}
							</Link>
							<Link
								href={buildPath("/cookies")}
								className="hover:text-foreground transition-colors"
							>
								{typeof home?.footer?.cookies === "string"
									? home.footer.cookies
									: "Cookies"}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
});

HomeFooter.displayName = "HomeFooter";
