"use client";

import {
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { type NavItem } from "@/interface/navigation.interface";
import { useThemeContext } from "@/components/context/theme-context";

interface SidebarNavItemProps {
	item: NavItem;
}

export const SidebarNavItem = React.memo(function SidebarNavItem({
	item,
}: SidebarNavItemProps) {
	const pathname = usePathname();
	const { state } = useSidebar();
	const { locale } = useThemeContext();
	const isCollapsed = state === "collapsed";

	const buildPath = React.useCallback(
		(href: string) => {
			return `/${locale}${href}`;
		},
		[locale]
	);

	const fullPath = buildPath(item.href);
	const isActive = item.isActive ?? pathname === fullPath;
	const hasChildren = item.children && item.children.length > 0;
	const [isOpen, setIsOpen] = React.useState(isActive);

	React.useEffect(() => {
		if (isActive && hasChildren) {
			setIsOpen(true);
		}
	}, [isActive, hasChildren]);

	if (hasChildren) {
		if (isCollapsed) {
			return (
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								isActive={isActive}
								size="lg"
								className="w-full h-auto min-h-11 p-1 justify-center"
								tooltip={
									<div className="flex flex-col gap-0.5">
										<Label className="font-semibold">
											{item.label}
										</Label>
										{item.description && (
											<Label className="text-xs opacity-80">
												{item.description}
											</Label>
										)}
									</div>
								}
							>
								<item.icon className="h-6 w-6 shrink-0 text-sidebar-foreground/90" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							side="right"
							sideOffset={8}
							className="w-56"
						>
							{item.children?.map((child, index) => (
								<DropdownMenuItem
									key={index}
									asChild
									className={cn(
										"cursor-pointer",
										pathname === buildPath(child.href) &&
											"bg-accent"
									)}
								>
									<Link href={buildPath(child.href)}>
										{child.icon && (
											<child.icon className="h-4 w-4 shrink-0" />
										)}
										<div className="flex flex-col items-start gap-0.5 min-w-0 flex-1 overflow-hidden">
											<Label className="text-sm font-medium truncate leading-5">
												{child.label}
											</Label>
											{child.description && (
												<Label className="text-xs font-normal text-muted-foreground truncate leading-4">
													{child.description}
												</Label>
											)}
										</div>
									</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			);
		}

		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton
							isActive={isActive}
							size="lg"
							className="w-full h-auto min-h-11 px-3"
						>
							<item.icon className="h-6 w-6 shrink-0 text-sidebar-foreground/90" />
							<div className="flex flex-col items-start gap-0.5 min-w-0 flex-1 overflow-hidden text-left">
								<Label className="text-sm font-medium text-sidebar-foreground truncate leading-5">
									{item.label}
								</Label>
								{item.description && (
									<Label className="text-xs font-normal text-sidebar-foreground/50 truncate leading-4">
										{item.description}
									</Label>
								)}
							</div>
							<ChevronRight
								className={cn(
									"ml-2 h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40 transition-all duration-200 ease-in-out",
									isOpen &&
										"rotate-90 text-sidebar-foreground/60"
								)}
								strokeWidth={2.5}
							/>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.children?.map((child, index) => (
								<SidebarMenuSubItem key={index}>
									<SidebarMenuSubButton
										asChild
										isActive={
											pathname === buildPath(child.href)
										}
										size="md"
										className="h-auto min-h-10 px-3 py-2"
									>
										<Link
											href={buildPath(child.href)}
											className="flex items-center gap-3 w-full"
										>
											{child.icon && (
												<child.icon className="h-4 w-4 shrink-0 text-sidebar-foreground/90" />
											)}
											<div className="flex flex-col items-start gap-0.5 min-w-0 flex-1 overflow-hidden text-left">
												<Label className="text-sm font-medium text-sidebar-foreground truncate leading-5">
													{child.label}
												</Label>
												{child.description && (
													<Label className="text-xs font-normal text-sidebar-foreground/50 truncate leading-4">
														{child.description}
													</Label>
												)}
											</div>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		);
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				isActive={isActive}
				size="lg"
				className={cn(
					"w-full h-auto min-h-11",
					isCollapsed ? "p-1 justify-center" : "px-3"
				)}
				tooltip={
					isCollapsed
						? {
								children: (
									<div className="flex flex-col gap-0.5">
										<Label className="font-semibold">
											{item.label}
										</Label>
										{item.description && (
											<Label className="text-xs opacity-80">
												{item.description}
											</Label>
										)}
									</div>
								),
						  }
						: undefined
				}
			>
				<Link
					href={fullPath}
					className={cn(
						"flex items-center w-full",
						isCollapsed ? "justify-center" : "gap-3"
					)}
				>
					<item.icon className="h-6 w-6 shrink-0 text-sidebar-foreground/90" />
					{!isCollapsed && (
						<div className="flex flex-col items-start gap-0.5 min-w-0 flex-1 overflow-hidden text-left">
							<Label className="text-sm font-medium text-sidebar-foreground truncate leading-5">
								{item.label}
							</Label>
							{item.description && (
								<Label className="text-xs font-normal text-sidebar-foreground/50 truncate leading-4">
									{item.description}
								</Label>
							)}
						</div>
					)}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
});

SidebarNavItem.displayName = "SidebarNavItem";
