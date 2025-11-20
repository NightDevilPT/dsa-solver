"use client";

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useThemeContext } from "@/components/context/theme-context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggleCompact } from "@/components/pages/home/_components/theme-toggle-compact";

export const SidebarInsetHeader = React.memo(function SidebarInsetHeader() {
	const pathname = usePathname();
	const { locale } = useThemeContext();

	// Parse pathname and generate breadcrumbs
	const breadcrumbs = React.useMemo(() => {
		if (!pathname) return [];

		// Remove locale from pathname
		const segments = pathname.split("/").filter(Boolean);
		if (segments.length === 0) return [];

		// Remove locale (first segment)
		const routeSegments = segments.slice(1);

		if (routeSegments.length === 0) return [];

		// Capitalize first letter of each segment
		const formatSegment = (segment: string) => {
			return segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		};

		// Build breadcrumb items
		const items: Array<{
			label: string;
			href: string;
			isEllipsis?: boolean;
		}> = [];

		// If more than 2 segments, show: First / ... / Second Last / Last
		if (routeSegments.length > 2) {
			// Add first segment
			const firstSegment = routeSegments[0];
			items.push({
				label: formatSegment(firstSegment),
				href: `/${locale}/${firstSegment}`,
			});

			// Add ellipsis indicator (non-clickable)
			items.push({ label: "...", href: "", isEllipsis: true });

			// Add last 2 segments
			const lastTwo = routeSegments.slice(-2);
			lastTwo.forEach((segment, index) => {
				// Calculate the correct path for each segment
				const segmentIndex = routeSegments.length - 2 + index;
				const path = `/${locale}/${routeSegments
					.slice(0, segmentIndex + 1)
					.join("/")}`;
				items.push({
					label: formatSegment(segment),
					href: path,
				});
			});
		} else {
			// Show all segments (up to 2)
			routeSegments.forEach((segment, index) => {
				const path = `/${locale}/${routeSegments
					.slice(0, index + 1)
					.join("/")}`;
				items.push({
					label: formatSegment(segment),
					href: path,
				});
			});
		}

		return items;
	}, [pathname, locale]);

	return (
		<header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{/* Left Section: Sidebar Trigger + Breadcrumb */}
			<div className="flex items-center gap-3">
				<SidebarTrigger />
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((crumb, index) => {
							const isLast = index === breadcrumbs.length - 1;
							const isEllipsis =
								crumb.isEllipsis || crumb.label === "...";

							return (
								<React.Fragment key={index}>
									<BreadcrumbItem>
										{isEllipsis ? (
											<BreadcrumbEllipsis />
										) : isLast ? (
											<BreadcrumbPage>
												{crumb.label}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link href={crumb.href}>
													{crumb.label}
												</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Actions Section */}
			<div className="flex items-center gap-2">
				<ThemeToggleCompact />
				<LanguageSwitcher
					variant="outline"
					showFlag={true}
					showText={false}
					align="end"
				/>
			</div>
		</header>
	);
});

SidebarInsetHeader.displayName = "SidebarInsetHeader";
