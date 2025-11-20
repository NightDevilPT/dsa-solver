import { IconType } from "react-icons/lib";
import { type LucideIcon } from "lucide-react";

export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon | IconType;
	description?: string;
	children?: NavItem[];
	isActive?: boolean;
}

