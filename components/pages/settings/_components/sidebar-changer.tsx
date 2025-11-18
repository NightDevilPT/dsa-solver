"use client";

import { useCallback } from "react";
import { SidebarState, SidebarVariant } from "@/interface/theme.interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/context/theme-context";
import { useTranslation } from "@/hooks/useTranslation";
import {
	PanelLeftOpen,
	PanelLeftClose,
	Layout,
	LayoutPanelTop,
	LayoutList,
} from "lucide-react";

const SIDEBAR_VARIANT_OPTIONS: Array<{
	label: string;
	value: SidebarVariant;
	description: string;
	icon: typeof Layout;
}> = [
	{
		label: "Default Sidebar",
		value: "sidebar",
		description: "Standard sidebar layout",
		icon: Layout,
	},
	{
		label: "Floating",
		value: "floating",
		description: "Floating sidebar overlay",
		icon: LayoutPanelTop,
	},
	{
		label: "Inset",
		value: "inset",
		description: "Inset sidebar within content",
		icon: LayoutList,
	},
];

const SIDEBAR_STATE_OPTIONS: Array<{
	label: string;
	value: SidebarState;
	description: string;
	icon: typeof PanelLeftOpen;
}> = [
	{
		label: "Expanded",
		value: "expanded",
		description: "Sidebar is fully visible",
		icon: PanelLeftOpen,
	},
	{
		label: "Collapsed",
		value: "collapsed",
		description: "Sidebar is minimized",
		icon: PanelLeftClose,
	},
];

export function SidebarChanger() {
	const { dictionary } = useTranslation();
	const { sidebarVariant, setSidebarVariant, sidebarState, setSidebarState } =
		useThemeContext();

	const settings = (dictionary as any)?.settings;

	const handleSidebarVariantChange = useCallback(
		(value: string) => {
			if (value !== sidebarVariant) {
				setSidebarVariant(value as SidebarVariant);
			}
		},
		[sidebarVariant, setSidebarVariant]
	);

	const handleSidebarStateChange = useCallback(
		(value: string) => {
			if (value !== sidebarState) {
				setSidebarState(value as SidebarState);
			}
		},
		[sidebarState, setSidebarState]
	);

	const safeSidebarVariant = sidebarVariant || "sidebar";
	const safeSidebarState = sidebarState || "expanded";

	return (
		<>
			{/* Sidebar State Section */}
			<div className="space-y-4">
				<div>
					<h3 className="text-base font-semibold tracking-tight">
						{settings?.sidebar?.title || "Sidebar Display"}
					</h3>
					<p className="text-sm text-muted-foreground leading-relaxed">
						{settings?.sidebar?.description ||
							"Choose how you want the sidebar to appear."}
					</p>
				</div>
				<Card className="p-3 px-5 rounded-md border-border/50 ">
					<div className="grid grid-cols-[1fr_auto] items-center gap-4">
						<div>
							<h4 className="text-sm font-medium">
								{settings?.sidebar?.state?.label || "Sidebar State"}
							</h4>
							<p className="text-xs text-muted-foreground">
								{safeSidebarState === "expanded"
									? settings?.sidebar?.state?.expandedDescription ||
									  "Sidebar is fully visible"
									: settings?.sidebar?.state?.collapsedDescription ||
									  "Sidebar is minimized"}
							</p>
						</div>
						<div className="flex gap-1.5">
							{SIDEBAR_STATE_OPTIONS.map((option) => {
								const Icon = option.icon;
								const isSelected = safeSidebarState === option.value;
								return (
									<Button
										key={option.value}
										type="button"
										variant={isSelected ? "default" : "ghost"}
										size="icon"
										className={cn(
											"h-9 w-9 transition-all duration-200",
											isSelected && "shadow-sm"
										)}
										onClick={() => handleSidebarStateChange(option.value)}
										aria-pressed={isSelected}
										title={option.label}
									>
										<Icon className="h-4 w-4" />
									</Button>
								);
							})}
						</div>
					</div>
				</Card>
			</div>

			{/* Sidebar Variant Section */}
			<div className="space-y-4">
				<div>
					<h3 className="text-base font-semibold tracking-tight">
						{settings?.sidebar?.variant?.label || "Sidebar Variant"}
					</h3>
					<p className="text-sm text-muted-foreground leading-relaxed">
						{settings?.sidebar?.variant?.defaultDescription ||
							"Choose your preferred sidebar layout style."}
					</p>
				</div>
				<Card className="p-3 px-5 rounded-md border-border/50 ">
					<div className="grid grid-cols-[1fr_auto] items-center gap-4">
						<div>
							<h4 className="text-sm font-medium">Current Variant</h4>
							<p className="text-xs text-muted-foreground">
								{SIDEBAR_VARIANT_OPTIONS.find(
									(opt) => opt.value === safeSidebarVariant
								)?.description || "Standard sidebar layout"}
							</p>
						</div>
						<div className="flex gap-1.5">
							{SIDEBAR_VARIANT_OPTIONS.map((option) => {
								const Icon = option.icon;
								const isSelected = safeSidebarVariant === option.value;
								return (
									<Button
										key={option.value}
										type="button"
										variant={isSelected ? "default" : "ghost"}
										size="icon"
										className={cn(
											"h-9 w-9 transition-all duration-200",
											isSelected && "shadow-sm"
										)}
										onClick={() => handleSidebarVariantChange(option.value)}
										aria-pressed={isSelected}
										title={option.label}
									>
										<Icon className="h-4 w-4" />
									</Button>
								);
							})}
						</div>
					</div>
				</Card>
			</div>
		</>
	);
}
