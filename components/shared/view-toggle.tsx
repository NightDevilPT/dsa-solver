"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Grid3x3, Table as TableIcon } from "lucide-react";

export type ViewMode = "grid" | "table";

interface ViewToggleProps {
	view: ViewMode;
	onViewChange: (view: ViewMode) => void;
	className?: string;
}

export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 border rounded-md p-1",
				className
			)}
		>
			<Button
				variant={view === "grid" ? "default" : "ghost"}
				size="sm"
				onClick={() => onViewChange("grid")}
				className="gap-2"
			>
				<Grid3x3 className="size-4" />
				<Label>Grid</Label>
			</Button>
			<Button
				variant={view === "table" ? "default" : "ghost"}
				size="sm"
				onClick={() => onViewChange("table")}
				className="gap-2"
			>
				<TableIcon className="size-4" />
				<Label>Table</Label>
			</Button>
		</div>
	);
}
