"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { Package } from "lucide-react";
import { Label } from "@/components/ui/label";

export interface EmptyStateProps {
	icon?: React.ReactNode;
	title?: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon,
	title = "No data available",
	description,
	action,
	className,
}: EmptyStateProps) {
	const defaultIcon = icon || (
		<Package className="size-12 text-muted-foreground" />
	);

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-16 px-4 text-center",
				className
			)}
		>
			<div className="flex items-center justify-center mb-4">
				{defaultIcon}
			</div>
			<Label className="text-lg font-semibold mb-2">{title}</Label>
			{description && (
				<Label className="text-sm text-muted-foreground max-w-md mb-4">
					{description}
				</Label>
			)}
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}
